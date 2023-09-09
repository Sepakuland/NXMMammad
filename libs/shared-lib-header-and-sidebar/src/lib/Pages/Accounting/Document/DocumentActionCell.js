import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Modal } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import trashIcon3 from "../../../assets/images/icons/trash-icon3.gif";
import { useLocation } from "react-router";
import Tooltip from "@mui/material/Tooltip";
import { history } from "../../../utils/history";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UploadFile from "../../../components/UploadComponent/UploadFile";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Link } from "react-router-dom";
import { useDeleteAccountingDocumentMutation } from "../../../features/slices/accountingDocumentSlice";
import { LoadingButton } from "@mui/lab";
import swal from "sweetalert";

const ActionCell = (props) => {
  const [openRemove, setOpenRemove] = useState(false);
  const [openAttachmentEdit, setOpenAttachmentEdit] = useState(false);
  const { t, i18n } = useTranslation();
  const [anchorPrint, setAnchorPrint] = useState(null);
  // console.log("pp", props)
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "1px solid #eee",
    boxShadow: 24,
    p: 4,
    direction: i18n.dir(),
  };
  const location = useLocation();
  const { pathname } = location;
  const callBackComponent = () => {
    history.navigate(`/Accounting/NewDocument?copy=${props.dataItem.documentId}`, "noopener,noreferrer");
  };

  const [fileList, setFileList] = useState();
  const [uploadError, setUploadError] = useState(false);
  function updateFileList(list) {
    setFileList(list);
  }



  const [deleteAccountingDocument, deleteResults] =
    useDeleteAccountingDocumentMutation();

  useEffect(() => {
    if (deleteResults.status == "fulfilled" && deleteResults.isSuccess) {
      setOpenRemove(false);
    } else if (deleteResults.isError) {
      let arr = deleteResults.error.map((item) => t(item));
      let msg = arr.join(" \n ");
      swal({
        text: msg,
        icon: "error",
        button: t("باشه"),
        className: "small-text",
      });
    }
  }, [deleteResults.status]);
  // console.log("props.dataItem",props.dataItem)
  return (
    <>
      <td colSpan="1">
        <div className={`d-flex justify-content-center`}>
          <Tooltip title={t("ویرایش پیوست‌ها")}>
            <IconButton
              variant="contained"
              color="info"
              className="kendo-action-btn"
              onClick={() => setOpenAttachmentEdit(true)}
            >
              <AttachmentIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("چاپ")}>
            <IconButton
              variant="contained"
              className="kendo-action-btn"
              disabled={props.dataItem.articleCount === 0}
            >
              <Link
                disabled={props.dataItem.articleCount === 0}
                to={`/Accounting/Document/PrintDocumentRow?id=${props.dataItem.documentId}`}
                target={"_blank"}
              >
                <PrintIcon />
              </Link>
            </IconButton>
          </Tooltip>

          <Tooltip title={t("ویرایش")}>
            <IconButton
              variant="contained"
              color="info"
              className="kendo-action-btn"
              disabled={props.dataItem.originalDocumentState===1 || props.dataItem.originalDocumentState===2 }
            >
              <Link
                to={`/Accounting/EditNewDocument?id=${props.dataItem.documentId}`}
                target={"_blank"}
              >
                <EditIcon />
              </Link>
            </IconButton>
          </Tooltip>

          <Tooltip title={t("حذف")}>
            <IconButton
              variant="contained"
              disabled={(props.dataItem.originalDocumentState===1 || props.dataItem.originalDocumentState===2) && props.dataItem.documentTypeId !== 3 && props.dataItem.documentTypeId !== 1 }
              color="error"
              className="kendo-action-btn"
              size="small"
              onClick={() => setOpenRemove(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("کپی")}>
            <IconButton
              variant="contained"
              color="info"
              className="kendo-action-btn"
              onClick={callBackComponent}
            >
              <ContentCopyIcon />
            </IconButton>
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

          <div className="d-flex justify-content-center">
            <LoadingButton
              variant="contained"
              color={"success"}
              startIcon={
                <DoneIcon
                  style={
                    i18n.dir() === "rtl"
                      ? { marginLeft: "5px" }
                      : { marginRight: "5px" }
                  }
                />
              }
              style={{ margin: "0 2px" }}
              onClick={() => {
                deleteAccountingDocument(props.dataItem.documentId)
                  .unwrap()
                  .catch((error) => {
                    console.error(error);
                  });
              }}
              loadingPosition="start"
              loading={deleteResults.isLoading}
            >
              {t("بله مطمئنم")}
            </LoadingButton>
            <Button
              variant="contained"
              color={"error"}
              startIcon={
                <CloseIcon
                  style={
                    i18n.dir() === "rtl"
                      ? { marginLeft: "5px" }
                      : { marginRight: "5px" }
                  }
                />
              }
              style={
                i18n.dir() === "rtl"
                  ? { marginRight: "10px" }
                  : { marginLeft: "10px" }
              }
              onClick={() => setOpenRemove(false)}
            >
              {t("انصراف")}
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openAttachmentEdit}
        onClose={() => setOpenAttachmentEdit(false)}
      >
        <Box sx={style} style={{ textAlign: "center", width: "450px" }}>
          <UploadFile
            title={t("بارگذاری فایل")}
            multiple={true}
            uploadError={uploadError}
            updateFileList={updateFileList}
            // accept={".png , .jpeg, .gif, .jpg, .bmp"}
          />

          <div className="d-flex justify-content-center">
            <Button
              variant="contained"
              color={"success"}
              startIcon={
                <DoneIcon
                  style={
                    i18n.dir() === "rtl"
                      ? { marginLeft: "5px" }
                      : { marginRight: "5px" }
                  }
                />
              }
              style={{ margin: "0 2px" }}
            >
              {t("تایید")}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default React.memo(ActionCell);
