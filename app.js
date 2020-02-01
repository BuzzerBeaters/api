const express = require('express')
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.basketball-reference.com/boxscores/';

const port = process.env.PORT || 3000;

const fetchData = async () => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};



const getGamesData = async () => {
  const $ = await fetchData();
  const data = [];
  $('.teams').each((_, element) => {
    const obj = {}
    obj.loser = $(element).find('.loser td a').text().replace('Final', '')
    obj.winner = $(element).find('.winner td a').text().replace('Final', '')

    const score1 = $(element).find('.loser .right').first().text()
    const score2 = $(element).find('.winner .right').first().text()

    obj.delta = Math.abs(parseInt(score1, 10) - parseInt(score2));

    data.push(obj);
  });

  return data.sort((a, b) => a.delta > b.delta);
}

const renderGames = (data) => {
  const randomizr = Math.random() < 0.5;
  return `<li class='game'>
    <span class='team'>${randomizr ? data.winner.substr(0, 3) : data.loser.substr(0, 3)}</span>
    <span class='vs'>vs</span>
    <span class='team'>${randomizr ? data.loser.substr(0, 3) : data.winner.substr(0, 3)}</span>
  </li>`
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
    <link href="https://fonts.googleapis.com/css?family=Bangers&display=swap" rel="stylesheet"> 
    <style>
      body {
        background: black;
        color: white;
        margin: 0;
        padding:0;
      }
      .games {
        padding: 0;
        margin: 0;
        list-style: none;
        height: 100vh;
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
        font-family: "Bangers";
      }
      .team {
        font-size: 5rem;
        line-height: 1;
      }
      .vs {
        font-size: 3.5rem;
        padding: 0 2rem;
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

