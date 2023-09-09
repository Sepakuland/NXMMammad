import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

const MyFooterSome = props => {
    const [total, setTotal] = useState(0)
    useEffect(() => {
        if (props.data?.length) {
            let tempTotal = props?.data?.reduce(
                (acc, current) => acc + (parseFloat(current[props.field]) || 0),
                0
            );
            setTotal(tempTotal)
        }
        else if (props?.officeTotalData?.length) {

            let tempTotal = props?.officeTotalData?.reduce(
                (acc, current) => acc + (parseFloat(current[props.field]) || 0),
                0
            );
            setTotal(tempTotal)
        }
        else if (props.totalDocumemt?.length) {
            let tempTotal = props?.totalDocumemt?.reduce(
                (acc, current) => acc + (parseFloat(current[props.field]) || 0),
                0
            );
            setTotal(tempTotal)
        }
        else {
            setTotal(0)
        }

    }, [props])


    return (
        <td colSpan={props.colSpan} className={` word-break ${props?.className ? props?.className : ''}`} style={props.style}>
            <Tooltip title={total?.toLocaleString()}>
                <div>{total?.toLocaleString()}</div>
            </Tooltip>

        </td>
    );
};

export default React.memo(MyFooterSome)