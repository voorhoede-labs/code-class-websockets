const express = require('express');
const router = express.Router();
const fs = require('fs');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
const request = require('request');
let collection;
const requestUrl = 'https://www.rijksmuseum.nl/api/nl/collection?ps=1&key=imrDormX&format=json&type=schilderij';

router.get('/', function(req, res, next) {
    /* 
        Sever Sent Event 
    */
    if (req.headers.accept == 'text/event-stream') {
        sendSSE(req, res);
    } else {
        res.write(fs.readFileSync(__dirname + '/../public/index.hbs'));
        res.end();
    }

    function sendSSE(req, res) {
        //specific head with content-type needed to create stream        
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        });

        // trigger a change each second
        // this should be an event from the api that indicates there are new items.
        setInterval(function() {
            request(requestUrl, function(req, res) {
                collection = JSON.parse(res.body);
                return collection;
            });
            if(collection != undefined) {
                constructSSE(res, collection);
            } 
        }, 6000);
    
    }

    function constructSSE(res, collection) {
        collection = collection.artObjects;
        collection.forEach((art) => {
            //server sent event stream format: start with data: + object + \n\n
            res.write(
                'data: '+ 
                JSON.stringify({
                    id: art.id,
                    title: art.title,
                    url: art.webImage.url})
                + '\n\n');
        });
    }
});

module.exports = router;