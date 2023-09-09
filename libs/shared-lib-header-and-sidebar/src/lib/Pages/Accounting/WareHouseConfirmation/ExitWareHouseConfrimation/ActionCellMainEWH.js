import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Menu, MenuItem, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import trashIcon3 from '../../../../assets/images/icons/trash-icon3.gif'
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from "react-router";
import CheckIcon from '@mui/icons-material/Check';


const ActionCellMainEWH = (props) => {

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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const PrintSelectedWC = () => {
        window.open(`/Accounting/WareHouseConfirmation/ExitWareHouseConfrimation/PrintSelectedWC?id=${props.dataItem.DocumentCode}?lang=${i18n.language}`, '_blank', 'noopener,noreferrer');
    }
    const PrintSelectedWOC = () => {
        window.open(`/Accounting/WareHouseConfirmation/ExitWareHouseConfrimation/PrintSelectedWOC?lang=${i18n.language}`, '_blank', 'noopener,noreferrer');

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
                    <Tooltip title={t("تایید")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => console.log('confrim', props.dataItem.DocumentCode)}>
                            <CheckIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color='error' className='kendo-action-btn' onClick={() => console.log('delete', props.dataItem.DocumentCode)}>
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
                        <MenuItem onClick={PrintSelectedWC}>{t("همراه با قیمت")}</MenuItem>
                        <MenuItem onClick={PrintSelectedWOC}>{t("بدون قیمت")}</MenuItem>
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

export default React.memo(ActionCellMainEWH)



