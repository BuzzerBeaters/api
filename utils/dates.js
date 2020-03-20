const dateFormat = require('dateformat');

module.exports = getDates = (start, end) => {
  const days = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  while (startDate <= endDate) {
    days.push(dateFormat(startDate, 'yyyy-mm-dd'))
    startDate.setDate(startDate.getDate() + 1);
  }
  return days;
}
