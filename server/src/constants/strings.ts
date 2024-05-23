import "dotenv/config";

export const CONST = {
    // REACT_WEB: process.env.REACT_WEB,
    // REACT_WEB2: process.env.REACT_WEB2,
    PORT: process.env.PORT!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    JWT_COOKIE: "nevernote-jwt",
};