import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import { julianIntToDate } from "../../../../utils/dateConvert";
import * as Yup from "yup";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../../utils/calenderLang";
import { accountParties, bankDatagridBankLookup, bankDatagridOriginLookup, bankDatagridTreasuryLookup, cashDatagridCashLookup, chequeDatagridChequeTypeLookup, chequeDatagridCustomizeChequeLookup, chequeDatagridChequeBookLookup, chequeDatagridBankNameLookup, collectors, definedAccounts, descriptives, } from "./datasources";
import { Autocomplete, Box, Button, FilledInput, IconButton, TextField, useTheme, } from "@mui/material";
import swal from "sweetalert";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import Guid from "devextreme/core/guid";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SelectBox } from "devextreme-react";
import CurrencyInput from "react-currency-input-field";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { history } from "../../../../utils/history";
import { AddTableRow, MoveBack, MoveForward, } from "../../../../utils/gridKeyboardNavigation";
import Input from "react-input-mask";
import Kara from "../../../../components/SetGrid/Kara";
import { karadummyRight } from "../../../../components/SetGrid/karadummyRight";
import { karadummyLeft } from "../../../../components/SetGrid/karadummyLeft";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious, } from "../../../../utils/gridKeyboardNav3";

const emptyCash = { cash: "", amount: 0 };
const emptyBank = {
  bank: "",
  slipNumber: "",
  amount: 0,
  origin: "",
  treasury: "",
  fund: "",
  account: "",
  branchCode: "",
  branchName: "",
  bankFee: "",
};
const emptyCheque = {
  chequeType: "",
  chequeBook: "",
  customizeCheque: "",
  serial: "",
  bankName: "",
  branchCode: "",
  branchName: "",
  issuancePlace: "",
  maturity: "",
  amount: 0,
};

export default function ReceiptDocument() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const dateRef = useRef();
  const chequeMaturityRefs = useRef([]);
  const [date, setDate] = useState(new DateObject());

  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 100000),
      date: julianIntToDate(new DateObject().toJulianDay()),
      totalReceived: 0,
      collector: "",
      accountParty: "",
      receivedFrom: true /*True: طرف حساب; False: معین و تفضیلی */,
      definedAccount: "",
      descriptive: "",
      balance: 0,
      documentDescription: "",
      cashReceived: [emptyCash],
      bankReceived: [emptyBank],
      chequeReceived: [emptyCheque],
    },
    validationSchema: Yup.object({
      date: Yup.date().required("وارد کردن تاریخ الزامی است"),

      receivedFrom: Yup.boolean(),

      accountParty: Yup.string().when("receivedFrom", (receivedFrom) => {
        if (receivedFrom === true)
          return Yup.string().required("وارد کردن طرف حساب الزامی است");
      }),

      descriptive: Yup.string().when("receivedFrom", (receivedFrom) => {
        if (receivedFrom === false)
          return Yup.string().required("وارد کردن تفضیلی الزامی است");
      }),
    }),
    validateOnChange: false,
    onSubmit: (values) => {
      let allValues = values;

      DocumentSub();
      console.log("All Values:", allValues);
    },
  });

  const [debtor, setDebtor] = useState([]);
  const [creditor, setCreditor] = useState([]);

  useEffect(() => {
    if (formik.values.receivedFrom) {
      setDebtor(karadummyRight);
      setCreditor(karadummyLeft);
    } else {
      setDebtor([]);
      setCreditor([]);
    }
  }, [formik.values.receivedFrom]);

  console.log("debtor", debtor);

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
  //
  // useEffect(() => {
  //   if (formik.values.accountSideList) {
  //     let current = accountParties.filter(
  //         (item) => item.value === formik.values.accountSideList
  //     )[0];
  //
  //     formik.setFieldValue("Remaining", current.Balance);
  //   }
  // }, [formik.values.accountSideList]);

  function HandleTotalreceivedChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("totalreceived", parsFloatFunction(temp, 2));
  }
  function HandleBalanceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("balance", parsFloatFunction(temp, 2));
  }

  const [chequeDues, setChequeDues] = useState(0);
  const [allPaymentsDues, setAllPaymentsDues] = useState(0);
  const [finalDues, setFinalDues] = useState(0);

  ///// Cash Grid \\\\\

  const [cashFocusedRow, setCashFocusedRow] = useState(1);

  const [cashCashOpen, setCashCashOpen] = useState(false);

  function addCashReceivedRow() {
    formik.setFieldValue("cashReceived", [
      ...formik.values.cashReceived,
      emptyCash,
    ]);
  }

  function RenderCashCashOpenState(index, state) {
    if (index === cashFocusedRow - 1) {
      setCashCashOpen(state);
    } else {
      setCashCashOpen(false);
    }
  }

  function HandleCashAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `cashReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }
  function cashKeyDownHandler(e) {
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

    if (e.keyCode === 40 && cashCashOpen === false) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.cashReceived.length === cashFocusedRow) {
        addCashReceivedRow();
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
    if (e.keyCode === 38 && cashCashOpen === false) {
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
          formik.values.cashReceived,
          addCashReceivedRow,
          next,
          cashFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.cashReceived,
          addCashReceivedRow,
          next,
          cashFocusedRow
        );
    }
    if (e.keyCode === 13 && cashCashOpen === false) {
      /* Enter */
      MoveNext(
        formik.values.cashReceived,
        addCashReceivedRow,
        next,
        cashFocusedRow
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      MoveNext(
        formik.values.cashReceived,
        addCashReceivedRow,
        next,
        cashFocusedRow
      );
    }
    if (e.keyCode === 9) {
      /* Tab */ /*MUST BECOME LANGUAGE DEPENDANT */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveNext(
          formik.values.cashReceived,
          addCashReceivedRow,
          next,
          cashFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }

  const [cashAmountTotal, setCashAmountTotal] = useState(0);

  function CalculateCashAmountTotal() {
    let cashAmountTemp = 0;
    formik.values.cashReceived.forEach((element) => {
      cashAmountTemp += element.amount;
      setCashAmountTotal(parsFloatFunction(cashAmountTemp, 2));
    });
  }

  ///// End of Cash Grid \\\\\

  ///// Bank Grid \\\\\

  const [bankFocusedRow, setBankFocusedRow] = useState(1);

  const [bankBankOpen, setBankBankOpen] = useState(false);
  const [bankOriginOpen, setBankOriginOpen] = useState(false);
  const [bankTreasuryOpen, setBankTreasuryOpen] = useState(false);
  const [bankFundOpen, setBankFundOpen] = useState(false);
  const [bankAccountOpen, setBankAccountOpen] = useState(false);

  function addBankReceivedRow() {
    formik.setFieldValue("bankReceived", [
      ...formik.values.bankReceived,
      emptyBank,
    ]);
  }

  function RenderBankBankOpenState(index, state) {
    if (index === bankFocusedRow - 1) {
      setBankBankOpen(state);
    } else {
      setBankBankOpen(false);
    }
  }
  function RenderBankOriginOpenState(index, state) {
    if (index === bankFocusedRow - 1) {
      setBankOriginOpen(state);
    } else {
      setBankOriginOpen(false);
    }
  }
  function RenderBankTreasuryOpenState(index, state) {
    if (index === bankFocusedRow - 1) {
      setBankTreasuryOpen(state);
    } else {
      setBankTreasuryOpen(false);
    }
  }
  function RenderBankAccountOpenState(index, state) {
    if (index === bankFocusedRow - 1) {
      setBankAccountOpen(state);
    } else {
      setBankAccountOpen(false);
    }
  }
  function RenderBankFundOpenState(index, state) {
    if (index === bankFocusedRow - 1) {
      setBankFundOpen(state);
    } else {
      setBankFundOpen(false);
    }
  }

  function HandleBankAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `bankReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }
  function HandleBankFeeChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `bankReceived[${index}].bankFee`,
      parsFloatFunction(temp, 2)
    );
  }
  function bankKeyDownHandler(e) {
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

    if (
      e.keyCode === 40 &&
      bankOriginOpen === false &&
      bankTreasuryOpen === false &&
      bankFundOpen === false &&
      bankAccountOpen === false &&
      bankBankOpen === false
    ) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.bankReceived.length === bankFocusedRow) {
        addBankReceivedRow();
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
    if (
      e.keyCode === 38 &&
      bankOriginOpen === false &&
      bankTreasuryOpen === false &&
      bankFundOpen === false &&
      bankAccountOpen === false &&
      bankBankOpen === false
    ) {
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
          formik.values.bankReceived,
          addBankReceivedRow,
          next,
          bankFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.bankReceived,
          addBankReceivedRow,
          next,
          bankFocusedRow
        );
    }
    if (
      e.keyCode === 13 &&
      bankOriginOpen === false &&
      bankTreasuryOpen === false &&
      bankFundOpen === false &&
      bankAccountOpen === false &&
      bankBankOpen === false
    ) {
      /* Enter */
      MoveNext(
        formik.values.bankReceived,
        addBankReceivedRow,
        next,
        bankFocusedRow
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      MoveNext(
        formik.values.bankReceived,
        addBankReceivedRow,
        next,
        bankFocusedRow
      );
    }
    if (e.keyCode === 9) {
      /* Tab */ /*MUST BECOME LANGUAGE DEPENDANT */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveNext(
          formik.values.bankReceived,
          addBankReceivedRow,
          next,
          bankFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }

  const [bankAmountTotal, setBankAmountTotal] = useState(0);

  function CalculateBankAmountTotal() {
    let bankAmountTemp = 0;
    formik.values.bankReceived.forEach((element) => {
      bankAmountTemp += element.amount;
      setBankAmountTotal(parsFloatFunction(bankAmountTemp, 2));
    });
  }
  const [bankFeeTotal, setBankFeeTotal] = useState(0);

  function CalculateBankFeeTotal() {
    let bankFeeTemp = 0;
    formik.values.bankReceived.forEach((element) => {
      bankFeeTemp += element.bankFee;
      setBankFeeTotal(parsFloatFunction(bankFeeTemp, 2));
    });
  }

  ///// End of Bank Grid \\\\\

  ///// Cheque Grid \\\\\

  const [chequeFocusedRow, setChequeFocusedRow] = useState(1);

  const [chequeBankNameOpen, setChequeBankNameOpen] = useState(false);

  const [chequeCashOpen, setChequeCashOpen] = useState(false);

  const [chequeCashierOpen, setChequeCashierOpen] = useState(false);
  const [chequeChequeTypeOpen, setChequeChequeTypeOpen] = useState(false);
  const [chequeChequeBookOpen, setChequeChequeBookOpen] = useState(false);
  const [chequeSerialOpen, setChequeSerialOpen] = useState(false);
  const [chequeCustomizeChequeOpen, setChequeCustomizeChequeOpen] =
    useState(false);

  function addChequeReceivedRow() {
    formik.setFieldValue("chequeReceived", [
      ...formik.values.chequeReceived,
      emptyCheque,
    ]);
  }

  function RenderChequeChequeTypeOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeChequeTypeOpen(state);
    } else {
      setChequeChequeTypeOpen(false);
    }
  }
  function RenderChequeSerialOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeSerialOpen(state);
    } else {
      setChequeSerialOpen(false);
    }
  }
  function RenderChequeCusomizeChequeOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeCustomizeChequeOpen(state);
    } else {
      setChequeCustomizeChequeOpen(false);
    }
  }
  function RenderChequeChequeBookOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeChequeBookOpen(state);
    } else {
      setChequeChequeBookOpen(false);
    }
  }

  function RenderChequeBankNameOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeBankNameOpen(state);
    } else {
      setChequeBankNameOpen(false);
    }
  }

  function RenderChequeCashOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeCashOpen(state);
    } else {
      setChequeCashOpen(false);
    }
  }

  function RenderChequeCashierOpenState(index, state) {
    if (index === chequeFocusedRow - 1) {
      setChequeCashierOpen(state);
    } else {
      setChequeCashierOpen(false);
    }
  }

  function HandleChequeAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `chequeReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }
  function chequeKeyDownHandler(e) {
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

    if (
      e.keyCode === 40 &&
      chequeChequeTypeOpen === false &&
      chequeChequeBookOpen === false &&
      chequeCustomizeChequeOpen === false &&
      chequeSerialOpen === false
    ) {
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
    if (
      e.keyCode === 38 &&
      chequeChequeTypeOpen === false &&
      chequeChequeBookOpen === false &&
      chequeCustomizeChequeOpen === false &&
      chequeSerialOpen === false
    ) {
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
    if (
      e.keyCode === 13 &&
      chequeChequeTypeOpen === false &&
      chequeChequeBookOpen === false &&
      chequeCustomizeChequeOpen === false &&
      chequeSerialOpen === false
    ) {
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

  const [chequeAmountTotal, setChequeAmountTotal] = useState(0);

  function CalculateChequeAmountTotal() {
    let chequeAmountTemp = 0;
    formik.values.chequeReceived.forEach((element) => {
      chequeAmountTemp += element.amount;
      setChequeAmountTotal(parsFloatFunction(chequeAmountTemp, 2));
    });
  }

  function InputMask({ value, handleValueChange, openCalendar }) {
    let v = "";
    //   console.log('value::::::', value)
    Array.isArray(value)
      ? (v = value[0]
        .replaceAll("۰", "0")
        .replaceAll("۱", "1")
        .replaceAll("۲", "2")
        .replaceAll("۳", "3")
        .replaceAll("۴", "4")
        .replaceAll("۵", "5")
        .replaceAll("۶", "6")
        .replaceAll("۷", "7")
        .replaceAll("۸", "8")
        .replaceAll("۹", "9"))
      : (v = value
        .replaceAll("۰", "0")
        .replaceAll("۱", "1")
        .replaceAll("۲", "2")
        .replaceAll("۳", "3")
        .replaceAll("۴", "4")
        .replaceAll("۵", "5")
        .replaceAll("۶", "6")
        .replaceAll("۷", "7")
        .replaceAll("۸", "8")
        .replaceAll("۹", "9"));
    return (
      <Input
        className="rmdp-input"
        style={{ direction: "ltr" }}
        mask="9999/99/99"
        maskChar="-"
        onFocus={openCalendar}
        onChange={handleValueChange}
        value={v}
        alwaysShowMask={true}
      />
    );
  }

  const [maturityDate, setMaturityDate] = useState({});

  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/displayDetails`,
      "noopener,noreferrer"
    );
  };

  function getData(data) {
    console.log("getData data", data);
    formik.setFieldValue("match", data);
  }
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
                  <div className="content col-lg-4 col-md-4 col-12">
                    <div className="title">
                      <span> {t("شماره")} </span>
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
                  <div className="content col-lg-4 col-md-4 col-12">
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
                              "documentDate",
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
                      {formik.touched.date &&
                        formik.errors.date &&
                        !formik.values.date ? (
                        <div className="error-msg">{t(formik.errors.date)}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="content col-lg-4 col-md-4 col-12">
                    <div className="title">
                      <span> {t("جمع پرداخت")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="totalreceived"
                          name="totalreceived"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            HandleTotalreceivedChange(e.target.value)
                          }
                          value={formik.values.totalReceived}
                          decimalsLimit={2}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="content col-lg-6 col-md-12 col-12"
                    onFocus={() => {
                      dateRef?.current?.closeCalendar();
                    }}
                  >
                    <div className="row d-flex">
                      <div className="col-xl-auto col-lg-2 col-auto ">
                        <div className="title">
                          <span>‌</span>
                        </div>
                        <button
                          className="payToButton"
                          title={t("پرداخت به")}
                          type="button"
                          onClick={() => {
                            formik.setFieldValue(
                              "receivedFrom",
                              !formik.values.receivedFrom
                            );
                            formik.setFieldValue("accountParty", "");
                            formik.setFieldValue("definedAccount", "");
                            formik.setFieldValue("descriptive", "");
                            formik.setFieldValue("balance", 0);
                          }}
                        >
                          <MoreHorizIcon />
                        </button>
                      </div>
                      <div className="col-xl-auto col-lg-10 col-auto flex-grow-1 mb-0">
                        {formik.values.receivedFrom ? (
                          <div className="row">
                            <div className="col-12">
                              <div className="title">
                                <span>
                                  {t("طرف حساب")}
                                  <span className="star">*</span>
                                </span>
                              </div>
                              <div className="wrapper">
                                <SelectBox
                                  dataSource={accountParties}
                                  valueExpr="Code"
                                  className="selectBox"
                                  displayExpr={function (item) {
                                    return (
                                      item &&
                                      item.Code +
                                      "- " +
                                      item.Name +
                                      "- " +
                                      item.PersonLegalName
                                    );
                                  }}
                                  rtlEnabled={
                                    i18n.dir() == "ltr" ? false : true
                                  }
                                  onValueChanged={(e) => {
                                    formik.setFieldValue(
                                      "accountParty",
                                      e.value
                                    );
                                    console.log("eeee", e);
                                    // formik.setFieldValue(
                                    //     "balance",
                                    //     e
                                    // )
                                  }}
                                  itemRender={null}
                                  placeholder=""
                                  searchEnabled
                                ></SelectBox>
                                {formik.touched.accountParty &&
                                  formik.errors.accountParty &&
                                  !formik.values.accountParty ? (
                                  <div className="error-msg">
                                    {t(formik.errors.accountParty)}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-sm-6 col-12">
                              <div className="title">
                                <span>{t("حساب معین")}</span>
                              </div>
                              <SelectBox
                                dataSource={definedAccounts}
                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                onValueChanged={(e) =>
                                  formik.setFieldValue(
                                    "definedAccount",
                                    e.value
                                  )
                                }
                                valueExpr="Code"
                                displayExpr={function (item) {
                                  return (
                                    item && item.Code + "- " + item.FormersNames
                                  );
                                }}
                                className="selectBox"
                                noDataText={t("اطلاعات یافت نشد")}
                                itemRender={null}
                                placeholder=""
                                name="definedAccount"
                                id="definedAccount"
                                searchEnabled
                              />
                              {formik.touched.definedAccount &&
                                formik.errors.definedAccount ? (
                                <div className="error-msg">
                                  {t(formik.errors.definedAccount)}
                                </div>
                              ) : null}
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="title">
                                <span>{t("تفضیلی")}</span>
                              </div>
                              <SelectBox
                                dataSource={descriptives}
                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                onValueChanged={(e) =>
                                  formik.setFieldValue("descriptive", e.value)
                                }
                                valueExpr="Code"
                                displayExpr={function (item) {
                                  return item && item.Code + "- " + item.Name;
                                }}
                                className="selectBox"
                                noDataText={t("اطلاعات یافت نشد")}
                                itemRender={null}
                                placeholder=""
                                name="descriptive"
                                id="descriptive"
                                searchEnabled
                                disabled={formik.values.definedAccount == ""}
                              />
                              {formik.touched.descriptive &&
                                formik.errors.descriptive ? (
                                <div className="error-msg">
                                  {t(formik.errors.descriptive)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span> {t("مانده")} :</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className="form-input"
                          id="balance"
                          name="balance"
                          onChange={(e) => HandleBalanceChange(e.target.value)}
                          value={formik.values.balance}
                          decimalsLimit={2}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
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
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.documentDescription}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>‌</span>
                    </div>
                    <div className="title">
                      <span>
                        {" "}
                        {t("رأس چک‌ها")} : {chequeDues}{" "}
                      </span>
                    </div>
                    <div className="title">
                      <span>
                        {" "}
                        {t("رأس کل پرداخت‌ها")} : {allPaymentsDues}{" "}
                      </span>
                    </div>
                    <div className="title">
                      <span>
                        {" "}
                        {t("رأس کل دریافت‌ها با در نظر گرفتن تطبیق‌ها")} :{" "}
                        {finalDues}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="content col-lg-12 col-5">
                    {/* Cash Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("پرداخت‌های نقد")} :</span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={() => {
                              addCashReceivedRow();
                              setTimeout((e) => {
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
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("صندوق")}</th>
                                <th>{t("مبلغ")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="cashReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.cashReceived?.map(
                                      (cashReceives, index) => (
                                        <tr
                                          key={index}
                                          onFocus={(e) =>
                                            setCashFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            cashFocusedRow === index + 1
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
                                                id="cash"
                                                clearIcon={false}
                                                name={`cashReceived.${index}.cash`}
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
                                                  cashFocusedRow === index + 1
                                                    ? cashCashOpen
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
                                                    RenderCashCashOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderCashCashOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderCashCashOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `cashReceived[${index}].cash`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderCashCashOpenState(
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
                                                    cashCashOpen[index] ===
                                                    false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderCashCashOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  cashKeyDownHandler(e);
                                                }}
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
                                                cashKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="amount"
                                              name={`CashReceived.${index}.amount`}
                                              // value={
                                              //   formik.values.cashReceived[
                                              //     index
                                              //   ].amount
                                              // }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleCashAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateCashAmountTotal()
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
                                                setCashAmountTotal(
                                                  cashAmountTotal -
                                                  formik.values.cashReceived[
                                                    index
                                                  ].amount
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
                                    id="cashAmountTotal"
                                    disabled
                                    value={cashAmountTotal}
                                    name={`cashReceived.cashAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>

                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {formik?.errors?.cashReceived?.map((error, index) => (
                          <p className="error-msg" key={index}>
                            {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-1 col-1" />
                  <div className="content col-lg-12 col-6">
                    {/* Bank Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span">
                            {" "}
                            {t("واریز‌های بانکی")} :
                          </span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={(e) => {
                              addBankReceivedRow();
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
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>{t("ردیف")}</th>
                                <th>{t("مبدا")}</th>
                                <th>{t("صندوق")}</th>
                                <th>{t("تنخواه")}</th>
                                <th>{t("حساب بانکی")}</th>
                                <th>{t("نام بانک")}</th>
                                <th>{t("کد‌شعبه")}</th>
                                <th>{t("نام شعبه")}</th>
                                <th> {t("ش فیش")} </th>
                                <th>{t("مبلغ")}</th>
                                <th>{t("کارمزد بانکی")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="bankReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.bankReceived?.map(
                                      (bankReceives, index) => (
                                        <tr
                                          key={index}
                                          onFocus={(e) =>
                                            setBankFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            bankFocusedRow === index + 1
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

                                                clearIcon={false}
                                                id="origin"
                                                name={`bankReceived.${index}.origin`}
                                                options={
                                                  bankDatagridOriginLookup
                                                }
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
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  bankFocusedRow === index + 1
                                                    ? bankOriginOpen
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
                                                    RenderBankOriginOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderBankOriginOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderBankOriginOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `bankReceived[${index}].origin`,
                                                    value.Code
                                                  );

                                                }}
                                                onBlur={(e) =>
                                                  RenderBankOriginOpenState(
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
                                                    bankOriginOpen === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderBankOriginOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  if (
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "01"
                                                  ) {
                                                    bankKeyDownHandler(e);
                                                  } else if (
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "02"
                                                  ) {
                                                    bankKeyDownHandler(e);
                                                  } else if (
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "03"
                                                  ) {
                                                    bankKeyDownHandler(e);
                                                  } else {
                                                    bankKeyDownHandler(e);
                                                  }
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete`}
                                            >
                                              <Autocomplete

                                                clearIcon={false}
                                                id="treasury"
                                                name={`bankReceived.${index}.treasury`}
                                                options={
                                                  bankDatagridTreasuryLookup
                                                }
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {/* {option.Code} -{" "}
                                                    {option.Name} -{" "} */}
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  background:
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "01"
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  bankFocusedRow === index + 1
                                                    ? bankTreasuryOpen
                                                    : false
                                                }
                                                disabled={
                                                  (formik.values.bankReceived[
                                                    index
                                                  ].origin ===
                                                    "01") ===
                                                  false
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
                                                    RenderBankTreasuryOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderBankTreasuryOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderBankTreasuryOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `bankReceived[${index}].treasury`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderBankTreasuryOpenState(
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
                                                    bankTreasuryOpen === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderBankTreasuryOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  bankKeyDownHandler(e);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete

                                                id="treasury"
                                                name={`bankReceived.${index}.fund`}
                                                options={
                                                  bankDatagridTreasuryLookup
                                                }
                                                clearIcon={false}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {/* {option.Code} -{" "}
                                                    {option.Name} -{" "} */}
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  background:
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "02"
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  bankFocusedRow === index + 1
                                                    ? bankFundOpen
                                                    : false
                                                }
                                                disabled={
                                                  !(
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "02"
                                                  )
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
                                                    RenderBankFundOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderBankFundOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderBankFundOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `bankReceived[${index}].fund`,
                                                    value.Code
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderBankFundOpenState(
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
                                                    bankFundOpen === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderBankFundOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  bankKeyDownHandler(e);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete

                                                clearIcon={false}
                                                id="account"
                                                name={`bankReceived.${index}.account`}
                                                options={
                                                  bankDatagridTreasuryLookup
                                                }
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {/* {option.Code} -{" "}
                                                    {option.Name} -{" "} */}
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  background:
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "03"
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  bankFocusedRow === index + 1
                                                    ? bankAccountOpen
                                                    : false
                                                }
                                                disabled={
                                                  (formik.values.bankReceived[
                                                    index
                                                  ].origin ===
                                                    "03") ===
                                                  false
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
                                                    RenderBankAccountOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderBankAccountOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderBankAccountOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `bankReceived[${index}].account`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderBankAccountOpenState(
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
                                                    bankAccountOpen === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderBankAccountOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  bankKeyDownHandler(e);
                                                }}
                                              />
                                            </div>
                                          </td>

                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete

                                                id="bank"
                                                name={`bankReceived.${index}.bank`}
                                                options={bankDatagridBankLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Code} -{" "}
                                                    {option.Name} -{" "}
                                                    {option.BankAccountNumber}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Code.includes(
                                                        state.inputValue.toLowerCase()
                                                      ) ||
                                                      element.Name.replace(
                                                        "/",
                                                        ""
                                                      )
                                                        .toLowerCase()
                                                        .includes(
                                                          state.inputValue.toLowerCase()
                                                        ) ||
                                                      element.BankAccountNumber.includes(
                                                        state.inputValue.toLowerCase()
                                                      )
                                                    )
                                                      newOptions.push(element);
                                                  });
                                                  return newOptions;
                                                }}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                clearIcon={false}
                                                forcePopupIcon={false}
                                                open={
                                                  bankFocusedRow === index + 1
                                                    ? bankBankOpen
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
                                                    RenderBankBankOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderBankBankOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderBankBankOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `bankReceived[${index}].bank`,
                                                    value.Name
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderBankBankOpenState(
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
                                                // renderInput={(params) => {
                                                //   const InputProps = {
                                                //     ...params.InputProps,
                                                //   };
                                                //   InputProps.endAdornment =
                                                //     null;
                                                //   return (
                                                //     <TextField
                                                //       {...params}
                                                //       label=""
                                                //       variant="outlined"
                                                //       InputProps={InputProps}
                                                //     />
                                                //   );
                                                // }}

                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    bankBankOpen === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderBankBankOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  if (
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "01"
                                                  ) {
                                                    bankKeyDownHandler(e);
                                                  } else if (
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "02"
                                                  ) {
                                                    bankKeyDownHandler(e);
                                                  } else if (
                                                    formik.values.bankReceived[
                                                      index
                                                    ].origin === "03"
                                                  ) {
                                                    bankKeyDownHandler(e);
                                                  } else {
                                                    bankKeyDownHandler(e);
                                                  }
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                chequeKeyDownHandler(e)
                                              }
                                              name={`bankReceived.${index}.branchCode`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.bankReceived[
                                                  index
                                                ].branchCode
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                bankKeyDownHandler(e)
                                              }
                                              name={`bankReceived.${index}.branchName`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.bankReceived[
                                                  index
                                                ].branchName
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                bankKeyDownHandler(e)
                                              }
                                              name={`bankReceived.${index}.slipNumber`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.bankReceived[
                                                  index
                                                ].slipNumber
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
                                                bankKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              id="amount"
                                              name={`bankReceived.${index}.amount`}
                                              // value={
                                              //   formik.values.bankReceived[
                                              //     index
                                              //   ].amount
                                              // }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleBankAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateBankAmountTotal()
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
                                                bankKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              id="bankFee"
                                              name={`bankReceived.${index}.bankFee`}
                                              // value={
                                              //   formik.values.bankReceived[
                                              //     index
                                              //   ].bankFee
                                              // }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleBankFeeChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateBankFeeTotal()
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
                                                setBankAmountTotal(
                                                  bankAmountTotal -
                                                  formik.values.bankReceived[
                                                    index
                                                  ].amount
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
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    id="bankAmountTotal"
                                    disabled
                                    value={bankAmountTotal}
                                    name={`bankReceived.bankAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    id="bankFeeTotal"
                                    disabled
                                    value={bankFeeTotal}
                                    name={`bankReceived.bankFeeTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {formik?.errors?.cashReceived?.map((error, index) => (
                          <p className="error-msg" key={index}>
                            {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-12 col-12">
                    {/* Cheque Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("چک‌های پرداختی")} :</span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={() => {
                              addChequeReceivedRow();
                              setTimeout((e) => {
                                let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                while (added.querySelector("button") || added.querySelector("input").disabled) {
                                  added = findNextFocusable(added)
                                }
                                added.querySelector("input").focus()
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
                                <th>{t("نوع چک")}</th>
                                <th>{t("دسته چک")}</th>
                                <th>{t("چک مشتری")}</th>
                                <th>{t("سریال")}</th>
                                <th>{t("نام بانک")}</th>
                                <th> {t("کد شعبه")} </th>
                                <th> {t("نام شعبه")} </th>
                                <th> {t("محل صدور")} </th>
                                <th> {t("سررسید")} </th>
                                <th>{t("مبلغ")}</th>
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
                                          key={index}
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

                                                clearIcon={false}
                                                id="origin"
                                                name={`chequeReceived.${index}.chequeType`}
                                                options={
                                                  chequeDatagridChequeTypeLookup
                                                }
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
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                    ? chequeChequeTypeOpen
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
                                                    RenderChequeChequeTypeOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderChequeChequeTypeOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  console.log("change");
                                                  console.log("index", index);
                                                  console.log(
                                                    "vvv",
                                                    formik.values.chequeReceived
                                                  );

                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].chequeBook`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].customizeCheque`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].serial`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].bankName`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].branchCode`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].branchName`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].issuancePlace`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].maturity`,
                                                    ""
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].amount`,
                                                    0
                                                  );

                                                  RenderChequeChequeTypeOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].chequeType`,
                                                    value.Code
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderChequeChequeTypeOpenState(
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
                                                    chequeChequeTypeOpen ===
                                                    false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderChequeChequeTypeOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  if (
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "01"
                                                  ) {
                                                    chequeKeyDownHandler(e);
                                                  } else if (
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "02"
                                                  ) {
                                                    chequeKeyDownHandler(e);
                                                  } else {
                                                    chequeKeyDownHandler(e);
                                                  }
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete`}
                                            >
                                              <Autocomplete
                                                clearIcon={false}
                                                id="chequeBook"
                                                name={`chequeReceived.${index}.chequeBook`}
                                                options={
                                                  chequeDatagridChequeBookLookup
                                                }
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {/* {option.Code} -{" "}
                                                    {option.Name} -{" "} */}
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  background:
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "01"
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  chequeFocusedRow === index + 1
                                                    ? chequeChequeBookOpen
                                                    : false
                                                }
                                                disabled={
                                                  !(
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "01"
                                                  )
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
                                                    RenderChequeChequeBookOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderChequeChequeBookOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderChequeChequeBookOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].chequeBook`,
                                                    value.Name
                                                  );

                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].bankName`,
                                                    value.bankName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].branchCode`,
                                                    value.branchCode
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].branchName`,
                                                    value.branchName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].issuancePlace`,
                                                    value.issuancePlace
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderChequeChequeBookOpenState(
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
                                                    chequeChequeBookOpen ===
                                                    false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderChequeChequeBookOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  chequeKeyDownHandler(e);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete`}
                                            >
                                              <Autocomplete
                                                clearIcon={false}
                                                id="chequeBook"
                                                name={`chequeReceived.${index}.customizeCheque`}
                                                options={
                                                  chequeDatagridCustomizeChequeLookup
                                                }
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {/* {option.Code} -{" "}
                                                    {option.Name} -{" "} */}
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  background:
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "02"
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={false}
                                                forcePopupIcon={false}
                                                open={
                                                  chequeFocusedRow === index + 1
                                                    ? chequeCustomizeChequeOpen
                                                    : false
                                                }
                                                disabled={
                                                  !(
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "02"
                                                  )
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
                                                    RenderChequeCusomizeChequeOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderChequeCusomizeChequeOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderChequeCusomizeChequeOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].customizeCheque`,
                                                    value.Name
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].serial`,
                                                    value.serial
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].bankName`,
                                                    value.bankName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].branchCode`,
                                                    value.branchCode
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].branchName`,
                                                    value.branchName
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].issuancePlace`,
                                                    value.issuancePlace
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].maturity`,
                                                    value.maturity
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].amount`,
                                                    value.amount
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderChequeCusomizeChequeOpenState(
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
                                                    chequeCustomizeChequeOpen ===
                                                    false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderChequeCusomizeChequeOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  chequeKeyDownHandler(e);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete`}
                                            >
                                              <Autocomplete
                                                clearIcon={false}
                                                id="serial"
                                                name={`chequeReceived.${index}.serial`}
                                                options={
                                                  bankDatagridTreasuryLookup
                                                }
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {/* {option.Code} -{" "}
                                                    {option.Name} -{" "} */}
                                                    {option.Code}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Name.replace(
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
                                                  option.Code
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 300,
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
                                                  background:
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "01"
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  chequeFocusedRow === index + 1
                                                    ? chequeSerialOpen
                                                    : false
                                                }
                                                disabled={
                                                  !(
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "01"
                                                  )
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
                                                    RenderChequeSerialOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderChequeSerialOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderChequeSerialOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `chequeReceived[${index}].serial`,
                                                    value.Code
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderChequeSerialOpenState(
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
                                                    chequeSerialOpen === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderChequeSerialOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  if (
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "01"
                                                  ) {
                                                    chequeKeyDownHandler(e);
                                                  } else if (
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "02"
                                                  ) {
                                                    chequeKeyDownHandler(e);
                                                  } else {
                                                    chequeKeyDownHandler(e);
                                                  }
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                chequeKeyDownHandler(e)
                                              }
                                              name={`chequeReceived.${index}.bankName`}
                                              type="text"
                                              disabled
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].bankName
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                chequeKeyDownHandler(e)
                                              }
                                              name={`chequeReceived.${index}.branchCode`}
                                              type="text"
                                              disabled
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].branchCode
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                chequeKeyDownHandler(e)
                                              }
                                              name={`chequeReceived.${index}.branchName`}
                                              type="text"
                                              disabled
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].branchName
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                chequeKeyDownHandler(e)
                                              }
                                              name={`chequeReceived.${index}.issuancePlace`}
                                              type="text"
                                              disabled
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.chequeReceived[
                                                  index
                                                ].issuancePlace
                                              }
                                              autoComplete="off"
                                            />
                                          </td>

                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              onKeyDown={(e) => {
                                                if (
                                                  e.keyCode === 13 ||
                                                  e.keyCode === 9 ||
                                                  e.keyCode === 38 ||
                                                  e.keyCode === 40 ||
                                                  e.keyCode === 37 ||
                                                  e.keyCode === 39
                                                ) {
                                                  chequeKeyDownHandler(e);
                                                }
                                              }}
                                              onFocus={() => {
                                                chequeMaturityRefs?.current.forEach(
                                                  (item, index2) => {
                                                    if (index !== index2) {
                                                      chequeMaturityRefs?.current[
                                                        index2
                                                      ]?.parentElement.parentElement.closeCalendar();
                                                    }
                                                  }
                                                );
                                              }}
                                            >
                                              <DatePicker
                                                name={`chequeReceived.${index}.maturity`}
                                                disabled={
                                                  formik.values.chequeReceived[
                                                    index
                                                  ].chequeType === "02"
                                                }
                                                id="maturityDate"
                                                ref={el =>
                                                (chequeMaturityRefs.current[
                                                  index
                                                ] = el?.querySelector("input"))
                                                }
                                                calendar={renderCalendarSwitch(
                                                  i18n.language
                                                )}
                                                locale={renderCalendarLocaleSwitch(
                                                  i18n.language
                                                )}
                                                calendarPosition="bottom-right"
                                                onOpen={() => {
                                                  setTimeout(() => {
                                                    chequeMaturityRefs.current[
                                                      index
                                                    ].focus();
                                                  }, 1);
                                                }}
                                                style={{
                                                  direction: "ltr",
                                                  background:
                                                    formik.values
                                                      .chequeReceived[index]
                                                      .chequeType === "02"
                                                      ? "#f9fcffd2"
                                                      : "white",
                                                }}
                                                render={
                                                  formik.values.chequeReceived[
                                                    index
                                                  ].chequeType === "02" ? (
                                                    ""
                                                  ) : (
                                                    <InputMask />
                                                  )
                                                }
                                                onChange={(date) => {
                                                  if (
                                                    !chequeMaturityRefs.current[
                                                      index
                                                    ].value.includes("–")
                                                  ) {
                                                    formik.setFieldValue(
                                                      `chequeReceived[${index}].maturity`,
                                                      julianIntToDate(
                                                        date.toJulianDay()
                                                      )
                                                    );
                                                  } else if (
                                                    date &&
                                                    !new DateObject(
                                                      chequeMaturityRefs.current[
                                                        index
                                                      ].value
                                                    ).isValid
                                                  ) {
                                                    formik.setFieldValue(
                                                      `chequeReceived[${index}].maturity`,
                                                      julianIntToDate(
                                                        date.toJulianDay()
                                                      )
                                                    );
                                                  }
                                                }}
                                                // onFocusedDateChange={()=> chequeAmountRefs.current[index].focus()}
                                                onOpenPickNewDate={false}
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
                                                chequeKeyDownHandler(e)
                                              }
                                              className={`form-input `}
                                              id="amount"
                                              name={`chequeReceived.${index}.amount`}
                                              disabled={
                                                !(
                                                  formik.values.chequeReceived[
                                                    index
                                                  ].chequeType === "01"
                                                )
                                              }
                                              // value={
                                              //   formik.values.chequeReceived[
                                              //     index
                                              //   ].amount
                                              // }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleChequeAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={(e) =>
                                                CalculateChequeAmountTotal()
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
                                                setCashAmountTotal(
                                                  cashAmountTotal -
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
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
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
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {formik?.errors?.cashReceived?.map((error, index) => (
                          <p className="error-msg" key={index}>
                            {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormikProvider>
        </div>
        {
          <div
            className={`Tatbiq ${formik.values.receivedFrom && debtor.length && creditor.length
              ? ""
              : "d-none"
              }`}
          >
            <Kara
              debtor={debtor}
              creditor={creditor}
              showOtherBtn={true}
              getData={getData}
              show={formik.values.receivedFrom}
            />
          </div>
        }
      </div>
      <div>
        <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
          <Button
            variant="contained"
            color="success"
            type="button"
            onClick={formik.handleSubmit}
          >
            {t("ثبت تغییرات")}
          </Button>

          <div className="Issuance">
            <Button
              variant="contained"
              color="error"
              onClick={callComponent}
              style={{ marginRight: "10px" }}
            >
              {t("انصراف")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
