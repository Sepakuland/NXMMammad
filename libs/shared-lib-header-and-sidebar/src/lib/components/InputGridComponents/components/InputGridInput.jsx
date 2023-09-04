import { useState } from "react"

const InputGridInput = ({ inputType = "text", ...props }) => {
    const [type, setType] = useState(inputType)
    return (
        <input
            className="form-input"
            type={type}
            autoComplete="off"
            {...props}
        />
    )
}
export default InputGridInput