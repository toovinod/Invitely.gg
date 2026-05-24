import * as React from "react";

const MOBILE_BREAKPOINT = 768;

function getIsMobile(): boolean | undefined {
  if (typeof window === "undefined") return undefined;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  // Initialize from window when available (post-mount) so we avoid
  // the synchronous setState-in-effect cascade.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    getIsMobile,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
