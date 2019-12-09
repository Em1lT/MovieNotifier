const rp = require('request-promise');
const $ = require('cheerio');
const { readJson, createJson } = require('./jsonHandler')
const { sendMail } = require('./emailService')

getShows = (url, channel) => {

    return rp(url)
        .then((html) => {
            const shows = [];
            console.log("\x1b[34mParsing data from channel:\x1b[0m", channel)
            for (let i = 0; i < $('h2 > div', html).length; i++) {

                let time = $('div > time', html)[i].children[0].data
                let title = $('h2 > div', html)[i].children[0].data
                let parsedTitle = title;
                
                if(title.includes("a:")){
                    parsedTitle = title.split(":")[1].split("(")[0].trim();
                    console.log("%s parsed in to: %s",title , parsedTitle)
                } 
                if(title.includes("(")) {
                    parsedTitle = title.split("(")[0].trim();
                    console.log("%s parsed in to: %s",title , parsedTitle)
                }
                shows.push({
                    id: i,
                    time: time,
                    title: parsedTitle,
                    channel: channel
                });
            }
            let showList = { channel: channel, shows: shows }
            createJson(showList)
            return showList;
        })
        .catch((err) => {
            console.log(err +" @"+ Date());
        });
}

async function filterShows(shows) {
    console.log("Started looking for favorite movies! %o", new Date())

    let movies = await readJson("movies")
    const intersection = shows.map(item => item.shows.filter(element =>
        movies.movies.includes(element.title.toLowerCase()
        )
    )
    );

    const email = intersection.filter((item) => item.length >= 1);
    if (email.length == 0) {
        console.log("No listed movies Found %o", new Date())
    } else {
        let text = ""; 
        for (let item in email) {
            text += email[item][0].title+ " @ "+email[item][0].time+" from channel: "+email[item][0].channel+"\n"
        }
        sendMail(text)
    }
    console.log("Filtering Done! %o", new Date())

}
    module.exports = {
        getShows: getShows,
        filterShows: filterShows
    };
