require('dotenv').config()

const rp = require('request-promise');
const $ = require('cheerio');
const url = process.env.URL;
const {getShows, filterShows} = require('./parseShows');
const schedule = require('node-schedule');
const { createTransport } = require('./emailService')

start()
function start(){
  console.log('\x1b[33mStarted program! @ %o\x1b[0m', new Date()); 
  createTransport();
  getSite()
  //schedule.scheduleJob('0 0 * * *', () => { getSite() })
}

//Get tv-shows
//$('h2 > div', html)[i].children[0]


function getSite() {
  var start = new Date()
  console.log("Started getting programs! at %o",start)
  rp(url)
    .then((html) => {
      //success!

      const titles = [];

      for (let i = 0; i < $('header > a', html).length; i++) {

        var title = $('header > a', html)[i].attribs.href
        var data = $('header > a', html)[i].attribs.title
 
        if (title.startsWith('/')) {
          titles.push({ title: title, channel: data })
        }
      }
      return Promise.all(
        titles.map((item) => {
          return getShows(process.env.URL1 + item.title, item.channel)
        })
      )
    }).then( async (shows) => {
      var date = new Date();
      console.log("Shows updated! %o time taken: %dms", date, ((date - start) / 1000))
      await filterShows(shows)

    })
    .catch((err) => {
      //handle error
    });

}