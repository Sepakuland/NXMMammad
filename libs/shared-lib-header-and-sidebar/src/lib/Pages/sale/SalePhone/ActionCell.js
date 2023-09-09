import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";





const ActionCell = (props) => {

    const { t, i18n } = useTranslation();

    console.log('props', props)


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn'>
                            <Link to={`/Sell/sellPhone/EditForm?id=${props.dataItem.PartnerId}`}>
                                <EditIcon />
                            </Link>
                        </IconButton >
                    </Tooltip>
                </div>
            </td>


        </>

    )
}

export default React.memo(ActionCell)