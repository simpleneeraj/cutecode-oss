import { Chip } from "@cutecode/ui/tactile/chip";
import { Tone } from "@cutecode/ui/tactile/tone";
import { Window } from "@cutecode/ui/tactile/window";
import { DocumentTextIcon } from "@solar-icons/react/bold-duotone/document-text";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";

import { FeatureList } from "@/components/home/feature-list";
import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";

import { agentCode, agentPoints, llmsText } from "./constants";
import { agentTeaserStyles } from "./style";

const section = homeSectionStyles();
const styles = agentTeaserStyles();

function AgentWindow() {
  return (
    <Window title="Agent">
      <div className={styles.chat()}>
        <p className={styles.bubble()}>Add a folder that shows three recent photos.</p>
        <div className={styles.reply()}>
          <p className={styles.tool()}>
            <CheckCircleIcon aria-hidden="true" className={styles.toolIcon()} />
            <span>
              Found <span className={styles.toolName()}>Folder</span> in CuteUI
            </span>
          </p>
          <p className={styles.tool()}>
            <CheckCircleIcon aria-hidden="true" className={styles.toolIcon()} />
            <code className={styles.toolCode()}>npx shadcn@latest add @cutecode/folder</code>
          </p>
          <pre className={styles.code()}>{agentCode}</pre>
        </div>
      </div>
    </Window>
  );
}

export function AgentTeaser() {
  return (
    <section className={section.root()} id="ai">
      <div className={section.feature()}>
        <div className={styles.copy()}>
          <SectionHeading
            eyebrow={<Chip tone={Tone.Gray}>Coming soon</Chip>}
            lead="An MCP server and an llms.txt file, so your editor can find the right part, read its props and add it for you."
            title="Your AI editor will know every part."
          >
            <FeatureList points={agentPoints} />
          </SectionHeading>
        </div>
        <div aria-label="Preview of an AI editor adding a CuteUI folder" className={styles.mock()} role="img">
          <AgentWindow />
          <div className={styles.llms()}>
            <div className={styles.llmsHead()}>
              <span className={styles.llmsName()}>
                <DocumentTextIcon aria-hidden="true" className={styles.llmsIcon()} />
                cutecode.app/llms.txt
              </span>
              <Chip tone={Tone.Gray}>Soon</Chip>
            </div>
            <pre className={styles.code()}>{llmsText}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
