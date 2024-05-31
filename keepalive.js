const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("Webserver is ONLINE <3"))

app.listen(port ,() => console.log(`CONECCIÓN WEB EXITOSA| 🟢`));