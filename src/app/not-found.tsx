"use client";
import FuzzyText from "@/features/shared/components/FuzzyText/FuzzyText";
import GlitchText from "@/features/shared/components/GlitchText/GlitchText";
import StarBorder from "@/features/shared/components/StarBorder/StarBorder";
import { WandSparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const Notfound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="h-24">
        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
          404
        </FuzzyText>
      </div>
      <GlitchText speed={1} enableShadows={true}>
        Not_found
      </GlitchText>
      <StarBorder as={Link} href={"/"} className="mt-8">
        <span className="flex items-center gap-2">
          <WandSparkles />
          Begin again
        </span>
      </StarBorder>
    </div>
  );
};

export default Notfound;
