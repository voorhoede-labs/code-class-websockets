    const serverSentEvents = new EventSource('/');
    const collectionContainer = document.querySelector('[data-collection]');
    const artTitleContainer = document.querySelector('[data-art-title]');
    const artImagecontainer = document.querySelector('[data-art-image]');
    const textContainer = document.querySelector('[data-text-container]');
    const stopStream = document.querySelector('[data-stop-eventstream]');
    const stopSocket = document.querySelector('[data-stop-websocket]');
    const websocket = new WebSocket('ws://localhost:8080');
    const votingCounter = document.querySelector('[data-voting-counter]');

    let artCollectionImageUrl = [];
    let objectURL = '';
    let imageUrl = ''; 
    let artObject;
    let imgEl;
    let imgId;
    let votes;

    // server-sent-events (SSE) and xhr
    // streaming images 
    serverSentEvents.onmessage = function(e) {
        artObject = JSON.parse(e.data);
                
        if(artObject.url != undefined){
            artCollectionImageUrl.push(artObject.url);
            
            Promise.all(artCollectionImageUrl).then(function(){
                return getImageFromUrl();
            });
        }   

        if(artObject.title != undefined) {
            let textEl = document.createElement('h3');
            textEl.innerText = artObject.title;
        
            return combineWithText(textEl);
        }

        if(artObject.id != undefined){
            let upVoteButton = document.createElement('button');
        
            upVoteButton.innerText = 'Up Vote';
            upVoteButton.setAttribute('id', artObject.id);
            var votes = 0;
        
            upVoteButton.addEventListener('click', function(e) {
                votes++;

            var artObjectScore = {
                'id': e.currentTarget.id,
                'votes': JSON.stringify(votes)
            }
            return websocket.send(JSON.stringify(artObjectScore));
        });

        return combineWithText(upVoteButton);
    }

};

function getImageFromUrl() {
    for(artUrl of artCollectionImageUrl){
        // fetch each image
        fetch(artUrl).then(function(response){    
            response.blob().then(function(imageBlob) {
                return blobToImage(imageBlob);
            });
        }).then(function(){ 
            // garbage collection
            artCollectionImageUrl = [];
        });
    }
}

function blobToImage(imageBlob){
    objectURL = URL.createObjectURL(imageBlob);
    createImageElements(objectURL);
};

function createImageElements(objectURL){
    imgContainer = document.createElement('div');
    imgEl = document.createElement('img');
    imgEl.setAttribute('src', objectURL);
    imgEl.setAttribute('width', 500);
    imgContainer.appendChild(imgEl);

    combineWithText(imgContainer);   
}

function combineWithText(content){
    artImagecontainer.appendChild(content);
}

// WEBSOCKETS (WS)

// websocket = object

// add the different methods and log results

// onopen(e)

// onmessage(message)
/* 
    add this in de callback function
    votes = JSON.parse(message.data);
    votingCounter.innerText = votes.votes;
*/

// onerror(e)

// onclose(e)

// on refresh close stream connections
stopStream.addEventListener('click', () => {
    serverSentEvents.close();    
});

stopSocket.addEventListener('click', () => {  
    websocket.close();
});

window.onbeforeunload = () => {
    setTimeout(() => {
        serverSentEvents.close(); 
        websocket.onclose = function () {}; // disable onclose handler first
        websocket.close()
    },3000);
};