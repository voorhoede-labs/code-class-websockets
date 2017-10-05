const serverSentEvents = new EventSource('/path-to-endpoint');
const stopStream = document.querySelector('[data-stop-eventstream]');
const streamTarget = document.querySelector('[data-stream-target]');
let artCollectionImageUrl = [];
let objectURL = '';
let imageUrl = ''; 
let imgEl = '';
let imgId = '';
let votes = '';

// server-sent-events (SSE) and Fetch API
serverSentEvents.onmessage = e => {
    let streamedObject = JSON.parse(e.data);    
    let artObject = {
        title: streamedObject.title,
        url: streamedObject.url,
        id: streamedObject.id
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
    imgContainer.classList.add('image-stream-item');
    imgContainer.innerHTML = `
        <div class="image-container" data-image-id="${artObject.id}">
            <img src="${artObject.imageUrl}" class="image" />
            <span class="image-title">${artObject.title}</span>
        </div>`;
    return streamTarget.appendChild(imgContainer);
}

// on refresh close stream connections
window.addEventListener('beforeunload', () => {
    serverSentEvents.close();
});

stopStream.addEventListener('click', () => {
    serverSentEvents.close();    
});