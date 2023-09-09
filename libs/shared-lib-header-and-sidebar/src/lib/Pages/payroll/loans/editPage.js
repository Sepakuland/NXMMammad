import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import { julianIntToDate } from "../../../utils/dateConvert";
import * as Yup from "yup";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../utils/calenderLang";
import { definedAccounts, } from "./datasources";
import { Button, IconButton, useTheme, } from "@mui/material";
import swal from "sweetalert";
import { parsFloatFunction } from "../../../utils/parsFloatFunction";
import Guid from "devextreme/core/guid";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SelectBox } from "devextreme-react";
import CurrencyInput from "react-currency-input-field";
import DeleteIcon from "@mui/icons-material/Delete";
import Input from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious, } from "../../../utils/gridKeyboardNav3";
import { getLangDate } from "../../../utils/getLangDate";
import { toFixedWithoutZeros } from "../../../utils/toFixedWithoutZeros";

export default function ReceiptDocument() {
  const emptyRepayment = {
    formikId: new Guid().valueOf(),
    month: "",
    amount: 0,
  };

  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const dateRef1 = useRef();
  const [date, setDate] = useState(new DateObject());
  const dateRef2 = useRef();
  const [date2, setDate2] = useState();
  const [click, setClick] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 100000),
      repaymentReceived: [],
      title: "",
      Personnel: "",
      startDate: "",
      documentDescribe: "",
      LoanInstallment: "",
      addPercentagePrice: "",
      addAmountPrice: "",
      endDate: julianIntToDate(new DateObject().toJulianDay()),
      loanAmount: "",
    },
    validationSchema: Yup.object({
      Personnel: Yup.string().required("وارد کردن این فیلد الزامیست"),
      title: Yup.string().required("وارد کردن این فیلد الزامیست"),
      moeinAccount: Yup.string().required("وارد کردن این فیلد الزامیست"),
    }),
    validateOnChange: false,
    onSubmit: (values) => {
      let allValues = values;

      DocumentSub();
      console.log("All Values:", allValues);
    },
  });
  console.log("formik.values.............", formik.values);
  const DocumentSub = () => {
    swal({
      title: t("سند با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };
  const emptyError = () => {
    swal({
      title: t("حداقل یک مورد دریافت باید ثبت گردد"),
      icon: "error",
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

  useEffect(() => {
    if (click) {
      tableError();
      setClick(false);
    }
  }, [
    formik.errors.cashReceived,
    formik.errors.bankReceived,
    formik.errors.chequeReceived,
  ]);
  console.log("errors", formik.errors);

  function createArr() {
    console.log("onBlur");
    if (
      formik.values.loanAmount !== "" &&
      formik.values.addAmountPrice !== "" &&
      formik.values.LoanInstallment !== "" &&
      formik.values.endDate !== ""
    ) {
      let arr = [];
      let amount = parseFloat(formik.values.loanAmount, 2) + parseFloat(formik.values.addAmountPrice, 2)
      let cost =
        amount /
        parseFloat(formik.values.LoanInstallment, 2);

      let mod =
        amount %
        parseFloat(formik.values.LoanInstallment, 2);



      let date = new Date(getLangDate("en", `${formik.values.endDate}/01`));
      let month = date.getMonth();
      let year = date.getFullYear();
      for (let i = 0; i < Math.floor(cost) + 1; i++) {
        let m =
          i % 12 !== 0
            ? date.setMonth(month + (i % 12))
            : date.setFullYear(
              year + i / 12,
              new Date(
                getLangDate("en", `${formik.values.endDate}/01`)
              ).getMonth()
            );
        let y = date.setFullYear(year + i / 12);
        let dateL = getLangDate(i18n.language, m);
        let dateS = dateL.split("/");
        let repaymentAmountTemp = 0;
        arr.forEach((element) => {
          repaymentAmountTemp += parseFloat(element.amount, 2);
        });
        let temp = {
          formikId: i,
          month: `${dateS[0]}/${dateS[1]}`,
          amount: i === Math.floor(cost) ? 0 : formik.values.LoanInstallment,
        };

        arr.push(temp);
      }
      formik.setFieldValue("repaymentReceived", arr);
      let repaymentAmountTemp = 0;
      arr.forEach((element) => {
        repaymentAmountTemp += parseFloat(element.amount, 2);
      });

      if (mod !== 0 && repaymentAmountTemp !== formik.values.loanAmount) {
        let remain =
          amount - repaymentAmountTemp;

        arr[arr.length - 1].amount = remain;
      } else {
        arr.splice(-1);
      }

      let repaymentAmountTotalFunc = 0;
      arr.forEach((element) => {
        repaymentAmountTotalFunc += parseFloat(element.amount, 2);
      });
      setRepaymentAmountTotal(parsFloatFunction(repaymentAmountTotalFunc, 2));
    }
  }

  function HandleLoanAmountChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("loanAmount", parsFloatFunction(temp, 2));
  }
  function HandleAddAmountPriceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("addAmountPrice", parsFloatFunction(temp, 2));
  }
  function HandleLoanInstallmentChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("LoanInstallment", parsFloatFunction(temp, 2));
  }

  const [chequeDues, setChequeDues] = useState(0);
  const [allPaymentsDues, setAllPaymentsDues] = useState(0);
  const [finalDues, setFinalDues] = useState(0);

  const NavigateToGrid = () => {
    navigate(`/Payroll/loans`, {
      replace: false,
    });
  };

  ///// Repayment Grid \\\\\

  const [repaymentFocusedRow, setRepaymentFocusedRow] = useState(1);

  const [repaymentMonthOpen, setRepaymentMonthOpen] = useState(false);

  function addRepaymentReceivedRow() {
    formik.setFieldValue("repaymentReceived", [
      ...formik.values.repaymentReceived,
      emptyRepayment,
    ]);
  }

  function RenderRepaymentMonthOpenState(index, state) {
    if (index === repaymentFocusedRow - 1) {
      setRepaymentMonthOpen(state);
    } else {
      setRepaymentMonthOpen(false);
    }
  }

  function HandleRepaymentAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `repaymentReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function repaymentKeyDownHandler(e) {
    let next = e.target.closest("td").nextSibling;
    while (
      next.cellIndex !== next.closest("tr").children.length - 1 &&
      (next.querySelector("button:not([aria-label='Clear'])") ||
        next.querySelector("input").disabled)
    ) {
      next = findNextFocusable(next);
    }

    let prev = e.target.closest("td").previousSibling;
    while (
      prev.cellIndex !== 0 &&
      (prev.querySelector("button:not([aria-label='Clear'])") ||
        prev.querySelector("input").disabled)
    ) {
      prev = findPreviousFocusable(prev);
    }

    if (e.keyCode === 40 && repaymentMonthOpen === false) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.repaymentReceived.length === repaymentFocusedRow) {
        addRepaymentReceivedRow();
        setTimeout(() => {
          let temp =
            next.closest("tr").nextSibling.children[
            e.target.closest("td").cellIndex
            ];
          while (
            temp.cellIndex !== temp.closest("tr").children.length - 1 &&
            (temp.querySelector("button:not([aria-label='Clear'])") ||
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
    if (e.keyCode === 38 && repaymentMonthOpen === false) {
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
          formik.values.repaymentReceived,
          addRepaymentReceivedRow,
          next,
          repaymentFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.repaymentReceived,
          addRepaymentReceivedRow,
          next,
          repaymentFocusedRow
        );
    }
    if (e.keyCode === 13 && repaymentMonthOpen === false) {
      /* Enter */
      MoveNext(
        formik.values.repaymentReceived,
        addRepaymentReceivedRow,
        next,
        repaymentFocusedRow
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      next.querySelector("input").focus();
    }
    if (e.keyCode === 9) {
      /* Tab */ /*MUST BECOME LANGUAGE DEPENDANT */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveNext(
          formik.values.repaymentReceived,
          addRepaymentReceivedRow,
          next,
          repaymentFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }

  const [repaymentAmountTotal, setRepaymentAmountTotal] = useState(0);

  function CalculateRepaymentAmountTotal() {
    let repaymentAmountTemp = 0;
    formik.values.repaymentReceived.forEach((element) => {
      repaymentAmountTemp += element.amount;
    });
    setRepaymentAmountTotal(parsFloatFunction(repaymentAmountTemp, 2));
  }

  ///// End of Repayment Grid \\\\\

  console.log("formik.values", formik.values);
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
                        {t("عنوان")} <span className="star">*</span>
                      </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="title"
                          name="title"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.title}
                        />
                        {formik.touched.title && formik.errors.title ? (
                          <div className="error-msg">
                            {t(formik.errors.title)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>
                        {t("پرسنل")}
                        <span className="star">*</span>
                      </span>
                    </div>
                    <SelectBox
                      dataSource={definedAccounts}
                      rtlEnabled={i18n.dir() == "ltr" ? false : true}
                      onValueChanged={(e) =>
                        formik.setFieldValue("Personnel", e.value)
                      }
                      valueExpr="PersonnelName"
                      displayExpr={function (item) {
                        return item && item.PersonnelName;
                      }}
                      className="selectBox"
                      noDataText={t("اطلاعات یافت نشد")}
                      itemRender={null}
                      placeholder=""
                      name="Personnel"
                      id="Personnel"
                      searchEnabled
                      showClearButton
                    //   defaultValue={definedAccounts[0].PersonnelName}
                    />
                    {formik.touched.Personnel && formik.errors.Personnel ? (
                      <div className="error-msg">
                        {t(formik.errors.Personnel)}
                      </div>
                    ) : null}
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>
                        {t("تاریخ دریافت")}
                        <span className="star">*</span>
                      </span>
                    </div>
                    <div className="wrapper date-picker position-relative">
                      <DatePicker
                        name={"startDate"}
                        id={"startDate"}
                        ref={dateRef1}
                        editable={false}
                        value={date}
                        calendar={renderCalendarSwitch(i18n.language)}
                        locale={renderCalendarLocaleSwitch(i18n.language)}
                        onBlur={formik.handleBlur}
                        onChange={(val) => {
                          setDate(val);
                          formik.setFieldValue(
                            "startDate",
                            julianIntToDate(val.toJulianDay())
                          );
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
                  </div>

                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مبلغ وام")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="loanAmount"
                          name="loanAmount"
                          placeholder="0"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleLoanAmountChange(e.target.value)
                          }
                          onBlur={() => {
                            createArr();
                          }}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>{t("حساب معین")}</span>
                    </div>
                    <SelectBox
                      dataSource={definedAccounts}
                      rtlEnabled={i18n.dir() == "ltr" ? false : true}
                      onValueChanged={(e) =>
                        formik.setFieldValue("moeinAccount", e.value)
                      }
                      valueExpr="FormersNames"
                      displayExpr={function (item) {
                        return item && item.Code && item.FormersNames;
                      }}
                      className="selectBox"
                      noDataText={t("اطلاعات یافت نشد")}
                      itemRender={null}
                      placeholder=""
                      name="moeinAccount"
                      id="moeinAccount"
                      searchEnabled
                      showClearButton
                    //   defaultValue={definedAccounts[0].PersonnelName}
                    />
                    {formik.touched.moeinAccount &&
                      formik.errors.moeinAccount ? (
                      <div className="error-msg">
                        {t(formik.errors.moeinAccount)}
                      </div>
                    ) : null}
                  </div>

                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>{t("توضیحات")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <textarea
                          rows="8"
                          className="form-input"
                          id="documentDescribe"
                          name="documentDescribe"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.documentDescribe}
                        />
                        {formik.touched.documentDescribe &&
                          formik.errors.documentDescribe &&
                          !formik.values.documentDescribe ? (
                          <div className="error-msg">
                            {t(formik.errors.documentDescribe)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مبلغ قسط")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="LoanInstallment"
                          name="LoanInstallment"
                          placeholder="0"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleLoanInstallmentChange(e.target.value)
                          }
                          onBlur={() => {
                            createArr();
                          }}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>{t("شروع بازپرداخت")}</span>
                    </div>
                    <div className="wrapper date-picker position-relative">
                      <DatePicker
                        name={"endDate"}
                        id={"endDate"}
                        ref={dateRef2}
                        editable={false}
                        value={new DateObject(formik.values.endDate)}
                        calendar={renderCalendarSwitch(i18n.language)}
                        disabled={!formik.values.startDate}
                        minDate={new Date(formik.values.startDate)}
                        locale={renderCalendarLocaleSwitch(i18n.language)}
                        onBlur={() => {
                          formik.handleBlur();
                          createArr();
                        }}
                        onChange={(val) => {
                          formik.setFieldValue(
                            "endDate",
                            julianIntToDate(val.toJulianDay())
                          );
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
                  </div>



                  <div className="content col-lg-3 col-12">
                    <div className="title">
                      <span>{t("درصد سود باز پرداخت")}</span>
                    </div>
                    <div className="wrapper">
                      <CurrencyInput
                        className="form-input"
                        id="addPercentagePrice"
                        name="addPercentagePrice"
                        onBlur={() => {
                          createArr();
                        }}
                        value={formik.values.addPercentagePrice}
                        onValueChange={(value) => {
                          formik.setFieldValue(`addPercentagePrice`, value)
                          formik.setFieldValue(`addAmountPrice`, (parseFloat(value) * (parseFloat(formik.values.loanAmount)) / 100))
                        }}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="content col-lg-3 col-12">
                    <div className="title">
                      <span>{t("مبلغ سود باز پرداخت")}</span>
                    </div>
                    <div className="wrapper">
                      <CurrencyInput
                        className="form-input"
                        id="addAmountPrice"
                        name="addAmountPrice"
                        onBlur={() => {
                          createArr();
                          formik.handleBlur()
                        }}
                        onValueChange={(value) => {
                          // HandleAddAmountPriceChange(value)
                          // if (e.target.value) {
                          formik.setFieldValue(`addAmountPrice`, value)
                          formik.setFieldValue(`addPercentagePrice`, toFixedWithoutZeros(((parseFloat(value)) * (100)) / (parseFloat(formik.values.loanAmount)), 2))
                          // }
                        }}
                        value={formik.values.addAmountPrice}
                        type="text"
                        decimalsLimit={2}
                      // onChangeCapture={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="content col-lg-6 col-12"></div>

                  <div className="content col-lg-6 col-md-12 cl-xs-12 col-12">
                    {/* Repayment Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span">
                            {" "}
                            {t("اقساط بازپرداخت")} :
                          </span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          {/* <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={(e) => {
                              addRepaymentReceivedRow();
                              setTimeout(() => {
                                let added = e.target
                                  .closest("div")
                                  .parentElement.nextSibling.querySelector(
                                    "tbody tr:last-child td:nth-child(2)"
                                  );
                                while (
                                  added.querySelector(
                                    "button:not([aria-label='Clear'])"
                                  ) ||
                                  added.querySelector("input").disabled
                                ) {
                                  added = findNextFocusable(added);
                                }
                                added.querySelector("input").focus();
                              }, 0);
                            }}
                          >
                            <AddIcon />
                          </Button> */}
                        </div>
                      </div>
                      <div className="content col-lg-12 col-12">
                        <div
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("ماه")}</th>
                                <th>{t("مبلغ")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="repaymentReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.repaymentReceived?.map(
                                      (repaymentReceived, index) => (
                                        <tr
                                          key={repaymentReceived.formikId}
                                          onFocus={(e) =>
                                            setRepaymentFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            repaymentFocusedRow === index + 1
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
                                          <td style={{ minWidth: "90px" }}>
                                            <div
                                              onKeyDown={(e) =>
                                                repaymentKeyDownHandler(e)
                                              }
                                            >
                                              <Input
                                                name={`repaymentReceived.${index}.month`}
                                                id="month"
                                                className="rmdp-input"
                                                style={{ direction: "ltr" }}
                                                mask="9999/99"
                                                maskChar="-"
                                                onChange={formik.handleChange}
                                                value={
                                                  formik.values
                                                    .repaymentReceived[index]
                                                    .month
                                                }
                                                alwaysShowMask={true}
                                              />
                                            </div>
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              onKeyDown={(e) =>
                                                repaymentKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="amount"
                                              name={`repaymentReceived.${index}.amount`}
                                              value={
                                                formik.values.repaymentReceived[
                                                  index
                                                ].amount
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleRepaymentAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateRepaymentAmountTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>

                                          <td style={{ width: "40px" }}>
                                            <IconButton
                                              variant="contained"
                                              color="error"
                                              className="kendo-action-btn"
                                              onClick={() => {
                                                setRepaymentAmountTotal(
                                                  repaymentAmountTotal -
                                                  formik.values
                                                    .repaymentReceived[index]
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
                                <td></td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="repaymentAmountTotal"
                                    disabled
                                    value={repaymentAmountTotal}
                                    name={`repaymentReceived.repaymentAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>

                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {!(
                          formik.values.repaymentReceived.length === 1 &&
                          formik.errors.repaymentReceived
                        ) &&
                          formik?.errors?.repaymentReceived?.map(
                            (error, index) => (
                              <p className="error-msg" key={index}>
                                {error
                                  ? ` ${t("ردیف")} ${index + 1} : ${error?.repayment ? t(error.repayment) : ""
                                  }`
                                  : null}
                              </p>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
      <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
        <Button
          variant="contained"
          color="success"
          type="button"
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          {t("تایید")}
        </Button>

        <div className="Issuance">
          <Button variant="contained" color="error" onClick={NavigateToGrid}>
            {t("انصراف")}
          </Button>
        </div>
      </div>
    </>
  );
}
