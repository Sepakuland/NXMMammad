import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as Yup from "yup";
import swal from "sweetalert";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import service from "./invoiceNumber";
import fund from "./fundList";
import account from "./accountSideList";
import treasury from "./treasuryList";
import sideCheque from "./accountSideCheque";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { julianIntToDate } from "../../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../../utils/calenderLang";
import { renderCalendarSwitch } from "../../../../utils/calenderLang";
import DateObject from "react-date-object";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import CurrencyInput from "react-currency-input-field";
import { history } from "../../../../utils/history";
import { Button } from "@mui/material";
import Kara from "../../../../components/SetGrid/Kara";
import { karadummyRight } from "../../../../components/SetGrid/karadummyRight";
import { karadummyLeft } from "../../../../components/SetGrid/karadummyLeft.js";
const Factor = [];

export const ChequeIssuance = () => {
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
  const [treasuryList, setTreasuryList] = React.useState(
    treasury.getTreasuryList()
  );
  const [fundList, setFundList] = React.useState(fund.getFundList());
  const [accountSideList, setAccountSideList] = React.useState(
    account.getAccountSideList()
  );
  const [accountSideCheque, setAccountSideCheque] = React.useState(
    sideCheque.getAccountSideCheque()
  );
  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 1000),
      CheckNumber: "",
      accountSideCheque: "",
      transactionCode: 362,
      Price: "",
      DateOverdeal: "",
      chequePlan: "chequeBook",
      transactionDate: julianIntToDate(new DateObject().toJulianDay()),
      accountSide: "",
      accountSideList: "",
      receivedFrom: true,
      Detailed: "",
      documentDescribe: "",
      deliveryGuy: "",
      moeinAcount: "",
      show: true,
    },
    show: Yup.boolean(),
    validationSchema: Yup.object({
      chequePlan: Yup.string(),
      accountSideCheque: Yup.string().required(() => {
        return "نوع چک الزامیست";
      }),

      DateOverdeal: Yup.string().when("chequePlan", (chequePlan) => {
        if (chequePlan === "chequeBook" || chequePlan === "accountSideCheque")
          return Yup.string().required("تاریخ سررسید الزامیست");
      }),
      //accountSideCheque: Yup.string()
      //    .when("chequePlan", (chequePlan) => {
      //        if (chequePlan === "accountSideCheque" || chequePlan==="chequeBook")
      //            return Yup.string().required(" نوع چک الزامیست")
      //    }),
      deliveryGuy: Yup.string().required(() => {
        return "تحویل گیرنده الزامیست";
      }),
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

  const [debtor, setDebtor] = useState([]);
  const [creditor, setCreditor] = useState([]);

  useEffect(()=>{
    if(formik.values.show){
      setDebtor(karadummyRight)
      setCreditor(karadummyLeft)
    }else{
      setDebtor([])
      setCreditor([])
    }
  },[formik.values.show])

  console.log('debtor',debtor)


  const [selectVal, setSelectVal] = useState();
  const selectRef = useRef();

  let inputUi =
    selectRef?.current?._instance?._$textEditorInputContainer[0]?.querySelector(
      "input"
    );

  useEffect(() => {
    if (formik.values.invoiceNumber) {
      let current = invoiceNumbers.filter(
        (item) => item.value === formik.values.invoiceNumber
      )[0];

      formik.setFieldValue("CheckNumber", current.CheckNumber);
      formik.setFieldValue("Price", current.Price);
      formik.setFieldValue("DateOverdeal", current.DateOverdeal);
    }
  }, [formik.values.invoiceNumber]);
  useEffect(() => {
    if (formik.values.accountSideCheque) {
      let current = accountSideCheque.filter(
        (item) => item.value === formik.values.accountSideCheque
      )[0];

      formik.setFieldValue("CheckNumber", current.CheckNumber);
      formik.setFieldValue("Price", current.Price);
      formik.setFieldValue("DateOverdeal", current.DateOverdeal);
      setDate2(new DateObject(current.DateOverdeal));
    }
  }, [formik.values.accountSideCheque]);
  console.log("formik.errors", formik.errors);
  console.log("formik.touched", formik.touched);
  console.log(formik.values);
  useEffect(() => {
    if (formik.values.accountSideList) {
      let current = accountSideList.filter(
        (item) => item.value === formik.values.accountSideList
      )[0];

      formik.setFieldValue("Remaining", current.Balance);
    }
  }, [formik.values.accountSideList]);
  const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
  const dateRef1 = useRef();
  const dateRef2 = useRef();
  const [date, setDate] = useState(new DateObject());
  const [date2, setDate2] = useState("");

  console.log("date2", date2);
  console.log("formik.values.DateOverdeal", formik.values.DateOverdeal);
  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/displayDetails`,
      "noopener,noreferrer"
    );
  };
  function getData(data) {
    formik.setFieldValue('match',data)
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
          <form onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="row ">
                <div
                  className="content col-lg-4 col-md-4 col-12"
                  onFocus={() => {
                    dateRef1?.current?.closeCalendar();
                  }}
                >
                  <div className="title">
                    <span>{t("پشت نمره")}</span>
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
                        placeholder=""
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
                <div className="content col-lg-4 col-md-4 col-12">
                  <div className="title">
                    <span>{t("تاریخ تراکنش")}</span>
                  </div>
                  <div className="wrapper date-picker position-relative">
                    <DatePicker
                      name={"transactionDate"}
                      id={"transactionDate"}
                      ref={dateRef1}
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
                  className="content col-lg-4 col-md-4 col-12"
                  onFocus={() => {
                    dateRef1?.current?.closeCalendar();
                  }}
                >
                  <div className="title">
                    <span>
                      {t("تحویل گیرنده")}
                      <span className="star">*</span>
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        type="text"
                        id="deliveryGuy"
                        name="deliveryGuy"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.deliveryGuy}
                      />
                      {formik.touched.deliveryGuy &&
                      formik.errors.deliveryGuy ? (
                        <div className="error-msg">
                          {t(formik.errors.deliveryGuy)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-12 col-12">
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
                          formik.setFieldValue("show", !formik.values.show);
                          formik.setFieldValue("accountSideList", "");
                          formik.setFieldValue("Detailed", "");
                          formik.setFieldValue("moeinAcount", "");
                          formik.setFieldValue("Remaining", "");
                        }}
                      >
                        <MoreHorizIcon />
                      </button>
                    </div>
                    <div className="col-xl-auto col-lg-10 col-auto flex-grow-1 mb-0">
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
                              formik.errors.accountSideList ? (
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
                            {formik.touched.moeinAcount &&
                            formik.errors.moeinAcount ? (
                              <div className="error-msg">
                                {t(formik.errors.moeinAcount)}
                              </div>
                            ) : null}
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
                              disabled={
                                !formik.values.moeinAcount ? true : false
                              }
                              itemRender={null}
                              placeholder=""
                              name="Detailed"
                              id="Detailed"
                              searchEnabled
                              showClearButton
                            ></SelectBox>
                            {formik.touched.Detailed &&
                            formik.errors.Detailed ? (
                              <div className="error-msg">
                                {t(formik.errors.Detailed)}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="title">
                    <span>{t("مانده")}</span>
                  </div>
                  <CurrencyInput
                    className="form-input"
                    id="Remaining"
                    name="Remaining"
                    decimalsLimit={2}
                    value={formik.values.Remaining}
                    disabled
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="content col-12">
                  <div className="title">
                    <span>{t("نوع چک")}</span>
                  </div>
                  <div className="wrapper">
                    <RadioGroup
                      name="pie-field"
                      //defaultChecked="accountSideCheque"
                      defaultValue={formik.values.chequePlan}
                      className={i18n.dir() === "rtl" ? "rtl-radio-group" : ""}
                      row
                      onChange={(val) => {
                        formik.setFieldValue(
                          "chequePlan",
                          val.target.defaultValue
                        );
                        formik.setFieldValue("chequeBook", "");
                        formik.setFieldValue("accountSideCheque", "");
                        formik.setFieldValue("CheckNumber", "");
                        formik.setFieldValue("Price", "");
                        formik.setFieldValue("DateOverdeal", "");
                        setDate2("");
                      }}
                    >
                      <FormControlLabel
                        value="chequeBook"
                        control={<Radio />}
                        label={t("دسته چک")}
                      />
                      <FormControlLabel
                        value="accountSideCheque"
                        control={<Radio />}
                        label={t("چک طرف حساب")}
                      />
                    </RadioGroup>
                  </div>
                </div>
                {formik.values.chequePlan === "accountSideCheque" && (
                  <>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>
                          {t("چک طرف حساب")} <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            ref={selectRef}
                            dataSource={accountSideCheque}
                            valueExpr="value"
                            className="selectBox"
                            placeholder=""
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
                              formik.setFieldValue(
                                "accountSideCheque",
                                e.value
                              );
                              setSelectVal(e);
                            }}
                            onClosed={(e) => {}}
                            onFocusOut={(e) => {}}
                            onOptionChanged={(e) => {
                              if (inputUi) {
                              }
                            }}
                          />
                          {console.log("dsdsdsdsdsds")}
                          {formik.touched.accountSideCheque &&
                          formik.errors.accountSideCheque ? (
                            <div className="error-msg">
                              {t(formik.errors.accountSideCheque)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {formik.values.chequePlan === "chequeBook" && (
                  <>
                    <div className="content col-lg-6 col-md-6 col-12">
                      <div className="title">
                        <span>
                          {t("دسته چک")} <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            value={formik.values.namess}
                            ref={selectRef}
                            className="selectBox"
                            dataSource={accountSideCheque}
                            valueExpr="value"
                            searchEnabled={true}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            placeholder=""
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
                              formik.setFieldValue(
                                "accountSideCheque",
                                e.value
                              );
                              setSelectVal(e);
                            }}
                            onClosed={(e) => {}}
                            onFocusOut={(e) => {}}
                            onOptionChanged={(e) => {
                              if (inputUi) {
                              }
                            }}
                          />
                          {formik.touched.accountSideCheque &&
                          formik.errors.accountSideCheque ? (
                            <div className="error-msg">
                              {t(formik.errors.accountSideCheque)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("شماره چک")}</span>
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
                      formik.errors.CheckNumber ? (
                        <div className="error-msg">
                          {t(formik.errors.CheckNumber)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  onFocus={() => {
                    dateRef2?.current?.closeCalendar();
                  }}
                  className="content col-lg-6 col-md-6 col-12"
                >
                  <div className="title">
                    <span>{t("مبلغ")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        id="Price"
                        name="Price"
                        decimalsLimit={2}
                        value={formik.values.Price}
                        disabled={
                          formik.values.chequePlan === "accountSideCheque"
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.Price && formik.errors.Price ? (
                        <div className="error-msg">
                          {t(formik.errors.Price)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {t("تاریخ سر‌رسید")}
                      <span className="star">*</span>
                    </span>
                  </div>
                  <div className="wrapper date-picker position-relative">
                    <DatePicker
                      name={"DateOverdeal"}
                      id={"DateOverdeal"}
                      ref={dateRef2}
                      value={date2}
                      editable={false}
                      disabled={
                        formik.values.chequePlan === "accountSideCheque"
                      }
                      calendar={renderCalendarSwitch(i18n.language)}
                      locale={renderCalendarLocaleSwitch(i18n.language)}
                      onBlur={formik.handleBlur}
                      onChange={(val) => {
                        formik.setFieldValue(
                          "DateOverdeal",
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
                  {formik.touched.DateOverdeal && formik.errors.DateOverdeal ? (
                    <div className="error-msg">
                      {t(formik.errors.DateOverdeal)}
                    </div>
                  ) : null}
                </div>

                <div
                  onFocus={() => {
                    dateRef2?.current?.closeCalendar();
                  }}
                  className="content col-lg-6 col-md-6 col-12"
                >
                  <div className="title">
                    <span>{t("شرح سند")}</span>
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
              </div>
            </div>
          </form>
        </div>
        {<div className={`Tatbiq ${formik.values.show&&debtor.length&&creditor.length?'':'d-none'}`}>
          <Kara debtor={debtor} creditor={creditor} showOtherBtn={true} getData={getData} show={formik.values.show} />
        </div>}
      </div>
      <div>
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
            <Button variant="contained" color="error" onClick={callComponent} style={{marginRight:"10px"}}>
              {t("انصراف")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChequeIssuance;
