import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = {};

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") {
      // Back/forward → restore previous scroll
      const savedPosition = scrollPositions[location.key];
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      }
    } else {
      // New navigation → go to top
      window.scrollTo(0, 0);
    }

    return () => {
      // Save scroll position before leaving page
      scrollPositions[location.key] = window.scrollY;
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollRestoration;