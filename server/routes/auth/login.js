require("dotenv").config();
var express = require("express");
var router = express.Router();
const User = require("../../models/users");
const jwt = require("jsonwebtoken");


router.post("/", async (req, res, next) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    } else {
      const user = await User.findOne({ username });

      if (user && password === user.password) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, username },
          process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).cookie("access_token", token, {
          httpOnly: true,
        }).send("Login Successful");
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
