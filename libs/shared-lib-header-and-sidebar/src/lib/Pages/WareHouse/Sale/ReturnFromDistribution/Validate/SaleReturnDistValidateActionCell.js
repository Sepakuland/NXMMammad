import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Menu, MenuItem, Modal } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import LoopIcon from '@mui/icons-material/Loop';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';


const ActionCell = (props) => {

    const [openApprove, setOpenApprove] = useState(false)
    const [openReplicate, setOpenReplicate] = useState(false)
    const { t, i18n } = useTranslation();
    const [anchorElPrint, setAnchorElPrint] = useState(null);
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

    const HandlePrintClick = (event) => {
        setAnchorElPrint(event.currentTarget);
    };
    const HandlePrintClose = () => {
        setAnchorElPrint(null);
    };
    const UnofficialInvoicePrint = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/Validate/PrintUnofficialInvoice?id=${props.dataItem.OrderId}`, '_blank');
    }
    const OfficialInvoicePrint = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/Validate/PrintOfficialInvoice?id=${props.dataItem.OrderId}`, '_blank');
    }

    const Edit = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/Validate/Edit?id=${props.dataItem.OrderId}`, '_blank');
    }





    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >

                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={HandlePrintClick}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={Edit}>
                            <EditIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("تایید")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => setOpenApprove(true)}>
                            <DoneIcon />
                        </IconButton >
                    </Tooltip>

                    {props.dataItem.OrderCode === -1 ?
                        <Tooltip title={t("تجدید")}>
                            <IconButton variant="contained" color="info" className='kendo-action-btn' onClick={() => setOpenReplicate(true)} >
                                <LoopIcon />
                            </IconButton >
                        </Tooltip>
                        : <div className="kendo-action-btn" />
                    }

                    {props.dataItem.increased === -1 ?
                        <KeyboardDoubleArrowDownIcon className="kendo-action-btn" color="error" />
                        : props.dataItem.increased === 1 ?
                            <KeyboardDoubleArrowUpIcon className="kendo-action-btn" color="success" /> :
                            <div className="kendo-action-btn" />
                    }

                </div>
            </td>
            <Menu
                id="simple-menu2"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorElPrint}
                keepMounted
                open={Boolean(anchorElPrint)}
                onClose={HandlePrintClose}
            >
                <MenuItem onClick={UnofficialInvoicePrint}>{t("فاکتور غیررسمی")}</MenuItem>
                <MenuItem onClick={OfficialInvoicePrint}>{t("فاکتور رسمی")}</MenuItem>
            </Menu>

            <Modal
                open={openApprove}
                onClose={() => setOpenApprove(false)}
            >
                <Box sx={style} style={{ textAlign: 'center', width: '450px' }}>
                    <p>
                        {t('آیا از این کار مطمئنید؟')}
                    </p>

                    <div className='d-flex justify-content-center'>
                        <Button
                            variant="contained"
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            onClick={() => {
                                console.log("Send Request to Approve, ID:", props.dataItem.OrderId)
                                setOpenApprove(false)
                            }}
                        >
                            {t('تایید')}
                        </Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenApprove(false)}
                        >{t('لغو')}</Button>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={openReplicate}
                onClose={() => setOpenReplicate(false)}
            >
                <Box sx={style} style={{ textAlign: 'center', width: '450px' }}>
                    <p>
                        {t('آیا از این کار مطمئنید؟')}
                    </p>

                    <div className='d-flex justify-content-center'>
                        <Button
                            variant="contained"
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            onClick={() => {
                                console.log("Send Request to Replicate order, ID:", props.dataItem.OrderId)
                                setOpenReplicate(false)
                            }}
                        >
                            {t('تایید')}
                        </Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenReplicate(false)}
                        >{t('لغو')}</Button>
                    </div>
                </Box>
            </Modal>

        </>

    )
}

export default React.memo(ActionCell)




