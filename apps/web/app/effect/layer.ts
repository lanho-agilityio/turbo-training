import { Context, Effect, Layer } from "effect";

class Config extends Context.Tag("Config")<
  Config,
  {
    readonly getConfig: Effect.Effect<{
      readonly logLevel: string;
      readonly connection: string;
    }>;
  }
>() {}

const ConfigLive = Layer.succeed(Config, {
  getConfig: Effect.succeed({
    logLevel: "INFO",
    connection: "mysql://username:password@hostname:port/database_name",
  }),
});

class Logger extends Context.Tag("Logger")<
  Logger,
  { readonly log: (message: string) => Effect.Effect<void> }
>() {}

const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    const config = yield* Config;
    return {
      log: (message) =>
        Effect.gen(function* () {
          const { logLevel } = yield* config.getConfig;
          console.log(`[${logLevel}] ${message}`);
        }),
    };
  })
);

class Database extends Context.Tag("Database")<
  Database,
  { readonly query: (sql: string) => Effect.Effect<unknown> }
>() {}

const DatabaseLive = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* Config;
    const logger = yield* Logger;
    return {
      query: (sql: string) =>
        Effect.gen(function* () {
          yield* logger.log(`Executing query: ${sql}`);
          const { connection } = yield* config.getConfig;
          return { result: `Results from ${connection}` };
        }),
    };
  })
);

const AppConfigLive = Layer.merge(ConfigLive, LoggerLive);

const MainLive = DatabaseLive.pipe(
  Layer.provide(LoggerLive),
  Layer.provide(ConfigLive)
);

//      ┌─── Effect<unknown, never, Database>
//      ▼
const program = Effect.gen(function* () {
  const database = yield* Database;
  const result = yield* database.query("SELECT * FROM users");
  console.log(result);
  return result;
});

//      ┌─── Effect<unknown, never, never>
//      ▼
const runnable = program.pipe(Effect.provide(MainLive));

Effect.runFork(runnable);
/*
Output:
[INFO] Executing query: SELECT * FROM users
{
  result: 'Results from mysql://username:password@hostname:port/database_name'
}
*/
