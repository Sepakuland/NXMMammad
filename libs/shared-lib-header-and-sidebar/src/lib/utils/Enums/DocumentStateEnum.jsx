export const documentStates = {
    Draft: -1, // پیش‌نویس
    Nonbinding: 0,   // غیرقطعی
    Binding: 1,  // قطعی
    Permanent: 2,    // دائم
}
export const ParseDocumentStatesEnum = (input) => {
    let documentState;
    if (input === documentStates.Draft) {
        documentState = "Draft";
    } else if (input === documentStates.Nonbinding) {
        documentState = "Nonbinding";
    } else if (input === documentStates.Binding) {
        documentState = "Binding";
    } else if (input === documentStates.Permanent) {
        documentState = "Permanent";
    }
    return documentState
}