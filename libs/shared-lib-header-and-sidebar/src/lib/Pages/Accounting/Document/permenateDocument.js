import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const PermenateDocument = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Tooltip title={t("قطعی کردن اسناد")} arrow>
        <Button
          // aria-describedby={idSearch}
          variant="outlined"
          style={
            i18n.dir() === "rtl"
              ? { marginLeft: "8px" }
              : { marginRight: "4px" }
          }
          className="kendo-setting-btn"
        >
          <Link
            to={"/Accounting/Document/Archive"}
          >
            <LockIcon />
          </Link>
        </Button>
      </Tooltip>
    </div>
  );
};

export default PermenateDocument;
