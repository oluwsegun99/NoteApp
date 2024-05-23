import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { ILike } from "typeorm";
import { Note } from "../entity/Note";
import { User } from "../entity/User";
import { isAuth } from "../helpers/isAuth";
import { MyContext } from "./UserResolver";

@Resolver()
export class NoteResolver {
    @Query(() => [Note])
    @UseMiddleware(isAuth)      //makes this whole query only accessible by logged in user...authenticated
    async listNotes(
        @Ctx() ctx: MyContext, 
        @Arg("search", {defaultValue: ""}) search: string,
        @Arg("orderBy", {defaultValue: "DESC"}) orderBy: string
    ){
        return Note.find({
            relations: ["created_By"], 
            where: {
                title: ILike(`%${search}%`), 
                created_By: {
                    id: ctx.tokenPayload?.userId
                },
            },
            order: {
                created_At: orderBy === "DESC" ? "DESC" : "ASC"
            },
        });

    }

    @Mutation(() => Note)
    @UseMiddleware(isAuth)
    async addNote(@Arg("title") title: string, @Arg("content") content: string, @Ctx() ctx: MyContext) {
        try {
            const user = await User.findOne(ctx.tokenPayload?.userId)
            const newNote = new Note();
            newNote.title = title;
            newNote.content = content;
            newNote.created_By = user!;

            await newNote.save();
            return newNote;
        } catch (e) {
            const error = e as string;
            throw new Error(error);
        }
        
    }

    @Mutation(() => Note)
    @UseMiddleware(isAuth)
    async updateNote(
        @Arg("title") title: string, 
        @Arg("content") content: string, 
        @Arg("noteId") noteId: string, 
        ) {
        try {
            const note = await Note.findOne(noteId, {relations: ["created_By"]});
            if (!note) throw new Error("Note not found");

            note.title = title;
            note.content = content;

            await note.save();
            return note;
        } catch (e) {
            const error = e as string;
            throw new Error(error);
        }
        
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteNote(@Arg("noteId") noteId: string) {
        try {
            const note = await Note.findOne(noteId, {relations: ["created_By"]});
            if (!note) throw new Error("Note not found");

            await note.remove();
            return true;
        } catch (e) {
            const error = e as string;
            throw new Error(error);
        }
        
    }
    
}

    