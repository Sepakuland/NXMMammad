import { useFormik } from 'formik';
import { React, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-multi-date-picker';
import * as Yup from "yup";
import { useTheme } from '@emotion/react';
import swal from 'sweetalert';
import { julianIntToDate } from "../../../components/DatePicker/dateConvert";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState } from 'react';
import DateObject from "react-date-object";
import { history } from '../../../utils/history';
import { Button, TextField } from '@mui/material';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../utils/calenderLang';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SelectBox } from 'devextreme-react';
import service from './WareHouseNameData'
const Factor = [];
const AddWareHouseEra = () => {
    const [factor, setFactor] = useState(Factor);
    const { t, i18n } = useTranslation();
    const [alignment, setAlignment] = useState("");
    const theme = useTheme();
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    const [date, setDate] = useState(new DateObject());
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            WareHouseCode: Math.floor(Math.random() * 1000),
            WareHouseTitle: "",
            RecordDate: julianIntToDate(new DateObject().toJulianDay()),
            WareHouseName: "",
            WareHouser: "",
            Description: "",
            time: new Date()
        },

        validationSchema: Yup.object({
            RecordDate: Yup.date().required("تاریخ ثبت الزامی است"),
            WareHouseTitle: Yup.string().required("عنوان الزامی است"),
            WareHouser: Yup.string().required("انتخاب انباردار الزامی است")

        }),
        onSubmit: (values) => {
            console.log("values", values)
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
    const dateRef = useRef();

    const callComponent = () => {
        history.navigate(`WareHouse/WareHousingEra`);
    }
    const [WareHouseNameData, setWareHouseNameData] = useState(service.getWareHouseNameData())
    const [WareHouserData, setWareHouserData] = useState(service.getWarehouserData())

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
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("کد")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                rows="8"
                                                className="form-input"
                                                id="WareHouseCode"
                                                name="WareHouseCode"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.WareHouseCode}
                                                disabled
                                            />
                                            {formik.touched.WareHouseCode && formik.errors.WareHouseCode ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.WareHouseCode)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("عنوان")}<span className='star'>*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                rows="8"
                                                className="form-input"
                                                id="WareHouseTitle"
                                                name="WareHouseTitle"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.WareHouseTitle}
                                            />
                                            {formik.touched.WareHouseTitle && formik.errors.WareHouseTitle ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.WareHouseTitle)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12 ">
                                    <div className='row'>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">
                                                <span>{t("تاریخ ثبت")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper date-picker position-relative">
                                                <DatePicker
                                                    ref={dateRef}
                                                    name={"RecordDate"}
                                                    id={"RecordDate"}
                                                    calendarPosition="bottom-right"
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(val) => {
                                                        formik.setFieldValue("RecordDate", julianIntToDate(val.toJulianDay()));
                                                    }}
                                                    value={date}
                                                />
                                                <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                    <div className='d-flex align-items-center justify-content-center'>
                                                        <CalendarMonthIcon className='calendarButton' />
                                                    </div>
                                                </div>
                                                {formik.touched.RecordDate && formik.errors.RecordDate &&
                                                    !formik.values.RecordDate ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.RecordDate)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-12">
                                            <div className="title">
                                                <span>‌</span>
                                            </div>
                                            <div className="wrapper" style={{ position: 'relative' }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        ampm={false}
                                                        className='time-picker'
                                                        views={['hours', 'minutes']}
                                                        inputFormat="HH:mm"
                                                        mask="__:__"
                                                        value={formik.values.time}
                                                        onChange={(newValue) => {
                                                            formik.setFieldValue("time", newValue)
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("انبار")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <SelectBox
                                                dataSource={WareHouseNameData}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                valueExpr="id"
                                                className='selectBox'
                                                searchEnabled={true}
                                                placeholder=''
                                                showClearButton
                                                noDataText={t("اطلاعات یافت نشد")}
                                                displayExpr={function (item) {
                                                    return item && item.Code + '- ' + item.Name;
                                                }}
                                                displayValue='Name'
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('WareHouseName', e.value)
                                                    console.log("e", e)
                                                }}
                                            />

                                            {formik.touched.WareHouseName && formik.errors.WareHouseName &&
                                                !formik.values.CashDesk ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.WareHouseName)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12" >
                                    <div className="title">
                                        <span>{t("انباردار")}<span className='star'>*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <SelectBox
                                                dataSource={WareHouserData}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                valueExpr="Id"
                                                className='selectBox'
                                                searchEnabled={true}
                                                placeholder=''
                                                showClearButton
                                                noDataText={t("اطلاعات یافت نشد")}
                                                displayExpr={function (item) {
                                                    return item && item.Code + '- ' + item.Name;
                                                }}
                                                displayValue='Name'
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('WareHouser', e.value)
                                                }}
                                            />

                                            {formik.touched.WareHouser && formik.errors.WareHouser &&
                                                !formik.values.WareHouser ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.WareHouser)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
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
            </div>

            <div>
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

export default AddWareHouseEra
