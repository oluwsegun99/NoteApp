import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Note extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column("longtext")
    content: string;

    @Field(() => User)
    @ManyToOne( () => User, (user) => user.id)
    created_By: User;

    @Field(() => String)
    @CreateDateColumn()
    created_At: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_At: Date;
}