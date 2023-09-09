import { Box, Button, IconButton, Menu, MenuItem, Modal, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../assets/images/icons/trash-icon3.gif'
import { useNavigate } from "react-router-dom";


const ActionCell = (props) => {

    const [openRemove, setOpenRemove] = useState(false)
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()

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

    const [anchorPrint, setAnchorPrint] = useState(null);
    const handlePrintClick = (event) => {
        setAnchorPrint(event.currentTarget);
    };
    const handlePrintClose = () => {
        setAnchorPrint(null);
    };

    const PrintDocumentDraftRowWC = () => {
        window.open(`/Warehouse/Document/Draft/PrintDocumentDraftRowWC?id=${props.dataItem.DocumentCode}`, '_blank', 'noopener,noreferrer');
    }
    const PrintDocumentDraftRowWOC = () => {
        window.open(`/Warehouse/Document/Draft/PrintDocumentDraftRowWOC?id=${props.dataItem.DocumentCode}`, '_blank', 'noopener,noreferrer');
    }
    const Edit = () => {
        navigate(`/Warehouse/Document/Draft/New?id=${props.dataItem.DocumentId}`, { replace: false });
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={handlePrintClick}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={Edit}>
                            <EditIcon />
                        </IconButton >
                    </Tooltip>
                    {props.dataItem.DocumentRefCode === '' ?
                        <Tooltip title={t("حذف")}>
                            <IconButton
                                variant="contained"
                                color="error"
                                className='kendo-action-btn'
                                onClick={() => setOpenRemove(true)}>
                                <DeleteIcon />
                            </IconButton >
                        </Tooltip>
                        : <div className="kendo-action-btn" />
                    }
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorPrint}
                        keepMounted
                        open={Boolean(anchorPrint)}
                        onClose={handlePrintClose}
                    >
                        <MenuItem onClick={PrintDocumentDraftRowWC}>{t("همراه با قیمت")}</MenuItem>
                        <MenuItem onClick={PrintDocumentDraftRowWOC}>{t("بدون قیمت")}</MenuItem>
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