import { Button, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import {
  renderCalendarLocaleSwitch,
  renderCalendarSwitch,
} from "../../../../../utils/calenderLang";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DocumentControl = ({ getValues,onClose }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [openRemove, setOpenRemove] = useState(false)
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const navigate = useNavigate();
  ///////Form starts here
  const startDateRef = useRef();
  const endDateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  const [date2, setDate2] = useState(new DateObject());
  const documentCodeRegMatch = /^[+]?\d*$/;
  const formik = useFormik({
    initialValues: {
      DocumentDate: [
        julianIntToDate(new DateObject().toJulianDay()),
        julianIntToDate(new DateObject().toJulianDay()),
      ],
     DocumentNumber:[]
    },
    onSubmit: (values) => {
      console.log("here", values);
      getValues(values);
      onClose();
    },
  });
  const handleCancel = () => {
    onClose(); 
  };
  return (
        <>
          <div
            style={{
              backgroundColor: `${theme.palette.background.paper}`,
              border: "none",
            }}
          >
            <div>
              <form onSubmit={formik.handleSubmit}>
                <div className="form-design p-0">
                  <div className="row">
                    <div
                      className="content col-lg-6 col-md-6 col-12"
                      onFocus={() => {
                        endDateRef?.current?.closeCalendar();
                      }}
                    >
                      <div className="title">
                        <span> {t("تاریخ از")} :</span>
                      </div>
                      <div className="wrapper">
                        <div className="date-picker position-relative">
                          <DatePicker
                            name="startDate"
                            id="startDate"
                            ref={startDateRef}
                            value={
                              formik?.values?.DocumentDate[0]
                                ? new DateObject(
                                    formik?.values?.DocumentDate[0]
                                  )
                                : ""
                            }
                            calendar={renderCalendarSwitch(i18n.language)}
                            locale={renderCalendarLocaleSwitch(i18n.language)}
                            calendarPosition="bottom-right"
                            onBlur={formik.handleBlur}
                            onChange={(val) => {
                              setDate(val);
                              formik.setFieldValue(
                                `DocumentDate[0]`,
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
                        {formik?.touched?.DocumentDate &&
                        formik?.touched?.DocumentDate[0] &&
                        formik?.errors?.DocumentDate &&
                        formik?.errors?.DocumentDate[0] ? (
                          <div className="error-msg">
                            {t(formik?.errors?.DocumentDate[0])}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className="content col-lg-6 col-md-6 col-12"
                      onFocus={() => {
                        startDateRef?.current?.closeCalendar();
                      }}
                    >
                      <div className="title">
                        <span> {t("تا")} :</span>
                      </div>
                      <div className="wrapper">
                        <div className="date-picker position-relative">
                          <DatePicker
                            name="dateEnd"
                            id="dateEnd"
                            value={
                              formik.values.DocumentDate[1]
                                ? new DateObject(formik.values.DocumentDate[1])
                                : ""
                            }
                            ref={endDateRef}
                            calendar={renderCalendarSwitch(i18n.language)}
                            disabled={!formik.values.DocumentDate[0]}
                            minDate={new Date(formik.values.DocumentDate[0])}
                            locale={renderCalendarLocaleSwitch(i18n.language)}
                            calendarPosition="bottom-right"
                            onBlur={formik.handleBlur}
                            onChange={(val) => {
                              setDate2(val);
                              formik.setFieldValue(
                                "DocumentDate[1]",
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
                        {/* {formik?.touched?.DocumentDate[1] && formik?.errors?.DocumentDate[1] ? (<div className='error-msg'>{t(formik?.errors?.DocumentDate[1])}</div>) : null} */}
                      </div>
                    </div>
                    <div
                      className="content col-lg-6 col-md-6 col-12"
                      // onFocus={() => {
                      //     endDateRef?.current?.closeCalendar();
                      // }}
                    >
                      <div className="title">
                        <span> {t("شماره سند از")} :</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            name="DocumentNumber[0]"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.DocumentNumber[0]}
                            autoComplete="off"
                          />
                          {formik.touched.DocumentNumber && formik.errors.DocumentNumber && formik.errors.DocumentNumber[0] ? (
                         <div className="error-msg">
                           {t(formik.errors.DocumentNumber[0])}
                         </div>
                       ) : null}
                        </div>
                      </div>
                    </div>
                    <div
                      className="content col-lg-6 col-md-6 col-12"
                      onFocus={() => {
                        endDateRef?.current?.closeCalendar();
                      }}
                    >
                      <div className="title">
                        <span> {t("تا")} :</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            name="DocumentNumber[1]"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.DocumentNumber[1]}
                            autoComplete="off"
                          />
                              {formik.touched.DocumentNumber && formik.errors.DocumentNumber && formik.errors.DocumentNumber[1] ? (
                             <div className="error-msg">
                               {t(formik.errors.DocumentNumber[1])}
                             </div>
                           ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "0 2px" }}
              onClick={formik.handleSubmit}
            >
              {t("تایید")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={
                i18n.dir() === "rtl"
                  ? { marginRight: "10px" }
                  : { marginLeft: "10px" }
              }
              onClick={handleCancel}
            >
              {t("بازگشت")}
            </Button>
          </div>
    </>
  );
};

export default DocumentControl;
