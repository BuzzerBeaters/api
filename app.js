const express = require('express')
const app = express();

const GAMES = require('./DATA')

const port = process.env.PORT || 3000;

const renderGames = (data) => {
  return `<li class='game'>
    <span class='team'>
    <img sr=icons/${makeName(data.teamA)}.svg>
    ${makeName(data.teamA)}
    </span>
    <span class='vs'>-</span>
    <span class='team'>${makeName(data.teamB)}</span>
    <span>${data.date}</span>
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
  let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>I want basketball</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet"> 
    <style>
      body {
        background: black;
        color: white;
        display: flex;
        justify-content: center;
      }
      .games {
        margin: 2rem;
      }
      .game {
        line-height: 1;
        font-family: 'Roboto Mono';
        color: #555;
      }
      .team {
        font-size: 1.4rem;
        line-height: 1.6;
        width: 4rem;
        display: inline-block;
        color: white;
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
    <ol class="games">`;

    GAMES.sort((a,b) => a.delta > b.delta ? 1 : -1).map(game => {
    html += renderGames(game)
  })

  html += '</ol></body></html>';
  res.send(html)
})

// app.get('/', (_, res) => res.send('It works \o/'))


app.use(express.static('assets'))

app.listen(port, () => console.log(`listening on port ${port}!`))

