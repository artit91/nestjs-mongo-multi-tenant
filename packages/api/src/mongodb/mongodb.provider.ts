import { Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import {
  Collection as Coll,
  Db,
  Filter,
  Document,
  FindOptions,
  ObjectId,
} from 'mongodb';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { db, uri } from './mongodb.config';

export const MONGODB_DB_PROVIDER = 'MONGODB_DB_PROVIDER';

export const MONGODB_ROOT_PROVIDER = 'MONGODB_ROOT_PROVIDER';

export const MONGODB_SCOPED_PROVIDER = 'MONGODB_SCOPED_PROVIDER';

export const MONGODB_ORG_ID = 'MONGODB_ORG_ID';

export type MongoOrgIdContext = { [MONGODB_ORG_ID]: string[] };

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function createConnection(): Promise<MongoClient> {
  return client.connect();
}

export type CollectionFactory = Db['collection'];

export type Collection = Coll;

export const MongoDbProvider = {
  provide: MONGODB_DB_PROVIDER,
  useFactory: async () => {
    const connection = await createConnection();
    return connection.db(db);
  },
};

export const MongoRootProvider = {
  provide: MONGODB_ROOT_PROVIDER,
  useFactory: (db: Db) => {
    return ((name, options) => {
      const _collection = db.collection(name, options);
      return _collection;
    }) as CollectionFactory;
  },
  inject: [MONGODB_DB_PROVIDER],
};

export const MongoScopedProvider = {
  scope: Scope.REQUEST,
  provide: MONGODB_SCOPED_PROVIDER,
  useFactory: async (
    collection: CollectionFactory,
    { [MONGODB_ORG_ID]: orgId }: MongoOrgIdContext,
  ) => {
    return ((name, options) => {
      const _collection = collection(name, options);
      return {
        find: (filter?: Filter<Document>, options?: FindOptions<Document>) => {
          const cursor = _collection.find(filter, options);
          if (!orgId) {
            return cursor.filter({
              _id: undefined,
            });
          }
          return cursor.filter({
            orgId: {
              $in: orgId.map((_orgId) => new ObjectId(_orgId)),
            },
          });
        },
      } as Collection;
    }) as CollectionFactory;
  },
  inject: [MONGODB_ROOT_PROVIDER, CONTEXT],
};

export const providers = [
  MongoDbProvider,
  MongoRootProvider,
  MongoScopedProvider,
];
