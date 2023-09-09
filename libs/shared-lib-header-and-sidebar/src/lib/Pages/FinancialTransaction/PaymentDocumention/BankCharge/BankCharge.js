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
import bankService from '../../../FinancialTransaction/PaymentDocumention/BankCharge/bankData';
import cashService from '../../../FinancialTransaction/PaymentDocumention/BankCharge/cashData';
import { renderCalendarSwitch, renderCalendarLocaleSwitch } from '../../../../utils/calenderLang'
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import CurrencyInput from 'react-currency-input-field';
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import DateObject from "react-date-object";
import { history } from "../../../../utils/history";

const Factor = [];

export const BankCharge = () => {
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
    const [date, setDate] = useState(new DateObject())
    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 1000),
            documentCode: "80",
            documentDate: julianIntToDate(new DateObject().toJulianDay()),
            originBankAccount: "",
            type: "Bank",
            bankAccount: "",
            inventory: "",
            cash: "",
            bankSlipNumber: "",
            bankAccountInventory: "",
            amount: "0",
            documentDescription: "",
        },

        validationSchema: Yup.object({

            type: Yup.string
                (),

            originBankAccount: Yup.string()
                .when("type", (type) => {
                    if (type === "Bank")
                        return Yup.string().required("حساب بانکی مبدا الزامیست")
                }),

            cash: Yup.string()
                .when("type", (type) => {
                    if (type === "Cash")
                        return Yup.string().required("صندوق الزامیست")
                }),

            bankAccount: Yup.string()
                .required(() => {
                    return ("حساب بانکی الزامیست")
                }),
            bankSlipNumber: Yup.number()
                .typeError("تنها عدد مجاز است")
                .required(() => {
                    return (
                        "فیش بانکی الزامیست"
                    )
                }),

            amount: Yup.number()
                .typeError("تنها عدد مجاز است")
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
        if (formik.values.originBankAccount) {
            let current = bankData.filter(item => item.value === formik.values.originBankAccount)[0]

            formik.setFieldValue('inventory', current.BankAccountNumber)

        }

    }, [formik.values.originBankAccount])

    useEffect(() => {
        if (formik.values.cash) {
            let current = cashData.filter(item => item.value === formik.values.cash)[0]

            formik.setFieldValue('inventory', current.Price)

        }

    }, [formik.values.cash])

    useEffect(() => {
        if (formik.values.bankAccount) {
            let current = bankData.filter(item => item.value === formik.values.bankAccount)[0]

            formik.setFieldValue('bankAccountInventory', current.BankAccountNumber)

        }

    }, [formik.values.bankAccount])

    function HandleSalePriceChange1(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('amount', parsFloatFunction(temp, 2))
    }
    const callComponent = () => {
        history.navigate(
            `/FinancialTransaction/PaymentDocument/BankCharge/DisplayDetails`,
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
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    value={date}
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
                                                            formik.setFieldValue('originBankAccount', '')
                                                            formik.setFieldValue('cash', '')
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
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12"></div>
                                        {formik.values.type == "Bank" &&
                                            <div className="content col-lg-6 col-md-6 col-12">
                                                <div className="title">

                                                    <span>{t("حساب بانکی مبدا")}<span className="star">*</span></span>
                                                </div>
                                                <div className="wrapper">
                                                    <div>
                                                        <SelectBox
                                                            ref={selectRef}
                                                            dataSource={bankData}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            valueExpr="value"
                                                            className='selectBox'
                                                            placeholder=""
                                                            noDataText='اطلاعات یافت نشد'
                                                            searchEnabled={true}
                                                            displayExpr={function (item) {
                                                                return item && item.value + '- ' + item.Name;
                                                            }}
                                                            displayValue='value'
                                                            onValueChanged={(e) => {
                                                                formik.setFieldValue('originBankAccount', e.value)
                                                            }}
                                                        />
                                                        {formik.touched.originBankAccount && formik.errors.originBankAccount &&
                                                            !formik.values.originBankAccount ? (
                                                            <div className='error-msg'>
                                                                {t(formik.errors.originBankAccount)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {formik.values.type == "Cash" &&
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
                                                            placeholder=""
                                                            noDataText='اطلاعات یافت نشد'
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

                                                <span>{t("حساب بانکی")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        ref={selectRef}
                                                        dataSource={bankData}
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        valueExpr="value"
                                                        placeholder=""
                                                        className='selectBox'
                                                        noDataText='اطلاعات یافت نشد'
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
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">

                                                <span>{t("موجودی")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <CurrencyInput
                                                        className='form-input'
                                                        id="bankAccountInventory"
                                                        name="bankAccountInventory"
                                                        decimalsLimit={2}
                                                        value={formik.values.bankAccountInventory}
                                                        disabled
                                                        onChange={(e) => HandleSalePriceChange1(e.target.value)}
                                                    />
                                                    {formik.touched.bankAccountInventory && formik.errors.bankAccountInventory ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.bankAccountInventory)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">

                                                <span>{t("شماره فیش بانکی")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        id="bankSlipNumber"
                                                        name="bankSlipNumber"
                                                        style={{ width: "100%" }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.bankSlipNumber}
                                                    />
                                                    {formik.touched.bankSlipNumber && formik.errors.bankSlipNumber ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.bankSlipNumber)}
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
            <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`}>
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

export default BankCharge;