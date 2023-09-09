import { Button, FormControlLabel, Paper, Radio, RadioGroup } from '@mui/material';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react'
import DatePicker from 'react-multi-date-picker';
import { useLocation } from 'react-router';
import { julianIntToDate } from '../../../../utils/dateConvert';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../utils/calenderLang';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { CreateQueryString } from '../../../../utils/createQueryString';

const LostBenefit = () => {
    const location = useLocation();
    const [showDocument, setShowDocument] = useState(false)
    const { t, i18n } = useTranslation();
    const dateRef = useRef()
    const dateRef2 = useRef()
    const formik = useFormik({
        initialValues: {

            DocumentDate: [null, null],
            CodingLevel: ""
        },
        validationSchema: Yup.object({
            CodingLevel: Yup.number().required("انتخاب سطح گزارش الزامی است"),
            DocumentDate: Yup.array()
                .test(
                    'DocumentDateIsNotNull', "وارد کردن تاریخ الزامی است",
                    (item, testContext) => {
                        return (testContext?.parent?.DocumentDate[0] != null || testContext.parent.DocumentDate[1] != null)
                    }
                )
                .test(
                    'DocumentDate[0]IsNotLess', "تاریخ پایان باید پیش از تاریخ شروع باشد",
                    (item, testContext) => {

                        return (item?.length > 0 && Date.parse(testContext.parent.DocumentDate[1]) - Date.parse(testContext.parent.DocumentDate[0]) >= 0)

                    }
                )
        }),
        onSubmit: (values) => {
            console.log("LostBenefitPrint", values)
            localStorage.setItem(`LostBenefitPrint`, JSON.stringify(formik?.values));
            if (values.CodingLevel == 2) {

                window.open(`#/Reports/Accounting/LostBenefitPrint?lang=${i18n.language}`, '_blank');
            }
            else{

                window.open(`#/Reports/Accounting/MoeinLostBenefitPrint?lang=${i18n.language}`, '_blank');
            }

        },
    });
    const tableError = () => {
        if (formik?.errors?.DocumentDate) {
            Swal.fire({
                icon: 'error',
                title: t("...خطا"),
                text: t(formik?.errors?.DocumentDate)

            })
        } else {
            Swal.fire({
                icon: 'error',
                title: t("...خطا"),
                text: t(formik?.errors?.CodingLevel)

            })
        }

    }
    /* -------------------------------------------------------------------------- */
    /*                         clear Button for clear data                        */
    /* -------------------------------------------------------------------------- */
    const handleClearDate = (x) => {
        if (formik.values.DocumentDate[0] && x === "startDate") {
            // Clear the selected date field
            formik.setFieldValue('DocumentDate[0]', null);
            formik.setFieldValue('DocumentDate[1]', null);
        }
        else {
            formik.setFieldValue('DocumentDate[1]', null);
        }
    };


    return (
        <>
            <div className="LoastBenefit" style={{ backgroundColor: "rgb(240 243 247)", border: "none", userSelect: "none" }}>
                <div className='col-lg-12 col-12 col-md-12 form-design' style={{ background: "#f0f3f7" }}>

                    <Paper
                        elevation={2} className="paper-pda"  >
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="content col-lg-4 col-md-6 col-12" onFocus={() => {
                                    dateRef2?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("از تاریخ")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            name={"startDate"}
                                            id={"startDate"}
                                            ref={dateRef}
                                            editable={false}
                                            clearIcon={true}
                                            value={formik.values.DocumentDate[0] !== null ? new Date(formik.values.DocumentDate[0]) : ""}
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                formik.setFieldValue(
                                                    `DocumentDate[0]`,
                                                    julianIntToDate(val.toJulianDay())
                                                );
                                                setShowDocument(false)
                                            }}
                                        />
                                        <div
                                            className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'>
                                                {formik.values.DocumentDate[0] ?
                                                    <button type="button" className='clearButton'
                                                        onClick={(e) => {
                                                            handleClearDate("startDate")
                                                        }}>
                                                        <CancelIcon />
                                                    </button> : " "
                                                }
                                                <CalendarMonthIcon className='calendarButton' /></div>
                                        </div>

                                    </div>
                                </div>
                                <div className="content col-lg-4 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تا")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            name={"endDate"}
                                            id={"endDate"}
                                            ref={dateRef2}
                                            editable={false}
                                            value={formik.values.DocumentDate[1] !== null ? new Date(formik.values.DocumentDate[1]) : ""}
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            disabled={!formik.values.DocumentDate[0]}
                                            minDate={new Date(formik.values.DocumentDate[0])}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                formik.setFieldValue(
                                                    "DocumentDate[1]",
                                                    julianIntToDate(val.toJulianDay())
                                                );
                                                setShowDocument(false)
                                            }}
                                        />
                                        <div
                                            className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'>
                                                {formik.values.DocumentDate[1] ?
                                                    <button type="button" className='clearButton'
                                                        onClick={() => {
                                                            handleClearDate("endDate")
                                                        }}>
                                                        <CancelIcon />
                                                    </button> : " "
                                                }
                                                <CalendarMonthIcon className='calendarButton' /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-4 col-md-6 col-12" onFocus={() => dateRef2?.current?.closeCalendar()}>
                                    <div className="title">

                                        <span>{t("در سطح")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <RadioGroup
                                                name="pie-field"
                                                defaultValue={formik.values.CodingLevel}
                                                row
                                                onChange={(val) => {
                                                    formik.setFieldValue("CodingLevel", val.target.defaultValue)
                                                }}
                                                className={i18n.dir() === 'rtl' ? 'rtl-radio-group' : ''}
                                            >
                                                <FormControlLabel
                                                    value="2"
                                                    control={<Radio />}
                                                    label={t("کل")}
                                                />
                                                <FormControlLabel
                                                    value="3"
                                                    control={<Radio />}
                                                    label={t("معین")}
                                                />
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center' style={{ margin: "10px 0px" }}>
                                <Button
                                    onClick={() => {
                                        if (formik?.errors?.DocumentDate || formik?.errors?.CodingLevel) {
                                            tableError()
                                        }
                                        formik.handleSubmit()
                                    }}
                                    disabled={!formik.values.DocumentDate}
                                    variant='contained'
                                    className='show_btn'
                                    color='primary'
                                >{t("نمایش اسناد")}</Button>
                            </div>

                        </form>
                    </Paper>
                </div>

            </div>
        </>
    )
}
export default LostBenefit;