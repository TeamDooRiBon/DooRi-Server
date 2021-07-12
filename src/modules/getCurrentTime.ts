module.exports = () => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const hour = time.getHours() + 9;
    const minute = time.getMinutes();
    const result = new Date(Date.UTC(year, month, date, hour, minute));
    return result;
};