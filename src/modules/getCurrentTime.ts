module.exports = () => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const hour = time.getUTCHours();
    const minute = time.getUTCMinutes();
    const result = new Date(Date.UTC(year, month, date, hour, minute));
    return result;
};