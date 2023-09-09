import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Menu, MenuItem, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../../assets/images/icons/trash-icon3.gif';
import { useLocation } from "react-router";
import { history } from "../../../../../utils/history";
import { IconArrowBarUp } from '@tabler/icons';


const ActionCellMainSC = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [openRemove, setOpenRemove] = useState(false)
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
    const location = useLocation()
    const { pathname } = location


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick1 = (event) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClose1 = () => {
        setAnchorEl1(null);
    };
    const Send = () => {

        history.navigate(`/WareHouse/sale/SendCollection/Send?id=${props.dataItem.TotalId}`)
    }

    const OfficialInvoicePrint = () => {
        window.open(`/WareHouse/sale/approvedInvoices/OfficialInvoicePrint?id=${props.dataItem.TotalId}`, '_blank')
    }
    function PrintWithPrice() {
        window.open(`/WareHouse/Sale/SendCollection/PrintSendCollectionWC?id=${props.dataItem.TotalId}`, '_blank')
    }
    function PrintWithOutPrice() {
        window.open(`/WareHouse/Sale/SendCollection/PrintSendCollectionWOC?id=${props.dataItem.TotalId}`, '_blank')
    }
    function PrintWithDesc() {
        window.open(`/WareHouse/Sale/SendCollection/PrintSendCollectionDesc?id=${props.dataItem.TotalId}`, '_blank')
    }
    function PrintDistributionTeamOne(params) {
        window.open(`/WareHouse/Sale/SendCollection/PrintDistributionTeamOne?id=${props.dataItem.TotalId}`, '_blank')
    }
    function PrintDistributionTeamTwq(params) {
        window.open(`/WareHouse/Sale/SendCollection/PrintDistributionTeamTwo?id=${props.dataItem.TotalId}`, '_blank')
    }

    const UnofficialInvoice = () => {
        window.open(`/WareHouse/Sale/SendCollection/PrintTestBill?id=${props.dataItem.TotalId}`, '_blank')
    }

    const officialInvoice = () => {
        window.open(`/WareHouse/Sale/SendCollection/FormalPrint?id=${props.dataItem.TotalId}`, '_blank')
    }
    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("سرجمع")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick1}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("تیم پخش 1")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={PrintDistributionTeamOne}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("تیم پخش 2")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={PrintDistributionTeamTwq}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("صورت حساب ها")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("ارسال")}>
                        <IconButton variant="contained" className='kendo-action-btn ' style={{ color: "rgb(255 0 188)" }} onClick={() => Send()}>
                            <IconArrowBarUp />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => setOpenRemove(true)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl1}
                        keepMounted
                        open={Boolean(anchorEl1)}
                        onClose={handleClose1}
                    >
                        <MenuItem onClick={() => PrintWithPrice()}>{t("همراه با قیمت")}</MenuItem>
                        <MenuItem onClick={() => PrintWithOutPrice()}>{t("بدون قیمت")}</MenuItem>
                        <MenuItem onClick={() => PrintWithDesc()}>{t("همراه با فضای توضیحات")}</MenuItem>
                    </Menu>



                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={officialInvoice}>{t("فاکتور رسمی")}</MenuItem>
                        <MenuItem onClick={UnofficialInvoice}>{t("فاکتور غیررسمی")}</MenuItem>
                    </Menu>
                </div>
            </td>
            <Modal
                open={openRemove}
                onClose={() => setOpenRemove(false)}
            >
                <Box sx={style} style={{ textAlign: 'center', width: '450px' }}>
                    <img src={trashIcon3} alt={'remove'} className='remove-icon' />
                    <p>
                        {t('شما در حال حذف کردن یک آیتم هستید')}
                        <br />
                        {t('آیا از این کار مطمئنید؟')}
                        <br />
                    </p>

                    <div className='d-flex justify-content-center'>
                        <Button variant="contained" color={'success'} startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />} style={{ margin: '0 2px' }}>{t('بله مطمئنم')}</Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenRemove(false)}
                        >{t('انصراف')}</Button>
                    </div>
                </Box>
            </Modal>

        </>

    )
}

export default React.memo(ActionCellMainSC)



