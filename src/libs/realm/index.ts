import { createRealmContext } from "@realm/react";

import { Historic } from "./schemas/Historic";

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic as any],
    schemaVersion: 1,
  });
