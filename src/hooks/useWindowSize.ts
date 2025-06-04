import { useEffect, useState } from "react";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  return windowSize;
}
