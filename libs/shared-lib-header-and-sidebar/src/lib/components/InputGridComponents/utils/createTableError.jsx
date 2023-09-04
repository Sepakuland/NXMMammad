export function CreateTableError(errorObject) {
    let errorMSG = ""
    for (var key in errorObject) {
        if (errorObject[key] != null && errorObject[key] !== "" && errorObject[key] !== 0)
            errorMSG += `${errorObject[key]}. `
    }
    return errorMSG
}

