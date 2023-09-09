import React, { useState } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../assets/images/icons/trash-icon3.gif'
import { Box, Button, IconButton, Modal, Tooltip } from "@mui/material";

const ActionCell = (props) => {
    const [openRemove, setOpenRemove] = useState(false)
    const [openBatchValidate, setOpenBatchValidate] = useState(false)
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

    const Validate = () => {
        navigate(`/Warehouse/Sale/ReturnFromDist/Validate?id=${props.dataItem.TotalId}`, { replace: false })
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >

                    <Tooltip title={t("تایید")}>
                        <IconButton variant="contained" color="success" className='kendo-action-btn' onClick={Validate}>
                            <DoneIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("تایید جمعی")}>
                        <IconButton
                            variant="contained"
                            color="success"
                            className='kendo-action-btn'
                            onClick={() => { setOpenBatchValidate(true) }}>
                            <DoneAllIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("حذف ارسال")}>
                        <IconButton
                            variant="contained"
                            color="error"
                            className='kendo-action-btn'
                            onClick={() => setOpenRemove(true)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>

                </div>
            </td>
            <Modal
                open={openBatchValidate}
                onClose={() => setOpenBatchValidate(false)}
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
                                console.log("Send Request to Validate, ID:", props.dataItem.TotalId)
                                setOpenBatchValidate(false)
                            }}
                        >
                            {t('تایید')}
                        </Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenBatchValidate(false)}
                        >{t('لغو')}</Button>
                    </div>
                </Box>
            </Modal>
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
                        <Button
                            variant="contained" 
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            onClick={() => {
                                console.log("Send Delete Request to DB with ID:", props.dataItem.TotalId)
                                setOpenRemove(false)
                            }}
                        >
                            {t('بله مطمئنم')}</Button>
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