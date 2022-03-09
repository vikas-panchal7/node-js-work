const User = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//for creating/registering user in bike app
router.post("/bike/user", async (req, res) => {
  const adduser = new User(req.body);
  try {
    await adduser.save();
    const token = await adduser.generateAuthtoken();
    res.status(201).send({ adduser, token });
  } catch (error) {
    res.send(error.toString());
  }
});

//for login in bike app
router.post("/bike/login", async (req, res) => {
  try {
    const user = await User.findByCredentails(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthtoken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

//for logout from bike app

router.post("/bike/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
