import React, { useEffect, useState } from "react";
import n2words from 'n2words';



const StingFooterSome = props => {
    const [total, setTotal] = useState(0)


    useEffect(() => {
        if (props.data?.length) {
            let tempTotal = props?.data?.reduce(
                (acc, current) => acc + parseFloat(current[props.fieldSome]),
                0
            );
            setTotal(tempTotal)
        }

    }, [props.data])

    return (
        <td colSpan={3} className={` word-break ${props?.className ? props?.className : ''}`} style={props.style}>
            {n2words(total, { lang: (props.lang) })}
        </td>
    );
};

export default StingFooterSome