import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import swal from "sweetalert";
import Input from "react-input-mask";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import service from "./invoiceNumber";
import fund from "./fundList";
import account from "./accountSideList";
import account1 from "./accountSideList1";
import sideCheque from "./accountSideCheque";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { renderCalendarLocaleSwitch } from "../../../utils/calenderLang";
import { renderCalendarSwitch } from "../../../utils/calenderLang"
import { history } from '../../../utils/history';
import { Autocomplete, Box, Button, IconButton, TextField, useTheme } from '@mui/material';
import { definedAccountLookupData, descriptiveLookupData } from './SummaryLookUpData';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { julianIntToDate } from '../../../utils/dateConvert';
import DatePicker from 'react-multi-date-picker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { parsFloatFunction } from '../../../utils/parsFloatFunction';
import CurrencyInput from 'react-currency-input-field';
import DateObject from 'react-date-object';
import { AddTableRow, MoveBack, MoveForward } from '../../../utils/gridKeyboardNavigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';



const emptyArticles = { definedAccount: '', descriptive: "", amount: 0, invoiceNumber : "", invoiceDate: "", notes: "" };
const emptyArticlesTouch = { definedAccount: false, descriptive: false, debits: false, credits: false, notes: false };
const Factor = [];

export const ChequeIssuance = () => {


    const theme = useTheme();

    const [debitsTotal, setDebitsTotal] = useState(0)
    const [creditsTotal, setCreditsTotal] = useState(0)
    const [click, setClick] = useState(false)

    const dateRef = useRef()
    
    const chequeMaturityRefs = useRef([]);

    const { t, i18n } = useTranslation();
    const [alignment, setAlignment] = React.useState("");
    const callComponent = () => {
        history.navigate(`/FinancialTransaction/SummaryGrid`, 'noopener,noreferrer');
    }

    const selectRef=useRef()
   
    const [invoiceNumbers, setInvoiceNumber] = React.useState(
        service.getInvoiceNumber()
    )


    const [fundList, setFundList] = React.useState(fund.getFundList());
    const [accountSideList, setAccountSideList] = React.useState(account.getAccountSideList());
    const [accountSideList1, setAccountSideList1] = React.useState(account1.getAccountSideList1());
    const [accountSideCheque, setAccountSideCheque] = React.useState(sideCheque.getAccountSideCheque());
    const formik = useFormik({
        initialValues: {
            
            transactionCode: 362,
            
            chequePlan: "fund",
            transactionDate: julianIntToDate(new DateObject().toJulianDay()),

            accountSideList: "",
            accountSideList1: "",
        
            show: true,           
            documentId: Math.floor(Math.random() * 100000),
            documentDate: julianIntToDate(new DateObject().toJulianDay()),
            documentDescription: "",
            amountsDescription: [emptyArticles],
            balance: 0,
        },
        show: Yup.boolean(),
        validationSchema: Yup.object({

           

chequePlan:Yup.string(),
// accountSideCheque: Yup.string().required(() => {
//     return "نوع چک الزامیست";
//   }),
//  


                 accountSideList: Yup.string().when("chequePlan", (chequePlan) => {
                    if (chequePlan === "treasury")
                    return Yup.string().required("نام صندوق‌ الزامی است");
                }),

             accountSideList1: Yup.string().when("chequePlan", (chequePlan) => {
                    if (chequePlan === "fund")
                    return Yup.string().required("نام ‌تنخواه الزامی است");
                }),
    
            documentDescription: Yup.string()
                .required("وارد کردن توضیحات الزامی است"),

            amountsDescription: Yup.array(
                Yup.object({
                    definedAccount: Yup.string().required('حساب معین باید انتخاب گردد'),
                    debits: Yup.number().min(0, "میزان بدهکار باید مثبت باشد"),
                    credits: Yup.number()
                        .when("debits", (debits) => {
                            if (debits === 0)
                                return Yup.number().moreThan(0, "یکی از موارد بدهکار یا بستانکار باید بیش از صفر باشد")
                            else
                                return Yup.number().max(0, "فقط یکی از موارد بدهکار یا بستانکار می‌تواند مقدار بگیرد").min(0, "میزان بستانکار باید مثبت باشد")
                        }),
                        notes: Yup.string()
                        .required("وارد کردن توضیحات الزامی است"),
                            
        
                               
                            
                })
            )
        }),

        validateOnChange: false,
        onSubmit: (values) => {

            factorSub()
            console.log('All Values:', values)
        }
    });
    const factorSub = () => {
        swal({
            title: t("فاکتور با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };
    const tableError = () => {
        swal({
            title: t('خطاهای مشخص شده را برطرف کنید'),
            icon: "error",
            button: t("باشه")
        });
    }

    console.log("lkashdfashdf",formik.values.chequePlan)


    function renderBalanceClassName() {
        if (creditsTotal > debitsTotal) {
            return "balanceFieldGreen"
        }
        else if (creditsTotal < debitsTotal) {
            return "balanceFieldRed"
        }
        else {
            return ""
        }
    }
    function HandleBalanceChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('balance', parsFloatFunction(temp, 2))
    }
    function renderBalanceState() {
        if (creditsTotal > debitsTotal) {
            return t("بستانکار")
        }
        else if (creditsTotal < debitsTotal) {
            return t("بدهکار")
        }
        else {
            return ""
        }
    }
    function InputMask({ value, handleValueChange, openCalendar }) {
        let v = ""
        //   console.log('value::::::', value)
        Array.isArray(value) ?
            v = value[0].replaceAll('۰', '0').replaceAll('۱', '1').replaceAll('۲', '2').replaceAll('۳', '3').replaceAll('۴', '4').replaceAll('۵', '5').replaceAll('۶', '6').replaceAll('۷', '7').replaceAll('۸', '8').replaceAll('۹', '9')
            : v = value.replaceAll('۰', '0').replaceAll('۱', '1').replaceAll('۲', '2').replaceAll('۳', '3').replaceAll('۴', '4').replaceAll('۵', '5').replaceAll('۶', '6').replaceAll('۷', '7').replaceAll('۸', '8').replaceAll('۹', '9')
        return (
            <Input
                className="rmdp-input"
                style={{ direction: "ltr" }}
                mask="9999/99/99"
                maskChar="-"
                onFocus={openCalendar}
                onChange={handleValueChange}
                value={v}
                alwaysShowMask={true}
            />
        );
    }
    ///////End of Form Functions\\\\\\\\\\\\


    //////Start of Grid Functions\\\\\\\\\\\
    const definedAccountRefs = useRef([]);
    const descriptiveRefs = useRef([]);
    const debitsRefs = useRef([]);
    const creditsRefs = useRef([]);
    const notesRefs = useRef([]);
    const AdditionalRefs = useRef([]);

    // const [errorDialogState, setErrorDialogState] = useState(false)

    const [documentArticlesFocusedRow, setDocumentArticlesFocusedRow] = useState(1)
    /* Defined Account AutoComplete */
    const [definedAccountOpen, setDefinedAccountOpen] = React.useState([false]);
    const definedAccountOpenRef = useRef();
    definedAccountOpenRef.current = definedAccountOpen
    //  console.log('definedAccountOpenRef.current', definedAccountOpenRef.current)

    function HandleDefinedAccountOpenState(index, state) {
        let temp = definedAccountOpen
        temp[index] = state
        // console.log('index', index)
        // console.log('temp', temp)
        setDefinedAccountOpen([...temp])
    }
    //  console.log('definedAccountOpen', definedAccountOpen)

    /* Descriptive AutoComplete */
    const [descriptiveOpen, setDescriptiveOpen] = React.useState([false]);
    const descriptiveOpenRef = useRef();
    descriptiveOpenRef.current = descriptiveOpen

    function HandleDescriptiveOpenState(index, state) {
        let temp = descriptiveOpen
        temp[index] = state
        setDescriptiveOpen([...temp])
    }

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }

    }, [formik.errors.amountsDescription])


    function addDocumentArticlesRow() {
        formik.setFieldValue('amountsDescription', [...formik.values.amountsDescription, emptyArticles])
        setDefinedAccountOpen([...definedAccountOpen, false])
        setDescriptiveOpen([...descriptiveOpen, false])
    }

    function keyDownHandler(e, index, currentElm, nextElm, previousElm) {
        if (currentElm.current[index].getAttributeNode("class").value === "rmdp-input") {
            currentElm?.current[index]?.parentElement.parentElement.closeCalendar();
        }


        if (e.keyCode === 40 && definedAccountOpen[index] === false && descriptiveOpen[index] === false) { /* Down Arrowkey */
            e.preventDefault()
            if (index === formik.values.amountsDescription.length - 1) {
                AddTableRow(addDocumentArticlesRow, currentElm, index)
            } else {
                currentElm.current[index + 1].focus()
                currentElm.current[index + 1].select()
            }
        }
        if (e.keyCode === 38 && definedAccountOpen[index] === false && descriptiveOpen[index] === false) { /* Up ArrowKey */
            e.preventDefault()
            currentElm.current[index - 1].focus()
            currentElm.current[index - 1].select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            e.preventDefault()
            i18n.dir() === "rtl" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.amountsDescription, addDocumentArticlesRow, currentElm, nextElm, index, 6)

        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            e.preventDefault()
            i18n.dir() === "ltr" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.amountsDescription, addDocumentArticlesRow, currentElm, nextElm, index, 6)
        }
        if (e.keyCode === 13 && definedAccountOpen[index] === false && descriptiveOpen[index] === false) { /* Enter */   /* MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            MoveForward(formik.values.amountsDescription, addDocumentArticlesRow, currentElm, nextElm, index, 6)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            nextElm.current[index].focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveForward(formik.values.amountsDescription, addDocumentArticlesRow, currentElm, nextElm, index, 6)
            }
            else {
                MoveBack(currentElm, previousElm, index)
            }
        }
    }

    function HandleDebitsChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`amountsDescription[${index}].amount`, parsFloatFunction(temp, 2))
    }
    function HandleAdditionalChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`amountsDescription[${index}].invoiceNumber`, parsFloatFunction(temp, 2))
    }



    useEffect(() => {
        let debitsTemp = 0
        formik.values.amountsDescription.forEach(element => {
            debitsTemp += element.amount
            setDebitsTotal(parsFloatFunction(debitsTemp, 2))
        });



    }, [formik.values.amountsDescription])

    useEffect(() => {
        formik.setFieldValue("balance", Math.abs(creditsTotal - debitsTotal))
    }, [creditsTotal, debitsTotal])


    useEffect(() => {
        if (formik.values.invoiceNumber) {
            let current = invoiceNumbers.filter(
                (item) => item.value === formik.values.invoiceNumber
            )[0];

            formik.setFieldValue("CheckNumber", current.CheckNumber);
            formik.setFieldValue("Price", current.Price);
            formik.setFieldValue("DateOverdeal", current.DateOverdeal);
        }
    }, [formik.values.invoiceNumber]);
    useEffect(() => {
        if (formik.values.accountSideCheque) {
            let current = accountSideCheque.filter(
                (item) => item.value === formik.values.accountSideCheque
            )[0];

            formik.setFieldValue("CheckNumber", current.CheckNumber);
            formik.setFieldValue("Price", current.Price);
            formik.setFieldValue("DateOverdeal", current.DateOverdeal);
        }
    }, [formik.values.accountSideCheque]);
    console.log('formik.errors', formik.errors)
    useEffect(() => {
        if (formik.values.accountSideList) {
            let current = accountSideList.filter(
                (item) => item.value === formik.values.accountSideList
            )[0];

            formik.setFieldValue("Remaining", current.Balance);
        }
    }, [formik.values.accountSideList]);
    useEffect(() => {
        if (formik.values.accountSideList1) {
            let current = accountSideList1.filter(
                (item) => item.value === formik.values.accountSideList1
            )[0];

            formik.setFieldValue("Remaining", current.Balance);
        }
    }, [formik.values.accountSideList1]);
    const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
    const dateRef1 = useRef()
    const dateRef2 = useRef()
    const [date1, setDate1] = useState(new DateObject())



    return (
        <>
            <div className='form-template' style={{
                backgroundColor: `${theme.palette.background.paper}`,
                borderColor: `${theme.palette.divider}`,
            }}>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-design">
                            <div className="row ">
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
                                    dateRef1?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("کد")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                disabled
                                                className="form-input"
                                                type="text"
                                                id="transactionCode"
                                                name="transactionCode"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.transactionCode}
                                                placeholder=""
                                            />

                                            {formik.touched.transactionCode && formik.errors.transactionCode &&
                                                !formik.values.transactionCode ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.transactionCode)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تاریخ")}</span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            name={"transactionDate"}
                                            id={"transactionDate"}
                                            ref={dateRef1}
                                            editable={false}
                                            value={date1}
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                setDate1(val)
                                                formik.setFieldValue(
                                                    "transactionDate",
                                                    julianIntToDate(val.toJulianDay())
                                                );
                                            }}
                                        />
                                        <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton' /></div>
                                        </div>
                                    </div>
                                    {formik.touched.startDate && formik.errors.startDate ? (
                                        <div className="error-msg">{t(formik.errors.startDate)}</div>
                                    ) : null}
                                </div>
                               
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="row">
                                        <div className="content col-lg-4 col-md-4 col-12"  onFocus={() => {
                                    dateRef1?.current?.closeCalendar();}} >

                                            <div className="title">
                                                <span>‌</span>
                                            </div>
                                            <div className="wrapper">
                                                <RadioGroup
                                                    name="pie-field"
                                                    //defaultChecked="accountSideCheque"
                                                    defaultValue={formik.values.chequePlan}
                                                    className={i18n.dir() === 'rtl' ? 'rtl-radio-group' : ''}
                                                    row
                                                    onChange={(val) => {
                                                        formik.setFieldValue(
                                                            "chequePlan",
                                                            val.target.defaultValue
                                                        );
                                                        formik.setFieldValue('documentDescription', '')
                                                        formik.setFieldValue('Remaining', '')
                                                        formik.setFieldValue('accountSideList', '')                                                   
                                                        formik.setFieldValue('accountSideList1', '')                                                   
                                                        
                                                    }}
                                                >
                                                    {/* <FormControlLabel
                                                        value="chequeBook"
                                                        control={<Radio />}
                                                        label={t("تنخواه گردان")}
                                                    />
                                                    <FormControlLabel
                                                        value="accountSideCheque"
                                                        control={<Radio />}
                                                        label={t("صندوق")}
                                                    /> */}
                                                     <FormControlLabel
                                                        value="fund"
                                                        control={<Radio />}
                                                        label={t("تنخواه")}
                                                        />
                                                        <FormControlLabel
                                                        value="treasury"
                                                        control={<Radio />}
                                                        label={t("صندوق")}
                                                        /> 
                                                </RadioGroup>
                                            </div>
                                        </div>
                                       
                                        {formik.values.chequePlan === "treasury" && (
                                            <div className="content col-lg-8 col-md-8 col-12">
                                                <div className="title">
                                                    <span>
                                                        {t("صندوق")}
                                                        <span className="star">*</span>
                                                    </span>
                                                </div>
                                                <div className='wrapper'>
                                                    <SelectBox
                                                        ref={selectRef}
                                                        dataSource={fundList}
                                                        valueExpr="value"
                                                        className='selectBox'
                                                        displayExpr={function (item) {
                                                            return (
                                                                item &&
                                                                item.value +
                                                                "- " +
                                                                item.BankName +
                                                                "- " +
                                                                item.Balance
                                                            );
                                                        }}
                                                        displayValue="value"
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        onValueChanged={(e) =>
                                                            formik.setFieldValue("accountSideList", e.value)
                                                        }
                                                        itemRender={null}
                                                        placeholder=""
                                                        searchEnabled
                                                    ></SelectBox>
                                                    {formik.touched.accountSideList && formik.errors.accountSideList ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.accountSideList)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        )}

                                        {formik.values.chequePlan === "fund" && (

                                            <div className="content col-lg-8 col-md-8 col-12">
                                                

                                                    <div className="title">
                                                        <span>
                                                            {t("تنخواه گردان")}
                                                            <span className="star">*</span>
                                                        </span>
                                                    </div>
                                                    <div className='wrapper'>
                                                        <SelectBox
                                                            ref={selectRef}
                                                            dataSource={fundList}
                                                            valueExpr="value"
                                                            className='selectBox'
                                                            displayExpr={function (item) {
                                                                return (
                                                                    item &&
                                                                    item.value +
                                                                    "- " +
                                                                    item.BankName +
                                                                    "- " +
                                                                    item.Balance
                                                                );
                                                            }}
                                                            displayValue="value"
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            onValueChanged={(e) =>
                                                                formik.setFieldValue("accountSideList1", e.value)
                                                            }
                                                            itemRender={null}
                                                            placeholder=""
                                                            searchEnabled
                                                        ></SelectBox>
                                                        {formik.touched.accountSideList1 && formik.errors.accountSideList1 ? (
                                                            <div className='error-msg'>
                                                                {t(formik.errors.accountSideList1)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                
                                            </div> 


                                        )}
                                        </div>
                                     


                                       
                                        </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("مانده")}</span>
                                    </div>
                                    <CurrencyInput
                                        className='form-input'
                                        id="Remaining"
                                        name="Remaining"
                                        disabled={true}
                                        value={formik.values.Remaining}                                    
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />




                                          </div>

                              

                            <div onFocus={() => {
                                dateRef2?.current?.closeCalendar();
                            }} className="content col-lg-6 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("توضیحات")}<span className="star">*</span> </span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <textarea
                                            rows="8"
                                            className="form-input"
                                            id="documentDescription"
                                            name="documentDescription"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.documentDescription}
                                        />
                                        {formik.touched.documentDescription && formik.errors.documentDescription &&
                                            !formik.values.documentDescription ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.documentDescription)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>


                        </div>
                            <FormikProvider value={formik}>
                                <div className='row align-items-center'>

                                        <div className='content col-lg-6 col-6'>
                                            <div className='title mb-0'>
                                                <span className='span'> {t("آرتیکل‌های سند")} :</span>
                                            </div>
                                        </div>
                                        <div className='content col-lg-6 col-6'>

                                            {/* Copyright Ghafourian© Grid V2.0
                                                        All rights reserved */}
                                            <div className='d-flex justify-content-end'>
                                                <Button
                                                    variant="outlined"
                                                    className="grid-add-btn"
                                                    onClick={() => {
                                                        addDocumentArticlesRow()
                                                        setTimeout(() => {
                                                            definedAccountRefs.current[formik.values.amountsDescription.length].focus()
                                                        }, 10);
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
                                                        <th >{t("حساب معین")}</th>
                                                        <th>{t("تفضیلی")}</th>
                                                        <th>{t("مبلغ")}</th>
                                                        <th>{t("شماره فاکتور")}</th>
                                                        <th>{t("تاریخ فاکتور")}</th>
                                                        <th>{t("توضیحات")}</th>
                                                        <th>{t("حذف")}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <FieldArray
                                                        name="amountsDescription"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik?.values?.amountsDescription?.map((amountsDescription, index) => (
                                                                    <tr key={index} onFocus={(e) => setDocumentArticlesFocusedRow(e.target.closest("tr").rowIndex)}
                                                                        className={documentArticlesFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                    >
                                                                        <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                            {index + 1}
                                                                        </td>
                                                                        <td style={{ minWidth: '120px' }}>
                                                                            {/*<div className={`table-autocomplete ${formik?.errors?.amountsDescription?.length&&formik?.errors?.amountsDescription[index]?.definedAccount?'red-border':''}`}>*/}
                                                                            <div className={`table-autocomplete `}>
                                                                                <Autocomplete
                                                                                    ref={(el) => {
                                                                                        definedAccountRefs.current[index] = el?.firstChild.firstChild.firstChild
                                                                                    }
                                                                                    }
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: 300,
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
                                                                                    renderOption={(props, option) => (
                                                                                        <Box component="li" {...props}>
                                                                                            {option.Code}-{option.FormersNames}
                                                                                        </Box>
                                                                                    )}
                                                                                    filterOptions={(options, state) => {
                                                                                        let newOptions = [];
                                                                                        options.forEach((element) => {
                                                                                            if (
                                                                                                element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                element.FormersNames.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                            )
                                                                                                newOptions.push(element);
                                                                                        });
                                                                                        return newOptions;
                                                                                    }}
                                                                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                    disableClearable={true}
                                                                                    forcePopupIcon={false}
                                                                                    id="definedAccount"
                                                                                    name={`amountsDescription.${index}.definedAccount`}
                                                                                    open={definedAccountOpenRef.current[index]}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    options={definedAccountLookupData}
                                                                                    // getOptionLabel={option => option.Code !== '' ? option.Code + '-' + option.FormersNames : ''}
                                                                                    getOptionLabel={option => option.FormersNames}                                                            //          style={{ width: 300 }}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            HandleDefinedAccountOpenState(index, true)
                                                                                        }
                                                                                        else {
                                                                                            HandleDefinedAccountOpenState(index, false)
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {

                                                                                        HandleDefinedAccountOpenState(index, false)

                                                                                        formik.setFieldValue(`amountsDescription[${index}].definedAccount`, value.Code)
                                                                                    }}
                                                                                    onBlur={(e) => {
                                                                                        HandleDefinedAccountOpenState(index, false)
                                                                                    }}
                                                                                    renderInput={params => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && definedAccountOpen[index] === false) {    /* Enter */
                                                                                            e.preventDefault()
                                                                                            HandleDefinedAccountOpenState(index, false)
                                                                                        }
                                                                                        keyDownHandler(e, index, definedAccountRefs, descriptiveRefs, notesRefs)
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ minWidth: '120px' }} >
                                                                            <div className={`table-autocomplete `}>
                                                                                <Autocomplete

                                                                                    ref={(el) => {
                                                                                        descriptiveRefs.current[index] = el?.firstChild.firstChild.firstChild
                                                                                    }
                                                                                    }
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
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: 300,
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
                                                                                    id="descriptive"
                                                                                    name={`amountsDescription.${index}.descriptive`}
                                                                                    open={descriptiveOpenRef.current[index]}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    options={descriptiveLookupData}
                                                                                    getOptionLabel={option => option.Name}                                                            //          style={{ width: 300 }}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            HandleDescriptiveOpenState(index, true)
                                                                                        }
                                                                                        else {
                                                                                            HandleDescriptiveOpenState(index, false)
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {
                                                                                        HandleDescriptiveOpenState(index, false)
                                                                                        formik.setFieldValue(`amountsDescription[${index}].descriptive`, value.Code)
                                                                                    }}
                                                                                    onBlur={(e) => HandleDescriptiveOpenState(index, false)}
                                                                                    renderInput={params => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && descriptiveOpen[index] === false) {
                                                                                            e.preventDefault()
                                                                                            HandleDescriptiveOpenState(index, false)
                                                                                        }
                                                                                        keyDownHandler(e, index, descriptiveRefs, debitsRefs, definedAccountRefs)
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: '120px', minWidth: '90px' }}>
                                                                            <CurrencyInput
                                                                                ref={el => (debitsRefs.current[index] = el)}
                                                                                onKeyDown={(e) => keyDownHandler(e, index, debitsRefs, AdditionalRefs, descriptiveRefs)}
                                                                                className={`form-input `}
                                                                                id="debits"
                                                                                name={`amountsDescription.${index}.amount`}
                                                                                value={formik.values.amountsDescription[index].amount}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => HandleDebitsChange(index, e.target.value)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '120px' }}>
                                                                            <CurrencyInput
                                                                                ref={el => (AdditionalRefs.current[index] = el)}
                                                                                onKeyDown={(e) => keyDownHandler(e, index, AdditionalRefs, chequeMaturityRefs, debitsRefs)}
                                                                                className={`form-input `}
                                                                                id="debits"
                                                                                name={`amountsDescription.${index}.invoiceNumber`}
                                                                                value={formik.values.amountsDescription[index].invoiceNumber}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => HandleAdditionalChange(index, e.target.value)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '120px', minWidth: '90px' }}>













                                                                            <div
                                                                                onKeyDown={(e) => {
                                                                                    if (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                                                                                        keyDownHandler(e, index, chequeMaturityRefs, notesRefs,AdditionalRefs)
                                                                                    }
                                                                                }}
                                                                                onFocus={() => {
                                                                                    chequeMaturityRefs?.current.forEach((item, index2) => {
                                                                                        if (index !== index2) {
                                                                                            chequeMaturityRefs?.current[index2]?.parentElement.parentElement.closeCalendar()
                                                                                        }

                                                                                    })

                                                                                }
                                                                                }
                                                                            >
                                                                                <DatePicker
                                                                                    style={{ direction: 'ltr' }}
                                                                                    name={`amountsDescription.${index}.invoiceDate`}
                                                                                    id="maturityDate"
                                                                                    ref={el => (chequeMaturityRefs.current[index] = el?.firstChild.firstChild)}
                                                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                                                    calendarPosition="bottom-right"


                                                                                    onOpen={() => {
                                                                                        setTimeout(() => {
                                                                                            chequeMaturityRefs.current[index].focus()
                                                                                        }, 1);
                                                                                    }}

                                                                                    render={<InputMask />}

                                                                                    onChange={(date) => {

                                                                                        if (!chequeMaturityRefs.current[index].value.includes("–")) {
                                                                                            formik.setFieldValue(`amountsDescription[${index}].invoiceDate`, julianIntToDate(date.toJulianDay()));
                                                                                            setTimeout(() => {
                                                                                                chequeMaturityRefs.current[index].focus()
                                                                                            }, 1);

                                                                                        }
                                                                                    }
                                                                                    }
                                                                                    // onFocusedDateChange={()=> AdditionalRefs.current[index].focus()}
                                                                                    onOpenPickNewDate={false}
                                                                                />
                                                                            </div>


















                                                                        </td>
                                                                        <td style={{ minWidth: '120px' }}>
                                                                            <input
                                                                                ref={el => (notesRefs.current[index] = el)}
                                                                                className="form-input"
                                                                                onKeyDown={(e) => keyDownHandler(e, index, notesRefs, definedAccountRefs, chequeMaturityRefs)}
                                                                                name={`amountsDescription.${index}.notes`}
                                                                                placeholder='---'
                                                                                type='text'
                                                                                onChange={formik.handleChange}

                                                                                value={formik.values.amountsDescription[index].notes}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '40px' }}>
                                                                            <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
                                                                                remove(index)

                                                                                let temp2 = definedAccountOpen.filter((item, iIndex) => iIndex !== index)
                                                                                setDefinedAccountOpen([...temp2])
                                                                                let temp3 = descriptiveOpen.filter((item, iIndex) => iIndex !== index)
                                                                                setDescriptiveOpen([...temp3])

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
                                                                id="debitsTotal"
                                                                disabled
                                                                value={debitsTotal}
                                                                name={`amountsDescription.debitsTotal`}
                                                                decimalsLimit={2}
                                                                autoComplete="off"
                                                            />
                                                        </td>
                                                        <td />
                                                        <td>

                                                        </td>
                                                        <td />
                                                        <td />
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            {formik?.errors?.amountsDescription?.map((error, index) => (
                                                <p className='error-msg' key={index}>
                                                    {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.notes && error?.definedAccount ? "." : ""} ${error?.notes ? t(error.notes) : ""}` : null}
                                                </p>
                                            ))}
                                        </div>
                                        {/* <div className='content col-lg-6 col-md-6 col-12'>
                                                        <div className='title'>
                                                            <span> {t("مانده")} :</span>
                                                        </div>
                                                        <div className='wrapper'>
                                                            <div className={renderBalanceClassName()}>
                                                                <label style={{ display: "flex", alignItems: "center", textAlign: "center", margin: "auto" }}>
                                                                    <CurrencyInput
                                                                        className='form-input'
                                                                        id="balance"
                                                                        name="balance"
                                                                        onChange={(e) => HandleBalanceChange(e.target.value)}
                                                                        value={formik.values.balance}
                                                                        decimalsLimit={2}
                                                                        disabled
                                                                    />
                                                                    <span style={{ width: "20%" }}>{renderBalanceState()}</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                    </div>
                            </FormikProvider>
                        </div>



            </form>
                </div>

            </div >
            <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
                <Button variant="contained" color="success"
                    type="button"
                    onClick={formik.handleSubmit}
                >
                    {t("ثبت تغییرات")}
                </Button>

                <div className="Issuance">
                    <Button variant="contained"
                        color='error'
                        onClick={callComponent}>
                        {t("انصراف")}
                    </Button >
                </div>
            </div>
            
    </>
  );
};

export default ChequeIssuance;
