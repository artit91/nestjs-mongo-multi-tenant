import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Organisation } from 'src/organisation/entities/organisation.entity';
import { OrganisationService } from 'src/organisation/services/organisation.service';
import { User } from 'src/organisation/entities/user.entity';
import {
  ORGANISATION_USER_LOADER,
  OrganisationUserLoaderContext,
} from 'src/organisation/dataloaders/user.dataloader';

@Resolver(() => Organisation)
export class OrganisationResolver {
  constructor(private organisationService: OrganisationService) {}
  @Query(() => [Organisation])
  async organisations(): Promise<Organisation[]> {
    return this.organisationService.findAll();
  }

  @ResolveField(() => [User], {
    name: 'user',
  })
  async resolveUser(
    @Parent() organisation: Organisation,
    @Context()
    {
      [ORGANISATION_USER_LOADER]: organisationUserLoader,
    }: OrganisationUserLoaderContext,
  ) {
    return organisationUserLoader.load(organisation.id);
  }
}
