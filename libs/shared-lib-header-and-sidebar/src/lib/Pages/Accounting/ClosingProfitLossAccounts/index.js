import React, { useState, useRef, useEffect } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useTheme, Button, Box, IconButton, Modal, CircularProgress, Autocomplete, TextField, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { julianIntToDate, julianIntToDateTime } from "../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../utils/calenderLang";
import { renderCalendarSwitch } from "../../../utils/calenderLang";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import { Link, useNavigate } from "react-router-dom";
import Guid from "devextreme/core/guid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCloseProfitLossAccountsDocumentMutation, useGetNextDocumentNumbersQuery } from "../../../features/slices/accountingDocumentSlice";
import { SelectBox } from "devextreme-react";
import { useGetAllDocumentDefinitionQuery } from "../../../features/slices/DocumentDefinitionSlice";
import { useFetchBranchesQuery } from "../../../features/slices/branchSlice";
import ChooseMoeinAccountModal from "../../../components/Modals/ClosingProfitAndLossAccounts/ChooseMoeinAccountModal";
import { useGetAllProfitAndLossCodingsWithNonZeroBalanceQuery, useSearchCodingQuery } from "../../../features/slices/customerChosenCodingSlice";
import ChooseByDetailedModal from "../../../components/Modals/ClosingProfitAndLossAccounts/ChooseByDetailedModal";
import _ from "lodash";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useSelector } from "react-redux";
import { CreateTableError } from "../../../utils/gridKeyboardNav3";
import { Helmet } from "react-helmet-async";
import { AccountingTitles } from "../../../utils/pageTitles";

export const ClosingProfitLossAccounts = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const NavigateToGrid = () => {
        navigate(`/Accounting/Document`, { replace: false });
    }

    /* -------------------------------------------------------------------------- */

    /* -------------------------- Lodash Helper Methods ------------------------- */
    const PartialArticleComparator = (obj1, obj2) => {
        return obj1.moeinAccountId?.codingId === obj2.moeinAccountId?.codingId &&
            obj1.detailed4Id === obj2.detailed4Id &&
            obj1.detailed5Id === obj2.detailed5Id &&
            obj1.detailed6Id === obj2.detailed6Id
    }

    /* --------------------------- Buttons Above Grids -------------------------- */
    const [openProfitAndLossCodingsModal, setOpenProfitAndLossCodingsModal] = useState(false)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        direction: i18n.dir()
    };
    const getChooseMoeinAccountData = (val) => {
        var newOriginAccounts = val.map(obj => obj.itemData)
            .map(moeinId => {
                return { OriginAccountsGuid: new Guid().valueOf(), moeinAccountId: moeinId, detailed4Id: "~", detailed5Id: "~", detailed6Id: "~" }
            })
        var tempOriginAccounts = formik.values.OriginAccounts.filter(a => a.detailed4Id !== "" || a.detailed5Id !== "" || a.detailed6Id !== "")
        formik.setFieldValue(`OriginAccounts`, [...tempOriginAccounts, newOriginAccounts].flat()).then(() => {
            if (tempOriginAccounts?.length + newOriginAccounts?.length === 0) {
                formik.setFieldValue(`OriginAccounts`, [emptyOriginAccounts])
            }
        })
    }

    const getChooseAllMoeinsWithNonZeroBalance = (val) => {
        var newOriginAccounts = val.map(moeinId => {
            return { OriginAccountsGuid: new Guid().valueOf(), moeinAccountId: moeinId, detailed4Id: "~", detailed5Id: "~", detailed6Id: "~" }
        })
        formik.setFieldValue(`OriginAccounts`, newOriginAccounts).then(() => {
            if (newOriginAccounts?.length === 0) {
                formik.setFieldValue(`OriginAccounts`, [emptyOriginAccounts])
            }
        })
    }

    const [openChooseByDetailedModal, setOpenChooseByDetailedModal] = useState(false)
    const getChooseByDetailedData = (val) => {
        let existingPartialArticles = JSON.parse(JSON.stringify(formik.values.OriginAccounts))
        existingPartialArticles.forEach(element => {
            delete element.OriginAccountsGuid
        });
        var allPartialArticles = [...existingPartialArticles, val].flat()
        var distinctPartialArticles = _.uniqWith(allPartialArticles, _.isEqual)
        var distinctArticlesWithGuid = distinctPartialArticles.map(article => {
            return {
                ...article,
                OriginAccountsGuid: new Guid().valueOf()
            }
        })
        formik.setFieldValue("OriginAccounts", distinctArticlesWithGuid.filter(a => a.moeinAccountId !== '')).then(() => {
            if (formik.values.OriginAccounts.length === 0) {
                formik.setFieldValue("OriginAccounts", [emptyOriginAccounts])
            }
        })
    }

    const transferOriginToDestination = () => {
        let existingDestinationAccounts = formik.values.DestinationAccounts.filter(a => a.moeinAccountId !== '')
        let convertedOriginToDestinationAccounts = formik.values.OriginAccounts.map(origin => {
            return {
                DestinationAccountsGuid: origin.OriginAccountsGuid,
                moeinAccountId: origin.moeinAccountId,
                detailed4Id: origin.detailed4Id,
                detailed5Id: origin.detailed5Id,
                detailed6Id: origin.detailed6Id
            }
        })
        let newDestinationAccounts = [...existingDestinationAccounts, convertedOriginToDestinationAccounts].flat()
        let uniqueDestinationAccounts = _.uniqWith(newDestinationAccounts, PartialArticleComparator)
        formik.setFieldValue("DestinationAccounts", uniqueDestinationAccounts).then(() => {
            formik.setFieldValue("OriginAccounts", [emptyOriginAccounts])
        })
    }
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                              Redux / RTKQuery                              */
    /* -------------------------------------------------------------------------- */
    const [branchDatasource, setBranchDatasource] = useState([])
    const [documentDefinitionDatasource, setDocumentDefinitionDatasource] = useState([])
    const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
    const [nextDocumentNumberParam, setNextDocumentNumberParam] = useState(CreateQueryString({ DocumentDate: [julianIntToDate(new DateObject().toJulianDay()), julianIntToDate(new DateObject().toJulianDay())] }))
    /* --------------------------------- Queries -------------------------------- */
    const [documentNumberPollingInterval, setDocumentNumberPollingInterval] = useState(60000)
    const { data: nextDocumentNumbers = { nextDocumentNumber: 0, nextDailyNumber: 0 }, isFetching: nextDocumentNumberIsFetching, error: nextDocumentNumberError, refetch: documentNumberRefetch }
        = useGetNextDocumentNumbersQuery(nextDocumentNumberParam, {
            skip: fiscalYear === 0,
            pollingInterval: documentNumberPollingInterval,
            refetchOnMountOrArgChange: true
        })
    useEffect(() => {
        if (!nextDocumentNumberIsFetching) {
            formik.setFieldValue('documentNumber', nextDocumentNumbers.nextDocumentNumber)
            formik.setFieldValue('dailyNumber', nextDocumentNumbers.nextDailyNumber)
        }
    }, [nextDocumentNumberIsFetching])

    const { data: documentDefinitionList = [], isFetching: documentDefinitionlistIsFetching, error: documentDefinitionListError } = useGetAllDocumentDefinitionQuery()
    useEffect(() => {
        if (!documentDefinitionlistIsFetching && !documentDefinitionListError) {
            {
                setDocumentDefinitionDatasource(documentDefinitionList.filter(a => a.documentDefinitionId === 2))
            }
        }
    }, [documentDefinitionlistIsFetching])

    const { data: branchList, isFetching: branchlistIsFetching, error: branchListError } = useFetchBranchesQuery()
    useEffect(() => {
        if (!branchlistIsFetching && !branchListError) {
            let displayNames = branchList.map((item) => {
                return {
                    ...item,
                    displayName: item.branchCode + " - " + item.branchName
                }
            })
            setBranchDatasource(displayNames)
        }
    }, [branchlistIsFetching])

    const { data: profitOrLossCodings = [], isFetching: profitOrLossCodingsIsFetching, error: profitOrLossCodingsError, refetch: profitOrLossCodingsRefetch } = useGetAllProfitAndLossCodingsWithNonZeroBalanceQuery(""
        , {
            skip: fiscalYear === 0
        });

    const { data: balanceCodings = [], isFetching: balanceCodingsIsFetching, error: balanceCodingsError } = useSearchCodingQuery(CreateQueryString({ TotalCodingType: 2, CodingLevel: 3 }))

    useEffect(() => {
        documentNumberRefetch()
        profitOrLossCodingsRefetch()
    }, [fiscalYear])

    /* -------------------------------- Mutations ------------------------------- */
    const [closeProfitLossAccountsDocument, closeAccountsResult] = useCloseProfitLossAccountsDocumentMutation()
    useEffect(() => {
        if (closeAccountsResult.status == "fulfilled" && closeAccountsResult.isSuccess) {
            DocumentSub()
        }
        else if (closeAccountsResult.isError) {
            let arr = closeAccountsResult.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }

    }, [closeAccountsResult.status])
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                        Input Grid (Origin Accounts)                        */
    /* -------------------------------------------------------------------------- */

    /* ------------------------- Empty array for formik ------------------------- */
    const emptyOriginAccounts = {
        OriginAccountsGuid: new Guid().valueOf(),
        moeinAccountId: '',
        detailed4Id: "",
        detailed5Id: "",
        detailed6Id: "",
    };

    /* ----------------------------- Row Management ----------------------------- */
    const [originAccountsFocusedRow, setOriginAccountsFocusedRow] = useState(1)
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                      Input Grid (Destination Accounts)                     */
    /* -------------------------------------------------------------------------- */

    /* ------------------------- Empty array for formik ------------------------- */
    const emptyDestinationAccounts = {
        DestinationAccountsGuid: new Guid().valueOf(),
        moeinAccountId: '',
        detailed4Id: "",
        detailed5Id: "",
        detailed6Id: "",
    };

    /* ----------------------------- Row Management ----------------------------- */
    const [destinationAccountsFocusedRow, setDestinationAccountsFocusedRow] = useState(1)
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */

    const formik = useFormik({
        initialValues: {
            documentNumber: '',
            documentNumberChanged: false,
            folioNumber: '',
            subsidiaryNumber: '',
            dailyNumber: '',
            documentDate: julianIntToDateTime(new DateObject().toJulianDay()),
            documentTypeId: 2,
            branchId: '',
            counterMoeinAccountId: '',
            documentDescription: '',
            OriginAccounts: [emptyOriginAccounts],
            DestinationAccounts: [emptyDestinationAccounts],
        },
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: Yup.object({
            documentNumber: Yup.number().required("وارد کردن شماره سند الزامی است"),
            folioNumber: Yup.number().required("وارد کردن شماره عطف الزامی است"),
            dailyNumber: Yup.number().required("وارد کردن شماره روزانه الزامی است"),
            documentDate: Yup.date().required("وارد کردن تاریخ سند الزامی است"),
            documentTypeId: Yup.number().required('نوع سند الزامی است'),
            branchId: Yup.number().required('شعبه الزامی است'),
            counterMoeinAccountId: Yup.number().required('مشخص کردن حساب معین مقابل الزامی است'),
            documentDescription: Yup.string().required("وارد کردن شرح سند الزامی است"),
            DestinationAccounts: Yup.array(
                Yup.object({
                    moeinAccountId: Yup.object().required('حساب معین باید انتخاب گردد').nullable(true),
                })
            )
        }),
        onSubmit: (values) => {
            let submitValues = JSON.parse(JSON.stringify(values))
            delete submitValues.OriginAccounts;
            submitValues.DestinationAccounts.forEach(element => {
                element.moeinAccountId = element.moeinAccountId.codingId
                if (typeof (element.detailed4Id) === "object") {
                    element.detailed4Id = element.detailed4Id?.detailedAccountId.toString()
                }
                if (typeof (element.detailed5Id) === "object") {
                    element.detailed5Id = element.detailed5Id?.detailedAccountId.toString()
                }
                if (typeof (element.detailed6Id) === "object") {
                    element.detailed6Id = element.detailed6Id?.detailedAccountId.toString()
                }
            });
            console.log("submitValues", submitValues)
            closeProfitLossAccountsDocument(submitValues).unwrap()
                .then(() => {
                    NavigateToGrid();
                })
                .catch((error) => {
                    console.error(error)
                })
        },
    });

    const dateRef = useRef();
    const [date, setDate] = useState(new DateObject())

    const [balanceCodingsOpen, setBalanceCodingsOpen] = useState(false)

    /* ------------------------------- SweetAlerts ------------------------------ */
    const DocumentSub = () => {
        swal({
            title: t("سند با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };

    return (
        <>
            <Helmet>
                <title>{t(AccountingTitles.ClosingProfitLossAccounts)}</title>
            </Helmet>
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                    <div
                        className="form-template"
                        style={{
                            backgroundColor: `${theme.palette.background.paper}`,
                            borderColor: `${theme.palette.divider}`,
                            marginBottom: '20px'
                        }}
                    >
                        <div className="form-design">
                            <div className="row">
                                <div className='col-12'>
                                    <div className='title' style={{ fontSize: '12px' }}>{t('شرح سند')}</div>
                                </div>
                                <div className='content col-lg-3 col-md-6 col-12'>
                                    <div className='title'>
                                        <span> {t("شماره سند")} </span>
                                    </div>
                                    <div className='wrapper'>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                id='documentNumber'
                                                name='documentNumber'
                                                onChange={(e) => {
                                                    formik.setFieldValue('documentNumber', e.target.value)
                                                    setDocumentNumberPollingInterval(0)
                                                    formik.setFieldValue('documentNumberChanged', true)
                                                }}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.documentNumber}
                                            />
                                        </div>
                                        {formik.errors.documentNumber && !formik.values.documentNumber ? (
                                            <div className='error-msg'>{t(formik.errors.documentNumber)}</div>) : null}
                                    </div>
                                </div>
                                <div className='content col-lg-3 col-md-6 col-12'>
                                    <div className='title'>
                                        <span> {t("شماره عطف")} </span>
                                    </div>
                                    <div className='wrapper'>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                id='folioNumber'
                                                name='folioNumber'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.folioNumber}
                                                disabled
                                            />
                                        </div>
                                        {formik.errors.folioNumber && !formik.values.folioNumber ? (
                                            <div className='error-msg'>{t(formik.errors.folioNumber)}</div>) : null}
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12">
                                    <div className="title">
                                        <span> {t("شماره فرعی")} </span>
                                    </div>
                                    <div className='wrapper'>
                                        <input
                                            className='form-input'
                                            id='subsidiaryNumber'
                                            name='subsidiaryNumber'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.subsidiaryNumber}
                                        />
                                    </div>
                                </div>
                                <div className='content col-lg-3 col-md-6 col-12' onFocus={() => {
                                    dateRef?.current?.closeCalendar()
                                }}>
                                    <div className='title'>
                                        <span> {t("شماره روزانه")} </span>
                                    </div>
                                    <div className='wrapper'>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                id='dailyNumber'
                                                name='dailyNumber'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.dailyNumber}
                                                disabled
                                            />
                                        </div>
                                        {formik.errors.dailyNumber && !formik.values.dailyNumber ? (
                                            <div className='error-msg'>{t(formik.errors.dailyNumber)}</div>) : null}
                                    </div>
                                </div>
                                <div className='content col-lg-3 col-md-6 col-12'>
                                    <div className='title'>
                                        <span> {t("تاریخ سند")} <span className='star'>*</span></span>
                                    </div>
                                    <div className='wrapper'>
                                        <div className='date-picker position-relative'>
                                            <DatePicker
                                                name="documentDate"
                                                id="documentDate"
                                                ref={dateRef}
                                                editable={false}
                                                value={date}
                                                calendar={renderCalendarSwitch(i18n.language)}
                                                locale={renderCalendarLocaleSwitch(i18n.language)}
                                                calendarPosition="bottom-right"
                                                onBlur={formik.handleBlur}
                                                onChange={val => {
                                                    setDate(val)
                                                    formik.setFieldValue('documentDate', julianIntToDateTime(val.toJulianDay()));
                                                    setNextDocumentNumberParam(CreateQueryString({ DocumentDate: [julianIntToDate(val.toJulianDay()), julianIntToDate(val.toJulianDay())] }))
                                                }}
                                            />
                                            <div
                                                className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                <div
                                                    className='d-flex align-items-center justify-content-center'>
                                                    <CalendarMonthIcon className='calendarButton' /></div>
                                            </div>
                                        </div>
                                        {formik.touched.documentDate && formik.errors.documentDate && !formik.values.documentDate ? (
                                            <div className='error-msg'>{t(formik.errors.documentDate)}</div>) : null}
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar()
                                }}>
                                    <div className="title">
                                        <span> {t("نوع سند")} <span className='star'>*</span> </span>
                                    </div>
                                    <div className='wrapper'>
                                        <div>
                                            <SelectBox
                                                dataSource={documentDefinitionDatasource}
                                                rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                className='selectBox'
                                                noDataText={t("اطلاعات یافت نشد")}
                                                valueExpr="documentDefinitionId"
                                                displayExpr="documentDefinitionName"
                                                itemRender={null}
                                                placeholder=''
                                                name='documentTypeId'
                                                id='documentTypeId'
                                                disabled
                                                value={formik.values.documentTypeId}
                                                showDropDownButton={false}
                                            />
                                        </div>
                                        {formik.errors.documentTypeId && !formik.values.documentDate ? (<div
                                            className='error-msg'>{t(formik.errors.documentTypeId)}</div>) : null}
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12">
                                    <div className="title">
                                        <span> {t("حساب معین مقابل")} </span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <Autocomplete
                                                renderOption={(props, option) => (
                                                    <Box
                                                        component="li" {...props} key={option.codingId}>
                                                        {option.completeCode}-({option.formersNames})
                                                    </Box>
                                                )}
                                                filterOptions={(options, state) => {
                                                    let newOptions = [];
                                                    options.forEach((element) => {
                                                        if (
                                                            element.completeCode.includes(state.inputValue.toLowerCase()) ||
                                                            element.formersNames.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                        )
                                                            newOptions.push(element);
                                                    });
                                                    return newOptions;
                                                }}
                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                componentsProps={{
                                                    paper: {
                                                        sx: {
                                                            width: '100%',
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
                                                        background: '#FFFFFF',
                                                        borderRadius: 0,
                                                        fontSize: '12px',
                                                    }
                                                }
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                id="counterMoeinAccountId"
                                                name={`counterMoeinAccountId`}
                                                open={balanceCodingsOpen}
                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                options={balanceCodings}
                                                getOptionLabel={option => option.completeCode + " - " + option.name}
                                                loading
                                                loadingText={balanceCodingsIsFetching ? <CircularProgress /> : t("اطلاعات یافت نشد")}
                                                onInputChange={(event, value) => {
                                                    if (value !== "" && event !== null) {
                                                        setBalanceCodingsOpen(true)
                                                    } else {
                                                        setBalanceCodingsOpen(false)
                                                    }
                                                }}
                                                onChange={(event, value) => {
                                                    setBalanceCodingsOpen(false)
                                                    formik.setFieldValue(`counterMoeinAccountId`, value.codingId)
                                                }}
                                                onBlur={(e) => setBalanceCodingsOpen(false)}
                                                renderInput={(params) => (
                                                    <div ref={params.InputProps.ref}>
                                                        <input type="text" {...params.inputProps} className="form-input" />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        {formik.touched.counterMoeinAccountId && formik.errors.counterMoeinAccountId && !formik.values.documentDate ? (<div
                                            className='error-msg'>{t(formik.errors.counterMoeinAccountId)}</div>) : null}
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12">
                                    <div className="title">
                                        <span> {t("شعبه")} <span className='star'>*</span> </span>
                                    </div>
                                    <div className='wrapper'>
                                        <div>
                                            <SelectBox
                                                dataSource={branchDatasource}
                                                rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('branchId', e.value)
                                                    var branch = branchDatasource.find(a => a.branchId == e.value)
                                                    formik.setFieldValue('folioNumber', branch.folioNumber + branch.nextFolioNumber)
                                                }}
                                                className='selectBox'
                                                noDataText={t("اطلاعات یافت نشد")}
                                                displayExpr="displayName"
                                                valueExpr="branchId"
                                                itemRender={null}
                                                placeholder=''
                                                name='branchId'
                                                id='branchId'
                                                searchEnabled
                                            />
                                        </div>
                                        {formik.touched.branchId && formik.errors.branchId && !formik.values.branchId ? (<div
                                            className='error-msg'>{t(formik.errors.branchId)}</div>) : null}
                                    </div>
                                </div>
                                <div className="content col-12">
                                    <div className="title">
                                        <span> {t("شرح سند")} </span>
                                    </div>
                                    <div className='wrapper'>
                                        <textarea
                                            className='form-input'
                                            id='documentDescription'
                                            name='documentDescription'
                                            style={{ height: "35px" }}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.documentDescription}
                                        />
                                        {formik.touched.documentDescription && formik.errors.documentDescription && !formik.values.documentDescription ? (<div
                                            className='error-msg'>{t(formik.errors.documentDescription)}</div>) : null}
                                    </div>

                                </div>
                                <div className='col-12'>
                                    <div className='title' style={{ fontSize: '12px' }}>{t('بستن حساب های موقت')}</div>
                                </div>
                                <div className='col-lg-6 col-12'>
                                    <div className='row'>
                                        <div className='content col-6'>
                                            <div className='title mb-0'>
                                                <span className='span'> {t("حساب های مبدا")} :</span>
                                            </div>
                                        </div>
                                        <div className='content col-12'>
                                            {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                            <div className='d-flex justify-content-between'>
                                                <Button
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        setOpenProfitAndLossCodingsModal(true)
                                                    }}
                                                >
                                                    {t("انتخاب معین")}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        setOpenChooseByDetailedModal(true)
                                                    }}
                                                >
                                                    {t("انتخاب با تفضیلی")}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        getChooseAllMoeinsWithNonZeroBalance(profitOrLossCodings.filter(a => a.codingLevel === 3))
                                                    }}
                                                >
                                                    {t("انتخاب تمام معین‌های دارای مانده")}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='content col-lg-12 col-12'>
                                            <div
                                                className={`table-responsive gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>

                                                <table className="table table-bordered ">
                                                    <thead>
                                                        <tr className='text-center'>
                                                            <th>{t("ردیف")}</th>
                                                            <th>{t("معین")}</th>
                                                            <th>{t("تفضیلی")} 4</th>
                                                            <th>{t("تفضیلی")} 5</th>
                                                            <th>{t("تفضیلی")} 6</th>
                                                            <th>{t("حذف")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <FieldArray
                                                            name="OriginAccounts"
                                                            render={({ push, remove }) => (
                                                                <React.Fragment>
                                                                    {formik?.values?.OriginAccounts?.map((OriginAccounts, index) => (
                                                                        <tr
                                                                            style={{ cursor: 'pointer' }}
                                                                            key={OriginAccounts.OriginAccountsGuid}
                                                                            onFocus={(e) => setOriginAccountsFocusedRow(e.target.closest("tr").rowIndex)}
                                                                            className={originAccountsFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                        >
                                                                            <td className='text-center'
                                                                                style={{
                                                                                    verticalAlign: 'middle',
                                                                                    width: '40px'
                                                                                }}>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (OriginAccounts.moeinAccountId) === "object" ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={OriginAccounts.moeinAccountId.completeCode + " - " + OriginAccounts.moeinAccountId.formersNames}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`OriginAccounts.${index}.moeinAccountId`}
                                                                                                name={`OriginAccounts.${index}.moeinAccountId`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.name}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.OriginAccounts[index].moeinAccountId}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`OriginAccounts.${index}.moeinAccountId`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.OriginAccounts[index].moeinAccountId}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (OriginAccounts.detailed4Id) === "object" && OriginAccounts.detailed4Id !== null ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={OriginAccounts.detailed4Id?.detailedAccountCode + " - " + OriginAccounts.detailed4Id?.detailedAccountName}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`OriginAccounts.${index}.detailed4Id`}
                                                                                                name={`OriginAccounts.${index}.detailed4Id`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.detailedAccountName}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.OriginAccounts[index].detailed4Id}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`OriginAccounts.${index}.detailed4Id`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.OriginAccounts[index].detailed4Id}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (OriginAccounts.detailed5Id) === "object" && OriginAccounts.detailed5Id !== null ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={OriginAccounts.detailed5Id?.detailedAccountCode + " - " + OriginAccounts.detailed5Id?.detailedAccountName}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`OriginAccounts.${index}.detailed5Id`}
                                                                                                name={`OriginAccounts.${index}.detailed5Id`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.detailedAccountName}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.OriginAccounts[index].detailed5Id}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`OriginAccounts.${index}.detailed5Id`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.OriginAccounts[index].detailed5Id}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (OriginAccounts.detailed6Id) === "object" && OriginAccounts.detailed6Id !== null ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={OriginAccounts.detailed6Id?.detailedAccountCode + " - " + OriginAccounts.detailed6Id?.detailedAccountName}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`OriginAccounts.${index}.detailed6Id`}
                                                                                                name={`OriginAccounts.${index}.detailed6Id`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.detailedAccountName}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.OriginAccounts[index].detailed6Id}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`OriginAccounts.${index}.detailed6Id`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.OriginAccounts[index].detailed6Id}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{ width: '40px' }}>
                                                                                <input disabled hidden />
                                                                                <IconButton
                                                                                    variant="contained"
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
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6 col-12'>
                                    <div className='row'>
                                        <div className='content col-6'>
                                            <div className='title mb-0'>
                                                <span className='span'> {t("حساب های مقصد")} :</span>
                                            </div>
                                        </div>
                                        <div className='content col-12'>
                                            {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                            <div className='d-flex justify-content-between'>
                                                <Button
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        transferOriginToDestination()
                                                    }}
                                                >
                                                    {t("انتقال از مبدا")}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='content col-lg-12 col-12'>
                                            <div
                                                className={`table-responsive gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>

                                                <table className="table table-bordered ">
                                                    <thead>
                                                        <tr className='text-center'>
                                                            <th>{t("ردیف")}</th>
                                                            <th>{t("معین")}</th>
                                                            <th>{t("تفضیلی")} 4</th>
                                                            <th>{t("تفضیلی")} 5</th>
                                                            <th>{t("تفضیلی")} 6</th>
                                                            <th>{t("حذف")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <FieldArray
                                                            name="DestinationAccounts"
                                                            render={({ push, remove }) => (
                                                                <React.Fragment>
                                                                    {formik?.values?.DestinationAccounts?.map((DestinationAccounts, index) => (
                                                                        <tr
                                                                            style={{ cursor: 'pointer' }}
                                                                            key={DestinationAccounts.DestinationAccountsGuid}
                                                                            onFocus={(e) => setDestinationAccountsFocusedRow(e.target.closest("tr").rowIndex)}
                                                                            className={destinationAccountsFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                        >
                                                                            <td className='text-center'
                                                                                style={{
                                                                                    verticalAlign: 'middle',
                                                                                    width: '40px'
                                                                                }}>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (DestinationAccounts.moeinAccountId) === "object" ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={DestinationAccounts.moeinAccountId.completeCode + " - " + DestinationAccounts.moeinAccountId.formersNames}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`DestinationAccounts.${index}.moeinAccountId`}
                                                                                                name={`DestinationAccounts.${index}.moeinAccountId`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.name}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.DestinationAccounts[index].moeinAccountId}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`DestinationAccounts.${index}.moeinAccountId`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.DestinationAccounts[index].moeinAccountId}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (DestinationAccounts.detailed4Id) === "object" && DestinationAccounts.detailed4Id !== null ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={DestinationAccounts.detailed4Id?.detailedAccountCode + " - " + DestinationAccounts.detailed4Id?.detailedAccountName}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`DestinationAccounts.${index}.detailed4Id`}
                                                                                                name={`DestinationAccounts.${index}.detailed4Id`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.detailedAccountName}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.DestinationAccounts[index].detailed4Id}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`DestinationAccounts.${index}.detailed4Id`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.DestinationAccounts[index].detailed4Id}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (DestinationAccounts.detailed5Id) === "object" && DestinationAccounts.detailed5Id !== null ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={DestinationAccounts.detailed5Id?.detailedAccountCode + " - " + DestinationAccounts.detailed5Id?.detailedAccountName}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`DestinationAccounts.${index}.detailed5Id`}
                                                                                                name={`DestinationAccounts.${index}.detailed5Id`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.detailedAccountName}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.DestinationAccounts[index].detailed5Id}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`DestinationAccounts.${index}.detailed5Id`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.DestinationAccounts[index].detailed5Id}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{
                                                                                width: '160px',
                                                                                minWidth: '100px'
                                                                            }}>
                                                                                {typeof (DestinationAccounts.detailed6Id) === "object" && DestinationAccounts.detailed6Id !== null ?
                                                                                    <div className={`table-autocomplete position-relative`}>
                                                                                        <Tooltip title={DestinationAccounts.detailed6Id?.detailedAccountCode + " - " + DestinationAccounts.detailed6Id?.detailedAccountName}>
                                                                                            <Autocomplete
                                                                                                readOnly
                                                                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                componentsProps={{
                                                                                                    paper: {
                                                                                                        sx: {
                                                                                                            width: '100%',
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
                                                                                                        background: '#FFFFFF',
                                                                                                        borderRadius: 0,
                                                                                                        fontSize: '12px',
                                                                                                    }
                                                                                                }
                                                                                                size="small"
                                                                                                disableClearable={true}
                                                                                                forcePopupIcon={false}
                                                                                                id={`DestinationAccounts.${index}.detailed6Id`}
                                                                                                name={`DestinationAccounts.${index}.detailed6Id`}
                                                                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                options={[]}
                                                                                                getOptionLabel={option => option.detailedAccountName}
                                                                                                renderInput={(params) => (
                                                                                                    <TextField {...params}
                                                                                                        label=""
                                                                                                        variant="outlined" />
                                                                                                )}
                                                                                                value={formik.values.DestinationAccounts[index].detailed6Id}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    : <input
                                                                                        className="form-input"
                                                                                        name={`DestinationAccounts.${index}.detailed6Id`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.DestinationAccounts[index].detailed6Id}
                                                                                        autoComplete="off"
                                                                                        disabled
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td style={{ width: '40px' }}>
                                                                                <IconButton
                                                                                    variant="contained"
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
                                                </table>
                                            </div>
                                            {formik?.errors?.DestinationAccounts?.map((error, index) => (
                                                <p className='error-msg' key={index}>
                                                    {error ? ` ${t("ردیف")} ${index + 1} : ${CreateTableError(error)}` : null}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={`button-pos mt-0 ${i18n.dir()}`}>
                        <Button
                            variant="contained"
                            color="success"
                            type="button"
                            onClick={formik.handleSubmit}
                        >
                            {t("تایید")}
                        </Button>

                        <div className="Issuance">
                            <Button variant="contained"
                                color='error'
                            >
                                <Link to={'/'}>
                                    {t("انصراف")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </FormikProvider>

            <Modal
                open={openProfitAndLossCodingsModal}
                onClose={() => setOpenProfitAndLossCodingsModal(false)}
            >
                <Box sx={style} style={{ maxHeight: "80vw" }}>
                    <ChooseMoeinAccountModal initData={formik.values.OriginAccounts.filter(a => a.detailed4Id === "" && a.detailed5Id === "" && a.detailed6Id === "").map(a => { return a.moeinAccountId })} getData={getChooseMoeinAccountData} closeModal={() => setOpenProfitAndLossCodingsModal(false)} />
                </Box>
            </Modal>

            <Modal
                open={openChooseByDetailedModal}
                onClose={() => setOpenChooseByDetailedModal(false)}
            >
                <Box sx={style}>
                    <ChooseByDetailedModal closeModal={() => setOpenChooseByDetailedModal(false)} getData={getChooseByDetailedData} />
                </Box>
            </Modal>
        </>
    );
};

export default ClosingProfitLossAccounts;
