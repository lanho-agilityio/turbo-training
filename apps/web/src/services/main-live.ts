import { Layer } from 'effect';

// Configs
import { db } from '@/config/firebaseConfig';

// Services
import { AuthServiceLive } from './auth-services';
import { ConfigLive, FirestoreLive } from '@repo/db/firebase/query';

export const ServiceLive = FirestoreLive.pipe(Layer.provide(ConfigLive(db)));

export const MainLive = Layer.mergeAll(
  AuthServiceLive,
  ServiceLive,
  ConfigLive(db),
);
