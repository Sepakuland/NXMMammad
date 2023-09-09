import { Button, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import DatePicker from "react-multi-date-picker";
import * as Yup from "yup";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../../utils/calenderLang";
import { julianIntToDate } from "../../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRef } from "react";

export default function BatchModal({ getData, closeModal }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dateRef = useRef();

  const formik = useFormik({
    initialValues: {
      batchNumber: "",
      expireDate: "",
    },
    validationSchema: Yup.object({
      expireDate: Yup.date().required("وارد کردن تاریخ الزامی است"),
    }),
    onSubmit: (values) => {
      getData(values);
      closeModal();
    },
  });

  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          border: "none",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="form-design">
            <div className="row">
              <div
                className="content-col-12"
                onFocus={() => {
                  dateRef?.current?.closeCalendar();
                }}
              >
                <div className="title">
                  <span> {t("سری ساخت")} :</span>
                </div>
                <div className="wrapper">
                  <div>
                    <input
                      className="form-input"
                      name="batchNumber"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.batchNumber}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <div className="content-col-12">
                <div className="title">
                  <span> {t("تاریخ ساخت")} :</span>
                </div>
                <div className="wrapper">
                  <div className="date-picker position-relative">
                    <DatePicker
                      name="expireDate"
                      id="expireDate"
                      ref={dateRef}
                      editable={false}
                      calendar={renderCalendarSwitch(i18n.language)}
                      locale={renderCalendarLocaleSwitch(i18n.language)}
                      calendarPosition="bottom-right"
                      onBlur={formik.handleBlur}
                      onChange={(val) => {
                        formik.setFieldValue(
                          "expireDate",
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
                  {formik.touched.expireDate &&
                    formik.errors.expireDate &&
                    !formik.values.expireDate ? (
                    <div className="error-msg">
                      {t(formik.errors.expireDate)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-center">
        <Button
          variant="contained"
          color="success"
          style={{ margin: "0 2px" }}
          onClick={formik.handleSubmit}
        >
          {t("تایید")}
        </Button>
        <Button
          variant="contained"
          color="error"
          style={
            i18n.dir() === "rtl"
              ? { marginRight: "10px" }
              : { marginLeft: "10px" }
          }
          onClick={() => closeModal()}
        >
          {t("بازگشت")}
        </Button>
      </div>
    </>
  );
}
