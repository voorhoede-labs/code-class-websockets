const constructSSE = require('./construct-sse');
const request = require('request');
let collection;
const requestUrl = 'https://www.rijksmuseum.nl/api/nl/collection?ps=1&key=imrDormX&format=json&type=schilderij';

const sendSSE = (req, res) => {
    //specific head with content-type needed to create stream        
    res.writeHead(200, {
        'Content-Type': 'text/event-stream'
    });
    // this should be an event from the api that indicates there are new items.
    // now for illustration purposes it will be invoked on interval
    setInterval(() => {
        request(requestUrl, (req, res) => {
			if(res){
				collection = JSON.parse(res.body);
				return collection;
			} else {
				return;
			}
        });
        if(collection != undefined) {
			constructSSE(res, collection);
        } 
    },2000);
}

module.exports = sendSSE;