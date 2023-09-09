import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import * as Yup from "yup";
import { useTheme } from '@emotion/react';
import DatePicker from 'react-multi-date-picker';
import CurrencyInput from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import swal from 'sweetalert';
import service2 from '../Cash/CashDeskData';
import { parsFloatFunction } from '../../../../utils/parsFloatFunction';
import service from '../../Wasted-Cheque/chequeNumber';
import { julianIntToDate } from "../../../../components/DatePicker/dateConvert";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SelectBox } from 'devextreme-react';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import fund from "../../PaymentDocumention/RemittancePayable/Issuance/fundList";
import account from "../../PaymentDocumention/RemittancePayable/Issuance/accountSideList";
import { history } from '../../../../utils/history';
import DateObject from "react-date-object";
import bank from '../Cheque/BankNames'
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../utils/calenderLang';
import { Button } from '@mui/material';
import Kara from '../../../../components/SetGrid/Kara';
import { karadummyRight } from '../../../../components/SetGrid/karadummyRight';
import { karadummyLeft } from '../../../../components/SetGrid/karadummyLeft.js';

const Issuance = () => {
  const Factor = [];

  const [factor, setFactor] = useState(Factor);
  const { t, i18n } = useTranslation();
  const [alignment, setAlignment] = useState("");
  const theme = useTheme();
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const [date, setDate] = useState(new DateObject());

  const [debtor, setDebtor] = useState([]);
  const [creditor, setCreditor] = useState([]);

  const dateRef1 = useRef()
  const dateRef2 = useRef()

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      TransactionCode: Math.floor(Math.random() * 1000),
      TransactionDate: julianIntToDate(new DateObject().toJulianDay()),
      BankName: "",
      ChequeNumber: "",
      Cashier: "",
      collector: "",
      Amount: "",
      accountSideList: "",
      Detailed: "",
      moeinAcount: "",
      Remaining: 0,
      Description: "",


      match: [],
      show: true,
    },
    show: Yup.boolean(),
    validationSchema: Yup.object({

      Amount: Yup.number().typeError("تنها عدد مجاز است").required("انتخاب مبلغ الزامیست"),
      TransactionDate: Yup.date().required("وارد کردن تاریخ الزامی است"),
      accountSideList: Yup.string().when("show", (show) => {
        if (show)
          return Yup.string().required(() => {
            return "نام طرف حساب الزامیست";
          })
      }),
      BankName: Yup.string()
      .required("انتخاب نام بانک الزامیست"),
      ChequeNumber: Yup.number().typeError("تنها عدد مجاز است").required("انتخاب شماره حواله الزامیست"),


    }),
    onSubmit: (values) => {
      console.log("here", values)
      factorSub()
    },
  });
  const factorSub = () => {
    swal({
      title: t("فاکتور با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  useEffect(() => {
    if (formik.values.show) {
      setDebtor(karadummyRight)
      setCreditor(karadummyLeft)
    } else {
      setDebtor([])
      setCreditor([])
    }
  }, [formik.values.show])

  const [cashDeskData, setCashDeskData] = useState(service2.getCashDeskData())
  const [accountSideList, setAccountSideList] = useState(account.getAccountSideList());
  const [accountPartyData, setAccountPartyData] = useState(service.getChequeNumber())
  const [BankData, setBankData] = useState(bank.getBankNames());

  const selectRef = useRef();
  const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];

  const [fundList, setFundList] = useState(fund.getFundList());


  function HandleSalePriceChange(value) {
    let temp = value.replaceAll(',', '')
    formik.setFieldValue('Amount', parsFloatFunction(temp, 2))
  }
  useEffect(() => {
    if (formik.values.accountSideList) {
      let current = accountSideList.filter(
        (item) => item.value === formik.values.accountSideList
      )[0];

      formik.setFieldValue("Remaining", current.Balance);
    }
  }, [formik.values.accountSideList]);


  const callComponent = () => {
    history.navigate(`/FinancialTransaction/receiptDocument/remittanceReceivable/DisplayDetails`);
  }
  function getData(data) {

    formik.setFieldValue('match', data)
  }
  return (
    <>
      <div className='form-template'
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="row">
                <div className="content col-lg-4 col-md-4 col-12" onFocus={() => dateRef1?.current?.closeCalendar()}>
                  <div className="title">
                    <span>{t("کد تراکنش")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        type="text"
                        id="TransactionCode"
                        name="TransactionCode"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.TransactionCode}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="content col-lg-4 col-md-4 col-12">
                  <div className="title">
                    <span>{t("تاریخ تراکنش")}<span className="star">*</span></span>
                  </div>
                  <div className="wrapper date-picker position-relative">
                    <DatePicker
                      ref={dateRef1}
                      name={"TransactionDate"}
                      id={"TransactionDate"}
                      calendarPosition="bottom-right"
                      calendar={renderCalendarSwitch(i18n.language)}
                      locale={renderCalendarLocaleSwitch(i18n.language)}
                      onBlur={formik.handleBlur}
                      onChange={(val) => {
                        formik.setFieldValue(
                          "TransactionDate",
                          julianIntToDate(val.toJulianDay())
                        );
                      }}
                      value={date}
                    />
                    <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                      <div className='d-flex align-items-center justify-content-center'>
                        <CalendarMonthIcon className='calendarButton' />
                      </div>
                    </div>
                    {formik.touched.TransactionDate && formik.errors.TransactionDate &&
                      !formik.values.TransactionDate ? (
                      <div className='error-msg'>
                        {t(formik.errors.TransactionDate)}
                      </div>
                    ) : null}
                  </div>

                </div>
                <div className="content col-lg-4 col-md-4 col-12">
                  <div className="title">
                    <span>{t("نام بانک")}<span className="star">*</span></span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={BankData}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        valueExpr="name"
                        className='selectBox'
                        searchEnabled={true}
                        showClearButton
                        placeholder=''
                        noDataText={t("اطلاعات یافت نشد")}
                        displayExpr={function (item) {
                          return item && item.Id + '-' + item.name;
                        }}
                        displayValue='name'
                        onValueChanged={(e) => {
                          console.log('BankName', e.value)
                          formik.setFieldValue('BankName', e.value)
                        }}
                      />
                      {formik.touched.BankName && formik.errors.BankName ? (
                        <div className='error-msg'>
                          {t(formik.errors.BankName)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("شماره حواله")}<span className="star">*</span></span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        type="text"
                        id="ChequeNumber"
                        name="ChequeNumber"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ChequeNumber}
                      />
                      {formik.touched.ChequeNumber && formik.errors.ChequeNumber ? (
                        <div className='error-msg'>
                          {t(formik.errors.ChequeNumber)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("صندوقدار")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={accountPartyData}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        valueExpr="PartnerName"
                        className='selectBox'
                        searchEnabled={true}
                        showClearButton
                        placeholder=''
                        noDataText={t("اطلاعات یافت نشد")}
                        displayExpr={function (item) {
                          return item && item.PartnerName;
                        }}
                        displayValue='PartnerName'
                        onValueChanged={(e) => {
                          formik.setFieldValue('Cashier', e.value)

                        }}
                      />
                      {formik.touched.Cashier && formik.errors.Cashier ? (
                        <div className='error-msg'>
                          {t(formik.errors.Cashier)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("تحصیلدار")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={accountPartyData}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        valueExpr="PartnerName"
                        className='selectBox'
                        searchEnabled={true}
                        showClearButton
                        placeholder=''
                        noDataText={t("اطلاعات یافت نشد")}
                        displayExpr={function (item) {
                          return item && item.PartnerName;
                        }}
                        displayValue='PartnerName'
                        onValueChanged={(e) => {
                          formik.setFieldValue('collector', e.value)

                        }}
                      />
                      {formik.touched.collector && formik.errors.collector ? (
                        <div className='error-msg'>
                          {t(formik.errors.collector)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("مبلغ")}<span className="star">*</span></span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className='form-input'
                        id="Amount"
                        name="Amount"
                        decimalsLimit={2}
                        onChange={(e) => HandleSalePriceChange(e.target.value)}

                      />
                      {formik.touched.Amount && formik.errors.Amount ? (
                        <div className='error-msg'>
                          {t(formik.errors.Amount)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-12 col-12" >
                  <div className="row d-flex">
                    <div className="col-xl-auto col-lg-2 col-auto  ">
                      <div className="title">
                        <span>
                          ‌
                        </span>
                      </div>
                      <button
                        className="payToButton"
                        title={t("پرداخت به")}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue('Remaining', '')
                          formik.setFieldValue('moeinAcount', '')
                          formik.setFieldValue('Detailed', '')
                          formik.setFieldValue('accountSideList', '')
                          formik.setFieldValue('show', !formik.values.show)
                        }}
                      >
                        <MoreHorizIcon />
                      </button>
                    </div>
                    <div className="col-xl-auto col-lg-10 col-auto flex-grow-1 mb-0">
                      {formik.values.show ? (
                        <div className='row'>
                          <div className='col-12'>
                            <div className="title">
                              <span>
                                {t("طرف حساب")}
                                <span className="star">*</span>
                              </span>
                            </div>
                            <div className='wrapper'>
                              <SelectBox
                                ref={selectRef}
                                dataSource={fundList}
                                valueExpr="value"
                                className='selectBox'
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
                                  formik.setFieldValue("accountSideList", e.value)
                                }
                                itemRender={null}
                                placeholder=""
                                searchEnabled
                              ></SelectBox>
                              {formik.touched.accountSideList && formik.errors.accountSideList &&
                                !formik.values.accountSideList ? (
                                <div className='error-msg'>
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
                              itemRender={null}
                              placeholder=""
                              name="Detailed"
                              id="Detailed"
                              searchEnabled
                              showClearButton
                            ></SelectBox>
                            {formik.touched.moeinAcount &&
                              formik.errors.moeinAcount ? (
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
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("مانده")}</span>
                  </div>
                  <CurrencyInput
                    className='form-input'
                    id="Remaining"
                    name="Remaining"
                    decimalsLimit={2}
                    value={formik.values.Remaining}
                    disabled
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>{t("شرح سند")}</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <textarea
                        rows="8"
                        className="form-input"
                        id="Description"
                        name="Description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.Description}
                      />
                      {formik.touched.Description && formik.errors.Description ? (
                        <div className='error-msg'>
                          {t(formik.errors.Description)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {<div className={`Tatbiq ${formik.values.show && debtor.length && creditor.length ? '' : 'd-none'}`}>
          <Kara debtor={debtor} creditor={creditor} showOtherBtn={true} getData={getData} show={formik.values.show} />
        </div>}
        <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`}>
          <Button variant="contained" color="success"
            type="submit"
            onClick={formik.handleSubmit}

          >
            {t("ثبت تغییرات")}
          </Button>

          <div className="Issuance">
            <Button variant="contained"
              style={{ marginRight: "5px" }}
              color='error'
              onClick={callComponent}>
              {t("انصراف")}
            </Button >
          </div>
        </div>
      </div>
    </>
  )
}

export default Issuance
