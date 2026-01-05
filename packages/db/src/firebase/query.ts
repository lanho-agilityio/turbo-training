import {
  Firestore,
  QueryConstraint,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
  WithFieldValue,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";
import { Context, Effect, Layer } from "effect";

// Errors
import {
  FirestoreError,
  DocumentNotFound,
  PaginatedResult,
  SingleResult,
  SuccessVoid,
} from "@repo/db/models/base";

// Types
import type { QueryParam } from "@repo/ui/types/query-params";

export class Config extends Context.Tag("Config")<
  Config,
  { readonly getConfig: Effect.Effect<{ readonly config: Firestore }> }
>() {}

export class FirestoreService extends Context.Tag("FirestoreService")<
  FirestoreService,
  {
    getDocuments<T>(
      collectionKey: string,
      queryParam?: QueryParam
    ): Effect.Effect<PaginatedResult<T>, FirestoreError, never>;
    getDocument<T>(
      collectionKey: string,
      itemId: string
    ): Effect.Effect<SingleResult<T>, FirestoreError | DocumentNotFound, never>;
    updateDocument<T extends { id: string }>(
      collectionKey: string,
      formData: T & WithFieldValue<DocumentData>
    ): Effect.Effect<SuccessVoid, FirestoreError, never>;
    deleteDocument(
      collectionKey: string,
      itemId: string
    ): Effect.Effect<SuccessVoid, FirestoreError, never>;
  }
>() {}

export const ConfigLive = (config: Firestore) =>
  Layer.succeed(Config, { getConfig: Effect.succeed({ config }) });

export const FirestoreLive = Layer.effect(
  FirestoreService,
  Effect.gen(function* () {
    const db = yield* Config;
    return {
      // Generic get documents with pagination, filters, ordering
      getDocuments<T>(
        collectionKey: string,
        queryParam?: QueryParam
      ): Effect.Effect<PaginatedResult<T>, FirestoreError, never> {
        return Effect.gen(function* () {
          const { config } = yield* db.getConfig;
          let queryConstraints: QueryConstraint[] = [];
          let countQueryConstraints: QueryConstraint[] = [];

          if (queryParam?.orderItem) {
            queryConstraints.push(
              orderBy(queryParam.orderItem.field, queryParam.orderItem.type)
            );
          }

          if (queryParam?.limitItem) {
            queryConstraints.push(limit(queryParam.limitItem));
          }

          if (queryParam?.query) {
            const whereConstraints = queryParam.query.map((element) =>
              where(element.field, element.comparison, element.value)
            );
            countQueryConstraints = whereConstraints;
            queryConstraints = queryConstraints.concat(whereConstraints);
          }

          // Pagination: startAfter last document of previous page
          if (
            queryParam?.page &&
            queryParam?.limitItem &&
            queryParam?.orderItem &&
            queryParam.page > 1
          ) {
            const prevLimit = queryParam.limitItem * (queryParam.page - 1);
            const prevQuery = query(
              collection(config, collectionKey),
              ...queryConstraints,
              limit(prevLimit)
            );

            const prevSnapshot = yield* Effect.tryPromise({
              try: () => getDocs(prevQuery),
              catch: (cause) => new FirestoreError({ cause }),
            });

            if (prevSnapshot.docs.length === 0) {
              return { success: true, data: [] as T[], total: 0 };
            }

            const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
            queryConstraints.push(startAfter(lastVisible));
          }

          // Build main and count queries
          const dataQuery = query(
            collection(config, collectionKey),
            ...queryConstraints
          );
          const countQuery = query(
            collection(config, collectionKey),
            ...countQueryConstraints
          );

          const [snapshot, countSnapshot] = yield* Effect.all(
            [
              Effect.tryPromise({
                try: () => getDocs(dataQuery),
                catch: (cause) => new FirestoreError({ cause }),
              }),
              Effect.tryPromise({
                try: () => getCountFromServer(countQuery),
                catch: (cause) => new FirestoreError({ cause }),
              }),
            ],
            { concurrency: "unbounded" }
          );

          const total = countSnapshot.data().count;
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as T[];

          return { success: true, data, total };
        });
      },

      getDocument<T>(
        collectionKey: string,
        itemId: string
      ): Effect.Effect<
        SingleResult<T>,
        FirestoreError | DocumentNotFound,
        never
      > {
        return Effect.gen(function* () {
          const { config } = yield* db.getConfig;
          const docRef = doc(config, collectionKey, itemId);
          const snapshot = yield* Effect.tryPromise({
            try: () => getDoc(docRef),
            catch: (cause) => new FirestoreError({ cause }),
          });

          if (!snapshot.exists()) {
            return yield* Effect.fail(
              new DocumentNotFound({ collectionKey, itemId })
            );
          }

          return {
            success: true,
            data: { ...snapshot.data(), id: snapshot.id } as T,
            error: undefined,
          };
        });
      },

      // Update document
      updateDocument<T extends { id: string }>(
        collectionKey: string,
        formData: T & WithFieldValue<DocumentData>
      ): Effect.Effect<SuccessVoid, FirestoreError, never> {
        return Effect.gen(function* () {
          const { config } = yield* db.getConfig;

          const docRef = doc(config, collectionKey, formData.id);

          yield* Effect.tryPromise({
            try: () => updateDoc(docRef, formData),
            catch: (cause) => new FirestoreError({ cause }),
          });

          return { success: true, data: undefined as void };
        });
      },

      // Delete document
      deleteDocument(
        collectionKey: string,
        itemId: string
      ): Effect.Effect<SuccessVoid, FirestoreError, never> {
        return Effect.gen(function* () {
          const { config } = yield* db.getConfig;

          const docRef = doc(config, collectionKey, itemId);

          yield* Effect.tryPromise({
            try: () => deleteDoc(docRef),
            catch: (cause) => new FirestoreError({ cause }),
          });

          return { success: true, data: undefined as void };
        });
      },
    };
  })
);
