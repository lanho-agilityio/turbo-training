"use client";
import { RefObject, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Components
import { ToggleTheme } from "@repo/ui/components/ToggleTheme";
import { NavLink } from "@repo/ui/components/NavLink";

// Constants
import { PUBLIC_NAVIGATION_LIST } from "@repo/ui/constants/navigations";
import { ROUTES } from "@repo/ui/constants/routes";

// Hooks
import { useOutsideClick } from "@repo/ui/hooks/useOutsideClick";

// Icons
import { LogoIcon } from "@repo/ui/icons/LogoIcon";
import { CiMenuBurger } from "react-icons/ci";

// Utils
import { cn } from "@repo/ui/utils/styles";

export const PublicNavBar = () => {
  const pathName = usePathname();
  const [isShowNavBar, setShowNavBar] = useState(false);

  const handleCloseNavBar = () => {
    setShowNavBar(false);
  };

  const toggleShowNavBar = () => {
    setShowNavBar(!isShowNavBar);
  };

  const navBarRef = useOutsideClick(() => {
    handleCloseNavBar();
  });

  return (
    <>
      <nav
        className="relative lg:static w-full"
        ref={navBarRef as RefObject<HTMLDivElement>}
      >
        <div className="flex items-center justify-between py-2.5 pr-5 lg:pr-0 px-1.25 lg:mb-7.75 rounded-lg bg-white dark:bg-zinc-800 ">
          <Link href={ROUTES.BOARDS} className="flex items-center gap-2 w-full">
            <LogoIcon customClass="w-[25px] h-[25px] bg-black rounded-lg" />
            <h1 className="text-xl font-bold dark:text-white">Taskboard</h1>
          </Link>
          <CiMenuBurger
            data-testid="burger-menu-icon"
            className="lg:hidden cursor-pointer"
            onClick={toggleShowNavBar}
          />
        </div>
        <div
          className={cn(
            "mt-2 rounded-lg bg-white dark:bg-zinc-800 px-3 py-4 w-full absolute lg:static lg:block z-50",
            !isShowNavBar && "hidden"
          )}
        >
          <span className="text-xs font-bold text-zinc-500 dark:text-white ">
            Menu
          </span>
          <div className="flex flex-col gap-4 mt-2">
            {PUBLIC_NAVIGATION_LIST.map((route) => {
              const { href, label } = route;
              const isActivePath = pathName.includes(href);
              return (
                <NavLink
                  data-testid={`nav-${label.toLocaleLowerCase()}-item`}
                  key={`nav-link-${label}`}
                  isActive={isActivePath}
                  onClick={handleCloseNavBar}
                  {...route}
                />
              );
            })}
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-white">
              Theme
            </span>
            <ToggleTheme />
          </div>
        </div>
      </nav>
      {isShowNavBar && (
        <div className="opacity-50 fixed inset-0 z-40 bg-black lg:hidden" />
      )}
    </>
  );
};
