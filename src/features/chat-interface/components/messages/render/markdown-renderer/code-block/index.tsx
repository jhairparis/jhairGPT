import React, { useState } from "react";
import Lowlight from "react-lowlight";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Clipboard, ClipboardCheck, Maximize2 } from "lucide-react";
import ErrorBoundaryCode from "./error-code-block";
import Json from "highlight.js/lib/languages/json";

// Register additional languages
Lowlight.registerLanguage("ipynb", Json);

const CodeBlock = ({ snippet, lang }: { snippet: string; lang?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Card
      className="overflow-hidden my-2 text-start relative"
      key={crypto.randomUUID()}
    >
      <CardHeader className="py-2 px-4 select-none flex flex-row justify-between items-center">
        <span className="capitalize">{lang}</span>
        <Button variant="outline" size="icon">
          <Maximize2 size={18} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ErrorBoundaryCode value={snippet}>
          <Lowlight language={lang} value={snippet} markers={[]} />
        </ErrorBoundaryCode>

        <div className="absolute bottom-2 right-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            style={{ position: "relative" }}
          >
            {!copied ? (
              <Clipboard size={18} style={{ opacity: 1 }} />
            ) : (
              <ClipboardCheck
                size={18}
                style={{
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              />
            )}
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeBlock;
