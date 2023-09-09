import { Autocomplete, Box, Button, IconButton, Modal, TextField, useTheme } from "@mui/material"
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import * as Yup from "yup"
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../../utils/calenderLang";
import swal from "sweetalert";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { definedAccounts, deliverers, itemsDatagridBatchNumberLookup, itemsDatagridMeasurementUnitLookup, itemsDatagridProductLookup, receivingWarehouses, storeKeepers } from "./datasources";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { SelectBox } from "devextreme-react";
import BatchModal from "../../../../../components/Modals/BatchModal";
import Guid from 'devextreme/core/guid';
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../../../utils/gridKeyboardNav3";



export default function NewVoucher() {
    const emptyItems = { formikId: new Guid().valueOf(), product: "", batchNumber: "", expireDate: "", measurementUnit: "", count: 0, amount: 0, description: "" }
    const { t, i18n } = useTranslation()
    const theme = useTheme();
    const navigate = useNavigate();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 4,
        direction: i18n.dir()
    };

    const dateRef = useRef()
    const [date, setDate] = useState(new DateObject())

    const [click, setClick] = useState(false)

    const [batchModalOpen, setBatchModalOpen] = useState(false)
    const [container, setContainer] = useState([])
    const [timeValueSet, setTimeValueSet] = useState(false)

    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 100000),
            date: julianIntToDate(new DateObject().toJulianDay()),
            time: new Date(),
            doubleDraftCode: Math.floor(Math.random() * 10000),
            receivingWarehouse: "",
            storeKeeper: "",
            receiptType: "Misc",
            deliverer: "",
            definedAccount: "",
            receiptDescription: "",
            receiptItems: [emptyItems]
        },
        validationSchema: Yup.object({
            id: Yup.number().required("وارد کردن شماره رسید الزامی است"),
            receivingWarehouse: Yup.string().required("وارد کردن انبار تحویل‌گیرنده الزامی است"),
            storeKeeper: Yup.string().required("وارد کردن انباردار الزامی است"),
            receiptType: Yup.string(),
            doubleDraftCode: Yup.number()
                .when("receiptType", (receiptType) => {
                    if (receiptType === "WarehouseToWarehouse") {
                        return Yup.number().required("وارد کردن شماره حواله دوبل الزامی است")
                    }
                }),
            deliverer: Yup.string().required("تحویل‌دهنده به درستی وارد نشده است"),
            receiptItems: Yup.array(
                Yup.object({
                    product: Yup.string().required("انتخاب کالا الزامی است"),
                    batchNumber: Yup.string().required("انتخاب سری ساخت الزامی است"),
                    measurementUnit: Yup.string().required("انتخاب واحد الزامی است"),
                    count: Yup.number().positive("وارد کردن تعداد الزامی است")
                })
            )
        }),
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = values
            VoucherSub()
            console.log('All Values:', allValues)
        }
    })

    const VoucherSub = () => {
        swal({
            title: t("رسید با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }
    const tableError = () => {
        swal({
            title: t('خطاهای مشخص شده را برطرف کنید'),
            icon: "error",
            button: t("باشه")
        });
    }
    const emptyError = () => {
        swal({
            title: t("حداقل یک رسید باید ثبت گردد"),
            icon: "error",
            button: t("باشه")
        });
    }
    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }
    }, [formik.errors.receiptItems])

    const NavigateToGrid = () => {
        navigate(`/Warehouse/Document/Voucher`, { replace: false });
    }

    const getBatchModalData = (val) => {
        console.log("Send a request and make batch with these datas:", val)
    }

    useEffect(() => {
        if (!timeValueSet) {
            var timeUpdate = setInterval(() => formik.setFieldValue("time", new Date()), 30000);
        }
        return () => {
            clearTimeout(timeUpdate);
        };
    }, [timeValueSet]);

    ///// Items Grid \\\\\

    const [itemsFocusedRow, setItemsFocusedRow] = useState(1)

    const [itemsProductOpen, setItemsProductOpen] = useState(false)
    const [itemsBatchNumberOpen, setItemsBatchNumberOpen] = useState(false)
    const [itemsMeasurementUnitOpen, setItemsMeasurementUnitOpen] = useState(false)

    function addReceiptItemsRow() {
        formik.setFieldValue('receiptItems', [...formik.values.receiptItems, emptyItems])
        setContainer([...container, 0])
    }

    function RenderItemProductOpenState(index, state) {
        if (index === itemsFocusedRow - 1) {
            setItemsProductOpen(state)
        }
        else {
            setItemsProductOpen(false)
        }
    }
    function RenderItemBatchNumberOpenState(index, state) {
        if (index === itemsFocusedRow - 1) {
            setItemsBatchNumberOpen(state)
        }
        else {
            setItemsBatchNumberOpen(false)
        }
    }
    function RenderItemMeasurementUnitOpenState(index, state) {
        if (index === itemsFocusedRow - 1) {
            setItemsMeasurementUnitOpen(state)
        }
        else {
            setItemsMeasurementUnitOpen(false)
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

        if (e.keyCode === 40 && itemsProductOpen === false && itemsBatchNumberOpen === false && itemsMeasurementUnitOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.receiptItems.length === itemsFocusedRow) {
                addReceiptItemsRow()
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
        if (e.keyCode === 38 && itemsProductOpen === false && itemsBatchNumberOpen === false && itemsMeasurementUnitOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.receiptItems, addReceiptItemsRow, next, itemsFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.receiptItems, addReceiptItemsRow, next, itemsFocusedRow)
        }
        if (e.keyCode === 13 && itemsProductOpen === false && itemsBatchNumberOpen === false && itemsMeasurementUnitOpen === false) { /* Enter */
            MoveNext(formik.values.receiptItems, addReceiptItemsRow, next, itemsFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.receiptItems, addReceiptItemsRow, next, itemsFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.receiptItems, addReceiptItemsRow, next, itemsFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }


    ///// End of Items Grid \\\\\

    return (
        <>
            <div
                className='form-template' style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    borderColor: `${theme.palette.divider}`
                }}
            >
                <div>
                    <FormikProvider value={formik}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-design">
                                <div className="row">
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("شماره رسید")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <input
                                                    className='form-input'
                                                    type="text"
                                                    id='id'
                                                    name='id'
                                                    style={{ width: "100%" }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.id}
                                                    disabled
                                                />
                                            </div>
                                            {formik.touched.id && formik.errors.id && !formik.values.id ? (<div className='error-msg'>{t(formik.errors.id)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span> {t("تاریخ رسید")} </span>
                                        </div>
                                        <div className='wrapper' >
                                            <div className="row">
                                                <div className="col-8">
                                                    <div className='date-picker position-relative'>
                                                        <DatePicker
                                                            name="date"
                                                            id="date"
                                                            ref={dateRef}
                                                            value={date}
                                                            calendar={renderCalendarSwitch(i18n.language)}
                                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                                            calendarPosition="bottom-right"
                                                            onBlur={formik.handleBlur}
                                                            onChange={val => {
                                                                setDate(val)
                                                                formik.setFieldValue('date', julianIntToDate(val?.toJulianDay()));
                                                            }}
                                                        />
                                                        <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                            <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton' /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            ampm={false}
                                                            className='time-picker'
                                                            views={['hours', 'minutes']}
                                                            inputFormat="HH:mm"
                                                            mask="__:__"
                                                            value={formik.values.time}
                                                            onChange={(newValue) => {
                                                                formik.setFieldValue("time", newValue)
                                                                setTimeValueSet(true)
                                                            }}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("نوع رسید")} </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div className="row">
                                                <div className="col-6">
                                                    <label className='d-flex ml-2'>
                                                        <input
                                                            className="ms-2"
                                                            type="radio"
                                                            name="receiptType"
                                                            id="warehouseToWarehouse"
                                                            value="WarehouseToWarehouse"
                                                            onChange={(e) => formik.setFieldValue("receiptType", e.target.value)}
                                                        />
                                                        {t("رسید انبار به انبار")}
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <label className='d-flex ml-2'>
                                                        <input
                                                            className="ms-2"
                                                            type="radio"
                                                            name="receiptType"
                                                            id="misc"
                                                            value="Misc"
                                                            defaultChecked
                                                            onChange={(e) => formik.setFieldValue("receiptType", e.target.value)}
                                                        />
                                                        {t("رسید متفرقه")}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {formik.values.receiptType === "WarehouseToWarehouse" ?
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">
                                                <span> {t("شماره حواله دوبل")} <span className='star'>*</span> </span>
                                            </div>
                                            <div className='wrapper'>
                                                <div>
                                                    <input
                                                        className='form-input'
                                                        type="text"
                                                        id='doubleDraftCode'
                                                        name='doubleDraftCode'
                                                        style={{ width: "100%" }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.doubleDraftCode}
                                                    />
                                                </div>
                                                {formik.touched.doubleDraftCode && formik.errors.doubleDraftCode && !formik.values.doubleDraftCode ? (<div className='error-msg'>{t(formik.errors.doubleDraftCode)}</div>) : null}
                                            </div>
                                        </div>
                                        : <div className="content col-lg-6 col-md-6 col-12" />
                                    }
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("انبار تحویل‌گیرنده")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={receivingWarehouses}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('receivingWarehouse', e.value)}
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
                                                    name='receivingWarehouse'
                                                    id='receivingWarehouse'
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.receivingWarehouse && formik.errors.receivingWarehouse && !formik.values.receivingWarehouse ? (<div className='error-msg'>{t(formik.errors.receivingWarehouse)}</div>) : null}
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
                                            <span> {t("تحویل‌دهنده")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={deliverers}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('deliverer', e.value)}
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
                                                    name='deliverer'
                                                    id='deliverer'
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.deliverer && formik.errors.deliverer && !formik.values.deliverer ? (<div className='error-msg'>{t(formik.errors.deliverer)}</div>) : null}
                                        </div>
                                    </div>
                                    {formik.values.receiptType === "Misc" ?
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">
                                                <span> {t("حساب معین")} </span>
                                            </div>
                                            <div className='wrapper'>
                                                <div>
                                                    <SelectBox
                                                        dataSource={definedAccounts}
                                                        rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                        onValueChanged={(e) => formik.setFieldValue('definedAccount', e.value)}
                                                        className='selectBox'
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        displayExpr={function (item) {
                                                            return (
                                                                item &&
                                                                item.Code +
                                                                "- " +
                                                                item.FormersNames
                                                            );
                                                        }}
                                                        valueExpr="Code"
                                                        itemRender={null}
                                                        placeholder=''
                                                        name='definedAccount'
                                                        id='definedAccount'
                                                        searchEnabled
                                                        showClearButton
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        : <div className="content col-lg-6 col-md-6 col-12" />
                                    }
                                    <div className="content col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span> {t("شرح رسید")} </span>
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
                                    <div className='content col-lg-12 col-12'>
                                        {/* Items Grid */}
                                        <div className='row align-items-center'>
                                            <div className='content col-lg-6 col-6'>
                                                <div className='title mb-0'>
                                                    <span className='span'> {t("اقلام رسید")} :</span>
                                                </div>
                                            </div>
                                            <div className='content col-lg-6 col-6'>

                                                {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                                <div className='d-flex justify-content-end'>
                                                    <Button
                                                        variant="outlined"
                                                        className="grid-add-btn"
                                                        onClick={(e) => {
                                                            addReceiptItemsRow()
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
                                            <div className='content col-lg-12 col-12'>
                                                <div className={`table-responsive gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr className='text-center'>
                                                                <th >{t("ردیف")}</th>
                                                                <th >{t("کالا")}</th>
                                                                <th >{t("سری ساخت")}</th>
                                                                <th>
                                                                    <AddCircleOutlineIcon color="success" />
                                                                </th>
                                                                <th> {t("تاریخ انقضا")} </th>
                                                                <th> {t("واحد")} </th>
                                                                <th> {t("تعداد")} </th>
                                                                <th>{t("مقدار")}</th>
                                                                <th>{t("توضیحات")}</th>
                                                                <th>{t("حذف")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <FieldArray
                                                                name="receiptItems"
                                                                render={({ push, remove }) => (
                                                                    <React.Fragment>
                                                                        {formik?.values?.receiptItems?.map((receiptItem, index) => (
                                                                            <tr key={receiptItem.formikId} onFocus={(e) => setItemsFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                className={itemsFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                            >
                                                                                <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                    {index + 1}
                                                                                </td>

                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="product"
                                                                                            name={`receiptItems.${index}.product`}
                                                                                            options={itemsDatagridProductLookup}
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.Code} - {option.Name}
                                                                                                </Box>
                                                                                            )}
                                                                                            filterOptions={(options, state) => {
                                                                                                let newOptions = [];
                                                                                                options.forEach((element) => {
                                                                                                    if (
                                                                                                        element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                        newOptions.push(element);
                                                                                                });
                                                                                                return newOptions;
                                                                                            }}
                                                                                            getOptionLabel={option => option.Name}
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
                                                                                                    background: '#e9ecefd2',
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: '12px'
                                                                                                }

                                                                                            }

                                                                                            size="small"
                                                                                            disableClearable={true}
                                                                                            forcePopupIcon={false}
                                                                                            open={itemsFocusedRow === index + 1 ? itemsProductOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderItemProductOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderItemProductOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderItemProductOpenState(index, false)
                                                                                                formik.setFieldValue(`receiptItems[${index}].product`, value.Code)

                                                                                                // setTimeout(() => {
                                                                                                //     if (value !== "") {
                                                                                                //         itemsBatchNumberRefs.current[index].focus()
                                                                                                //     }
                                                                                                //     else {
                                                                                                //         itemsMeasurementUnitRefs.current[index].focus()
                                                                                                //     }
                                                                                                // }, 1);
                                                                                            }}
                                                                                            onBlur={(e) => RenderItemProductOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && itemsProductOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderItemProductOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    itemsKeyDownHandler(e)
                                                                                                }, 0);

                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="batchNumber"
                                                                                            name={`receiptItems.${index}.batchNumber`}
                                                                                            disabled={formik.values.receiptItems[index].product === ""}
                                                                                            options={itemsDatagridBatchNumberLookup}
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.BatchNumber} - {option.ExpirationDate}
                                                                                                </Box>
                                                                                            )}
                                                                                            filterOptions={(options, state) => {
                                                                                                let newOptions = [];
                                                                                                options.forEach((element) => {
                                                                                                    if (
                                                                                                        element.BatchNumber.includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.ExpirationDate.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                        newOptions.push(element);
                                                                                                });
                                                                                                return newOptions;
                                                                                            }}
                                                                                            getOptionLabel={option => option.BatchNumber}
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
                                                                                                    background: formik.values.receiptItems[index].product !== "" ? "#e9ecefd2" : "white",
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: '12px'
                                                                                                }

                                                                                            }
                                                                                            size="small"
                                                                                            disableClearable={true}
                                                                                            forcePopupIcon={false}
                                                                                            open={itemsFocusedRow === index + 1 ? itemsBatchNumberOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderItemBatchNumberOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderItemBatchNumberOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderItemBatchNumberOpenState(index, false)
                                                                                                formik.setFieldValue(`receiptItems[${index}].batchNumber`, value.BatchNumber)
                                                                                                formik.setFieldValue(`receiptItems[${index}].expireDate`, value.ExpirationDate)
                                                                                            }}
                                                                                            onBlur={(e) => RenderItemBatchNumberOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && itemsBatchNumberOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderItemBatchNumberOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    itemsKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '40px' }}>
                                                                                    <IconButton variant="contained" color="success" className='kendo-action-btn' style={itemsFocusedRow === index + 1 ? { display: "block" } : { display: "none" }} onClick={() => {
                                                                                        setBatchModalOpen(true)
                                                                                    }}>
                                                                                        <AddCircleOutlineIcon />
                                                                                    </IconButton >
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        name={`receiptItems.${index}.expireDate`}
                                                                                        type='text'
                                                                                        value={formik.values.receiptItems[index].expireDate}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="measurementUnit"
                                                                                            name={`receiptItems.${index}.measurementUnit`}
                                                                                            options={itemsDatagridMeasurementUnitLookup}
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.Code} - {option.Name}
                                                                                                </Box>
                                                                                            )}
                                                                                            filterOptions={(options, state) => {
                                                                                                let newOptions = [];
                                                                                                options.forEach((element) => {
                                                                                                    if (
                                                                                                        element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                        newOptions.push(element);
                                                                                                });
                                                                                                return newOptions;
                                                                                            }}
                                                                                            getOptionLabel={option => option.Name}
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
                                                                                                    background: '#e9ecefd2',
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: '12px'
                                                                                                }
                                                                                            }
                                                                                            size="small"
                                                                                            disableClearable={true}
                                                                                            forcePopupIcon={false}
                                                                                            open={itemsFocusedRow === index + 1 ? itemsMeasurementUnitOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderItemMeasurementUnitOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderItemMeasurementUnitOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderItemMeasurementUnitOpenState(index, false)
                                                                                                formik.setFieldValue(`receiptItems[${index}].measurementUnit`, value.Code)
                                                                                                let temp = container
                                                                                                temp[index] = value.Coefficient
                                                                                                setContainer(temp)
                                                                                                setTimeout(() => {

                                                                                                    formik.setFieldValue(`receiptItems[${index}].amount`, parseInt(formik.values.receiptItems[index].count) * value.Coefficient)
                                                                                                }, 100);
                                                                                            }}
                                                                                            onBlur={(e) => RenderItemMeasurementUnitOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && itemsMeasurementUnitOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderItemMeasurementUnitOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    itemsKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ minWidth: '90px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                        name={`receiptItems.${index}.count`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={() => formik.setFieldValue(`receiptItems[${index}].amount`, parseInt(formik.values.receiptItems[index].count) * container[index])}
                                                                                        value={formik.values.receiptItems[index].count}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '90px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        name={`receiptItems.${index}.amount`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.receiptItems[index].amount}
                                                                                        disabled
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                        name={`receiptItems.${index}.description`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.receiptItems[index].description}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ width: '40px' }}>
                                                                                    <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
                                                                                        let temp = container.filter((item, iIndex) => iIndex !== index)
                                                                                        setContainer([...temp])
                                                                                        remove(index)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton >
                                                                                </td>

                                                                            </tr>
                                                                        ))}


                                                                    </React.Fragment>

                                                                )}>
                                                            </FieldArray>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {formik?.errors?.receiptItems?.map((error, index) => (
                                                    <p className='error-msg' key={index}>
                                                        {error ? ` ${t("ردیف")} ${index + 1} : ${error?.product ? t(error.product) + "." : ""} ${error?.batchNumber ? t(error.batchNumber) + "." : ""} ${error?.measurementUnit ? t(error.measurementUnit) + "." : ""} ${error?.count ? t(error.count) + "." : ""}` : null}
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
                <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`}>
                    <Button
                        variant="contained"
                        color="success"
                        type="button"
                        onClick={() => {
                            if (formik.values.receiptItems.length > 0) {
                                if (formik.errors.receiptItems) {
                                    tableError()
                                } else {
                                    setClick(true)
                                }
                                formik.handleSubmit()
                            }
                            else {
                                console.log('eklse')
                                emptyError()

                            }

                        }}
                    >
                        {t("تایید")}
                    </Button>

                    <div className="Issuance">
                        <Button variant="contained" color="error"
                            onClick={NavigateToGrid}>
                            {t("انصراف")}
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                open={batchModalOpen}
                onClose={() => setBatchModalOpen(false)}
            >
                <Box sx={style} style={{ width: '450px' }}>
                    <BatchModal getData={getBatchModalData} closeModal={() => setBatchModalOpen(false)} />
                </Box>
            </Modal>
        </>
    )
}
