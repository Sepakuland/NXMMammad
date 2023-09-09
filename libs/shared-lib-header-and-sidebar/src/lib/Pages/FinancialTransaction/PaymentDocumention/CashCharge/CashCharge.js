import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import DatePicker from "react-multi-date-picker";
import { julianIntToDate } from "../../../../components/DatePicker/dateConvert";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bankService from '../../../FinancialTransaction/PaymentDocumention/CashCharge/bankData';
import cashService from '../../../FinancialTransaction/PaymentDocumention/CashCharge/cashData';
import salaryService from '../../../FinancialTransaction/PaymentDocumention/CashCharge/salaryData';
import { renderCalendarSwitch, renderCalendarLocaleSwitch } from '../../../../utils/calenderLang'
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import DateObject from "react-date-object";
import CurrencyInput from 'react-currency-input-field';
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import { history } from "../../../../utils/history";


const Factor = [];

export const Cashcharge = () => {
    const { t, i18n } = useTranslation();
    const [alignment, setAlignment] = React.useState("");
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const dateRef = useRef()

    const theme = useTheme();
    const [factor, setFactor] = React.useState(Factor);
    const [bankData, setBankData] = React.useState(bankService.getBankData())
    const [cashData, setCashData] = React.useState(cashService.getCashData())
    const [salaryData, setSalaryData] = React.useState(salaryService.getSalaryData())
    const [date, setDate] = useState(new DateObject())
    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 1000),
            documentCode: "6",
            documentDate: julianIntToDate(new DateObject().toJulianDay()),
            type: "Bank",
            bankAccount: "",
            inventory: "",
            cash: "",
            originCash: "",
            salary: "",
            cashInventory: "",
            amount: "0",
            documentDescription: "",
        },

        validationSchema: Yup.object({

            type: Yup.string
                (),

            bankAccount: Yup.string()
                .when("type", (type) => {
                    if (type === "Bank")
                        return Yup.string().required("حساب بانکی الزامیست")
                }),

            originCash: Yup.string()
                .when("type", (type) => {
                    if (type === "Cash")
                        return Yup.string().required("صندوق مبدا الزامیست")
                }),

            salary: Yup.string()
                .when("type", (type) => {
                    if (type === "Salary")
                        return Yup.string().required("تنخواه الزامیست")
                }),

            cash: Yup.string()
                .required(() => {
                    return (
                        "صندوق الزامیست"
                    )
                }),

            amount: Yup.number()
                .typeError("تنها عدد مجاز است"),

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



    const [selectVal, setSelectVal] = useState()
    const selectRef = useRef()
    let inputUi = selectRef?.current?._instance?._$textEditorInputContainer[0]?.querySelector('input')

    useEffect(() => {
        if (formik.values.bankAccount) {
            let current = bankData.filter(item => item.value === formik.values.bankAccount)[0]

            formik.setFieldValue('inventory', current.BankAccountNumber)

        }

    }, [formik.values.bankAccount])

    useEffect(() => {
        if (formik.values.originCash) {
            let current = cashData.filter(item => item.value === formik.values.originCash)[0]

            formik.setFieldValue('inventory', current.Price)

        }

    }, [formik.values.originCash])

    useEffect(() => {
        if (formik.values.salary) {
            let current = salaryData.filter(item => item.value === formik.values.salary)[0]

            formik.setFieldValue('inventory', current.Price)

        }

    }, [formik.values.salary])

    useEffect(() => {
        if (formik.values.cash) {
            let current = cashData.filter(item => item.value === formik.values.cash)[0]

            formik.setFieldValue('cashInventory', current.Price)

        }

    }, [formik.values.cash])

    function HandleSalePriceChange1(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('amount', parsFloatFunction(temp, 2))
    }

    const callComponent = () => {
        history.navigate(
            `/FinancialTransaction/PaymentDocument/CashCharge/DisplayDetails`,
            "noopener,noreferrer"
        );
    };
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
                            <div className="row ">
                                <div className="col-lg-12 col-12">
                                    <div className="row">

                                        <div className="content col-lg-6 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                            <div className="title">

                                                <span>{t("کد سند")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        id="documentCode"
                                                        name="documentCode"
                                                        style={{ width: "100%" }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.documentCode}
                                                        disabled
                                                    />
                                                    {formik.touched.documentCode && formik.errors.documentCode ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.documentCode)}
                                                        </div>
                                                    ) : null}
                                                </div>

                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">
                                                <span>{t("تاریخ سند")}</span>
                                            </div>
                                            <div className="wrapper date-picker position-relative">
                                                <DatePicker
                                                    name={"documentDate"}
                                                    id={"documentDate"}
                                                    editable={false}
                                                    ref={dateRef}
                                                    value={date}
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(val) => {
                                                        formik.setFieldValue(
                                                            "documentDate",
                                                            julianIntToDate(val.toJulianDay())
                                                        );
                                                    }}
                                                />
                                                <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                    <div className='d-flex align-items-center justify-content-center'>
                                                        <CalendarMonthIcon className='calendarButton' />
                                                    </div>
                                                </div>
                                            </div>
                                            {formik.touched.documentDate && formik.errors.documentDate &&
                                                !formik.values.documentDate ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.documentDate)}
                                                </div>
                                            ) : null}

                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                            <div className="title">

                                                <span>{t("نوع")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <RadioGroup
                                                        name="pie-field"
                                                        defaultValue={formik.values.type}
                                                        row
                                                        onChange={(val) => {
                                                            formik.setFieldValue(
                                                                "type",
                                                                val.target.defaultValue
                                                            );
                                                            formik.setFieldValue('bankAccount', '')
                                                            formik.setFieldValue('originCash', '')
                                                            formik.setFieldValue('salary', '')
                                                            formik.setFieldValue('inventory', '')
                                                        }}
                                                        className={i18n.dir() === 'rtl' ? 'rtl-radio-group' : ''}
                                                    >
                                                        <FormControlLabel
                                                            value="Bank"
                                                            control={<Radio />}
                                                            label={t("بانک")}
                                                        />
                                                        <FormControlLabel
                                                            value="Cash"
                                                            control={<Radio />}
                                                            label={t("صندوق")}
                                                        />
                                                        <FormControlLabel
                                                            value="Salary"
                                                            control={<Radio />}
                                                            label={t("تنخواه")}
                                                        />
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12"></div>
                                        {formik.values.type == "Bank" &&
                                            <div className="content col-lg-6 col-md-6 col-12">
                                                <div className="title">

                                                    <span>{t("حساب بانکی")}<span className="star">*</span></span>
                                                </div>
                                                <div className="wrapper">
                                                    <div>
                                                        <SelectBox
                                                            ref={selectRef}
                                                            dataSource={bankData}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            valueExpr="value"
                                                            className='selectBox'
                                                            noDataText='اطلاعات یافت نشد'
                                                            placeholder=""
                                                            searchEnabled={true}
                                                            displayExpr={function (item) {
                                                                return item && item.value + '- ' + item.Name;
                                                            }}
                                                            displayValue='value'
                                                            onValueChanged={(e) => {
                                                                formik.setFieldValue('bankAccount', e.value)
                                                            }}
                                                        />
                                                        {formik.touched.bankAccount && formik.errors.bankAccount &&
                                                            !formik.values.bankAccount ? (
                                                            <div className='error-msg'>
                                                                {t(formik.errors.bankAccount)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {formik.values.type == "Cash" &&
                                            <div className="content col-lg-6 col-md-6 col-12">
                                                <div className="title">

                                                    <span>{t("صندوق مبدا")}<span className="star">*</span></span>
                                                </div>
                                                <div className="wrapper">
                                                    <div>
                                                        <SelectBox
                                                            ref={selectRef}
                                                            dataSource={cashData}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            valueExpr="value"
                                                            className='selectBox'
                                                            noDataText='اطلاعات یافت نشد'
                                                            placeholder=""
                                                            searchEnabled={true}
                                                            displayExpr={function (item) {
                                                                return item && item.value + '- ' + item.Name;
                                                            }}
                                                            displayValue='value'
                                                            onValueChanged={(e) => {
                                                                formik.setFieldValue('originCash', e.value)
                                                            }}
                                                        />
                                                        {formik.touched.originCash && formik.errors.originCash &&
                                                            !formik.values.originCash ? (
                                                            <div className='error-msg'>
                                                                {t(formik.errors.originCash)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {formik.values.type == "Salary" &&
                                            <div className="content col-lg-6 col-md-6 col-12">
                                                <div className="title">

                                                    <span>{t("تنخواه")}<span className="star">*</span></span>
                                                </div>
                                                <div className="wrapper">
                                                    <div>
                                                        <SelectBox
                                                            ref={selectRef}
                                                            dataSource={salaryData}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            valueExpr="value"
                                                            className='selectBox'
                                                            noDataText='اطلاعات یافت نشد'
                                                            placeholder=""
                                                            searchEnabled={true}
                                                            displayExpr={function (item) {
                                                                return item && item.value + '- ' + item.Name;
                                                            }}
                                                            displayValue='value'
                                                            onValueChanged={(e) => {
                                                                formik.setFieldValue('salary', e.value)
                                                            }}
                                                        />
                                                        {formik.touched.salary && formik.errors.salary &&
                                                            !formik.values.salary ? (
                                                            <div className='error-msg'>
                                                                {t(formik.errors.salary)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">

                                                <span>{t("موجودی")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <CurrencyInput
                                                        className='form-input'
                                                        id="inventory"
                                                        name="inventory"
                                                        decimalsLimit={2}
                                                        value={formik.values.inventory}
                                                        disabled
                                                        onChange={(e) => HandleSalePriceChange1(e.target.value)}
                                                    />
                                                    {formik.touched.inventory && formik.errors.inventory ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.inventory)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">

                                                <span>{t("صندوق")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        ref={selectRef}
                                                        dataSource={cashData}
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        valueExpr="value"
                                                        className='selectBox'
                                                        noDataText='اطلاعات یافت نشد'
                                                        placeholder=""
                                                        searchEnabled={true}
                                                        displayExpr={function (item) {
                                                            return item && item.value + '- ' + item.Name;
                                                        }}
                                                        displayValue='value'
                                                        onValueChanged={(e) => {
                                                            formik.setFieldValue('cash', e.value)
                                                        }}
                                                    />
                                                    {formik.touched.cash && formik.errors.cash &&
                                                        !formik.values.cash ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.cash)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">

                                                <span>{t("موجودی")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <CurrencyInput
                                                        className='form-input'
                                                        id="cashInventory"
                                                        name="cashInventory"
                                                        decimalsLimit={2}
                                                        value={formik.values.cashInventory}
                                                        disabled
                                                        onChange={(e) => HandleSalePriceChange1(e.target.value)}
                                                    />
                                                    {formik.touched.cashInventory && formik.errors.cashInventory ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.cashInventory)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">

                                                <span>{t("مبلغ")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <CurrencyInput
                                                        className='form-input'
                                                        id="amount"
                                                        name="amount"
                                                        decimalsLimit={2}
                                                        onChange={(e) => HandleSalePriceChange1(e.target.value)}
                                                    />

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
                                                        id="documentDescription"
                                                        name="documentDescription"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.documentDescription}
                                                    />
                                                    {formik.touched.documentDescription && formik.errors.documentDescription ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.documentDescription)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
                <Button
                    variant="contained"
                    color="success"
                    type="button"
                    onClick={formik.handleSubmit}
                >
                    {t("ثبت تغییرات")}
                </Button>

                <div className="Issuance">
                    <Button variant="contained" color="error" onClick={callComponent}>
                        {t("انصراف")}
                    </Button>
                </div>
            </div>

        </>
    );
};

export default Cashcharge;