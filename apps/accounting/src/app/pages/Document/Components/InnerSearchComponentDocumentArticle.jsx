import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as React from 'react';
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from "react-i18next";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import { definedAccountLookupData, detailedLookupData } from "../../New Document/lookupData";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

export default function InnerSearchDocumentArticle({ getData, closeModal }) {
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const [definedAccountOpen, setDefinedAccountOpen] = useState(false)
    const [detailedOpen, setDetailedOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            definedAccount: "",
            detailed: "",
            debtorStart: "",
            debtorEnd: "",
            creditorStart: "",
            creditorEnd: "",
            articleDescription: "",
        },
        onSubmit: (values) => {
            getData(values)
            closeModal()
        }
    })

    function HandleDebtorStartChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue("debtorStart", parsFloatFunction(temp, 2))
    }

    function HandleDebtorEndChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue("debtorEnd", parsFloatFunction(temp, 2))
    }

    function HandleCreditorStartChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue("creditorStart", parsFloatFunction(temp, 2))
    }

    function HandleCreditorEndChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue("creditorEnd", parsFloatFunction(temp, 2))
    }
    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    border: "none"
                }}
            >
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-design ">
                            <div className="row">
                                <div className="content col-12">
                                    <div className="title">
                                        <span> {t("حساب معین")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <Autocomplete
                                                componentsProps={{
                                                    paper: {
                                                        sx: {
                                                            width: 300,
                                                            maxWidth: '90vw',
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
                                                clearText={t("حذف")} 
                                                forcePopupIcon={false}
                                                id="definedAccount"
                                                name="definedAccount"
                                                open={definedAccountOpen}
                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                options={definedAccountLookupData}
                                                getOptionLabel={option => option.FormersNames}                                                            //          style={{ width: 300 }}
                                                onInputChange={(event, value) => {
                                                    if (value !== "" && event !== null) {
                                                        setDefinedAccountOpen(true)
                                                    }
                                                    else {
                                                        setDefinedAccountOpen(false)
                                                    }
                                                }}
                                                onChange={(event, value) => {
                                                    setDefinedAccountOpen(false)
                                                    formik.setFieldValue("definedAccount", value.Code)
                                                }}
                                                onBlur={(e) => {
                                                    setDefinedAccountOpen(false)
                                                }}
                                                renderInput={params => (
                                                    <TextField {...params} label="" variant="outlined" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-12">
                                    <div className="title">
                                        <span> {t("تفضیلی")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <Autocomplete
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
                                                clearText={t("حذف")} 
                                                forcePopupIcon={false}
                                                id="detailed"
                                                name={"detailed"}
                                                open={detailedOpen}
                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                options={detailedLookupData}
                                                getOptionLabel={option => option.Name}                                                            //          style={{ width: 300 }}
                                                onInputChange={(event, value) => {
                                                    if (value !== "" && event !== null) {
                                                        setDetailedOpen(true)
                                                    }
                                                    else {
                                                        setDetailedOpen(false)
                                                    }
                                                }}
                                                onChange={(event, value) => {
                                                    setDetailedOpen(false)
                                                    formik.setFieldValue("detailed", value.Code)
                                                }}
                                                onBlur={(e) => setDetailedOpen(false)}
                                                renderInput={params => (
                                                    <TextField {...params} label="" variant="outlined" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-sx-6">
                                    <div className="title">
                                        <span> {t("آرتیکل بدهکار از")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className="form-input"
                                                style={{ width: "100%" }}
                                                id="debtorStart"
                                                name="debtorStart"
                                                value={formik.values.debtorStart}
                                                decimalsLimit={2}
                                                onChange={(e) => HandleDebtorStartChange(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-sx-6">
                                    <div className="title">
                                        <span> {t("تا")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className="form-input"
                                                style={{ width: "100%" }}
                                                id="debtorEnd"
                                                name="debtorEnd"
                                                value={formik.values.debtorEnd}
                                                decimalsLimit={2}
                                                onChange={(e) => HandleDebtorEndChange(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-sx-6">
                                    <div className="title">
                                        <span> {t("آرتیکل بستانکار از")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className="form-input"
                                                style={{ width: "100%" }}
                                                id="creditorStart"
                                                name="creditorStart"
                                                value={formik.values.creditorStart}
                                                decimalsLimit={2}
                                                onChange={(e) => HandleCreditorStartChange(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-sx-6">
                                    <div className="title">
                                        <span> {t("تا")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <CurrencyInput
                                                className="form-input"
                                                style={{ width: "100%" }}
                                                id="creditorEnd"
                                                name="creditorEnd"
                                                value={formik.values.creditorEnd}
                                                decimalsLimit={2}
                                                onChange={(e) => HandleCreditorEndChange(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-12">
                                    <div className="title">
                                        <span> {t("شرح آرتیکل")} :</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className="form-input"
                                                name="articleDescription"
                                                type='text'
                                                onChange={formik.handleChange}
                                                value={formik.values.articleDescription}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <Button
                    variant="contained"
                    color={'success'}
                    startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                    style={{ margin: '0 2px' }}
                    onClick={formik.handleSubmit}
                >
                    {t('تایید')}
                </Button>
                <Button
                    variant="contained"
                    color={'error'}
                    startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                    style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                    onClick={() => closeModal()}
                >{t('لغو')}</Button>
            </div>
        </>
    )

}
