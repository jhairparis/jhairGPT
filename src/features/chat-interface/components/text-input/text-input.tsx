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
import { toast } from "sonner";

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

  const splitNodes = (nodes: any[], offset: number) => {
    let before: any[] = [];
    let after: any[] = [];
    let acc = 0;
    for (const node of nodes) {
      const nodeText = node.text || "";
      const nodeLength = nodeText.length;
      if (offset >= acc + nodeLength) {
        before.push(node);
        acc += nodeLength;
      } else if (offset <= acc) {
        after.push(node);
      } else {
        const pos = offset - acc;
        const beforeNode = { ...node, text: nodeText.substring(0, pos) };
        const afterNode = { ...node, text: nodeText.substring(pos) };
        if (beforeNode.text) before.push(beforeNode);
        if (afterNode.text) after.push(afterNode);
        acc += nodeLength;
      }
    }
    return { before, after };
  };

  const isEmptyContent = (rawContent: any): boolean => {
    if (Array.isArray(rawContent)) {
      return (
        rawContent.length === 0 ||
        (rawContent.length === 1 &&
          (!rawContent[0].text || rawContent[0].text.trim() === ""))
      );
    }
    return !rawContent || rawContent.trim() === "";
  };

  /**
   * Calculates the line and column from a text and an offset.
   * @param text Full text of the block (e.g., from a codeBlock)
   * @param offset Caret position (index in the string)
   * @returns Object with line and column number (both starting at 1)
   */
  function getCaretLineAndColumn(
    text: string,
    offset: number
  ): { line: number; column: number } {
    const beforeCaret = text.slice(0, offset);
    const lines = beforeCaret.split("\n");
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    };
  }

  /**
   * Function to get the correct offset inside a code block
   */
  function getCodeBlockCaretOffset(blockId: string): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);

    // First, we try to find the code block element using different selectors
    const blockElement = document.querySelector(`[data-id="${blockId}"]`);
    if (!blockElement) {
      return 0;
    }

    // Find the specific code containers
    const codeContainer =
      blockElement.querySelector(".bn-inline-content") ||
      blockElement.querySelector("code") ||
      blockElement.querySelector(".bn-block-content");

    if (!codeContainer) return 0;

    // We calculate the real offset by traversing all text nodes
    // within the code block until we reach the node where the caret is
    let offset = 0;
    const walker = document.createTreeWalker(
      codeContainer,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode === range.startContainer) {
        offset += range.startOffset;
        break;
      } else {
        offset += currentNode.textContent?.length || 0;
      }
      currentNode = walker.nextNode();
    }

    // If we don't find the specific node, the caret might be in a child element
    // We try to get the offset from the full content
    if (!currentNode) {
      const allText = Array.from(codeContainer.querySelectorAll("*"))
        .map((el) => el.textContent || "")
        .join("");

      // Estimation based on relative position
      const textBefore =
        selection.anchorNode?.textContent?.substring(
          0,
          selection.anchorOffset
        ) || "";
      offset = allText.indexOf(textBefore) + textBefore.length;
    }

    return offset;
  }

  /**
   * Function to position the caret at a specific position inside a code block
   */
  function setCursorPositionInCodeBlock(blockId: string, targetOffset: number) {
    // We need a longer timeout to ensure BlockNote has finished its updates
    // and also to prevent flickering with multiple caret position updates

    // First, we prevent the cursor from jumping to the start by setting a "caret placeholder"
    const blockElement = document.querySelector(`[data-id="${blockId}"]`);
    if (blockElement) {
      // This helps keep the focus on the element during the update
      const focusableElement = blockElement.querySelector(
        "[contenteditable=true]"
      );
      if (focusableElement instanceof HTMLElement) {
        focusableElement.focus();
      }
    }

    // We use two timers: a quick one for an initial approximation, and a slower one to ensure the final position
    setTimeout(() => {
      positionCaret(blockId, targetOffset);

      // Second pass to ensure the position is correct
      setTimeout(() => {
        positionCaret(blockId, targetOffset);
      }, 100);
    }, 10);

    function positionCaret(blockId: string, targetOffset: number) {
      const blockElement = document.querySelector(`[data-id="${blockId}"]`);
      if (!blockElement) return;

      // Find the appropriate code container
      const codeContainer =
        blockElement.querySelector(".bn-inline-content") ||
        blockElement.querySelector("code") ||
        blockElement.querySelector(".bn-block-content");

      if (!codeContainer) return;

      // We use TreeWalker to find the text node and the appropriate position
      let currentOffset = 0;
      let foundNode: Text | null = null;
      let nodeOffset = 0;

      const walker = document.createTreeWalker(
        codeContainer,
        NodeFilter.SHOW_TEXT,
        null
      );

      let textNode = walker.nextNode() as Text;
      while (textNode) {
        const nodeLength = textNode.textContent?.length || 0;
        if (currentOffset + nodeLength >= targetOffset) {
          foundNode = textNode;
          nodeOffset = targetOffset - currentOffset;
          break;
        }
        currentOffset += nodeLength;
        textNode = walker.nextNode() as Text;
      }

      // If we find the appropriate node, we create a selection at that point
      if (foundNode) {
        const range = document.createRange();
        const selection = window.getSelection();

        try {
          range.setStart(foundNode, nodeOffset);
          range.collapse(true);

          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);

            // Important: make the element have focus
            const focusableElement = blockElement.querySelector(
              "[contenteditable=true]"
            );
            if (focusableElement instanceof HTMLElement) {
              focusableElement.focus();

              // Ensure the cursor is visible in the view
              const rect = range.getBoundingClientRect();
              if (rect) {
                focusableElement.scrollIntoView({ block: "nearest" });
              }
            }
          }
        } catch (e) {
          console.error("Error positioning cursor:", e);
        }
      }
    }
  }

  const handleInsertNewLine = async () => {
    const cursor = editor.getTextCursorPosition() as any;
    const currentBlock = cursor.block;
    let computedOffset = cursor.offset ?? 0;

    // If it's a code block, we need to calculate the offset differently
    if (currentBlock.type === "codeBlock") {
      // Use the new function to get the offset
      computedOffset = getCodeBlockCaretOffset(currentBlock.id);

      // Get the caret position (line and column)
      const codeText = currentBlock.content[0]?.text || "";
      const position = getCaretLineAndColumn(codeText, computedOffset);

      // For code blocks, insert a newline at the caret position
      if (codeText) {
        // Prevent BlockNote from taking control of the cursor by temporarily disabling focus
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          activeElement.blur();
        }

        const updatedCode =
          codeText.substring(0, computedOffset) +
          "\n" +
          codeText.substring(computedOffset);

        editor.updateBlock(currentBlock.id, {
          content: [
            {
              type: "text",
              text: updatedCode,
              styles: {},
            },
          ],
        });

        // Position the cursor after the inserted newline
        const newPosition = computedOffset + 1; // +1 to place it after the newline
        setCursorPositionInCodeBlock(currentBlock.id, newPosition);

        return;
      }
    }

    // From here, restore the original code for other block types
    let selection = window.getSelection();
    if (selection && typeof selection.focusOffset === "number") {
      computedOffset = selection.focusOffset;
    }
    computedOffset = computedOffset || (cursor.offset ?? 0);

    const rawContent = currentBlock.content;
    const newId = crypto.randomUUID();

    if (currentBlock.type === "table") return;

    // Special logic for list items
    if (
      currentBlock.type === "checkListItem" ||
      currentBlock.type === "bulletListItem" ||
      currentBlock.type === "numberedListItem"
    ) {
      // SPECIAL CASE: If the cursor is at the beginning of the list block (offset = 0)
      if (computedOffset === 0) {
        // If the block is empty, convert it to a paragraph
        if (isEmptyContent(rawContent)) {
          editor.updateBlock(currentBlock.id, { type: "paragraph" });
          editor.setTextCursorPosition(currentBlock.id, "start");
          return;
        }
        // If the block has content, insert a new block before
        else {
          editor.insertBlocks(
            [{ id: newId, type: currentBlock.type, content: "" }],
            currentBlock.id,
            "before"
          );
          editor.setTextCursorPosition(newId, "start");
          return;
        }
      }

      // For the rest of the cases (cursor is not at the beginning)
      if (Array.isArray(rawContent)) {
        const { before, after } = splitNodes(rawContent, computedOffset);
        editor.updateBlock(currentBlock.id, { content: before });
        editor.insertBlocks(
          [{ id: newId, type: currentBlock.type, content: after }],
          currentBlock.id,
          "after"
        );
      } else {
        const text = typeof rawContent === "string" ? rawContent : "";
        const beforeText = text.substring(0, computedOffset);
        const afterText = text.substring(computedOffset);
        editor.updateBlock(currentBlock.id, { content: beforeText });
        editor.insertBlocks(
          [{ id: newId, type: currentBlock.type, content: afterText }],
          currentBlock.id,
          "after"
        );
      }
      editor.setTextCursorPosition(newId, "start");
      return;
    }

    // For other types, we divide into 2 blocks
    // It is forced to "paragraph" if the current block is "heading"
    const allowedTypes = ["heading", "paragraph"];
    const newBlockType =
      currentBlock.type === "heading"
        ? "paragraph"
        : allowedTypes.includes(currentBlock.type)
        ? currentBlock.type
        : "paragraph";

    // SPECIAL CASE: If the cursor is at the beginning of the block (offset = 0)
    if (computedOffset === 0) {
      // Only insert a new block if the current block has content
      if (!isEmptyContent(rawContent)) {
        // Insert an empty block BEFORE the current one, keeping all the content in the current block
        editor.insertBlocks(
          [{ id: newId, type: newBlockType, content: "" }],
          currentBlock.id,
          "before"
        );
        editor.setTextCursorPosition(newId, "start");
        return;
      }
    }

    // Rest of cases - divide the block in two
    if (Array.isArray(rawContent)) {
      const totalLength = rawContent.reduce(
        (sum, node) => sum + (node.text?.length || 0),
        0
      );
      const { before, after } = splitNodes(rawContent, computedOffset);
      if (computedOffset > 0 && computedOffset < totalLength) {
        editor.updateBlock(currentBlock.id, { content: before });
        editor.insertBlocks(
          [{ id: newId, type: newBlockType, content: after }],
          currentBlock.id,
          "after"
        );
      } else {
        editor.insertBlocks(
          [{ id: newId, type: newBlockType, content: [] }],
          currentBlock.id,
          "after"
        );
      }
    } else {
      const text = typeof rawContent === "string" ? rawContent : "";
      const beforeText = text.substring(0, computedOffset);
      const afterText = text.substring(computedOffset);
      if (computedOffset > 0 && computedOffset < text.length) {
        editor.updateBlock(currentBlock.id, { content: beforeText });
        editor.insertBlocks(
          [{ id: newId, type: newBlockType, content: afterText }],
          currentBlock.id,
          "after"
        );
      } else {
        editor.insertBlocks(
          [{ id: newId, type: newBlockType, content: "" }],
          currentBlock.id,
          "after"
        );
      }
    }

    if (currentBlock.type !== "codeBlock")
      editor.setTextCursorPosition(newId, "start");
  };

  const handleSend = async () => {
    const { markdown, countImgLinks } = splitMarkdown(
      await editor.blocksToMarkdownLossy(editor.document)
    ) as {
      markdown: MarkdownItem[];
      countImgLinks: number;
    };

    const clearEditorBlocks = () =>
      editor.removeBlocks([...editor.document.map((block) => block.id)]);

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
      // Shift+Enter or Ctrl+Enter: insert combined new line
      if (event.shiftKey || event.ctrlKey) {
        event.preventDefault();
        handleInsertNewLine();
        return;
      }
      // Plain Enter when the suggestion menu is not visible: send message
      if (!event.shiftKey && !event.ctrlKey && !event.altKey && !show) {
        event.preventDefault();
        handleSend();
        return;
      }
    }
  };

  return (
    <div className="min-h-[79px] max-h-[265px] bg-white dark:bg-[#1f1f1f] border border-b-0 border-gray-500 p-4 pb-2 px-0 sm:p-6 overflow-scroll rounded-t-xl">
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
