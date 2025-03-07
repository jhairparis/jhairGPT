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

  // Función auxiliar para dividir arreglo de nodos de texto
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

  // Función auxiliar para verificar contenido vacío (aplica tanto para cadenas o arreglos de nodos)
  const isEmptyContent = (rawContent: any): boolean => {
    // Si es un arreglo: se considera vacío si no hay nodos o si solo hay un nodo vacío
    if (Array.isArray(rawContent)) {
      return (
        rawContent.length === 0 ||
        (rawContent.length === 1 &&
          (!rawContent[0].text || rawContent[0].text.trim() === ""))
      );
    }
    // Si es string, se considera vacío si es una cadena vacía o solo espacios
    return !rawContent || rawContent.trim() === "";
  };

  const handleInsertNewLine = async () => {
    let computedOffset = 0;
    const selection = window.getSelection();
    if (selection && typeof selection.focusOffset === "number") {
      computedOffset = selection.focusOffset;
    }
    const cursor = editor.getTextCursorPosition() as any;
    computedOffset = computedOffset || (cursor.offset ?? 0);

    const currentBlock = cursor.block;
    const rawContent = currentBlock.content;
    const newId = crypto.randomUUID();

    if (currentBlock.type === "table") return;

    // Caso especial: elementos de lista
    if (
      currentBlock.type === "checkListItem" ||
      currentBlock.type === "bulletListItem" ||
      currentBlock.type === "numberedListItem"
    ) {
      // Si el contenido del bloque es vacío, se convierte el bloque a "paragraph"
      if (isEmptyContent(rawContent)) {
        editor.updateBlock(currentBlock.id, { type: "paragraph" });
        editor.setTextCursorPosition(currentBlock.id, "start");
        return;
      }
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

    // Para otros tipos, dividimos en 2 bloques
    // Se fuerza a "paragraph" si el bloque actual es "heading"
    const allowedTypes = ["heading", "paragraph"];
    const newBlockType =
      currentBlock.type === "heading"
        ? "paragraph"
        : allowedTypes.includes(currentBlock.type)
        ? currentBlock.type
        : "paragraph";

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
    editor.setTextCursorPosition(newId, "start");
  };

  const handleSend = async () => {
    const { markdown, countImgLinks } = splitMarkdown(
      await editor.blocksToMarkdownLossy(editor.document)
    ) as {
      markdown: MarkdownItem[];
      countImgLinks: number;
    };

    toast.warning("This feature is not available yet");
    console.log(markdown, countImgLinks);
    return;

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
      // Shift+Enter o Ctrl+Enter: insertar nueva línea combinada
      if (event.shiftKey || event.ctrlKey) {
        event.preventDefault();
        toast.warning("Inserción de nueva línea");
        handleInsertNewLine();
        return;
      }
      // Plain Enter cuando el menú de sugerencias no está visible: enviar mensaje
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
