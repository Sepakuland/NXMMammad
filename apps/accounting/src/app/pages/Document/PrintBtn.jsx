import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Print from "@mui/icons-material/Print";
import { Link } from "react-router-dom";

const PrintBtn = ({ disabled }) => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Tooltip title={t("چاپ سند")} arrow>
        <Button
          // aria-describedby={idSearch}
          variant="outlined"
          style={
            i18n.dir() === "rtl"
              ? { marginRight: "0px" }
              : { marginLeft: "8px" }
          }
          className="kendo-setting-btn"
          disabled={disabled}
        >
          <Link
            to={"/Accounting/Document/PrintDocumentBatch"}
            target={"_blank"}
          >
            <Print />
          </Link>
        </Button>
      </Tooltip>
      {/* <PublishedWithChangesIcon /> */}
    </div>
  );
};

export default PrintBtn;
