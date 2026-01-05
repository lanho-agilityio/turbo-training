// Utils
import { cn } from "@repo/ui/utils/styles";

type ItemNotFoundProps = {
  title: string;
  description?: string;
  customClass?: {
    wrapper?: string;
    title?: string;
    description?: string;
  };
};

export const ItemNotFound = ({
  title,
  description,
  customClass,
}: ItemNotFoundProps) => {
  return (
    <div
      className={cn(
        "text-center py-10 flex flex-col gap-4 items-center justify-center dark:bg-zinc-800",
        customClass?.wrapper
      )}
    >
      <h1 className={cn("text-2xl font-bold", customClass?.title)}>{title}</h1>
      {description && (
        <h2 className={cn("text-md md:text-lg", customClass?.description)}>
          {description}
        </h2>
      )}
    </div>
  );
};
