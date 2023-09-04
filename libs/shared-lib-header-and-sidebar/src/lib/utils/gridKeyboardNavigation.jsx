export function AddTableRow(addRowFunc, focusOn, index) {
    addRowFunc()
    setTimeout(() => {
        focusOn.current[index + 1].focus()
        focusOn.current[index + 1].select()
    }, 50);
}

export function MoveForward(formikTable, rowBuilderFunc, currentElement, nextElement, index, lastFocusableCellIndex){
    if (currentElement.current[index].closest("td").cellIndex === lastFocusableCellIndex) {
        if (index === formikTable.length - 1) {
            AddTableRow(rowBuilderFunc, nextElement, index)                   
        }
        else {
            nextElement.current[index + 1].focus()
            nextElement.current[index + 1].select()
        }
    }
    else {
        nextElement.current[index].focus()
        nextElement.current[index].select()
    }
}
export function MoveBack(currentElement, previousElement, index){
    if (currentElement.current[index].closest("td").cellIndex === 1 && index !== 0) {
        previousElement.current[index - 1].focus()
        previousElement.current[index - 1].select()
    }
    else {
        previousElement.current[index].focus()
        previousElement.current[index].select()
    }
}
