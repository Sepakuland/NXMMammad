import { useFormik } from 'formik';
import { React, useEffect, useRef } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-multi-date-picker';
import * as Yup from "yup";
import { useTheme } from '@emotion/react';
import swal from 'sweetalert';
import { julianIntToDate } from "../../../../components/DatePicker/dateConvert";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SelectBox } from 'devextreme-react';
import service2 from './CashDeskData';
import { parsFloatFunction } from '../../../../utils/parsFloatFunction';
import service from '../../Wasted-Cheque/chequeNumber';
import { useState } from 'react';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import fund from "../../PaymentDocumention/RemittancePayable/Issuance/fundList";
import account from "../../PaymentDocumention/RemittancePayable/Issuance/accountSideList";
import DateObject from "react-date-object";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../utils/calenderLang';
import { history } from '../../../../utils/history';
import { Button } from '@mui/material';
import Kara from '../../../../components/SetGrid/Kara';
import { karadummyRight } from '../../../../components/SetGrid/karadummyRight';
import { karadummyLeft } from '../../../../components/SetGrid/karadummyLeft.js';
const Factor = [];
const Issuance = () => {
    const [factor, setFactor] = useState(Factor);
    const { t, i18n } = useTranslation();
    const [alignment, setAlignment] = useState("");
    const theme = useTheme();
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    const [date, setDate] = useState(new DateObject());
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            TransactionCode: Math.floor(Math.random() * 1000),
            TransactionDate: julianIntToDate(new DateObject().toJulianDay()),
            CashDesk: "",
            accountSideList: "",
            Amount: "",
            collector: "",
            DocumentDescription: "",
            Detailed: "",
            moeinAcount: "",
            Remaining: 0,
            show: true,
        },
        show: Yup.boolean(),
        validationSchema: Yup.object({
            CashDesk: Yup.string()
                .required("انتخاب صندوق الزامیست"),
            Amount: Yup.number().typeError("تنها عدد مجاز است").required("انتخاب مبلغ الزامیست"),
            TransactionDate: Yup.date().required("وارد کردن تاریخ الزامی است"),

            accountSideList: Yup.string().when("show", (show) => {
                if (show)
                    return Yup.string().required("نام طرف حساب الزامیست")
            })
        }),
        onSubmit: (values) => {
            console.log("here", values)
            factorSub()
        },
    });
    const factorSub = () => {
        swal({
            title: t("فاکتور با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };
    const [cashDeskData, setCashDeskData] = useState(service2.getCashDeskData())
    const [accountSideList, setAccountSideList] = useState(account.getAccountSideList());
    const [accountPartyData, setAccountPartyData] = useState(service.getChequeNumber())

    const [debtor, setDebtor] = useState([]);
    const [creditor, setCreditor] = useState([]);

    useEffect(()=>{
        if(formik.values.show){
            setDebtor(karadummyRight)
            setCreditor(karadummyLeft)
        }else{
            setDebtor([])
            setCreditor([])
        }
    },[formik.values.show])

    const selectRef = useRef();
    const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
    const [fundList, setFundList] = useState(fund.getFundList());
    const dateRef = useRef();

    useEffect(() => {
        if (formik.values.accountSideList) {
            let current = accountSideList.filter(
                (item) => item.value === formik.values.accountSideList
            )[0];

            formik.setFieldValue("Remaining", current.Balance);
        }
    }, [formik.values.accountSideList]);


    function HandleSalePriceChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('Amount', parsFloatFunction(temp, 2))
    }

    const callComponent = () => {
        history.navigate(`/FinancialTransaction/receiptDocument/Cash/DisplayDetails`);
    }
    function getData(data) {
        console.log('getData data', data)
        formik.setFieldValue('match',data)
    }
    return (
        <>

            <div className='form-template'
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    borderColor: `${theme.palette.divider}`,
                }}
            >

                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-design">
                            <div className="row">
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar();
                                }}>
                                    <div className="title">

                                        <span>{t("کد تراکنش")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="TransactionCode"
                                                name="TransactionCode"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.TransactionCode}
                                                disabled
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تاریخ تراکنش")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            ref={dateRef}
                                            name={"TransactionDate"}
                                            id={"TransactionDate"}
                                            calendarPosition="bottom-right"
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                formik.setFieldValue(
                                                    "TransactionDate",
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
                                        {formik.touched.TransactionDate && formik.errors.TransactionDate &&
                                            !formik.values.TransactionDate ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.TransactionDate)}
                                            </div>
                                        ) : null}
                                    </div>

                                </div>
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
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
                                                placeholder=''
                                                showClearButton
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
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تحصیلدار")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <SelectBox
                                                dataSource={accountPartyData}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                valueExpr="PartnerName"
                                                className='selectBox'
                                                searchEnabled={true}
                                                showClearButton
                                                placeholder=''
                                                noDataText={t("اطلاعات یافت نشد")}
                                                displayExpr={function (item) {
                                                    return item && item.PartnerName;
                                                }}
                                                displayValue='PartnerName'
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('collector', e.value)
                                                    console.log('collector', e.value)
                                                }}
                                            />
                                            {formik.touched.collector && formik.errors.collector ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.collector)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-12 col-12" >
                                    <div className="row d-flex">
                                        <div className="col-xl-auto col-lg-2 col-auto">
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
                                                    formik.setFieldValue('Remaining', '')
                                                    formik.setFieldValue('moeinAcount', '')
                                                    formik.setFieldValue('Detailed', '')
                                                    formik.setFieldValue('accountSideList', '')
                                                    formik.setFieldValue('show', !formik.values.show)
                                                }}
                                            >
                                                <MoreHorizIcon />
                                            </button>
                                        </div>
                                        <div className="col-xl-auto col-lg-10 col-auto flex-grow-1 mb-0">
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
                                                            {formik.touched.accountSideList && formik.errors.accountSideList &&
                                                                !formik.values.accountSideList ? (
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
                                                        {formik.touched.moeinAcount &&
                                                            formik.errors.moeinAcount ? (
                                                            <div className="error-msg">
                                                                {t(formik.errors.moeinAcount)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-sm-6 col-12">
                                                        <div className="title">
                                                            <span>{t("تفضیلی")}</span>
                                                        </div>
                                                        <SelectBox
                                                            dataSource={measurementUnits}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            onValueChanged={(e) =>
                                                                formik.setFieldValue("Detailed", e.value)
                                                            }
                                                            className="selectBox"
                                                            noDataText={t("اطلاعات یافت نشد")}
                                                            itemRender={null}
                                                            placeholder=""
                                                            name="Detailed"
                                                            id="Detailed"
                                                            searchEnabled
                                                            showClearButton
                                                        ></SelectBox>
                                                        {formik.touched.moeinAcount &&
                                                            formik.errors.moeinAcount ? (
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
                                <div className="col-lg-6 col-md-6 col-12">
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
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("مبلغ")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className='form-input'
                                                id="Amount"
                                                name="Amount"
                                                decimalsLimit={2}
                                                onChange={(e) => HandleSalePriceChange(e.target.value)}

                                            />
                                            {formik.touched.Amount && formik.errors.Amount ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.Amount)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("شرح سند")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <textarea
                                                rows="8"
                                                className="form-input"
                                                id="DocumentDescription"
                                                name="DocumentDescription"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.DocumentDescription}
                                            />
                                            {formik.touched.DocumentDescription && formik.errors.DocumentDescription ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.DocumentDescription)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {<div className={`Tatbiq ${formik.values.show&&debtor.length&&creditor.length?'':'d-none'}`}>
                    <Kara debtor={debtor} creditor={creditor} showOtherBtn={true} getData={getData} show={formik.values.show} />
                </div>}
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
                            style={{ marginRight: "5px" }}
                            color='error'
                            onClick={callComponent}>
                            {t("انصراف")}
                        </Button >
                    </div>
                </div>

            </div>

        </>
    )
}

export default Issuance
