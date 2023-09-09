import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Menu, MenuItem, Tooltip, Modal } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../../assets/images/icons/trash-icon3.gif'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { useLocation } from "react-router";
import { Link } from "react-router-dom";




const ActionCell = (props) => {

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
        p: 7,
        direction: i18n.dir()
    };
    const location = useLocation()
    const { pathname } = location
    const handleClick = (event) => {
        console.log("ee", event)
        setAnchorEl(event.currentTarget);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick2 = (event) => {
        console.log("ee", event)
        setAnchorEl2(event.currentTarget);
    };
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const handleClose2 = () => {
        setAnchorEl2(null);
    };



    const TotalPrintWC = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/TotalPrintWC?id=${props.dataItem.TotalId}`, '_blank' );
    }
    const TotalPrintWOC = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/TotalPrintWOC`, '_blank');
    }
    const DistributionTeamOnePrint = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/DistributionTeamOnePrint?id=${props.dataItem.TotalId}`, '_blank' );
    }
    const DistributionTeamTwoPrint = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/DistributionTeamTwoPrint?id=${props.dataItem.TotalId}`, '_blank' );
    }
    const TestPrint = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/TestPrint?id=${props.dataItem.TotalId}`, '_blank' );
    }
    const OfficialBillPrint = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/TotalPrintWOC`, '_blank');
    }
    const TotalReceiptPrint = () => {
        window.open(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/TotalReceiptPrint?id=${props.dataItem.TotalId}`, '_blank' );
    }
    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("سرجمع")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("تیم پخش 1")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={DistributionTeamOnePrint}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("تیم پخش 2")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={DistributionTeamTwoPrint}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("چاپ فاکتورها")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClick2}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("رسید")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn'>
                            <Link to={`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/ReceiptForm?id=${props.dataItem.TotalId}`}>
                                <RequestQuoteIcon />
                            </Link>
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={TotalReceiptPrint}>
                            <PrintIcon />
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
                        <MenuItem onClick={TotalPrintWC}>{t("همراه با قیمت")}</MenuItem>
                        <MenuItem onClick={TotalPrintWOC}>{t("بدون قیمت")}</MenuItem>
                    </Menu>
                    <Menu
                        id="simple-menu2"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl2}
                        keepMounted
                        open={Boolean(anchorEl2)}
                        onClose={handleClose2}
                    >
                        <MenuItem onClick={TestPrint}>{t("فاکتور غیررسمی")}</MenuItem>
                        <MenuItem onClick={OfficialBillPrint}>{t("فاکتور رسمی")}</MenuItem>
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

export default React.memo(ActionCell)