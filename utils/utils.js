export function parseDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const parsedDate =  new Date(year, month, day, 12);
    if (isNaN(parsedDate.getTime())) {
        return new Date();
    }

    return parsedDate;
}
