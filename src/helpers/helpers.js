const { format, register } = require('timeago.js')
const moment = require('moment');


const helpers = {};

helpers.timeAgoOfMoment = timestamp => {
    // return moment(timestamp, moment.locale('es_MX')).startOf('minute').fromNow();
    return moment(timestamp, moment.locale('es_MX')).fromNow();
}



helpers.showDate = (date) => {
  return new Date(date).toLocaleString('es-MX', { day: '2-digit', weekday: 'short', month: 'short', year: 'numeric' })
}



module.exports = helpers

