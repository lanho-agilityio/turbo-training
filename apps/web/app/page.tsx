import { sum } from "@repo/math/math.ts";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="size-10 bg-blue-1000">Apps</div>
      <div className="size-10 bg-red-1000">Red-1000</div>
      {sum(1, 2)}
    </main>
  );
}
