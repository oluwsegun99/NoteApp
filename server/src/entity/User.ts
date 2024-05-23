import { Field, Int, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Note } from "./Note";

@ObjectType()   //to enable user to be used as an object type 
@Entity()
export class User extends BaseEntity{   //base entity enables us to use orm libraries like "find", "findOne" etc
    @Field(() => String)    //to make the columns selectable in graphql..the "String" there is for graphql while the other "string" used in the columns are for typescript
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => String)
    @Column()
    email: string;

    @Field(() => String)
    @Column()
    username: string;

    @Column()
    password: string;

    @Field(() => Int)
    @Column("int", {default: 0})
    token_version: number;

    @OneToMany( () => Note, (note) => note.created_By)
    notes: Note[];

}
