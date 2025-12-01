"use client";
import { useState, useMemo, useCallback } from "react";
import { sum } from "@repo/math/math.ts";
import { Button } from "@repo/ui/components/button";
import { Effect } from "effect";

export default function Page() {
  const [count, setCount] = useState(0);

  const task = useMemo(
    () => Effect.sync(() => setCount((current) => current + 1)),
    [setCount]
  );

  const increment = useCallback(() => Effect.runSync(task), [task]);

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
