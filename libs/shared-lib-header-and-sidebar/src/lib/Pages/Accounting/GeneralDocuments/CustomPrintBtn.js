import { Button, Checkbox, FormControlLabel, IconButton, Popover, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation } from "react-router-dom";
import { IconPrinter } from "@tabler/icons";

const CustomPrintBtn = ({ disabled, printData }) => {
    const location = useLocation();
    const { pathname } = location;
    const { t, i18n } = useTranslation();
    const [documentIdsForPrint, setDocumentIdsForPrint] = useState([])

    useEffect(() => {
        setDocumentIdsForPrint((printData.map((item) => { return item.generalDocumentId })))
    }, [printData])

    return (
        <div className="grid-btn-section-item">
            <Tooltip title={t("چاپ")} arrow>
                <Button
                    variant="outlined"
                    className="kendo-setting-btn"
                    disabled={disabled}
                >
                    <Link
                        to={`${pathname}/Print?id=${documentIdsForPrint.toString()}`}
                        target={"_blank"}
                        className={"link-tag"}
                    >
                        <IconPrinter />
                    </Link>
                </Button>
            </Tooltip>
        </div>
    );
};

export default CustomPrintBtn;
