import CurrencyInput from "react-currency-input-field"

const InputGridCurrencyInput = (props) => {
    return (
        <CurrencyInput
            className={`form-input`}
            decimalsLimit={2}
            autoComplete="off"
            {...props}
        />
    )
}
export default InputGridCurrencyInput