import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

const RecycleTrash = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Tooltip title={t("بازیافت اسناد")} arrow>
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
            to={"/Accounting/Document/Trash"}
          >
            <PublishedWithChangesIcon />
          </Link>
        </Button>
      </Tooltip>
    </div>
  );
};

export default RecycleTrash;
