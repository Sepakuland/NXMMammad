import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import {  Tooltip } from "@mui/material";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";




const ActionCell = (props) => {

    const { t, i18n } = useTranslation();


    const location = useLocation()
    const { pathname,search } = location


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn'>
                            <Link to={`${pathname}/EditForm?id=${props.dataItem.PartnerId}`} state={{prevPath:pathname+search}}>
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