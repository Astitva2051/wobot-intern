var express = require("express");
var router = express.Router();
const users = require("../models/users");
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get("/list",verifyToken, (req, res, next) => {
  users
    .find({}, {lastName:0,firstName:0,_id:0,password:0,__v:0})
    .then(
      (users) => {
        res.status(200).json(users);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/details",verifyToken, (req, res, next) => {
  users
    .find({})
    .then(
      (users) => {
        res.status(200).json(users);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
