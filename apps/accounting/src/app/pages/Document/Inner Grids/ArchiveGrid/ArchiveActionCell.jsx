import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import { Box, Modal } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { useUpdateAccountingDocumentChangeStateMutation } from "../../../../../features/slices/accountingDocumentSlice";

const ActionCell = (props) => {
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [definalizeOpen, setDefinalizeOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [anchorPrint, setAnchorPrint] = useState(null);
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


  /* -------------------------------- Mutation -------------------------------- */
  const [updateChangeState, updateResults] =
    useUpdateAccountingDocumentChangeStateMutation();
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <td colSpan="1">
        <div className={`d-flex justify-content-center`}>
          <Tooltip title={t("چاپ")}>
            <IconButton variant="contained" className="kendo-action-btn">
              <Link
                disabled={props.dataItem.articleCount === 0}
                to={`/Accounting/Document/Print?id=${props.dataItem.documentId}`}
                target={"_blank"}
              >
                <PrintIcon />
              </Link>
            </IconButton>
          </Tooltip>

          <Tooltip title={t("قطعی")}>
            <IconButton
              variant="contained"
              color="success"
              disabled={props.dataItem.DocumentState === "قطعی"}
              className="kendo-action-btn"
              onClick={() => {
                setFinalizeOpen(true);
              }}
            >
              <LockIcon />
            </IconButton>
          </Tooltip>
        </div>
      </td>
      <Modal open={finalizeOpen} onClose={() => setFinalizeOpen(false)}>
        <Box sx={style} style={{ textAlign: "center", width: "450px" }}>
          <p>{t("آیا میخواهید این سند را قطعی کنید؟")}</p>

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
              onClick={() => {
                updateChangeState({
                  documentId: props.dataItem.documentId,
                  changeState: {changeState: 1},
                });
                setFinalizeOpen(false);
              }}
            >
              {t("تایید")}
            </Button>
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
              onClick={() => setFinalizeOpen(false)}
            >
              {t("لغو")}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default React.memo(ActionCell);
