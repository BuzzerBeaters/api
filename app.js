const express = require('express')
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.basketball-reference.com/boxscores/';

app.use(express.json());

const port = process.env.PORT || 3000;

const fetchData = async () => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};



const yolo = async () => {
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

  return data;
}

app.get('/games', async (_, res) => {
  const data = await yolo();
  res.send(data)
})

app.get('/', (_, res) => res.send('It works \o/'))

app.listen(port, () => console.log(`listening on port ${port}!`))

