// @ts-nocheck - This is a template file with placeholders
import "dotenv/config";
import express from "express";
// @ts-ignore - Placeholder replaced at runtime
import { startPage } from "{{importPath}}";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
    // you can remove this
    res.status(200).send(startPage);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
