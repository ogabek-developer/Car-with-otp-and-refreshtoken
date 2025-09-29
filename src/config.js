import {config} from "dotenv";
config();

const serverConfig = {
    PORT: process.env.PORT || 5000,
    DB_NAME: process.env.DB_NAME,
    DbUri: process.env.DbUri,
    SERVERSELECTIONTIMEOUT: process.env.SERVERSELECTIONTIMEOUT,
    EMAIL: process.env.EMAIL,
    NODE_MAILER: process.env.NODE_MAILER
}

export default serverConfig