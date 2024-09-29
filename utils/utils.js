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

export function getFirstDayOfWeek(year, week) {
    const firstDayOfYear = new Date(year, 0, 1);
    
    const daysOffset = firstDayOfYear.getDay() <= 1 ? 1 - firstDayOfYear.getDay() : 8 - firstDayOfYear.getDay();
    const firstMonday = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
    
    const firstDayOfWeek = new Date(firstMonday.setDate(firstMonday.getDate() + (week - 1) * 7));
    
    return firstDayOfWeek;
}

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}