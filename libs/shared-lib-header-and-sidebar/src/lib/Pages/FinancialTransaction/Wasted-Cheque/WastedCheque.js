import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import service from '../../FinancialTransaction/Wasted-Cheque/chequeNumber';
import { parsFloatFunction } from '../../../utils/parsFloatFunction'
import CurrencyInput from 'react-currency-input-field';
import { history } from "../../../utils/history";

const Factor = [];

export const WastedCheque = () => {
    const { t, i18n } = useTranslation();
    const [alignment, setAlignment] = React.useState("");
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    function HandleSalePriceChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('salePrice', parsFloatFunction(temp, 2))
    }

    const theme = useTheme();
    const [factor, setFactor] = React.useState(Factor);
    const [chequeNumbers, setChequeNumber] = React.useState(service.getChequeNumber())
    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 1000),
            chequeSelection: "",
            chequeNumber: "",
            accountParty: "",
            chequeAmount: "",
            reason: "",
        },

        validationSchema: Yup.object({
            chequeSelection: Yup.string()
                .required(() => {
                    return ("انتخاب چک الزامیست")
                }),
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

    useEffect(() => {
        if (formik.values.chequeSelection) {
            let current = chequeNumbers.filter(item => item.value === formik.values.chequeSelection)[0]

            formik.setFieldValue('chequeNumber', current.value)
            formik.setFieldValue('chequeAmount', current.ChequePrice)
            formik.setFieldValue('accountParty', current.PartnerName)


        }

    }, [formik.values.chequeSelection])

    function HandleSalePriceChange1(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('chequeAmount', parsFloatFunction(temp, 2))
    }


    console.log(formik.values)

    const callComponent = () => {
        history.navigate(
            `/FinancialTransaction/wastedCheque/DisplayDetails`,
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
                            <div className="row">
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("انتخاب چک")} <span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <SelectBox
                                                dataSource={chequeNumbers}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                valueExpr="value"
                                                className='selectBox'
                                                searchEnabled={true}
                                                placeholder=''
                                                noDataText={t("اطلاعات یافت نشد")}
                                                displayExpr={function (item) {
                                                    return item && item.value + '- ' + item.PartnerName;
                                                }}
                                                displayValue='value'
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('chequeSelection', e.value)
                                                }}
                                            />
                                            {formik.touched.chequeSelection && formik.errors.chequeSelection &&
                                                !formik.values.chequeSelection ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.chequeSelection)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">

                                        <span>{t("شماره چک")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="chequeNumber"
                                                name="chequeNumber"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.chequeNumber}
                                                disabled
                                            />
                                            {formik.touched.chequeNumber && formik.errors.chequeNumber ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.chequeNumber)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">

                                        <span>{t("طرف حساب")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="accountParty"
                                                name="accountParty"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.accountParty}
                                                disabled
                                            />
                                            {formik.touched.accountParty && formik.errors.accountParty ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.accountParty)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>
                                </div>

                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">

                                        <span>{t("مبلغ چک")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className='form-input'
                                                style={{ width: "100%" }}
                                                id="salePrice"
                                                name="salePrice"
                                                decimalsLimit={2}
                                                onChange={(e) => HandleSalePriceChange(e.target.value)}
                                            />
                                            {formik.touched.chequeAmount && formik.errors.chequeAmount ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.chequeAmount)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("دلیل")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <textarea
                                                rows="8"
                                                className="form-input"
                                                id="reason"
                                                name="reason"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.reason}
                                            />
                                            {formik.touched.reason && formik.errors.reason ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.reason)}
                                                </div>
                                            ) : null}
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

export default WastedCheque;