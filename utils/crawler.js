const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const getDates = require('./dates')

const init = async () => {
  fs.appendFileSync('DATA.json', '')
  const DATES = getDates('2019-10-22', '2020-03-11')
  // const DATES = getDates('2019-10-22', '2019-10-23')
  DATES.map(async date => {
    await getGamesData(date)
  })
}

const fetchData = async (date) => {
  const url = `https://www.covers.com/Sports/NBA/Matchups?selectedDate=${date}`;
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

const getGamesData = async (date) => {
  const $ = await fetchData(date);
  $('.cmg_matchup_game_box').each((_, element) => {
    const obj = {}
    obj.teamA = $(element).find('.cmg_matchup_list_column_1 .cmg_team_name').text().replace(/[^A-Za-z]/g, "")
    obj.teamB = $(element).find('.cmg_matchup_list_column_3 .cmg_team_name').text().replace(/[^A-Za-z]/g, "")

    const scoreA = $(element).find('.cmg_matchup_list_score_away').text()
    const scoreB = $(element).find('.cmg_matchup_list_score_home').text()

    obj.delta = Math.abs(parseInt(scoreA, 10) - parseInt(scoreB));
    obj.sum = Math.abs(parseInt(scoreA, 10) + parseInt(scoreB));

    obj.date = date

    fs.appendFileSync('DATA.json', JSON.stringify(obj, null, 2) + ',')
  });
}

// Launch
init()
