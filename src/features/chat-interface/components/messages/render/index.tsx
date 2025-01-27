import Markdown from "marked-react";
import "highlight.js/styles/tokyo-night-dark.css";
import Lowlight from "react-lowlight";
import "react-lowlight/all";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/features/shared/components/ui/card";
import Json from "highlight.js/lib/languages/json";

Lowlight.registerLanguage("ipynb", Json);

// TODO: Jus load the languages you need
const renderer = {
  code(snippet: any, lang: any) {
    return (
      <Card className="overflow-hidden my-2 text-start">
        <CardHeader className="py-2 px-4 select-none">{lang}</CardHeader>
        <CardContent className="p-0">
          <Lowlight language={lang} value={snippet} markers={[]} />
        </CardContent>
      </Card>
    );
  },
};

const Render = ({ content }: { content: string }) => {
  return <Markdown value={content} renderer={renderer} />;
};

export default Render;
