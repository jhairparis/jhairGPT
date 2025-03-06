import Markdown from "marked-react";
import markdownRenderer from "./markdown-renderer";
import "highlight.js/styles/tokyo-night-dark.css";
import "react-lowlight/all";
import "katex/dist/katex.min.css";

const Render = ({ content }: { content: string }) => {
  return <Markdown value={content} renderer={markdownRenderer} />;
};

export default Render;
