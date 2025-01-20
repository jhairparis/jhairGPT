"use client";
import React, { forwardRef, useImperativeHandle } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface AppProps {
  onClick: () => void;
}

// eslint-disable-next-line react/display-name
const App = forwardRef((props: AppProps, ref) => {
  const [dotLottie, setDotLottie] = React.useState<any>(null);

  React.useEffect(() => {
    function onComplete() {
      dotLottie.setFrame(10);
    }

    if (dotLottie) {
      dotLottie.addEventListener("complete", onComplete);
    }

    return () => {
      if (dotLottie) {
        dotLottie.addEventListener("complete", onComplete);
      }
    };
  }, [dotLottie]);

  const dotLottieRefCallback = (dotLottie: any) => {
    setDotLottie(dotLottie);
  };

  useImperativeHandle(ref, () => ({
    play() {
      if (dotLottie) {
        dotLottie.play();
      }
    },
  }));

  return (
    <div
      className="absolute bottom-0 right-0 w-12 h-12 mr-4 mb-2 cursor-pointer"
      onClick={props.onClick}
    >
      <DotLottieReact
        src="/Send.lottie"
        segment={[10, 140]}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </div>
  );
});

export default App;
