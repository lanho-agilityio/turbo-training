import { Effect } from "effect";

// Constants
import { COLLECTION } from "@repo/ui/constants/collection";

// DB
import { FirestoreService } from "./query";

// Types
import { User } from "@repo/ui/types/users";

export const fetchUserList = () => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const response = yield* service.getDocuments<User>(COLLECTION.USERS);
    const userList = response.data.map((user) => ({
      ...user,
      name: user.username || user.name,
    }));
    return {
      success: true,
      data: userList,
      error: undefined,
    };
  });
};
