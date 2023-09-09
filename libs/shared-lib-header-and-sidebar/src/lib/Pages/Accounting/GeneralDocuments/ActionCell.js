import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../assets/images/icons/trash-icon3.gif';
import { useDeleteGeneralDocumentMutation } from "../../../features/slices/GeneralDocumentSlice";
import swal from "sweetalert";
import { LoadingButton } from "@mui/lab";


const ActionCell = (props) => {
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

    /* -------------------------------------------------------------------------- */
    /*                              Redux / RTKQuery                              */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Mutations ------------------------------- */
    const [deleteGeneralDocument, deleteResults] = useDeleteGeneralDocumentMutation()
    useEffect(() => {
        if (deleteResults.status == "fulfilled" && deleteResults.isSuccess) {
            setOpenRemove(false)
        }
        else if (deleteResults.isError) {
            let arr = deleteResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }
    }, [deleteResults.status])

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("حذف")}>
                        <div>
                            <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => setOpenRemove(true)}>
                                <DeleteIcon />
                            </IconButton >
                        </div>
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
                        <LoadingButton
                            variant="contained"
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            loadingPosition="start"
                            loading={deleteResults.isLoading}
                            onClick={() => {
                                deleteGeneralDocument(props.dataItem.generalDocumentId).unwrap()
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }}
                        >
                            {t('بله مطمئنم')}
                        </LoadingButton>
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



