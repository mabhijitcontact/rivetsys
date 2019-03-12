const express = require("express");
const router = express.Router();
const utility = require("./utility")


router.get("/", (req, res, next) => {
    var searchItem = req.query.q;
    var retJson = utility.getLatLong(searchItem)
    retJson.then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
    
});

module.exports = router;