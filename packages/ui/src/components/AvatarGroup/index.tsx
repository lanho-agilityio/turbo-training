// Components
import { Avatar } from "@repo/ui/components/Avatar";

type AvatarGroupItem = {
  userId: string | number;
  name: string;
  avatar?: string | null;
};

export type AvatarGroupProps<T extends AvatarGroupItem> = {
  listUsers: T[];
  maxDisplayed?: number;
};

export const AvatarGroup = <T extends AvatarGroupItem>({
  listUsers,
  maxDisplayed = 0,
}: AvatarGroupProps<T>) => {
  const itemsToShow = Array.isArray(listUsers)
    ? listUsers.slice(0, maxDisplayed || listUsers.length)
    : [];
  const remainingItems = Array.isArray(listUsers)
    ? listUsers.length - itemsToShow.length
    : 0;

  return (
    <div className="flex -space-x-4" data-testid="avatar-group">
      {itemsToShow.map(({ userId, name, avatar }) => (
        <div key={userId}>
          <Avatar
            src={avatar || ""}
            name={name}
            customClass="dark:border-gray-500 border-2"
            variant="circle"
          />
        </div>
      ))}

      {remainingItems > 0 && (
        <div className="w-12 h-12 border-2 border-white bg-gray-300 rounded-full flex items-center justify-center">
          <span>&#43;{remainingItems}</span>
        </div>
      )}
    </div>
  );
};
