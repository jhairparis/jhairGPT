import {
  SideMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
} from "@blocknote/react";
import { MdDelete } from "react-icons/md";

export function RemoveBlockButton(props: SideMenuProps & { attached: any }) {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;

  return (
    <Components.SideMenu.Button
      label="Remove block"
      icon={
        <MdDelete
          size={24}
          onClick={() => {
            props.attached(props.block)
            editor.removeBlocks([props.block]);
          }}
        />
      }
    />
  );
}
