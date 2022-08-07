import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import {
  CollectionFactory,
  MONGODB_ROOT_PROVIDER,
} from 'src/mongodb/mongodb.provider';

import { Organisation } from 'src/organisation/entities/organisation.entity';

export const ORGANISATION_LOADER = 'ORGANISATION_LOADER';

export const OrganisationLoaderProvider = {
  provide: ORGANISATION_LOADER,
  useFactory: async (collection: CollectionFactory) => {
    return new DataLoader<string, Organisation>(async (orgIds: string[]) => {
      const result = (
        await collection('organisation')
          .find({
            _id: {
              $in: orgIds.map((id) => new ObjectId(id)),
            },
          })
          .toArray()
      )
        .map(Organisation.fromMongo)
        .reduce((prev, act) => {
          prev[act.id] = act;
          return prev;
        }, {} as Record<string, Organisation>);
      return orgIds.map((id) => result[id]);
    });
  },
  inject: [MONGODB_ROOT_PROVIDER],
};

export type OrganisationLoader = Awaited<
  ReturnType<typeof OrganisationLoaderProvider['useFactory']>
>;

export type OrganisationLoaderContext = {
  [ORGANISATION_LOADER]: OrganisationLoader;
};
