import React, { useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Modal } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../../assets/images/icons/trash-icon3.gif'
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab";
import { useDeleteAccountingDocumentRecycleBinMutation, useRecycleAccountingDocumentRecycleBinMutation } from "../../../../../features/slices/accountingDocumentRecycleBinSlice";
import swal from "sweetalert";




const ActionCell = (props) => {

    const [openRecycle, setOpenRecycle] = useState(false)
    const [openRemove, setOpenRemove] = useState(false)
    const { t, i18n } = useTranslation();
    // console.log("pp", props)
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
    const [deleteAccountingDocumentRecycleBin, deleteResults] =
    useDeleteAccountingDocumentRecycleBinMutation();

    console.log("deleteResults", deleteResults)
    useEffect(() => {
      if (deleteResults.status == "fulfilled" && deleteResults.isSuccess){
        setOpenRemove(false)
      }
      else if(deleteResults.isError){
        let arr = deleteResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-text",
            });
      }
    }, [deleteResults.status])

    const [recycleAccountingDocumentRecycleBin, delete2Results] =
    useRecycleAccountingDocumentRecycleBinMutation();

    console.log("delete2Results", delete2Results)
    useEffect(() => {
      if (delete2Results.status == "fulfilled" && delete2Results.isSuccess){
        setOpenRemove(false)
      }
      else if(delete2Results.isError){
        let arr = delete2Results.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-text",
            });
      }
    }, [delete2Results.status])


    console.log("props.dataItem",props.dataItem)
    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >

                <Tooltip title={t("چاپ")}>
            <IconButton variant="contained" className="kendo-action-btn">
              <Link
                disabled={!props.dataItem.documentArticles.length}
                // to={`/Accounting/Document/PrintDocumentRow?id=${props.dataItem.documentId}`}
                to={`/Accounting/Document/DocumentTrashPrint?id=${props.dataItem.documentRecycleBinId}`}
                target={"_blank"}
                 >
                <PrintIcon />
              </Link>
             </IconButton>
             </Tooltip>

                    <Tooltip title={t("بازیافت")}>
                        <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => setOpenRecycle(true)}>
                            <PublishedWithChangesIcon />
                        </IconButton >
                    </Tooltip>

                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => setOpenRemove(true)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>

                </div>
            </td>
            <Modal open={openRemove} onClose={() => setOpenRemove(false)}>
        <Box sx={style} style={{ textAlign: "center", width: "450px" }}>
          <img src={trashIcon3} alt={"remove"} className="remove-icon" />
          <p>
            {t("شما در حال حذف کردن یک آیتم هستید")}
            <br />
            {t("آیا از این کار مطمئنید؟")}
            <br />
          </p>

          <div className='d-flex justify-content-center'>
                        <LoadingButton
                            variant="contained"
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            onClick={() => {
                                deleteAccountingDocumentRecycleBin(props.dataItem.documentRecycleBinId).unwrap()
                                    .catch((error) => {
                                      console.error(error)
                                    })
                            }}
                            loadingPosition="start"
                            loading={deleteResults.isLoading}
                        >
                            {t('بله مطمئنم')}
                        </LoadingButton>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenRemove(false)}
                        >
                            {t('انصراف')}
                        </Button>
                    </div>
        </Box>
      </Modal>

      <Modal open={openRecycle}  onClose={() => setOpenRecycle(false)}>
        <Box sx={style} style={{ textAlign: "center", width: "450px" }}>
          <img src={"https://media0.giphy.com/media/lp5dM2iUQ5ABZ218GN/giphy.gif?cid=ecf05e47o878dsb4mfsqn3kyygh5r1amb6910gfc844ixzor&ep=v1_gifs_search&rid=giphy.gif&ct=g"} alt={"recycle"} className="remove-icon" />
          <p>
            {t("شما در حال بازیافت یک سند هستید")}
            <br />
            {t("آیا از این کار مطمئنید؟")}
            <br />
          </p>

          <div className='d-flex justify-content-center'>
                        <LoadingButton
                            variant="contained"
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            onClick={() => {
                                recycleAccountingDocumentRecycleBin(props.dataItem.documentRecycleBinId).unwrap()
                                    .catch((error) => {
                                      console.error(error)
                                    })
                            }}
                            loadingPosition="start"
                            loading={delete2Results.isLoading}
                        >
                            {t('بله مطمئنم')}
                        </LoadingButton>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenRecycle(false)}
                        >
                            {t('انصراف')}
                        </Button>
                    </div>
        </Box>
      </Modal>

        

        </>

    )
}

export default React.memo(ActionCell)




