import { SelectBox } from "devextreme-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  ListItemText,
  MenuItem,
  Select,
  useTheme,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import DateObject from "react-date-object";
import { useNavigate } from "react-router-dom";
import { useFetchBranchesQuery } from "../../../../features/slices/branchSlice";
import { useGetAllDocumentDefinitionQuery } from "../../../../features/slices/DocumentDefinitionSlice";
import { useGetFiscalYearByIdQuery } from "../../../../features/slices/FiscalYearSlice";
import {
  renderCalendarLocaleSwitch,
  renderCalendarSwitch,
} from "../../../../utils/calenderLang";
import { julianIntToDate } from "../../../../utils/dateConvert";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useLocation } from "react-router";
import CancelIcon from "@mui/icons-material/HighlightOff";
import { useSelector } from "react-redux";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useGetAllAccountingDocumentTrialBalanceReportQuery } from "../../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../../utils/createQueryString";
import { LoadingButton } from "@mui/lab";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";

export default function TrialBalance() {
  /* -------------------------------------------------------------------------- */

  const [totalData, setTotalData] = useState([]);
  const dataRef2 = useRef();
  dataRef2.current = totalData;
  const dateRef2 = useRef();
  const tableRef = useRef(null);
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */

  const [documentDefinitionDatasource, setDocumentDefinitionDatasource] =
    useState();

  const {
    data: documentDefinitionList = [],
    isFetching: documentDefinitionlistIsFetching,
    error: documentDefinitionListError,
  } = useGetAllDocumentDefinitionQuery();
  useEffect(() => {
    if (!documentDefinitionlistIsFetching && !documentDefinitionListError) {
      let displayNames = documentDefinitionList.map((item) => {
        return {
          ...item,
          displayName:
            item.documentDefinitionId + " - " + item.documentDefinitionName,
        };
      });
      setDocumentDefinitionDatasource(displayNames);
    }
  }, [documentDefinitionlistIsFetching, documentDefinitionList]);

  /* -------------------------------------------------------------------------- */
  /* ------------------------------fiscalYear--------------------------------- */
  const fiscalYear = useSelector(
    (state) => state.reducer.fiscalYear.fiscalYearId
  );

  const {
    data: fiscalYearRes = [],
    isFetching: fiscalYearIsFetching,
    error: fiscalYearError,
  } = useGetFiscalYearByIdQuery(fiscalYear);

  /* -------------------------------------------------------------------------- */
  /*                                Get Branches                                */
  /* -------------------------------------------------------------------------- */
  const [branches, setBranches] = useState();

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
      setBranches(displayNames);
    }
  }, [branchlistIsFetching, branchList]);
  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Whole Page ------------------------------- */
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const startDateRef = useRef();
  const endDateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  const [date2, setDate2] = useState(new DateObject());
  const dateRef = useRef();
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const startDate = fiscalYearRes?.startDate || null;
  const [querySearchParams, setQuerySearchParams] = useState("");

  /* -------------------------------- Main Form ------------------------------- */
  const formik = useFormik({
    initialValues: {
      DocumentTypeId: [],
      branchId: [],
      DocumentDate: [new DateObject(startDate), null],
      showArticlesWithZeroRemain: false,
      // showArticlesWithZeroTurnOver: false,
      reportTypeId: "",
      reportId: "",
      detailedId: "",
      exportType: "",
    },
    validationSchema: Yup.object({
      DocumentTypeId: Yup.array().of(Yup.string().required("نوع سند الزامیست")),
      reportId: Yup.string().required("گزارش الزامی است"),
      reportTypeId: Yup.string().required("نوع گزارش الزامی است"),
      branchId: Yup.array().of(Yup.string().required("Branch ID is required")),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log("values", values);
      if (values.exportType === "excel") {
        handleExportToPDF(values, "excel");
      } else if (values.exportType === "pdf") {
        handleExportToPDF(values, "pdf");
      }
    },
  });

  // get query function
  function getQuery(value) {
    setQuerySearchParams(CreateQueryString(value));
  }

  /* ------------------------------- Sweetalerts ------------------------------ */
  const DocumentSub = () => {
    swal({
      title: t("گزارش با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  /* -------------------------------------------------------------------------- */

  const reportDataSource = [
    { reportName: "تراز کل", reportId: 1 },
    { reportName: "تراز معین", reportId: 2 },
    { reportName: "تراز تفضیلی", reportId: 3 },
  ];
  const reportTypeDataSource = [
    { reportTypeName: "دو‌ستونه", reportTypeId: 2 },
    { reportTypeName: "چهار‌ستونه", reportTypeId: 4 },
    { reportTypeName: "شش‌ستونه", reportTypeId: 6 },
    { reportTypeName: "هشت‌ستونه", reportTypeId: 8 },
  ];
  const detailedDataSource = [
    { detailedName: "تفضیلی4", detailedId: 4 },
    { detailedName: "تفضیلی5", detailedId: 5 },
    { detailedName: "تفضیلی6", detailedId: 6 },
  ];

  const handleExportToPDF = (values, exportType) => {
    if (values.exportType === "excel") {
      getQuery(values);
    } else if (exportType === "pdf") {
      if (formik.values.reportTypeId === 2) {
        navigate(`/Reports/Accounting/PrintReportTwoRow`, {
          replace: false,
          state: values,
        });
      } else if (formik.values.reportTypeId === 4) {
        navigate(`/Reports/Accounting/PrintReportFourRow`, {
          replace: false,
          state: values,
        });
      } else if (formik.values.reportTypeId === 6) {
        navigate(`/Reports/Accounting/PrintReportSixRow`, {
          replace: false,
          state: values,
        });
      } else if (formik.values.reportTypeId === 8) {
        navigate(`/Reports/Accounting/PrintReportEightRow`, {
          replace: false,
          state: values,
        });
      }
    }
  };

  const handleChange = (event) => {
    const selectedBranches = event.target.value;
    const allOptionSelected = selectedBranches.includes(-1);
    const updatedBranchId = allOptionSelected
      ? branches.map((branch) => branch.branchId)
      : selectedBranches;
    formik.setFieldValue("branchId", updatedBranchId);
  };
  const handleChange2 = (event) => {
    const selectedDocuments = event.target.value;
    const allOptionSelected = selectedDocuments.includes(-1);
    const updatedDocumentId = allOptionSelected
      ? documentDefinitionDatasource.map(
          (document) => document.documentDefinitionId
        )
      : selectedDocuments;
    formik.setFieldValue("DocumentTypeId", updatedDocumentId);
  };

  /*                         clear Button for clear data                        */
  /* -------------------------------------------------------------------------- */
  const handleClearDate = (x) => {
    if (formik.values.DocumentDate[0] && x === "startDate") {
      formik.setFieldValue("DocumentDate[0]", null); // Clear the selected date field
      formik.setFieldValue("DocumentDate[1]", null);
    } else {
      formik.setFieldValue("DocumentDate[1]", null);
    }
  };
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!fiscalYearIsFetching && !fiscalYearError) {
      const startDate = new DateObject(fiscalYearRes?.startDate);
      formik.setFieldValue(
        "DocumentDate[0]",
        julianIntToDate(startDate.toJulianDay())
      );
    }
  }, [fiscalYearIsFetching, fiscalYearRes]);

  // excell Time
  const header = ["Firstname", "Lastname", "Age"];
  const body = [
    ["Edison", "Padilla", 14],
    ["Cheila", "Rodrigez", 56],
  ];

  const body2 = [
    { firstname: "Edison", lastname: "Padilla", age: 14 },
    { firstname: "Cheila", lastname: "Rodrigez", age: 56 },
  ];

  const {
    data: AccountDocumentResult,
    isFetching: AccountDocumentIsFetching,
    error: AccountDocumentError,
  } = useGetAllAccountingDocumentTrialBalanceReportQuery({
    query: querySearchParams,
  });

  // totalAmount
  const [debitsBeforeAmountTotal, setDebitsBeforeAmountTotal] = useState(0);
  useEffect(() => {
    let debitsBeforeAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      debitsBeforeAmountTemp += parsFloatFunction(element.debitsBefore, 2);
    });
    setDebitsBeforeAmountTotal(parsFloatFunction(debitsBeforeAmountTemp, 2));
  }, [AccountDocumentResult?.data]);

  const [creditsBeforeAmountTotal, setCreditsBeforeAmountTotal] = useState(0);
  useEffect(() => {
    let creditsBeforeAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      creditsBeforeAmountTemp += parsFloatFunction(element.creditsBefore, 2);
    });
    setCreditsBeforeAmountTotal(parsFloatFunction(creditsBeforeAmountTemp, 2));
  }, [AccountDocumentResult?.data]);

  const [debitsDurationAmountTotal, setDebitsDurationAmountTotal] = useState(0);
  useEffect(() => {
    let debitsDurationAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      debitsDurationAmountTemp += parsFloatFunction(element.debitsDuration, 2);
    });
    setDebitsDurationAmountTotal(
      parsFloatFunction(debitsDurationAmountTemp, 2)
    );
  }, [AccountDocumentResult?.data]);

  const [creditsDurationAmountTotal, setCreditsDurationAmountTotal] =
    useState(0);
  useEffect(() => {
    let creditsDurationAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      creditsDurationAmountTemp += parsFloatFunction(
        element.creditsDuration,
        2
      );
    });
    setCreditsDurationAmountTotal(
      parsFloatFunction(creditsDurationAmountTemp, 2)
    );
  }, [AccountDocumentResult?.data]);

  const [debitsNowAmountTotal, setDebitsNowAmountTotal] = useState(0);
  useEffect(() => {
    let debitsNowAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      debitsNowAmountTemp += parsFloatFunction(element.debitsNow, 2);
    });
    setDebitsNowAmountTotal(parsFloatFunction(debitsNowAmountTemp, 2));
  }, [AccountDocumentResult?.data]);

  const [creditsNowAmountTotal, setCreditsNowAmountTotal] = useState(0);
  useEffect(() => {
    let creditsNowAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      creditsNowAmountTemp += parsFloatFunction(element.creditsNow, 2);
    });
    setCreditsNowAmountTotal(parsFloatFunction(creditsNowAmountTemp, 2));
  }, [AccountDocumentResult?.data]);

  const [debitsRemainAmountTotal, setDebitsRemainAmountTotal] = useState(0);
  useEffect(() => {
    let debitsRemainAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      debitsRemainAmountTemp += parsFloatFunction(element.debitsRemain, 2);
    });
    setDebitsRemainAmountTotal(parsFloatFunction(debitsRemainAmountTemp, 2));
  }, [AccountDocumentResult?.data]);

  const [creditsRemainAmountTotal, setCreditsRemainAmountTotal] = useState(0);
  useEffect(() => {
    let creditsRemainAmountTemp = 0;
    AccountDocumentResult?.data?.forEach((element) => {
      creditsRemainAmountTemp += parsFloatFunction(element.creditsRemain, 2);
    });
    setCreditsRemainAmountTotal(parsFloatFunction(creditsRemainAmountTemp, 2));
  }, [AccountDocumentResult?.data]);

  return (
    <>
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
                    <div className="row row-8">
                      <div className="content col-lg-4 col-md-6 col-12">
                        <div className="title">
                          <span> {t("گزارش")}</span>
                        </div>
                        <div className="wrapper">
                          <div>
                            <SelectBox
                              dataSource={reportDataSource}
                              rtlEnabled={i18n.dir() === "ltr" ? false : true}
                              onValueChanged={(e) =>
                                formik.setFieldValue("reportId", e.value)
                              }
                              className="selectBox"
                              noDataText={t("اطلاعات یافت نشد")}
                              valueExpr="reportId"
                              displayExpr="reportName"
                              itemRender={null}
                              placeholder=""
                              name="reportId"
                              id="reportId"
                              searchEnabled
                            />
                          </div>
                          {formik.touched.reportId && formik.errors.reportId ? (
                            <div className="error-msg">
                              {t(formik.errors.reportId)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className={`content col-lg-4 col-md-6 col-12 ${
                          formik.values.reportId === 3 ? "" : "hiddenReport"
                        }`}
                        onFocus={() => {
                          dateRef?.current?.closeCalendar();
                        }}
                      >
                        <div className="title">
                          <span> {t("تفضیلی")}</span>
                        </div>
                        <div className="wrapper">
                          <div>
                            <SelectBox
                              dataSource={detailedDataSource}
                              rtlEnabled={i18n.dir() === "ltr" ? false : true}
                              onValueChanged={(e) =>
                                formik.setFieldValue("detailedId", e.value)
                              }
                              className={`selectBox`}
                              noDataText={t("اطلاعات یافت نشد")}
                              valueExpr="detailedId"
                              displayExpr="detailedName"
                              itemRender={null}
                              placeholder=""
                              name="detailedId"
                              id="detailedId"
                              searchEnabled
                            />
                          </div>
                          {formik.touched.detailedId &&
                          formik.errors.detailedId ? (
                            <div className="error-msg">
                              {t(formik.errors.detailedId)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="content col-lg-4 col-md-6 col-12"
                        onFocus={() => {
                          dateRef?.current?.closeCalendar();
                        }}
                      >
                        <div className="title">
                          <span> {t("نوع گزارش")}</span>
                        </div>
                        <div className="wrapper">
                          <div>
                            <SelectBox
                              dataSource={reportTypeDataSource}
                              rtlEnabled={i18n.dir() === "ltr" ? false : true}
                              onValueChanged={(e) =>
                                formik.setFieldValue("reportTypeId", e.value)
                              }
                              className="selectBox"
                              noDataText={t("اطلاعات یافت نشد")}
                              valueExpr="reportTypeId"
                              displayExpr="reportTypeName"
                              itemRender={null}
                              placeholder=""
                              name="reportTypeId"
                              id="reportTypeId"
                              searchEnabled
                            />
                          </div>
                          {formik.touched.reportTypeId &&
                          formik.errors.reportTypeId ? (
                            <div className="error-msg">
                              {t(formik.errors.reportTypeId)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="content col-lg-4 col-md-6 col-12">
                        <div className="title">
                          <span>{t("شعبه")}</span>
                        </div>
                        <div className="wrapper">
                          <div>
                            <FormControl
                              className={"form-input p-0"}
                              sx={{ direction: i18n.dir(), width: "100%" }}
                            >
                              <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                className={
                                  i18n.dir() === "rtl" ? "rtl-select" : ""
                                }
                                multiple
                                value={formik.values?.branchId}
                                onChange={handleChange}
                                input={<Input />}
                                renderValue={(selected) => {
                                  if (selected.includes(-1)) {
                                    return "همه";
                                  }
                                  const selectedBranches = selected.map(
                                    (item) => {
                                      const obj = branches?.find(
                                        (f) => f.branchId === item
                                      );
                                      return obj?.displayName;
                                    }
                                  );
                                  return selectedBranches.join(", ");
                                }}
                                sx={{
                                  direction: i18n.dir(),
                                  width: "100%",
                                  "&:before": { display: "none" },
                                  "&:after": { display: "none" },
                                }}
                              >
                                <MenuItem
                                  style={{ direction: "rtl" }}
                                  // className={
                                  //   i18n.dir() === "rtl" ? "rtl-select" : ""
                                  // }
                                  value={-1}
                                >
                                  <Checkbox
                                    size="small"
                                    style={{ padding: "5px" }}
                                    indeterminate={
                                      formik.values?.branchId.length > 0 &&
                                      !formik.values?.branchId.includes(-1) &&
                                      formik.values?.branchId.length !==
                                        branches.length
                                    }
                                    checked={
                                      formik.values?.branchId?.length ==
                                      branches?.length
                                    }
                                    onChange={(event) => {
                                      const checked = event.target.checked;
                                      const updatedBranchId = checked
                                        ? branches.map(
                                            (branch) => branch.branchId
                                          )
                                        : [];
                                      formik.setFieldValue(
                                        "branchId",
                                        updatedBranchId
                                      );
                                    }}
                                  />
                                  <ListItemText
                                    style={{ textAlign: "right" }}
                                    primary="همه"
                                  />
                                </MenuItem>
                                {branches?.map((item) => (
                                  <MenuItem
                                    key={item?.branchId}
                                    value={item?.branchId}
                                    sx={{
                                      direction: i18n.dir(),
                                      textAlign:
                                        i18n.dir() === "rtl" ? "right" : "left",
                                    }}
                                  >
                                    <Checkbox
                                      checked={
                                        formik.values?.branchId.indexOf(
                                          item?.branchId
                                        ) > -1
                                      }
                                      size="small"
                                      sx={{
                                        direction: i18n.dir(),
                                        padding: "5px",
                                      }}
                                      onChange={(event) => {
                                        const checked = event.target.checked;
                                        const selectedBranches = [
                                          ...formik.values?.branchId,
                                        ];
                                        if (checked) {
                                          selectedBranches.push(item?.branchId);
                                        } else {
                                          const index =
                                            selectedBranches.indexOf(
                                              item?.branchId
                                            );
                                          if (index > -1) {
                                            selectedBranches.splice(index, 1);
                                          }
                                        }
                                        if (selectedBranches.includes("")) {
                                          selectedBranches.splice(
                                            selectedBranches.indexOf(""),
                                            1
                                          );
                                        }
                                        formik.setFieldValue(
                                          "branchId",
                                          selectedBranches
                                        );
                                      }}
                                    />
                                    <ListItemText
                                      className={"multiselect-text"}
                                      primary={item.displayName}
                                      sx={{ direction: i18n.dir() }}
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          {formik.touched?.branchId &&
                          formik.errors?.branchId ? (
                            <div className="error-msg">
                              {t(formik?.errors.branchId)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div
                        className="content col-lg-4 col-md-6 col-12"
                        onFocus={() => {
                          dateRef2?.current?.closeCalendar();
                        }}
                      >
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
                            value={
                              formik.values.DocumentDate[0] !== null
                                ? new Date(formik.values.DocumentDate[0])
                                : ""
                            }
                            calendar={renderCalendarSwitch(i18n.language)}
                            locale={renderCalendarLocaleSwitch(i18n.language)}
                            onBlur={formik.handleBlur}
                            onChange={(val) => {
                              formik.setFieldValue(
                                `DocumentDate[0]`,
                                julianIntToDate(val.toJulianDay())
                              );
                            }}
                          />
                          <div
                            className={`modal-action-button  ${
                              i18n.dir() === "ltr" ? "action-ltr" : ""
                            }`}
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <CalendarMonthIcon className="calendarButton" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content col-lg-4 col-md-6 col-12">
                        <div className="title">
                          <span>{t("تا")}</span>
                        </div>
                        <div className="wrapper date-picker position-relative">
                          <DatePicker
                            name={"endDate"}
                            id={"endDate"}
                            ref={dateRef2}
                            editable={false}
                            value={
                              formik.values.DocumentDate[1] !== null
                                ? new Date(formik.values.DocumentDate[1])
                                : ""
                            }
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
                            }}
                          />
                          <div
                            className={`modal-action-button  ${
                              i18n.dir() === "ltr" ? "action-ltr" : ""
                            }`}
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              {formik.values.DocumentDate[1] ? (
                                <button
                                  type="button"
                                  className="clearButton"
                                  onClick={() => {
                                    handleClearDate("endDate");
                                  }}
                                >
                                  <CancelIcon />
                                </button>
                              ) : (
                                " "
                              )}
                              <CalendarMonthIcon className="calendarButton" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="content col-lg-4 col-md-6 col-12">
                        <div className="title">
                          <span>{t("نوع سند")}</span>
                        </div>
                        <div className="wrapper">
                          <div>
                            <FormControl
                              className={"form-input p-0"}
                              sx={{ direction: i18n.dir(), width: "100%" }}
                            >
                              <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                className={
                                  i18n.dir() === "rtl" ? "rtl-select" : ""
                                }
                                multiple
                                value={formik.values?.DocumentTypeId}
                                onChange={handleChange2}
                                input={<Input />}
                                renderValue={(selected) => {
                                  if (selected.includes(-1)) {
                                    return "همه";
                                  }
                                  const selectedDocument = selected.map(
                                    (item) => {
                                      const obj =
                                        documentDefinitionDatasource?.find(
                                          (f) => f.documentDefinitionId === item
                                        );
                                      return obj?.displayName;
                                    }
                                  );
                                  return selectedDocument.join(", ");
                                }}
                                sx={{
                                  direction: i18n.dir(),
                                  width: "100%",
                                  "&:before": { display: "none" },
                                  "&:after": { display: "none" },
                                }}
                              >
                                <MenuItem
                                  style={{ direction: "rtl" }}
                                  // className={
                                  //   i18n.dir() === "rtl" ? "rtl-select" : ""
                                  // }
                                  value={-1}
                                >
                                  <Checkbox
                                    size="small"
                                    style={{ padding: "5px" }}
                                    indeterminate={
                                      formik.values?.DocumentTypeId.length >
                                        0 &&
                                      !formik.values?.DocumentTypeId.includes(
                                        -1
                                      ) &&
                                      formik.values?.DocumentTypeId.length !==
                                        documentDefinitionDatasource.length
                                    }
                                    checked={
                                      formik.values?.DocumentTypeId?.length ==
                                      documentDefinitionDatasource?.length
                                    }
                                    onChange={(event) => {
                                      const checked = event.target.checked;
                                      const updatedDocumentId = checked
                                        ? documentDefinitionDatasource.map(
                                            (document) =>
                                              document.documentDefinitionId
                                          )
                                        : [];
                                      formik.setFieldValue(
                                        "DocumentTypeId",
                                        updatedDocumentId
                                      );
                                    }}
                                  />
                                  <ListItemText
                                    style={{ textAlign: "right" }}
                                    primary="همه"
                                  />
                                </MenuItem>
                                {documentDefinitionDatasource?.map((item) => (
                                  <MenuItem
                                    key={item?.documentDefinitionId}
                                    value={item?.documentDefinitionId}
                                    sx={{
                                      direction: i18n.dir(),
                                      textAlign:
                                        i18n.dir() === "rtl" ? "right" : "left",
                                    }}
                                  >
                                    <Checkbox
                                      checked={
                                        formik.values?.DocumentTypeId.indexOf(
                                          item?.documentDefinitionId
                                        ) > -1
                                      }
                                      size="small"
                                      sx={{
                                        direction: i18n.dir(),
                                        padding: "5px",
                                      }}
                                      onChange={(event) => {
                                        const checked = event.target.checked;
                                        const selectedDocuments = [
                                          ...formik.values?.DocumentTypeId,
                                        ];
                                        if (checked) {
                                          selectedDocuments.push(
                                            item?.documentDefinitionId
                                          );
                                        } else {
                                          const index =
                                            selectedDocuments.indexOf(
                                              item?.documentDefinitionId
                                            );
                                          if (index > -1) {
                                            selectedDocuments.splice(index, 1);
                                          }
                                        }
                                        if (selectedDocuments.includes("")) {
                                          selectedDocuments.splice(
                                            selectedDocuments.indexOf(""),
                                            1
                                          );
                                        }
                                        formik.setFieldValue(
                                          "DocumentTypeId",
                                          selectedDocuments
                                        );
                                      }}
                                    />
                                    <ListItemText
                                      className={"multiselect-text"}
                                      primary={item.displayName}
                                      sx={{ direction: i18n.dir() }}
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          {formik.touched?.DocumentTypeId &&
                          formik.errors?.DocumentTypeId ? (
                            <div className="error-msg">
                              {t(formik?.errors.DocumentTypeId)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="content col-lg-2 col-md-6 col-12">
                        <div className="title">
                          <span> {t("‌")}</span>
                        </div>

                        <FormGroup>
                          <FormControlLabel
                            style={{ fontSize: "12px" }}
                            control={
                              <Checkbox
                                style={{ fontSize: "12px" }}
                                checked={
                                  formik.values.showArticlesWithZeroRemain
                                }
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `showArticlesWithZeroRemain`,
                                    e.target.checked
                                  );
                                }}
                                onBlur={formik.handleBlur}
                                name="showArticlesWithZeroRemain"
                                id="showArticlesWithZeroRemain"
                              />
                            }
                            label="نمایش حساب‌ها با مانده صفر"
                          />
                        </FormGroup>
                      </div>
                      <div className="content col-lg-2 col-md-6 col-12">
                        <div className="title">
                          <span> {t("‌")}</span>
                        </div>

                        <FormGroup>
                          <FormControlLabel
                            style={{ fontSize: "12px" }}
                            control={
                              <Checkbox
                                style={{ fontSize: "12px" }}
                                checked={
                                  formik.values.showArticlesWithZeroTurnOver
                                }
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `showArticlesWithZeroTurnOver`,
                                    e.target.checked
                                  );
                                }}
                                disabled={formik.values.reportId===1  || formik.values.reportId===2}
                                onBlur={formik.handleBlur}
                                name="showArticlesWithZeroTurnOver"
                                id="showArticlesWithZeroTurnOver"
                              />
                            }
                            label="نمایش حساب‌ها با گردش صفر"
                          />
                        </FormGroup>
                      </div>
                      <div
                        className="d-flex justify-content-center"
                        style={{ marginTop: "30px" }}
                      >
                        <LoadingButton
                          variant="contained"
                          color="success"
                          type="button"
                          style={{ margin: "0 2px" }}
                          onClick={() => {
                            formik.setFieldValue("exportType", "excel");
                            formik.handleSubmit();
                          }}
                          loading={AccountDocumentIsFetching}
                        >
                          {t("ایجاد گزارش")}
                        </LoadingButton>
                      </div>
                      <div>
                        <div
                          style={
                            !AccountDocumentResult?.data?.length
                              ? { "pointer-events": "none" }
                              : {}
                          }
                        >
                          <div className="d-none">
                            <table
                              className="table table-bordered"
                              ref={tableRef}
                            >
                              <thead>
                                {formik.values.reportTypeId === 8 ? (
                                  <tr className="text-center">
                                    <th>{t("ردیف")}</th>
                                    <th>{t("کد‌حساب")}</th>
                                    <th style={{ display: "none" }}>
                                      {" "}
                                      {t("عنوان حساب")}{" "}
                                    </th>
                                    <th> {t("گردش قبل دوره بدهکار")} </th>
                                    <th> {t("گردش قبل دوره بستانکار")} </th>
                                    <th> {t("گردش طی دوره بدهکار")} </th>
                                    <th> {t("گردش طی دوره بستانکار")} </th>
                                    <th> {t("گردش تاکنون بدهکار")} </th>
                                    <th> {t("گردش تاکنون بستانکار")} </th>
                                    <th>{t("مانده تاکنون بدهکار")}</th>
                                    <th>{t("مانده تاکنون بستانکار")}</th>
                                  </tr>
                                ) : formik.values.reportTypeId === 6 ? (
                                  <tr className="text-center">
                                    <th>{t("ردیف")}</th>
                                    <th>{t("کد‌حساب")}</th>
                                    <th style={{ display: "none" }}>
                                      {" "}
                                      {t("عنوان حساب")}{" "}
                                    </th>
                                    <th> {t("گردش قبل دوره بدهکار")} </th>
                                    <th> {t("گردش قبل دوره بستانکار")} </th>
                                    <th> {t("گردش طی دوره بدهکار")} </th>
                                    <th> {t("گردش طی دوره بستانکار")} </th>
                                    <th>{t("مانده تاکنون بدهکار")}</th>
                                    <th>{t("مانده تاکنون بستانکار")}</th>
                                  </tr>
                                ) : formik.values.reportTypeId === 4 ? (
                                  <tr className="text-center">
                                    <th>{t("ردیف")}</th>
                                    <th>{t("کد‌حساب")}</th>
                                    <th style={{ display: "none" }}>
                                      {" "}
                                      {t("عنوان حساب")}{" "}
                                    </th>
                                    <th> {t("گردش طی دوره بدهکار")} </th>
                                    <th> {t("گردش طی دوره بستانکار")} </th>
                                    <th>{t("مانده تاکنون بدهکار")}</th>
                                    <th>{t("مانده تاکنون بستانکار")}</th>
                                  </tr>
                                ) : (
                                  <tr className="text-center">
                                    <th>{t("ردیف")}</th>
                                    <th>{t("کد‌حساب")}</th>
                                    <th style={{ display: "none" }}>
                                      {" "}
                                      {t("عنوان حساب")}{" "}
                                    </th>
                                    <th>{t("مانده تاکنون بدهکار")}</th>
                                    <th>{t("مانده تاکنون بستانکار")}</th>
                                  </tr>
                                )}
                              </thead>
                              <tbody>
                                {AccountDocumentResult?.data?.map(
                                  (item, index) =>
                                    formik.values.reportTypeId === 8 ? (
                                      <tr>
                                        <td
                                          className="text-center"
                                          style={{
                                            verticalAlign: "middle",
                                            width: "30px",
                                          }}
                                        >
                                          {index + 1}
                                        </td>
                                        <td>{item.completeCode}</td>
                                        <td>{item.title}</td>
                                        <td>{item.debitsBefore}</td>
                                        <td>{item.creditsBefore}</td>
                                        <td>{item.debitsDuration}</td>
                                        <td>{item.creditsDuration}</td>
                                        <td>{item.debitsNow}</td>
                                        <td>{item.creditsNow}</td>
                                        <td>{item.debitsRemain}</td>
                                        <td>{item.creditsRemain}</td>
                                      </tr>
                                    ) : formik.values.reportTypeId === 6 ? (
                                      <tr>
                                        <td
                                          className="text-center"
                                          style={{
                                            verticalAlign: "middle",
                                            width: "30px",
                                          }}
                                        >
                                          {index + 1}
                                        </td>
                                        <td>{item.completeCode}</td>
                                        <td>{item.title}</td>
                                        <td>{item.debitsBefore}</td>
                                        <td>{item.creditsBefore}</td>
                                        <td>{item.debitsDuration}</td>
                                        <td>{item.creditsDuration}</td>
                                        <td>{item.debitsRemain}</td>
                                        <td>{item.creditsRemain}</td>
                                      </tr>
                                    ) : formik.values.reportTypeId === 4 ? (
                                      <tr>
                                        <td
                                          className="text-center"
                                          style={{
                                            verticalAlign: "middle",
                                            width: "30px",
                                          }}
                                        >
                                          {index + 1}
                                        </td>
                                        <td>{item.completeCode}</td>
                                        <td>{item.title}</td>
                                        <td>{item.debitsDuration}</td>
                                        <td>{item.creditsDuration}</td>
                                        <td>{item.debitsRemain}</td>
                                        <td>{item.creditsRemain}</td>
                                      </tr>
                                    ) : (
                                      <tr>
                                        <td
                                          className="text-center"
                                          style={{
                                            verticalAlign: "middle",
                                            width: "30px",
                                          }}
                                        >
                                          {index + 1}
                                        </td>
                                        <td>{item.completeCode}</td>
                                        <td>{item.title}</td>
                                        <td>{item.debitsRemain}</td>
                                        <td>{item.creditsRemain}</td>
                                      </tr>
                                    )
                                )}
                              </tbody>
                              <tfoot>
                                <tr>
                                  {formik.values.reportTypeId === 8 ? (
                                    <>
                                      <td>{t("جمع")}:</td>
                                      <td />
                                      <td />
                                      <td>{debitsBeforeAmountTotal}</td>
                                      <td>{creditsBeforeAmountTotal}</td>
                                      <td>{debitsDurationAmountTotal}</td>
                                      <td>{creditsDurationAmountTotal}</td>
                                      <td>{debitsNowAmountTotal}</td>
                                      <td>{creditsNowAmountTotal}</td>
                                      <td>{debitsRemainAmountTotal}</td>
                                      <td>{creditsRemainAmountTotal}</td>
                                    </>
                                  ) : formik.values.reportTypeId === 6 ? (
                                    <>
                                      <td>{t("جمع")}:</td>
                                      <td />
                                      <td />
                                      <td>{debitsBeforeAmountTotal}</td>
                                      <td>{creditsBeforeAmountTotal}</td>
                                      <td>{debitsDurationAmountTotal}</td>
                                      <td>{creditsDurationAmountTotal}</td>
                                      <td>{debitsRemainAmountTotal}</td>
                                      <td>{creditsRemainAmountTotal}</td>
                                    </>
                                  ) : formik.values.reportTypeId === 4 ? (
                                    <>
                                      <td>{t("جمع")}:</td>
                                      <td />
                                      <td />
                                      <td>{debitsDurationAmountTotal}</td>
                                      <td>{creditsDurationAmountTotal}</td>
                                      <td>{debitsRemainAmountTotal}</td>
                                      <td>{creditsRemainAmountTotal}</td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{t("جمع")}:</td>
                                      <td />
                                      <td />
                                      <td>{debitsRemainAmountTotal}</td>
                                      <td>{creditsRemainAmountTotal}</td>
                                    </>
                                  )}
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                          <DownloadTableExcel
                            filename={t("گزارش تراز معین")}
                            sheet="cheque"
                            currentTableRef={tableRef.current}
                          >
                            <Button
                              variant="contained"
                              style={{ marginRight: "5px" }}
                              color="primary"
                              disabled={!AccountDocumentResult?.data?.length}
                              onClick={handleExportToPDF}
                            >
                              {t("ارسال به Excel")}
                            </Button>
                          </DownloadTableExcel>
                          <Button
                            variant="contained"
                            style={{ marginRight: "15px" }}
                            color="primary"
                            disabled={!AccountDocumentResult?.data?.length}
                            onClick={() => {
                              formik.setFieldValue("exportType", "pdf");
                              formik.handleSubmit();
                            }}
                          >
                            {t("ارسال به Pdf")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`button-pos ${
                      i18n.dir == "ltr" ? "ltr" : "rtl"
                    }`}
                  ></div>
                </form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
