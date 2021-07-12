module.exports = ( time: Date, check: number ) => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hour = time.getUTCHours();
    const minute = time.getUTCMinutes();
    const result = year + "-" + month + "-" + date + "-" + hour + ":" + minute;
    return result;
};