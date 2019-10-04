/**
 * returns array of date in MMM DD YYY HH:MM:SS and one of below:
 * less than a min ago, # hours ago, # days ago, day: MMM DD YYYY (if it's more than a month)
 * @param {string} date date format
 * 
 */
export function dateDisplay(date: number): Array<string> {
    let delta = (Date.now() - +new Date(date))/1000000 ;
    let dayString = (new Date(date)).toString();
    // date format: MMM DD YYYY
    let day = dayString.slice(4, 7) + ' ' + dayString.slice(8, 10) + ' ' + dayString.slice(11, 15);
    //  date format: MMM DD YYYY HH:MM:SS
    let dayAndTime = day + ' ' + dayString.slice(16, 24);
    if( delta >= 2628 ) {
        // more than a month ago
        return [dayAndTime, day];
    } else if( delta < 2628 && delta >= 86.4) {
        // less than a month ago, but more than a day ago
        let days = (delta/(86.4)).toFixed(0);
        return [dayAndTime, days + ' days ago'];
    }
    else if( delta < 86.4 && delta >= 3.6) {
        return [day, (delta/3.6).toFixed(0) + ' hours ago'];
    } else if(delta < 3.6 && delta >= 0.06) {
        return [dayAndTime, ((delta)*10).toFixed(0) + ' min ago'];
    } else {
        return [dayAndTime, 'less than a min ago']
    };
};