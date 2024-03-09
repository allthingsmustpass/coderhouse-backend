const express = require("express");
const router = express.Router();
const userModel = require("../classes/dao/models/UserModel.js");


router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    const isAdmin = email == "admin@gmail.com" && password == "admin123";
    if (user) {
        req.session.user = user;
        res.redirect("/api/products");
    } else if (isAdmin) {
        req.session.user = { email: email, role: "admin" };
        res.redirect("/api/products");
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
    res.redirect("/api/auth/login");
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            res.redirect("/api/auth/login");
        }
    });
});

module.exports = router;