"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { sum } from "@repo/math/math.ts";
import { Button } from "@repo/ui/components/button";
import { Effect, Exit } from "effect";

const log = (message: string) => Effect.sync(() => console.log(message));

const parse = (input: string) =>
  // This might throw an error if input is not valid JSON
  Effect.try(() => JSON.parse(input));

const delay = (message: string) =>
  Effect.promise<string>(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(message);
        }, 2000);
      })
  );

Effect.log("123");

export default function Page() {
  const [count, setCount] = useState(0);

  const task = useMemo(
    () => Effect.sync(() => setCount((current) => current + 1)),
    [setCount]
  );

  const increment = useCallback(() => Effect.runSync(task), [task]);

  useEffect(() => {
    Effect.runSync(log("hello from React"));
  }, []);

  useEffect(() => {
    Effect.runPromise(delay("123312323"))
      .then((res) => console.log(res))
      .catch((err) => console.error("Error:", err));
  }, []);

  // console.log(Effect.runSyncExit(Effect.succeed(1)));
  // console.log(Effect.runSyncExit(Effect.fail("my error")));
  // console.log(Effect.runSyncExit(Effect.promise(() => Promise.resolve(1))));

  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "success"; value: unknown }
    | { status: "error"; cause: unknown }
  >({ status: "loading" });

  useEffect(() => {
    Effect.runPromiseExit(parse("bad json")).then((exit) => {
      if (Exit.isSuccess(exit)) {
        setState({ status: "success", value: exit.value });
      } else {
        setState({ status: "error", cause: exit.cause });
      }
    });
  }, []);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="size-10 bg-blue-1000">Apps</div>
      <div className="size-10 bg-red-1000">Red-1000</div>
      <div className="size-10 bg-primary hover:opacity-40" />
      <Button variant="default">123</Button>
      {sum(1, 2)}
      <button onClick={increment}>count is {count}</button>
    </main>
  );
}
