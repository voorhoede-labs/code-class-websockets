const constructSSE = (res, collection) => {
    collection = collection.artObjects;
    collection.forEach(art => {
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

module.exports = constructSSE;