const express = require("express");
const router = express.Router();
const userModel = require("../classes/dao/models/UserModel.js");
const bcrypt = require('bcrypt');


router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const isAdmin = email == "admin@gmail.com" && password == "admin123";
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
            req.session.user = user;
            res.redirect("/api/products");
        }

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
    const saltRounds = 10
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new userModel({ email, password: hashedPassword });
        await newUser.save();
        
        res.redirect("/api/auth/login");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
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