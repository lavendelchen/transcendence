import { Field, InputType } from '@nestjs/graphql';

// we could also add a class validator here e.g. IsNotEmpty() or IsAlpha()
@InputType()
export class CreateChannelInput {
    @Field()
    name: string;
}