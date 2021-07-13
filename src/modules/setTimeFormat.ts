module.exports = ( time: Date, check: number ) => {
    const year = time.getUTCFullYear();
    const month = time.getUTCMonth() + 1;
    const date = time.getUTCDate();
    const hour = time.getUTCHours();
    const minute = time.getUTCMinutes();
    const result = year + "-" + month + "-" + date + "-" + hour + ":" + minute;
    return result;
};