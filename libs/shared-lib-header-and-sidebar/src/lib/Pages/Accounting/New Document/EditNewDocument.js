import { SelectBox } from "devextreme-react";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles'
import { useTranslation } from "react-i18next";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import {
  julianIntToDate,
  julianIntToDateTime,
} from "../../../utils/dateConvert";
import {
  renderCalendarLocaleSwitch,
  renderCalendarSwitch,
} from "../../../utils/calenderLang";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Swal from 'sweetalert2';
import { parsFloatFunction } from "../../../utils/parsFloatFunction";
import DateObject from "react-date-object";
import { useNavigate } from "react-router-dom";
import Guid from "devextreme/core/guid";
import { useFetchBranchesQuery } from "../../../features/slices/branchSlice";
import {
  useGetAllDocumentDefinitionQuery,
} from "../../../features/slices/DocumentDefinitionSlice";
import {
  useCreateAccountingDocumentMutation,
  useGetAccountingDocumentFormDataQuery,
  useGetNextDocumentNumbersQuery,
  useUpdateAccountingDocumentMutation,
} from "../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import { history } from "../../../utils/history";
import { Helmet } from "react-helmet-async";
import { AccountingTitles } from "../../../utils/pageTitles";
import { useSelector } from "react-redux";
import { InputGrid } from "./InputGrid";


export default function KaraDataGrid() {
  /* -------------------------------------------------------------------------- */
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */
  const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);

  const [SearchParams] = useSearchParams();
  const id = SearchParams.get("id");
  const [documentNumberPollingInterval, setDocumentNumberPollingInterval] =
    useState(60000);
  const [branchDatasource, setBranchDatasource] = useState([]);
  const [documentDefinitionDatasource, setDocumentDefinitionDatasource] = useState([])

  const {
    data: branchList,
    isFetching: branchlistIsFetching,
    error: branchListError,
  } = useFetchBranchesQuery();

  useEffect(() => {
    if (!branchlistIsFetching && !branchListError) {
      let displayNames = branchList.map((item) => {
        return {
          ...item,
          displayName: item.branchCode + " - " + item.branchName,
        };
      });
      setBranchDatasource(displayNames);
    }
  }, [branchlistIsFetching]);

  const [createDocument, createResults] = useCreateAccountingDocumentMutation()
  useEffect(() => {
    if (createResults.status == "fulfilled" && createResults.isSuccess) {
      DocumentSub()
    }
    else if (createResults.isError) {
      let arr = createResults.error.map((item) => t(item));
      if (arr[arr.length - 1] === "هشدار") {
        delete arr[arr.length - 1]
        let msg = arr.join(i18n.dir() === "rtl" ? "، " : ", ");
        NatureNotMatchingWarning(msg)
      }
      else {
        let msg = arr.join(" \n ")
        swal({
          text: msg,
          icon: "error",
          button: t("باشه"),
          className: "small-error",
        });
      }
    }
  }, [createResults.status])

  const [nextDocumentNumberParam, setNextDocumentNumberParam] = useState(CreateQueryString({ DocumentDate: [julianIntToDate(new DateObject().toJulianDay()), julianIntToDate(new DateObject().toJulianDay())] }))
  const [skipUnlessDraft, setSkipUnlessDraft] = useState(true);
  const { data: nextDocumentNumbers = { nextDocumentNumber: 0, nextDailyNumber: 0 }, isFetching: nextDocumentNumberIsFetching, error: nextDocumentNumberError, refetch: nextDocNumberRefetch }
    = useGetNextDocumentNumbersQuery(nextDocumentNumberParam, {
      skip: fiscalYear === 0 && skipUnlessDraft,
      pollingInterval: documentNumberPollingInterval,
      refetchOnMountOrArgChange: true
    })

  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Whole Page ------------------------------- */
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();


  const NavigateToGrid = () => {
    navigate(`/Accounting/Document`, { replace: false });
  };

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                       Input Grid (Document Articles)                       */
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Empty array for formik ------------------------- */
  const emptyArticles = {
    documentArticleGuid: new Guid().valueOf(),
    moeinAccountId: null,
    detailed4Id: null,
    detailed5Id: null,
    detailed6Id: null,
    debits: 0,
    credits: 0,
    notes: "",
    trackingNumber: "",
    trackingDate: null,
  };
  

  /* ------------------------------ Balance Field ----------------------------- */
  const [debitsTotal, setDebitsTotal] = useState(0);
  const [creditsTotal, setCreditsTotal] = useState(0);

  function CalculateDebitsTotal(articles) {
    let debitsTemp = 0;
    articles.forEach((element) => {
      debitsTemp += parseFloat(element.debits, 2) || 0;
      setDebitsTotal(parsFloatFunction(debitsTemp, 2));
    });
  }

  function CalculateCreditsTotal(articles) {
    let creditsTemp = 0;
    articles.forEach((element) => {
      creditsTemp += parseFloat(element.credits, 2) || 0;
      setCreditsTotal(parsFloatFunction(creditsTemp, 2));
    });
  }

  useEffect(() => {
    formik.setFieldValue("balance", Math.abs(creditsTotal - debitsTotal));
  }, [creditsTotal, debitsTotal]);

  /* -------------------------------- Mutation -------------------------------- */
  const [updateAccountingDocument, updateResults] = useUpdateAccountingDocumentMutation();
  useEffect(() => {
    if (updateResults.status == "fulfilled" && updateResults.isSuccess) {
      DocumentSub()
    }
    else if (updateResults.isError) {
      let arr = updateResults.error.map((item) => t(item));
      if (arr[arr.length - 1] === "هشدار") {
        delete arr[arr.length - 1]
        let msg = arr.join(i18n.dir() === "rtl" ? "، " : ", ");
        NatureNotMatchingWarning(msg)
      }
      else {
        let msg = arr.join(" \n ")
        swal({
          text: msg,
          icon: "error",
          button: t("باشه"),
          className: "small-error",
        });
      }
    }
  }, [updateResults.status])


  /* ------------------------------ ShowArticles ------------------------------ */
  const [showArticles, setShowArticles] = useState({
    group: "",
    kol: "",
    moein: "",
    detailed4: "",
    detailed5: "",
    detailed6: "",
  });


  /* -------------------------------------------------------------------------- */

  /* -------------------------------- Main Form ------------------------------- */
  const formik = useFormik({
    initialValues: {
      documentNumber: 0,
      folioNumber: "",
      subsidiaryNumber: "",
      dailyNumber: "",
      documentDate: julianIntToDateTime(new DateObject().toJulianDay()),
      documentTypeId: "",
      branchId: ".",
      createdByUser: "مدیر سیستم",
      modifiedByUser: "مدیر سیستم",
      refNumber: "",
      status: "غیر قطعی",
      documentDescription: "",
      //  files: [],
      documentArticles: [emptyArticles],
      balance: 0,
      checkForWarning: true
    },
    validationSchema: Yup.object({
      documentDescription: Yup.string().required(
        "وارد کردن شرح سند الزامی است"
      ),
      documentDate: Yup.date().required("وارد کردن تاریخ سند الزامی است"),
      documentTypeId: Yup.string().required("نوع سند الزامی است"),
      branchId: Yup.string().required("شعبه الزامی است"),
      documentArticles: Yup.array(
        Yup.object({
          moeinAccountId: Yup.object()
            .required("حساب معین باید انتخاب گردد")
            .nullable(true),
          debits: Yup.number().min(0, "میزان بدهکار باید مثبت باشد"),
          credits: Yup.number().when("debits", (debits) => {
            if (debits === 0)
              return Yup.number().moreThan(
                0,
                "یکی از موارد بدهکار یا بستانکار باید بیش از صفر باشد"
              );
            else
              return Yup.number()
                .max(
                  0,
                  "فقط یکی از موارد بدهکار یا بستانکار می‌تواند مقدار بگیرد"
                )
                .min(0, "میزان بستانکار باید مثبت باشد");
          }),
        })
      ),
      balance: Yup.number().test(
        "isZero",
        "سند حسابداری غیرتراز نمی‌تواند در سیستم ثبت شود",
        (item, testContext) => {
          if (item === 0) {
            return true;
          }
        }
      ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if (id != null) {
        values.documentArticles?.forEach((element) => {
          element.moeinAccountId = element.moeinAccountId.codingId;
          element.detailed4Id = element.detailed4Id?.detailedAccountId || null;
          element.detailed5Id = element.detailed5Id?.detailedAccountId || null;
          element.detailed6Id = element.detailed6Id?.detailedAccountId || null;
        });
        var documentArticles = JSON.parse(
          JSON.stringify(values.documentArticles)
        );
        updateAccountingDocument({ id: id, accountingDocument: values })
          .then((payload) => {
            NavigateToGrid();
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            history.navigate(`/Accounting/Document`);
            DocumentSub();
          });
      } else {
        var documentArticles = JSON.parse(
          JSON.stringify(values.documentArticles)
        );
        values.documentArticles.forEach((element) => {
          element.moeinAccountId = element.moeinAccountId.codingId;
          element.detailed4Id = element.detailed4Id?.detailedAccountId || null;
          element.detailed5Id = element.detailed5Id?.detailedAccountId || null;
          element.detailed6Id = element.detailed6Id?.detailedAccountId || null;
        });
        createDocument({ ...values, isDraft: false })
          .unwrap()
          .then(() => {
            NavigateToGrid();
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            formik.setFieldValue("documentArticles", documentArticles);
          });
      }
    },
  });
  function handleDraftSubmit() {
    var documentArticles = JSON.parse(
      JSON.stringify(formik.values.documentArticles)
    );
    formik.values.documentArticles.forEach((element) => {
      element.moeinAccountId = element.moeinAccountId?.codingId;
      element.detailed4Id = element.detailed4Id?.detailedAccountId;
      element.detailed5Id = element.detailed5Id?.detailedAccountId;
      element.detailed6Id = element.detailed6Id?.detailedAccountId;
    });
    updateAccountingDocument({ id: id, accountingDocument: { ...formik.values, isDraft: true } }).unwrap()
      .then(() => {
        NavigateToGrid();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        formik.setFieldValue("documentArticles", documentArticles);
      });
  }

  const dateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Submit Button ----------------------------- */
  const [click, setClick] = useState(false);
  useEffect(() => {
    if (click) {
      tableError();
      setClick(false);
    }
  }, [formik.errors.documentArticles]);
  // useEffect(() => {
  //     stickyTable.current.scrollIntoView({ behavior: "smooth" });
  // }, [formik.values.documentArticles.length])

  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Sweetalerts ------------------------------ */
  const DocumentSub = () => {
    swal({
      title: t("سند با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };
  const tableError = () => {
    swal({
      title: t("خطاهای مشخص شده را برطرف کنید"),
      icon: "error",
      button: t("باشه"),
    });
  };
  /* -------------------------------------------------------------------------- */

  // const [uploadError, setUploadError] = useState(false)

  // function updateFileList(list) {
  //     formik.setFieldValue('files', list)
  // }

  // console.log("formik.values", formik.values)

  // console.log("erors", formik.errors)

  /* ------------------------------ AccountingDocument ------------------------------ */
  const {
    data: accountingDocumentRes = [],
    isFetching: accountingDocumentIsFetching,
    error: accountingDocumentError,
  } = useGetAccountingDocumentFormDataQuery(id
    , {
      refetchOnMountOrArgChange: true
    });

  useEffect(() => {
    if (!accountingDocumentIsFetching && !accountingDocumentError) {
      formik.setValues(JSON.parse(JSON.stringify(accountingDocumentRes)))
        .then(() => {
          CalculateDebitsTotal(accountingDocumentRes.documentArticles);
          CalculateCreditsTotal(accountingDocumentRes.documentArticles);
        })
      switch (accountingDocumentRes.documentState) {
        case 0:
          formik.setFieldValue('status', t("غیرقطعی"))
          break;
        case -1:
          formik.setFieldValue('status', t("پیش‌نویس"))
          setSkipUnlessDraft(false)
        default:
          break;
      }
      formik.setFieldValue("checkForWarning", true)
    }

  }, [accountingDocumentIsFetching])
  useEffect(() => {
    if (formik.values.documentState === -1 && !nextDocumentNumberIsFetching && !nextDocumentNumberError) {
      formik.setFieldValue('documentNumber', nextDocumentNumbers.nextDocumentNumber)
      formik.setFieldValue('dailyNumber', nextDocumentNumbers.nextDailyNumber)
    }
  }, [nextDocumentNumberIsFetching, formik.values.documentState])

  const {
    data: documentDefinitionList = [],
    isFetching: documentDefinitionlistIsFetching,
    error: documentDefinitionListError,
  } = useGetAllDocumentDefinitionQuery();
  useEffect(() => {
    if (!documentDefinitionlistIsFetching && !documentDefinitionListError) {
      {
        setDocumentDefinitionDatasource(documentDefinitionList.filter(a => a.documentDefinitionId > 4))
      }
    }
  }, [documentDefinitionlistIsFetching])


  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success mx-2',
      cancelButton: 'btn btn-danger mx-2',
      container: 'swalRTL'
    },
    width: "600px",
    buttonsStyling: false
  })

  const NatureNotMatchingWarning = (warningText) => {
    swalWithBootstrapButtons.fire({
      title: 'هشدار',
      text: `با ثبت این آرتیکل‌ها، حسابهای معین ${warningText}دچار مغایرت در ماهیت حساب می‌شود. آیا مایل به ثبت سند هستید؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید و ادامه',
      cancelButtonText: 'انصراف',
    }).then((result) => {
      if (result.isConfirmed) {
        formik.setFieldValue("checkForWarning", false)
          .then(() => {
            formik.handleSubmit()
          })
      }
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //     closeModal()
      // }
    })
  }

  console.log("values", formik.values)
  return (
    <>
      <Helmet>
        <title>{t(AccountingTitles.EditDocument)}</title>
      </Helmet>
      <div
        className="form-template"
        style={{
          marginBottom: "30px",
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <div>
          <div className="row row-8">
            <div className="col-12">
              <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-design">
                    {!accountingDocumentIsFetching && !accountingDocumentError ?
                      <>
                        <div className="row row-8">
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("شماره سند")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="documentNumber"
                                  name="documentNumber"
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      "documentNumber",
                                      e.target.value
                                    );
                                    setDocumentNumberPollingInterval(0);
                                  }}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.documentNumber}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("شماره عطف")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="folioNumber"
                                  name="folioNumber"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.folioNumber}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("شماره فرعی")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="subsidiaryNumber"
                                  name="subsidiaryNumber"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.subsidiaryNumber}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className="content col-lg-custom-8 col-md-6 col-12"
                            onFocus={() => {
                              dateRef?.current?.closeCalendar();
                            }}
                          >
                            <div className="title">
                              <span> {t("شماره روزانه")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="dailyNumber"
                                  name="dailyNumber"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.dailyNumber}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span>
                                {" "}
                                {t("تاریخ سند")} <span className="star">*</span>
                              </span>
                            </div>
                            <div className="wrapper">
                              <div className="date-picker position-relative">
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
                                  onChange={(val) => {
                                    setDate(val);
                                    formik.setFieldValue(
                                      "documentDate",
                                      julianIntToDateTime(val.toJulianDay())
                                    );
                                    setNextDocumentNumberParam(CreateQueryString({ DocumentDate: [julianIntToDate(val.toJulianDay()), julianIntToDate(val.toJulianDay())] }))
                                  }}
                                />
                                <div
                                  className={`modal-action-button  ${i18n.dir() === "ltr" ? "action-ltr" : ""
                                    }`}
                                >
                                  <div className="d-flex align-items-center justify-content-center">
                                    <CalendarMonthIcon className="calendarButton" />
                                  </div>
                                </div>
                              </div>
                              {formik.touched.documentDate &&
                                formik.errors.documentDate &&
                                !formik.values.documentDate ? (
                                <div className="error-msg">
                                  {t(formik.errors.documentDate)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div
                            className="content col-lg-custom-8 col-md-6 col-12"
                            onFocus={() => {
                              dateRef?.current?.closeCalendar();
                            }}
                          >
                            <div className="title">
                              <span>
                                {" "}
                                {t("نوع سند")} <span className="star">*</span>{" "}
                              </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <SelectBox
                                  dataSource={documentDefinitionDatasource}
                                  rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                  onValueChanged={(e) =>
                                    formik.setFieldValue("documentTypeId", e.value)
                                  }
                                  value={formik.values.documentTypeId}
                                  className="selectBox"
                                  noDataText={t("اطلاعات یافت نشد")}
                                  valueExpr="documentDefinitionId"
                                  displayExpr={(item) =>
                                    item?.documentDefinitionName
                                  }
                                  itemRender={null}
                                  placeholder=""
                                  name="documentTypeId"
                                  id="documentTypeId"
                                  searchEnabled
                                />
                              </div>
                              {formik.touched.documentTypeId &&
                                formik.errors.documentTypeId ? (
                                <div className="error-msg">
                                  {t(formik.errors.documentTypeId)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("شماره ارجاع")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="refNumber"
                                  name="refNumber"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.refNumber}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("وضعیت")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="status"
                                  name="status"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.status}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span>
                                {" "}
                                {t("شعبه")} <span className="star">*</span>{" "}
                              </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <SelectBox
                                  dataSource={branchDatasource}
                                  rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                  onValueChanged={(e) => {
                                    formik.setFieldValue("branchId", e.value);
                                    if (e.value === accountingDocumentRes.branchId) {
                                      formik.setFieldValue("folioNumber", accountingDocumentRes.folioNumber)
                                    }
                                    else {
                                      var branch = branchDatasource.find(
                                        (a) => a.branchId == e.value
                                      );
                                      formik.setFieldValue(
                                        "folioNumber",
                                        branch.folioNumber +
                                        branch.nextFolioNumber -
                                        1
                                      );
                                    }
                                  }}
                                  className="selectBox"
                                  noDataText={t("اطلاعات یافت نشد")}
                                  displayExpr="displayName"
                                  valueExpr="branchId"
                                  value={formik.values.branchId}
                                  itemRender={null}
                                  placeholder=""
                                  name="branch"
                                  id="branch"
                                  searchEnabled
                                />
                              </div>
                              {formik.touched.branchId && formik.errors.branchId ? (
                                <div className="error-msg">
                                  {t(formik.errors.branchId)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("درج اولیه")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="createdByUser"
                                  name="createdByUser"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.createdByUser}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content col-lg-custom-8 col-md-6 col-12">
                            <div className="title">
                              <span> {t("آخرین تغییر")} </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <input
                                  className="form-input"
                                  type="text"
                                  id="modifiedByUser"
                                  name="modifiedByUser"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.modifiedByUser}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>

                          <div className="content col-lg-custom-8-3 col-md-6 col-12">
                            <div className="title">
                              <span>
                                {" "}
                                {t("شرح سند")} <span className="star">*</span>
                              </span>
                            </div>
                            <div className="wrapper">
                              <div>
                                <textarea
                                  className="form-input"
                                  id="documentDescription"
                                  name="documentDescription"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  style={{ height: "30px" }}
                                  value={formik.values.documentDescription}
                                />
                              </div>
                              {formik.touched.documentDescription &&
                                formik.errors.documentDescription &&
                                !formik.values.documentDescription ? (
                                <div className="error-msg">
                                  {t(formik.errors.documentDescription)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          {/* <div className='content col-lg-6 col-md-6 col-12'>
                                                <div className='title'>
                                                    <span className='span'> {t("فایل های پیوست")} </span>
                                                </div>
                                                <div className='wrapper'>
                                                    <div>
                                                        <UploadFile
                                                            title={''}
                                                            multiple={true}
                                                            uploadError={uploadError}
                                                            updateFileList={updateFileList}
                                                            size={'small'}
                                                        // accept={".png , .jpeg, .gif, .jpg, .bmp"}
                                                        />
                                                    </div>
                                                </div>
                                            </div> */}
                        </div>
                        <div className="row row-8">
                          <div className="col-12 mb-0">
                            <div className="row row-8">
                              <div className="col-lg-12 col-12">
                                <InputGrid
                                  formik={formik}
                                  creditsTotal={creditsTotal}
                                  debitsTotal={debitsTotal}
                                  setCreditsTotal={setCreditsTotal}
                                  setDebitsTotal={setDebitsTotal}
                                  showArticles={showArticles}
                                  setShowArticles={setShowArticles}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 mt-3">
                            <div className="row row-8 align-items-center">
                              {/*<div className='content col-12'>*/}
                              {/*    <div className='title mb-0'>*/}
                              {/*        <span className='span'> {t("شرح آرتیکل")} :</span>*/}
                              {/*    </div>*/}
                              {/*</div>*/}
                              <div className="col-12">
                                <div className="row row-8">
                                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                    <div className="title">
                                      <span> {t("گروه")} </span>
                                    </div>
                                    <div className="wrapper">
                                      <div>
                                        <input
                                          className="form-input"
                                          type="text"
                                          id="showArticles.group"
                                          name="showArticles.group"
                                          value={showArticles.group}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                    <div className="title">
                                      <span> {t("کل")} </span>
                                    </div>
                                    <div className="wrapper">
                                      <div>
                                        <input
                                          className="form-input"
                                          type="text"
                                          id="showArticles.kol"
                                          name="showArticles.kol"
                                          value={showArticles.kol}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                    <div className="title">
                                      <span> {t("معین")} </span>
                                    </div>
                                    <div className="wrapper">
                                      <div>
                                        <input
                                          className="form-input"
                                          type="text"
                                          id="showArticles.moein"
                                          name="showArticles.moein"
                                          value={showArticles.moein}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                    <div className="title">
                                      <span> {t("تفضیلی")} 4</span>
                                    </div>
                                    <div className="wrapper">
                                      <div>
                                        <input
                                          className="form-input"
                                          type="text"
                                          id="showArticles.detailed4"
                                          name="showArticles.detailed4"
                                          value={showArticles.detailed4}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                    <div className="title">
                                      <span> {t("تفضیلی")} 5</span>
                                    </div>
                                    <div className="wrapper">
                                      <div>
                                        <input
                                          className="form-input"
                                          type="text"
                                          id="showArticles.detailed5"
                                          name="showArticles.detailed5"
                                          value={showArticles.detailed5}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                    <div className="title">
                                      <span> {t("تفضیلی")} 6</span>
                                    </div>
                                    <div className="wrapper">
                                      <div>
                                        <input
                                          className="form-input"
                                          type="text"
                                          id="showArticles.detailed6"
                                          name="showArticles.detailed6"
                                          value={showArticles.detailed6}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </> :
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {accountingDocumentError ? t("خطایی رخ داده است") : <CircularProgress />}
                      </Box>
                    }
                  </div>
                </form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`button-pos mt-0 ${i18n.dir() === "ltr" ? "ltr" : "rtl"}`}
        >
          <Button
            variant="contained"
            color="success"
            type="button"
            onClick={() => {
              if (formik.errors.documentArticles) {
                tableError();
              } else {
                setClick(true);
              }
              formik.handleSubmit();
            }}
          >
            {t("تایید")}
          </Button>
          <Button
            variant="contained"
            color={"primary"}
            type="button"
            onClick={() => {
              if (formik.errors.documentArticles) {
                tableError();
              } else {
                setClick(true);
              }
              handleDraftSubmit();
            }}
          >
            {t("پیش نویس")}
          </Button>

          <div className="Issuance">
            <Button variant="contained" color="error" onClick={NavigateToGrid}>
              {t("انصراف")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
