import { SelectBox } from 'devextreme-react';
import React, { useEffect, useRef, useState } from 'react'
import Guid from "devextreme/core/guid";
import {
    Autocomplete, Box, Button, Checkbox, FormControlLabel, IconButton, TextField, Typography, useTheme} from '@mui/material';
import { moeinAcountLookupData, descriptiveLookupData } from './lookupData';
import { useTranslation } from 'react-i18next';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup"
import swal from 'sweetalert';
import { julianIntToDate } from '../../../../../utils/dateConvert';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../../utils/calenderLang';
import DatePicker from 'react-multi-date-picker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { parsFloatFunction } from '../../../../../utils/parsFloatFunction';
import CurrencyInput from 'react-currency-input-field';
import DateObject from 'react-date-object';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams } from "react-router-dom";
import { history } from "../../../../../utils/history";
import bankNames from "./bankName.json";
import cashDeskData from "./CashDeskData.json";
import recieptFormGridData from "./recieptFormGridData.json";
import RKGrid,{ FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import ActionCellReceiptForm from "./ActionCellReceiptForm";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../../../utils/gridKeyboardNav3";





export default function ReceiptForm() {
    const emptyCashBalance = { formikId: new Guid().valueOf(), moeinAcount: '', descriptive: "", debtor: '', creditor: '', description: '' };
    const emptyCashtransfer = { formikId: new Guid().valueOf(), bankAccount: '', receiptNumber: "", price: '', description: '' };

    const { t, i18n } = useTranslation()

    const theme = useTheme();

    const dateRef = useRef()


    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('')
    const [gridData, setGridData] = useState([])
    const dataRef = useRef()
    dataRef.current = gridData

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomFooterSome2 = (props) => {

        const [total, setTotal] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current.CashDiscountAmount) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])

        return (
            <td colSpan={props.colSpan} className={` word-break ${props?.className ? props?.className : ''}`} style={props.style}>
                {total?.toLocaleString()}
            </td>
        );
    }



    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'accountParty',
            name: "طرف حساب",
            children: [
                {
                    field: 'PartnerCode',
                    name: "کد",
                },
                {
                    field: 'PartnerName',
                    name: "نام",
                },
                {
                    field: 'PartnerLegalName',
                    name: "نام حقوقی",
                },
            ]
        },
        {
            field: 'factorInfo',
            name: "اطلاعات فاکتور",
            children: [
                {
                    field: 'OrderPreCode',
                    name: "شماره پیشفاکتور",
                },
                {
                    field: 'OrderCode',
                    name: "شماره فاکتور",
                },
                {
                    field: 'AccountingDocumentCode',
                    name: "سند",
                },
                {
                    field: 'AccountingDocumentTrackCode',
                    name: "ش پیگیری",
                },
                {
                    field: 'Visitor',
                    name: "ویزیتور",
                },
                {
                    field: 'InitialOrderPrice',
                    name: "مبلغ",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'CashDiscount',
                    name: "تخفیف تسویه نقد",
                    cell: CurrencyCell,
                    className: 'span-ltr',
                    footerCell: CustomFooterSome2,
                },
                {
                    field: 'ReductionFromVAT',
                    name: "کسر از مالیات",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'FinalOrderPrice',
                    name: "مبلغ نهایی",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'MatchPrice',
                    name: "تطبیق داده شده",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'Remain',
                    name: "مانده",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
            ]
        },
        {
            field: 'CashReceive',
            name: "دریافت نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'CashPayment',
            name: "پرداخت نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'ReceiveRemittance',
            name: "دریافت حواله",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'ReceiveRemittance',
            name: "دریافت چک",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '50px',
            name: "عملیات",
            cell: ActionCellReceiptForm,
            className: 'text-center',
            reorderable: false
        }
    ]

    const initialCashBalance = { formikId: new Guid().valueOf(), moeinAcount: '0101001', descriptive: "00000002", debtor: 100000, creditor: 0, description: 'تست' }
    const initialCashtransfer = { formikId: new Guid().valueOf(), bankAccount: '0101001', receiptNumber: "2311", price: 2500000, description: '' }

    const id = searchParams.get('id')

    const [debitTotal, setDebitTotal] = useState(0)
    const [creditorTotal, setCreditorTotal] = useState(0)
    const [remain, setRemain] = useState(0)
    const [priceTotal, setPriceTotal] = useState(0)
    const [click, setClick] = useState(false)

    const formik = useFormik({
        initialValues: {
            invoicesNumber: 903,
            distributor: 'جهانگرد رضایی',
            secondDistributor: '---',
            driver: 'جهانگرد رضایی',
            CashDesk: '10004',
            description: '',
            SumCashReceived: 0,
            SumCashPayments: 0,
            ReceiveCashDistributor: 6000000,
            RemainingCashBalance: 0,
            displayInvoices: false,
            date: julianIntToDate(new DateObject().toJulianDay()),
            cashBalance: [initialCashBalance],
            cashTransfer: [initialCashtransfer],
        },

        validationSchema: Yup.object({

            initialBalance: Yup.number(),
            CashDesk: Yup.string().required('صندوق باید انتخاب گردد'),
            cashBalance: Yup.array(
                Yup.object({
                    moeinAcount: Yup.string().required('حساب معین باید انتخاب گردد'),
                    debtor: Yup.number().min(0, "میزان بدهکار باید مثبت باشد"),
                    creditor: Yup.number().min(0, "میزان بستانکار باید مثبت باشد"),


                })
            ),
            cashTransfer: Yup.array(
                Yup.object({
                    bankAccount: Yup.string().required('حساب بانکی باید انتخاب گردد'),
                    receiptNumber: Yup.string().required('شماره فیش بانکی باید وارد شود'),
                    price: Yup.number().required('مبلغ باید وارد شود').min(0, "میزان مبلغ باید مثبت باشد"),


                })
            ),

        }),

        validateOnChange: false,
        onSubmit: (values) => {

            DocumentSub()
            console.log('All Values:', values)
        }
    })

    console.log('Formik', formik.errors)
    const DocumentSub = () => {
        swal({
            title: t("سند با موفقیت ثبت شد"),
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
    const cashError = () => {
        swal({
            title: t('مغایرت نقدی موزع تراز نشده است.'),
            icon: "error",
            button: t("باشه")
        });
    }



    useEffect(() => {
        let temp = parseFloat(formik.values.SumCashReceived, 2) - parseFloat(formik.values.SumCashPayments, 2) - parseFloat(formik.values.ReceiveCashDistributor, 2)
        formik.setFieldValue('RemainingCashBalance', Math.abs(temp))
        setRemain(temp)
        temp == 0 ? setStatus('') : temp > 0 ? setStatus('debtor') : setStatus('creditor')

    }, [formik.values.SumCashReceived, formik.values.SumCashPayments, formik.values.ReceiveCashDistributor])


    const [date, setDate] = useState(new DateObject())

    useEffect(() => {
        if (recieptFormGridData.length) {
            let tempData = recieptFormGridData.map((data) => {
                return {
                    ...data,
                    CashDiscount: `${(data.CashDiscountAmount).toLocaleString()} ${data?.CashDiscountPercent ? `(${Math.round(data?.CashDiscountPercent)}%)` : ''}`
                }
            })
            setGridData(tempData)
            let SumCashReceived = recieptFormGridData?.reduce(
                (acc, current) => acc + parseFloat(current.CashReceive) || 0,
                0
            );
            formik.setFieldValue('SumCashReceived', SumCashReceived)
            let SumCashPayments = recieptFormGridData?.reduce(
                (acc, current) => acc + parseFloat(current.CashPayment) || 0,
                0
            );
            formik.setFieldValue('SumCashPayments', SumCashPayments)

        }

    }, [recieptFormGridData])


    const [cashBalanceFocusedRow, setCashBalanceFocusedRow] = useState(1)
    const [cashTransferFocusedRow, setCashTransferFocusedRow] = useState(1)
    const [moeinAcountOpen, setMoeinAcountOpen] = React.useState(false);
    const [bankAccountOpen, setBankAccountOpen] = React.useState(false);

    function HandleMoeinAccountOpenState(index, state) {
        if (index === cashBalanceFocusedRow - 1) {
            setMoeinAcountOpen(state)
        }
        else {
            setMoeinAcountOpen(false)
        }
    }

    function HandlebankAccountOpenState(index, state) {
        if (index === cashTransferFocusedRow - 1) {
            setBankAccountOpen(state)
        }
        else {
            setBankAccountOpen(false)
        }
    }
    const [descriptiveOpen, setDescriptiveOpen] = React.useState(false);

    function HandleDescriptiveOpenState(index, state) {
        if (index === cashBalanceFocusedRow - 1) {
            setDescriptiveOpen(state)
        }
        else {
            setDescriptiveOpen(false)
        }
    }

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }

    }, [formik.errors.cashBalance, formik.errors.cashTransfer])




    function addCashBalanceRow() {
        formik.setFieldValue('cashBalance', [...formik.values.cashBalance, emptyCashBalance])
    }

    function addCashTransferRow() {
        formik.setFieldValue('cashTransfer', [...formik.values.cashTransfer, emptyCashtransfer])
    }
    function keyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        console.log('next', next)
        console.log('findNextFocusable(next)', findNextFocusable(next))

        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && moeinAcountOpen === false && descriptiveOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.cashBalance.length === cashBalanceFocusedRow) {
                addCashBalanceRow()
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
        if (e.keyCode === 38 && moeinAcountOpen === false && descriptiveOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.cashBalance, addCashBalanceRow, next, cashBalanceFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.cashBalance, addCashBalanceRow, next, cashBalanceFocusedRow)
        }
        if (e.keyCode === 13 && moeinAcountOpen === false && descriptiveOpen === false) { /* Enter */
            MoveNext(formik.values.cashBalance, addCashBalanceRow, next, cashBalanceFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.cashBalance, addCashBalanceRow, next, cashBalanceFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.cashBalance, addCashBalanceRow, next, cashBalanceFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }

    function keyDownHandlerTransfer(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && bankAccountOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.cashTransfer.length === cashTransferFocusedRow) {
                addCashTransferRow()
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
        if (e.keyCode === 38 && bankAccountOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.cashTransfer, addCashTransferRow, next, cashTransferFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.cashTransfer, addCashTransferRow, next, cashTransferFocusedRow)
        }
        if (e.keyCode === 13 && bankAccountOpen === false) { /* Enter */
            MoveNext(formik.values.cashTransfer, addCashTransferRow, next, cashTransferFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.cashTransfer, addCashTransferRow, next, cashTransferFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.cashTransfer, addCashTransferRow, next, cashTransferFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }


    function HandleDebtorChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashBalance[${index}].debtor`, parsFloatFunction(temp, 2))
    }

    function HandleCreditorChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashBalance[${index}].creditor`, parsFloatFunction(temp, 2))
    }

    function HandlePriceChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashTransfer[${index}].price`, parsFloatFunction(temp, 2))
    }

    useEffect(() => {

        let debitTemp = 0
        let creditorTemp = 0
        formik.values.cashBalance.forEach(element => {
            debitTemp += element.debtor || 0
            setDebitTotal(parsFloatFunction(debitTemp, 2))
        });

        formik.values.cashBalance.forEach(element => {
            creditorTemp += element.creditor || 0
            setCreditorTotal(parsFloatFunction(creditorTemp, 2))
        });


    }, [formik.values.cashBalance])
    useEffect(() => {
        let temp = 0

        formik.values.cashTransfer.forEach(element => {
            temp += element.price || 0
            setPriceTotal(parsFloatFunction(temp, 2))
        });


    }, [formik.values.cashTransfer])

    function HandleBalanceChange(value, field) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(field, parsFloatFunction(temp, 2))
    }


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
                                <div className='row'>
                                    <div className="content col-lg-3 col-md-3 col-sm-6 col-12">
                                        <div className="title">
                                            <span>{t("تسویه فاکتورهای سرجمع شماره")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="invoicesNumber"
                                                    name="invoicesNumber"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.invoicesNumber}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="content col-lg-3 col-md-3 col-sm-6 col-12">
                                        <div className="title">
                                            <span>{t("موزع")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="distributor"
                                                    name="distributor"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.distributor}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="content col-lg-3 col-md-3 col-sm-6 col-12">
                                        <div className="title">
                                            <span>{t("موزع دوم")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="secondDistributor"
                                                    name="secondDistributor"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.secondDistributor}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="content col-lg-3 col-md-3 col-sm-6 col-12">
                                        <div className="title">
                                            <span>{t("راننده")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="driver"
                                                    name="driver"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.driver}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-sm-6 col-12' onFocus={() => {
                                        dateRef?.current?.closeCalendar();
                                    }}>
                                        <div className="title">
                                            <span>{t("صندوق")}<span className="star">*</span></span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <SelectBox
                                                    dataSource={cashDeskData}
                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                    valueExpr="id"
                                                    className='selectBox'
                                                    searchEnabled={true}
                                                    defaultValue={formik.values.CashDesk}
                                                    placeholder=''
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return item && item.id + '- ' + item.name;
                                                    }}
                                                    displayValue='name'
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('CashDesk', e.value)
                                                        console.log("e", e)
                                                    }}
                                                />

                                                {formik.touched.CashDesk && formik.errors.CashDesk &&
                                                    !formik.values.CashDesk ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.CashDesk)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="title">
                                            <span>{t("تاریخ")}<span className="star">*</span></span>
                                        </div>
                                        <div className="wrapper date-picker position-relative">
                                            <DatePicker
                                                ref={dateRef}
                                                name={"date"}
                                                id={"date"}
                                                calendarPosition="bottom-right"
                                                calendar={renderCalendarSwitch(i18n.language)}
                                                locale={renderCalendarLocaleSwitch(i18n.language)}
                                                onBlur={formik.handleBlur}
                                                onChange={(val) => {
                                                    formik.setFieldValue(
                                                        "date",
                                                        julianIntToDate(val.toJulianDay())
                                                    );
                                                }}
                                                value={date}
                                            />
                                            <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <CalendarMonthIcon className='calendarButton' />
                                                </div>
                                            </div>
                                            {formik.touched.date && formik.errors.date &&
                                                !formik.values.date ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.date)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-sm-6 col-12' onFocus={() => {
                                        dateRef?.current?.closeCalendar();
                                    }}>
                                        <div className="title">
                                            <span>{t("توضیحات")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <textarea
                                                    rows="8"
                                                    className="form-input"
                                                    id="description"
                                                    name="description"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.description}
                                                />
                                                {formik.touched.description && formik.errors.description ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.description)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-12'>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formik.values.displayInvoices}
                                                    id="displayInvoices"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    name="displayInvoices"
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            sx={{
                                                margin: 0
                                            }}
                                            label={
                                                <Typography variant="h6">{t("نمایش فاکتورهای کاملا مرجوعی")}</Typography>
                                            }
                                        />
                                        <div style={{ margin: '0 -20px' }}>
                                            <RKGrid
                                                gridId={'recieptFormGrid'}
                                                gridData={gridData}
                                                columnList={tempColumn}
                                                showSetting={false}
                                                showChart={false}
                                                showExcelExport={false}
                                                showPrint={false}
                                                rowCount={10}
                                                sortable={false}
                                                pageable={true}
                                                reorderable={false}
                                                selectable={false}

                                            />
                                        </div>

                                    </div>
                                    <div className='col-md-6 col-sm-6 col-12 mt-4'>
                                        <div className="title">
                                            <span>{t("جمع مبالغ نقد دریافتی از مشتریان")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <CurrencyInput
                                                    className='form-input'
                                                    id="SumCashReceived"
                                                    name="SumCashReceived"
                                                    onChange={(e) => HandleBalanceChange(e.target.value, 'SumCashReceived')}
                                                    value={formik.values.SumCashReceived}
                                                    decimalsLimit={2}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div><div className='d-none d-sm-block col-md-6 col-sm-6'></div>
                                    <div className='col-md-6 col-sm-6 col-12'>
                                        <div className="title">
                                            <span>{t("جمع مبالغ نقد پرداختی به مشتریان")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <CurrencyInput
                                                    className='form-input'
                                                    id="SumCashPayments"
                                                    name="SumCashPayments"
                                                    onChange={(e) => HandleBalanceChange(e.target.value, 'SumCashPayments')}
                                                    value={formik.values.SumCashPayments}
                                                    decimalsLimit={2}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div><div className='d-none d-sm-block col-md-6 col-sm-6'></div>
                                    <div className='col-md-6 col-sm-6 col-12'>
                                        <div className="title">
                                            <span>{t("دریافت نقد از موزع")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <CurrencyInput
                                                className='form-input'
                                                id="ReceiveCashDistributor"
                                                name="ReceiveCashDistributor"
                                                onChange={(e) => HandleBalanceChange(e.target.value, 'ReceiveCashDistributor')}
                                                decimalsLimit={2}
                                                defaultValue={formik.values.ReceiveCashDistributor}
                                            />
                                        </div>
                                    </div><div className='d-none d-sm-block col-md-6 col-sm-6'></div>
                                    <div className='col-md-6 col-sm-6 col-12'>
                                        <div className="title">
                                            <span>{t("مانده نقد سرجمع")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div className={remain != (debitTotal - creditorTotal) ? 'balanceFieldRed' : ''}>
                                                <label style={{ display: "flex", textAlign: "center" }}>
                                                    <CurrencyInput
                                                        className='form-input'
                                                        id="RemainingCashBalance"
                                                        name="RemainingCashBalance"
                                                        onChange={(e) => HandleBalanceChange(e.target.value, 'RemainingCashBalance')}
                                                        value={formik.values.RemainingCashBalance}
                                                        decimalsLimit={2}
                                                        disabled
                                                    />
                                                    {status !== '' && <div
                                                        style={{ width: "20%", display: "flex", alignItems: "center", "justify-content": 'center' }} className={status == 'debtor' ? 'balanceFieldRed' : status == 'creditor' ? 'balanceFieldGreen' : ''}>
                                                        <span>{status == 'debtor' ? t("بدهکار") : status == 'creditor' ? t("بستانکار") : ''}</span>
                                                    </div>}
                                                </label>
                                            </div>
                                        </div>
                                    </div><div className='d-none d-sm-block col-md-6 col-sm-6'></div>
                                    <div className='col-12'>
                                        <div className='row'>
                                            <div className={`col-lg-8 col-12 ${formik.values.RemainingCashBalance !== 0 ? '' : 'd-none'}`}>
                                                <div className='row align-items-center'>
                                                    <div className='content col-md-4 col-12'>
                                                        <div className='title mb-0'>
                                                            <span
                                                                className='span'> {t("بالانس مغایرت نقدی موزع")}:</span>
                                                        </div>
                                                    </div>

                                                    <div className='content col-md-8 col-12'>
                                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                                        <div className='d-flex justify-content-end align-items-center'>
                                                            <Button
                                                                variant="outlined"
                                                                className="grid-add-btn"
                                                                onClick={(e) => {
                                                                    addCashBalanceRow();
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
                                                        <div
                                                            className={`table-responsive gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>

                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr className='text-center'>
                                                                        <th>{t("ردیف")}</th>
                                                                        <th>{t("حساب معین")}</th>
                                                                        <th>{t("تفضیلی")}</th>
                                                                        <th>{t("بدهکار")}</th>
                                                                        <th>{t("بستانکار")}</th>
                                                                        <th>{t("شرح")}</th>
                                                                        <th>{t("حذف")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <FieldArray
                                                                        name="cashBalance"
                                                                        render={({ push, remove }) => (
                                                                            <React.Fragment>
                                                                                {formik?.values?.cashBalance?.map((cashBalance, index) => (
                                                                                    <tr key={cashBalance.formikId}
                                                                                        onFocus={(e) => setCashBalanceFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                        className={cashBalanceFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                                    >
                                                                                        <td className='text-center' style={{
                                                                                            verticalAlign: 'middle',
                                                                                            width: '40px'
                                                                                        }}>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '115px',
                                                                                            minWidth: '115px'
                                                                                        }}>
                                                                                            <div
                                                                                                className={`table-autocomplete `}>
                                                                                                <Autocomplete
                                                                                                    defaultValue={index == 0 ? {
                                                                                                        Code: "0101001",
                                                                                                        FormersSimpleNames: "موجودی نقد وبانک / صندوق"
                                                                                                    } : {
                                                                                                        Code: "",
                                                                                                        FormersSimpleNames: ""
                                                                                                    }}
                                                                                                    componentsProps={{
                                                                                                        paper: {
                                                                                                            sx: {
                                                                                                                width: 300,
                                                                                                                direction: i18n.dir(),
                                                                                                                position: "absolute",
                                                                                                                fontSize: '12px',
                                                                                                                right: "0"
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
                                                                                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                    disableClearable={true}
                                                                                                    forcePopupIcon={false}
                                                                                                    id="moeinAcount"
                                                                                                    name={`cashBalance.${index}.moeinAcount`}
                                                                                                    open={cashBalanceFocusedRow === index + 1 ? moeinAcountOpen : false}
                                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                    options={moeinAcountLookupData}


                                                                                                    getOptionLabel={option => option.FormersSimpleNames}
                                                                                                    renderOption={(props, option) => (
                                                                                                        <Box
                                                                                                            component="li" {...props}>
                                                                                                            {option.Code}-({option.FormersSimpleNames})
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    filterOptions={(options, state) => {
                                                                                                        let newOptions = [];
                                                                                                        options.forEach((element) => {
                                                                                                            if (
                                                                                                                element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                                element.FormersSimpleNames.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                            )
                                                                                                                newOptions.push(element);
                                                                                                        });
                                                                                                        return newOptions;
                                                                                                    }}
                                                                                                    onInputChange={(event, value) => {
                                                                                                        if (value !== "" && event !== null) {
                                                                                                            HandleMoeinAccountOpenState(index, true)
                                                                                                        } else {
                                                                                                            HandleMoeinAccountOpenState(index, false)
                                                                                                        }
                                                                                                    }}
                                                                                                    onChange={(event, value) => {

                                                                                                        HandleMoeinAccountOpenState(index, false)

                                                                                                        formik.setFieldValue(`cashBalance[${index}].moeinAcount`, value.Code)
                                                                                                    }}
                                                                                                    onBlur={(e) => {
                                                                                                        HandleMoeinAccountOpenState(index, false)
                                                                                                    }}
                                                                                                    onSubmit={(e) => console.log(e)}
                                                                                                    renderInput={params => (
                                                                                                        <TextField {...params}
                                                                                                            label=""
                                                                                                            variant="outlined" />
                                                                                                    )}
                                                                                                    onKeyDown={(e) => {
                                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && moeinAcountOpen === false) {
                                                                                                            e.preventDefault()
                                                                                                            HandleMoeinAccountOpenState(index, false)
                                                                                                        }
                                                                                                        setTimeout(() => {
                                                                                                            keyDownHandler(e)
                                                                                                        }, 0);

                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '115px',
                                                                                            minWidth: '115px'
                                                                                        }}>
                                                                                            {console.log('00000000000000', descriptiveLookupData.filter(item => item.Code == formik.values.cashBalance[index].descriptive)[0])}
                                                                                            <div
                                                                                                className={`table-autocomplete `}>
                                                                                                <Autocomplete
                                                                                                    defaultValue={index == 0 ? (descriptiveLookupData.filter(item => item.Code == formik.values.cashBalance[index].descriptive))[0] : { "Code": "", "Name": "" }}
                                                                                                    componentsProps={{
                                                                                                        paper: {
                                                                                                            sx: {
                                                                                                                width: 300,
                                                                                                                direction: i18n.dir(),
                                                                                                                position: "absolute",
                                                                                                                fontSize: '12px',
                                                                                                                right: "0"
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
                                                                                                    forcePopupIcon={false}
                                                                                                    clearOnBlur={true}
                                                                                                    id="descriptive"
                                                                                                    name={`cashBalance.${index}.descriptive`}
                                                                                                    open={cashBalanceFocusedRow === index + 1 ? descriptiveOpen : false}
                                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                    options={descriptiveLookupData}
                                                                                                    getOptionLabel={option => option.Name}
                                                                                                    renderOption={(props, option) => (
                                                                                                        <Box
                                                                                                            component="li" {...props}>
                                                                                                            {option.Code}-({option.Name})
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    filterOptions={(options, state) => {
                                                                                                        let newOptions = [];
                                                                                                        options.forEach((element) => {
                                                                                                            if (
                                                                                                                element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                                element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                            )
                                                                                                                newOptions.push(element);
                                                                                                        });
                                                                                                        return newOptions;
                                                                                                    }}
                                                                                                    onInputChange={(event, value) => {
                                                                                                        if (value !== "" && event !== null) {
                                                                                                            HandleDescriptiveOpenState(index, true)
                                                                                                        } else {
                                                                                                            HandleDescriptiveOpenState(index, false)
                                                                                                        }
                                                                                                    }}
                                                                                                    onChange={(event, value) => {
                                                                                                        HandleDescriptiveOpenState(index, false)
                                                                                                        if (value) {
                                                                                                            formik.setFieldValue(`cashBalance[${index}].descriptive`, value.Code)
                                                                                                        } else {
                                                                                                            formik.setFieldValue(`cashBalance[${index}].descriptive`, "")
                                                                                                        }

                                                                                                    }}
                                                                                                    onBlur={(e) => HandleDescriptiveOpenState(index, false)}
                                                                                                    renderInput={params => (
                                                                                                        <TextField {...params}
                                                                                                            label=""
                                                                                                            variant="outlined" />
                                                                                                    )}
                                                                                                    onKeyDown={(e) => {
                                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && descriptiveOpen === false) {
                                                                                                            e.preventDefault()
                                                                                                            HandleDescriptiveOpenState(index, false)
                                                                                                        }
                                                                                                        setTimeout(() => {
                                                                                                            keyDownHandler(e)
                                                                                                        }, 0);

                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '80px',
                                                                                            minWidth: '80px'
                                                                                        }}>
                                                                                            <CurrencyInput
                                                                                                onKeyDown={(e) => keyDownHandler(e)}
                                                                                                className={`form-input `}
                                                                                                id="debtor"
                                                                                                defaultValue={index == 0 ? initialCashBalance.debtor : 0}
                                                                                                name={`cashBalance.${index}.debtor`}
                                                                                                decimalsLimit={2}
                                                                                                onChange={(e) => HandleDebtorChange(index, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '80px',
                                                                                            minWidth: '80px'
                                                                                        }}>
                                                                                            <CurrencyInput
                                                                                                onKeyDown={(e) => keyDownHandler(e)}
                                                                                                className={`form-input `}
                                                                                                id="creditor"
                                                                                                defaultValue={index == 0 ? initialCashBalance.creditor : 0}
                                                                                                name={`cashBalance.${index}.creditor`}
                                                                                                decimalsLimit={2}
                                                                                                onChange={(e) => HandleCreditorChange(index, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '150px',
                                                                                            minWidth: '110px'
                                                                                        }}>
                                                                                            <input
                                                                                                onKeyDown={(e) => keyDownHandler(e)}
                                                                                                className={`form-input `}
                                                                                                id="description"
                                                                                                name={`cashBalance.${index}.description`}
                                                                                                onChange={(e) => formik.setFieldValue(`cashBalance.${index}.description`, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{ width: '40px', "text-align": 'center' }}>
                                                                                            <IconButton variant="contained"
                                                                                                color="error"
                                                                                                className='kendo-action-btn'
                                                                                                onClick={() => {
                                                                                                    remove(index)

                                                                                                }}>
                                                                                                <DeleteIcon />
                                                                                            </IconButton>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}


                                                                            </React.Fragment>

                                                                        )}>
                                                                    </FieldArray>
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <td colSpan={3}>{t('جمع')}:</td>
                                                                        <td className={remain !== (debitTotal - creditorTotal) ? 'td-red-bg' : ''}>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="debitTotal"
                                                                                disabled
                                                                                value={debitTotal}
                                                                                name={`cashBalance.debitTotal`}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td className={remain !== (debitTotal - creditorTotal) ? 'td-red-bg' : ''}>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="creditorTotal"
                                                                                disabled
                                                                                value={creditorTotal}
                                                                                name={`cashBalance.creditorTotal`}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>

                                                                        <td />
                                                                        <td />
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                        {formik?.errors?.cashBalance?.map((error, index) => (
                                                            <p className='error-msg' key={index}>
                                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.moeinAcount ? t(error.moeinAcount) + '.' : ""} ${error?.debtor ? t(error.debtor) + '.' : ""} ${error?.creditor ? t(error.creditor) + '.' : ""}` : null}
                                                            </p>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='row align-items-center'>
                                                    <div className='content col-md-4 col-12'>
                                                        <div className='title mb-0'>
                                                            <span className='span'> {t("انتقال وجه نقد از صندوق به بانک")}:</span>
                                                        </div>
                                                    </div>

                                                    <div className='content col-md-8 col-12'>

                                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                                        <div className='d-flex justify-content-end align-items-center'>
                                                            <Button
                                                                variant="outlined"
                                                                className="grid-add-btn"
                                                                onClick={(e) => {
                                                                    addCashTransferRow();
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
                                                                        <th >{t("حساب بانکی")}</th>
                                                                        <th>{t("شماره فیش")}</th>
                                                                        <th>{t("مبلغ")}</th>
                                                                        <th>{t("توضیحات")}</th>
                                                                        <th>{t("حذف")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <FieldArray
                                                                        name="cashTransfer"
                                                                        render={({ push, remove }) => (
                                                                            <React.Fragment>
                                                                                {formik?.values?.cashTransfer?.map((cashTransfer, index) => (
                                                                                    <tr key={cashTransfer.formikId} onFocus={(e) => setCashTransferFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                        className={cashTransferFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                                    >
                                                                                        <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td style={{ width: '110px', minWidth: '110px' }}>
                                                                                            <div className={`table-autocomplete `}>
                                                                                                <Autocomplete
                                                                                                    defaultValue={index == 0 ? { Code: "02", Name: "بانک رفاه کارگران" } : { Code: "", Name: "" }}
                                                                                                    componentsProps={{
                                                                                                        paper: {
                                                                                                            sx: {
                                                                                                                width: 300,
                                                                                                                direction: i18n.dir(),
                                                                                                                position: "absolute",
                                                                                                                fontSize: '12px',
                                                                                                                right: "0"
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
                                                                                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                    disableClearable={true}
                                                                                                    forcePopupIcon={false}
                                                                                                    id="bankAccount"
                                                                                                    name={`cashTransfer.${index}.bankAccount`}
                                                                                                    open={cashTransferFocusedRow === index + 1 ? bankAccountOpen : false}
                                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                    options={bankNames}
                                                                                                    getOptionLabel={option => option.Name}
                                                                                                    renderOption={(props, option) => (
                                                                                                        <Box component="li" {...props}>
                                                                                                            {option.Code}-({option.Name})
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    filterOptions={(options, state) => {
                                                                                                        let newOptions = [];
                                                                                                        options.forEach((element) => {
                                                                                                            if (
                                                                                                                element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                                element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                            )
                                                                                                                newOptions.push(element);
                                                                                                        });
                                                                                                        return newOptions;
                                                                                                    }}
                                                                                                    onInputChange={(event, value) => {
                                                                                                        if (value !== "" && event !== null) {
                                                                                                            HandlebankAccountOpenState(index, true)
                                                                                                        }
                                                                                                        else {
                                                                                                            HandlebankAccountOpenState(index, false)
                                                                                                        }
                                                                                                    }}
                                                                                                    onChange={(event, value) => {
                                                                                                        HandlebankAccountOpenState(index, false)
                                                                                                        formik.setFieldValue(`cashTransfer[${index}].bankAccount`, value.Code)
                                                                                                    }}
                                                                                                    onBlur={(e) => {
                                                                                                        HandlebankAccountOpenState(index, false)
                                                                                                    }}
                                                                                                    onSubmit={(e) => console.log(e)}
                                                                                                    renderInput={params => (
                                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                                    )}
                                                                                                    onKeyDown={(e) => {
                                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && bankAccountOpen === false) {
                                                                                                            e.preventDefault()
                                                                                                            HandlebankAccountOpenState(index, false)
                                                                                                        }
                                                                                                        setTimeout(() => {
                                                                                                            keyDownHandlerTransfer(e)
                                                                                                        }, 0);

                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{ width: '100px', minWidth: '80px' }}>
                                                                                            <input
                                                                                                onKeyDown={(e) => keyDownHandlerTransfer(e)}
                                                                                                className={`form-input `}
                                                                                                id="receiptNumber"
                                                                                                defaultValue={index === 0 ? initialCashtransfer.receiptNumber : ''}
                                                                                                name={`cashTransfer.${index}.receiptNumber`}
                                                                                                onChange={(e) => formik.setFieldValue(`cashTransfer.${index}.receiptNumber`, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{ width: '100px', minWidth: '80px' }}>
                                                                                            <CurrencyInput
                                                                                                onKeyDown={(e) => keyDownHandlerTransfer(e)}
                                                                                                className={`form-input `}
                                                                                                id="price"
                                                                                                defaultValue={index == 0 ? initialCashtransfer.price : 0}
                                                                                                name={`cashTransfer.${index}.price`}
                                                                                                decimalsLimit={2}
                                                                                                onChange={(e) => HandlePriceChange(index, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{ width: '150px', minWidth: '110px' }}>
                                                                                            <input
                                                                                                onKeyDown={(e) => keyDownHandlerTransfer(e)}
                                                                                                className={`form-input `}
                                                                                                id="descriptionT"
                                                                                                name={`cashTransfer.${index}.description`}
                                                                                                onChange={(e) => formik.setFieldValue(`cashTransfer.${index}.description`, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{ width: '40px' }}>
                                                                                            <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
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
                                                                <tfoot>
                                                                    <tr>
                                                                        <td colSpan={3}>{t('جمع')}:</td>
                                                                        <td>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="debitTotal"
                                                                                disabled
                                                                                value={priceTotal}
                                                                                name={`cashTransfer.priceTotal`}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td />
                                                                        <td />
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                        {formik?.errors?.cashTransfer?.map((error, index) => (
                                                            <p className='error-msg' key={index}>
                                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.bankAccount ? t(error.bankAccount) + '.' : ""} ${error?.receiptNumber ? t(error.receiptNumber) + '.' : ""} ${error?.price ? t(error.price) + '.' : ""} ` : null}
                                                            </p>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormikProvider>
                </div>
            </div >
            <div>
                <div className={`button-pos ${i18n.dir == 'ltr' ? 'ltr' : 'rtl'}`}>
                    <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        onClick={() => {
                            setClick(true)
                            if (formik.errors.cashBalance || formik.errors.cashTransfer) {
                                tableError()
                            }
                            if (remain != (debitTotal - creditorTotal)) {
                                cashError()
                            } else {
                                formik.handleSubmit()
                            }



                        }}
                    >
                        {t("تایید")}
                    </Button>

                    <div className="Issuance">
                        <Button variant="contained" color="error" onClick={() => { history.navigate(`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails`); }}>
                            {t("انصراف")}
                        </Button>
                    </div>
                </div>
            </div>

        </>
    )
}

