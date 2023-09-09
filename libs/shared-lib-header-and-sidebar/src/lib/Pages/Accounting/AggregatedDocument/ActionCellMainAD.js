import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../assets/images/icons/trash-icon3.gif';
import ShowDocument from "./ShowDocument";



const ActionCellMainAD = (props) => {
    const [open, setOpen] = useState(false);
    const [openRemove, setOpenRemove] = useState(false)
    const { t, i18n } = useTranslation();

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };



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


    const PrintSelected = () => {
        window.open(`/Accounting/AggregatedDocument/PrintSelectedAD?id=${props.dataItem.DocumentCode}&lang=${i18n.language}`, '_blank', 'noopener,noreferrer');
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between align-items-center`} >
                    <Tooltip title={t("ریز اسناد")}>
                        <Button variant="outlined" className=' x-document' color="secondary" onClick={() => {

                            handleClickOpen()
                        }
                        }>
                            {props.dataItem.DocumentsCount} {t("سند")}
                        </Button >
                    </Tooltip>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        fullWidth={false}
                        maxWidth={'lg'}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"


                    >
                        <DialogContent >
                            <DialogContentText
                                id="scroll-dialog-description"
                                ref={descriptionElementRef}
                                tabIndex={-1}
                            >
                                <ShowDocument id={props.dataItem.DocumentCode} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined" style={{ margin: "auto" }}>{t("بازگشت")}</Button>
                        </DialogActions>
                    </Dialog>

                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' a onClick={PrintSelected}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={() => console.log('edit', props.dataItem.DocumentCode)}>
                            <EditIcon />
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

export default React.memo(ActionCellMainAD)



