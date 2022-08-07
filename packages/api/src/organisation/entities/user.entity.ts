import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { WithId, Document } from 'mongodb';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @HideField()
  orgId: string[];

  static fromMongo(document: WithId<Document>): User {
    const ret = new User();
    ret.id = document._id.toString();
    ret.name = document.name;
    ret.orgId = document.orgId.map((id) => id.toString());
    return ret;
  }
}
