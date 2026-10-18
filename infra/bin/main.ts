import { App } from "aws-cdk-lib";
import { MainStack } from "../lib/main-stack";

const app = new App();

new MainStack(app, "CoolSnippetsMain", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" },
});
