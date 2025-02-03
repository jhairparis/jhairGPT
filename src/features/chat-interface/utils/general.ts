export function process(
  items: {
    type: string;
    text: string;
  }[]
) {
  const texts = [];
  for (const item of items) {
    if (item.type === "text" || item.type === "image") {
      texts.push(item.text);
    }
  }
  return texts.join("\n");
}

export function splitMarkdown(text: string) {
  // Regular expressions for different elements
  const regexLinksImages =
    /(!\[[^\]]+\]\((?!["']).+?\))|\[[^\]]+\]\((?!["']).+?\)/g;
  const regexCodeBlocks = /```[\s\S]*?```/g;
  const regexInlineCode = /`[^`]*`/g;
  const regexTables = /^\s*\|.*\|$/gm;

  const result = [];
  let lastIndex = 0;
  const countImgLinks = (text.match(regexLinksImages) || []).length;

  // Remove code blocks, tables and inline code to avoid false matches
  const processedText = text
    .replace(regexCodeBlocks, (match) => " ".repeat(match.length))
    .replace(regexTables, (match) => " ".repeat(match.length))
    .replace(regexInlineCode, (match) => " ".repeat(match.length));

  let match;
  while ((match = regexLinksImages.exec(processedText)) !== null) {
    const start = match.index;
    const end = regexLinksImages.lastIndex;

    // Add text before match
    if (start > lastIndex) {
      const content = text.slice(lastIndex, start);
      if (content !== "\n") {
        result.push({
          type: "text",
          text: content,
        });
      }
    }

    // Determine if it's an image or link
    const isImage = match[1] !== undefined;
    const urlMatch = match[0].match(/\((.*?)\)/);
    const imageUrl = urlMatch ? urlMatch[1] : "";
    result.push({
      type: isImage ? "image" : "file",
      text: match[0],
      image: imageUrl,
    });

    lastIndex = end;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    const content = text.slice(lastIndex);
    if (content !== "\n") {
      result.push({
        type: "text",
        text: content,
      });
    }
  }

  return { markdown: result, countImgLinks };
}
