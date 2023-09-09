import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import { julianIntToDate } from "../../../utils/dateConvert";
import * as Yup from "yup";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../utils/calenderLang";
import { accountParties, bankDatagridBankLookup, cashDatagridCashLookup, chequeDatagridBankNameLookup, collectors, definedAccounts, descriptives, } from "./datasources";
import { Autocomplete, Box, Button, FilledInput, IconButton, TextField, useTheme, } from "@mui/material";
import swal from "sweetalert";
import { parsFloatFunction } from "../../../utils/parsFloatFunction";
import Guid from "devextreme/core/guid";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SelectBox } from "devextreme-react";
import CurrencyInput from "react-currency-input-field";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddTableRow, MoveBack, MoveForward, } from "../../../utils/gridKeyboardNavigation";
import Input from "react-input-mask";
import Kara from "../../../components/SetGrid/Kara";
import { karadummyRight } from "../../../components/SetGrid/karadummyRight";
import { karadummyLeft } from "../../../components/SetGrid/karadummyLeft";
import { useNavigate } from "react-router-dom";
import InputMask from "../../../components/InputMask";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious, } from "../../../utils/gridKeyboardNav3";

export default function ReceiptDocument() {
  const emptyBenefits = { formikId: new Guid().valueOf(), worker: "", amount: 0 };
  const initialBenefits = [
    { formikId: 123, worker: "حق عائله مندی", amount: 4500000 },
    { formikId: 22, worker: "حق اولاد", amount: 250000 },
    { formikId: 22343, worker: "اضافه کار", amount: 0 },
    { formikId: 223432332, worker: "فوق العاده شغل", amount: 0 },
  ];
  const emptyDeductions = { formikId: new Guid().valueOf(), worker: "", amount: 0 };
  const initialDeductions = [
    { formikId: 12232322343, worker: "جریمه برگشت از توزیع", amount: 0 },
  ];
  const emptyLoans = { formikId: new Guid().valueOf(), title: "", amount: 0, balance: 0 };
  const initialLoans = [
    { formikId: 12232322343, title: "", amount: 0, balance: 0 },
  ];

  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const dateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  const [click, setClick] = useState(false);
  const [click2, setClick2] = useState(false);
  const [click3, setClick3] = useState(false);

  // function checkYupObjectEmpty(obj) {
  //   for (var key in obj) {
  //     if (obj[key] != null && obj[key] !== "" && obj[key] !== 0) return true;
  //   }
  //   return false;
  // }
  // function checkObjectEmpty(obj) {
  //   for (var key in obj) {
  //     if (obj[key] != null && obj[key] !== "" && obj[key] !== 0) return false;
  //   }
  //   return true;
  // }

  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 100000),
      Year: 1402,
      Month: "فروردین",
      Personnel: "محمد فریدونی",
      occupation: "برنامه نویس",
      MonthObligatoryTime: "139:00",
      TotalWorkingHours: "139:00",
      TotalLeaveHours: "000:00",
      TotalWorkingDays: "30",
      DailySalaryRates: 885164,
      BasicSalary: 26554925,
      LaborDeduction: "000:00",
      WorkDeductionPenaltyRate: 0,
      WorkDeductionPenalty: 0,
      OverTimeWorkDay: "000:00",
      OverTimeWorkDayRate: 168966,
      OverTimeWorkDayAmount: 0,
      OverTimeHoliday: "000:00",
      OverTimeHolidayRate: 236580,
      OverTimeHolidayAmount: 0,
      totalOvertime: 0,
      totalDelay: "000:00",
      delayedPenaltyRates: 0,
      delayedPenalty: 0,
      totalHaste: "000:00",
      hastePenaltyRates: 0,
      hastePenalty: 0,
      dailyMission: 0,
      dailyMissionRates: 0,
      dailyMissionAmount: 0,
      hourlyMission: "000:00",
      hourlyMissionRates: 0,
      missionRights: 0,
      unemploymentInsurance: 490473,
      employerInsurance: 490473,
      workerShareInsurance: 490473,
      mainUnemploymentInsurance: 14714,
      mainEmployerInsurance: 98095,
      mainWorkerShareInsurance: 34333,
      taxResources: 490473,
      taxExemption: 0,
      taxable: 490473,
      payrollTax: 24524,
      benefitsReceived: [],
      deductionsReceived: initialDeductions,
      loansReceived: initialLoans,
    },
    validationSchema: Yup.object({
      Personnel: Yup.string().required("وارد کردن این فیلد الزامیست"),
      occupation: Yup.string().required("وارد کردن این فیلد الزامیست"),

      // receivedFrom: Yup.boolean(),
      Year: Yup.string().test(
        "len",
        "این فیلد باید دقیقا 4 رقم باشد",
        (val) => val.length === 4
      ),

      // accountParty: Yup.string().when("receivedFrom", (receivedFrom) => {
      //   if (receivedFrom === true)
      //     return Yup.string().required("وارد کردن طرف حساب الزامی است");
      // }),

      // descriptive: Yup.string().when("receivedFrom", (receivedFrom) => {
      //   if (receivedFrom === false)
      //     return Yup.string().required("وارد کردن تفضیلی الزامی است");
      // }),

      // documentDescription: Yup.string().required(
      //   "وارد کردن شرح سند الزامی است"
      // ),

      // cashReceived: Yup.array(
      //   Yup.object({
      //     cash: Yup.string().test(
      //       "required",
      //       "صندوق انتخاب نشده است",
      //       (item, testContext) => {
      //         if (
      //           formik.values.cashReceived.length === 1 &&
      //           checkObjectEmpty(formik.values.cashReceived[0])
      //         ) {
      //           let bankTest = false;
      //           let chequeTest = false;
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.bankReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.bankReceived[index]
      //               )
      //             ) {
      //               bankTest = true;
      //             }
      //           }
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.chequeReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.chequeReceived[index]
      //               )
      //             ) {
      //               chequeTest = true;
      //             }
      //           }
      //           // console.log('item', item)
      //           // console.log('!!item[0].cash', !!item[0].cash)
      //           // console.log('testContext', testContext)
      //           // return (!!item[0].cash || checkObjectEmpty(testContext.parent.bankReceived[0]) || checkObjectEmpty(testContext.parent.chequeReceived[0]))
      //           return !!testContext.parent.cash || bankTest || chequeTest;
      //         } else {
      //           return !!testContext.parent.cash;
      //         }
      //       }
      //     ),
      //   })
      // ),
      // bankReceived: Yup.array(
      //   Yup.object({
      //     bank: Yup.string().test(
      //       "required",
      //       "بانک انتخاب نشده است",
      //       (item, testContext) => {
      //         if (
      //           formik.values.bankReceived.length === 1 &&
      //           checkObjectEmpty(formik.values.bankReceived[0])
      //         ) {
      //           let cashTest = false;
      //           let chequeTest = false;
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.cashReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.cashReceived[index]
      //               )
      //             ) {
      //               cashTest = true;
      //             }
      //           }
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.chequeReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.chequeReceived[index]
      //               )
      //             ) {
      //               chequeTest = true;
      //             }
      //           }
      //           return !!testContext.parent.bank || cashTest || chequeTest;
      //         } else {
      //           return !!testContext.parent.bank;
      //         }
      //       }
      //     ),
      //   })
      // ),
      // chequeReceived: Yup.array(
      //   Yup.object({
      //     bankName: Yup.string().test(
      //       "required",
      //       "بانک انتخاب نشده است",
      //       (item, testContext) => {
      //         if (
      //           formik.values.chequeReceived.length === 1 &&
      //           checkObjectEmpty(formik.values.chequeReceived[0])
      //         ) {
      //           let cashTest = false;
      //           let bankTest = false;
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.cashReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.cashReceived[index]
      //               )
      //             ) {
      //               cashTest = true;
      //             }
      //           }
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.bankReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.bankReceived[index]
      //               )
      //             ) {
      //               bankTest = true;
      //             }
      //           }
      //           return !!testContext.parent.bankName || cashTest || bankTest;
      //         } else {
      //           return !!testContext.parent.bankName;
      //         }
      //       }
      //     ),
      //     cash: Yup.string().test(
      //       "required",
      //       "صندوق انتخاب نشده است",
      //       (item, testContext) => {
      //         console.log(testContext);
      //         if (formik.values.chequeReceived.length === 1) {
      //           let cashTest = false;
      //           let bankTest = false;
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.cashReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.cashReceived[index]
      //               )
      //             ) {
      //               cashTest = true;
      //             }
      //           }
      //           for (
      //             let index = 0;
      //             index < testContext.from[1].value.bankReceived.length;
      //             index++
      //           ) {
      //             if (
      //               checkYupObjectEmpty(
      //                 testContext.from[1].value.bankReceived[index]
      //               )
      //             ) {
      //               bankTest = true;
      //             }
      //           }
      //           return !!testContext.parent.cash || cashTest || bankTest;
      //         } else {
      //           return !!testContext.parent.cash;
      //         }
      //       }
      //     ),
      //   })
      // ),
    }),
    validateOnChange: false,
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
    formik.setFieldValue("benefitsReceived", initialBenefits);
    let tempTotal = initialBenefits?.reduce((acc, current) => {
      return acc + (parseFloat(current?.amount) || 0);
    }, 0);
    setBenefitsAmountTotal(tempTotal);
  }, []);

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

  function HandleTotalreceivedChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("totalReceived", parsFloatFunction(temp, 2));
  }
  function HandleDailySalaryRatesChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("DailySalaryRates", parsFloatFunction(temp, 2));
  }
  function HandleBasicSalaryChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("BasicSalary", parsFloatFunction(temp, 2));
  }
  function HandleWorkDeductionPenaltyRateChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      "WorkDeductionPenaltyRate",
      parsFloatFunction(temp, 2)
    );
  }
  function HandleWorkDeductionPenaltyChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("WorkDeductionPenalty", parsFloatFunction(temp, 2));
  }
  function HandleOverTimeWorkDayRateChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("OverTimeWorkDayRate", parsFloatFunction(temp, 2));
  }
  function HandleOverTimeWorkDayAmountChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("OverTimeWorkDayAmount", parsFloatFunction(temp, 2));
  }
  function HandleOverTimeHolidayRateChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("OverTimeHolidayRate", parsFloatFunction(temp, 2));
  }
  function HandleOverTimeHolidayAmountChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("OverTimeHolidayAmount", parsFloatFunction(temp, 2));
  }
  function HandleTotalOverTimeChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("totalOvertime", parsFloatFunction(temp, 2));
  }
  function HandleDelayedPenaltyRatesChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("delayedPenaltyRates", parsFloatFunction(temp, 2));
  }
  function HandleDelayedPenaltyChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("delayedPenalty", parsFloatFunction(temp, 2));
  }
  function HandleHastePenaltyChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("hastePenalty", parsFloatFunction(temp, 2));
  }
  function HandleHastePenaltyRatesChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("hastePenaltyRates", parsFloatFunction(temp, 2));
  }
  function HandleDailyMissionRatesChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("dailyMissionRates", parsFloatFunction(temp, 2));
  }
  function HandleDailyMissionAmountChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("dailyMission", parsFloatFunction(temp, 2));
  }
  function HandleHourlyMissionRatesChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("hourlyMissionRates", parsFloatFunction(temp, 2));
  }
  function HandleMissionRightsChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("missionRights", parsFloatFunction(temp, 2));
  }
  function HandleUnemploymentInsuranceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("unemploymentInsurance", parsFloatFunction(temp, 2));
  }
  function HandleEmployerInsuranceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("employerInsurance", parsFloatFunction(temp, 2));
  }
  function HandleWorkerShareInsuranceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("workerShareInsurance", parsFloatFunction(temp, 2));
  }
  function HandleMainUnemploymentInsuranceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      "mainUnemploymentInsurance",
      parsFloatFunction(temp, 2)
    );
  }
  function HandleMainEmployerInsuranceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("mainEmployerInsurance", parsFloatFunction(temp, 2));
  }
  function HandleMainWorkerShareInsuranceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      "mainWorkerShareInsurance",
      parsFloatFunction(temp, 2)
    );
  }
  function HandleTaxResourcesChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("taxResources", parsFloatFunction(temp, 2));
  }
  function HandleTaxExemptionChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("taxExemption", parsFloatFunction(temp, 2));
  }
  function HandleTaxableChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("taxable", parsFloatFunction(temp, 2));
  }
  function HandlePayrollTaxChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("payrollTax", parsFloatFunction(temp, 2));
  }

  const [chequeDues, setChequeDues] = useState(0);
  const [allPaymentsDues, setAllPaymentsDues] = useState(0);
  const [finalDues, setFinalDues] = useState(0);

  const NavigateToGrid = () => {
    navigate(`/Payroll/salaryBillIssuance`, {
      replace: false,
    });
  };

  ///// Benefits Grid \\\\\

  const [benefitsFocusedRow, setBenefitsFocusedRow] = useState(1);

  const [benefitsWorkerOpen, setBenefitsWorkerOpen] = useState(false);

  function addBenefitsReceivedRow() {
    formik.setFieldValue("benefitsReceived", [
      ...formik.values.benefitsReceived,
      emptyBenefits,
    ]);
  }

  function RenderBenefitsWorkerOpenState(index, state) {
    if (index === benefitsFocusedRow - 1) {
      setBenefitsWorkerOpen(state);
    } else {
      setBenefitsWorkerOpen(false);
    }
  }

  function HandleBenefitsAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `benefitsReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function benefitsKeyDownHandler(e) {
    let next = e.target.closest("td").nextSibling;
    while (
      next.cellIndex !== next.closest("tr").children.length - 1 &&
      (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)
    ) {
      next = findNextFocusable(next);
    }

    let prev = e.target.closest("td").previousSibling;
    while (
      prev.cellIndex !== 0 &&
      (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)
    ) {
      prev = findPreviousFocusable(prev);
    }

    if (e.keyCode === 40 && benefitsWorkerOpen === false) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.benefitsReceived.length === benefitsFocusedRow) {
        addBenefitsReceivedRow();
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
    if (e.keyCode === 38 && benefitsWorkerOpen === false) {
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
          formik.values.benefitsReceived,
          addBenefitsReceivedRow,
          next,
          benefitsFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.benefitsReceived,
          addBenefitsReceivedRow,
          next,
          benefitsFocusedRow
        );
    }
    if (e.keyCode === 13 && benefitsWorkerOpen === false) {
      /* Enter */
      MoveNext(
        formik.values.benefitsReceived,
        addBenefitsReceivedRow,
        next,
        benefitsFocusedRow
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
          formik.values.benefitsReceived,
          addBenefitsReceivedRow,
          next,
          benefitsFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }

  const [benefitsAmountTotal, setBenefitsAmountTotal] = useState(0);

  function CalculateBenefitsAmountTotal() {
    let benefitsAmountTemp = 0;
    formik.values.benefitsReceived.forEach((element) => {
      benefitsAmountTemp += element.amount;
      setBenefitsAmountTotal(parsFloatFunction(benefitsAmountTemp, 2));
    });
  }

  ///// End of Benefits Grid \\\\\
  ///// Deductions Grid \\\\\

  const [deductionsFocusedRow, setDeductionsFocusedRow] = useState(1);

  const [deductionsWorkerOpen, setDeductionsWorkerOpen] = useState(false);

  function addDeductionsReceivedRow() {
    formik.setFieldValue("deductionsReceived", [
      ...formik.values.deductionsReceived,
      emptyDeductions,
    ]);
  }

  function RenderDeductionsWorkerOpenState(index, state) {
    if (index === deductionsFocusedRow - 1) {
      setDeductionsWorkerOpen(state);
    } else {
      setDeductionsWorkerOpen(false);
    }
  }

  function HandleDeductionsAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `deductionsReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function deductionsKeyDownHandler(e) {
    let next = e.target.closest("td").nextSibling;
    while (
      next.cellIndex !== next.closest("tr").children.length - 1 &&
      (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)
    ) {
      next = findNextFocusable(next);
    }

    let prev = e.target.closest("td").previousSibling;
    while (
      prev.cellIndex !== 0 &&
      (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)
    ) {
      prev = findPreviousFocusable(prev);
    }

    if (e.keyCode === 40 && deductionsWorkerOpen === false) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.deductionsReceived.length === deductionsFocusedRow) {
        addDeductionsReceivedRow();
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
    if (e.keyCode === 38 && deductionsWorkerOpen === false) {
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
          formik.values.deductionsReceived,
          addDeductionsReceivedRow,
          next,
          deductionsFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.deductionsReceived,
          addDeductionsReceivedRow,
          next,
          deductionsFocusedRow
        );
    }
    if (e.keyCode === 13 && deductionsWorkerOpen === false) {
      /* Enter */
      MoveNext(
        formik.values.deductionsReceived,
        addDeductionsReceivedRow,
        next,
        deductionsFocusedRow
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
          formik.values.deductionsReceived,
          addDeductionsReceivedRow,
          next,
          deductionsFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }

  const [deductionsAmountTotal, setDeductionsAmountTotal] = useState(0);

  function CalculateDeductionsAmountTotal() {
    let deductionsAmountTemp = 0;
    formik.values.deductionsReceived.forEach((element) => {
      deductionsAmountTemp += element.amount;
      setDeductionsAmountTotal(parsFloatFunction(deductionsAmountTemp, 2));
    });
  }

  ///// End of Deductions Grid \\\\\
  ///// Loans Grid \\\\\

  const [loansFocusedRow, setLoansFocusedRow] = useState(1);

  const [loansTitleOpen, setLoansTitleOpen] = useState(false);

  function addLoansReceivedRow() {
    formik.setFieldValue("loansReceived", [
      ...formik.values.loansReceived,
      emptyLoans,
    ]);
  }

  function RenderLoansTitleOpenState(index, state) {
    if (index === loansFocusedRow - 1) {
      setLoansTitleOpen(state);
    } else {
      setLoansTitleOpen(false);
    }
  }

  function HandleLoansAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `loansReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandleLoansBalanceChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `loansReceived[${index}].balance`,
      parsFloatFunction(temp, 2)
    );
  }

  function loansKeyDownHandler(e) {
    let next = e.target.closest("td").nextSibling;
    while (
      next.cellIndex !== next.closest("tr").children.length - 1 &&
      (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)
    ) {
      next = findNextFocusable(next);
    }

    let prev = e.target.closest("td").previousSibling;
    while (
      prev.cellIndex !== 0 &&
      (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)
    ) {
      prev = findPreviousFocusable(prev);
    }

    if (e.keyCode === 40 && loansTitleOpen === false) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.loansReceived.length === loansFocusedRow) {
        addLoansReceivedRow();
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
    if (e.keyCode === 38 && loansTitleOpen === false) {
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
          formik.values.loansReceived,
          addLoansReceivedRow,
          next,
          loansFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.loansReceived,
          addLoansReceivedRow,
          next,
          loansFocusedRow
        );
    }
    if (e.keyCode === 13 && loansTitleOpen === false) {
      /* Enter */
      MoveNext(
        formik.values.loansReceived,
        addLoansReceivedRow,
        next,
        loansFocusedRow
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
          formik.values.loansReceived,
          addLoansReceivedRow,
          next,
          loansFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }

  const [loansAmountTotal, setLoansAmountTotal] = useState(0);

  function CalculateLoansAmountTotal() {
    let loansAmountTemp = 0;
    formik.values.loansReceived.forEach((element) => {
      loansAmountTemp += element.amount;
      setLoansAmountTotal(parsFloatFunction(loansAmountTemp, 2));
    });
  }
  const [loansBalanceTotal, setLoansBalanceTotal] = useState(0);

  function CalculateLoansBalanceTotal() {
    let loansBalanceTemp = 0;
    formik.values.loansReceived.forEach((element) => {
      loansBalanceTemp += element.balance;
      setLoansBalanceTotal(parsFloatFunction(loansBalanceTemp, 2));
    });
  }

  ///// End of Deductions Grid \\\\\

  const MonthUnits = [
    t("فروردین"),
    t("اردیبهشت"),
    t("خرداد"),
    t("تیر"),
    t("مرداد"),
    t("شهریور"),
    t("مهر"),
    t("آبان"),
    t("آذر"),
    t("دی"),
    t("بهمن"),
    t("اسفند"),
  ];
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
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("شماره فیش")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="id"
                          name="id"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.id}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("سال")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="Year"
                          name="Year"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.Year}
                        />
                        {formik.touched.Year && formik.errors.Year ? (
                          <div className="error-msg">
                            {t(formik.errors.Year)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span>{t("ماه")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <SelectBox
                          dataSource={MonthUnits}
                          rtlEnabled={i18n.dir() == "ltr" ? false : true}
                          onValueChanged={(e) =>
                            formik.setFieldValue("Month", e.value)
                          }
                          className="selectBox"
                          noDataText="اطلاعات یافت نشد"
                          itemRender={null}
                          placeholder=""
                          name="Month"
                          id="Month"
                          //searchEnabled             برای سرچ
                          showClearButton
                          defaultValue={MonthUnits[0]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span>{t("پرسنل")}</span>
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
                      defaultValue={definedAccounts[0].PersonnelName}
                    />
                    {formik.touched.Personnel && formik.errors.Personnel ? (
                      <div className="error-msg">
                        {t(formik.errors.Personnel)}
                      </div>
                    ) : null}
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span>
                        {t("حکم")} <span className="star">*</span>
                      </span>
                    </div>
                    <SelectBox
                      dataSource={descriptives}
                      rtlEnabled={i18n.dir() == "ltr" ? false : true}
                      onValueChanged={(e) =>
                        formik.setFieldValue("occupation", e.value)
                      }
                      valueExpr="occupation"
                      displayExpr={function (item) {
                        return item && item.occupation;
                      }}
                      className="selectBox"
                      noDataText={t("اطلاعات یافت نشد")}
                      itemRender={null}
                      placeholder=""
                      name="occupation"
                      id="occupation"
                      showClearButton
                      searchEnabled
                      defaultValue={descriptives[0].occupation}
                      disabled={
                        formik.values.Personnel == "" ||
                        formik.values.Personnel == null
                      }
                    />
                    {formik.touched.occupation && formik.errors.occupation ? (
                      <div className="error-msg">
                        {t(formik.errors.occupation)}
                      </div>
                    ) : null}
                  </div>
                  <div className="content col-12 mt-4">
                    <h3 className="title">
                      <span> {t("ساعات کاری ماهانه:")} </span>
                    </h3>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("موظفی ماه")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="MonthObligatoryTime"
                          name="MonthObligatoryTime"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.MonthObligatoryTime}
                          placeholder="ساعت"
                        />
                        {formik.touched.MonthObligatoryTime &&
                          formik.errors.MonthObligatoryTime ? (
                          <div className="error-msg">
                            {t(formik.errors.MonthObligatoryTime)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جمع ساعات کاری:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="TotalWorkingHours"
                          name="TotalWorkingHours"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.TotalWorkingHours}
                          placeholder="ساعت"
                        />
                        {formik.touched.TotalWorkingHours &&
                          formik.errors.TotalWorkingHours ? (
                          <div className="error-msg">
                            {t(formik.errors.TotalWorkingHours)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جمع مرخصی:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="TotalLeaveHours"
                          name="TotalLeaveHours"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.TotalLeaveHours}
                          placeholder="ساعت"
                        />
                        {formik.touched.TotalLeaveHours &&
                          formik.errors.TotalLeaveHours ? (
                          <div className="error-msg">
                            {t(formik.errors.TotalLeaveHours)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("تعداد روز کاری:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="TotalWorkingDays"
                          name="TotalWorkingDays"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.TotalWorkingDays}
                          placeholder="روز"
                        />
                        {formik.touched.TotalWorkingDays &&
                          formik.errors.TotalWorkingDays ? (
                          <div className="error-msg">
                            {t(formik.errors.TotalWorkingDays)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ حقوق روزانه(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="DailySalaryRates"
                          name="DailySalaryRates"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleDailySalaryRatesChange(e.target.value)
                          }
                          value={formik.values.DailySalaryRates}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("حقوق پایه(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="BasicSalary"
                          name="BasicSalary"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleBasicSalaryChange(e.target.value)
                          }
                          value={formik.values.BasicSalary}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("کسر کار:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="LaborDeduction"
                          name="LaborDeduction"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.LaborDeduction}
                          placeholder="ساعت"
                        />
                        {formik.touched.LaborDeduction &&
                          formik.errors.LaborDeduction ? (
                          <div className="error-msg">
                            {t(formik.errors.LaborDeduction)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ جریمه کسر کار(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="WorkDeductionPenaltyRate"
                          name="WorkDeductionPenaltyRate"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleWorkDeductionPenaltyRateChange(e.target.value)
                          }
                          value={formik.values.WorkDeductionPenaltyRate}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جریمه کسر کار(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="WorkDeductionPenalty"
                          name="WorkDeductionPenalty"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleWorkDeductionPenaltyChange(e.target.value)
                          }
                          value={formik.values.WorkDeductionPenalty}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("اضافه کار روز کاری:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="OverTimeWorkDay"
                          name="OverTimeWorkDay"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.OverTimeWorkDay}
                          placeholder="ساعت"
                        />
                        {formik.touched.OverTimeWorkDay &&
                          formik.errors.OverTimeWorkDay ? (
                          <div className="error-msg">
                            {t(formik.errors.OverTimeWorkDay)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ اضافه کار روز کاری(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="OverTimeWorkDayRate"
                          name="OverTimeWorkDayRate"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleOverTimeWorkDayRateChange(e.target.value)
                          }
                          value={formik.values.OverTimeWorkDayRate}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("اضافه کار روز کاری(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="OverTimeWorkDayAmount"
                          name="OverTimeWorkDayAmount"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleOverTimeWorkDayAmountChange(e.target.value)
                          }
                          value={formik.values.OverTimeWorkDayAmount}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("اضافه کار روز تعطیل:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="OverTimeHoliday"
                          name="OverTimeHoliday"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.OverTimeHoliday}
                          placeholder="ساعت"
                        />
                        {formik.touched.OverTimeHoliday &&
                          formik.errors.OverTimeHoliday ? (
                          <div className="error-msg">
                            {t(formik.errors.OverTimeHoliday)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ اضافه کار روز تعطیل(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="OverTimeHolidayRate"
                          name="OverTimeHolidayRate"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleOverTimeHolidayRateChange(e.target.value)
                          }
                          value={formik.values.OverTimeHolidayRate}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("اضافه کار روز تعطیل(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="OverTimeHolidayAmount"
                          name="OverTimeHolidayAmount"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleOverTimeHolidayAmountChange(e.target.value)
                          }
                          value={formik.values.OverTimeHolidayAmount}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مجموع اضافه کار(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="totalOvertime"
                          name="totalOvertime"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleTotalOverTimeChange(e.target.value)
                          }
                          value={formik.values.totalOvertime}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جمع تاخیر:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="totalDelay"
                          name="totalDelay"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.totalDelay}
                          placeholder="ساعت"
                        />
                        {formik.touched.OverTimeHoliday &&
                          formik.errors.OverTimeHoliday ? (
                          <div className="error-msg">
                            {t(formik.errors.OverTimeHoliday)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ جریمه‌ی تاخیر(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="delayedPenaltyRates"
                          name="delayedPenaltyRates"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleDelayedPenaltyRatesChange(e.target.value)
                          }
                          value={formik.values.delayedPenaltyRates}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جریمه‌ی تاخیر(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="delayedPenalty"
                          name="delayedPenalty"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleDelayedPenaltyChange(e.target.value)
                          }
                          value={formik.values.delayedPenalty}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جمع تعجیل:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="totalHaste"
                          name="totalHaste"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.totalHaste}
                          placeholder="ساعت"
                        />
                        {formik.touched.totalHaste &&
                          formik.errors.totalHaste ? (
                          <div className="error-msg">
                            {t(formik.errors.totalHaste)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ جریمه‌ی تعجیل(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="hastePenaltyRates"
                          name="hastePenaltyRates"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleHastePenaltyRatesChange(e.target.value)
                          }
                          value={formik.values.hastePenaltyRates}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("جریمه‌ی تعجیل(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="hastePenalty"
                          name="hastePenalty"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleHastePenaltyChange(e.target.value)
                          }
                          value={formik.values.hastePenalty}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("ماموریت روزانه:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="dailyMission"
                          name="dailyMission"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.dailyMission}
                          placeholder="روز"
                        />
                        {formik.touched.dailyMission &&
                          formik.errors.dailyMission ? (
                          <div className="error-msg">
                            {t(formik.errors.dailyMission)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ ماموریت روزانه (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="dailyMissionRates"
                          name="dailyMissionRates"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleDailyMissionRatesChange(e.target.value)
                          }
                          value={formik.values.dailyMissionRates}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("حق ماموریت (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="dailyMissionAmount"
                          name="dailyMissionAmount"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleDailyMissionAmountChange(e.target.value)
                          }
                          value={formik.values.dailyMissionAmount}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("ماموریت ساعتی:")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="hourlyMission"
                          name="hourlyMission"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.hourlyMission}
                          placeholder="ساعت"
                        />
                        {formik.touched.hourlyMission &&
                          formik.errors.hourlyMission ? (
                          <div className="error-msg">
                            {t(formik.errors.hourlyMission)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("نرخ ماموریت ساعتی(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="hourlyMissionRates"
                          name="hourlyMissionRates"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleHourlyMissionRatesChange(e.target.value)
                          }
                          value={formik.values.hourlyMissionRates}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("حق ماموریت (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="missionRights"
                          name="missionRights"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleMissionRightsChange(e.target.value)
                          }
                          value={formik.values.missionRights}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="content col-lg-6 col-md-12 cl-xs-12 col-12">
                    {/* Benefits Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("مزایا")} :</span>
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
                              addBenefitsReceivedRow();
                              setTimeout(() => {
                                let added = e.target
                                  .closest("div")
                                  .parentElement.nextSibling.querySelector(
                                    "tbody tr:last-child td:nth-child(2)"
                                  );
                                while (
                                  added.querySelector("button:not([aria-label='Clear'])") ||
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
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("عامل")}</th>
                                <th>{t("مبلغ")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="benefitsReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.benefitsReceived?.map(
                                      (benefitsReceived, index) => (
                                        <tr
                                          key={benefitsReceived.formikId}
                                          onFocus={(e) =>
                                            setBenefitsFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            benefitsFocusedRow === index + 1
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

                                          {/* <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                id="worker"
                                                name={`benefitsReceived.${index}.worker`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
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
                                                  benefitsFocusedRow ===
                                                  index + 1
                                                    ? benefitsWorkerOpen
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
                                                    RenderBenefitsWorkerOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderBenefitsWorkerOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderBenefitsWorkerOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `benefitsReceived[${index}].worker`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderBenefitsWorkerOpenState(
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
                                                    benefitsWorkerOpen[
                                                      index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderBenefitsWorkerOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  setTimeout(() => {
                                                    benefitsKeyDownHandler(e);
                                                  }, 0);
                                                }}
                                              />
                                            </div>
                                          </td> */}
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <input
                                              onKeyDown={(e) =>
                                                benefitsKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="worker"
                                              name={`benefitsReceived.${index}.worker`}
                                              value={
                                                formik.values.benefitsReceived[
                                                  index
                                                ].worker
                                              }
                                              disabled
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              onKeyDown={(e) =>
                                                benefitsKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="amount"
                                              name={`benefitsReceived.${index}.amount`}
                                              value={
                                                formik.values.benefitsReceived[
                                                  index
                                                ].amount
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) => {
                                                HandleBenefitsAmountChange(
                                                  index,
                                                  e.target.value
                                                );

                                                CalculateBenefitsAmountTotal();
                                              }}
                                              autoComplete="off"
                                            />
                                          </td>

                                          <td style={{ width: "40px" }}>
                                            <IconButton
                                              variant="contained"
                                              color="error"
                                              className="kendo-action-btn"
                                              onClick={() => {
                                                setBenefitsAmountTotal(
                                                  benefitsAmountTotal -
                                                  formik.values
                                                    .benefitsReceived[index]
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
                                    id="benefitsAmountTotal"
                                    disabled
                                    value={benefitsAmountTotal}
                                    name={`benefitsReceived.benefitsAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>

                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {
                          // (checkObjectEmpty(formik.values.bankReceived[0]) && checkObjectEmpty(formik.values.chequeReceived[0])) && formik?.errors?.cashReceived?.map((error, index) => (
                          !(
                            formik.values.benefitsReceived.length === 1 &&
                            formik.errors.benefitsReceived
                          ) &&
                          formik?.errors?.benefitsReceived?.map(
                            (error, index) => (
                              <p className="error-msg" key={index}>
                                {error
                                  ? ` ${t("ردیف")} ${index + 1} : ${error?.benefits ? t(error.benefits) : ""
                                  }`
                                  : null}
                              </p>
                            )
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-12 cl-xs-12 col-12">
                    {/* Deductions Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("کسورات")} :</span>
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
                              addDeductionsReceivedRow();
                              setTimeout(() => {
                                let added = e.target
                                  .closest("div")
                                  .parentElement.nextSibling.querySelector(
                                    "tbody tr:last-child td:nth-child(2)"
                                  );
                                while (
                                  added.querySelector("button:not([aria-label='Clear'])") ||
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
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("عامل")}</th>
                                <th>{t("مبلغ")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="deductionsReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.deductionsReceived?.map(
                                      (deductionsReceived, index) => (
                                        <tr
                                          key={deductionsReceived.formikId}
                                          onFocus={(e) =>
                                            setDeductionsFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            deductionsFocusedRow === index + 1
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

                                          {/* <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                id="worker"
                                                name={`deductionsReceived.${index}.worker`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
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
                                                  deductionsFocusedRow ===
                                                  index + 1
                                                    ? deductionsWorkerOpen
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
                                                    RenderDeductionsWorkerOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderDeductionsWorkerOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderDeductionsWorkerOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `deductionsReceived[${index}].worker`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderDeductionsWorkerOpenState(
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
                                                    deductionsWorkerOpen[
                                                      index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderDeductionsWorkerOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  setTimeout(() => {
                                                    deductionsKeyDownHandler(e);
                                                  }, 0);
                                                }}
                                              />
                                            </div>
                                          </td> */}
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <input
                                              onKeyDown={(e) =>
                                                deductionsKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="worker"
                                              name={`deductionsReceived.${index}.worker`}
                                              value={
                                                formik.values
                                                  .deductionsReceived[index]
                                                  .worker
                                              }
                                              disabled
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              onKeyDown={(e) =>
                                                deductionsKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="amount"
                                              name={`deductionsReceived.${index}.amount`}
                                              value={
                                                formik.values
                                                  .deductionsReceived[index]
                                                  .amount
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleDeductionsAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateDeductionsAmountTotal()
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
                                                setDeductionsAmountTotal(
                                                  deductionsAmountTotal -
                                                  formik.values
                                                    .deductionsReceived[index]
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
                                    id="deductionsAmountTotal"
                                    disabled
                                    value={deductionsAmountTotal}
                                    name={`deductionsReceived.deductionsAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>

                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {
                          // (checkObjectEmpty(formik.values.bankReceived[0]) && checkObjectEmpty(formik.values.chequeReceived[0])) && formik?.errors?.cashReceived?.map((error, index) => (
                          !(
                            formik.values.deductionsReceived.length === 1 &&
                            formik.errors.deductionsReceived
                          ) &&
                          formik?.errors?.deductionsReceived?.map(
                            (error, index) => (
                              <p className="error-msg" key={index}>
                                {error
                                  ? ` ${t("ردیف")} ${index + 1} : ${error?.deductions
                                    ? t(error.deductions)
                                    : ""
                                  }`
                                  : null}
                              </p>
                            )
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-12 cl-xs-12 col-12">
                    {/* Loans Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("وام‌ها")} :</span>
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
                              addLoansReceivedRow();
                              setTimeout(() => {
                                let added = e.target
                                  .closest("div")
                                  .parentElement.nextSibling.querySelector(
                                    "tbody tr:last-child td:nth-child(2)"
                                  );
                                while (
                                  added.querySelector("button:not([aria-label='Clear'])") ||
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
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("عنوان")}</th>
                                <th>{t("مبلغ قسط")}</th>
                                <th>{t("مانده")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="loansReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.loansReceived?.map(
                                      (loansReceived, index) => (
                                        <tr
                                          key={loansReceived.formikId}
                                          onFocus={(e) =>
                                            setLoansFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            loansFocusedRow === index + 1
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

                                          {/* <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                id="title"
                                                name={`loansReceived.${index}.title`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
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
                                                  loansFocusedRow === index + 1
                                                    ? loansTitleOpen
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
                                                    RenderLoansTitleOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderLoansTitleOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderLoansTitleOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `loansReceived[${index}].title`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderLoansTitleOpenState(
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
                                                    loansTitleOpen[index] ===
                                                      false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderLoansTitleOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  setTimeout(() => {
                                                    loansKeyDownHandler(e);
                                                  }, 0);
                                                }}
                                              />
                                            </div>
                                          </td> */}
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <input
                                              onKeyDown={(e) =>
                                                loansKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="title"
                                              name={`loansReceived.${index}.title`}
                                              value={
                                                formik.values.loansReceived[
                                                  index
                                                ].title
                                              }
                                              disabled
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              onKeyDown={(e) =>
                                                loansKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="amount"
                                              name={`loansReceived.${index}.amount`}
                                              // value={
                                              //   formik.values.loansReceived[
                                              //     index
                                              //   ].balance
                                              // }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleLoansAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateLoansAmountTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              onKeyDown={(e) =>
                                                loansKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="balance"
                                              name={`loansReceived.${index}.balance`}
                                              // value={
                                              //   formik.values.loansReceived[
                                              //     index
                                              //   ].balance
                                              // }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleLoansBalanceChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateLoansBalanceTotal()
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
                                                setLoansAmountTotal(
                                                  loansAmountTotal -
                                                  formik.values.loansReceived[
                                                    index
                                                  ].amount
                                                );
                                                setLoansBalanceTotal(
                                                  loansBalanceTotal -
                                                  formik.values.loansReceived[
                                                    index
                                                  ].balance
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
                                    id="deductionsAmountTotal"
                                    disabled
                                    value={loansAmountTotal}
                                    name={`deductionsReceived.deductionsAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="loansBalanceTotal"
                                    disabled
                                    value={loansBalanceTotal}
                                    name={`loansReceived.loansBalanceTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>

                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {
                          // (checkObjectEmpty(formik.values.bankReceived[0]) && checkObjectEmpty(formik.values.chequeReceived[0])) && formik?.errors?.cashReceived?.map((error, index) => (
                          !(
                            formik.values.loansReceived.length === 1 &&
                            formik.errors.loansReceived
                          ) &&
                          formik?.errors?.loansReceived?.map(
                            (error, index) => (
                              <p className="error-msg" key={index}>
                                {error
                                  ? ` ${t("ردیف")} ${index + 1} : ${error?.loans ? t(error.loans) : ""
                                  }`
                                  : null}
                              </p>
                            )
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="content col-12">
                    <button
                      type="button"
                      onClick={() => {
                        if (click2 == false) setClick2(true);
                      }}
                      className="btn btn-primary"
                    >
                      {t("ویرایش بیمه")}
                    </button>
                    {console.log("click2", click2)}
                  </div>

                  <div className="content col-12 d-flex">
                    <div className="title col-4">
                      <span> {t("3% بیمه بی‌کاری")}</span>
                    </div>
                    <div className="title col-4">
                      <span> {t("20% بیمه سهم کارفرما")}</span>
                    </div>
                    <div className="title col-4">
                      <span> {t("7% بیمه سهم کارگر")}</span>
                    </div>
                  </div>

                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مشمول بیمه (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="unemploymentInsurance"
                          name="unemploymentInsurance"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleUnemploymentInsuranceChange(e.target.value)
                          }
                          value={formik.values.unemploymentInsurance}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مشمول بیمه (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="employerInsurance"
                          name="employerInsurance"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleEmployerInsuranceChange(e.target.value)
                          }
                          value={formik.values.employerInsurance}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مشمول بیمه (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="workerShareInsurance"
                          name="workerShareInsurance"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleWorkerShareInsuranceChange(e.target.value)
                          }
                          value={formik.values.workerShareInsurance}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("بیمه بی‌کاری (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled={click2 == false}
                          className="form-input"
                          id="mainUnemploymentInsurance"
                          name="mainUnemploymentInsurance"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleMainUnemploymentInsuranceChange(
                              e.target.value
                            )
                          }
                          value={formik.values.mainUnemploymentInsurance}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("بیمه سهم کارفرما (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled={click2 == false}
                          className="form-input"
                          id="mainEmployerInsurance"
                          name="mainEmployerInsurance"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleMainEmployerInsuranceChange(e.target.value)
                          }
                          value={formik.values.mainEmployerInsurance}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <div className="title">
                      <span> {t("بیمه سهم کارگر (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled={click2 == false}
                          className="form-input"
                          id="mainWorkerShareInsurance"
                          name="mainWorkerShareInsurance"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleMainWorkerShareInsuranceChange(e.target.value)
                          }
                          value={formik.values.mainWorkerShareInsurance}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-12">
                    <button
                      type="button"
                      onClick={() => {
                        if (click3 == false) setClick3(true);
                      }}
                      className="btn btn-primary"
                    >
                      {t("ویرایش مالیات")}
                    </button>
                  </div>
                  <div className="content  col-12">
                    <div className="title mt-2">
                      <span> {t("مالیات")} :</span>
                    </div>
                    <div className="wrapper"></div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مأخذ مالیات (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled={click3 == false}
                          className="form-input"
                          id="taxResources"
                          name="taxResources"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleTaxResourcesChange(e.target.value)
                          }
                          value={formik.values.taxResources}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("معافیت مالیات (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="taxExemption"
                          name="taxExemption"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleTaxExemptionChange(e.target.value)
                          }
                          value={formik.values.taxExemption}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مشمول مالیات (ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="taxable"
                          name="taxable"
                          style={{ width: "100%" }}
                          onChange={(e) => HandleTaxableChange(e.target.value)}
                          value={formik.values.taxable}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مالیات بر حقوق(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="payrollTax"
                          name="payrollTax"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandlePayrollTaxChange(e.target.value)
                          }
                          value={formik.values.payrollTax}
                          decimalsLimit={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-3 col-md-6 col-12">
                    <div className="title">
                      <span> {t("خالص حقوق پرداختنی(ریال)")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          disabled
                          className="form-input"
                          id="payrollTax"
                          name="payrollTax"
                          style={{ width: "100%", direction: "ltr" }}
                          onChange={(e) =>
                            HandlePayrollTaxChange(e.target.value)
                          }
                          value={
                            benefitsAmountTotal -
                            deductionsAmountTotal -
                            loansAmountTotal
                          }
                          decimalsLimit={2}
                        />
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
