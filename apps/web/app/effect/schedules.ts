import { Array, Chunk, Duration, Effect, Schedule } from "effect";

const log = (
  schedule: Schedule.Schedule<unknown>,
  delay: Duration.DurationInput = 0
): void => {
  const maxRecurs = 10;
  const delays = Chunk.toArray(
    Effect.runSync(
      Schedule.run(
        Schedule.delays(Schedule.addDelay(schedule, () => delay)),
        Date.now(),
        Array.range(0, maxRecurs)
      )
    )
  );
  delays.forEach((duration, i) => {
    console.log(
      i === maxRecurs
        ? "..."
        : i === delays.length - 1
          ? "(end)"
          : `#${i + 1}: ${Duration.toMillis(duration)}ms`
    );
  });
};

const foreverSchedule = Schedule.forever;
const recursSchedule = Schedule.recurs(5);
const onceSchedule = Schedule.once;

log(foreverSchedule);
log(recursSchedule);
log(onceSchedule);
