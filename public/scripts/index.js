const serverSentEvents = new EventSource('/');
const stopStream = document.querySelector('[data-stop-eventstream]');
let artCollectionImageUrl = [];
let objectURL = '';
let imageUrl = ''; 
let artObject = {};
let imgEl = '';
let imgId = '';
let votes = '';

// server-sent-events (SSE) and xhr
// streaming images 
serverSentEvents.onmessage = e => {
    let streamedObject = JSON.parse(e.data);    
    artObject = {
        title: streamedObject.title,
        url: streamedObject.url
    }
    getImageFromUrl(artObject);
};

const getImageFromUrl = artObject => {
    fetch(artObject.url).then(response => {
        response.blob().then(imageBlob => {
            artObject['imageBlob'] = imageBlob;
            blobToImage(artObject);
        });
    });
}

const blobToImage = artObject => {
    objectURL = URL.createObjectURL(artObject.imageBlob); 
    artObject['imageUrl'] = objectURL;
    createImageElements(artObject);
};

const createImageElements = artObject => {
    const imgContainer = document.createElement('div');
    imgContainer.innerHTML = `
        <div class="image-container">
            <img src=${artObject.imageUrl} class="image" />
            <span class="image-title">${artObject.title}</span>
        </div>`;
    return document.body.appendChild(imgContainer);
}

// on refresh close stream connections
window.addEventListener('beforeunload', () => {
    serverSentEvents.close();
});

stopStream.addEventListener('click', () => {
    serverSentEvents.close();    
});