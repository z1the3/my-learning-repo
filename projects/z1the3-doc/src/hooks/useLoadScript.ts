import { useEffect } from "react";

const useLoadScript = (src: string) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);
};

export default useLoadScript;
