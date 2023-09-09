import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom'
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../utils/calenderLang";
import { goodGiftDatagridLookup } from "./datasources";
import series from './series.json'
import { deliverers, itemsDatagridMeasurementUnitLookup, storeKeepers } from "../Document/Voucher/NewVoucher/datasources";
import { Autocomplete, Box, Button, IconButton, TextField, useTheme, Modal, } from "@mui/material";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BatchModal from "../../../components/Modals/BatchModal";
import { SelectBox } from "devextreme-react";
import { receivingWarehouses } from "../Document/Voucher/NewVoucher/datasources";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../utils/gridKeyboardNav3";
import Guid from "devextreme/core/guid";

export default function TemporaryRemittanceForm() {
    const emptyRemittanceItems = {
        formikId: new Guid().valueOf(),
        goods: "",
        buildSeries: "",
        expiredDate: "",
        unit: "",
        number: 0,
        amount: 0,
        description: '',
    };
    const { t, i18n } = useTranslation();
    const theme = useTheme();
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


    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [container, setContainer] = useState([]);
    const [click, setClick] = useState(false)

    const formik = useFormik({
        initialValues: {
            deliveryWarehouse: '',
            storeKeeper: '',
            receiver: '',
            receiptDescription: '',
            remittanceItems: [emptyRemittanceItems],

        },
        validationSchema: Yup.object({
            deliveryWarehouse: Yup.string().required("وارد کردن انبار تحویل دهنده الزامی است"),
            storeKeeper: Yup.string().required("وارد کردن انباردار الزامی است"),
            receiver: Yup.string().required("تحویل گیرنده به درستی وارد نشده است"),
            remittanceItems: Yup.array(
                Yup.object({
                    goods: Yup.string().required("انتخاب کالا الزامی است"),
                    buildSeries: Yup.string().required("انتخاب سری ساخت الزامی است"),
                    unit: Yup.string().required("انتخاب واحد الزامی است"),
                    number: Yup.number().positive("وارد کردن تعداد الزامی است")
                })
            )
        }),
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = values;

            DocumentSub();
            console.log("All Values:", allValues);
        },
    });

    const DocumentSub = () => {
        swal({
            title: t("سند با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };
    const tableError = () => {
        swal({
            title: t("خطاهای مشخص شده را برطرف کنید"),
            icon: "error",
            button: t("باشه"),
        });
    };
    const emptyError = () => {
        swal({
            title: t("حداقل باید یک قلم را به ثبت برسانید."),
            icon: "error",
            button: t("باشه")
        });
    }

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }
    }, [formik.errors.remittanceItems])


    const [remittanceItemsFocusedRow, setRemittanceItemsFocusedRow] = useState(1);

    const [remittanceItemsGoodsOpen, setRemittanceItemsGoodsOpen] = useState(false);
    const [remittanceItemsBuildSeriesOpen, setRemittanceItemsBuildSeriesOpen] = useState(false);
    const [remittanceItemsUnitOpen, setRemittanceItemsUnitOpen] = useState(false);

    function addRemittanceItemsRow() {
        formik.setFieldValue("remittanceItems", [
            ...formik.values.remittanceItems,
            emptyRemittanceItems,
        ]);
        setContainer([...container, 0]);
    }

    function RenderRemittanceItemsGoodsOpenState(index, state) {
        if (index === remittanceItemsFocusedRow - 1) {
            setRemittanceItemsGoodsOpen(state);
        } else {
            setRemittanceItemsGoodsOpen(false);
        }
    }

    function RenderRemittanceItemsBuildSeriesOpenState(index, state) {
        if (index === remittanceItemsFocusedRow - 1) {
            setRemittanceItemsBuildSeriesOpen(state);
        } else {
            setRemittanceItemsBuildSeriesOpen(false);
        }
    }

    function RenderRemittanceItemsUnitOpenState(index, state) {
        if (index === remittanceItemsFocusedRow - 1) {
            setRemittanceItemsUnitOpen(state);
        } else {
            setRemittanceItemsUnitOpen(false);
        }
    }

    function itemsKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && remittanceItemsGoodsOpen === false && remittanceItemsBuildSeriesOpen === false && remittanceItemsUnitOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.remittanceItems.length === remittanceItemsFocusedRow) {
                addRemittanceItemsRow()
                setTimeout(() => {
                    let temp = next.closest("tr").nextSibling.children[e.target.closest("td").cellIndex]
                    while (temp.cellIndex !== temp.closest("tr").children.length - 1 && (temp.querySelector("button:not([aria-label='Clear'])") || temp.querySelector("input").disabled)) {
                        temp = findNextFocusable(temp)
                    }
                    temp.querySelector("input").focus()
                    temp.querySelector("input").select()
                }, 0);
            }
            else {
                let down = e.target.closest("tr").nextSibling.children[e.target.closest("td").cellIndex].querySelector("input")
                down.focus()
                down.select()
            }
        }
        if (e.keyCode === 38 && remittanceItemsGoodsOpen === false && remittanceItemsBuildSeriesOpen === false && remittanceItemsUnitOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.remittanceItems, addRemittanceItemsRow, next, remittanceItemsFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.remittanceItems, addRemittanceItemsRow, next, remittanceItemsFocusedRow)
        }
        if (e.keyCode === 13 && remittanceItemsGoodsOpen === false && remittanceItemsBuildSeriesOpen === false && remittanceItemsUnitOpen === false) { /* Enter */
            MoveNext(formik.values.remittanceItems, addRemittanceItemsRow, next, remittanceItemsFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.remittanceItems, addRemittanceItemsRow, next, remittanceItemsFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.remittanceItems, addRemittanceItemsRow, next, remittanceItemsFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }


    function CalculateRemittanceItemsAmountTotal() {
        let remittanceItemsAmountTemp = 0;
        formik.values.remittanceItems.forEach((element) => {
            remittanceItemsAmountTemp += element.amount;
        });
    }


    const getBatchModalData = (val) => {
        console.log("Send a request and make batch with these datas:", val);
    };



    return (
        <>
            <div
                className="form-template"
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    borderColor: `${theme.palette.divider}`,
                }}
            >
                <div>
                    <FormikProvider value={formik}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-design">
                                <div className="row">
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("انبار تحویل دهنده")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={receivingWarehouses}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('deliveryWarehouse', e.value)}
                                                    className='selectBox'
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return (
                                                            item &&
                                                            item.Code +
                                                            "- " +
                                                            item.Name
                                                        );
                                                    }}
                                                    valueExpr="Code"
                                                    itemRender={null}
                                                    placeholder=''
                                                    name='deliveryWarehouse'
                                                    id='deliveryWarehouse'
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.deliveryWarehouse && formik.errors.deliveryWarehouse && !formik.values.deliveryWarehouse ? (<div className='error-msg'>{t(formik.errors.deliveryWarehouse)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("انباردار")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={storeKeepers}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('storeKeeper', e.value)}
                                                    className='selectBox'
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return (
                                                            item &&
                                                            item.Code +
                                                            "- " +
                                                            item.Name
                                                        );
                                                    }}
                                                    valueExpr="Code"
                                                    itemRender={null}
                                                    placeholder=''
                                                    name='storeKeeper'
                                                    id='storeKeeper'
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.storeKeeper && formik.errors.storeKeeper && !formik.values.storeKeeper ? (<div className='error-msg'>{t(formik.errors.storeKeeper)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("تحویل گیرنده")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={deliverers}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('receiver', e.value)}
                                                    className='selectBox'
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return (
                                                            item &&
                                                            item.Code +
                                                            "- " +
                                                            item.Name
                                                        );
                                                    }}
                                                    valueExpr="Code"
                                                    itemRender={null}
                                                    placeholder=''
                                                    name='receiver'
                                                    id='receiver'
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.receiver && formik.errors.receiver && !formik.values.receiver ? (<div className='error-msg'>{t(formik.errors.receiver)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("شرح حواله")} </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <textarea
                                                    className='form-input'
                                                    id='receiptDescription'
                                                    name='receiptDescription'
                                                    style={{ width: "100%" }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.receiptDescription}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="content col-lg-12 col-12 " >
                                        {/* remittanceItems Grid */}
                                        <div className="row align-items-center">
                                            <div className="content col-lg-6 col-6">
                                                <div className="title mb-0">
                                                    <span className="span"> {t("اقلام حواله")} :</span>
                                                </div>
                                            </div>
                                            <div className="content col-lg-6 col-6">
                                                {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                                <div className="d-flex justify-content-end">
                                                    <Button
                                                        variant="outlined"
                                                        className="grid-add-btn"
                                                        onClick={(e) => {
                                                            addRemittanceItemsRow();
                                                            setTimeout(() => {
                                                                let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                                while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                                    added = findNextFocusable(added)
                                                                }
                                                                added.querySelector("input").focus()
                                                            }, 0);
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="content col-lg-12 col-12">
                                                <div
                                                    className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                                                        }`}
                                                >
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr className="text-center">
                                                                <th>{t("ردیف")}</th>
                                                                <th>{t("کالا")}</th>
                                                                <th>{t("سری ساخت")}</th>
                                                                <th>
                                                                    <AddCircleOutlineIcon color="success" />
                                                                </th>
                                                                <th>{t("تاریخ انقضاء")}</th>
                                                                <th>{t("واحد")}</th>
                                                                <th>{t("تعداد")}</th>
                                                                <th>{t("مقدار")}</th>
                                                                <th>{t("توضیحات")}</th>
                                                                <th>{t("حذف")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <FieldArray
                                                                name="remittanceItems"
                                                                render={({ push, remove }) => (
                                                                    <React.Fragment>
                                                                        {formik?.values?.remittanceItems?.map(
                                                                            (remittanceItemsReceives, index) => (
                                                                                <tr
                                                                                    key={remittanceItemsReceives.formikId}
                                                                                    onFocus={(e) =>
                                                                                        setRemittanceItemsFocusedRow(
                                                                                            e.target.closest("tr").rowIndex
                                                                                        )
                                                                                    }
                                                                                    className={
                                                                                        remittanceItemsFocusedRow === index + 1
                                                                                            ? "focus-row-bg"
                                                                                            : ""
                                                                                    }
                                                                                >
                                                                                    <td
                                                                                        className="text-center"
                                                                                        style={{
                                                                                            verticalAlign: "middle",
                                                                                            width: "40px",
                                                                                        }}
                                                                                    >
                                                                                        {index + 1}
                                                                                    </td>

                                                                                    <td style={{ width: "250px", minWidth: "150px" }}>
                                                                                        <div
                                                                                            className={`table-autocomplete `}
                                                                                        >
                                                                                            <Autocomplete
                                                                                                id="goods"
                                                                                                name={`remittanceItems.${index}.goods`}
                                                                                                options={goodGiftDatagridLookup}
                                                                                                renderOption={(
                                                                                                    props,
                                                                                                    option
                                                                                                ) => (
                                                                                                    <Box
                                                                                                        component="li"
                                                                                                        {...props}
                                                                                                    >
                                                                                                        {option.Name}
                                                                                                    </Box>
                                                                                                )}
                                                                                                getOptionLabel={(option) =>
                                                                                                    option.Name
                                                                                                }
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: 200,
                                                                                                            maxWidth: "90vw",
                                                                                                            direction: i18n.dir(),
                                                                                                            position: "absolute",
                                                                                                            fontSize: "12px",
                                                                                                            right:
                                                                                                                i18n.dir() === "rtl"
                                                                                                                    ? "0"
                                                                                                                    : "unset",
                                                                                                        },
                                                                                                    },
                                                                                                }}
                                                                                                sx={{
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "relative",
                                                                                                    background: "#e9ecefd2",
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: "12px",
                                                                                                }}
                                                                                                size="small"
                                                                                                clearOnBlur={true}
                                                                                                forcePopupIcon={false}
                                                                                                open={
                                                                                                    remittanceItemsFocusedRow === index + 1
                                                                                                        ? remittanceItemsGoodsOpen
                                                                                                        : false
                                                                                                }
                                                                                                noOptionsText={t(
                                                                                                    "اطلاعات یافت نشد"
                                                                                                )}
                                                                                                onInputChange={(
                                                                                                    event,
                                                                                                    value
                                                                                                ) => {
                                                                                                    if (
                                                                                                        value !== "" &&
                                                                                                        event !== null
                                                                                                    ) {
                                                                                                        RenderRemittanceItemsGoodsOpenState(
                                                                                                            index,
                                                                                                            true
                                                                                                        );
                                                                                                    } else {
                                                                                                        RenderRemittanceItemsGoodsOpenState(
                                                                                                            index,
                                                                                                            false
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                onChange={(event, value) => {
                                                                                                    RenderRemittanceItemsGoodsOpenState(
                                                                                                        index,
                                                                                                        false
                                                                                                    );
                                                                                                    if (value) {
                                                                                                        formik.setFieldValue(
                                                                                                            `remittanceItems[${index}].goods`,
                                                                                                            value.Name
                                                                                                        );

                                                                                                    } else {
                                                                                                        formik.setFieldValue(
                                                                                                            `remittanceItems[${index}].goods`,
                                                                                                            ""
                                                                                                        );
                                                                                                    }
                                                                                                    // setTimeout(() => {
                                                                                                    //     if (value !== "") {
                                                                                                    //         remittanceItemsBuildSeriesRefs.current[index].focus()
                                                                                                    //     }
                                                                                                    //     else {
                                                                                                    //         remittanceItemsUnitRefs.current[index].focus()
                                                                                                    //     }
                                                                                                    // }, 1);
                                                                                                }}
                                                                                                onBlur={(e) =>
                                                                                                    RenderRemittanceItemsGoodsOpenState(
                                                                                                        index,
                                                                                                        false
                                                                                                    )
                                                                                                }
                                                                                                renderInput={(params) => (
                                                                                                    <TextField
                                                                                                        {...params}
                                                                                                        label=""
                                                                                                        variant="outlined"
                                                                                                    />
                                                                                                )}
                                                                                                onKeyDown={(e) => {
                                                                                                    if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && remittanceItemsGoodsOpen === false) {
                                                                                                        e.preventDefault()
                                                                                                        RenderRemittanceItemsGoodsOpenState(index, false)
                                                                                                    }
                                                                                                    setTimeout(() => {
                                                                                                        itemsKeyDownHandler(e)
                                                                                                    }, 0);

                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td style={{ width: "150px", minWidth: "90px" }}>
                                                                                        <div
                                                                                            className={`table-autocomplete `}
                                                                                        >
                                                                                            <Autocomplete
                                                                                                disabled={formik.values.remittanceItems[index].goods === ""}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: 150,
                                                                                                            maxWidth: "90vw",
                                                                                                            direction: i18n.dir(),
                                                                                                            position: "absolute",
                                                                                                            fontSize: '12px',
                                                                                                            right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                        }
                                                                                                    }
                                                                                                }}
                                                                                                sx={
                                                                                                    {
                                                                                                        direction: i18n.dir(),
                                                                                                        position: "relative",
                                                                                                        background: formik.values.remittanceItems[index].goods !== "" ? "#e9ecefd2" : "white",
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px'
                                                                                                    }

                                                                                                }
                                                                                                id="buildSeries"
                                                                                                name={`remittanceItems.${index}.buildSeries`}
                                                                                                options={series}
                                                                                                renderOption={(
                                                                                                    props,
                                                                                                    option
                                                                                                ) => (
                                                                                                    <Box
                                                                                                        component="li"
                                                                                                        {...props}
                                                                                                    >
                                                                                                        {option.ExpirationDate}-{option.BatchNumber}
                                                                                                    </Box>
                                                                                                )}
                                                                                                getOptionLabel={(option) =>
                                                                                                    option.BatchNumber
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                open={
                                                                                                    remittanceItemsFocusedRow === index + 1
                                                                                                        ? remittanceItemsBuildSeriesOpen
                                                                                                        : false
                                                                                                }
                                                                                                noOptionsText={t(
                                                                                                    "اطلاعات یافت نشد"
                                                                                                )}
                                                                                                onInputChange={(
                                                                                                    event,
                                                                                                    value
                                                                                                ) => {
                                                                                                    if (
                                                                                                        value !== "" &&
                                                                                                        event !== null
                                                                                                    ) {
                                                                                                        RenderRemittanceItemsBuildSeriesOpenState(
                                                                                                            index,
                                                                                                            true
                                                                                                        );
                                                                                                    } else {
                                                                                                        RenderRemittanceItemsBuildSeriesOpenState(
                                                                                                            index,
                                                                                                            false
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                onChange={(event, value) => {
                                                                                                    RenderRemittanceItemsBuildSeriesOpenState(
                                                                                                        index,
                                                                                                        false
                                                                                                    );
                                                                                                    formik.setFieldValue(
                                                                                                        `remittanceItems[${index}].buildSeries`,
                                                                                                        value.BatchNumber
                                                                                                    );

                                                                                                    formik.setFieldValue(`remittanceItems[${index}].expiredDate`, value.ExpirationDate)
                                                                                                }}
                                                                                                onBlur={(e) =>
                                                                                                    RenderRemittanceItemsBuildSeriesOpenState(
                                                                                                        index,
                                                                                                        false
                                                                                                    )
                                                                                                }
                                                                                                renderInput={(params) => (
                                                                                                    <TextField
                                                                                                        {...params}
                                                                                                        label=""
                                                                                                        variant="outlined"
                                                                                                    />
                                                                                                )}
                                                                                                onKeyDown={(e) => {
                                                                                                    if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && remittanceItemsBuildSeriesOpen === false) {
                                                                                                        e.preventDefault()
                                                                                                        RenderRemittanceItemsBuildSeriesOpenState(index, false)
                                                                                                    }
                                                                                                    setTimeout(() => {
                                                                                                        itemsKeyDownHandler(e)
                                                                                                    }, 0);

                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td style={{ width: "40px", textAlign: 'center' }}>
                                                                                        <IconButton
                                                                                            variant="contained"
                                                                                            color="success"
                                                                                            className="kendo-action-btn"
                                                                                            onClick={() => {
                                                                                                setBatchModalOpen(true);
                                                                                            }}
                                                                                        >
                                                                                            <AddCircleOutlineIcon />
                                                                                        </IconButton>
                                                                                    </td>
                                                                                    <td style={{ width: "150px", minWidth: "90px" }}>
                                                                                        <div >
                                                                                            <DatePicker
                                                                                                style={{ direction: "ltr" }}
                                                                                                name={`remittanceItems.${index}.expiredDate`}
                                                                                                id="expiredDate"
                                                                                                disabled
                                                                                                calendar={renderCalendarSwitch(
                                                                                                    i18n.language
                                                                                                )}
                                                                                                locale={renderCalendarLocaleSwitch(
                                                                                                    i18n.language
                                                                                                )}
                                                                                                calendarPosition="bottom-right"
                                                                                                onOpen={false}
                                                                                                value={formik.values.remittanceItems[index].expiredDate !== '' ? new DateObject(formik.values.remittanceItems[index].expiredDate) : ''}
                                                                                                onOpenPickNewDate={false}
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td style={{ width: "120px", minWidth: "110px" }}>
                                                                                        <div
                                                                                            className={`table-autocomplete `}
                                                                                        >
                                                                                            <Autocomplete
                                                                                                id="unit"
                                                                                                name={`remittanceItems.${index}.unit`}
                                                                                                options={
                                                                                                    itemsDatagridMeasurementUnitLookup
                                                                                                }
                                                                                                renderOption={(
                                                                                                    props,
                                                                                                    option
                                                                                                ) => (
                                                                                                    <Box
                                                                                                        component="li"
                                                                                                        {...props}
                                                                                                    >
                                                                                                        {option.Code} - {option.Name}
                                                                                                    </Box>
                                                                                                )}
                                                                                                filterOptions={(
                                                                                                    options,
                                                                                                    state
                                                                                                ) => {
                                                                                                    let newOptions = [];
                                                                                                    options.forEach((element) => {
                                                                                                        if (
                                                                                                            element.Code.includes(
                                                                                                                state.inputValue.toLowerCase()
                                                                                                            ) ||
                                                                                                            element.Name.replace(
                                                                                                                "/",
                                                                                                                ""
                                                                                                            )
                                                                                                                .toLowerCase()
                                                                                                                .includes(
                                                                                                                    state.inputValue.toLowerCase()
                                                                                                                )
                                                                                                        )
                                                                                                            newOptions.push(element);
                                                                                                    });
                                                                                                    return newOptions;
                                                                                                }}
                                                                                                getOptionLabel={(option) =>
                                                                                                    option.Name
                                                                                                }
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: 200,
                                                                                                            maxWidth: "90vw",
                                                                                                            direction: i18n.dir(),
                                                                                                            position: "absolute",
                                                                                                            fontSize: "12px",
                                                                                                            right:
                                                                                                                i18n.dir() === "rtl"
                                                                                                                    ? "0"
                                                                                                                    : "unset",
                                                                                                        },
                                                                                                    },
                                                                                                }}
                                                                                                sx={{
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "relative",
                                                                                                    background: "#e9ecefd2",
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: "12px",
                                                                                                }}
                                                                                                size="small"
                                                                                                clearOnBlur={true}
                                                                                                forcePopupIcon={false}
                                                                                                open={
                                                                                                    remittanceItemsFocusedRow === index + 1
                                                                                                        ? remittanceItemsUnitOpen
                                                                                                        : false
                                                                                                }
                                                                                                noOptionsText={t(
                                                                                                    "اطلاعات یافت نشد"
                                                                                                )}
                                                                                                onInputChange={(
                                                                                                    event,
                                                                                                    value
                                                                                                ) => {
                                                                                                    if (
                                                                                                        value !== "" &&
                                                                                                        event !== null
                                                                                                    ) {
                                                                                                        RenderRemittanceItemsUnitOpenState(
                                                                                                            index,
                                                                                                            true
                                                                                                        );
                                                                                                    } else {
                                                                                                        RenderRemittanceItemsUnitOpenState(
                                                                                                            index,
                                                                                                            false
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                onChange={(event, value) => {
                                                                                                    RenderRemittanceItemsUnitOpenState(
                                                                                                        index,
                                                                                                        false
                                                                                                    );
                                                                                                    if (value) {
                                                                                                        formik.setFieldValue(
                                                                                                            `remittanceItems[${index}].unit`,
                                                                                                            value.Code
                                                                                                        );
                                                                                                        let temp = container;
                                                                                                        temp[index] =
                                                                                                            value.Coefficient;
                                                                                                        setContainer(temp);
                                                                                                        formik.setFieldValue(
                                                                                                            `remittanceItems[${index}].amount`,
                                                                                                            parseInt(
                                                                                                                formik.values
                                                                                                                    .remittanceItems[index]
                                                                                                                    .number
                                                                                                            ) * value.Coefficient
                                                                                                        );

                                                                                                    } else {
                                                                                                        formik.setFieldValue(
                                                                                                            `remittanceItems[${index}].unit`,
                                                                                                            ""
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                onBlur={(e) =>
                                                                                                    RenderRemittanceItemsUnitOpenState(
                                                                                                        index,
                                                                                                        false
                                                                                                    )
                                                                                                }
                                                                                                renderInput={(params) => (
                                                                                                    <TextField
                                                                                                        {...params}
                                                                                                        label=""
                                                                                                        variant="outlined"
                                                                                                    />
                                                                                                )}
                                                                                                onKeyDown={(e) => {
                                                                                                    if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && RenderRemittanceItemsUnitOpenState === false) {
                                                                                                        e.preventDefault()
                                                                                                        RenderRemittanceItemsUnitOpenState(index, false)
                                                                                                    }
                                                                                                    setTimeout(() => {
                                                                                                        itemsKeyDownHandler(e)
                                                                                                    }, 0);

                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td
                                                                                        style={{
                                                                                            width: "120px",
                                                                                            minWidth: "90px",
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                            className={`form-input `}
                                                                                            id="number"
                                                                                            name={`remittanceItems.${index}.number`}
                                                                                            value={
                                                                                                formik.values.remittanceItems[
                                                                                                    index
                                                                                                ].number
                                                                                            }
                                                                                            onChange={(e) => {
                                                                                                formik.setFieldValue(
                                                                                                    `remittanceItems[${index}].number`, e.target.value
                                                                                                )
                                                                                                formik.setFieldValue(
                                                                                                    `remittanceItems[${index}].amount`,
                                                                                                    parseInt(
                                                                                                        e.target.value
                                                                                                    ) * container[index] || 0
                                                                                                );

                                                                                            }}
                                                                                            autoComplete="off"
                                                                                        />
                                                                                    </td>
                                                                                    <td
                                                                                        style={{
                                                                                            width: "120px",
                                                                                            minWidth: "90px",
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            className={`form-input `}
                                                                                            id="number"
                                                                                            name={`remittanceItems.${index}.amount`}
                                                                                            value={
                                                                                                formik.values.remittanceItems[
                                                                                                    index
                                                                                                ].amount
                                                                                            }

                                                                                            onBlur={() =>
                                                                                                CalculateRemittanceItemsAmountTotal()
                                                                                            }
                                                                                            disabled
                                                                                            autoComplete="off"
                                                                                        />
                                                                                    </td>
                                                                                    <td
                                                                                        style={{
                                                                                            width: "300px",
                                                                                            minWidth: "200px",
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                            className={`form-input `}
                                                                                            id="description"
                                                                                            name={`remittanceItems.${index}.description`}
                                                                                            onChange={(e) => formik.setFieldValue(`remittanceItems.${index}.description`, e.target.value)}
                                                                                            autoComplete="off"
                                                                                        />
                                                                                    </td>


                                                                                    <td style={{ width: "40px" }}>
                                                                                        <IconButton
                                                                                            variant="contained"
                                                                                            color="error"
                                                                                            className="kendo-action-btn"
                                                                                            onClick={() => {
                                                                                                remove(index);
                                                                                            }}
                                                                                        >
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </React.Fragment>
                                                                )}
                                                            ></FieldArray>
                                                        </tbody>

                                                    </table>
                                                </div>
                                                {formik?.errors?.remittanceItems?.map((error, index) => (
                                                    <p className='error-msg' key={index}>
                                                        {error ? ` ${t("ردیف")} ${index + 1} : ${error?.goods ? t(error.goods) + "." : ""} ${error?.buildSeries ? t(error.buildSeries) + "." : ""} ${error?.unit ? t(error.unit) + "." : ""} ${error?.number ? t(error.number) + "." : ""}` : null}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </FormikProvider>
                </div>
            </div>
            <div>
                <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
                    <Button
                        variant="contained"
                        color="success"
                        type="button"
                        onClick={() => {
                            if (formik.values.remittanceItems.length > 0) {
                                if (formik.errors.remittanceItems) {
                                    tableError()
                                } else {
                                    setClick(true)
                                }
                                formik.handleSubmit()
                            }
                            else {
                                emptyError()
                            }

                        }}
                    >
                        {t("تایید")}
                    </Button>

                    <div className="Issuance">
                        <Button
                            variant="contained"
                            color="error"
                            style={{ marginRight: "10px" }}
                        >
                            <Link to={'/WareHouse/Provisional/Remittance'}>
                                {t("انصراف")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Modal open={batchModalOpen} onClose={() => setBatchModalOpen(false)}>
                <Box sx={style} style={{ width: "450px" }}>
                    <BatchModal
                        getData={getBatchModalData}
                        closeModal={() => setBatchModalOpen(false)}
                    />
                </Box>
            </Modal>
        </>
    );
}
