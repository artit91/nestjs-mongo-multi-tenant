import { Module } from '@nestjs/common';

import { providers } from 'src/mongodb/mongodb.provider';

import { OrganisationService } from './services/organisation.service';
import { UserService } from './services/user.service';
import { OrganisationResolver } from './resolvers/organisation.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { OrganisationLoaderProvider } from './dataloaders/organisation.dataloader';
import { OrganisationUserLoaderProvider } from './dataloaders/user.dataloader';

@Module({
  providers: [
    ...providers,
    OrganisationService,
    UserService,
    UserResolver,
    OrganisationResolver,
    OrganisationLoaderProvider,
    OrganisationUserLoaderProvider,
  ],
  exports: [OrganisationLoaderProvider, OrganisationUserLoaderProvider],
})
export class OrganisationModule {}
