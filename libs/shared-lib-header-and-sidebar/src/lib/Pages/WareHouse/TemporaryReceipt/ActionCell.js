import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Tooltip, Modal } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../assets/images/icons/trash-icon3.gif'
import warningImg from '../../../assets/images/icons/warning-icon.svg'
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";





const ActionCell = (props) => {

    const [openRemove, setOpenRemove] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const { t, i18n } = useTranslation();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        textAlign:'center',
        maxWidth:'100%',
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 7,
        direction: i18n.dir()
    };
    const style2 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        maxWidth:'100%',
        textAlign:'center',
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 2,
        direction: i18n.dir()
    };

    const imgStyle={
        width:'70px',
        height:'auto',
        marginBottom:'40px'
    }


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("قطعی")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => setOpenConfirm(true)}>
                            <CheckIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn'>
                            <Link to={`/WareHouse/Provisional/Receipt/Form?id=${props.dataItem.DocumentId}`}>
                                <EditIcon />
                            </Link>
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => setOpenRemove(true)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>


                </div>
            </td>
            <Modal
                open={openRemove}
                onClose={() => setOpenRemove(false)}
            >
                <Box sx={style}>
                    <img src={trashIcon3} alt={'remove'} className='remove-icon' />
                    <p>
                        {t('شما در حال حذف کردن یک آیتم هستید')}
                        <br />
                        {t('آیا از این کار مطمئنید؟')}
                        <br />
                    </p>

                    <div className='d-flex justify-content-center mt-3'>
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
            <Modal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <Box sx={style2}>
                    <img src={warningImg} alt={'remove'} className='remove-icon' style={imgStyle}/>
                    <p>
                        {t('آیا از انجام عمل مورد نظر مطمئن هستید؟')}
                    </p>
                    <div className='d-flex justify-content-center'>
                        <Button variant="contained" color={'success'} startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />} style={{ margin: '0 2px' }}>{t('بله مطمئنم')}</Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenConfirm(false)}
                        >{t('انصراف')}</Button>
                    </div>
                </Box>
            </Modal>
        </>

    )
}

export default React.memo(ActionCell)