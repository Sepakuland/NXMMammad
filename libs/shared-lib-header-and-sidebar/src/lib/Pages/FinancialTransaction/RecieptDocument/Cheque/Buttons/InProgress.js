import { useTheme } from "@emotion/react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import * as Yup from "yup";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import {
  renderCalendarLocaleSwitch,
  renderCalendarSwitch,
} from "../../../../../utils/calenderLang";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SelectBox } from "devextreme-react";
import { BankData, ChequeSerialLookUp } from "./bankdata.js";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import CurrencyInput from "react-currency-input-field";
import DeleteIcon from "@mui/icons-material/Delete";
import { parsFloatFunction } from "../../../../../utils/parsFloatFunction";
import { history } from "../../../../../utils/history";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { getLangDate } from "../../../../../utils/getLangDate";
import Guid from "devextreme/core/guid";
import {
  findNextFocusable,
  findPreviousFocusable,
  MoveNext,
  MovePrevious,
} from "../../../../../utils/gridKeyboardNav3";

const InProgress = () => {
  const emptyCheque = {
    formikId: new Guid().valueOf(),
    serial: "",
    BackNumber: "",
    maturity: "",
    bankCode: "",
    bankName: "",
    amount: "",
    partnerCode: "",
    partnerName: "",
    legalName: "",
    description: "",
  };
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = excelData;

  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 100000),
      date: julianIntToDate(new DateObject().toJulianDay()),
      accountNumber: "",
      chequeReceived: [emptyCheque],
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      date: Yup.date().required("وارد کردن تاریخ سند الزامی است"),
      accountNumber: Yup.string().required("حساب بانکی الزامی است"),
      chequeReceived: Yup.array(
        Yup.object({
          serial: Yup.string().required("سریال چک الزامی است"),
        })
      ),
    }),
    onSubmit: (values) => {
      let allValues = values;

      DocumentSub();
      console.log("All Values:", allValues);
    },
  });
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
  function CallCancellComponent() {
    history.navigate(
      `/FinancialTransaction/receiptDocument/Cheque/DisplayDetails`
    );
  }
  const callComponent = () => {
    window.open(
      `/FinancialTransaction/receiptDocument/Cheque/ExportToPDFPageIP?lang=${i18n.language}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  ////////////////////////////////////
  const tableRef = useRef(null);

  const [serialOpen, setserialOpen] = useState(false);
  const [click, setClick] = useState(false);
  const [chequeFocusedRow, setChequeFocusedRow] = useState(1);
  function addChequeReceivedRow() {
    formik.setFieldValue("chequeReceived", [
      ...formik.values.chequeReceived,
      emptyCheque,
    ]);
  }
  function RenderSerialOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setserialOpen(state);
    } else {
      setserialOpen(false);
    }
  }

  function serialKeyDownHandler(e) {
    let next = e.target.closest("td").nextSibling;
    while (
      next.cellIndex !== next.closest("tr").children.length - 1 &&
      (next.querySelector("button") || next.querySelector("input").disabled)
    ) {
      next = findNextFocusable(next);
    }

    let prev = e.target.closest("td").previousSibling;
    while (
      prev.cellIndex !== 0 &&
      (prev.querySelector("button") || prev.querySelector("input").disabled)
    ) {
      prev = findPreviousFocusable(prev);
    }

    if (e.keyCode === 40 && serialOpen === false) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.chequeReceived.length === chequeFocusedRow) {
        addChequeReceivedRow();
        setTimeout(() => {
          let temp =
            next.closest("tr").nextSibling.children[
              e.target.closest("td").cellIndex
            ];
          while (
            temp.cellIndex !== temp.closest("tr").children.length - 1 &&
            (temp.querySelector("button") ||
              temp.querySelector("input").disabled)
          ) {
            temp = findNextFocusable(temp);
          }
          temp.querySelector("input").focus();
          temp.querySelector("input").select();
        }, 0);
      } else {
        let down = e.target
          .closest("tr")
          .nextSibling.children[e.target.closest("td").cellIndex].querySelector(
            "input"
          );
        down.focus();
        down.select();
      }
    }
    if (e.keyCode === 38 && serialOpen === false) {
      /* Up ArrowKey */
      e.preventDefault();
      let up = e.target
        .closest("tr")
        .previousSibling.children[
          e.target.closest("td").cellIndex
        ].querySelector("input");
      up.focus();
      up.select();
    }

    if (e.keyCode === 39) {
      /* Right ArrowKey */
      i18n.dir() === "rtl"
        ? MovePrevious(prev)
        : MoveNext(
            formik.values.chequeReceived,
            addChequeReceivedRow,
            next,
            chequeFocusedRow
          );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
            formik.values.chequeReceived,
            addChequeReceivedRow,
            next,
            chequeFocusedRow
          );
    }
    if (e.keyCode === 13 && serialOpen === false) {
      /* Enter */
      MoveNext(
        formik.values.chequeReceived,
        addChequeReceivedRow,
        next,
        chequeFocusedRow
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      MoveNext(
        formik.values.chequeReceived,
        addChequeReceivedRow,
        next,
        chequeFocusedRow
      );
    }
    if (e.keyCode === 9) {
      /* Tab */ /*MUST BECOME LANGUAGE DEPENDANT */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveNext(
          formik.values.chequeReceived,
          addChequeReceivedRow,
          next,
          chequeFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }
  function HandleChequeAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `chequeReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }
  const [chequeAmountTotal, setChequeAmountTotal] = useState(0);
  useEffect(() => {
    let chequeAmountTemp = 0;
    formik.values.chequeReceived.forEach((element) => {
      chequeAmountTemp += parsFloatFunction(element.amount, 2);
    });
    setChequeAmountTotal(parsFloatFunction(chequeAmountTemp, 2));
  }, [formik.values.chequeReceived]);
  ///////////////////////////////////

  console.log("error", formik.errors);
  console.log("value", formik.values);

  useEffect(() => {
    if (formik.values?.chequeReceived?.length) {
      let temp = formik.values.chequeReceived?.filter(
        (item) => item.serial != ""
      );
      localStorage.setItem(`cheque`, JSON.stringify(temp));
      setExcelData(temp);
    }
  }, [formik.values.chequeReceived]);

  return (
    <>
      <div
        className="form-template"
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <div>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-design">
                <div className="row">
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>
                        {" "}
                        {t("تاریخ")} <span className="star">*</span>
                      </span>
                    </div>
                    <div className="wrapper">
                      <div className="date-picker position-relative">
                        <DatePicker
                          name="date"
                          id="date"
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
                              "date",
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
                            <CalendarMonthIcon className="calendarButton modal" />
                          </div>
                        </div>
                      </div>
                      {formik.touched.date &&
                      formik.errors.date &&
                      !formik.values.date ? (
                        <div className="error-msg">{t(formik.errors.date)}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span> {t("حساب بانکی")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <SelectBox
                          dataSource={BankData}
                          rtlEnabled={i18n.dir() === "ltr" ? false : true}
                          onValueChanged={(e) => {
                            formik.setFieldValue("accountNumber", e.value);
                          }}
                          className="selectBox"
                          noDataText={t("اطلاعات یافت نشد")}
                          itemRender={null}
                          placeholder=""
                          displayExpr={function (item) {
                            return (
                              item &&
                              item.Code +
                                "- " +
                                item.Name +
                                "- " +
                                item.BankAccountNumber
                            );
                          }}
                          valueExpr="Code"
                          name="accountNumber"
                          id="accountNumber"
                          showClearButton
                        />
                        {formik.touched.accountNumber &&
                        formik.errors.accountNumber &&
                        !formik.values.accountNumber ? (
                          <div className="error-msg">
                            {t(formik.errors.accountNumber)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-12 col-12">
                    {/* Cheque Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("چک‌ها")} :</span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={(e) => {
                              addChequeReceivedRow();
                              setTimeout(() => {
                                let added = e.target
                                  .closest("div")
                                  .parentElement.nextSibling.querySelector(
                                    "tbody tr:last-child td:nth-child(2)"
                                  );
                                while (
                                  added.querySelector("button") ||
                                  added.querySelector("input").disabled
                                ) {
                                  added = findNextFocusable(added);
                                }
                                added.querySelector("input").focus();
                              }, 0);
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </div>
                      </div>
                      <div className="content col-lg-12 col-12">
                        <div
                          className={`table-responsive gridRow ${
                            theme.palette.mode === "dark" ? "dark" : ""
                          }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("سریال")}</th>
                                <th> {t("پشت نمره")} </th>
                                <th> {t("سررسید")} </th>
                                <th> {t("کد بانک")} </th>
                                <th> {t("نام بانک")} </th>
                                <th> {t("مبلغ")} </th>
                                <th> {t("کد طرف حساب")} </th>
                                <th>{t("نام طرف حساب")}</th>
                                <th>{t("نام حقوقی")}</th>
                                <th>{t("توضیحات")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="chequeReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.chequeReceived?.map(
                                      (chequeReceives, index) => (
                                        <tr
                                          key={chequeReceives.formikId}
                                          onFocus={(e) =>
                                            setChequeFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            chequeFocusedRow === index + 1
                                              ? "focus-row-bg"
                                              : ""
                                          }
                                        >
                                          <td
                                            className="text-center"
                                            style={{
                                              verticalAlign: "middle",
                                              width: "40px",
                                            }}
                                          >
                                            {index + 1}
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                id="serial"
                                                name={`chequeReceived.${index}.serial`}
                                                options={ChequeSerialLookUp}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.ChequeCode} -{" "}
                                                    {option.BackNumber} -{" "}
                                                    {option.PartnerName} -
                                                    {option.MaturityDate} -
                                                    {option.BankName} -{" "}
                                                    {option.InputPrice}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.ChequeCode.includes(
                                                        state.inputValue.toLowerCase()
                                                      ) ||
                                                      element.BackNumber.includes(
                                                        state.inputValue.toLowerCase()
                                                      ) ||
                                                      element.PartnerName.replace(
                                                        "/",
                                                        ""
                                                      )
                                                        .toLowerCase()
                                                        .includes(
                                                          state.inputValue.toLowerCase()
                                                        ) ||
                                                      element.BankName.replace(
                                                        "/",
                                                        ""
                                                      )
                                                        .toLowerCase()
                                                        .includes(
                                                          state.inputValue.toLowerCase()
                                                        )
                                                    )
                                                      newOptions.push(element);
                                                  });
                                                  return newOptions;
                                                }}
                                                getOptionLabel={(option) =>
                                                  option.ChequeCode
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 150,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
                                                    },
                                                  },
                                                }}
                                                sx={{
                                                  direction: i18n.dir(),
                                                  position: "relative",
                                                  background: "#e9ecefd2",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  chequeFocusedRow === index + 1
                                                    ? serialOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderSerialOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderSerialOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderSerialOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].serial`,
                                                    value.ChequeCode
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].BackNumber`,
                                                    value.BackNumber
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].maturity`,
                                                    value.MaturityDate
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].bankCode`,
                                                    value.BankCode
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].bankName`,
                                                    value.BankName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].amount`,
                                                    value.InputPrice
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].partnerCode`,
                                                    value.PartnerCode
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].partnerName`,
                                                    value.PartnerName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].legalName`,
                                                    value.PartnerLegalName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].description`,
                                                    value.DocumentDescription
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderSerialOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    serialOpen[index] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderSerialOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  serialKeyDownHandler(e);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (serialRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, ser, chequeBranchNameRefs, chequeBankNameRefs)}
                                              name={`chequeReceived.${index}.BackNumber`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].BackNumber
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeBranchNameRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeBranchNameRefs, chequeIssuancePlaceRefs, chequeBranchCodeRefs)}
                                              name={`chequeReceived.${index}.maturity`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].maturity
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeIssuancePlaceRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeIssuancePlaceRefs, chequeSerialRefs, chequeBranchNameRefs)}
                                              name={`chequeReceived.${index}.bankCode`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].bankCode
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeSerialRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeSerialRefs, chequeAccountNumberRefs, chequeIssuancePlaceRefs)}
                                              name={`chequeReceived.${index}.bankName`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].bankName
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              // ref={el => (ser.current[index] = el)}
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeAmountRefs, chequeGiverRefs, chequeMaturityRefs)}
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="amount"
                                              name={`chequeReceived.${index}.amount`}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].amount
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleChequeAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              disabled
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeGiverRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeGiverRefs, chequeCashRefs, chequeAmountRefs)}
                                              name={`chequeReceived.${index}.partnerCode`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].partnerCode
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeGiverRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeGiverRefs, chequeCashRefs, chequeAmountRefs)}
                                              name={`chequeReceived.${index}.partnerName`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].partnerName
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeGiverRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeGiverRefs, chequeCashRefs, chequeAmountRefs)}
                                              name={`chequeReceived.${index}.legalName`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].legalName
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              // ref={el => (chequeGiverRefs.current[index] = el)}
                                              className="form-input"
                                              // onKeyDown={(e) => serialKeyDownHandler(e, index, chequeGiverRefs, chequeCashRefs, chequeAmountRefs)}
                                              name={`chequeReceived.${index}.description`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].description
                                              }
                                              autoComplete="off"
                                              disabled
                                            />
                                          </td>
                                          <td style={{ width: "40px" }}>
                                            <IconButton
                                              variant="contained"
                                              color="error"
                                              className="kendo-action-btn"
                                              onClick={() => {
                                                setChequeAmountTotal(
                                                  chequeAmountTotal -
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .amount
                                                );
                                                remove(index);
                                              }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </React.Fragment>
                                )}
                              ></FieldArray>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td>{t("جمع")}:</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="chequeAmountTotal"
                                    disabled
                                    value={chequeAmountTotal}
                                    name={`chequeReceived.chequeAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td />
                                <td />
                                <td />
                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {formik?.errors?.chequeReceived?.map((error, index) => (
                          <p className="error-msg" key={index}>
                            {error
                              ? ` ${t("ردیف")} ${index + 1} : ${
                                  error?.serial ? t(error.serial) : ""
                                }`
                              : null}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormikProvider>
          <div
            className="button-export col-12 justify-content-end d-flex"
            style={{ paddingLeft: " 20px", paddingRight: "20px" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={() => {
                callComponent();
              }}
              disabled={!excelData?.length}
            >
              {t("چاپ")}
            </Button>
            <div style={!excelData?.length ? { "pointer-events": "none" } : {}}>
              <div className="d-none">
                <table className="table table-bordered" ref={tableRef}>
                  <thead>
                    <tr className="text-center">
                      <th>{t("ردیف")}</th>
                      <th>{t("سریال")}</th>
                      <th> {t("پشت نمره")} </th>
                      <th> {t("سررسید")} </th>
                      <th> {t("کد بانک")} </th>
                      <th> {t("نام بانک")} </th>
                      <th> {t("مبلغ")} </th>
                      <th> {t("کد طرف حساب")} </th>
                      <th>{t("نام طرف حساب")}</th>
                      <th>{t("نام حقوقی")}</th>
                      <th>{t("توضیحات")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelData?.map((chequeReceives, index) => (
                      <tr
                        key={index}
                        onFocus={(e) =>
                          setChequeFocusedRow(e.target.closest("tr").rowIndex)
                        }
                        className={
                          chequeFocusedRow === index + 1 ? "focus-row-bg" : ""
                        }
                      >
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle", width: "30px" }}
                        >
                          {index + 1}
                        </td>
                        <td>{chequeReceives.serial}</td>
                        <td>{chequeReceives.BackNumber}</td>
                        <td>
                          {getLangDate(i18n.language, chequeReceives.maturity)}
                        </td>
                        <td>{chequeReceives.bankCode}</td>
                        <td>{chequeReceives.bankName}</td>
                        <td>{chequeReceives.amount}</td>
                        <td>{chequeReceives.partnerCode}</td>
                        <td>{chequeReceives.partnerName}</td>
                        <td>{chequeReceives.legalName}</td>
                        <td>{chequeReceives.description}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>{t("جمع")}:</td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td>{chequeAmountTotal}</td>
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
              <DownloadTableExcel
                filename={t("درجریان وصول")}
                sheet="cheque"
                currentTableRef={tableRef.current}
              >
                <Button
                  variant="contained"
                  style={{ marginRight: "5px" }}
                  color="primary"
                  disabled={!excelData?.length}
                >
                  {t("ارسال به Excel")}
                </Button>
              </DownloadTableExcel>
            </div>
          </div>
        </div>
      </div>
      <div className="row align-items-end">
        <div className="col-4"></div>
        <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
          <Button
            variant="contained"
            color="success"
            type="button"
            onClick={() => {
              if (formik.errors.chequeReceived) {
                tableError();
              } else {
                setClick(true);
              }
              formik.handleSubmit();
            }}
          >
            {t("تایید")}
          </Button>
          <div className="Issuance">
            <Button
              variant="contained"
              style={{ marginRight: "5px" }}
              color="error"
              onClick={CallCancellComponent}
            >
              {t("انصراف")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InProgress;
