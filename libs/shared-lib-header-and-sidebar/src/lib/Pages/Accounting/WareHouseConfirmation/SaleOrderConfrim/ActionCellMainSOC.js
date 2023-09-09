import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import { useLocation } from "react-router";
import CheckIcon from '@mui/icons-material/Check';


const ActionCellMainSOC = (props) => {

    const [openRemove, setOpenRemove] = useState(false)
    const { t, i18n } = useTranslation();
    const [anchorPrint, setAnchorPrint] = useState(null);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 4,
        direction: i18n.dir()
    };
    const location = useLocation()
    const { pathname } = location


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >
                    <Tooltip title={t("تایید")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => console.log('confrim', props.dataItem.PersonnelCode)}>
                            <CheckIcon />
                        </IconButton >
                    </Tooltip>
                </div>
            </td>
        </>

    )
}

export default React.memo(ActionCellMainSOC)



