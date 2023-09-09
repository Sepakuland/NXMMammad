import {
    CircularProgress,
    Typography,
    useTheme
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../utils/calenderLang";
import DateObject from "react-date-object";
import { julianIntToDate } from "../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useGetAllAccountingDocumentQuery, useGetFilteredBindingDocumentsMutation, usePermanentDocumentsMutation } from "../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Helmet } from "react-helmet-async";
import { AccountingTitles } from "../../../utils/pageTitles";
import { ParseDocumentStatesEnum, documentStates } from "../../../utils/Enums/DocumentStateEnum";

const DocumentGrid = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const location = useLocation();
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const params = new URLSearchParams(location?.search)
    const obj = Object.fromEntries(params)

    /* -------------------------------------------------------------------------- */
    /*                                  RTKQuery                                  */
    /* -------------------------------------------------------------------------- */

    /* --------------------------------- Queries -------------------------------- */

    const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
    const [content, setContent] = useState("")
    const {
        data: accountingDocumentResult = { data: [] },
        isFetching: accountingDocumentIsFetching,
        error: accountingDocumentError,
        currentData: accountingDocumentCurrent
    } = useGetAllAccountingDocumentQuery({ obj: obj, query: CreateQueryString({ DocumentState: documentStates.Binding }) },
        {
            skip: fiscalYear === 0 || Object.keys(obj).length === 0
        }); //فقط اسناد قطعی

        const [filterDocument, filterResults] = useGetFilteredBindingDocumentsMutation()

    /* -------------------------------- Mutations ------------------------------- */
    const [permanentDocuments, permanentResults] = usePermanentDocumentsMutation()
    useEffect(() => {
        if (permanentResults.status == "fulfilled" && permanentResults.isSuccess) {
            DocumentSub()
        }
        else if (permanentResults.isError) {
            let arr = permanentResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }
    }, [permanentResults.status])


    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Grid ---------------------------------- */
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        parseQueryData(accountingDocumentResult, accountingDocumentIsFetching, accountingDocumentError)
      }, [accountingDocumentIsFetching, accountingDocumentCurrent]);
    
      async function filterData(value) {
        await filterDocument({ obj: obj, filter: value })
          .unwrap()
          .then((res) => {
            parseQueryData(res, filterResults.isLoading, filterResults.isError)
          })
          .catch((error) => {
            let arr = error.data.errorList.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
              text: msg,
              icon: "error",
              button: t("باشه"),
              className: "small-error",
            });
          });
      }
    
      function parseQueryData(data, isFetching, error) {
        if (isFetching) {
          setContent(<CircularProgress />);
        } else if (error) {
          setContent(t("خطایی رخ داده است"));
        } else {
          setContent("");
          if (!!data?.header) {
            let pagination = JSON.parse(data?.header);
            setTotal(pagination.totalCount);
          }
    
          let tempData = data?.data.map((data) => {
            return {
              ...data,
              DocumentDate: new Date(data.documentDate),
              documentState: t(ParseDocumentStatesEnum(data.documentState)),
            };
          });
          setData(tempData);
        }
      }


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
          field: "documentDefinitionName",
          filterable: true,
          name: "نوع",
        },
        {
          field: "refNumber",
          filterable: true,
          name: "ش ارجاع",
          filter: "numeric",
        },
        // {
        //   field: 'DocumentTrackCode',
        //   filterable: true,
        //   name: "ش پیگیری",
        //   filter: 'numeric',
        // },
        {
          field: "createdByUser",
          filterable: true,
          name: "درج",
        },
        {
          field: "folioNumber",
          filterable: true,
          filter: "numeric",
          name: "ش عطف",
        },
        {
          field: "subsidiaryNumber",
          filterable: true,
          filter: "numeric",
          name: "ش فرعی",
        },
        {
          field: "dailyNumber",
          filterable: true,
          filter: "numeric",
          name: "ش روزانه",
        },
        {
          field: "modifiedByUser",
          filterable: true,
          name: "آخرین تغییر",
        },
        {
          field: "documentState",
          filterable: false,
          filter: "none",
          name: "وضعیت سند",
        },
        {
          field: "documentDescription",
          filterable: true,
          width: "150px",
          name: "شرح",
        },
        // {
        //   field: 'Attachments',
        //   filterable: true,
        //   width: '150px',
        //   name: "پیوست‌ها",
        // }
      ];

    /* ------------------------------- SweetAlerts ------------------------------ */
    const DocumentSub = () => {
        swal({
            title: t("دائمی کردن اسناد با موفقیت انجام شد"),
            icon: "success",
            button: t("باشه"),
        });
    };

    /* -------------------------------------------------------------------------- */
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            User: 'مدیرسیستم',
            permanentDate: '',
        },
        onSubmit: (values) => {
            permanentDocuments({ permanentDate: values.permanentDate }).unwrap()
                .catch((error) => {
                    console.error(error)
                })
        },
    });
    const dateRef = useRef()


    return (
        <>
            <Helmet>
                <title>{t(AccountingTitles.DocumentPermanent)}</title>
            </Helmet>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px 0",
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        <div className="row">
                            <div className="content col-xl-3 col-lg-3 col-md-3 col-12">
                                <div className="title">
                                    <span>{t("کاربر دائمی کننده")}</span>
                                </div>
                                <div className='wrapper'>
                                    <div>
                                        <input
                                            className='form-input'
                                            id='User'
                                            name='User'
                                            value={formik.values.User}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="content col-xl-5 col-lg-6 col-md-7 col-12">
                                <div className="title">
                                    <span>‌</span>
                                </div>
                                <div className='d-sm-flex align-items-center'>
                                    <div onFocus={() => {
                                        dateRef?.current?.closeCalendar();
                                    }}>
                                        <Typography variant="h6" sx={{ fontSize: '12px' }}>
                                            {t('دائمی کردن تمام اسناد تا تاریخ')}
                                        </Typography>
                                    </div>
                                    <div className='wrapper date-picker position-relative flex-grow-1 m-xs-0' style={i18n.dir() === 'rtl' ? { marginRight: '30px' } : { marginLeft: '30px' }}>
                                        <DatePicker
                                            name={`permanentDate`}
                                            ref={dateRef}
                                            id="permanentDate"
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            calendarPosition="bottom-right"
                                            value={formik.values.permanentDate ? new DateObject(formik.values.permanentDate) : ''}
                                            onChange={(date) => {
                                                formik.setFieldValue(`permanentDate`, date ? julianIntToDate(date.toJulianDay()) : '');
                                            }}
                                        />
                                        <div
                                            className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'>
                                                <CalendarMonthIcon className='calendarButton' /></div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="content col-xl-4 col-lg-3 col-md-2 col-12 d-flex d-md-block justify-content-center" onFocus={() => {
                                dateRef?.current?.closeCalendar();
                            }}>
                                <div className="title d-none d-md-block">
                                    <span>‌</span>
                                </div>
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={formik.handleSubmit}
                                    disabled={!formik.values.permanentDate}
                                    loadingPosition="start"
                                    loading={permanentResults.isLoading}
                                >
                                    {t("دائمی کردن")}
                                </LoadingButton>
                            </div>
                        </div>
                    </div>
                </form>
                <RKGrid
                    gridId={"AccountingDocuments_Permanent"}
                    gridData={data}
                    //  excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={false}
                    showPrint={false}
                    //   excelFileName={t("اسناد حسابداری")}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={false}
                    //   selectionMode={"multiple"} //single , multiple
                    //   selectKeyField={"DocumentId"}
                    //   getSelectedRows={getSelectedRows}
                    showFilter={true}
                    total={total}
                    showTooltip={true}
                    loading={accountingDocumentIsFetching || filterResults.isLoading}
                    showAdd={false}
                    onfilter={filterData}
                />

            </div>

        </>
    );
};

export default DocumentGrid;
