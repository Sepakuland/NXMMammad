import React, {  } from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import { Tooltip } from "@mui/material";



const ActionCellMainSD = (props) => {

    const { t, i18n } = useTranslation();
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


    const PrintSelected = () => {
        window.open(`/Accounting/AggregatedDocument/PrintSD?id=${props.dataItem.DocumentCode}&lang=${i18n.language}`, '_blank');
    }


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center align-items-center`} >
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' a onClick={PrintSelected}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                </div>
            </td>

        </>

    )
}

export default React.memo(ActionCellMainSD)



