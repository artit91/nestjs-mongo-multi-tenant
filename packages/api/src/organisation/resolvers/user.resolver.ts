import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {
  MONGODB_ORG_ID,
  MongoOrgIdContext,
} from 'src/mongodb/mongodb.provider';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { User } from 'src/organisation/entities/user.entity';
import {
  OrganisationLoaderContext,
  ORGANISATION_LOADER,
} from 'src/organisation/dataloaders/organisation.dataloader';
import { UserService } from 'src/organisation/services/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Query(() => [User])
  async users(): Promise<Organisation[]> {
    return this.userService.findAll();
  }
  @ResolveField(() => [Organisation], {
    name: 'organisation',
  })
  resolveOrganisation(
    @Parent() user: User,
    @Context()
    {
      [ORGANISATION_LOADER]: organisationLoader,
      [MONGODB_ORG_ID]: orgId,
    }: OrganisationLoaderContext & MongoOrgIdContext,
  ) {
    return organisationLoader.loadMany(
      user.orgId.filter((id) => orgId.includes(id)),
    );
  }
}
