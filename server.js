/********************************************************************************
 * WEB700 – Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Yi Ching Daniel Ngan   Student ID: 117044248 Date: December 6, 2024
 *
 * Published URL: https://web700-a5-2.vercel.app/
 ********************************************************************************/

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
console.log("Created LogoData")
const path = require("path");

const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/lego/addSet", async (req, res) => {
    try {
        let themes = await legoData.getAllThemes();
        res.render("addSet", {themes: themes});
    } catch (err) {
        res.status(404).send(err);
    }
});
app.post("/lego/addSet", async (req, res) => {
    try {
        await legoData.addSet(req.body)
        res.redirect("/lego/sets")
    } catch (err) {
        res.status(404).send(err);
    }
});

app.get("/lego/sets", async (req, res) => {

    try {
        let themes = await legoData.getAllThemes();
        if (req.query.theme) {
            let legoSets = await legoData.getSetsByTheme(req.query.theme);
            res.render("sets", {sets: legoSets, themes: themes})
        } else {
            let legoSets = await legoData.getAllSets();
            res.render("sets", {sets: legoSets, themes: themes})
        }
    } catch (err) {
        res.status(404).send(err);
    }

});

app.get("/lego/sets/:set_num", async (req, res) => {
    try {
        let legoSet = await legoData.getSetByNum(req.params.set_num);
        let theme = await legoData.getThemeById(legoSet.theme_id)
        res.render("set", {set: legoSet, theme: theme});
    } catch (err) {
        res.status(404).send(err);
    }
});

app.get("/lego/deleteSet/:set_num", async (req,res)=>{
    try{
        await legoData.deleteSetByNum(req.params.set_num);
        res.redirect("/lego/sets");
    }catch(err){
        res.status(404).send(err);
    }
});

app.use((req, res, next) => {
    res.status(404).render("404");
});


legoData.initialize().then(() => {
    app.listen(HTTP_PORT, "localhost", () => console.log(`server listening on port: ${HTTP_PORT}`));
}).catch(err => {
    console.log(err);
});