import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Menu, MenuItem, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../assets/images/icons/trash-icon3.gif';
import { useLocation } from "react-router";
import { history } from "../../../../utils/history";
import { IconArrowBarUp } from '@tabler/icons';


const ActionCellMainAI = (props) => {
    const [showCount, setShowCount] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showBalance, setShowBalance] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
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


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const PrintSelected = () => {
        window.open(`/WareHouse/PrintSelectedWareHouseingEra?id=${props.dataItem.OrderId}`, '_blank');
    }
    const Send = () => {

        history.navigate(`/WareHouse/sale/approvedInvoices/Send?id=${props.dataItem.OrderId}`)
    }
    const UnofficialInvoice = () => {
        window.open(`/WareHouse/sale/approvedInvoices/UnofficialInvoicePrint?id=${props.dataItem.OrderId}`, '_blank')
    }
    const OfficialInvoicePrint = () => {
        window.open(`/WareHouse/sale/approvedInvoices/OfficialInvoicePrint?id=${props.dataItem.OrderId}`, '_blank')
    }
    const EditComponent = () => {
        history.navigate(`/WareHouse/sale/approvedInvoices/EditInvoice?id=${props.dataItem.OrderId}`)
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("ارسال")}>
                        <IconButton variant="contained" className='kendo-action-btn ' style={{ color: "rgb(255 0 188)" }} onClick={() => Send()}>
                            <IconArrowBarUp />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={() => EditComponent()}>
                            <EditIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => setOpenRemove(true)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={OfficialInvoicePrint}>{t("فاکتور رسمی")}</MenuItem>
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

export default React.memo(ActionCellMainAI)



