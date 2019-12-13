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

                if (title.includes("a:")) {
                    parsedTitle = title.split(":")[1].split("(")[0].trim();
                }
                if (title.includes("(")) {
                    parsedTitle = title.split("(")[0].trim();
                }
                shows.push({
                    id: i,
                    time: time,
                    title: parsedTitle,
                    channel: channel
                });
                process.stdout.write(" " + i + "/" + $('h2 > div', html).length + " parsed ");
                process.stdout.cursorTo(0);
            }

            let showList = { channel: channel, shows: shows }
            createJson(showList)
            return showList;
        })
        .catch((err) => {
            console.log(err + " @" + Date());
        });
}

function load(i) {
    var h = ['|', '/', '-', '\\'];
    return h[i]
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
        email[0].map((item) => {
            text += item.title + " @ " + item.time + " from channel: " + item.channel + "\n"        
        })
        sendMail(text)
    }
    console.log("Filtering Done! %o", new Date())

}
module.exports = {
    getShows: getShows,
    filterShows: filterShows
};
