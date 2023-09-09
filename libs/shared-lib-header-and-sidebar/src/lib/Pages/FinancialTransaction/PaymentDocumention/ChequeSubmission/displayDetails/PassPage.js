import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import { history } from "../../../../../utils/history";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../../../utils/calenderLang";
import { renderCalendarSwitch } from "../../../../../utils/calenderLang";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
const Factor = [];

export const ChequeCancelation = () => {
  const { t, i18n } = useTranslation();
  const [alignment, setAlignment] = React.useState("");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const theme = useTheme();
  const [factor, setFactor] = React.useState(Factor);
  const dateRef1 = useRef();
  const [date, setDate] = useState(new DateObject());
  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 1000),
      transactionDate: julianIntToDate((new DateObject()).toJulianDay()),
    },
    validationSchema: Yup.object({
      transactionDate: Yup.date()
          .required("وارد کردن تاریخ الزامی است")
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

  console.log('error',formik.errors)
  console.log('values',formik.values)

  const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/displayDetails`,
      "noopener,noreferrer"
    );
  };
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
              <div className="row justify-content-center">
                <div className="content col-lg-8 col-md-4 col-12">
                  <div className="title">
                    <span>{t("تاریخ پاس")}<span className="star">*</span></span>
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
                    <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                      <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton' /></div>
                    </div>
                  </div>
                  {formik.touched.startDate && formik.errors.startDate ? (
                    <div className="error-msg">
                      {t(formik.errors.startDate)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="button-pos">
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={formik.handleSubmit}
              >
                {t("تایید")}
              </Button>

              <div className="Issuance">
                <Button
                  style={{ marginRight: "10px" }}
                  variant="contained"
                  color="error"
                  onClick={callComponent}
                >
                  {t("انصراف")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChequeCancelation;
