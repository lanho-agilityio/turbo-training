"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Icons
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";

// Components
import { Button } from "@repo/ui/components/Button";

// Constants
import { THEME_MODE } from "@repo/ui/constants/theme";

export const ToggleTheme = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const themeMode = resolvedTheme === THEME_MODE.DARK;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleTheme = () => {
    setTheme(themeMode ? THEME_MODE.LIGHT : THEME_MODE.DARK);
  };

  if (!isMounted)
    return (
      <Button
        customClass="w-full mt-2 hover:bg-black hover:text-white dark:hover:bg-black dark:hover:text-white border-none"
        variant="outline"
        startIcon={<AiOutlineLoading className="animate-spin" />}
        customIconClass="px-2 disabled:hover-none"
        disabled={!isMounted}
      >
        Light/Dark
      </Button>
    );

  return (
    <Button
      dataTestId="toggle-theme-button"
      customClass="w-full mt-2 hover:bg-black hover:text-white dark:hover:bg-black dark:hover:text-white border-none text-zinc-500"
      variant="outline"
      onClick={handleToggleTheme}
      startIcon={
        resolvedTheme === THEME_MODE.DARK ? (
          <MdOutlineLightMode data-testid="dark-theme-icon" />
        ) : (
          <MdOutlineNightlight />
        )
      }
      customIconClass="px-2"
    >
      <span>{resolvedTheme === THEME_MODE.DARK ? "Light" : "Dark"}</span>
    </Button>
  );
};
