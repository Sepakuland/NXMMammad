export function CreateQueryString(obj) {
    let queryString = ""
    for (var key in obj) {
        if (Array.isArray(obj[key])) {
            if (Array.isArray(obj[key]) && obj[key].length === 2 && obj[key][0] === null && obj[key][1] === null) {
                continue; // Skip the 'date=[null,null]' parameter
            }
            if (obj[key] != null && obj[key] !== "" && obj[key] !== 0 && obj[key]?.length > 0)
                queryString += `${key}=${obj[key]}&`
        }
        else {
            if (obj[key] != null && obj[key] !== "" && obj[key] !== 0)
            queryString += `${key}=${obj[key]}&`
        }
    }
    return queryString.substring(0, queryString.length - 1);
}