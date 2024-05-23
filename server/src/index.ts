import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { verify } from "jsonwebtoken";
import morgan from "morgan";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { CONST } from "./constants/strings";
import { User } from "./entity/User";
import { NoteResolver } from "./graphql/NoteResolver";
import { MyContext, UserResolver } from "./graphql/UserResolver";
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from "./helpers/generateToken";

createConnection()
.then(async connection => {
    const app = express();
    //Express middlewares
    app.use(cors({
        origin: [
        "http://localhost:3000", 
        "https://studio.apollographql.com"
    ],
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.get("/", (req, res) =>{
        res.send("Hello world");
    });

    //Having trouble here a bit
    app.post("/refresh-token", async (req, res) => {
        const token = req.cookies[CONST.JWT_COOKIE];
        if(!token)return res.send({success: false, access_token: ""});

        let data: any = null
        console.log(token);
        try {
            data = verify(token, CONST.REFRESH_TOKEN_SECRET);
        } catch (error) {
            console.error(error);
            return res.send({success: false, access_token: ""});
        }
        console.log("got here");
        const user = await User.findOne(data.userId);
        if (!user){
            return res.send({success: false, access_token: ""}); 
        }

        if(user.token_version !== data.tokenVersion){
            return res.send({success: false, access_token: ""}); 
 
        }

        const access_token = generateAccessToken(user);
        sendRefreshToken(res, generateRefreshToken(user));
        return res.send({success: true, access_token}); 

    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, NoteResolver],
        }),
        context: ({req, res}): MyContext => ({req, res}),  //to enable the refresh token to be saved in the cookie of the response
    });
    await apolloServer.start();     //It was giving me an error until I typed this...This wasn't typed in the tutorial
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(CONST.PORT, ()=>
    console.log(`server is running on http://localhost:${CONST.PORT}/graphql`)
    );
})
.catch(error => console.log(error));
