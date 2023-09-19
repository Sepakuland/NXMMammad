import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Modal } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const Discontinuing = (props) => {
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const MoreOperations = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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

  

  return (
    <>
      <div className="grid-btn-section-item">
        <Tooltip title={t("قطعی کردن اسناد")}>
          <Button
            variant="outlined"
            // disabled={props.dataItem.documentId}
            disabled={props.disabled}
            className="kendo-setting-btn"
            onClick={() => {
              setFinalizeOpen(true);
            }}
          >
            <LockIcon />
          </Button>
        </Tooltip>
      </div>
      <Modal open={finalizeOpen} onClose={() => setFinalizeOpen(false)}>
        <Box sx={style} style={{ textAlign: "center", width: "450px" }}>
          <p>{t("آیا می‌خواهید اسناد را قطعی کنید؟")}</p>

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
              style={{ margin: "0 10px" }}
              onClick={() => {
                props.selecedRows()
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

export default Discontinuing;
