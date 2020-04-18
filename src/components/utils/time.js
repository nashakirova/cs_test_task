export const transformDate = (numericDate) => {
    let initialDate = new Date(numericDate);
    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    let date = initialDate.getDate();
    let month = months[initialDate.getMonth()];
    let year = initialDate.getFullYear();
    let hour = initialDate.getHours();
    let minutes = initialDate.getMinutes();
    return `${year} ${month} ${date} ${hour}:${minutes}`;
}