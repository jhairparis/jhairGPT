import {
  DragHandleButton,
  SideMenu,
  RemoveBlockItem,
  DragHandleMenu,
  SideMenuProps,
} from "@blocknote/react";
import { RemoveBlockButton } from "../remove-button";
import { FC } from "react";

const SideMenuCustom: FC<SideMenuProps<any> & { attached: any }> = (props) => {
  return (
    <SideMenu {...props}>
      <RemoveBlockButton {...props} />
      <DragHandleButton
        {...props}
        dragHandleMenu={(props) => (
          <DragHandleMenu {...props}>
            <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
          </DragHandleMenu>
        )}
      />
    </SideMenu>
  );
};

export default SideMenuCustom;
