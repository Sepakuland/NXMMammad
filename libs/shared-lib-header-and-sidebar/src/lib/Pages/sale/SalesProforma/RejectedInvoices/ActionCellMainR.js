import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from "@mui/icons-material/Print";
import Map from './Map'
import { Fade, Menu, MenuItem, Tooltip } from '@mui/material';

const ActionCellMainR = (props) => {
    const { t, i18n } = useTranslation();
    function getMapData(val) {
        console.log('val', val)
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const UnFormalprint = () => {
        window.open(`/Sell/Order/RejectedInvoices/UnofficialRejectedInvoicePrint?id=${props.dataItem.OrderId}`, '_blank')
    }
    const FormalPrint = () => {
        window.open(`/Sell/Order/RejectedInvoices/OfficialRejectedInvoicePrint?id=${props.dataItem.OrderId}`, '_blank')
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-around`} >
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={() => console.log("edit", props.dataItem.OrderId)}>
                            <EditIcon />
                        </IconButton >
                    </Tooltip>
                    <Map getMapData={getMapData} data={props.dataItem}
                        //  defaultLoc={} 
                        code={'1234'} />
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" color='primary' onClick={handleClick} className='kendo-action-btn' >
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color='error' className='kendo-action-btn' onClick={() => console.log("delete", props.dataItem.OrderId)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>
                </div>
            </td>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={FormalPrint}>{t("فاکتور رسمی")}</MenuItem>
                <MenuItem onClick={UnFormalprint}>{t("فاکتور غیررسمی")}</MenuItem>
            </Menu>


        </>

    )
}

export default React.memo(ActionCellMainR)