import { FieldArray, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import DateObject from 'react-date-object';
import { useTranslation } from 'react-i18next'
import { julianIntToDate } from '../../../../../utils/dateConvert';
import * as Yup from "yup"
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../../utils/calenderLang';
import { accountParties, bankDatagridBankLookup, cashDatagridCashLookup, chequeDatagridBankNameLookup, collectors, definedAccounts, descriptives } from './datasources';
import { Autocomplete, Box, Button, FilledInput, IconButton, TextField, useTheme } from '@mui/material';
import swal from 'sweetalert';
import { parsFloatFunction } from '../../../../../utils/parsFloatFunction';
import Guid from 'devextreme/core/guid';
import DatePicker from 'react-multi-date-picker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SelectBox } from 'devextreme-react';
import CurrencyInput from 'react-currency-input-field';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from '@mui/icons-material/Delete';
import { AddTableRow, MoveBack, MoveForward } from '../../../../../utils/gridKeyboardNavigation';
import Input from "react-input-mask";
import Kara from '../../../../../components/SetGrid/Kara';
import { karadummyRight } from '../../../../../components/SetGrid/karadummyRight';
import { karadummyLeft } from '../../../../../components/SetGrid/karadummyLeft';
import { useNavigate } from 'react-router-dom';
import InputMask from '../../../../../components/InputMask'
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from '../../../../../utils/gridKeyboardNav3';




export default function ReceiptDocument() {
    const emptyCash = { formikId: new Guid().valueOf(), cash: '', amount: 0 }
    const emptyBank = { formikId: new Guid().valueOf(), bank: '', slipNumber: "", amount: 0 }
    const emptyCheque = { formikId: new Guid().valueOf(), bankName: "", branchCode: "", branchName: "", issuancePlace: "", serial: "", accountNumber: "", maturity: "", amount: "", giver: "", cash: "", cashier: "" }

    const { t, i18n } = useTranslation()
    const theme = useTheme();
    const navigate = useNavigate();

    const dateRef = useRef()
    const [date, setDate] = useState(new DateObject())
    const [click, setClick] = useState(false)

    function checkYupObjectEmpty(obj) {
        for (var key in obj) {
            if (obj[key] != null && obj[key] !== "" && obj[key] !== 0)
                return true;
        }
        return false;
    }
    function checkObjectEmpty(obj) {
        for (var key in obj) {
            if (obj[key] != null && obj[key] !== "" && obj[key] !== 0)
                return false;
        }
        return true;
    }

    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 100000),
            date: julianIntToDate(new DateObject().toJulianDay()),
            totalReceived: 0,
            collector: "",
            accountParty: "",
            receivedFrom: true,    /*True: طرف حساب; False: معین و تفضیلی */
            definedAccount: "",
            descriptive: "",
            balance: 0,
            documentDescription: "",
            cashReceived: [emptyCash],
            bankReceived: [emptyBank],
            chequeReceived: [emptyCheque]
        },
        validationSchema: Yup.object({
            date: Yup.date()
                .required("وارد کردن تاریخ الزامی است"),

            receivedFrom: Yup.boolean(),

            accountParty: Yup.string()
                .when("receivedFrom", (receivedFrom) => {
                    if (receivedFrom === true)
                        return Yup.string().required("وارد کردن طرف حساب الزامی است")
                }),

            descriptive: Yup.string()
                .when("receivedFrom", (receivedFrom) => {
                    if (receivedFrom === false)
                        return Yup.string().required("وارد کردن تفضیلی الزامی است")
                }),

            documentDescription: Yup.string().required("وارد کردن شرح سند الزامی است"),

            cashReceived: Yup.array(Yup.object({
                cash: Yup.string().test(
                    'required', 'صندوق انتخاب نشده است',
                    (item, testContext) => {
                        if (formik.values.cashReceived.length === 1 && checkObjectEmpty(formik.values.cashReceived[0])) {
                            let bankTest = false;
                            let chequeTest = false;
                            for (let index = 0; index < testContext.from[1].value.bankReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.bankReceived[index])) {
                                    bankTest = true
                                }
                            }
                            for (let index = 0; index < testContext.from[1].value.chequeReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.chequeReceived[index])) {
                                    chequeTest = true
                                }
                            }
                            // console.log('item', item)
                            // console.log('!!item[0].cash', !!item[0].cash)
                            // console.log('testContext', testContext)
                            // return (!!item[0].cash || checkObjectEmpty(testContext.parent.bankReceived[0]) || checkObjectEmpty(testContext.parent.chequeReceived[0]))
                            return (!!testContext.parent.cash || bankTest || chequeTest)
                        }
                        else {
                            return (!!testContext.parent.cash)
                        }
                    }
                )
            })),
            bankReceived: Yup.array(Yup.object({
                bank: Yup.string().test(
                    'required', 'بانک انتخاب نشده است',
                    (item, testContext) => {
                        if (formik.values.bankReceived.length === 1 && checkObjectEmpty(formik.values.bankReceived[0])) {
                            let cashTest = false;
                            let chequeTest = false;
                            for (let index = 0; index < testContext.from[1].value.cashReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.cashReceived[index])) {
                                    cashTest = true
                                }
                            }
                            for (let index = 0; index < testContext.from[1].value.chequeReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.chequeReceived[index])) {
                                    chequeTest = true
                                }
                            }
                            return (!!testContext.parent.bank || cashTest || chequeTest)
                        }
                        else {
                            return (!!testContext.parent.bank)
                        }

                    }
                )
            })),
            chequeReceived: Yup.array(Yup.object({
                bankName: Yup.string().test(
                    'required', 'بانک انتخاب نشده است',
                    (item, testContext) => {
                        if (formik.values.chequeReceived.length === 1 && checkObjectEmpty(formik.values.chequeReceived[0])) {
                            let cashTest = false;
                            let bankTest = false;
                            for (let index = 0; index < testContext.from[1].value.cashReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.cashReceived[index])) {
                                    cashTest = true
                                }
                            }
                            for (let index = 0; index < testContext.from[1].value.bankReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.bankReceived[index])) {
                                    bankTest = true
                                }
                            }
                            return (!!testContext.parent.bankName || cashTest || bankTest)
                        }
                        else {
                            return (!!testContext.parent.bankName)
                        }

                    }
                ),
                cash: Yup.string().test(
                    'required', 'صندوق انتخاب نشده است',
                    (item, testContext) => {
                        console.log(testContext)
                        if (formik.values.chequeReceived.length === 1) {
                            let cashTest = false;
                            let bankTest = false;
                            for (let index = 0; index < testContext.from[1].value.cashReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.cashReceived[index])) {
                                    cashTest = true
                                }
                            }
                            for (let index = 0; index < testContext.from[1].value.bankReceived.length; index++) {
                                if (checkYupObjectEmpty(testContext.from[1].value.bankReceived[index])) {
                                    bankTest = true
                                }
                            }
                            return (!!testContext.parent.cash || cashTest || bankTest)
                        }
                        else {
                            return (!!testContext.parent.cash)
                        }


                    }
                )
            }))
        }),
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = values

            DocumentSub()
            console.log('All Values:', allValues)
        }
    })
    const DocumentSub = () => {
        swal({
            title: t("سند با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }
    const emptyError = () => {
        swal({
            title: t("حداقل یک مورد دریافت باید ثبت گردد"),
            icon: "error",
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

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }

    }, [formik.errors.cashReceived, formik.errors.bankReceived, formik.errors.chequeReceived])
    console.log("errors", formik.errors)

    function HandleTotalreceivedChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('totalReceived', parsFloatFunction(temp, 2))
    }
    function HandleBalanceChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('balance', parsFloatFunction(temp, 2))
    }

    const [chequeDues, setChequeDues] = useState(0)
    const [allPaymentsDues, setAllPaymentsDues] = useState(0)
    const [finalDues, setFinalDues] = useState(0)

    const NavigateToGrid = () => {
        navigate(`/FinancialTransaction/ReceiptDocument/General/Issuance`, { replace: false });
    }

    ///// Cash Grid \\\\\

    const [cashFocusedRow, setCashFocusedRow] = useState(1)

    const [cashCashOpen, setCashCashOpen] = useState(false)

    function addCashReceivedRow() {
        formik.setFieldValue('cashReceived', [...formik.values.cashReceived, emptyCash])
    }

    function RenderCashCashOpenState(index, state) {
        if (index === cashFocusedRow - 1) {
            setCashCashOpen(state)
        }
        else {
            setCashCashOpen(false)
        }
    }

    function HandleCashAmountChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashReceived[${index}].amount`, parsFloatFunction(temp, 2))
    }

    function cashKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && cashCashOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.cashReceived.length === cashFocusedRow) {
                addCashReceivedRow()
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
        if (e.keyCode === 38 && cashCashOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.cashReceived, addCashReceivedRow, next, cashFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.cashReceived, addCashReceivedRow, next, cashFocusedRow)
        }
        if (e.keyCode === 13 && cashCashOpen === false) { /* Enter */
            MoveNext(formik.values.cashReceived, addCashReceivedRow, next, cashFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.cashReceived, addCashReceivedRow, next, cashFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.cashReceived, addCashReceivedRow, next, cashFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }


    const [cashAmountTotal, setCashAmountTotal] = useState(0)

    function CalculateCashAmountTotal() {
        let cashAmountTemp = 0
        formik.values.cashReceived.forEach(element => {
            cashAmountTemp += element.amount
            setCashAmountTotal(parsFloatFunction(cashAmountTemp, 2))
        });
    }

    ///// End of Cash Grid \\\\\

    ///// Bank Grid \\\\\

    const [bankFocusedRow, setBankFocusedRow] = useState(1)

    const [bankBankOpen, setBankBankOpen] = useState(false)

    function addBankReceivedRow() {
        formik.setFieldValue('bankReceived', [...formik.values.bankReceived, emptyBank])
    }

    function RenderBankBankOpenState(index, state) {
        if (index === bankFocusedRow - 1) {
            setBankBankOpen(state)
        }
        else {
            setBankBankOpen(false)
        }
    }

    function HandleBankAmountChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`bankReceived[${index}].amount`, parsFloatFunction(temp, 2))
    }

    function bankKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && bankBankOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.bankReceived.length === bankFocusedRow) {
                addBankReceivedRow()
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
        if (e.keyCode === 38 && bankBankOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.bankReceived, addBankReceivedRow, next, bankFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.bankReceived, addBankReceivedRow, next, bankFocusedRow)
        }
        if (e.keyCode === 13 && bankBankOpen === false) { /* Enter */
            MoveNext(formik.values.bankReceived, addBankReceivedRow, next, bankFocusedRow)
        }
        else if (e.keyCode === 13) {  /* Enter */
            e.preventDefault()
            MoveNext(formik.values.bankReceived, addBankReceivedRow, next, bankFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.bankReceived, addBankReceivedRow, next, bankFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }

    const [bankAmountTotal, setBankAmountTotal] = useState(0)

    function CalculateBankAmountTotal() {
        let bankAmountTemp = 0
        formik.values.bankReceived.forEach(element => {
            bankAmountTemp += element.amount
            setBankAmountTotal(parsFloatFunction(bankAmountTemp, 2))
        });
    }

    ///// End of Bank Grid \\\\\

    ///// Cheque Grid \\\\\
    const chequeMaturityRefs = useRef([]);
    const [chequeFocusedRow, setChequeFocusedRow] = useState(1)

    const [chequeBankNameOpen, setChequeBankNameOpen] = useState(false)

    const [chequeCashOpen, setChequeCashOpen] = useState(false)

    const [chequeCashierOpen, setChequeCashierOpen] = useState(false)

    function addChequeReceivedRow() {
        formik.setFieldValue('chequeReceived', [...formik.values.chequeReceived, emptyCheque])
    }

    function RenderChequeBankNameOpenState(index, state) {
        if (index === chequeFocusedRow - 1) {
            setChequeBankNameOpen(state)
        }
        else {
            setChequeBankNameOpen(false)
        }
    }

    function RenderChequeCashOpenState(index, state) {
        if (index === chequeFocusedRow - 1) {
            setChequeCashOpen(state)
        }
        else {
            setChequeCashOpen(false)
        }
    }

    function RenderChequeCashierOpenState(index, state) {
        if (index === chequeFocusedRow - 1) {
            setChequeCashierOpen(state)
        }
        else {
            setChequeCashierOpen(false)
        }
    }

    function HandleChequeAmountChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`chequeReceived[${index}].amount`, parsFloatFunction(temp, 2))
    }
    function chequeKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && chequeBankNameOpen === false && chequeCashOpen === false && chequeCashierOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.bankReceived.length === bankFocusedRow) {
                addChequeReceivedRow()
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
        if (e.keyCode === 38 && chequeBankNameOpen === false && chequeCashOpen === false && chequeCashierOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.chequeReceived, addChequeReceivedRow, next, chequeFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.chequeReceived, addChequeReceivedRow, next, chequeFocusedRow)
        }
        if (e.keyCode === 13 && chequeBankNameOpen === false && chequeCashOpen === false && chequeCashierOpen === false) { /* Enter */
            MoveNext(formik.values.chequeReceived, addChequeReceivedRow, next, chequeFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.chequeReceived, addChequeReceivedRow, next, chequeFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.chequeReceived, addChequeReceivedRow, next, chequeFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }
    // function chequeKeyDownHandler(e, index, currentElm, nextElm, previousElm) {
    //     if (currentElm.current[index].getAttributeNode("class").value === "rmdp-input") {
    //         currentElm?.current[index]?.parentElement.parentElement.closeCalendar();
    //     }

    //     if (e.keyCode === 40 && chequeBankNameOpen === false && chequeCashOpen === false && chequeCashierOpen === false) { /* Down Arrowkey */
    //         e.preventDefault()

    //         if (index === formik.values.chequeReceived.length - 1) {

    //             AddTableRow(addChequeReceivedRow, currentElm, index)
    //         } else {
    //             currentElm.current[index + 1].focus()
    //             currentElm.current[index + 1].select()

    //         }
    //     }
    //     if (e.keyCode === 38 && chequeBankNameOpen === false && chequeCashOpen === false && chequeCashierOpen === false) { /* Up ArrowKey */
    //         e.preventDefault()
    //         currentElm.current[index - 1].focus()
    //         currentElm.current[index - 1].select()

    //     }

    //     if (e.keyCode === 39) { /* Right ArrowKey */
    //         e.preventDefault()
    //         i18n.dir() === "rtl" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.chequeReceived, addChequeReceivedRow, currentElm, nextElm, index, 11)

    //     }
    //     if (e.keyCode === 37) { /* Left ArrowKey */
    //         e.preventDefault()
    //         i18n.dir() === "ltr" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.chequeReceived, addChequeReceivedRow, currentElm, nextElm, index, 11)
    //     }
    //     if (e.keyCode === 13) { /* Enter */
    //         e.preventDefault()
    //         MoveForward(formik.values.chequeReceived, addChequeReceivedRow, currentElm, nextElm, index, 11)
    //     }
    //     if (e.keyCode === 9) { /* Tab */
    //         e.preventDefault()
    //         if (e.shiftKey === false) {
    //             MoveForward(formik.values.chequeReceived, addChequeReceivedRow, currentElm, nextElm, index, 11)
    //         }
    //         else {
    //             MoveBack(currentElm, previousElm, index)
    //         }
    //     }
    // }

    const [chequeAmountTotal, setChequeAmountTotal] = useState(0)

    function CalculateChequeAmountTotal() {
        let chequeAmountTemp = 0
        formik.values.chequeReceived.forEach(element => {
            chequeAmountTemp += element.amount
            setChequeAmountTotal(parsFloatFunction(chequeAmountTemp, 2))
        });
    }



    ///// End of Cheque Grid \\\\\


    /////All things Tatbiq related go here\\\\\\
    const [debtor, setDebtor] = useState([]);
    const [creditor, setCreditor] = useState([]);
    useEffect(() => {
        if (formik.values.receivedFrom) {
            setDebtor(karadummyRight)
            setCreditor(karadummyLeft)
        } else {
            setDebtor([])
            setCreditor([])
        }
    }, [formik.values.receivedFrom])

    const [cashTatbiq, setCashTatbiq] = useState([])
    const [bankTatbiq, setBankTatbiq] = useState([])
    const [chequeTatbiq, setChequeTatbiq] = useState([])

    function getData(data) {
        console.log("tatbiq data", data);
        formik.setFieldValue('match', data)
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
                            <div className='form-design'>
                                <div className='row'>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span> {t("شماره")} </span>
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
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span> {t("تاریخ")} <span className='star'>*</span></span>
                                        </div>
                                        <div className='wrapper' >
                                            <div className='date-picker position-relative'>
                                                <DatePicker
                                                    name="date"
                                                    id="date"
                                                    ref={dateRef}
                                                    editable={false}
                                                    value={date}
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                    calendarPosition="bottom-right"
                                                    onBlur={formik.handleBlur}
                                                    onChange={val => {
                                                        setDate(val)
                                                        formik.setFieldValue('documentDate', julianIntToDate(val.toJulianDay()));
                                                    }}
                                                />
                                                <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                    <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton' /></div>
                                                </div>
                                            </div>
                                            {formik.touched.date && formik.errors.date && !formik.values.date ? (<div className='error-msg'>{t(formik.errors.date)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span>{t("تحصیلدار")}</span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={collectors}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('collector', e.value)}
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
                                                    name='collector'
                                                    id='collector'
                                                    showClearButton
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span> {t("جمع دریافت")} :</span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <CurrencyInput
                                                    className='form-input'
                                                    id="totalreceived"
                                                    name="totalreceived"
                                                    style={{ width: "100%" }}
                                                    onChange={(e) => HandleTotalreceivedChange(e.target.value)}
                                                    value={formik.values.totalReceived}
                                                    decimalsLimit={2}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-12 col-12" onFocus={() => {
                                        dateRef?.current?.closeCalendar();
                                    }}>
                                        <div className="row d-flex">
                                            <div className="col-xl-auto col-lg-2 col-auto ">
                                                <div className="title">
                                                    <span>
                                                        ‌
                                                    </span>
                                                </div>
                                                <button
                                                    className="payToButton"
                                                    title={t("پرداخت به")}
                                                    type="button"
                                                    onClick={() => {
                                                        formik.setFieldValue('receivedFrom', !formik.values.receivedFrom)
                                                        formik.setFieldValue("accountParty", '')
                                                        formik.setFieldValue("definedAccount", '')
                                                        formik.setFieldValue("descriptive", '')
                                                        formik.setFieldValue("balance", 0)
                                                    }}
                                                >
                                                    <MoreHorizIcon />
                                                </button>
                                            </div>
                                            <div className="col-xl-auto col-lg-10 col-auto flex-grow-1 mb-0">
                                                {formik.values.receivedFrom ? (
                                                    <div className='row'>
                                                        <div className='col-12'>
                                                            <div className="title">
                                                                <span>
                                                                    {t("طرف حساب")}
                                                                    <span className="star">*</span>
                                                                </span>
                                                            </div>
                                                            <div className='wrapper'>
                                                                <SelectBox
                                                                    dataSource={accountParties}
                                                                    valueExpr="Code"
                                                                    className='selectBox'
                                                                    displayExpr={function (item) {
                                                                        return (
                                                                            item &&
                                                                            item.Code +
                                                                            "- " +
                                                                            item.Name +
                                                                            "- " +
                                                                            item.PersonLegalName
                                                                        );
                                                                    }}
                                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                                    onValueChanged={(e) =>
                                                                        formik.setFieldValue("accountParty", e.value)
                                                                    }
                                                                    itemRender={null}
                                                                    placeholder=""
                                                                    searchEnabled
                                                                ></SelectBox>
                                                                {formik.touched.accountParty && formik.errors.accountParty &&
                                                                    !formik.values.accountParty ? (
                                                                    <div className='error-msg'>
                                                                        {t(formik.errors.accountParty)}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="row">
                                                        <div className="col-sm-6 col-12">
                                                            <div className="title">
                                                                <span>{t("حساب معین")}</span>
                                                            </div>
                                                            <SelectBox
                                                                dataSource={definedAccounts}
                                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                                onValueChanged={(e) =>
                                                                    formik.setFieldValue("definedAccount", e.value)
                                                                }
                                                                valueExpr="Code"
                                                                displayExpr={function (item) {
                                                                    return (
                                                                        item && item.Code + "- " + item.FormersNames
                                                                    )
                                                                }}
                                                                className="selectBox"
                                                                noDataText={t("اطلاعات یافت نشد")}
                                                                itemRender={null}
                                                                placeholder=""
                                                                name="definedAccount"
                                                                id="definedAccount"
                                                                searchEnabled
                                                            />
                                                            {formik.touched.definedAccount &&
                                                                formik.errors.definedAccount ? (
                                                                <div className="error-msg">
                                                                    {t(formik.errors.definedAccount)}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="col-sm-6 col-12">
                                                            <div className="title">
                                                                <span>{t("تفضیلی")} <span className='star'>*</span></span>
                                                            </div>
                                                            <SelectBox
                                                                dataSource={descriptives}
                                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                                onValueChanged={(e) =>
                                                                    formik.setFieldValue("descriptive", e.value)
                                                                }
                                                                valueExpr="Code"
                                                                displayExpr={function (item) {
                                                                    return (
                                                                        item && item.Code + "- " + item.Name
                                                                    )
                                                                }}
                                                                className="selectBox"
                                                                noDataText={t("اطلاعات یافت نشد")}
                                                                itemRender={null}
                                                                placeholder=""
                                                                name="descriptive"
                                                                id="descriptive"
                                                                searchEnabled
                                                                disabled={formik.values.definedAccount == ''}
                                                            />
                                                            {formik.touched.descriptive &&
                                                                formik.errors.descriptive ? (
                                                                <div className="error-msg">
                                                                    {t(formik.errors.descriptive)}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span> {t("مانده")} :</span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <CurrencyInput
                                                    className='form-input'
                                                    id="balance"
                                                    name="balance"
                                                    style={{ width: "100%" }}
                                                    onChange={(e) => HandleBalanceChange(e.target.value)}
                                                    value={formik.values.balance}
                                                    decimalsLimit={2}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span> {t("شرح سند")} <span className='star'>*</span></span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <textarea
                                                    className='form-input'
                                                    id="documentDescription"
                                                    name="documentDescription"
                                                    style={{ width: "100%" }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.documentDescription}
                                                />
                                            </div>
                                            {formik.touched.documentDescription && formik.errors.documentDescription && !formik.values.documentDescription ? (<div className='error-msg'>{t(formik.errors.documentDescription)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className='content col-lg-6 col-md-6 col-12'>
                                        <div className='title'>
                                            <span>‌</span>
                                        </div>
                                        <div className='title'>
                                            <span> {t("رأس چک‌ها")} : {chequeDues} </span>
                                        </div>
                                        <div className='title'>
                                            <span> {t("رأس کل دریافت‌ها")} : {allPaymentsDues} </span>
                                        </div>
                                        <div className='title'>
                                            <span> {t("رأس کل دریافت‌ها با در نظر گرفتن تطبیق‌ها")} : {finalDues} </span>
                                        </div>
                                    </div>
                                    <div className='content col-lg-5 col-md-12 cl-xs-12 col-5'>
                                        {/* Cash Grid */}
                                        <div className='row align-items-center'>
                                            <div className='content col-lg-6 col-6'>
                                                <div className='title mb-0'>
                                                    <span className='span'> {t("دریافت‌های نقد")} :</span>
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
                                                            addCashReceivedRow()
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
                                                                <th >{t("صندوق")}</th>
                                                                <th>{t("مبلغ")}</th>
                                                                <th>{t("حذف")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <FieldArray
                                                                name="cashReceived"
                                                                render={({ push, remove }) => (
                                                                    <React.Fragment>
                                                                        {formik?.values?.cashReceived?.map((cashReceived, index) => (
                                                                            <tr key={cashReceived.formikId} onFocus={(e) => setCashFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                className={cashFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                            >
                                                                                <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                    {index + 1}
                                                                                </td>

                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="cash"
                                                                                            name={`cashReceived.${index}.cash`}
                                                                                            options={cashDatagridCashLookup}
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.Name}
                                                                                                </Box>
                                                                                            )}
                                                                                            getOptionLabel={option => option.Name}
                                                                                            componentsProps={{
                                                                                                paper: {
                                                                                                    sx: {
                                                                                                        width: 200,
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
                                                                                            open={cashFocusedRow === index + 1 ? cashCashOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderCashCashOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderCashCashOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderCashCashOpenState(index, false)
                                                                                                formik.setFieldValue(`cashReceived[${index}].cash`, value.Name)
                                                                                            }}
                                                                                            onBlur={(e) => RenderCashCashOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && cashCashOpen[index] === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderCashCashOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    cashKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '120px', minWidth: '90px' }}>
                                                                                    <CurrencyInput
                                                                                        onKeyDown={(e) => cashKeyDownHandler(e)}
                                                                                        className={`form-input `}
                                                                                        style={{ width: "100%" }}
                                                                                        id="amount"
                                                                                        name={`CashReceived.${index}.amount`}
                                                                                        value={formik.values.cashReceived[index].amount}
                                                                                        decimalsLimit={2}
                                                                                        onChange={(e) => HandleCashAmountChange(index, e.target.value)}
                                                                                        onBlur={() => CalculateCashAmountTotal()}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>

                                                                                <td style={{ width: '40px' }}>
                                                                                    <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
                                                                                        setCashAmountTotal(cashAmountTotal - formik.values.cashReceived[index].amount)
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
                                                                <td>{t("جمع")}:</td>
                                                                <td></td>
                                                                <td>
                                                                    <CurrencyInput
                                                                        className='form-input'
                                                                        style={{ width: "100%" }}
                                                                        id="cashAmountTotal"
                                                                        disabled
                                                                        value={cashAmountTotal}
                                                                        name={`cashReceived.cashAmountTotal`}
                                                                        decimalsLimit={2}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>

                                                                <td />
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                {
                                                    // (checkObjectEmpty(formik.values.bankReceived[0]) && checkObjectEmpty(formik.values.chequeReceived[0])) && formik?.errors?.cashReceived?.map((error, index) => (
                                                    !((formik.values.cashReceived.length === 1 && formik.errors.cashReceived) && (formik.errors.bankReceived) && (formik.errors.chequeReceived))
                                                    && formik?.errors?.cashReceived?.map((error, index) => (
                                                        <p className='error-msg' key={index}>
                                                            {error ? ` ${t("ردیف")} ${index + 1} : ${error?.cash ? t(error.cash) : ""}` : null}
                                                        </p>
                                                    ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className='content col-lg-7 col-md-12 col-12'>
                                        {/* Bank Grid */}
                                        <div className='row align-items-center'>
                                            <div className='content col-lg-6 col-6'>
                                                <div className='title mb-0'>
                                                    <span className='span'> {t("واریز‌های بانکی")} :</span>
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
                                                            addBankReceivedRow()
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
                                                                <th >{t("بانک")}</th>
                                                                <th> {t("ش فیش")} </th>
                                                                <th>{t("مبلغ")}</th>
                                                                <th>{t("حذف")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <FieldArray
                                                                name="bankReceived"
                                                                render={({ push, remove }) => (
                                                                    <React.Fragment>
                                                                        {formik?.values?.bankReceived?.map((bankReceived, index) => (
                                                                            <tr key={bankReceived.formikId} onFocus={(e) => setBankFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                className={bankFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                            >
                                                                                <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                    {index + 1}
                                                                                </td>

                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="bank"
                                                                                            name={`bankReceived.${index}.bank`}
                                                                                            options={bankDatagridBankLookup}
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.Code} - {option.Name} - {option.BankAccountNumber}
                                                                                                </Box>
                                                                                            )}
                                                                                            filterOptions={(options, state) => {
                                                                                                let newOptions = [];
                                                                                                options.forEach((element) => {
                                                                                                    if (
                                                                                                        element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.BankAccountNumber.includes(state.inputValue.toLowerCase())
                                                                                                    )
                                                                                                        newOptions.push(element);
                                                                                                });
                                                                                                return newOptions;
                                                                                            }}
                                                                                            getOptionLabel={option => option.Name}
                                                                                            componentsProps={{
                                                                                                paper: {
                                                                                                    sx: {
                                                                                                        width: 300,
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
                                                                                            open={bankFocusedRow === index + 1 ? bankBankOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderBankBankOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderBankBankOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderBankBankOpenState(index, false)
                                                                                                formik.setFieldValue(`bankReceived[${index}].bank`, value.Name)
                                                                                            }}
                                                                                            onBlur={(e) => RenderBankBankOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && bankBankOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderBankBankOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    bankKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => bankKeyDownHandler(e)}
                                                                                        name={`bankReceived.${index}.slipNumber`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.bankReceived[index].slipNumber}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ width: '120px', minWidth: '90px' }}>
                                                                                    <CurrencyInput
                                                                                        onKeyDown={(e) => bankKeyDownHandler(e)}
                                                                                        className={`form-input `}
                                                                                        style={{ width: "100%" }}
                                                                                        id="amount"
                                                                                        name={`bankReceived.${index}.amount`}
                                                                                        value={formik.values.bankReceived[index].amount}
                                                                                        decimalsLimit={2}
                                                                                        onChange={(e) => HandleBankAmountChange(index, e.target.value)}
                                                                                        onBlur={() => CalculateBankAmountTotal()}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>

                                                                                <td style={{ width: '40px' }}>
                                                                                    <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
                                                                                        setBankAmountTotal(bankAmountTotal - formik.values.bankReceived[index].amount)
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
                                                                <td>{t("جمع")}:</td>
                                                                <td></td>
                                                                <td />
                                                                <td>
                                                                    <CurrencyInput
                                                                        className='form-input'
                                                                        style={{ width: "100%" }}
                                                                        id="bankAmountTotal"
                                                                        disabled
                                                                        value={bankAmountTotal}
                                                                        name={`bankReceived.bankAmountTotal`}
                                                                        decimalsLimit={2}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>

                                                                <td />
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                {
                                                    // (checkObjectEmpty(formik.values.cashReceived[0]) && checkObjectEmpty(formik.values.chequeReceived[0])) && formik?.errors?.bankReceived?.map((error, index) => (
                                                    !((formik.errors.cashReceived) && (formik.values.bankReceived.length === 1 && formik.errors.bankReceived) && (formik.errors.chequeReceived))
                                                    && formik?.errors?.bankReceived?.map((error, index) => (
                                                        <p className='error-msg' key={index}>
                                                            {error ? ` ${t("ردیف")} ${index + 1} : ${error?.bank ? t(error.bank) : ""}` : null}
                                                        </p>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='content col-lg-12 col-12'>
                                        {/* Cheque Grid */}
                                        <div className='row align-items-center'>
                                            <div className='content col-lg-6 col-6'>
                                                <div className='title mb-0'>
                                                    <span className='span'> {t("چک‌های دریافتی")} :</span>
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
                                                            addChequeReceivedRow()
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
                                                                <th >{t("نام بانک")}</th>
                                                                <th> {t("کد شعبه")} </th>
                                                                <th> {t("نام شعبه")} </th>
                                                                <th> {t("محل صدور")} </th>
                                                                <th> {t("سریال")} </th>
                                                                <th> {t("شماره حساب")} </th>
                                                                <th> {t("سررسید")} </th>
                                                                <th>{t("مبلغ")}</th>
                                                                <th>{t("تحویل دهنده")}</th>
                                                                <th>{t("صندوق")}</th>
                                                                <th>{t("صندوقدار")}</th>
                                                                <th>{t("حذف")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <FieldArray
                                                                name="chequeReceived"
                                                                render={({ push, remove }) => (
                                                                    <React.Fragment>
                                                                        {formik?.values?.chequeReceived?.map((chequeReceived, index) => (
                                                                            <tr key={chequeReceived.formikId} onFocus={(e) => setChequeFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                className={chequeFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                            >
                                                                                <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                    {index + 1}
                                                                                </td>

                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="bankName"
                                                                                            name={`chequeReceived.${index}.bankName`}
                                                                                            options={chequeDatagridBankNameLookup}
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
                                                                                            open={chequeFocusedRow === index + 1 ? chequeBankNameOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderChequeBankNameOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderChequeBankNameOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderChequeBankNameOpenState(index, false)
                                                                                                formik.setFieldValue(`chequeReceived[${index}].bankName`, value.Code)
                                                                                            }}
                                                                                            onBlur={(e) => RenderChequeBankNameOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && chequeBankNameOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderChequeBankNameOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    chequeKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ minWidth: '75px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        name={`chequeReceived.${index}.branchCode`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.chequeReceived[index].branchCode}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        name={`chequeReceived.${index}.branchName`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.chequeReceived[index].branchName}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        name={`chequeReceived.${index}.issuancePlace`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.chequeReceived[index].issuancePlace}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '83px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        name={`chequeReceived.${index}.serial`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.chequeReceived[index].serial}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        name={`chequeReceived.${index}.accountNumber`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.chequeReceived[index].accountNumber}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '75px' }}>
                                                                                    <div
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                                                                                                chequeKeyDownHandler(e)
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <DatePicker
                                                                                            ref={el => (chequeMaturityRefs.current[index] = el?.querySelector("input"))}
                                                                                            style={{ direction: 'ltr' }}
                                                                                            name={`chequeReceived.${index}.maturity`}
                                                                                            id="maturityDate"
                                                                                            calendar={renderCalendarSwitch(i18n.language)}
                                                                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                            calendarPosition="bottom-right"
                                                                                            onOpen={false}
                                                                                            render={<InputMask />}
                                                                                            onChange={(date) => {
                                                                                                if (!chequeMaturityRefs.current[index].value.includes("–")) {
                                                                                                    formik.setFieldValue(`chequeReceived[${index}].maturity`, julianIntToDate(date.toJulianDay()));
                                                                                                    setTimeout(() => {
                                                                                                        chequeMaturityRefs.current[index].focus()
                                                                                                    }, 1);
                                                                                                }
                                                                                            }
                                                                                            }
                                                                                            onOpenPickNewDate={false}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '120px', minWidth: '100px' }}>
                                                                                    <CurrencyInput
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        className={`form-input `}
                                                                                        style={{ width: "100%" }}
                                                                                        id="amount"
                                                                                        name={`chequeReceived.${index}.amount`}
                                                                                        decimalsLimit={2}
                                                                                        onChange={(e) => HandleChequeAmountChange(index, e.target.value)}
                                                                                        onBlur={(e) => CalculateChequeAmountTotal()}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                        name={`chequeReceived.${index}.giver`}
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        value={formik.values.chequeReceived[index].giver}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="cash"
                                                                                            name={`chequeReceived.${index}.cash`}
                                                                                            options={cashDatagridCashLookup}
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
                                                                                            open={chequeFocusedRow === index + 1 ? chequeCashOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderChequeCashOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderChequeCashOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderChequeCashOpenState(index, false)
                                                                                                formik.setFieldValue(`chequeReceived[${index}].cash`, value.Code)
                                                                                            }}
                                                                                            onBlur={(e) => RenderChequeCashOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && chequeCashOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderChequeCashOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    chequeKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            id="cashier"
                                                                                            name={`chequeReceived.${index}.cashier`}
                                                                                            options={collectors}
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
                                                                                            // disableClearable={true}
                                                                                            clearOnBlur={true}
                                                                                            forcePopupIcon={false}
                                                                                            open={chequeFocusedRow === index + 1 ? chequeCashierOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderChequeCashierOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderChequeCashierOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderChequeCashierOpenState(index, false)
                                                                                                if (value) {
                                                                                                    formik.setFieldValue(`chequeReceived[${index}].cashier`, value.Code)
                                                                                                }
                                                                                                else {
                                                                                                    formik.setFieldValue(`chequeReceived[${index}].cashier`, "")
                                                                                                }
                                                                                            }}
                                                                                            onBlur={(e) => RenderChequeCashierOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && chequeCashierOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderChequeCashierOpenState(index, false)
                                                                                                }
                                                                                                setTimeout(() => {
                                                                                                    chequeKeyDownHandler(e)
                                                                                                }, 0);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '40px' }}>
                                                                                    <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
                                                                                        setChequeAmountTotal(chequeAmountTotal - formik.values.chequeReceived[index].amount)
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
                                                                <td colSpan={8}>{t("جمع")}:</td>
                                                                {/*<td></td>*/}
                                                                {/*<td />*/}
                                                                {/*<td />*/}
                                                                {/*<td />*/}
                                                                {/*<td />*/}
                                                                {/*<td />*/}
                                                                {/*<td />*/}
                                                                <td>
                                                                    <CurrencyInput
                                                                        className='form-input'
                                                                        style={{ width: "100%" }}
                                                                        id="chequeAmountTotal"
                                                                        disabled
                                                                        value={chequeAmountTotal}
                                                                        name={`chequeReceived.chequeAmountTotal`}
                                                                        decimalsLimit={2}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>

                                                                <td colSpan={4} />
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                {

                                                    // (checkObjectEmpty(formik.values.cashReceived[0]) && checkObjectEmpty(formik.values.bankReceived[0])) && formik?.errors?.chequeReceived?.map((error, index) => (
                                                    !((formik.errors.cashReceived) && (formik.errors.bankReceived) && (formik.values.chequeReceived.length === 1 && formik.errors.chequeReceived))
                                                    && formik?.errors?.chequeReceived?.map((error, index) => (
                                                        <p className='error-msg' key={index}>
                                                            {error ? ` ${t("ردیف")} ${index + 1} : ${error?.bankName ? t(error.bankName) : ""}${error?.bankName && error?.cash ? "." : ""} ${error?.cash ? t(error.cash) : ""}` : null}
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
                {<div className={`Tatbiq ${formik.values.receivedFrom && debtor.length && creditor.length ? '' : 'd-none'}`}>
                    <Kara debtor={debtor} creditor={creditor} showOtherBtn={true} getData={getData} show={formik.values.receivedFrom} />
                </div>}
            </div>
            <div className={`button-pos ${i18n.dir == 'ltr' ? 'ltr' : 'rtl'}`}>
                <Button
                    variant="contained"
                    color="success"
                    type="button"
                    onClick={() => {
                        let cashSubTest = false
                        let bankSubTest = false
                        let chequeSubTest = false
                        if (formik.values.cashReceived.length > 0) {
                            for (let index = 0; index < formik.values.cashReceived.length; index++) {
                                if (checkObjectEmpty(formik.values.cashReceived[index])) {
                                    cashSubTest = true
                                }
                            }
                        }
                        else {
                            cashSubTest = true
                        }
                        if (formik.values.bankReceived.length > 0) {
                            for (let index = 0; index < formik.values.bankReceived.length; index++) {
                                if (checkObjectEmpty(formik.values.bankReceived[index])) {
                                    bankSubTest = true
                                }
                            }
                        }
                        else {
                            bankSubTest = true
                        }
                        if (formik.values.chequeReceived.length > 0) {
                            for (let index = 0; index < formik.values.chequeReceived.length; index++) {
                                if (checkObjectEmpty(formik.values.chequeReceived[index])) {
                                    chequeSubTest = true
                                }
                            }
                        }
                        else {
                            chequeSubTest = true
                        }

                        if (formik.errors.cashReceived || formik.errors.bankReceived || formik.errors.chequeReceived) {
                            if (cashSubTest && bankSubTest && chequeSubTest) {
                                emptyError()
                            }
                            else {
                                tableError()
                            }
                        } else {
                            if (cashSubTest && bankSubTest && chequeSubTest) {
                                emptyError()
                            }
                            else {
                                setClick(true)
                            }
                        }
                        formik.handleSubmit()
                    }}
                >
                    {t("تایید")}
                </Button>

                <div className="Issuance">
                    <Button
                        variant="contained"
                        color="error"
                        onClick={NavigateToGrid}
                    >
                        {t("انصراف")}
                    </Button>
                </div>
            </div>
        </>
    )
}

