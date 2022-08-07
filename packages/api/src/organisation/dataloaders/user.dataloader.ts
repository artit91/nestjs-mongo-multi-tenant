import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import {
  CollectionFactory,
  MONGODB_ROOT_PROVIDER,
} from 'src/mongodb/mongodb.provider';
import { User } from 'src/organisation/entities/user.entity';

export const ORGANISATION_USER_LOADER = 'ORGANISATION_USER_LOADER';

export const OrganisationUserLoaderProvider = {
  provide: ORGANISATION_USER_LOADER,
  useFactory: async (collection: CollectionFactory) => {
    return new DataLoader<string, User[]>(async (orgIds: string[]) => {
      const result = (
        await collection('user')
          .find({
            orgId: {
              $in: orgIds.map((id) => new ObjectId(id)),
            },
          })
          .toArray()
      )
        .map(User.fromMongo)
        .reduce((prev, act) => {
          for (const orgId of act.orgId) {
            prev[orgId] = prev[orgId] || [];
            prev[orgId].push(act);
          }
          return prev;
        }, {} as Record<string, User[]>);
      return orgIds.map((orgId) => result[orgId]);
    });
  },
  inject: [MONGODB_ROOT_PROVIDER],
};

export type OrganisationUserLoader = Awaited<
  ReturnType<typeof OrganisationUserLoaderProvider['useFactory']>
>;

export type OrganisationUserLoaderContext = {
  [ORGANISATION_USER_LOADER]: OrganisationUserLoader;
};
