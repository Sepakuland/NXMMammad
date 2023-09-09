import React, { useState, useEffect, useRef } from "react";
import { useFormik} from "formik";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as Yup from "yup";
import {useTheme} from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import service from "./invoiceNumber";
import fund from "./fundList";
import account from "./accountSideList";
import sideCheque from "./accountSideCheque";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../../../utils/calenderLang";
import { renderCalendarSwitch } from '../../../../../utils/calenderLang'
import DateObject from "react-date-object";
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@mui/material';
import { karadummyLeft } from "../../../../../components/SetGrid/karadummyLeft.js";
import { karadummyRight } from "../../../../../components/SetGrid/karadummyRight";
import { Kara } from "../../../../../components/SetGrid/Kara";
import {parsFloatFunction} from "../../../../../utils/parsFloatFunction";
import {history} from "../../../../../utils/history";


export const ChequeIssuance = () => {
    const { t, i18n } = useTranslation();
    const [alignment, setAlignment] = React.useState("");
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

   

    const theme = useTheme();
    const [invoiceNumbers, setInvoiceNumber] = React.useState(service.getInvoiceNumber());
    const [fundList, setFundList] = React.useState(fund.getFundList());
    const [accountSideList, setAccountSideList] = React.useState(account.getAccountSideList());
    const [accountSideCheque, setAccountSideCheque] = React.useState(sideCheque.getAccountSideCheque());

    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 1000),
            
            transactionCode: 362,
            Price: "",
            transactionDate: julianIntToDate(new DateObject().toJulianDay()),
            accountSideList: "",
            Detailed: "",
            documentDescribe: "",
            Fund:'',
            moeinAcount: "",
            show: true,
            data:""
        },

        show: Yup.boolean(),
        validationSchema: Yup.object({
            Fund: Yup.string().required("وارد کردن صندوق الزامیست"),
            Price: Yup.string().required("وارد کردن مبلغ الزامیست"),
        
            accountSideList: Yup.string().when("show", (show) => {
                if (show)
                    return Yup.string().required(() => {
                        return "نام طرف حساب الزامیست";
                    })

            }),  

            Detailed: Yup.string().when("show", (show) => {
                if (!show)
                    return Yup.string().required(() => {
                        return "وارد کردن تفضیلی الزامیست";
                    })

            }),

        }),

        onSubmit: (values) => {
            console.log("here", values);
           
        },
    });
    const callComponent = () => {
        history.navigate(
            `/FinancialTransaction/PaymentDocument/Cash/display`,
            "noopener,noreferrer"
        );
    };

  
    const selectRef = useRef();

    function getData(data) {
        console.log('getData data', data)
        formik.setFieldValue('data',data)
    }
   

    useEffect(() => {
        if (formik.values.accountSideList) {
            let current = accountSideList.filter(
                (item) => item.value === formik.values.accountSideList
            )[0];

            formik.setFieldValue("Remaining", current.Balance);
        }
    }, [formik.values.accountSideList]);

    const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
    const dateRef1 = useRef()
    const dateRef2 = useRef()
    const [date, setDate] = useState(new DateObject())

    function HandlePriceChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('Price', parsFloatFunction(temp, 2))
    }
   
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
                                        <span>{t("کد تراکنش")}</span>
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
                                        <span>{t("تاریخ تراکنش")}</span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            name={"transactionDate"}
                                            id={"transactionDate"}
                                            ref={dateRef1}
                                            editable={false}
                                            value={date}
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                setDate(val)
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
                                   
                                </div>
                                
                                <div className="content col-lg-6 col-md-12 col-12" onFocus={() => {
                                    dateRef1?.current?.closeCalendar();}} >
                                
                                    <div className="row d-flex">
                                        <div className="col-xl-auto col-lg-2 col-auto  ">
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
                                                    formik.setFieldValue('show', !formik.values.show)
                                                    formik.setFieldValue("accountSideList", '')
                                                    formik.setFieldValue("Detailed", '')
                                                    formik.setFieldValue("moeinAcount", '')
                                                    formik.setFieldValue("Remaining", '')
                                                }}
                                            >
                                                <MoreHorizIcon />
                                            </button>
                                        </div>
                                        <div className="col-auto flex-grow-1 mb-0">
                                            {formik.values.show ? (
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
                                                </div>
                                            ) : (
                                                <div className="row">

                                                    <div className="col-sm-6 col-12">
                                                        <div className="title">
                                                            <span>{t("حساب معین")}</span>
                                                        </div>
                                                        <SelectBox
                                                            dataSource={measurementUnits}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            onValueChanged={(e) =>
                                                                formik.setFieldValue("moeinAcount", e.value)
                                                            }
                                                            className="selectBox"
                                                            noDataText={t("اطلاعات یافت نشد")}
                                                            itemRender={null}
                                                            placeholder=""
                                                            name="moeinAcount"
                                                            id="moeinAcount"
                                                            searchEnabled
                                                            showClearButton
                                                        ></SelectBox>
                                                       
                                                    </div>
                                                    <div className="col-sm-6 col-12">
                                                        <div className="title">
                                                                <span>{t("تفضیلی")} <span className="star">*</span></span>
                                                        </div>
                                                        <SelectBox
                                                            dataSource={measurementUnits}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            onValueChanged={(e) =>
                                                                formik.setFieldValue("Detailed", e.value)
                                                            }
                                                            className="selectBox"
                                                            noDataText={t("اطلاعات یافت نشد")}
                                                            disabled={!formik.values.moeinAcount ? true : false}
                                                            itemRender={null}
                                                            placeholder=""
                                                            name="Detailed"
                                                            id="Detailed"
                                                            searchEnabled
                                                            showClearButton
                                                        ></SelectBox>
                                                        {formik.touched.Detailed &&
                                                            formik.errors.Detailed ? (
                                                            <div className="error-msg">
                                                                {t(formik.errors.Detailed)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-12" onFocus={() => {
                                    dateRef1?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("مانده")}</span>
                                    </div>
                                    <CurrencyInput
                                        className='form-input'
                                        id="Remaining"
                                        name="Remaining"
                                        decimalsLimit={2}
                                        value={formik.values.Remaining}
                                        disabled
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div onFocus={() => {
                                    dateRef2?.current?.closeCalendar();
                                }} className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("صندوق")} <span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className='form-input'
                                                id="Fund"
                                                name="Fund"                
                                                value={formik.values.Fund}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.Fund && formik.errors.Fund ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.Fund)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                              
                                
                                <div onFocus={() => {
                                    dateRef2?.current?.closeCalendar();
                                }} className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("مبلغ")} <span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className='form-input'
                                                id="Price"
                                                name="Price"
                                                decimalsLimit={2}
                                                onChange={(e) => HandlePriceChange(e.target.value)}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.Price && formik.errors.Price ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.Price)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                               
                                <div onFocus={() => {
                                    dateRef2?.current?.closeCalendar();
                                }} className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("شرح سند")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <textarea
                                                rows="8"
                                                className="form-input"
                                                type="text"
                                                id="documentDescribe"
                                                name="documentDescribe"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.documentDescribe}
                                            />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row ">
                               <Kara debtor={karadummyRight} creditor={karadummyLeft} showOtherBtn={true} getData={getData} />
                            </div>
                        </div>


                    </form>
                </div>
            </div>
            <div>
                <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
                    <Button variant="contained" color="success"
                        type="button"
                        onClick={formik.handleSubmit}

                    >
                        {t("ثبت تغییرات")}
                    </Button>

                    <div className="Issuance">
                        <Button variant="contained"
                                onClick={callComponent}
                            color='error'
                           >
                            {t("انصراف")}
                        </Button >
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChequeIssuance;
