const setTimeFormat = ( time : Date ) => {
    const year = time.getFullYear();
    const month = time.getMonth()+1;
    const date = time.getDate();
    const hour = time.getUTCHours();
    const minute = time.getUTCMinutes();
    const result = year + "-" + month + "-" + date + "-" + hour + ":" + minute;
    return result
};

module.exports = setTimeFormat;

// date -> Date type
// date.getFullYear() => 2021
// date.getMonth()+1 => 7 (7월) 0부터 시작 1더해야함
// date.getDate() => 4 (4일)
// date.getUTCHours => 10 (10시)
// date.getUTCMinutes() => 30 (30분)
// ​
// 2021-7-4-10:30 형식을 수정하기