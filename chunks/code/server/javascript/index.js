require("module-alias/register");
require("dotenv").config();

const express = require("express");
const { startPage } = require("{{importPath}}");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // you can remove this
    res.status(200).send(startPage);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
