import {Button, Menu, MenuItem} from "@mui/material";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from "react-router-dom";



const AddOperationBtn = () => {

    const {t, i18n} = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const MoreOperations = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
      };



    return (

        <div>
            <Tooltip title={t("عملیات اضافه")} arrow>
                <Button
                    // aria-describedby={idSearch}
                    variant="outlined"
                    style={i18n.dir() === 'rtl' ? {marginLeft: '8px'} : {marginRight: '4px'}}
                    className="kendo-setting-btn"
                    onClick={MoreOperations}

                >
                    <MoreHorizIcon/>
                </Button>
            </Tooltip>
            <Menu
        id="moreOperationsMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* <Link className="linky" to={"/Accounting/Document/Sort"}>
          <MenuItem className="linky"> {t("مرتب کردن")}</MenuItem>
        </Link> */}
        <Link className="linky" to={"/Accounting/Document/Trash"}>
          <MenuItem className="linky">{t("بازیافت")}</MenuItem>
        </Link>
        <Link className="linky" to={"/Accounting/Document/Control"}>
          <MenuItem className="linky">{t("کنترل اسناد")}</MenuItem>
        </Link>
        <Link className="linky" to={"/Accounting/NewDocument"}>
          <MenuItem className="linky">{t("درج سند")}</MenuItem>
        </Link>
        <Link className="linky" to={"/Accounting/Document/Archive"}>
          <MenuItem className="linky">{t("قطعی کردن اسناد")}</MenuItem>
        </Link>
      </Menu>
          
        </div>

    )

}

export default AddOperationBtn