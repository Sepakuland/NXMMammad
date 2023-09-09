import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import { Fade, Menu, MenuItem, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import AutorenewIcon from '@mui/icons-material/Autorenew';

const ActionCellMainR = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { t, i18n } = useTranslation();


    const UnFormalprint = () => {
        window.open(`/Sell/Order/Recycle/UnofficialRecycleInvoicePrint?id=${props.dataItem.OrderId}`, '_blank')
    }
    const FormalPrint = () => {
        window.open(`/Sell/Order/Recycle/OfficialRecycleInvoicePrint?id=${props.dataItem.OrderId}`, '_blank')
    }


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >

                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" color='primary' onClick={handleClick} className='kendo-action-btn' >
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("بازیافت")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => console.log("recycle", props.dataItem.OrderId)}>
                            <AutorenewIcon />
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