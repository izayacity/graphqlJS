/**
 * Created by Francis Yang on 5/23/17.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/graphql', function(req, res, next) {
    res.send('Now browse to /graphql');
});

module.exports = router;
