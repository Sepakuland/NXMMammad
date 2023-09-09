import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";

const ActionCell = (props) => {
  const { t, i18n } = useTranslation();
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

  const Print = () => {
    window.open(
      `/Accounting/Document/PrintDocumentRow?id=${props.dataItem.documentId}&lang=${i18n.language}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <td colSpan="1">
        <div className={`d-flex justify-content-center`}>
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
        </div>
      </td>
    </>
  );
};

export default React.memo(ActionCell);
