const express = require('express')
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');

let today = new Date();
today.setDate(today.getDate() - 1); 
let dd = today.getDate();

let mm = today.getMonth()+1; 
const yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
}
const url = `https://www.covers.com/Sports/NBA/Matchups?selectedDate=${yyyy}-${mm}-${dd}`;
console.log(url)

const port = process.env.PORT || 3000;

const fetchData = async () => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};



const getGamesData = async () => {
  const $ = await fetchData();
  const data = [];
  $('.cmg_matchup_game_box').each((_, element) => {
    const obj = {}
    obj.teamA = $(element).find('.cmg_matchup_list_column_1 .cmg_team_name').text().replace(/[^A-Za-z]/g, "")
    obj.teamB = $(element).find('.cmg_matchup_list_column_3 .cmg_team_name').text().replace(/[^A-Za-z]/g, "")

    const scoreA = $(element).find('.cmg_matchup_list_score_away').text()
    const scoreB = $(element).find('.cmg_matchup_list_score_home').text()

    obj.delta = Math.abs(parseInt(scoreA, 10) - parseInt(scoreB));

    data.push(obj);
  });

  return data.sort((a, b) => a.delta > b.delta);
}

const renderGames = (data) => {
  return `<li class='game'>
    <span class='team'>
    <img sr=icons/${makeName(data.teamA)}.svg>
    ${makeName(data.teamA)}
    </span>
    <span class='vs'>-</span>
    <span class='team'>${makeName(data.teamB)}</span>
  </li>`
}

const makeName = (name) => {
  const PRESETS = {
    NY: 'NYC',
    GS: 'GSW',
    SA: 'SAS',
    BK: 'BKL'
  }

  return PRESETS[name] || name;
}

app.get('/', async (_, res) => {
  const games = await getGamesData();
  let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SAMPLE</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet"> 
    <style>
      body {
        background: black;
        color: white;
        margin: 0;
        padding:0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 100vh;
      }
      .games {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
      .game {
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        font-family: 'Roboto Mono'
      }
      .games .game:nth-child(1) {
        text-shadow: 0 0 8px rgba(255, 255, 255, .9);
      }
      .games .game:nth-child(2) {opacity:.8}
      .games .game:nth-child(3) {opacity:.6}
      .games .game:nth-child(4) {opacity:.4}
      .games .game:nth-child(5) {opacity:.3}
      .games .game:nth-child(6) {opacity:.2}
      .games .game:nth-child(7) {opacity:.1}
      .games .game:nth-child(8) {opacity:.1}
      .games .game:nth-child(9) {opacity:.1}
      .games .game:nth-child(10) {opacity:.08}
      .games .game:nth-child(11) {opacity:.06}
      .games .game:nth-child(12) {opacity:.04}
      .games .game:nth-child(13) {opacity:.02}
      .games .game:nth-child(14) {opacity:.01}
      .team {
        font-size: 1.4rem;
        line-height: 1.6;
        width: 4rem;
        display: inline-block;
      }
      .game .team:first-child {
        text-align: right;
      }
      .vs {
        padding: 0 .6rem;
      }
    </style>
  </head>
  <body>
    <ul class="games">`;

  games.map(game => {
    html += renderGames(game)
  })

  html += '</ul></body></html>';
  res.send(html)
})

// app.get('/', (_, res) => res.send('It works \o/'))

app.listen(port, () => console.log(`listening on port ${port}!`))

