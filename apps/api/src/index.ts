import express from "express";
import cors from "cors";
import mainRouter from "./router/index";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

if (!process.env.BYCRYPT_SALT_ROUNDS) {
    throw new Error("BYCRYPT_SALT_ROUNDS is not defined");
}
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
