import { Button, Checkbox, FormControlLabel, Popover, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation } from "react-router-dom";
import { IconPrinter } from "@tabler/icons";

const CustomPrintBtn = ({ disabled, columnList, gridId, printData }) => {
    console.log("printData", printData)
    const location = useLocation();
    const { pathname } = location;
    const { t, i18n } = useTranslation();
    const printSetting = JSON.parse(localStorage.getItem(`print_${gridId}`))
    const [anchorPrint, setAnchorPrint] = useState(null);
    const [documentIdsForPrint, setDocumentIdsForPrint] = useState([])
    const columnsObj = columnList
    ?.map((item) => {
        if (item.field !== "actionCell")
            return { value: item.field, title: t(item.name) };
    })
    .filter(Boolean);
    let pObj = {};

    columnList?.forEach((item) => {
        if (item?.children?.length) {
            pObj[item.field] = {};
            item?.children.forEach((c) => {
                pObj[item.field][c.field] = true;
            });
        } else {
            if (item.field !== "actionCell") {
                pObj[item.field] = true;
            }
        }
    });
    const [printField, setPrintField] = useState(printSetting || pObj);
    useEffect(() => {
          localStorage.setItem(`print_${gridId}`, JSON.stringify(printField));
  }, [printField]);

  useEffect(() => {
    setDocumentIdsForPrint((printData.map((item) => { return item.generalDocumentId})))
  }, [printData])

    return (
        <div className="grid-btn-section-item">
            <Tooltip title={t("چاپ")} arrow>
                <Button
                    aria-describedby={Boolean(anchorPrint) ? "simple-popover" : undefined}
                    variant="outlined"
                    className="kendo-setting-btn"
                    onClick={(e) => setAnchorPrint(e.currentTarget)}
                    disabled={disabled}
                >
                    <IconPrinter />
                </Button>
            </Tooltip>
            <Popover
                id={Boolean(anchorPrint) ? "simple-popover" : undefined}
                open={Boolean(anchorPrint)}
                anchorEl={anchorPrint}
                onClose={() => setAnchorPrint(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: i18n.dir() === "rtl" ? "left" : "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: i18n.dir() === "rtl" ? "left" : "right",
                }}
                PaperProps={{
                    style: { width: "250px" },
                }}
                sx={{ direction: i18n.dir() }}
                className="grid-popover"
            >
                <div className="row">
                    <div className="col-12">
                        <h5 className="popover-title">
                            {t("ستون های قابل نمایش")}
                        </h5>
                        <ul className="field-list">
                            {columnsObj?.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={!!printField[item.value]}
                                                    onChange={(event) => {
                                                        let temp = { ...printField };
                                                        temp[item.value] =
                                                            event.target.checked;
                                                        setPrintField(temp);
                                                    }}
                                                    name="checked"
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label={
                                                <Typography variant="h6">
                                                    {item.title}
                                                </Typography>
                                            }
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="col-12 d-flex justify-content-center">
                        <Button
                            variant="contained"
                            color="success"
                            className={"link-tag-btn"}
                            onClick={() => {
                                setAnchorPrint(null);
                            }}
                        >
                            <Link
                                to={`${pathname}/Print?id=${documentIdsForPrint.toString()}`}
                                target={"_blank"}
                                className={"link-tag"}
                            >
                                {t("چاپ")}
                            </Link>
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                setAnchorPrint(null);
                            }}
                            style={
                                i18n.dir() === "rtl"
                                    ? { marginRight: "10px" }
                                    : { marginLeft: "10px" }
                            }
                        >
                            {t("انصراف")}
                        </Button>
                    </div>
                </div>
            </Popover>
        </div>
    );
};

export default CustomPrintBtn;
