import { CfnOutput, CfnParameter, SecretValue, Stack, type StackProps } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as rum from "aws-cdk-lib/aws-rum";
import type { Construct } from "constructs";

const PREFIX = "cool-snippets";
const SECRETS_PATH = "/cool-snippets/";
const RUM_APP_MONITOR = `${PREFIX}-web`;

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const serviceRoleArn = this.requiredContext("serviceRoleArn");
    const domain = this.requiredContext("domain");
    const sesFromEmail = this.requiredContext("sesFromEmail");

    const computeRole = this.computeRole(sesFromEmail);
    this.buildSecretsPolicy(serviceRoleArn);
    this.billingCron(domain);
    const monitor = this.rumAppMonitor(domain);

    new CfnOutput(this, "ComputeRoleArn", { value: computeRole.roleArn });
    new CfnOutput(this, "RumAppMonitorId", { value: monitor.appMonitor.attrId });
    new CfnOutput(this, "RumIdentityPoolId", { value: monitor.identityPoolId });
    new CfnOutput(this, "RumRegion", { value: this.region });
  }

  private requiredContext(key: string): string {
    const value: unknown = this.node.tryGetContext(key);
    if (typeof value !== "string" || value === "") throw new Error(`Missing CDK context "${key}" (use -c ${key}=...)`);
    return value;
  }

  private secretsStatement(): iam.PolicyStatement {
    return new iam.PolicyStatement({
      actions: ["ssm:GetParametersByPath", "ssm:GetParameters", "ssm:GetParameter"],
      resources: [
        this.formatArn({ service: "ssm", resource: "parameter", resourceName: SECRETS_PATH.slice(1, -1) }),
        this.formatArn({ service: "ssm", resource: "parameter", resourceName: `${SECRETS_PATH.slice(1)}*` }),
      ],
    });
  }

  private computeRole(sesFromEmail: string): iam.Role {
    const role = new iam.Role(this, "ComputeRole", {
      roleName: `${PREFIX}-amplify-compute`,
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
    });
    role.addToPolicy(this.secretsStatement());
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: [this.formatArn({ service: "ses", resource: "identity", resourceName: "*" })],
        conditions: { StringEquals: { "ses:FromAddress": sesFromEmail } },
      }),
    );
    return role;
  }

  private buildSecretsPolicy(serviceRoleArn: string): void {
    new iam.ManagedPolicy(this, "BuildSecretsPolicy", {
      managedPolicyName: `${PREFIX}-build-secrets`,
      roles: [iam.Role.fromRoleArn(this, "ServiceRole", serviceRoleArn, { mutable: true })],
      statements: [this.secretsStatement()],
    });
  }

  private billingCron(domain: string): void {
    const authorization = new CfnParameter(this, "CronAuthorizationHeader", {
      type: "String",
      noEcho: true,
      description: "The full Authorization header value: Bearer <CRON_SECRET>",
    });
    const connection = new events.Connection(this, "BillingCronConnection", {
      connectionName: `${PREFIX}-billing-cron`,
      authorization: events.Authorization.apiKey("Authorization", SecretValue.cfnParameter(authorization)),
    });
    const destination = new events.ApiDestination(this, "BillingCronDestination", {
      apiDestinationName: `${PREFIX}-billing-cron`,
      connection,
      endpoint: `https://${domain}/api/cron/billing`,
      httpMethod: events.HttpMethod.GET,
    });
    new events.Rule(this, "BillingCronRule", {
      ruleName: `${PREFIX}-billing-cron`,
      schedule: events.Schedule.cron({ minute: "0", hour: "3" }),
      targets: [new targets.ApiDestination(destination, { retryAttempts: 2 })],
    });
  }

  private rumAppMonitor(domain: string): { appMonitor: rum.CfnAppMonitor; identityPoolId: string } {
    const identityPool = new cognito.CfnIdentityPool(this, "RumIdentityPool", {
      identityPoolName: `${PREFIX}-rum`,
      allowUnauthenticatedIdentities: true,
    });
    const guestRole = new iam.Role(this, "RumGuestRole", {
      roleName: `${PREFIX}-rum-guest`,
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: { "cognito-identity.amazonaws.com:aud": identityPool.ref },
          "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
    });
    guestRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["rum:PutRumEvents"],
        resources: [this.formatArn({ service: "rum", resource: "appmonitor", resourceName: RUM_APP_MONITOR })],
      }),
    );
    new cognito.CfnIdentityPoolRoleAttachment(this, "RumIdentityPoolRoles", {
      identityPoolId: identityPool.ref,
      roles: { unauthenticated: guestRole.roleArn },
    });
    const appMonitor = new rum.CfnAppMonitor(this, "RumAppMonitor", {
      name: RUM_APP_MONITOR,
      domainList: [domain, `www.${domain}`],
      cwLogEnabled: true,
      customEvents: { status: "ENABLED" },
      appMonitorConfiguration: {
        identityPoolId: identityPool.ref,
        sessionSampleRate: 1,
        telemetries: ["errors", "performance", "http"],
        allowCookies: false,
        enableXRay: false,
      },
    });
    return { appMonitor, identityPoolId: identityPool.ref };
  }
}
