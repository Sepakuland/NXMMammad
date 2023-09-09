import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as Yup from "yup";
import swal from "sweetalert";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import service from "./invoiceNumber";
import bank from "./bankDefinitionList";
import fund from "./fundList";
import treasury from "./treasuryList";
import account from "./accountSideList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../../../utils/calenderLang";
import { renderCalendarSwitch } from "../../../../../utils/calenderLang";
import DateObject from "react-date-object";
import { parsFloatFunction } from "../../../../../utils/parsFloatFunction";
import CurrencyInput from "react-currency-input-field";
import { history } from "../../../../../utils/history";
import { Button } from "@mui/material";
import Kara from "../../../../../components/SetGrid/Kara";
import { karadummyRight } from "../../../../../components/SetGrid/karadummyRight";
import { karadummyLeft } from "../../../../../components/SetGrid/karadummyLeft.js";
const Factor = [];

export const DepositToBank = () => {
  const { t, i18n } = useTranslation();
  const [alignment, setAlignment] = React.useState("");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const theme = useTheme();
  const [factor, setFactor] = React.useState(Factor);
  const [invoiceNumbers, setInvoiceNumber] = React.useState(
    service.getInvoiceNumber()
  );
  const [bankDefinition, setBankDefinition] = React.useState(
    bank.getBankList()
  );
  const [fundList, setFundList] = React.useState(fund.getFundList());
  const [treasuryList, setTreasuryList] = React.useState(
    treasury.getTreasuryList()
  );
  const [accountSideList, setAccountSideList] = React.useState(
    account.getAccountSideList()
  );
  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 1000),
      transactionCode: 362,
      transactionDate: julianIntToDate(new DateObject().toJulianDay()),
      price: "",
      bankCommission: 0,
      bankDefinition: "",
      branchCode: "",
      BankName: "",
      BranchName: "",
      transferNumber: "",
      BranchCode: "",
      CheckNumber: "",
      DateOverdeal: "",
      chequePlan: "fund",
      accountSideList: "",
      Detailed: "",
      documentDescribe: "",
      moeinAcount: "",
      Balance: "",
      treasuryList: "",
      Remaining: "",
      show: true,
      fundList: "",
      invoiceNumber: "",
      type: { value: "fund" },
    },
    validateOnChange:false,

    validationSchema: Yup.object({
      show: Yup.boolean(),
      chequePlan: Yup.string(),
      bankDefinition: Yup.string().required(() => {
        return "نام بانک الزامیست";
      }),
      treasuryList: Yup.string().when("chequePlan", (chequePlan) => {
        if (chequePlan === "treasury")
          return Yup.string().required("نام صندوق‌ الزامی است");
      }),
      invoiceNumber: Yup.string().when("chequePlan", (chequePlan) => {
        if (chequePlan === "bank")
          return Yup.string().required("بانک مبدا الزامی است");
      }),

      fundList: Yup.string().when("chequePlan", (chequePlan) => {
        if (chequePlan === "fund")
          return Yup.string().required("نام ‌تنخواه الزامی است");
      }),
      bankCommission: Yup.number().typeError("لطفا عدد وارد کنید"),
      accountSideList: Yup.string().when("show", (show) => {
        if (show)
          return Yup.string().required(() => {
            return "نام طرف حساب الزامیست";
          });
      }),

    }),

    onSubmit: (values) => {
      console.log("here", values);
      factorSub();
    },
  });
  const factorSub = () => {
    swal({
      title: t("فاکتور با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  const selectRef = useRef();

  useEffect(() => {
    if (formik.values.invoiceNumber) {
      let current = invoiceNumbers.filter(
        (item) => item.value === formik.values.invoiceNumber
      )[0];

      formik.setFieldValue("BankName", current.BankName);
      formik.setFieldValue("BranchName", current.BranchName);
      formik.setFieldValue("BranchCode", current.BranchCode);
      formik.setFieldValue("CheckNumber", current.CheckNumber);
      formik.setFieldValue("DateOverdeal", current.DateOverdeal);
    }
  }, [formik.values.invoiceNumber]);

  useEffect(() => {
    if (formik.values.bankDefinitionList) {
      let current = bankDefinition.filter(
        (item) => item.value === formik.values.bankDefinitionList
      )[0];

      formik.setFieldValue("Name", current.Name);
      formik.setFieldValue("Code", current.Code);
    }
  }, [formik.values.bankDefinitionList]);

  useEffect(() => {
    if (formik.values.fundList) {
      let current = fundList.filter(
        (item) => item.value === formik.values.fundList
      )[0];

      formik.setFieldValue("Balance", current.Balance);
    }
  }, [formik.values.fundList]);
  useEffect(() => {
    if (formik.values.treasuryList) {
      let current = treasuryList.filter(
        (item) => item.value === formik.values.treasuryList
      )[0];

      formik.setFieldValue("Balance", current.Balance);
    }
  }, [formik.values.treasuryList]);
  useEffect(() => {
    if (formik.values.accountSideList) {
      let current = accountSideList.filter(
        (item) => item.value === formik.values.accountSideList
      )[0];

      formik.setFieldValue("Remaining", current.Balance);
    }
  }, [formik.values.accountSideList]);

  const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
  const [show, setShow] = useState(true);
  const dateRef2 = useRef();
  const [date, setDate] = useState(new DateObject());
  function HandleSalePriceChange1(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("price", parsFloatFunction(temp, 2));
  }
  function HandleSalePriceChange2(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("bankCommission", parsFloatFunction(temp, 2));
  }
  const types = [
    { id: 1, value: "fund" },
    { id: 2, value: "treasury" },
    { id: 3, value: "bank" },
  ];
  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/RemittancePayable/DisplayDetails`
    );
  };
  function getData(data) {
    formik.setFieldValue('match',data)
  }
  const [debtor, setDebtor] = useState([]);
  const [creditor, setCreditor] = useState([]);

  useEffect(()=>{
    if(show){
      setDebtor(karadummyRight)
      setCreditor(karadummyLeft)
    }else{
      setDebtor([])
      setCreditor([])
    }
  },[show])


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
          <form onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="row ">
                <div
                  className="content col-lg-6 col-md-12 col-12"
                  onFocus={() => {
                    dateRef2?.current?.closeCalendar();
                  }}
                >
                  <div className="title">
                    <span>{t("کد تراکنش")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        disabled
                        className="form-input"
                        type="text"
                        id="transactionCode"
                        name="transactionCode"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.transactionCode}
                        placeholder="362"
                      />

                      {formik.touched.transactionCode &&
                      formik.errors.transactionCode &&
                      !formik.values.transactionCode ? (
                        <div className="error-msg">
                          {t(formik.errors.transactionCode)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-12 col-12">
                  <div className="title">
                    <span>{t("تاریخ تراکنش")}</span>
                  </div>
                  <div className="wrapper date-picker position-relative">
                    <DatePicker
                      name={"transactionDate"}
                      id={"transactionDate"}
                      ref={dateRef2}
                      editable={false}
                      value={date}
                      calendar={renderCalendarSwitch(i18n.language)}
                      locale={renderCalendarLocaleSwitch(i18n.language)}
                      onBlur={formik.handleBlur}
                      onChange={(val) => {
                        setDate(val);
                        formik.setFieldValue(
                          "transactionDate",
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
                  {formik.touched.startDate && formik.errors.startDate ? (
                    <div className="error-msg">
                      {t(formik.errors.startDate)}
                    </div>
                  ) : null}
                </div>
                <div
                  className="content col-lg-6 col-md-12 col-12"
                  onFocus={() => {
                    dateRef2?.current?.closeCalendar();
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
                          formik.setFieldValue('show',!formik.values.show)
                          formik.setFieldValue('accountSideList','')
                          formik.setFieldValue('moeinAcount','')
                          formik.setFieldValue('Detailed','')
                        }}
                      >
                        <MoreHorizIcon />
                      </button>
                    </div>
                    <div className="col-auto flex-grow-1 mb-0">
                      {formik.values.show ? (
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
                                ref={selectRef}
                                dataSource={fundList}
                                valueExpr="value"
                                className="selectBox"
                                displayExpr={function (item) {
                                  return (
                                    item &&
                                    item.value +
                                      "- " +
                                      item.BankName +
                                      "- " +
                                      item.Balance
                                  );
                                }}
                                displayValue="value"
                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                onValueChanged={(e) =>
                                  formik.setFieldValue(
                                    "accountSideList",
                                    e.value
                                  )
                                }
                                itemRender={null}
                                placeholder=""
                                searchEnabled
                              ></SelectBox>
                              {formik.touched.accountSideList &&
                              formik.errors.accountSideList &&
                              !formik.values.accountSideList ? (
                                <div className="error-msg">
                                  {t(formik.errors.accountSideList)}
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
                              dataSource={measurementUnits}
                              rtlEnabled={i18n.dir() == "ltr" ? false : true}
                              onValueChanged={(e) =>
                                formik.setFieldValue("moeinAcount", e.value)
                              }
                              className="selectBox"
                              noDataText={t("اطلاعات یافت نشد")}
                              itemRender={null}
                              placeholder=""
                              name="moeinAcount"
                              id="moeinAcount"
                              searchEnabled
                              showClearButton
                            ></SelectBox>

                          </div>
                          <div className="col-sm-6 col-12">
                            <div className="title">
                              <span>{t("تفضیلی")}</span>
                            </div>
                            <SelectBox
                              dataSource={measurementUnits}
                              rtlEnabled={i18n.dir() == "ltr" ? false : true}
                              onValueChanged={(e) =>
                                formik.setFieldValue("Detailed", e.value)
                              }
                              className="selectBox"
                              noDataText={t("اطلاعات یافت نشد")}
                              itemRender={null}
                              placeholder=""
                              name="Detailed"
                              id="Detailed"
                              searchEnabled
                              showClearButton
                            ></SelectBox>

                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("مانده")}</span>
                  </div>
                  <CurrencyInput
                    className="form-input"
                    id="Remaining"
                    name="Remaining"
                    decimalsLimit={2}
                    disabled
                    value={formik.values.Remaining}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("مبلغ")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        id="price"
                        name="price"
                        decimalsLimit={2}
                        onChange={(e) => HandleSalePriceChange1(e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.price &&
                      formik.errors.price &&
                      !formik.values.price ? (
                        <div className="error-msg">
                          {t(formik.errors.price)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("کارمزد بانکی")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        id="bankCommission"
                        name="bankCommission"
                        decimalsLimit={2}
                        onChange={(e) => HandleSalePriceChange2(e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.bankCommission &&
                      formik.errors.bankCommission &&
                      !formik.values.bankCommission ? (
                        <div className="error-msg">
                          {t(formik.errors.bankCommission)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {t("بانک")} <span className="star">*</span>
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        className="selectBox"
                        dataSource={bankDefinition}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        valueExpr="Code"
                        placeholder=""
                        searchEnabled={true}
                        displayExpr={function (item) {
                          return item && item.Code + "- " + item.Name;
                        }}
                        displayValue="value"
                        onValueChanged={(e) => {
                          formik.setFieldValue("bankDefinition", e.value);
                        }}
                      />
                      {formik.touched.bankDefinition &&
                      formik.errors.bankDefinition &&
                      !formik.values.bankDefinition ? (
                        <div className="error-msg">
                          {t(formik.errors.bankDefinition)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("کد شعبه")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        type="text"
                        id="branchCode"
                        name="branchCode"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.branchCode}
                      />
                      {formik.touched.branchCode &&
                      formik.errors.branchCode &&
                      !formik.values.branchCode ? (
                        <div className="error-msg">
                          {t(formik.errors.branchCode)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("نام شعبه")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        type="text"
                        id="BranchName"
                        name="BranchName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.BranchName}
                      />

                      {formik.touched.BranchName &&
                      formik.errors.BranchName &&
                      !formik.values.BranchName ? (
                        <div className="error-msg">
                          {t(formik.errors.BranchName)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("شماره حواله")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        type="number"
                        id="transferNumber"
                        name="transferNumber"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.transferNumber}
                      />

                      {formik.touched.transferNumber &&
                      formik.errors.transferNumber &&
                      !formik.values.transferNumber ? (
                        <div className="error-msg">
                          {t(formik.errors.transferNumber)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-12">
                  <div className="title">
                    <span>{t("مبدا")}</span>
                  </div>
                  <div className="wrapper">
                    <RadioGroup
                      name="pie-field"
                      // defaultChecked="chequeBook"
                      defaultValue={formik.values.chequePlan}
                      row
                      onChange={(val) => {
                        formik.setFieldValue(
                          "chequePlan",
                          val.target.defaultValue
                        );

                        formik.setFieldValue("fundList", "");
                        formik.setFieldValue("invoiceNumber", "");
                        formik.setFieldValue("treasuryList", "");
                        formik.setFieldValue("Balance", "");
                      }}
                      className={i18n.dir() === "rtl" ? "rtl-radio-group" : ""}
                    >
                      <FormControlLabel
                        value="fund"
                        control={<Radio />}
                        label={t("تنخواه")}
                      />
                      <FormControlLabel
                        value="treasury"
                        control={<Radio />}
                        label={t("صندوق")}
                      />
                      <FormControlLabel
                        value="bank"
                        control={<Radio />}
                        label={t("بانک")}
                      />
                    </RadioGroup>
                  </div>
                </div>
                {formik.values.chequePlan === "treasury" && (
                  <>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>
                          {t("صندوق")} <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            ref={selectRef}
                            className="selectBox"
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            dataSource={treasuryList}
                            placeholder=""
                            valueExpr="value"
                            searchEnabled={true}
                            displayExpr={function (item) {
                              return (
                                item &&
                                item.value +
                                  "- " +
                                  item.PartnerName +
                                  "- " +
                                  item.Balance
                              );
                            }}
                            displayValue="value"
                            onValueChanged={(e) => {
                              formik.setFieldValue("treasuryList", e.value);
                            }}
                          />

                          {formik.touched.treasuryList &&
                          formik.errors.treasuryList &&
                          !formik.values.treasuryList ? (
                            <div className="error-msg">
                              {t(formik.errors.treasuryList)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>{t("موجودی")}</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            type="text"
                            id="Balance"
                            name="Balance"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.Balance}
                            disabled
                          />
                          {formik.touched.Balance &&
                          formik.errors.Balance &&
                          !formik.values.Balance ? (
                            <div className="error-msg">
                              {t(formik.errors.Balance)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {formik.values.chequePlan === "fund" && (
                  <>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>
                          {t("تنخواه")} <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            ref={selectRef}
                            dataSource={fundList}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            className="selectBox"
                            placeholder=""
                            valueExpr="value"
                            searchEnabled={true}
                            displayExpr={function (item) {
                              return (
                                item &&
                                item.value +
                                  "- " +
                                  item.BankName +
                                  "- " +
                                  item.Balance
                              );
                            }}
                            displayValue="value"
                            onValueChanged={(e) => {
                              formik.setFieldValue("fundList", e.value);
                            }}
                          />
                          {formik.touched.fundList &&
                          formik.errors.fundList &&
                          !formik.values.fundList ? (
                            <div className="error-msg">
                              {t(formik.errors.fundList)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>{t("موجودی")}</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            disabled
                            type="text"
                            id="Balance"
                            name="Balance"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.Balance}
                          />
                          {formik.touched.Balance &&
                          formik.errors.Balance &&
                          !formik.values.Balance ? (
                            <div className="error-msg">
                              {t(formik.errors.Balance)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {formik.values.chequePlan === "bank" && (
                  <>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>
                          {t("بانک")} <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            ref={selectRef}
                            dataSource={invoiceNumbers}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            className="selectBox"
                            placeholder=""
                            valueExpr="value"
                            searchEnabled={true}
                            displayExpr={function (item) {
                              return (
                                item &&
                                item.value +
                                  "- " +
                                  item.BankName +
                                  "- " +
                                  item.BranchName +
                                  "- " +
                                  item.BranchCode
                              );
                            }}
                            displayValue="value"
                            onValueChanged={(e) => {
                              formik.setFieldValue("invoiceNumber", e.value);
                            }}
                          />
                          {formik.touched.invoiceNumber &&
                          formik.errors.invoiceNumber &&
                          !formik.values.invoiceNumber ? (
                            <div className="error-msg">
                              {t(formik.errors.invoiceNumber)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>{t("موجودی")}</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            type="text"
                            id="CheckNumber"
                            name="CheckNumber"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.CheckNumber}
                          />
                          {formik.touched.CheckNumber &&
                          formik.errors.CheckNumber &&
                          !formik.values.CheckNumber ? (
                            <div className="error-msg">
                              {t(formik.errors.CheckNumber)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("شرح سند")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <textarea
                        className="form-input"
                        type="text"
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
              </div>
            </div>
          </form>
        </div>
        {<div className={`Tatbiq ${formik.values.show&&debtor.length&&creditor.length?'':'d-none'}`}>
          <Kara debtor={debtor} creditor={creditor} showOtherBtn={true} getData={getData} show={formik.values.show} />
        </div>}
      </div>
      <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
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
    </>
  );
};

export default DepositToBank;
