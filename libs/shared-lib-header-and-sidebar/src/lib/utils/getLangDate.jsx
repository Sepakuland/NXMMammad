import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian from "react-date-object/calendars/gregorian";


export function getLangDate(lang,data) {
    let date = new DateObject(data);
    switch (lang) {
        case 'fa':
            date.convert(persian);
            break;
        case 'ar':
            date.convert(arabic);
            break;
        default:
            date.convert(gregorian);

    }
    return date.format()
}