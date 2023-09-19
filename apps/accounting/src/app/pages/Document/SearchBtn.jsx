import { Box, Button, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import InnerSearch from "./Components/InnerSearchComponent";

const SearchBtn = ({ getQuery }) => {
  const { t, i18n } = useTranslation();
  const [innerSearchOpen, setInnerSearchOpen] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "1px solid #eee",
    boxShadow: 24,
    p: "10px",
    direction: i18n.dir(),
  };
  const searchGrid = (val) => {
    console.log("Search and reload grid:", val);
  };
  function getData(params) {
    getQuery(params);
  }
  return (
    <div>
      <Tooltip title={t("جست‌و‌جو")} arrow>
        <Button
          // aria-describedby={idSearch}
          variant="outlined"
          style={
            i18n.dir() === "rtl"
              ? { marginLeft: "8px" }
              : { marginRight: "4px" }
          }
          className="kendo-setting-btn"
          onClick={() => setInnerSearchOpen(true)}
        >
          <SearchIcon />
        </Button>
      </Tooltip>
      <Modal open={innerSearchOpen} onClose={() => setInnerSearchOpen(false)}>
        <Box sx={style} style={{ width: "450px" }}>
          <InnerSearch
            getData={getData}
            closeModal={() => setInnerSearchOpen(false)}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default SearchBtn;
