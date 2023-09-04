import moment from "moment/moment";

export function timeDifference(start, end) {
    let all = moment(`24:00`, "HH:mm")
    let delayStart = moment(start, "HH:mm")
    let delayEnd = moment(end, "HH:mm")
    let durationDelay, hoursDelay, minutesDelay
    if (delayEnd.isBefore(delayStart)) {
        let duration1 = moment.duration(delayStart.diff(delayEnd))
        let hoursDelay1 = parseInt(duration1.asHours());
        let minutesDelay1 = parseInt(duration1.asMinutes()) - hoursDelay1 * 60;
        let duration2 = moment(`${(('0' + Math.abs(hoursDelay1)).slice(-2))}:${(('0' + Math.abs(minutesDelay1)).slice(-2))}`, "HH:mm")
        durationDelay = moment.duration(all.diff(duration2))
        hoursDelay = parseInt(durationDelay.asHours());
        minutesDelay = parseInt(durationDelay.asMinutes()) - hoursDelay * 60;
    } else {
        durationDelay = moment.duration(delayEnd.diff(delayStart));
        hoursDelay = parseInt(durationDelay.asHours());
        minutesDelay = parseInt(durationDelay.asMinutes()) - hoursDelay * 60;
    }

    if (!isNaN(parseInt(hoursDelay)) && !isNaN(parseInt(minutesDelay))) {
        return `${(('0' + Math.abs(hoursDelay)).slice(-2))}:${(('0' + Math.abs(minutesDelay)).slice(-2))}`
    }
    return '00:00'

}