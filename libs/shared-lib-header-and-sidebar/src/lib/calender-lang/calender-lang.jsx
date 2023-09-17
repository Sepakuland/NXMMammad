
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import arabic from 'react-date-object/calendars/arabic';
import gregorian from 'react-date-object/calendars/gregorian';
import arabic_ar from 'react-date-object/locales/arabic_ar';
import gregorian_en from 'react-date-object/locales/gregorian_en';

export function renderCalendarSwitch(param) {
  switch (param) {
    case 'fa':
      return persian
    case 'en':
      return gregorian
    case 'ar':
      return arabic
      default:
        break;
  }
}
export function renderCalendarLocaleSwitch(param) {
  switch (param) {
    case 'fa':
      return persian_fa
    case 'en':
      return gregorian_en
    case 'ar':
      return arabic_ar
      default:
        break;
  }
}
