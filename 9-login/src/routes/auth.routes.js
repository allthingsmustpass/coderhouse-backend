const express = require("express");
const router = express.Router();
const userModel = require("../classes/dao/models/UserModel.js");


router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (user) {
        req.session.user = user;
        res.redirect("/products");
    } else {
        res.render("login", { error: "Invalid email or password" });
    }
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const newUser = new userModel({ email, password });
    await newUser.save();
    res.redirect("/auth/login");
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            res.redirect("/auth/login");
        }
    });
});

module.exports = router;