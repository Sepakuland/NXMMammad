import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";

const AttachmentCellPrint = (props) => {
  const { t, i18n } = useTranslation();
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

export default React.memo(AttachmentCellPrint);
