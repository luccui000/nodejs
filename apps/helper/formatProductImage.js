module.exports.formatText = function(product_id) {
    const date = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date);
    var date_formated = day + month + year;
    return  "PRO" + product_id + date_formated;
}