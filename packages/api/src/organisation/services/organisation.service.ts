import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import {
  Collection,
  CollectionFactory,
  MONGODB_ORG_ID,
  MONGODB_ROOT_PROVIDER,
  MongoOrgIdContext,
} from 'src/mongodb/mongodb.provider';
import { Organisation } from 'src/organisation/entities/organisation.entity';

@Injectable({
  scope: Scope.REQUEST,
})
export class OrganisationService {
  private organisation: Collection;
  private orgId: string[];
  constructor(
    @Inject(MONGODB_ROOT_PROVIDER) private collection: CollectionFactory,
    @Inject(CONTEXT) { [MONGODB_ORG_ID]: orgId }: MongoOrgIdContext,
  ) {
    this.organisation = this.collection('organisation');
    this.orgId = orgId;
  }
  async findAll() {
    return (
      await this.organisation
        .find({
          _id: {
            $in: this.orgId.map((orgId) => new ObjectId(orgId)),
          },
        })
        .toArray()
    ).map(Organisation.fromMongo);
  }
}
