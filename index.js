const express = require("express");
const app = express();
const port = 5713;

app.use(express.json());

const apiMain = require('./Api/main.js')

app.get("/", function (req, res, next) {
    res.send("app express")
})
app.use('/api/', apiMain);
app.listen(port, () => {
    console.log(`Ejecutando servidor en puerto ${port}`);
})

app.get("/test", (req, res) => {
    res.send('/test');
});