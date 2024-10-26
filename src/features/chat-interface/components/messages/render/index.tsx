"use client";
import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

const Render = ({ content }: { content: string }) => {
  const editor = useCreateBlockNote();
  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(content);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return <BlockNoteView editor={editor} editable={false} />;
};

export default Render;
