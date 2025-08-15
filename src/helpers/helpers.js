const { format, register } = require('timeago.js')
const moment = require('moment');


const helpers = {};

helpers.timegoOfMoment = timestamp => {
    // return moment(timestamp, moment.locale('es_MX')).startOf('minute').fromNow();
    return moment(timestamp, moment.locale('es_MX')).fromNow();
}

helpers.showDateByProfileUser = (date) => {
    const lengthTime = 10;
    const dateString = date.toISOString();

    const getDate = dateString.slice(0, lengthTime);
    const isDate = new Date(getDate);

    const month = isDate.toLocaleString('es-MX', { month: 'long' });

    const positionDate = getDate.split('-').reverse();
    const filterDate = positionDate.filter((e, index) => index !== 1);
    const declareDate = `${month} ${filterDate.join(', ')}`; // show date of mode => Octubre 12, 2024
    return declareDate;

}



module.exports = helpers

