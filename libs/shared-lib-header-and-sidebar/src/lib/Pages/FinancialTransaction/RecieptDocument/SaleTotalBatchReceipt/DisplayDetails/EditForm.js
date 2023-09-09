import React, { useEffect, useRef, useState } from 'react'
import Guid from 'devextreme/core/guid';
import { Autocomplete, Box, Button, IconButton, TextField, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup"
import swal from 'sweetalert';
import { julianIntToDate } from '../../../../../utils/dateConvert';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../../utils/calenderLang';
import DatePicker from 'react-multi-date-picker';
import { parsFloatFunction } from '../../../../../utils/parsFloatFunction';
import CurrencyInput from 'react-currency-input-field';
import DateObject from 'react-date-object';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams } from "react-router-dom";
import bankNames from "./bankName.json";
import recieptFormGridData from "./recieptFormGridData.json";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";
import InputMask from "../../../../../components/InputMask";
import CashDeskData from './CashDeskData.json'
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { karadummyRight } from "../../../../../components/SetGrid/karadummyRight";
import { karadummyLeft } from "../../../../../components/SetGrid/karadummyLeft";
import { cashDatagridCashLookup, chequeDatagridBankNameLookup } from "../../General/Issuance/datasources";
import Kara from "../../../../../components/SetGrid/Kara";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../../../utils/gridKeyboardNav3";



export default function EditForm() {

    const { t, i18n } = useTranslation()

    const theme = useTheme();

    const location = useLocation()
    const { state } = location



    const emptyCashReceive = { formikId: new Guid().valueOf(), TransactionCode: '', Date: '2022-10-10', Price: '', Fund: "10004", Description: '' };
    const emptyCashPayment = { formikId: new Guid().valueOf(), TransactionCode: '', Date: '2022-10-10', Price: '', Fund: "10004", Description: '' };
    const emptyCashtransfer = { formikId: new Guid().valueOf(), TransactionCode: '', Date: '2022-10-10', bankAccount: '', receiptNumber: "", price: '', description: '' };
    const emptyCheque = { formikId: new Guid().valueOf(), BehindScore: '', Date: '2022-10-10', bankName: "", branchCode: "", branchName: "", issuancePlace: "", serial: "", accountNumber: "", maturity: "", amount: "", giver: "", cash: "30000001", description: '' }

    const [searchParams] = useSearchParams();
    const [gridData, setGridData] = useState([])
    const dataRef = useRef()
    dataRef.current = gridData


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />



    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'OrderCode',
            name: "شماره فاکتور",
        },
        {
            field: 'OrderPreCode',
            name: "شماره پیش فاکتور",
        },
        {
            field: 'Visitor',
            name: "ویزیتور",
        },
        {
            field: 'InitialOrderPrice',
            name: "مبلغ پیش از تخفیف نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSome
        },
        {
            field: 'CashDiscountPercent',
            name: "درصد تخفیف نقد",
        },
        {
            field: 'CashDiscountAmount',
            name: "مبلغ تخفیف نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSome
        },
        {
            field: 'ReductionFromVAT',
            name: "کسر از مالیات",
            cell: CurrencyCell,
            footerCell: CustomFooterSome
        },
        {
            field: 'FinalOrderPrice',
            name: "مبلغ نهایی",
            cell: CurrencyCell,
            footerCell: CustomFooterSome
        },
        {
            field: 'Description',
            width: '150px',
            name: "توضیحات",
        }
    ]

    const initialCashReceive = { formikId: new Guid().valueOf(), TransactionCode: '3789', Date: '2022-10-10', Price: 70000000, Fund: "10004", Description: 'تست' }
    const initialCashPayment = { formikId: new Guid().valueOf(), TransactionCode: '1200', Date: '2022-10-10', Price: 70000000, Fund: "10004", Description: 'تست' }
    const initialCashtransfer = { formikId: new Guid().valueOf(), TransactionCode: '68542', Date: '2022-10-10', bankAccount: '0101001', receiptNumber: "2311", price: 2500000, description: '' }
    const initialChequeReceived = { formikId: new Guid().valueOf(), BehindScore: '13120', Date: '2022-10-01', bankName: "", branchCode: "", branchName: "", issuancePlace: "", serial: "", accountNumber: "", maturity: "", amount: "", giver: "", cash: "30000001", description: '' }


    const id = searchParams.get('id')

    const [cashReceivePriceTotal, setCashReceivePriceTotal] = useState(0)
    const [cashPaymentPriceTotal, setCashPaymentPriceTotal] = useState(0)
    const [priceTotal, setPriceTotal] = useState(0)
    const [click, setClick] = useState(false)
    const [bankAccountOpen, setBankAccountOpen] = React.useState(false);
    // const [cashTransferTouch, setCashTransferTouch] = useState([emptyCashtransferTouch])


    const formik = useFormik({
        initialValues: {
            PartnerCode: '10102029',
            AccountPartyName: 'پوریا هندمینی',
            LegalName: 'فروشگاه پارسا',
            cashReceive: [initialCashReceive],
            cashPayment: [initialCashPayment],
            cashTransfer: [initialCashtransfer],
            chequeReceived: [initialChequeReceived],
            match: []
        },

        validationSchema: Yup.object({
            initialBalance: Yup.number(),
            cashTransfer: Yup.array(
                Yup.object({
                    // bankAccount: Yup.string().required('حساب بانکی باید انتخاب گردد'),
                    // receiptNumber: Yup.string().required('شماره فیش بانکی باید وارد شود'),
                    price: Yup.number().required('مبلغ باید وارد شود').min(0, "میزان مبلغ باید مثبت باشد"),
                })
            ),
            cashReceive: Yup.array(
                Yup.object({
                    Price: Yup.number().required('مبلغ باید وارد شود').min(0, "میزان مبلغ باید مثبت باشد"),
                })
            ),
            cashPayment: Yup.array(
                Yup.object({
                    Price: Yup.number().required('مبلغ باید وارد شود').min(0, "میزان مبلغ باید مثبت باشد"),
                })
            ),
            chequeReceived: Yup.array(
                Yup.object({
                    bankName: Yup.string().required('نام بانک باید انتخاب گردد'),
                    serial: Yup.string().required('سریال چک باید وارد شود'),
                    accountNumber: Yup.string().required('شماره حساب باید وارد شود'),
                    maturity: Yup.string().required('سررسید چک باید وارد شود'),
                    amount: Yup.string().required('مبلغ چک باید وارد شود').min(0, "میزان مبلغ باید مثبت باشد"),
                })
            )

        }),

        validateOnChange: false,
        onSubmit: (values) => {

            DocumentSub()
            console.log('All Values:', values)
        }
    })


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





    useEffect(() => {

        let priceTemp = 0
        formik.values.cashReceive.forEach(element => {
            priceTemp += element.Price || 0
        });

        setCashReceivePriceTotal(parsFloatFunction(priceTemp, 2))



    }, [formik.values.cashReceive])


    useEffect(() => {

        let priceTemp = 0
        formik.values.cashPayment.forEach(element => {
            priceTemp += element.Price || 0
        });
        setCashPaymentPriceTotal(parsFloatFunction(priceTemp, 2))

    }, [formik.values.cashPayment])


    useEffect(() => {
        let temp = 0

        formik.values.cashTransfer.forEach(element => {
            temp += element.price || 0
            setPriceTotal(parsFloatFunction(temp, 2))
        });


    }, [formik.values.cashTransfer])



    useEffect(() => {
        setGridData([recieptFormGridData[1]])
    }, [recieptFormGridData])


    const CashReceiveDateRefs = useRef([]);
    const CashPaymentDateRefs = useRef([]);
    const CashTransferDateRefs = useRef([]);
    const chequeDateRefs = useRef([]);
    const chequeMaturityDateRefs = useRef([]);


    const [cashReceiveFocusedRow, setCashReceiveFocusedRow] = useState(1)
    const [cashPaymentFocusedRow, setCashPaymentFocusedRow] = useState(1)
    const [cashTransferFocusedRow, setCashTransferFocusedRow] = useState(1)
    const [chequeFocusedRow, setChequeFocusedRow] = useState(1)

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }

    }, [formik.errors.cashTransfer, formik.errors.cashReceive, formik.errors.cashPayment, formik.errors.chequeReceived])

    function addCashReceiveRow() {
        formik.setFieldValue('cashReceive', [...formik.values.cashReceive, emptyCashReceive])
    }
    function addCashPaymentRow() {
        formik.setFieldValue('cashPayment', [...formik.values.cashPayment, emptyCashPayment])
    }


    function addCashTransferRow() {
        formik.setFieldValue('cashTransfer', [...formik.values.cashTransfer, emptyCashtransfer])
    }


    function HandlePriceChangeCashReceive(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashReceive[${index}].Price`, parsFloatFunction(temp, 2))
    }

    function HandlePriceChangeCashPayment(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashPayment[${index}].Price`, parsFloatFunction(temp, 2))
    }

    function HandlebankAccountOpenState(index, state) {
        if (index === cashTransferFocusedRow - 1) {
            setBankAccountOpen(state)
        }
        else {
            setBankAccountOpen(false)
        }
    }

    function HandlePriceChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`cashTransfer[${index}].price`, parsFloatFunction(temp, 2))
    }


    function CustomMoveBack(currentElement, previousElement, index) {
        if (currentElement.current[index].closest("td").cellIndex === 2 && index !== 0) {
            previousElement.current[index - 1].focus()
            previousElement.current[index - 1].select()
        }
        else {
            previousElement.current[index].focus()
            previousElement.current[index].select()
        }
    }

    function chequeKeyDownHandlerCashReceive(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.cashReceive.length === cashReceiveFocusedRow) {
                addCashReceiveRow()
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
        if (e.keyCode === 38) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.cashReceive, addCashReceiveRow, next, cashReceiveFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.cashReceive, addCashReceiveRow, next, cashReceiveFocusedRow)
        }
        if (e.keyCode === 13) { /* Enter */
            MoveNext(formik.values.cashReceive, addCashReceiveRow, next, cashReceiveFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.cashReceive, addCashReceiveRow, next, cashReceiveFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.cashReceive, addCashReceiveRow, next, cashReceiveFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }
    function chequeKeyDownHandlerCashPayment(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.cashPayment.length === cashPaymentFocusedRow) {
                addCashPaymentRow()
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
        if (e.keyCode === 38) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.cashPayment, addCashPaymentRow, next, cashPaymentFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.cashPayment, addCashPaymentRow, next, cashPaymentFocusedRow)
        }
        if (e.keyCode === 13) { /* Enter */
            MoveNext(formik.values.cashPayment, addCashPaymentRow, next, cashPaymentFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.cashPayment, addCashPaymentRow, next, cashPaymentFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.cashPayment, addCashPaymentRow, next, cashPaymentFocusedRow)
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


    ///// Cheque Grid \\\\\



    const [chequeBankNameOpen, setChequeBankNameOpen] = useState(false)

    const [chequeCashOpen, setChequeCashOpen] = useState(false)


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

        if (e.keyCode === 40 && chequeBankNameOpen === false && chequeCashOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.chequeReceived.length === chequeFocusedRow) {
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
        if (e.keyCode === 38 && chequeBankNameOpen === false && chequeCashOpen === false) { /* Up ArrowKey */
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
        if (e.keyCode === 13 && chequeBankNameOpen === false && chequeCashOpen === false) { /* Enter */
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

    const [chequeAmountTotal, setChequeAmountTotal] = useState(0)

    useEffect(() => {
        let chequeAmountTemp = 0
        formik.values.chequeReceived.forEach(element => {
            chequeAmountTemp += element.amount
            setChequeAmountTotal(parsFloatFunction(chequeAmountTemp, 2))
        });
    }, [formik.values.chequeReceived])



    ///// End of Cheque Grid \\\\\

    /////All things Tatbiq related go here\\\\\\
    const [debtor, setDebtor] = useState(karadummyRight);
    const [creditor, setCreditor] = useState(karadummyLeft);
    // useEffect(() => {
    //     if (formik.values.receivedFrom) {
    //         setDebtor(karadummyRight)
    //         setCreditor(karadummyLeft)
    //     } else {
    //         setDebtor([])
    //         setCreditor([])
    //     }
    // }, [formik.values.receivedFrom])


    function getData(data) {
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
                            <div className="form-design">
                                <div className='row'>
                                    <div className="content col-lg-4 col-md-4 col-sm-4 col-12">
                                        <div className="title">
                                            <span>{t("کد طرف حساب")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="PartnerCode"
                                                    name="PartnerCode"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.PartnerCode}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="content col-lg-4 col-md-4 col-sm-4 col-12">
                                        <div className="title">
                                            <span>{t("نام طرف حساب")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="AccountPartyName"
                                                    name="AccountPartyName"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.AccountPartyName}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="content col-lg-4 col-md-4 col-sm-4 col-12">
                                        <div className="title">
                                            <span>{t("نام حقوقی")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    id="LegalName"
                                                    name="LegalName"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.LegalName}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className='content col-12 mt-4'>
                                        <div className='title mb-0'>
                                            <span className='span'> {t("فاکتورهای طرف حساب")}:</span>
                                        </div>
                                        <div style={{ margin: '-20px -20px 0' }}>
                                            <RKGrid
                                                gridId={'recieptEditFormGrid'}
                                                gridData={gridData}
                                                columnList={tempColumn}
                                                showSetting={false}
                                                showChart={false}
                                                showExcelExport={false}
                                                showPrint={false}
                                                rowCount={gridData.length}
                                                sortable={false}
                                                pageable={false}
                                                reorderable={false}
                                                selectable={false}

                                            />
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className='row'>
                                            <div className={`col-xl-6 col-12`}>
                                                <div className='row align-items-center'>
                                                    <div className='content col-md-4 col-12'>
                                                        <div className='title mb-0'>
                                                            <span
                                                                className='span'> {t("دریافت نقد")}:</span>
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
                                                                    addCashReceiveRow()
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
                                                                        <th>{t("کد تراکنش")}</th>
                                                                        <th>{t("تاریخ")}</th>
                                                                        <th>{t("مبلغ")}</th>
                                                                        <th>{t("صندوق")}</th>
                                                                        <th>{t("توضیحات")}</th>
                                                                        <th>{t("حذف")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <FieldArray
                                                                        name="cashReceive"
                                                                        render={({ push, remove }) => (
                                                                            <React.Fragment>
                                                                                {formik?.values?.cashReceive?.map((cashReceive, index) => (
                                                                                    <tr key={cashReceive.formikId}
                                                                                        onFocus={(e) => setCashReceiveFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                        className={cashReceiveFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                                    >
                                                                                        <td className='text-center' style={{
                                                                                            verticalAlign: 'middle',
                                                                                            width: '40px'
                                                                                        }}>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '60px',
                                                                                        }}>
                                                                                            <div className='text-center'>
                                                                                                <input className='d-none' disabled />
                                                                                                {index == 0 ? <>{formik.values.cashReceive[index].TransactionCode}</> : <span className='red-text'>?</span>}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{ width: '75px', minWidth: '75px' }}>
                                                                                            <div
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                                                                                                        chequeKeyDownHandlerCashReceive(e)
                                                                                                    }
                                                                                                }}

                                                                                            >
                                                                                                <DatePicker
                                                                                                    style={{ direction: 'ltr' }}
                                                                                                    name={`cashReceive.${index}.Date`}
                                                                                                    ref={el => (CashReceiveDateRefs.current[index] = el?.firstChild.firstChild)}
                                                                                                    id="Date"
                                                                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                                    calendarPosition="bottom-right"
                                                                                                    value={new DateObject(formik.values.cashReceive[index].Date)}
                                                                                                    onOpen={false}
                                                                                                    render={<InputMask />}
                                                                                                    onChange={(date) => {
                                                                                                        if (!CashReceiveDateRefs.current[index].value.includes("–")) {
                                                                                                            formik.setFieldValue(`cashReceive[${index}].Date`, julianIntToDate(date.toJulianDay()));
                                                                                                        }
                                                                                                    }
                                                                                                    }
                                                                                                    onOpenPickNewDate={false}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '100px',
                                                                                            minWidth: '100px'
                                                                                        }}>
                                                                                            <CurrencyInput
                                                                                                onKeyDown={(e) => chequeKeyDownHandlerCashReceive(e)}
                                                                                                className={`form-input `}
                                                                                                id="Price"
                                                                                                defaultValue={index == 0 ? initialCashReceive.Price : 0}
                                                                                                name={`cashReceive.${index}.Price`}
                                                                                                decimalsLimit={2}
                                                                                                onChange={(e) => HandlePriceChangeCashReceive(index, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '100px',
                                                                                            minWidth: '100px'
                                                                                        }}>
                                                                                            <div
                                                                                                className={`table-autocomplete `}>
                                                                                                <Autocomplete
                                                                                                    defaultValue={{
                                                                                                        "id": "10004",
                                                                                                        "name": "صندوق اصلی"
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
                                                                                                    id="cashReceiveFund"
                                                                                                    name={`cashReceive.${index}.Fund`}
                                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                    options={CashDeskData}
                                                                                                    getOptionLabel={option => option.name}
                                                                                                    disabled
                                                                                                    renderOption={(props, option) => (
                                                                                                        <Box
                                                                                                            component="li" {...props}>
                                                                                                            {option.id}-({option.name})
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    filterOptions={(options, state) => {
                                                                                                        let newOptions = [];
                                                                                                        options.forEach((element) => {
                                                                                                            if (
                                                                                                                element.id.includes(state.inputValue.toLowerCase()) ||
                                                                                                                element.name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                            )
                                                                                                                newOptions.push(element);
                                                                                                        });
                                                                                                        return newOptions;
                                                                                                    }}


                                                                                                    onSubmit={(e) => console.log(e)}
                                                                                                    renderInput={params => (
                                                                                                        <TextField {...params}
                                                                                                            label=""
                                                                                                            variant="outlined" />
                                                                                                    )}

                                                                                                />
                                                                                            </div>
                                                                                        </td>

                                                                                        <td style={{
                                                                                            width: '140px',
                                                                                            minWidth: '140px'
                                                                                        }}>
                                                                                            <input
                                                                                                onKeyDown={(e) => chequeKeyDownHandlerCashReceive(e)}
                                                                                                className={`form-input `}
                                                                                                id="Description"
                                                                                                name={`cashReceive.${index}.Description`}
                                                                                                onChange={(e) => formik.setFieldValue(`cashReceive.${index}.Description`, e.target.value)}
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
                                                                        <td>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="PriceTotal"
                                                                                disabled
                                                                                value={cashReceivePriceTotal}
                                                                                name={`cashReceive.priceTotal`}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td />
                                                                        <td />
                                                                        <td />
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                        {formik?.errors?.cashReceive?.map((error, index) => (
                                                            <p className='error-msg' key={index}>
                                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.Price ? t(error.Price) + '.' : ""}` : null}
                                                            </p>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`col-xl-6 col-12`}>
                                                <div className='row align-items-center'>
                                                    <div className='content col-md-4 col-12'>
                                                        <div className='title mb-0'>
                                                            <span
                                                                className='span'> {t("پرداخت نقد")}:</span>
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
                                                                    addCashPaymentRow()
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
                                                                        <th>{t("کد تراکنش")}</th>
                                                                        <th>{t("تاریخ")}</th>
                                                                        <th>{t("مبلغ")}</th>
                                                                        <th>{t("صندوق")}</th>
                                                                        <th>{t("توضیحات")}</th>
                                                                        <th>{t("حذف")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <FieldArray
                                                                        name="cashPayment"
                                                                        render={({ push, remove }) => (
                                                                            <React.Fragment>
                                                                                {formik?.values?.cashPayment?.map((cashPayment, index) => (
                                                                                    <tr key={cashPayment.formikId}
                                                                                        onFocus={(e) => setCashPaymentFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                        className={cashPaymentFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                                    >
                                                                                        <td className='text-center' style={{
                                                                                            verticalAlign: 'middle',
                                                                                            width: '40px'
                                                                                        }}>
                                                                                            {index + 1}
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '60px',
                                                                                        }}>
                                                                                            <div className='text-center'>
                                                                                                <input className='d-none' disabled />
                                                                                                {index == 0 ? <>{formik.values.cashPayment[index].TransactionCode}</> : <span className='red-text'>?</span>}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{ width: '75px', minWidth: '75px' }}>
                                                                                            <div
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                                                                                                        chequeKeyDownHandlerCashPayment(e)
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <DatePicker
                                                                                                    style={{ direction: 'ltr' }}
                                                                                                    name={`cashPayment.${index}.Date`}
                                                                                                    id="Date"
                                                                                                    ref={el => (CashPaymentDateRefs.current[index] = el?.firstChild.firstChild)}
                                                                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                                    calendarPosition="bottom-right"
                                                                                                    value={new DateObject(formik.values.cashPayment[index].Date)}
                                                                                                    onOpen={false}
                                                                                                    render={<InputMask />}
                                                                                                    onChange={(date) => {
                                                                                                        if (!CashPaymentDateRefs.current[index].value.includes("–")) {
                                                                                                            formik.setFieldValue(`cashPayment[${index}].Date`, julianIntToDate(date.toJulianDay()));
                                                                                                        }
                                                                                                    }
                                                                                                    }
                                                                                                    onOpenPickNewDate={false}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '100px',
                                                                                            minWidth: '100px'
                                                                                        }}>
                                                                                            <CurrencyInput
                                                                                                onKeyDown={(e) => chequeKeyDownHandlerCashPayment(e)}
                                                                                                className={`form-input `}
                                                                                                id="Price"
                                                                                                defaultValue={index == 0 ? initialCashPayment.Price : 0}
                                                                                                name={`cashPayment.${index}.Price`}
                                                                                                decimalsLimit={2}
                                                                                                onChange={(e) => HandlePriceChangeCashPayment(index, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{
                                                                                            width: '100px',
                                                                                            minWidth: '100px'
                                                                                        }}>
                                                                                            <div
                                                                                                className={`table-autocomplete `}>
                                                                                                <Autocomplete
                                                                                                    defaultValue={{
                                                                                                        "id": "10004",
                                                                                                        "name": "صندوق اصلی"
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
                                                                                                    id="cashPaymentFund"
                                                                                                    name={`cashPayment.${index}.Fund`}
                                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                    options={CashDeskData}
                                                                                                    getOptionLabel={option => option.name}
                                                                                                    disabled
                                                                                                    renderOption={(props, option) => (
                                                                                                        <Box
                                                                                                            component="li" {...props}>
                                                                                                            {option.id}-({option.name})
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    filterOptions={(options, state) => {
                                                                                                        let newOptions = [];
                                                                                                        options.forEach((element) => {
                                                                                                            if (
                                                                                                                element.id.includes(state.inputValue.toLowerCase()) ||
                                                                                                                element.name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                            )
                                                                                                                newOptions.push(element);
                                                                                                        });
                                                                                                        return newOptions;
                                                                                                    }}
                                                                                                    onSubmit={(e) => console.log(e)}
                                                                                                    renderInput={params => (
                                                                                                        <TextField {...params}
                                                                                                            label=""
                                                                                                            variant="outlined" />
                                                                                                    )}
                                                                                                />
                                                                                            </div>
                                                                                        </td>

                                                                                        <td style={{
                                                                                            width: '140px',
                                                                                            minWidth: '140px'
                                                                                        }}>
                                                                                            <input
                                                                                                onKeyDown={(e) => chequeKeyDownHandlerCashPayment(e)}
                                                                                                className={`form-input `}
                                                                                                id="Description"
                                                                                                name={`cashPayment.${index}.Description`}
                                                                                                onChange={(e) => formik.setFieldValue(`cashPayment.${index}.Description`, e.target.value)}
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
                                                                        <td>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="PriceTotal"
                                                                                disabled
                                                                                value={cashPaymentPriceTotal}
                                                                                name={`cashPayment.priceTotal`}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td />
                                                                        <td />
                                                                        <td />
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                        {formik?.errors?.cashPayment?.map((error, index) => (
                                                            <p className='error-msg' key={index}>
                                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.Price ? t(error.Price) + '.' : ""} ` : null}
                                                            </p>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-xl-8 col-12'>
                                                <div className='row align-items-center'>
                                                    <div className='content col-md-4 col-12'>
                                                        <div className='title mb-0'>
                                                            <span className='span'> {t("دریافت حواله بانکی")}:</span>
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
                                                                    addCashTransferRow()
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
                                                                        <th>{t("کد تراکنش")}</th>
                                                                        <th>{t("تاریخ")}</th>
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
                                                                                        <td style={{
                                                                                            width: '60px',
                                                                                        }}>
                                                                                            <div className='text-center'>
                                                                                                <input className='d-none' disabled />
                                                                                                {index == 0 ? <>{formik.values.cashTransfer[index].TransactionCode}</> : <span className='red-text'>?</span>}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{ width: '75px', minWidth: '75px' }}>
                                                                                            <div
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                                                                                                        keyDownHandlerTransfer(e)
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <DatePicker
                                                                                                    style={{ direction: 'ltr' }}
                                                                                                    name={`cashTransfer.${index}.Date`}
                                                                                                    id="Date"
                                                                                                    ref={el => (CashTransferDateRefs.current[index] = el?.firstChild.firstChild)}
                                                                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                                    calendarPosition="bottom-right"
                                                                                                    value={new DateObject(formik.values.cashTransfer[index].Date)}
                                                                                                    onOpen={false}
                                                                                                    render={<InputMask />}
                                                                                                    onChange={(date) => {
                                                                                                        if (!CashTransferDateRefs.current[index].value.includes("–")) {
                                                                                                            formik.setFieldValue(`cashTransfer[${index}].Date`, julianIntToDate(date.toJulianDay()));

                                                                                                        }
                                                                                                    }
                                                                                                    }
                                                                                                    onOpenPickNewDate={false}
                                                                                                />
                                                                                            </div>
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
                                                                                                defaultValue={index === 0 ? initialCashtransfer.price : 0}
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
                                                                        <td colSpan={5}>{t('جمع')}:</td>
                                                                        <td>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="priceTotal"
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
                                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.price ? t(error.price) + '.' : ""} ` : null}
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
                                                                        <th >{t("پشت نمره")}</th>
                                                                        <th >{t("تاریخ")}</th>
                                                                        <th >{t("نام بانک")}</th>
                                                                        <th> {t("کد شعبه")} </th>
                                                                        <th> {t("نام شعبه")} </th>
                                                                        <th> {t("محل صدور")} </th>
                                                                        <th> {t("سریال")} </th>
                                                                        <th> {t("شماره حساب")} </th>
                                                                        <th> {t("سررسید")} </th>
                                                                        <th>{t("تحویل دهنده")}</th>
                                                                        <th>{t("مبلغ")}</th>
                                                                        <th>{t("صندوق")}</th>
                                                                        <th>{t("توضیحات")}</th>
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
                                                                                        <td style={{
                                                                                            width: '60px',
                                                                                        }}>
                                                                                            <div className='text-center'>
                                                                                                <input className='d-none' disabled />
                                                                                                {index == 0 ? <>{formik.values.chequeReceived[index].BehindScore}</> : <span className='red-text'>?</span>}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{ width: '75px', minWidth: '75px' }}>
                                                                                            <div
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                                                                                                        chequeKeyDownHandler(e)
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <DatePicker
                                                                                                    style={{ direction: 'ltr' }}
                                                                                                    name={`chequeReceived.${index}.Date`}
                                                                                                    id="Date"
                                                                                                    ref={el => (chequeDateRefs.current[index] = el?.firstChild.firstChild)}
                                                                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                                    calendarPosition="bottom-right"
                                                                                                    value={new DateObject(formik.values.chequeReceived[index].Date)}
                                                                                                    onOpen={false}
                                                                                                    render={<InputMask />}
                                                                                                    onChange={(date) => {
                                                                                                        if (!chequeDateRefs.current[index].value.includes("–")) {
                                                                                                            formik.setFieldValue(`chequeReceived[${index}].Date`, julianIntToDate(date.toJulianDay()));
                                                                                                        }
                                                                                                    }
                                                                                                    }
                                                                                                    onOpenPickNewDate={false}
                                                                                                />
                                                                                            </div>
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
                                                                                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
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
                                                                                                        chequeKeyDownHandler(e)
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
                                                                                                    style={{ direction: 'ltr' }}
                                                                                                    name={`chequeReceived.${index}.maturity`}
                                                                                                    id="maturityDate"
                                                                                                    ref={el => (chequeMaturityDateRefs.current[index] = el?.firstChild.firstChild)}
                                                                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                                    calendarPosition="bottom-right"
                                                                                                    onOpen={false}
                                                                                                    render={<InputMask />}
                                                                                                    onChange={(date) => {
                                                                                                        if (!chequeMaturityDateRefs.current[index].value.includes("–")) {
                                                                                                            formik.setFieldValue(`chequeReceived[${index}].maturity`, julianIntToDate(date.toJulianDay()));
                                                                                                        }
                                                                                                    }
                                                                                                    }
                                                                                                    onOpenPickNewDate={false}
                                                                                                />
                                                                                            </div>
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
                                                                                        <td style={{ width: '120px', minWidth: '100px' }}>
                                                                                            <CurrencyInput
                                                                                                onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                                className={`form-input `}
                                                                                                id="amount"
                                                                                                name={`chequeReceived.${index}.amount`}
                                                                                                decimalsLimit={2}
                                                                                                onChange={(e) => HandleChequeAmountChange(index, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
                                                                                        </td>

                                                                                        <td style={{ minWidth: '120px' }} >
                                                                                            <div className={`table-autocomplete `}>
                                                                                                <Autocomplete

                                                                                                    defaultValue={{
                                                                                                        "Code": "30000001",
                                                                                                        "Name": "صندوق اصلی",
                                                                                                    }}
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
                                                                                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
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

                                                                                                    renderInput={params => (
                                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                                    )}

                                                                                                    disabled
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td style={{ width: '150px', minWidth: '110px' }}>
                                                                                            <input
                                                                                                onKeyDown={(e) => chequeKeyDownHandler(e)}
                                                                                                className={`form-input `}
                                                                                                id="descriptionT"
                                                                                                name={`chequeReceived.${index}.description`}
                                                                                                onChange={(e) => formik.setFieldValue(`chequeReceived.${index}.description`, e.target.value)}
                                                                                                autoComplete="off"
                                                                                            />
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
                                                                        <td colSpan={11}>{t("جمع")}:</td>
                                                                        <td>
                                                                            <CurrencyInput
                                                                                className='form-input'
                                                                                id="chequeAmountTotal"
                                                                                disabled
                                                                                value={chequeAmountTotal}
                                                                                name={`chequeReceived.chequeAmountTotal`}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>

                                                                        <td colSpan={3} />
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                        {
                                                            formik?.errors?.chequeReceived?.map((error, index) => (
                                                                <p className='error-msg' key={index}>
                                                                    {error ? ` ${t("ردیف")} ${index + 1} : ${error?.bankName ? t(error.bankName) + "." : ""} ${error?.serial ? t(error.serial) + "." : ""} ${error?.accountNumber ? t(error.accountNumber) + "." : ""} ${error?.maturity ? t(error.maturity) + "." : ""} ${error?.amount ? t(error.amount) + "." : ""} ` : null}
                                                                </p>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className={`Tatbiq`}>
                                            <Kara debtor={debtor} creditor={creditor} showOtherBtn={true} getData={getData} />
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
                            if (formik.errors.cashReceive || formik.errors.cashTransfer || formik.errors.cashPayment || formik.errors.chequeReceived) {
                                tableError()
                            }
                            formik.handleSubmit()
                        }}
                    >
                        {t("تایید")}
                    </Button>
                    <div className="Issuance">
                        <Button variant="contained" color="error">
                            <Link to={state.prevPath}>
                                {t("انصراف")}
                            </Link>

                        </Button>
                    </div>
                </div>
            </div>

        </>
    )
}

