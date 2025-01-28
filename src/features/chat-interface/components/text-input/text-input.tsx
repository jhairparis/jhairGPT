"use client";
import { useCallback, useState, useRef } from "react";
import { SideMenuController, useCreateBlockNote } from "@blocknote/react";
import { locales } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuControllerCustom } from "./custom/SuggestionMenuController";
import type { SuggestionMenuState } from "@blocknote/core";
import type { KeyboardEvent } from "react";
import { useTheme } from "next-themes";
import "@blocknote/mantine/style.css";
import Send from "./send";
import FormattingToolbarControllerCustom from "./custom/FormattingToolbarController";
import useChat from "../../hooks/useChat";
import { usePathname } from "next/navigation";
import SideMenuCustom from "./custom/SideMenu";
import uploadFile from "../../utils/uploadFiles";

type Attached = {
  file: File;
  id: string;
  url: string;
};

const TextInput = () => {
  const locale = locales.en;
  const [attached, setAttached] = useState<Attached[]>([]);

  const Fake = async (file: File, blockId?: string) =>
    new Promise<Record<string, any>>((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const newUrl = e.target?.result as string;
        const unique_id = crypto.randomUUID();

        setAttached((prev) => [...prev, { file, id: unique_id, url: newUrl }]);

        resolve({
          props: {
            name: unique_id,
            url: newUrl,
            textAlignment: "center",
          },
        });
      };
      reader.readAsDataURL(file);
    });

  const editor = useCreateBlockNote({
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        default: "Tell me what you want most?",
        heading: "Title",
      },
    },
    uploadFile: Fake,
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
    sendRef.current?.play();
    let markdown = await editor.blocksToMarkdownLossy(editor.document);
    const clearEditorBlocks = () =>
      editor.removeBlocks([...editor.document.map((block) => block.id)]);

    if (attached.length > 0) {
      const res = await Promise.all(
        attached.map((attachment) =>
          uploadFile(
            attachment.file,
            `${attachment.id}.${attachment.file.name.split(".").pop()}`,
            chatId
          )
        )
      );

      for (let i = 0; i < attached.length; i++) {
        const newUrl = res[i];
        const file = attached[i];

        markdown = markdown.replace(file.url, newUrl);
      }

      // setAttached([]);
      // clearEditorBlocks();
    }

    console.log(markdown);

    if (!chatId) {
      // createChat.mutate(
      //   { message: markdown },
      //   {
      //     onSuccess: clearEditorBlocks,
      //   }
      // );
      return;
    }

    // updateChat.mutate(
    //   { message: markdown },
    //   {
    //     onSuccess: clearEditorBlocks,
    //   }
    // );
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

  const deleteAttached = useCallback(({ props }: any) => {
    setAttached((prev) => prev.filter((element) => element.id !== props.name));
  }, []);

  const SideMenuWrapper = (props: any) => {
    return <SideMenuCustom {...props} attached={deleteAttached} />;
  };

  return (
    <div className="min-h-[79px] max-h-[265px] bg-white dark:bg-[#1f1f1f] border border-b-0 border-gray-500 p-4 pb-2 px-0 sm:p-6 overflow-scroll rounded-t-xl relative">
      <BlockNoteView
        editor={editor}
        sideMenu={false}
        slashMenu={false}
        formattingToolbar={false}
        onKeyDownCapture={shortcuts}
        theme={resolvedTheme === "system" ? "light" : (resolvedTheme as any)}
        className="flex-1"
      >
        <SuggestionMenuControllerCustom
          triggerCharacter={"/"}
          onUpdate={handleUpdate}
          show={show}
        />
        <FormattingToolbarControllerCustom />
        <SideMenuController sideMenu={SideMenuWrapper} />
      </BlockNoteView>

      <Send ref={sendRef} onClick={handleSend} />
    </div>
  );
};

export default TextInput;
