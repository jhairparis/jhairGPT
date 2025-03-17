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
   * Improved function to get the correct cursor offset inside a code block
   * with special handling for just-typed content
   */
  function getCodeBlockCaretOffset(blockId: string): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    
    // Find the block element
    const blockElement = document.querySelector(`[data-id="${blockId}"]`);
    if (!blockElement) return 0;

    // Try to find the most specific code container possible
    const codeContainers = [
      blockElement.querySelector("pre > code"),
      blockElement.querySelector(".bn-code-block"),
      blockElement.querySelector(".bn-inline-content"),
      blockElement.querySelector("code"),
      blockElement.querySelector(".bn-block-content"),
      blockElement.querySelector("[contenteditable=true]"),
    ].filter(Boolean);

    // Use the first valid container found
    const codeContainer = codeContainers[0];
    if (!codeContainer) return 0;

    // Get the full text content
    const fullText = codeContainer.textContent || "";
    
    // When typing, we often need to handle the specific case where the cursor is at the end
    // Check if selection is at the end of the container's text
    const editorCursor = editor.getTextCursorPosition() as any;
    const codeText = editorCursor?.block?.content?.[0]?.text || "";
    
    // SPECIAL CASE: Check if the cursor is at the end of the last text node
    // This specifically helps after typing at the end of a code block
    if (range.collapsed) {
      // Check if we're at the end of a text node
      if (range.startContainer.nodeType === Node.TEXT_NODE &&
          range.startOffset === range.startContainer.textContent?.length) {
            
        // Check if this is the last text node or close to it
        const lastTextNodes = [];
        const walker = document.createTreeWalker(
          codeContainer, 
          NodeFilter.SHOW_TEXT, 
          null
        );
        
        let node;
        while (node = walker.nextNode()) {
          lastTextNodes.push(node);
          // Keep only last 3 nodes for efficiency
          if (lastTextNodes.length > 3) {
            lastTextNodes.shift();
          }
        }
        
        // If our node is one of the last text nodes, return end of text
        if (lastTextNodes.includes(range.startContainer)) {
          return codeText.length;
        }
      }
    }
    
    // Method 1: Direct calculation with TreeWalker
    let treeWalkerOffset = 0;
    let foundCursorInTreeWalk = false;
    
    try {
      const walker = document.createTreeWalker(
        codeContainer,
        NodeFilter.SHOW_TEXT,
        null
      );

      let currentNode = walker.nextNode();
      while (currentNode) {
        // Check if this is the node where the cursor is
        if (currentNode === range.startContainer) {
          treeWalkerOffset += range.startOffset;
          foundCursorInTreeWalk = true;
          break;
        } 
        
        // Otherwise add this node's length to the offset
        treeWalkerOffset += currentNode.textContent?.length || 0;
        currentNode = walker.nextNode();
      }
    } catch (e) {
      console.error("Error in TreeWalker calculation:", e);
    }

    // Method 2: Direct cursor position from editor
    const cursor = editor.getTextCursorPosition() as any;
    const editorReportedOffset = cursor?.offset || 0;
    
    // Method 3: Calculation based on selected text and DOM structure
    let contextBasedOffset = 0;
    try {
      // Get actual block content from the editor's data model
      const blockContent = cursor?.block?.content?.[0]?.text || "";
      
      // If the selection is at the boundary of an element
      if (range.collapsed && blockContent) {
        // Get the text node and its parent element
        const textNode = range.startContainer;
        const textContent = textNode.textContent || "";
        
        // If we're in a text node, we can get a more precise position
        if (textNode.nodeType === Node.TEXT_NODE) {
          const nearbyText = textContent.substring(
            Math.max(0, range.startOffset - 10),
            Math.min(textContent.length, range.startOffset + 10)
          );
          
          // Find this nearby text in the full content
          if (nearbyText && blockContent.includes(nearbyText)) {
            // Find all occurrences of this text
            let searchIndex = 0;
            let foundIndex;
            let occurrences = [];
            
            while ((foundIndex = blockContent.indexOf(nearbyText, searchIndex)) !== -1) {
              occurrences.push(foundIndex);
              searchIndex = foundIndex + 1;
            }
            
            if (occurrences.length === 1) {
              // Simple case - only one match
              const matchPosition = occurrences[0];
              const localOffset = range.startOffset - Math.max(0, range.startOffset - 10);
              contextBasedOffset = matchPosition + localOffset;
            } else if (occurrences.length > 1) {
              // Multiple matches - try to find the best one based on context
              // For now, just use the first occurrence
              contextBasedOffset = occurrences[0] + 
                (range.startOffset - Math.max(0, range.startOffset - 10));
            }
          }
        }
      }
    } catch (e) {
      console.error("Error in context-based calculation:", e);
    }

    // Choose the most reliable offset based on available information
    let finalOffset = 0;
    
    if (foundCursorInTreeWalk && treeWalkerOffset <= fullText.length) {
      // The tree walker method is usually the most reliable
      finalOffset = treeWalkerOffset;
    } else if (contextBasedOffset > 0) {
      // Context-based calculation is the next best option
      finalOffset = contextBasedOffset;
    } else {
      // Fall back to editor-reported offset
      finalOffset = editorReportedOffset;
    }

    // CRITICAL: si el computedOffset resulta 0 y hay texto,
    // comprobamos si el cursor realmente está al inicio.
    if (treeWalkerOffset === 0 && codeText.length > 0) {
      if (selection.rangeCount > 0) {
        const r = selection.getRangeAt(0);
        // Si el startOffset es distinto de 0, significa que no está al inicio
        if (r.startOffset !== 0) {
          return codeText.length;
        }
      }
    }

    // Safety check
    return Math.min(finalOffset, fullText.length);
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

  /**
   * Gets the absolute cursor offset position within any block type
   * Provides a uniform way to get cursor position across all block types
   */
  function getAbsoluteCursorOffset(blockId: string): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);

    // Find the block element
    const blockElement = document.querySelector(`[data-id="${blockId}"]`);
    if (!blockElement) {
      return 0;
    }

    // Find the content container
    const contentContainer = 
      blockElement.querySelector(".bn-block-content") ||
      blockElement.querySelector("[contenteditable=true]");

    if (!contentContainer) return 0;

    // Calculate the real offset by traversing all text nodes
    let offset = 0;
    const walker = document.createTreeWalker(
      contentContainer,
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

    // If we don't find the specific node, try to estimate position
    if (!currentNode) {
      const allText = Array.from(contentContainer.querySelectorAll("*"))
        .map((el) => el.textContent || "")
        .join("");

      const textBefore =
        selection.anchorNode?.textContent?.substring(
          0,
          selection.anchorOffset
        ) || "";
      offset = allText.indexOf(textBefore) + textBefore.length;
    }

    return offset;
  }

  const handleInsertNewLine = async () => {
    const cursor = editor.getTextCursorPosition() as any;
    const currentBlock = cursor.block;
    
    // Special handling for code blocks
    if (currentBlock.type === "codeBlock") {
      try {
        // Get code text from the block's content
        const codeText = currentBlock.content[0]?.text || "";
        
        // Get cursor position with our improved method
        let computedOffset = getCodeBlockCaretOffset(currentBlock.id);
        
        // Critical fix: If offset still appears to be 0 but text exists,
        // and we suspect cursor is at the end, force it to end of text
        if (computedOffset === 0 && codeText.length > 0) {
          // We're handling the case where detection isn't working properly after typing
          // Get selection info to verify we're likely at the end
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            // If the selection is collapsed (just a cursor) we might be at the end
            if (range.collapsed) {
              computedOffset = codeText.length;
            }
          }
        }
        
        // Si computedOffset es 0 pero el cursor está realmente al inicio (startOffset===0) se mantiene; de lo contrario se forza a final
        if (computedOffset === 0 && codeText.length > 0) {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const r = sel.getRangeAt(0);
            if (r.startOffset !== 0) {
              computedOffset = codeText.length;
            }
          }
        }

        // Create a small delay to let any DOM updates finish
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          activeElement.blur();
        }

        // Now insert the newline at the correct position
        const updatedCode = 
          codeText.substring(0, computedOffset) + 
          "\n" + 
          codeText.substring(computedOffset);
        
        // Update the block with the new content
        editor.updateBlock(currentBlock.id, {
          content: [{
            type: "text",
            text: updatedCode,
            styles: {}
          }]
        });
        
        // Position cursor after the newline with multiple attempts for robustness
        const newPosition = computedOffset + 1;
        
        // Use multiple positioning attempts with increasing timeouts
        [20, 50, 100].forEach(delay => {
          setTimeout(() => {
            setCursorPositionInCodeBlock(currentBlock.id, newPosition);
          }, delay);
        });
        
        return;
      } catch (e) {
        console.error("Error handling code block newline:", e);
      }
    }

    // For non-code blocks, use the unified approach
    let computedOffset = getAbsoluteCursorOffset(currentBlock.id);
    
    // From here, handle other block types
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
