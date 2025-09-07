import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    mongoUsername?: string;
    mongoPassword?: string;
    mongoHost?: string;
    mongoDbName?: string;
    mongoPort?: string;
    [key: string]: string | number | undefined;
}

const requiredEnvVars = [
    "MONGO_USERNAME",
    "MONGO_PASSWORD",
    "MONGO_HOST",
    "MONGO_DB_NAME",
    "MONGO_PORT"
] as const;

for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const config: Config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    mongoUsername: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoHost: process.env.MONGO_HOST,
    mongoDbName: process.env.MONGO_DB_NAME,
    mongoPort: process.env.MONGO_PORT,
}

export default config;