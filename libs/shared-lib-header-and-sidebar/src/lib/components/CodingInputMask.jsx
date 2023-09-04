import Input from "react-input-mask";
import React from "react";

function CodingInputMask({ value, handleValueChange, maskExpression }) {
    let v = ""
    Array.isArray(value) ?
        v = value[0].replaceAll('۰', '0').replaceAll('۱', '1').replaceAll('۲', '2').replaceAll('۳', '3').replaceAll('۴', '4').replaceAll('۵', '5').replaceAll('۶', '6').replaceAll('۷', '7').replaceAll('۸', '8').replaceAll('۹', '9')
        : v = value.replaceAll('۰', '0').replaceAll('۱', '1').replaceAll('۲', '2').replaceAll('۳', '3').replaceAll('۴', '4').replaceAll('۵', '5').replaceAll('۶', '6').replaceAll('۷', '7').replaceAll('۸', '8').replaceAll('۹', '9')
    return (
        <Input
            className="form-input"
            style={{ direction: "ltr" }}
            mask={maskExpression}
            maskChar="–"
            onChange={(e) => handleValueChange(e)}
            value={v}
            alwaysShowMask={true}
        />
    );
}

export default React.memo(CodingInputMask)