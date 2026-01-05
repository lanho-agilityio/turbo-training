import Image from "next/image";

// Utils
import { cn } from "@repo/ui/utils/styles";

// Types
import type { CustomClassType } from "@repo/ui/types/components";

interface AvatarProps extends CustomClassType {
  width?: number;
  height?: number;
  src?: string;
  name: string;
  variant?: "square" | "circle";
}

export const Avatar = ({
  width = 50,
  height = 50,
  src,
  name,
  variant = "square",
  customClass,
}: AvatarProps) => (
  <Image
    className={cn(
      {
        "rounded-full": variant === "circle",
        "rounded-lg": variant === "square",
      },
      customClass
    )}
    width={width}
    height={height}
    src={
      src ? src : `https://ui-avatars.com/api/?name=${name}&background=random`
    }
    alt={`${name} avatar`}
  />
);
