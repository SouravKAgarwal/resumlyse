"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark" | "system";

export type TransitionOrigin =
  | React.MouseEvent<HTMLElement>
  | MouseEvent
  | { clientX: number; clientY: number }
  | undefined;

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme, origin?: TransitionOrigin) => void;
  toggleTheme: (origin?: TransitionOrigin) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "resumlyse-theme";

const applyRootTheme = (isDark: boolean) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", isDark ? "#121212" : "#fbfbfa");
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";
  });

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const isTransitioningRef = useRef(false);

  // Sync resolved theme with document on mount or update
  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  const applyThemeTransition = useCallback(
    (
      nextTheme: Theme,
      nextResolved: "light" | "dark",
      origin?: TransitionOrigin,
    ) => {
      if (isTransitioningRef.current) return;

      const canViewTransition =
        typeof document !== "undefined" &&
        typeof document.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Fallback if View Transitions API is unavailable or user prefers reduced motion
      if (!canViewTransition) {
        if (
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          applyRootTheme(nextResolved === "dark");
          setThemeState(nextTheme);
          try {
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
          } catch {
            // Storage unavailable or disabled
          }
          return;
        }

        // Smooth CSS fallback transition across all elements
        const root = document.documentElement;
        root.classList.add("theme-transitioning");
        applyRootTheme(nextResolved === "dark");
        setThemeState(nextTheme);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch {
          // Storage unavailable or disabled
        }

        window.setTimeout(() => {
          root.classList.remove("theme-transitioning");
        }, 350);
        return;
      }

      // View Transitions API approach with smooth circular ripple
      isTransitioningRef.current = true;

      // Determine coordinates for circular origin
      let x = typeof window !== "undefined" ? window.innerWidth - 48 : 0;
      let y = 32;

      if (
        origin &&
        "clientX" in origin &&
        "clientY" in origin &&
        (origin.clientX !== 0 || origin.clientY !== 0)
      ) {
        x = origin.clientX;
        y = origin.clientY;
      } else if (typeof document !== "undefined") {
        const toggleBtn = document.querySelector(
          "[data-theme-toggle]",
        ) as HTMLElement | null;
        if (toggleBtn) {
          const rect = toggleBtn.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      // Temporarily disable CSS transitions during snapshot capture
      const styleEl = document.createElement("style");
      styleEl.appendChild(
        document.createTextNode(
          "*, *::before, *::after { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }",
        ),
      );

      try {
        const transition = document.startViewTransition!(() => {
          document.head.appendChild(styleEl);

          applyRootTheme(nextResolved === "dark");

          flushSync(() => {
            setThemeState(nextTheme);
            try {
              localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            } catch {
              // Storage unavailable or disabled
            }
          });

          // Force synchronous reflow so styles are fully applied for snapshot
          const root = document.documentElement;
          void root.offsetHeight;

          // Clean up temporary style element
          if (styleEl.parentNode) {
            styleEl.parentNode.removeChild(styleEl);
          }
        });

        transition.ready
          .then(() => {
            const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ];
            const anim = document.documentElement.animate(
              {
                clipPath: clipPath,
              },
              {
                duration: 450,
                easing: "cubic-bezier(0.2, 0, 0, 1)",
                pseudoElement: "::view-transition-new(root)",
              },
            );

            anim.onfinish = () => {
              isTransitioningRef.current = false;
            };
          })
          .catch(() => {
            isTransitioningRef.current = false;
            if (styleEl.parentNode) {
              styleEl.parentNode.removeChild(styleEl);
            }
          });

        transition.finished
          .then(() => {
            isTransitioningRef.current = false;
          })
          .catch(() => {
            isTransitioningRef.current = false;
          });
      } catch {
        // If startViewTransition fails unexpectedly, recover gracefully
        isTransitioningRef.current = false;
        if (styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
        applyRootTheme(nextResolved === "dark");
        setThemeState(nextTheme);
      }
    },
    [],
  );

  useEffect(() => {
    applyRootTheme(resolvedTheme === "dark");
  }, [resolvedTheme]);

  // Track system OS color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
      if (theme === "system") {
        const nextResolved = e.matches ? "dark" : "light";
        applyThemeTransition("system", nextResolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyThemeTransition]);

  const setTheme = (newTheme: Theme, origin?: TransitionOrigin) => {
    const nextResolved =
      newTheme === "system" ? (systemDark ? "dark" : "light") : newTheme;
    if (newTheme === theme && nextResolved === resolvedTheme) return;
    applyThemeTransition(newTheme, nextResolved, origin);
  };

  const toggleTheme = (origin?: TransitionOrigin) => {
    const nextResolved = resolvedTheme === "dark" ? "light" : "dark";
    applyThemeTransition(nextResolved, nextResolved, origin);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
