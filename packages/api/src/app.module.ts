import * as path from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongodbModule } from './mongodb/mongodb.module';
import { MONGODB_ORG_ID } from './mongodb/mongodb.provider';

import { OrganisationModule } from './organisation/organisation.module';
import {
  OrganisationLoader,
  ORGANISATION_LOADER,
} from './organisation/dataloaders/organisation.dataloader';
import {
  OrganisationUserLoader,
  ORGANISATION_USER_LOADER,
} from './organisation/dataloaders/user.dataloader';

const GraphQL = GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  useFactory: (
    organisationLoader: OrganisationLoader,
    organisationUserLoader: OrganisationUserLoader,
  ) => {
    return {
      autoSchemaFile: path.join(process.cwd(), 'src', 'schema.gql'),
      context: (ctx) => {
        return {
          [MONGODB_ORG_ID]: ctx.req.get('orgId').split(','),
          [ORGANISATION_LOADER]: organisationLoader,
          [ORGANISATION_USER_LOADER]: organisationUserLoader,
        };
      },
    };
  },
  imports: [MongodbModule, OrganisationModule],
  inject: [ORGANISATION_LOADER, ORGANISATION_USER_LOADER],
});

@Module({
  imports: [GraphQL],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
