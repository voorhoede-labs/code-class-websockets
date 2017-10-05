const express = require('express');
const router = express.Router();
const fs = require('fs');
const sendSSE = require('../helpers/send-sse');

router.get('/', (req, res, next) => {
    res.write(fs.readFileSync(__dirname + '/../public/index.hbs'));
    res.end();
});

router.get('/path-to-endpoint', (req, res) => {
    /* Sever Sent Event */
    if (req.headers.accept === 'text/event-stream') {
        sendSSE(req, res);
    } else {
        res.write(fs.readFileSync(__dirname + '/../public/index.hbs'));
        res.end();
    }   
});

module.exports = router;