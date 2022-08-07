import { Global, Module } from '@nestjs/common';
import { providers } from './mongodb.provider';

@Global()
@Module({
  providers,
})
export class MongodbModule {}
