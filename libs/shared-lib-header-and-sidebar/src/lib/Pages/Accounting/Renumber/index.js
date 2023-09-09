import {
  CircularProgress,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import swal from "sweetalert";
import { useGetAllAccountingDocumentQuery, useGetFilteredDocumentMutation, useRenumerateDocumentsMutation } from "../../../features/slices/accountingDocumentSlice";
import DocumentActionCell from "./DocumentActionCell";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { AccountingTitles } from "../../../utils/pageTitles";
import { Helmet } from "react-helmet-async";
import { ParseDocumentStatesEnum, documentStates } from "../../../utils/Enums/DocumentStateEnum";

const DocumentGrid = () => {
  /* ------------------------------- Whole Page ------------------------------- */
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const params = new URLSearchParams(location?.search)
  const obj = Object.fromEntries(params)
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                  RTKQuery                                  */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Queries -------------------------------- */
  const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
  const [content, setContent] = useState("")
  const {
    data: accountingDocumentResult = {data: []},
    isFetching: accountingDocumentIsFetching,
    error: accountingDocumentError,
    currentData: accountingDocumentCurrent
  } = useGetAllAccountingDocumentQuery({obj: obj, query: ""}
  ,{
    skip: fiscalYear === 0 || Object.keys(obj).length === 0
  });

  const [filterDocument, filterResults] = useGetFilteredDocumentMutation()
  /* -------------------------------- Mutations ------------------------------- */
  const [renumerateDocuments, renumerateResults] = useRenumerateDocumentsMutation()
  useEffect(() => {
    if (renumerateResults.status == "fulfilled" && renumerateResults.isSuccess) {
      DocumentSub()
    }
    else if (renumerateResults.isError) {
      let arr = renumerateResults.error.map((item) => t(item));
      let msg = arr.join(" \n ");
      swal({
        text: msg,
        icon: "error",
        button: t("باشه"),
        className: "small-error",
      });
    }
  }, [renumerateResults.status])



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
          originalDocumentState: data.documentState
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
      filterable: true,
      filter: "enum",
      filterObject: documentStates,
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
    // },
    {
      field: "actionCell",
      filterable: false,
      width: "50px",
      name: "عملیات",
      cell: DocumentActionCell,
      className: "text-center",
      reorderable: false,
    },
  ];
  /* -------------------------------------------------------------------------- */


  /* ------------------------------- SweetAlerts ------------------------------ */
  const DocumentSub = () => {
    swal({
      title: t("شماره‌گذاری مجدد با موفقیت انجام شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  /* -------------------------------------------------------------------------- */

  
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      User: 'مدیرسیستم',
    },
    onSubmit: (values) => {
      console.log(values)
    },
  });



  return (
    <>
    <Helmet>
        <title>{t(AccountingTitles.Renumber)}</title>
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
              <div className="content col-xl-3 col-lg-4 col-md-5 col-sm-6 col-12">
                <div className="title">
                  <span>{t("کاربر عملیات")}</span>
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
              <div className="content col-xl-9 col-lg-8 col-md-7 col-sm-6 col-12 d-flex justify-content-center d-sm-block" >
                <div className="title d-none d-sm-block">
                  <span>‌</span>
                </div>
                <LoadingButton
                  variant="contained"
                  color="success"
                  type="button"
                  onClick={() => {
                    renumerateDocuments().unwrap()
                      .catch((error) => {
                        console.error(error)
                      })
                  }}
                  loadingPosition="start"
                  loading={renumerateResults.isLoading}
                >
                  {t("شماره گذاری مجدد")}
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
        <RKGrid
          gridId={"AccountingDocuments_Renumber"}
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
          //   addUrl={"/Accounting/NewDocument"}
          //   addTitle={t("افزودن سند")}
          showAdd={false}
          onfilter={filterData}
        />
      </div>

    </>
  );
};

export default DocumentGrid;
