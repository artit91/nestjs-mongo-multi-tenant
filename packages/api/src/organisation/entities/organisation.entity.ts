import { Field, ObjectType } from '@nestjs/graphql';
import { WithId, Document } from 'mongodb';

@ObjectType()
export class Organisation {
  @Field()
  id: string;

  @Field()
  name: string;

  static fromMongo(document: WithId<Document>): Organisation {
    const ret = new Organisation();
    ret.id = document._id.toString();
    ret.name = document.name;
    return ret;
  }
}
