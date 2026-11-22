import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { ComboboxInput } from "@cutecode/ui/components/combobox";
import { dockSearch } from "./dock-styles";

const styles = dockSearch();

export default function DockSearch({ placeholder }: { placeholder: string }) {
  return (
    <div className={styles.root()}>
      <ComboboxInput
        type="search"
        placeholder={placeholder}
        showTrigger={false}
        startAddon={<MagnifierIcon className={styles.icon()} aria-hidden="true" />}
      />
    </div>
  );
}
