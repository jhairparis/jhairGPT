"use client";
import { useCallback, useState, useRef } from "react";
import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
  RemoveBlockItem,
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  BasicTextStyleButton,
  BlockTypeSelect,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  UnnestBlockButton,
  DragHandleMenu,
} from "@blocknote/react";
import { filterSuggestionItems, locales } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuControllerCustom } from "./SuggestionMenuControllerCustom";
import type { BlockNoteEditor, SuggestionMenuState } from "@blocknote/core";
import type { KeyboardEvent } from "react";
import { RemoveBlockButton } from "./remove-button";
import { useTheme } from "next-themes";
import "@blocknote/mantine/style.css";
import { Button } from "@/components/ui/button";
import { chatting, initializeChat } from "../../utils/service-chat";
import { useChatContext } from "../../providers/chat";
import { useRouter } from "next/navigation";
import Send from "./send";

const noImplement = ["Audio", "Video", "Image", "File"];

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor).filter(
    (menuItem) => !noImplement.includes(menuItem.title)
  ),
];

const TextInput = ({ chatId }: any) => {
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
  });
  const { resolvedTheme } = useTheme();
  const [show, setShow] = useState(false);
  const { chat, setChat } = useChatContext();
  const router = useRouter();
  const sendRef = useRef<any>(null);

  const handleUpdate = useCallback((state: SuggestionMenuState) => {
    setShow(state.show);
  }, []);

  async function startChat() {
    setChat({
      ...chat,
      currentChat: { history: [], chatQuestions: [], historyInfo: [] },
    });

    const markdown = await editor.blocksToMarkdownLossy(editor.document);

    const res = await initializeChat(markdown, "gemini-1.5-flash");

    return router.push(`/c/${res.chatId}`);
  }

  async function sendMessage() {
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    console.debug(markdown);

    const { answer, questions } = await chatting(
      markdown,
      chatId,
      "gemini-1.5-flash"
    );

    const newHistory = [
      ...(chat.currentChat.history || []),
      { role: "user", content: [{ type: "text", text: markdown }] },
      { role: "assistant", content: [answer] },
    ];

    const chatQuestions = [
      ...(chat.currentChat.chatQuestions || []),
      questions,
    ];

    editor.removeBlocks([...editor.document.map((block) => block.id)]);

    setChat({
      ...chat,
      currentChat: { ...chat.currentChat, history: newHistory, chatQuestions },
    });
  }

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
  const handleSend = () => {
    sendRef.current?.play();
    if (!chatId) {
      startChat();
      return;
    }
    sendMessage();
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
    <div className="min-h-[74px] max-h-[265px] bg-white dark:bg-[#1f1f1f] border border-b-0 border-gray-500 p-6 overflow-hidden rounded-t-xl">
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
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
          onUpdate={handleUpdate}
          show={show}
        />
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key={"blockTypeSelect"} />

              <FileCaptionButton key={"fileCaptionButton"} />
              <FileReplaceButton key={"replaceFileButton"} />

              <BasicTextStyleButton
                basicTextStyle={"bold"}
                key={"boldStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"italic"}
                key={"italicStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"underline"}
                key={"underlineStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"strike"}
                key={"strikeStyleButton"}
              />

              <BasicTextStyleButton
                key={"codeStyleButton"}
                basicTextStyle={"code"}
              />

              <NestBlockButton key={"nestBlockButton"} />
              <UnnestBlockButton key={"unnestBlockButton"} />

              <CreateLinkButton key={"createLinkButton"} />
            </FormattingToolbar>
          )}
        />
        <SideMenuController
          sideMenu={(props) => (
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
          )}
        />
      </BlockNoteView>

      <Send ref={sendRef} onClick={handleSend} />
    </div>
  );
};

export default TextInput;
