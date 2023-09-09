import { React, useEffect, useRef, useState } from "react";
import { useTheme, Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Formik, useFormik } from "formik";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import { julianIntToDate } from "../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../utils/calenderLang";
import { renderCalendarSwitch } from '../../../utils/calenderLang'
import { SelectBox } from "devextreme-react";
import DateObject from "react-date-object";
import { Link } from "react-router-dom";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetAllAccountingDocumentQuery, useGetFirstGeneralizableDocumentQuery } from "../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useCreateGeneralDocumentMutation } from "../../../features/slices/GeneralDocumentSlice";
import { LoadingButton } from "@mui/lab";
import { AccountingTitles } from "../../../utils/pageTitles";
import { Helmet } from "react-helmet-async";


const NewGeneralDocument = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location?.search)
    const obj = Object.fromEntries(params)
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                  RTKQuery                                  */
    /* -------------------------------------------------------------------------- */

    /* --------------------------------- Queries -------------------------------- */
    const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
    const { data: firstGeneralizableDocument = null, isFetching: firstGeneralizableDocumentIsFetching, error: firstGeneralizableDocumentError, refetch: firstGeneralizableDocumentRefetch } = useGetFirstGeneralizableDocumentQuery("", {
        skip: fiscalYear === 0
    })
    const [accountingDocumentQueryString, setAccountingDocumentQueryString] = useState(null)
    const [accountingDocumentSkip, setAccountingDocumentSkip] = useState(true)
    const [content, setContent] = useState("")
    const {
        data: accountingDocumentResult,
        isFetching: accountingDocumentIsFetching,
        error: accountingDocumentError,
    } = useGetAllAccountingDocumentQuery({ obj: obj, query: accountingDocumentQueryString }
        , {
            skip: fiscalYear === 0 || accountingDocumentSkip
        });

    /* -------------------------------- Mutations ------------------------------- */
    const [createGeneralDocument, createResults] = useCreateGeneralDocumentMutation()
    useEffect(() => {
        if (createResults.status == "fulfilled" && createResults.isSuccess) {
            DocumentSub()
        }
        else if (createResults.isError) {
            let arr = createResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }
    }, [createResults.status])
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const selectionModeList = [{ title: t('تاریخ'), value: "date" }, { title: t('شماره سند'), value: "number" },]
    const dateRef1 = useRef()
    const dateRef2 = useRef()

    useEffect(() => {
        if (!firstGeneralizableDocumentIsFetching && !firstGeneralizableDocumentError && firstGeneralizableDocument !== null) {
            generalDocumentFormik.setFieldValue("startDate", julianIntToDate(new DateObject(firstGeneralizableDocument.documentDate).toJulianDay()))
            accountingDocumentSearchFormik.setFieldValue("DocumentDate[0]", firstGeneralizableDocument.documentDate)
            generalDocumentFormik.setFieldValue("startDocumentNumber", firstGeneralizableDocument.documentNumber)
            generalDocumentFormik.setFieldValue("endDocumentNumber", firstGeneralizableDocument.documentNumber)
            accountingDocumentSearchFormik.setFieldValue("documentNumber[0]", firstGeneralizableDocument.documentNumber)
        }
    }, [firstGeneralizableDocumentIsFetching, firstGeneralizableDocumentError]);

    const accountingDocumentSearchFormik = useFormik({
        initialValues: {
            DocumentState: 2,
            documentNumber: [],
            DocumentDate: [
                null, null
            ]
        },

        onSubmit: (values) => {
            var temp = JSON.parse(JSON.stringify(values))
            if (generalDocumentFormik.values.selectionMode === "date") {
                temp.DocumentDate[0] = temp.DocumentDate[0].split("T")[0];
                temp.documentNumber = []
            }
            else {
                temp.DocumentDate = []
            }
            setAccountingDocumentQueryString(CreateQueryString(temp))
            setAccountingDocumentSkip(CreateQueryString(temp) === "")
            setShowDocuments(true)
        },
    });
    const generalDocumentFormik = useFormik({
        initialValues: {
            selectionMode: "date",
            startDate: "",
            endDate: "",
            startDocumentNumber: 0,
            endDocumentNumber: 0,
            documentDescription: ""
        },

        onSubmit: (values) => {
            createGeneralDocument(values).unwrap()
                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    setData([])
                    setShowDocuments(false)
                    generalDocumentFormik.resetForm()
                    firstGeneralizableDocumentRefetch()
                })
        },
    });

    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Grid ---------------------------------- */
    const [showDocuments, setShowDocuments] = useState(false)
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        if (accountingDocumentIsFetching) {
            setContent(<CircularProgress />);
        } else if (accountingDocumentError) {
            setContent(t("خطایی رخ داده است"));
        } else {
            setContent("");
            if (!!accountingDocumentResult?.header) {
                let pagination = JSON.parse(accountingDocumentResult?.header);
                setTotal(pagination.totalCount);
            }

            let tempData = accountingDocumentResult?.data.map((data) => {
                let documentState;
                if (data.documentState === 1) {
                    documentState = "قطعی";
                } else if (data.documentState === 0) {
                    documentState = "غیر قطعی";
                } else {
                    documentState = "دائمی";
                }
                return {
                    ...data,
                    documentDate: new Date(data.documentDate),
                    documentState: documentState,
                };
            });
            setData(tempData);
        }
    }, [accountingDocumentIsFetching]);

    let tempColumn = [
        {
            field: "IndexCell",
            filterable: false,
            width: "60px",
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: true,
        },
        {
            field: "documentNumber",
            filterable: true,
            name: "ش سند",
            filter: "numeric",
        },
        {
            field: "documentDate",
            filterable: true,
            filter: "date",
            name: "تاریخ",
            cell: DateCell,
        },
        // {
        //   field: 'DocumentBalance',
        //   filterable: true,
        //   name: "تراز",
        //   cell: CurrencyCell,
        //   filter: 'numeric',
        // },
        {
            field: "documentType",
            filterable: true,
            name: "نوع",
        },
        {
            field: "refNumber",
            filterable: true,
            name: "ش ارجاع",
            filter: "numeric",
        },
        {
            field: "createdByUser",
            filterable: true,
            name: "درج",
        },
        {
            field: "folioNumber",
            filterable: true,
            name: "ش عطف",
        },
        {
            field: "subsidiaryNumber",
            filterable: true,
            name: "ش فرعی",
        },
        {
            field: "dailyNumber",
            filterable: true,
            name: "ش روزانه",
        },
        {
            field: "modifiedByUser",
            filterable: true,
            name: "آخرین تغییر",
        },
        {
            field: "documentState",
            filterable: true,
            name: "وضعیت سند",
        },
        {
            field: "documentDescription",
            filterable: true,
            width: "150px",
            name: "شرح",
        }
    ];

    /* -------------------------------------------------------------------------- */

    /* ------------------------------- SweetAlerts ------------------------------ */
    const DocumentSub = () => {
        swal({
            title: t("سند کل با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }



    /* -------------------------------------------------------------------------- */

    return (<>
        <Helmet>
            <title>{t(AccountingTitles.NewGeneralDocument)}</title>
        </Helmet>
        <form onSubmit={generalDocumentFormik.handleSubmit}>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }}>
                <div className="form-design" style={{ padding: "0" }}>
                    <div className="row ">
                        <div className="content col-lg-4 col-md-4 col-sm 4 col-12" onFocus={() => {
                            dateRef1?.current?.closeCalendar();
                            dateRef2?.current?.closeCalendar();
                        }}>
                            <div className="title">
                                <span>{t("فیلتر انتخاب سند")}</span>
                            </div>
                            <div className="wrapper">
                                <div>
                                    <SelectBox
                                        dataSource={selectionModeList}
                                        searchEnabled
                                        valueExpr="value"
                                        className="selectBox"
                                        displayExpr={'title'}
                                        displayValue="value"
                                        rtlEnabled={i18n.dir() == "rtl"}
                                        onValueChanged={(e) => {
                                            generalDocumentFormik.setValues({
                                                ...generalDocumentFormik.values,
                                                endDate: "",
                                                endDocumentNumber: "",
                                                selectionMode: e.value
                                            })
                                        }}
                                        itemRender={null}
                                        placeholder=""
                                        value={generalDocumentFormik.values.selectionMode}
                                    />
                                </div>
                            </div>
                        </div>
                        {generalDocumentFormik.values.selectionMode === "date" ? <>
                            <div className="content col-lg-4 col-md-4 col-sm 4 col-12" onFocus={() => {
                                dateRef2?.current?.closeCalendar();
                            }}>
                                <div className="title">
                                    <span>{t("از تاریخ")}</span>
                                </div>
                                <div className="wrapper date-picker position-relative">
                                    <DatePicker
                                        name={`startDate`}
                                        ref={dateRef1}
                                        id="startDate"
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        calendarPosition="bottom-right"
                                        value={generalDocumentFormik.values.startDate ? new DateObject(generalDocumentFormik.values.startDate) : ''}
                                        // onChange={(date) => {
                                        //     formik.setFieldValue(`StartDate`, date ? julianIntToDate(date.toJulianDay()) : '');
                                        // }}
                                        disabled
                                    />
                                    <div
                                        className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton' /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="content col-lg-4 col-md-4 col-sm 4 col-12" onFocus={() => {
                                dateRef1?.current?.closeCalendar();
                            }}>
                                <div className="title">
                                    <span>{t("تا تاریخ")}</span>
                                </div>
                                <div className="wrapper date-picker position-relative">
                                    <DatePicker
                                        name={`endDate`}
                                        ref={dateRef2}
                                        id="endDate"
                                        minDate={new Date(generalDocumentFormik.values.startDate)}
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        calendarPosition="bottom-right"
                                        value={generalDocumentFormik.values.endDate ? new DateObject(generalDocumentFormik.values.endDate) : ''}
                                        onChange={(date) => {
                                            generalDocumentFormik.setFieldValue(`endDate`, date ? julianIntToDate(date.toJulianDay()) : '');
                                            accountingDocumentSearchFormik.setFieldValue(`DocumentDate[1]`, date ? julianIntToDate(date.toJulianDay()) : '');
                                        }}
                                    />
                                    <div
                                        className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton' /></div>
                                    </div>
                                </div>

                            </div>
                        </> : null}
                        {generalDocumentFormik.values.selectionMode === "number" ? <>
                            <div className="content col-lg-4 col-md-4 col-sm 4 col-12">
                                <div className="title">
                                    <span>{t("از شماره سند")}</span>
                                </div>
                                <div className='wrapper'>
                                    <input
                                        className="form-input"
                                        type='number'
                                        id="startDocumentNumber"
                                        name="startDocumentNumber"
                                        // onChange={formik.handleChange}
                                        onBlur={generalDocumentFormik.handleBlur}
                                        value={generalDocumentFormik.values.startDocumentNumber}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="content col-lg-4 col-md-4 col-sm 4 col-12">
                                <div className="title">
                                    <span>{t("تا شماره سند")}</span>
                                </div>
                                <div className='wrapper'>
                                    <input
                                        className="form-input"
                                        type='number'
                                        id="endDocumentNumber"
                                        name="endDocumentNumber"
                                        onChange={(e) => {
                                            generalDocumentFormik.setFieldValue("endDocumentNumber", e.target.valueAsNumber)
                                            accountingDocumentSearchFormik.setFieldValue("documentNumber[1]", e.target.valueAsNumber)
                                        }}
                                        onBlur={generalDocumentFormik.handleBlur}
                                        value={generalDocumentFormik.values.endDocumentNumber}
                                    />
                                </div>
                            </div>
                        </> : null}

                        <div className="content col-12" onFocus={() => {
                            dateRef2?.current?.closeCalendar();
                        }}>
                            <div className="title">
                                <span>{t("شرح سند")}</span>
                            </div>
                            <div className='wrapper'>
                                <textarea
                                    className='form-input'
                                    id='documentDescription'
                                    name='documentDescription'
                                    style={{ height: '35px' }}
                                    onChange={generalDocumentFormik.handleChange}
                                    onBlur={generalDocumentFormik.handleBlur}
                                    value={generalDocumentFormik.values.documentDescription}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`button-pos ${i18n.dir()}`}>
                <Button
                    variant="contained"
                    color={'primary'}
                    type="button"
                    onClick={() => {
                        accountingDocumentSearchFormik.handleSubmit();
                    }}
                    disabled={(generalDocumentFormik.values.selectionMode === "date" && (!generalDocumentFormik.values.startDate || !generalDocumentFormik.values.endDate)) ||
                        (generalDocumentFormik.values.selectionMode === "number" && (!generalDocumentFormik.values.startDocumentNumber || !generalDocumentFormik.values.endDocumentNumber))}
                >
                    {t("نمایش اسناد")}
                </Button>
                <LoadingButton
                    variant="contained"
                    color="success"
                    type="button"
                    onClick={generalDocumentFormik.handleSubmit}
                    loading={createResults.isLoading}
                >
                    {t("صدور سند کل")}
                </LoadingButton>
                <div className="Issuance">
                    <Button variant="contained"
                        color='error'
                    >
                        <Link to={'/Accounting/GeneralDocuments'}>
                            {t("انصراف")}
                        </Link>
                    </Button>
                </div>
            </div>
        </form>
        {showDocuments ?
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "0",
                    marginTop: '50px'
                }}
            >
                <RKGrid
                    gridId={"General_Documents_form"}
                    gridData={data}
                    columnList={tempColumn}
                    showSetting={false}
                    showChart={false}
                    showExcelExport={false}
                    showPrint={false}
                    rowCount={5}
                    sortable={true}
                    pageable={true}
                    reorderable={false}
                    showFilter={false}
                    total={total}
                    showTooltip={true}
                    loading={accountingDocumentIsFetching}
                />
            </div>
            : null}
    </>)
}
export default NewGeneralDocument
