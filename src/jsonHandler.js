const fs = require('fs')


function createJson(shows) {
    fs.writeFileSync('./channels/' + shows.channel + '.json', JSON.stringify(shows.shows) + "\n");
}

function readJson(category){
    const data = fs.readFileSync('/home/emilt/Test/nodeTest/webScrape1/toWatch/'+category+'.json').toString();
    return JSON.parse(data);
}



module.exports = {
    createJson: createJson,
    readJson: readJson
}