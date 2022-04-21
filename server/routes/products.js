const express = require("express");
const fs = require("fs");
const multer = require("multer");
const products = require("../models/product");
const csv = require("fast-csv");
const verifyToken = require('../middleware/verifyToken');

const Router = express.Router;
const router = new Router();

const upload = multer({ dest: "uploads/" });

router.get("/",verifyToken, (req, res, next) => {
  products
    .find({})
    .then(
      (products) => {
        console.log(products);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(products);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post("/create",verifyToken, upload.single("file"), (req, res,next) => {
  const fileRows = [];
  csv
    .parseFile(req.file.path, { headers: true })
    .on("data", function (data) {
      data._createdBy=req.user.username;
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows);
      products
        .insertMany(fileRows)
        .then(
          (products) => {
            fs.unlinkSync(req.file.path);
            res.statusCode = 200;
            res.send("Products added");
            
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
});

module.exports = router;