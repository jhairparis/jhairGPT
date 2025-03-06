"use client";
import { useCallback, useState, useRef } from "react";
import { SideMenuController, useCreateBlockNote } from "@blocknote/react";
import { locales } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuControllerCustom } from "./custom/suggestion-menu-controller";
import type { SuggestionMenuState } from "@blocknote/core";
import type { KeyboardEvent } from "react";
import { useTheme } from "next-themes";
import "@blocknote/mantine/style.css";
import Send from "./send";
import FormattingToolbarControllerCustom from "./custom/formatting-toolbar-controller";
import useChat from "../../hooks/use-chat";
import { usePathname } from "next/navigation";
import SideMenuCustom from "./custom/side-menu";
import uploadFile from "../../utils/uploadFiles";
import { splitMarkdown } from "../../utils/general";

export type MarkdownItem = {
  type: string;
  text: string;
  image?: string;
};

const TextInput = () => {
  const locale = locales.en;

  const editor = useCreateBlockNote({
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        default: "Tell me what you want most?",
        heading: "Title",
      },
    },
    uploadFile: async (file: File, blockId?: string) => {
      sendRef.current?.play();

      const unique = crypto.randomUUID();
      const url = await uploadFile(
        file,
        `${unique}.${file.name.split(".").pop()}`
      );

      return {
        props: {
          url: url,
          name: unique,
        },
      };
    },
  });

  const { updateChat, createChat } = useChat();
  const [show, setShow] = useState(false);
  const { resolvedTheme } = useTheme();
  const sendRef = useRef<any>(null);
  const pathname = usePathname();

  const chatId = pathname.split("/").pop() as string;

  const handleUpdate = useCallback((state: SuggestionMenuState) => {
    setShow(state.show);
  }, []);

  async function handleNewLine() {
    const blocks = editor.document;
    blocks.pop();
    const last = blocks.pop()?.id || "";
    const id = crypto.randomUUID();

    try {
      editor.insertBlocks(
        [{ id, content: "", type: "paragraph" }],
        last,
        "after"
      );
      editor.setTextCursorPosition(id, "start");
    } catch (error) {
      console.debug("Empty block");
    }
  }

  async function manageTextInsertion() {
    const position = editor.getTextCursorPosition().block;

    try {
      if (
        position.type === "checkListItem" ||
        position.type === "bulletListItem" ||
        position.type === "numberedListItem"
      ) {
        const newId = crypto.randomUUID();

        editor.insertBlocks(
          [{ id: newId, type: position.type, content: "" }],
          position.id,
          "after"
        );
        editor.setTextCursorPosition(newId, "end");
        return;
      }

      const history: any = [...(position.content as any)];
      let last = { text: "" };
      if (history.length !== 0) {
        last = history.pop();
        last.text += "\n";
      }

      editor.updateBlock(position.id, { content: [...history, last] });
      editor.setTextCursorPosition(position.id, "end");
    } catch (error) {
      console.debug("Empty block", error);
    }
  }

  const handleSend = async () => {
    const { markdown, countImgLinks } = splitMarkdown(
      await editor.blocksToMarkdownLossy(editor.document)
    ) as {
      markdown: MarkdownItem[];
      countImgLinks: number;
    };

    const clearEditorBlocks = () =>
      editor.removeBlocks([...editor.document.map((block) => block.id)]);

    console.log("ready to send", markdown);

    if (!chatId) {
      createChat.mutate(
        { message: markdown },
        {
          onSuccess: clearEditorBlocks,
        }
      );
    } else {
      updateChat.mutate(
        { message: markdown },
        {
          onSuccess: clearEditorBlocks,
        }
      );
    }
  };

  const shortcuts = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!event.shiftKey && !event.ctrlKey && !show) {
        handleSend();
      } else if (event.shiftKey) {
        handleNewLine();
      } else if (event.ctrlKey) {
        manageTextInsertion();
      }
    }
  };

  return (
    <div className="min-h-[79px] max-h-[265px] bg-white dark:bg-[#1f1f1f] border border-b-0 border-gray-500 p-4 pb-2 px-0 sm:p-6 overflow-scroll rounded-t-xl relative">
      <BlockNoteView
        editor={editor}
        sideMenu={false}
        slashMenu={false}
        formattingToolbar={false}
        onKeyDownCapture={shortcuts}
        theme={
          resolvedTheme === "light" || resolvedTheme === "dark"
            ? resolvedTheme
            : "light"
        }
        className="flex-1"
      >
        <SuggestionMenuControllerCustom
          triggerCharacter={"/"}
          onUpdate={handleUpdate}
          show={show}
        />
        <FormattingToolbarControllerCustom />
        <SideMenuController sideMenu={SideMenuCustom} />
      </BlockNoteView>

      <Send ref={sendRef} onClick={handleSend} />
    </div>
  );
};

export default TextInput;
