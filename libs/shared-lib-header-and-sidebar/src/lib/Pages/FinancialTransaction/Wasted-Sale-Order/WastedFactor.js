import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import service from '../../FinancialTransaction/Wasted-Sale-Order/invoiceNumber';
import { parsFloatFunction } from '../../../utils/parsFloatFunction'
import CurrencyInput from 'react-currency-input-field';
import { history } from "../../../utils/history";

const Factor = [];

export const WastedFactor = () => {
  const { t, i18n } = useTranslation();
  const [alignment, setAlignment] = React.useState("");

  const theme = useTheme();
  const [factor, setFactor] = React.useState(Factor);
  const [invoiceNumbers, setInvoiceNumber] = React.useState(service.getInvoiceNumber())
  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 1000),
      invoiceSelection: "",
      invoiceNumber: "",
      accountParty: "",
      invoiceAmount: "",
      settledAmount: "",
      wastedAmount: "",
      reason: "",
    },

    validationSchema: Yup.object({
      invoiceSelection: Yup.string()
        .required(() => {
          return ("انتخاب فاکتور الزامیست")
        }),
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
    if (formik.values.invoiceSelection) {
      let current = invoiceNumbers.filter(item => item.value === formik.values.invoiceSelection)[0]

      formik.setFieldValue('invoiceNumber', current.value)
      formik.setFieldValue('invoiceAmount', current.FinalPrice)
      formik.setFieldValue('accountParty', current.PartnerName)
      formik.setFieldValue('settledAmount', current.SettledPrice)
      formik.setFieldValue('wastedAmount', current.WastedPrice)

    }

  }, [formik.values.invoiceSelection])


  function HandleSalePriceChange1(value) {
    let temp = value.replaceAll(',', '')
    formik.setFieldValue('invoiceAmount', parsFloatFunction(temp, 2))
  }

  const callComponent = () => {
    history.navigate(
      `FinancialTransaction/wastedSaleOrder/DisplayDetails`,
      "noopener,noreferrer"
    );
  };

  return (
    <>

      <div className='form-template'
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        {/*<h1 className='main-title' >*/}
        {/*  {t("فاکتور سوختی")}*/}
        {/*</h1>*/}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-design">
            <div className="row ">
              <div className="col-lg-12 col-12">
                <div className="row">

                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>{t("انتخاب فاکتور")} <span className="star">*</span></span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <SelectBox
                          dataSource={invoiceNumbers}
                          rtlEnabled={i18n.dir() == "ltr" ? false : true}
                          valueExpr="value"
                          className='selectBox'
                          searchEnabled={true}
                          placeholder=''
                          noDataText={t("اطلاعات یافت نشد")}
                          displayExpr={function (item) {
                            return item && item.value + '- ' + item.PartnerName;
                          }}
                          displayValue='value'
                          onValueChanged={(e) => {
                            formik.setFieldValue('invoiceSelection', e.value)
                          }}
                        />
                        {formik.touched.invoiceSelection && formik.errors.invoiceSelection &&
                          !formik.values.invoiceSelection ? (
                          <div className='error-msg'>
                            {t(formik.errors.invoiceSelection)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">

                      <span>{t("شماره فاکتور")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="invoiceNumber"
                          name="invoiceNumber"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.invoiceNumber}
                          disabled
                        />
                        {formik.touched.invoiceNumber && formik.errors.invoiceNumber ? (
                          <div className='error-msg'>
                            {t(formik.errors.invoiceNumber)}
                          </div>
                        ) : null}
                      </div>

                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">

                      <span>{t("طرف حساب")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="accountParty"
                          name="accountParty"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.accountParty}
                          disabled
                        />
                        {formik.touched.accountParty && formik.errors.accountParty ? (
                          <div className='error-msg'>
                            {t(formik.errors.accountParty)}
                          </div>
                        ) : null}
                      </div>

                    </div>
                  </div>

                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">

                      <span>{t("مبلغ فاکتور")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className='form-input'
                          id="invoiceAmount"
                          name="invoiceAmount"
                          decimalsLimit={2}
                          value={formik.values.invoiceAmount}
                          disabled
                          onChange={(e) => HandleSalePriceChange1(e.target.value)}
                        />
                      </div>

                    </div>
                  </div>

                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">

                      <span>{t("مبلغ تسویه شده")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className='form-input'
                          id="settledAmount"
                          name="settledAmount"
                          decimalsLimit={2}
                          value={formik.values.settledAmount}
                          disabled
                          onChange={(e) => HandleSalePriceChange1(e.target.value)}
                        />
                        {formik.touched.settledAmount && formik.errors.settledAmount ? (
                          <div className='error-msg'>
                            {t(formik.errors.settledAmount)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">

                      <span>{t("مبلغ سوختی")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <CurrencyInput
                          className='form-input'
                          id="wastedAmount"
                          name="wastedAmount"
                          decimalsLimit={2}
                          value={formik.values.wastedAmount}
                          disabled
                          onChange={(e) => HandleSalePriceChange1(e.target.value)}
                        />
                        {formik.touched.wastedAmount && formik.errors.wastedAmount ? (
                          <div className='error-msg'>
                            {t(formik.errors.wastedAmount)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="content col-lg-6 col-md-6 col-12">
                    <div className="title">
                      <span>{t("دلیل")}</span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <textarea
                          rows="8"
                          className="form-input"
                          id="reason"
                          name="reason"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.reason}
                        />
                        {formik.touched.reason && formik.errors.reason ? (
                          <div className='error-msg'>
                            {t(formik.errors.reason)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
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
          <Button variant="contained" color="error" onClick={callComponent}>
            {t("انصراف")}
          </Button>
        </div>
      </div>
    </>

  );
};

export default WastedFactor;