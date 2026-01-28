import { useEffect } from "react";

const useInfiniteScroll = (callback, ref) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [callback, ref]);
};

export default useInfiniteScroll;
