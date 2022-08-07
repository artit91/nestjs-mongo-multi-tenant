import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  Collection,
  CollectionFactory,
  MONGODB_SCOPED_PROVIDER,
} from 'src/mongodb/mongodb.provider';
import { User } from 'src/organisation/entities/user.entity';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserService {
  private user: Collection;
  constructor(
    @Inject(MONGODB_SCOPED_PROVIDER) private collection: CollectionFactory,
  ) {
    this.user = this.collection('user');
  }
  async findAll() {
    return (await this.user.find().toArray()).map(User.fromMongo);
  }
}
