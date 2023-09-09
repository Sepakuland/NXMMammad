import { Button, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { julianIntToDate } from '../../../../utils/dateConvert';
import { SelectBox } from 'devextreme-react';
import DatePicker from 'react-multi-date-picker';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../utils/calenderLang';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RKGrid, { IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";
import { useLocation } from 'react-router';
import { CreateQueryString } from '../../../../utils/createQueryString';
import { useOfficeReportsQuery, useOfficeReports_ForPrintQuery, useOfficeTotalReportsQuery, useOfficeTotalReports_forPrintQuery } from '../../../../features/slices/accountingDocumentSlice';
import CancelIcon from '@mui/icons-material/HighlightOff';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { useGeneralOfficeReportsQuery, useGeneralOfficeReports_printQuery } from '../../../../features/slices/GeneralDocumentSlice';
import MyFooterSome from './MyFooterSome';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


const OfficeReport = () => {
    const location = useLocation();
    const [search, setSearch] = useSearchParams();
    const { t, i18n } = useTranslation();
    const Reports = [{ id: "1", name: t("دفتر روزنامه") }, { id: "2", name: t("دفتر کل") }]
    const params = new URLSearchParams(location?.search)
    /* ------------------ reset page number when api is changed ----------------- */
    let sp = {}
    const urlParams = new URLSearchParams(location?.search.substring(1));
    sp = Object.fromEntries(urlParams);
    /* -------------------------------------------------------------------------- */
    const obj = Object.fromEntries(params)
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([])
    const [querySearchParams, setQuerySearchParams] = useState("")
    const dateRef = useRef()
    const dateRef2 = useRef()
    const dataRef = useRef();
    const dataRef2 = useRef()
    const totalDataRef = useRef()
    // dataRef.current = data
    const [loading, setLoading] = useState(true)
    const [showDocument, setShowDocument] = useState(false)
    const formik = useFormik({
        initialValues: {
            ReportType: "",
            TotalDocument: false,
            DocumentDate: [null, null],
            DocumentNumber: [],
        },
        validationSchema: Yup.object({
            DocumentNumber: Yup.array().test(
                'Number[0]IsNotLess', "!جستجوی سند با این پارامترها امکان پذیر نیست",
                (item, testContext) => {
                    if (item.length > 0) {
                        return (item?.length > 0 && testContext?.parent?.DocumentNumber[1] >= testContext?.parent?.DocumentNumber[0] )
                    }
                    else {
                        return true
                    }
                }
            )
        }),
        onSubmit: (values) => {
            localStorage.setItem(`ReportType`, JSON.stringify(formik?.values?.ReportType))
            if (!formik?.values?.TotalDocument) {
                if (formik.values.ReportType == 2 && !formik.values.TotalDocument) {
                    setOfficeTotalReportsSkip(false)
                    setOfficeTotalExcelSkip(false)
                    setSkip(true)
                    sp = { size: '1', PageNumber: '1', PageSize: '10' }
                    setSearch(sp)
                    setExcelSkip(true)
                }
                else if (formik.values.ReportType == 1) {
                    setOfficeTotalReportsSkip(true)
                    setOfficeTotalExcelSkip(true)
                    setSkip(false)
                    setExcelSkip(false)
                    sp = { size: '1', PageNumber: '1', PageSize: '10' }
                    setSearch(sp)

                }
            }
            else {

                if (formik.values.ReportType == 1 && formik.values.TotalDocument) {
                    setExcelTotalSkip(false)
                    setTotalSkip(false)
                    setOfficeTotalReportsSkip(true)
                    setOfficeTotalExcelSkip(true)
                    setSkip(true)
                    setExcelSkip(true)
                }


            }
            setShowDocument(true)
            setQuerySearchParams(CreateQueryString(values))
            localStorage.setItem(`searchItems`, JSON.stringify(values))
        },
    });
    const tableError = () => {
        Swal.fire({
            icon: 'error',
            title: t("...خطا"),
            text: t(formik?.errors?.DocumentNumber),
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                                   RK Grid                                  */
    /* -------------------------------------------------------------------------- */
    /* ------------------ get Document Data for office reports ------------------ */

    const [skip, setSkip] = useState(true)
    const { data: AccountDocumentResult = [], isFetching: AccountDocumentIsFetching, currentData: AccountDocumentCurrentData
    } = useOfficeReportsQuery({ query: querySearchParams, obj: obj }, { skip: skip });
    useEffect(() => {
        setLoading(true)
        if (!!AccountDocumentResult?.header) {
            let pagination = JSON.parse(AccountDocumentResult?.header);
            setTotal(pagination.totalCount);
        }
        let temp = AccountDocumentResult?.data?.map((data) => {
            return {
                ...data,
                "Remainder": Math.abs(data?.reminder),
                "recognize": data?.reminder > 0 ? t("بس") : data?.reminder < 0 ? t("بد") : 0
            }
        })
        dataRef.current = temp
        dataRef2.current = []
        totalDataRef.current = []
        setData(temp)
        if (temp?.length >= 0) {
            setLoading(false)
        }

    }, [AccountDocumentIsFetching, location?.search, AccountDocumentCurrentData, AccountDocumentResult?.data, AccountDocumentResult?.header])
    /* --------------------with change fiscalyear reset data -------------------- */
    const fiscalYearId = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
    const preYearIdRef = useRef(fiscalYearId); // Using useRef to store previous fiscalYearId

    useEffect(() => {
        // Check if fiscalYearId has changed
        if (fiscalYearId !== preYearIdRef.current) {
            setShowDocument(false)
        }
        // Update preYearIdRef with the current fiscalYearId
        preYearIdRef.current = fiscalYearId;
    }, [fiscalYearId]);
    /* -------------------------------------------------------------------------- */
    /*                  get Document data for OfficeReport Total                  */
    /* -------------------------------------------------------------------------- */
    const [totalSkip, setTotalSkip] = useState(true)
    const [totalData, setTotalData] = useState([])
    const { data: GeneralDocumentResult = [], isFetching: GeneralDocumentIsFetching, currentData: GeneralDocumentCurrentData
    } = useGeneralOfficeReportsQuery({ query: querySearchParams, obj: obj }, { skip: totalSkip });
    useEffect(() => {
        setLoading(true)
        if (!!GeneralDocumentResult?.header) {
            let pagination = JSON.parse(GeneralDocumentResult?.header);
            setTotal(pagination.totalCount);
        }
        let temp = GeneralDocumentResult?.data?.map((data) => {
            let reminder = data?.credits?.reduce((a, c) => a + c, 0) - data?.debits?.reduce((a, c) => a + c, 0)
            return {
                "documentNumber": data?.generalDocumentNumber,
                "documentDate": data?.generalDocmentDate,
                "totalName": data?.documentDescription,
                "credits": data?.credits?.reduce((acc, current) => acc + current, 0),
                "debits": data?.debits?.reduce((a, c) => a + c, 0),
                "Remainder": Math.abs(reminder),
                "recognize": reminder > 0 ? t("بس") : reminder < 0 ? t("بد") : 0
            }
        })
        setTotalData(temp)
        dataRef2.current = temp
        dataRef.current = []
        totalDataRef.current = []

        if (temp?.length >= 0) {
            setLoading(false)
        }

    }, [location?.search, GeneralDocumentIsFetching, GeneralDocumentCurrentData, GeneralDocumentResult?.data, GeneralDocumentResult?.header])

    /* -------------------------------------------------------------------------- */
    /*                  get document date for OfficeTotalReprots                  */
    /* -------------------------------------------------------------------------- */
    const [officeTotalReportsSkip, setOfficeTotalReportsSkip] = useState(true)
    const [officeTotalReportsData, setOfficeTotalReportsData] = useState([])
    const { data: OfficeTotalReportsResult = [], isFetching: OfficeTotalReportsIsFetching, currentData: OfficeTotalReportsCurrentData }
        = useOfficeTotalReportsQuery({ query: querySearchParams, obj: obj }, { skip: officeTotalReportsSkip })
    useEffect(() => {
        setLoading(true)
        if (!!OfficeTotalReportsResult?.header) {
            let pagination = JSON.parse(OfficeTotalReportsResult?.header);
            setTotal(pagination.totalCount);
        }
        let temp = OfficeTotalReportsResult?.data?.map((data) => {
            return {
                "documentNumber": data?.documentNumber,
                "documentDate": data?.documentDate,
                "totalName": data?.documentDescription,
                "credits": data?.credits,
                "debits": data?.debits,
                "Remainder": Math.abs(data?.reminder),
                "recognize": data?.reminder > 0 ? t("بس") : data?.reminder < 0 ? t("بد") : 0
            }

        })
        totalDataRef.current = temp
        dataRef.current = null
        dataRef2.current = null
        setOfficeTotalReportsData(temp)
        if (temp?.length > 0) {
            setLoading(false)
        }
    }, [OfficeTotalReportsResult?.data, OfficeTotalReportsResult?.header, location?.search, OfficeTotalReportsIsFetching, OfficeTotalReportsCurrentData])
    /* ------------------------------- tempColumn ------------------------------- */
    const CustomFooterSome = (props) => <MyFooterSome {...props} data={dataRef.current} officeTotalData={totalDataRef.current} totalDocumemt={dataRef2.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'documentNumber',
            filterable: true,
            name: "سند",
            filter: 'numeric',
            width: '60px',
        },
        {
            field: 'documentDate',
            cell: DateCell,
            filterable: true,
            name: "تاریخ",
            width: '60px',
            filter: 'numeric',
        },
        {
            field: 'totalName',
            filterable: true,
            name: "شرح",
            width: "70px",
            filter: 'numeric',
        },
        {
            field: 'debits',
            filterable: true,
            name: "بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'credits',
            filterable: true,
            name: "بستانکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },
        {
            field: 'Remainder',
            filterable: true,
            name: "مانده",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'recognize',
            filterable: true,
            name: "تشخیص",
            filter: 'numeric',
            width: '100px',

        },
    ]
    /* -------------------------------------------------------------------------- */
    /*                         clear Button for clear data                        */
    /* -------------------------------------------------------------------------- */
    const handleClearDate = (x) => {
        if (formik.values.DocumentDate[0] && x === "startDate") {
            formik.setFieldValue('DocumentDate[0]', null); // Clear the selected date field
            formik.setFieldValue('DocumentDate[1]', null);
        }
        else {
            formik.setFieldValue('DocumentDate[1]', null);
        }
    };
    /* -------------------------------------------------------------------------- */
    /*                             get Data for excel                             */
    /* -------------------------------------------------------------------------- */
    /* ------------------------------ officeReport ------------------------------ */
    const [excelskip, setExcelSkip] = useState(true)
    const [excelData, setExcelData] = useState([])
    const { data: AccountDocumentExcelResult, isFetching: AccountDocumentExcelIsFetching, currentData: AccountDocumentExcelCurrentData
    } = useOfficeReports_ForPrintQuery({ query: querySearchParams }, { skip: excelskip });
    useEffect(() => {

        let temp = AccountDocumentExcelResult?.data?.map((data) => {
            return {
                ...data,
                "Remainder": Math.abs(data?.reminder),
                "recognize": data?.reminder > 0 ? t("بس") : data?.reminder < 0 ? t("بد") : 0
            }
        })
        localStorage.setItem(`OfficeReportsData`, JSON.stringify(temp))
        setExcelData(temp)

    }, [AccountDocumentExcelIsFetching, AccountDocumentExcelResult?.data, AccountDocumentExcelCurrentData])
    /* ---------------------- office report total document ---------------------- */
    const [excelTotalskip, setExcelTotalSkip] = useState(true)
    const [excelTotalData, setExcelTotalData] = useState([])
    const { data: generalDocumentExcelResult, isFetching: generalDocumentExcelIsFetching, currentData: generalDocumentExcelCurrentData
    } = useGeneralOfficeReports_printQuery({ query: querySearchParams }, { skip: excelTotalskip });
    useEffect(() => {

        let temp = generalDocumentExcelResult?.data?.map((data) => {
            let reminder = data?.credits?.reduce((a, c) => a + c, 0) - data?.debits?.reduce((a, c) => a + c, 0)
            return {
                "documentNumber": data?.generalDocumentNumber,
                "documentDate": data?.generalDocmentDate,
                "totalName": data?.documentDescription,
                "credits": data?.credits?.reduce((acc, current) => acc + current, 0),
                "debits": data?.debits?.reduce((a, c) => a + c, 0),
                "Remainder": Math.abs(reminder),
                "recognize": reminder > 0 ? t("بس") : reminder < 0 ? t("بد") : 0
            }
        })

        localStorage.setItem(`OfficeReportsData`, JSON.stringify(temp))
        setExcelTotalData(temp)

    }, [generalDocumentExcelResult, generalDocumentExcelIsFetching, generalDocumentExcelCurrentData])
    /* --------------------------- office total report -------------------------- */
    const [OfficeTotalExcelskip, setOfficeTotalExcelSkip] = useState(true)
    const [OfficeTotalExcelData, setOfficeTotalExcelData] = useState([])
    const { data: OfficeTotalExcelResult, isFetching: OfficeTotalExcelIsFetching, currentData: OfficeTotalExcelCurrentData
    } = useOfficeTotalReports_forPrintQuery({ query: querySearchParams }, { skip: OfficeTotalExcelskip });
    useEffect(() => {
        let temp = OfficeTotalExcelResult?.data?.map((data) => {
            return {
                "documentNumber": data?.documentNumber,
                "documentDate": data?.documentDate,
                "totalName": data?.documentDescription,
                "credits": data?.credits,
                "debits": data?.debits,
                "Remainder": Math.abs(data?.reminder),
                "recognize": data?.reminder < 0 ? t("بس") : data?.reminder > 0 ? t("بد") : 0,
                "formersName": data?.formersName,
                "completeCode": data?.completeCode
            }
        })

        localStorage.setItem(`OfficeTotalReportsData`, JSON.stringify(temp))
        setOfficeTotalExcelData(temp)

    }, [OfficeTotalExcelResult, OfficeTotalExcelIsFetching, OfficeTotalExcelCurrentData])







    return (
        <>
            <div
                style={{
                    backgroundColor: "rgb(240 243 247)",
                    border: "none",
                    userSelect: "none"
                }}
            >
                <div className='col-lg-12 col-12 col-md-12 form-design' style={{ background: "#f0f3f7" }}>
                    <Paper
                        elevation={2} className="paper-pda"  >
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="content col-lg-3 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("گزارش")}</span>
                                    </div>
                                    <div>
                                        <SelectBox
                                            dataSource={Reports}
                                            rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                            onValueChanged={(e) => {
                                                formik.setFieldValue("ReportType", e.value)
                                                formik.setFieldValue("TotalDocument", false)
                                                setShowDocument(false)
                                            }}
                                            className='selectBox'
                                            noDataText={t('اطلاعات یافت نشد')}
                                            itemRender={null}
                                            displayExpr="name"
                                            valueExpr="id"
                                            placeholder={''}
                                            name='ReportType'
                                            id='ReportType'
                                            searchEnabled
                                        />
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>‌</span>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div className="checkbox-label mt-0">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => {
                                                            console.log("eeeeeeeeeeeeeee", e.target.checked)
                                                            formik.setFieldValue("TotalDocument", e.target.checked)
                                                            setShowDocument(false)
                                                        }}
                                                        checked={formik.values.TotalDocument}
                                                        name={`TotalDocument`}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                sx={{ margin: '0' }}
                                                label={
                                                    <Typography variant="title" style={{ fontWeight: "bold", fontSize: "11px", color: "#000000" }}>
                                                        {t("در سطح سند کل")}
                                                    </Typography>
                                                }
                                                onChange={() => {
                                                    setShowDocument(false)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="content col-lg-3 col-md-6 col-12" onFocus={() => {
                                    dateRef2?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("از تاریخ")}</span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            name={"startDate"}
                                            id={"startDate"}
                                            ref={dateRef}
                                            editable={false}
                                            clearIcon={true}
                                            value={formik.values.DocumentDate[0] !== null ? new Date(formik.values.DocumentDate[0]) : ""}
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                formik.setFieldValue(
                                                    `DocumentDate[0]`,
                                                    julianIntToDate(val.toJulianDay())
                                                );
                                                setShowDocument(false)
                                            }}
                                        />
                                        <div
                                            className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'>
                                                {formik.values.DocumentDate[0] ?
                                                    <button type="button" className='clearButton'
                                                        onClick={(e) => {
                                                            handleClearDate("startDate")
                                                        }}>
                                                        <CancelIcon />
                                                    </button> : " "
                                                }
                                                <CalendarMonthIcon className='calendarButton' /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تا")}</span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            name={"endDate"}
                                            id={"endDate"}
                                            ref={dateRef2}
                                            editable={false}
                                            value={formik.values.DocumentDate[1] !== null ? new Date(formik.values.DocumentDate[1]) : ""}
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            disabled={!formik.values.DocumentDate[0]}
                                            minDate={new Date(formik.values.DocumentDate[0])}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                formik.setFieldValue(
                                                    "DocumentDate[1]",
                                                    julianIntToDate(val.toJulianDay())
                                                );
                                                setShowDocument(false)
                                            }}
                                        />
                                        <div
                                            className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'>
                                                {formik.values.DocumentDate[1] ?
                                                    <button type="button" className='clearButton'
                                                        onClick={() => {
                                                            handleClearDate("endDate")
                                                        }}>
                                                        <CancelIcon />
                                                    </button> : " "
                                                }
                                                <CalendarMonthIcon className='calendarButton' /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12" onFocus={() => {
                                    dateRef2?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("از سند")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <input
                                            className="form-input"
                                            type="number"
                                            id="DocumentNumber[0]"
                                            name="DocumentNumber[0]"
                                            style={{ width: "100%" }}
                                            onChange={() => {
                                                setShowDocument(false)
                                                formik.handleChange()
                                            }}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.DocumentNumber[0]}
                                        />
                                    </div>
                                </div>
                                <div className="content col-lg-3 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تا سند")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <input
                                            className="form-input"
                                            type="number"
                                            id="DocumentNumber[1]"
                                            name="DocumentNumber[1]"
                                            style={{ width: "100%" }}
                                            onChange={() => {
                                                formik.handleChange()
                                                setShowDocument(false)
                                            }}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.DocumentNumber[1]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex justify-content-center' style={{ margin: "10px 0px" }}>
                                <Button
                                    onClick={() => {
                                        if (formik?.errors?.DocumentNumber) {
                                            tableError()
                                        }
                                        formik.handleSubmit()
                                    }}
                                    disabled={!formik.values.ReportType}
                                    variant='contained'
                                    className='show_btn'
                                    color='primary'
                                >{t("نمایش اسناد")}</Button>
                            </div>
                            {console.log("formik.values.ReportType == 2 && formik.values.TotalDocument == true", formik.values.ReportType == 2 && formik.values.TotalDocument)}
                        </form>
                    </Paper>
                </div>
                {showDocument ?

                    <div className='col-lg-12 col-12 col-md-12 form-design' style={{ background: "#f0f3f7" }}>
                        <Paper elevation={2} className="paper-pda">
                            {console.log("formik.values.ReportType == 2", formik.values.ReportType)}
                            <div className="col-lg-12 col-md-12 col-12">
                                <RKGrid
                                    loading={loading}
                                    gridId={'OfficeReport'}
                                    gridData={formik.values.TotalDocument ? totalData : formik.values.ReportType == 2 ? officeTotalReportsData : data}
                                    excelData={formik?.values?.TotalDocument ? excelTotalData : formik.values.ReportType == 2 ? OfficeTotalExcelData : excelData}
                                    columnList={tempColumn}
                                    showSetting={true}
                                    showExcelExport={true}
                                    showChart={false}
                                    showPrint={true}
                                    rowCount={10}
                                    sortable={true}
                                    pageable={true}
                                    reorderable={true}
                                    selectable={false}
                                    selectionMode={'single'}
                                    total={total}
                                    selectKeyField={'DocumentCode'}
                                    excelFileNam={t("صورت خلاصه تنخواه")}
                                />
                            </div>
                        </Paper>
                    </div> : null}

            </div >

        </>
    )
}

export default OfficeReport
