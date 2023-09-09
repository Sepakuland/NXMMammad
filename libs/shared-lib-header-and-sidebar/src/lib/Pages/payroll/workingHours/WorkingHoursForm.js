import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Button, useTheme, } from "@mui/material";
import swal from "sweetalert";
import { SelectBox } from "devextreme-react";
import { PersonnelData, RulesList, MonthlyHours } from "./formData";
import { getLangDate } from "../../../utils/getLangDate";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../utils/gridKeyboardNav3";
import moment from 'moment';
import Input from "react-input-mask";
import Checkbox from '@mui/material/Checkbox';

const monthList = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
]

const ClosedDays = [
    'جمعه',
]


export default function WorkingHoursForm() {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [click, setClick] = useState(false)

    let year = useMemo(() => {
        let date = getLangDate(i18n.language, new Date())
        return date.split('/')
    }, [i18n.language])

    const [itemsFocusedRow, setItemsFocusedRow] = useState(1)



    const formik = useFormik({
        initialValues: {
            Personnel: '',
            Rule: '',
            Month: monthList[0],
            Year: year[0],
            WorkStart: '',
            WorkEnd: '',
            TotalLeave: 0,
            Days: []


        },
        validationSchema: Yup.object({
            Personnel: Yup.string().required("پرسنل الزامی است"),
            Rule: Yup.string().required("حکم الزامی است"),
            // storeKeeper: Yup.string().required("وارد کردن انباردار الزامی است"),
            // deliverer: Yup.string().required("تحویل‌دهنده به درستی وارد نشده است"),
            // arrivedItems: Yup.array(
            //     Yup.object({
            //         goods: Yup.string().required("انتخاب کالا الزامی است"),
            //         buildSeries: Yup.string().required("انتخاب سری ساخت الزامی است"),
            //         unit: Yup.string().required("انتخاب واحد الزامی است"),
            //         number: Yup.number().positive("وارد کردن تعداد الزامی است")
            //     })
            // )
        }),
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = values;

            DocumentSub();
            console.log("All Values:", allValues);
        },
    });

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
    const emptyError = () => {
        swal({
            title: t("حداقل باید یک قلم را به ثبت برسانید."),
            icon: "error",
            button: t("باشه")
        });
    }

    // useEffect(() => {
    //     if (click) {
    //         tableError()
    //         setClick(false)
    //     }
    // }, [formik.errors.arrivedItems])


    useEffect(() => {
        if (!!formik.values.Personnel && !!formik.values.Rule) {
            let temp = MonthlyHours.map((day) => {
                let startTime = moment(`${('0' + day.DayStartTime).slice(-2)}:00:`, "HH:mm")
                let endTime = moment(`${('0' + day.DayEndTime).slice(-2)}:00:`, "HH:mm")
                let duration = moment.duration(endTime.diff(startTime));
                let hours = parseInt(duration.asHours());
                let minutes = parseInt(duration.asMinutes()) - hours * 60;

                let startTime1 = moment(`${('0' + day.StartTime).slice(-2)}:00:`, "HH:mm")
                let endTime1 = moment(`${('0' + day.EndTime).slice(-2)}:00:`, "HH:mm")
                let duration1 = moment.duration(endTime1.diff(startTime1));
                let hours1 = parseInt(duration1.asHours());
                let minutes1 = parseInt(duration1.asMinutes()) - hours1 * 60;

                let startTime2 = moment(`${('0' + day.StartTime2).slice(-2)}:00:`, "HH:mm")
                let endTime2 = moment(`${('0' + day.EndTime2).slice(-2)}:00:`, "HH:mm")
                let duration2 = moment.duration(endTime2.diff(startTime2));
                let hours2 = parseInt(duration2.asHours());
                let minutes2 = parseInt(duration2.asMinutes()) - hours2 * 60;

                let startTime3 = moment(`${('0' + day.StartTime3).slice(-2)}:00:`, "HH:mm")
                let endTime3 = moment(`${('0' + day.EndTime3).slice(-2)}:00:`, "HH:mm")
                let duration3 = moment.duration(endTime3.diff(startTime3));
                let hours3 = parseInt(duration3.asHours());
                let minutes3 = parseInt(duration3.asMinutes()) - hours3 * 60;

                let d = moment.duration(`${hours1}:${minutes1}`).add(moment.duration(`${hours2}:${minutes2}`)).add(moment.duration(`${hours3}:${minutes3}`))
                let hoursD = parseInt(d.asHours());
                let minutesD = parseInt(d.asMinutes()) - hoursD * 60;
                let presence = `${('0' + hoursD).slice(-2)}:${('0' + minutesD).slice(-2)}`

                let bound = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`

                let totalLeave = 0
                if (day.DailyLeave) {
                    totalLeave = bound
                } else {
                    let startL = moment(`${('0' + day.HourlyLeaveStartTime).slice(-2)}:00`, "HH:mm")
                    let endL = moment(`${('0' + day.HourlyLeaveEndTime).slice(-2)}:00`, "HH:mm")
                    let durationL = moment.duration(endL.diff(startL));
                    let hoursL = parseInt(durationL.asHours());
                    let minutesL = parseInt(durationL.asMinutes()) - hoursL * 60;

                    totalLeave = `${hoursL}:${minutesL}`
                }

                let overtime = '00:00'
                let workDeduction = '00:00'
                let holidayOvertime = '00:00'

                if (!day.MissionDay && !day.DailyLeave && !day.SickLeave) {
                    let presenceTime = moment(presence, "HH:mm")
                    let boundTime = moment(bound, "HH:mm")
                    let durationTime = moment.duration(presenceTime.diff(boundTime));
                    let hoursTime = parseInt(durationTime.asHours());
                    let minutesTime = parseInt(durationTime.asMinutes()) - hoursTime * 60;

                    if (hoursTime < 0 || minutesTime < 0) {
                        workDeduction = `${(('0' + Math.abs(hoursTime)).slice(-2))}:${(('0' + Math.abs(minutesTime)).slice(-2))}`
                    } else {
                        overtime = `${('0' + hoursTime).slice(-2)}:${('0' + minutesTime).slice(-2)}`
                    }
                }
                if (day.DayStartTime === 0 && day.DayEndTime === 0) {
                    holidayOvertime = presence
                }

                let delay = '00:00'
                let rush = '00:00'

                let delayStart = moment(`${('0' + day.DayStartTime).slice(-2)}:00`, "HH:mm")
                let delayEnd = moment(`${('0' + day.DayEndTime).slice(-2)}:00`, "HH:mm")
                let durationDelay = moment.duration(delayEnd.diff(delayStart));
                let hoursDelay = parseInt(durationDelay.asHours());
                let minutesDelay = parseInt(durationDelay.asMinutes()) - hoursDelay * 60;


                if ((hoursDelay > 0 || minutesDelay > 0) && day.StartTime !== 0 && day.DayStartTime !== 0) {
                    delay = `${(('0' + Math.abs(hoursDelay)).slice(-2))}:${(('0' + Math.abs(minutesDelay)).slice(-2))}`
                }


                let exit = moment(`${('0' + `${day.EndTime3 !== 0 ? day.EndTime3 : day.EndTime2 !== 0 ? day.EndTime2 : day.EndTime}`).slice(-2)}:00`, "HH:mm")

                let endDay = moment(`${('0' + day.DayEndTime).slice(-2)}:00`, "HH:mm")
                let r = moment.duration(exit.diff(endDay));
                let hoursR = parseInt(r.asHours());
                let minutesR = parseInt(r.asMinutes()) - hoursR * 60;

                if ((hoursR < 0 || minutesR < 0) && day.DayEndTime !== 0 && parseInt(exit.hour()) !== 0) {
                    rush = `${(('0' + Math.abs(hoursR)).slice(-2))}:${(('0' + Math.abs(minutesR)).slice(-2))}`
                }


                return {
                    Day: day.Day,
                    Date: day.Date,
                    DayStartTime: `${('0' + day.DayStartTime).slice(-2)}:00`,
                    DayEndTime: `${('0' + day.DayEndTime).slice(-2)}:00`,
                    StartTime: `${('0' + day.StartTime).slice(-2)}:00`,
                    EndTime: `${('0' + day.EndTime).slice(-2)}:00`,
                    StartTime2: `${('0' + day.StartTime2).slice(-2)}:00`,
                    EndTime2: `${('0' + day.EndTime2).slice(-2)}:00`,
                    StartTime3: `${('0' + day.StartTime3).slice(-2)}:00`,
                    EndTime3: `${('0' + day.EndTime3).slice(-2)}:00`,
                    HourlyLeaveStartTime: `${('0' + day.HourlyLeaveStartTime).slice(-2)}:00`,
                    HourlyLeaveEndTime: `${('0' + day.HourlyLeaveEndTime).slice(-2)}:00`,
                    DailyLeave: day.DailyLeave,
                    SickLeave: day.SickLeave,
                    MissionDay: !!day.MissionDay,
                    MissionHours: `${('0' + day.MissionHours).slice(-2)}:00`,
                    Absence: false,
                    Bound: bound,
                    Presence: presence,
                    TotalLeave: totalLeave,
                    Overtime: overtime,
                    WorkDeduction: workDeduction,
                    HolidayOvertime: holidayOvertime,
                    Delay: delay,
                    Rush: rush
                }

            })
            formik.setFieldValue('Days', temp)
        }
    }, [formik.values.Personnel, formik.values.Rule])

    console.log('formik.values', formik.values)



    function itemsKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling

        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.Days.length === itemsFocusedRow) {
                setTimeout(() => {
                    let temp = next.closest("tr").nextSibling.children[e.target.closest("td").cellIndex]
                    while (temp.cellIndex !== temp.closest("tr").children.length - 1 && (temp.querySelector("button:not([aria-label='Clear'])") || temp.querySelector("input").disabled)) {
                        temp = findNextFocusable(temp)
                    }
                    temp.querySelector("input").focus()
                    temp.querySelector("input").select()
                }, 0);
            }
            else {
                let down = e.target.closest("tr").nextSibling.children[e.target.closest("td").cellIndex].querySelector("input")
                down.focus()
                down.select()
            }
        }
        if (e.keyCode === 38) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.Days, () => { }, next, itemsFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.Days, () => { }, next, itemsFocusedRow)
        }
        if (e.keyCode === 13) { /* Enter */
            MoveNext(formik.values.Days, () => { }, next, itemsFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            next.querySelector("input").focus()
            next.querySelector("input").select()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.Days, () => { }, next, itemsFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }

    // console.log('isBetween1',moment('11:00',"HH:mm").isBetween(moment('08:00',"HH:mm"), moment('13:00',"HH:mm")))
    // console.log('isBetween2',moment('11:00',"HH:mm").isBetween(moment('12:00',"HH:mm"), moment('13:00',"HH:mm")))

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
                                    <div className='content col-lg-4 col-md-4 col-12'>
                                        <div className="title">
                                            <span> {t("پرسنل")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={PersonnelData}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => formik.setFieldValue('Personnel', e.value)}
                                                    className='selectBox'
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return (
                                                            item &&
                                                            item.Code +
                                                            "- " +
                                                            item.Name
                                                        );
                                                    }}
                                                    valueExpr="Code"
                                                    itemRender={null}
                                                    placeholder=''
                                                    name='Personnel'
                                                    id='Personnel'
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.Personnel && formik.errors.Personnel && !formik.values.Personnel ? (<div className='error-msg'>{t(formik.errors.Personnel)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className='content col-lg-4 col-md-4 col-12'>
                                        <div className="title">
                                            <span> {t("حکم")} <span className='star'>*</span> </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <SelectBox
                                                    dataSource={RulesList}
                                                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('Rule', e.value)
                                                        let item = RulesList.filter((p) => p.Id === e.value)
                                                        formik.setFieldValue('WorkStart', item[0].JobStartDate)
                                                        formik.setFieldValue('WorkEnd', item[0].JobEndDate)
                                                        formik.setFieldValue('TotalLeave', `${item[0].PaidLeaveSum_Day} ${t('روز')} ${t('و')} ${item[0].PaidLeaveSum_Hour} ${t('ساعت')}`)
                                                    }}
                                                    className='selectBox'
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={'Title'}
                                                    valueExpr="Id"
                                                    itemRender={null}
                                                    placeholder=''
                                                    name='Rule'
                                                    id='Rule'
                                                    disabled={!formik.values.Personnel}
                                                    searchEnabled
                                                />
                                            </div>
                                            {formik.touched.Rule && formik.errors.Rule && !formik.values.Rule ? (<div className='error-msg'>{t(formik.errors.Rule)}</div>) : null}
                                        </div>
                                    </div>
                                    <div className='content col-lg-4 col-md-4 col-12'>
                                        <div className='row'>
                                            <div className='col-8'>
                                                <div className="title">
                                                    <span> {t("ماه")} </span>
                                                </div>
                                                <div className='wrapper'>
                                                    <div>
                                                        <SelectBox
                                                            dataSource={monthList}
                                                            rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                            onValueChanged={(e) => formik.setFieldValue('Month', e.value)}
                                                            className='selectBox'
                                                            noDataText={t("اطلاعات یافت نشد")}
                                                            itemRender={null}
                                                            placeholder=''
                                                            name='Month'
                                                            id='Month'
                                                            value={formik.values.Month}
                                                            searchEnabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-4'>
                                                <div className="title">
                                                    <span> {t("سال")} </span>
                                                </div>
                                                <input
                                                    className={`form-input `}
                                                    id="Year"
                                                    name={`Year`}
                                                    style={{ direction: 'ltr' }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.Year}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='content col-lg-4 col-md-4 col-12'>
                                        <div className="title">
                                            <span> {t("آغاز بکار")} </span>
                                        </div>
                                        <input
                                            className={`form-input `}
                                            id="WorkStart"
                                            name="WorkStart"
                                            disabled
                                            value={formik.values.WorkStart}
                                            autoComplete="off"
                                        />

                                    </div>
                                    <div className='content col-lg-4 col-md-4 col-12'>
                                        <div className="title">
                                            <span> {t("پایان کار")} </span>
                                        </div>
                                        <input
                                            className={`form-input `}
                                            id="WorkEnd"
                                            name={`WorkEnd`}
                                            disabled
                                            value={formik.values.WorkEnd}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className='content col-lg-4 col-md-4 col-12'>
                                        <div className="title">
                                            <span> {t("جمع مرخصی استفاده شده")} </span>
                                        </div>
                                        <input
                                            className={`form-input `}
                                            id="TotalLeave"
                                            name={`TotalLeave`}
                                            disabled
                                            value={formik.values.TotalLeave}
                                            autoComplete="off"
                                        />
                                    </div>
                                    {!!formik?.values?.Days?.length && <div className='content col-lg-12 col-12 mt-5'>
                                        <div className="title">
                                            <span> {t("ساعات حضور موظفی در هفته")} </span>
                                        </div>
                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                        <div className={`table-responsive gridRow disable-field ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className='text-center'>
                                                        <th >{t("ردیف")}</th>
                                                        <th >{t("روز")}</th>
                                                        <th >{t("تاریخ")}</th>
                                                        <th >{t("شروع")}</th>
                                                        <th >{t("پایان")}</th>
                                                        <th >{t("موظفی")}</th>
                                                        <th >{t("ورود")}</th>
                                                        <th >{t("خروج")}</th>
                                                        <th >{t("ورود")}</th>
                                                        <th >{t("خروج")}</th>
                                                        <th >{t("ورود")}</th>
                                                        <th >{t("خروج")}</th>
                                                        <th >{t("حضور")}</th>
                                                        <th >{t("مرخصی از ساعت")}</th>
                                                        <th >{t("مرخصی تا ساعت")}</th>
                                                        <th >{t("غیبت")}</th>
                                                        <th >{t("مرخصی روزانه")}</th>
                                                        <th >{t("مرخصی استعلاجی")}</th>
                                                        <th >{t("جمع مرخصی")}</th>
                                                        <th >{t("ماموریت روزانه")}</th>
                                                        <th >{t("ماموریت ساعتی")}</th>
                                                        <th >{t("اضافه کار")}</th>
                                                        <th >{t("اضافه کار روز تعطیل")}</th>
                                                        <th >{t("تاخیر")}</th>
                                                        <th >{t("تعجیل")}</th>
                                                        <th >{t("کسر کار")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="draftItems"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik?.values?.Days?.map((draftItem, index) => (
                                                                    <tr key={index} onFocus={(e) => setItemsFocusedRow(e.target.closest("tr").rowIndex)}
                                                                        className={itemsFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                        onBlur={() => {
                                                                            let starts = [
                                                                                moment(formik.values.Days[index].StartTime, "HH:mm"),
                                                                                moment(formik.values.Days[index].StartTime2, "HH:mm"),
                                                                                moment(formik.values.Days[index].StartTime3, "HH:mm")
                                                                            ]

                                                                            let ends = [
                                                                                moment(formik.values.Days[index].EndTime, "HH:mm"),
                                                                                moment(formik.values.Days[index].EndTime2, "HH:mm"),
                                                                                moment(formik.values.Days[index].EndTime3, "HH:mm")
                                                                            ]

                                                                            console.log('starts.....:', starts)
                                                                            console.log('ends.......:', ends)


                                                                            let startTemp = []
                                                                            let isvalid = false
                                                                            if (starts.length) {
                                                                                while (!isvalid) {
                                                                                    if (starts[1].isBetween(starts[0], starts[1])) {

                                                                                    }
                                                                                }
                                                                            }

                                                                            let startsFilter = starts.filter((item) => `${('0' + item.hours()).slice(-2)}:${('0' + item.minutes()).slice(-2)}` !== '00:00')
                                                                            let endsfilter = ends.filter((item) => `${('0' + item.hours()).slice(-2)}:${('0' + item.minutes()).slice(-2)}` !== '00:00')

                                                                            while (startsFilter.length < 3) {
                                                                                startsFilter.push(moment('00:00', "HH:mm"))
                                                                            }
                                                                            while (endsfilter.length < 3) {
                                                                                endsfilter.push(moment('00:00', "HH:mm"))
                                                                            }

                                                                            if (startsFilter[1].isBetween(startsFilter[0], endsfilter[0]))


                                                                                console.log('starts startsFilter:', startsFilter)
                                                                            console.log('ends endsfilter:', endsfilter)
                                                                            // if(formik.values.Days[index].StartTime!=='00:00')formik.setFieldValue(`Days[${index}].StartTime`,`${starts[0].hours()}:${starts[0].minutes()}`)
                                                                            // if(formik.values.Days[index].StartTime2!=='00:00')formik.setFieldValue(`Days[${index}].StartTime2`,`${starts[1].hours()}:${starts[1].minutes()}`)
                                                                            // if(formik.values.Days[index].StartTime3!=='00:00')formik.setFieldValue(`Days[${index}].StartTime3`,`${starts[2].hours()}:${starts[2].minutes()}`)
                                                                            //
                                                                            // if(formik.values.Days[index].EndTime!=='00:00')starts.push(formik.values.Days[index].EndTime)
                                                                            // if(formik.values.Days[index].EndTime2!=='00:00')starts.push(formik.values.Days[index].EndTime2)
                                                                            // if(formik.values.Days[index].EndTime3!=='00:00')starts.push(formik.values.Days[index].EndTime3)
                                                                            //
                                                                            // formik.setFieldValue(`Days[${index}].EndTime`,`${ends[0].hours()}:${ends[0].minutes()}`)
                                                                            // formik.setFieldValue(`Days[${index}].EndTime2`,`${ends[1].hours()}:${ends[1].minutes()}`)
                                                                            // formik.setFieldValue(`Days[${index}].EndTime3`,`${ends[2].hours()}:${ends[2].minutes()}`)

                                                                        }}
                                                                    >
                                                                        <td className='text-center' style={{ verticalAlign: 'middle', width: '30px' }}>
                                                                            {index + 1}
                                                                        </td>
                                                                        <td style={{ width: '65px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Day`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Day}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '80px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Date`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Date}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.DayStartTime`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].DayStartTime}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.DayEndTime`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].DayEndTime}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Bound`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Bound}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.StartTime`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].StartTime}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].StartTime`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.EndTime`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].EndTime}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].EndTime`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.StartTime2`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].StartTime2}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].StartTime2`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.EndTime2`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].EndTime2}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].EndTime2`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.StartTime3`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].StartTime3}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].StartTime3`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.EndTime3`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].EndTime3}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].EndTime3`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Presence`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Presence}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.HourlyLeaveStartTime`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].HourlyLeaveStartTime}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].HourlyLeaveStartTime`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.HourlyLeaveEndTime`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].HourlyLeaveEndTime}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].HourlyLeaveEndTime`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '30px' }} className='text-center'>
                                                                            <Checkbox
                                                                                checked={formik.values.Days[index].Absence}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].Absence`, e.target.checked)}
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '30px' }} className='text-center'>
                                                                            <Checkbox
                                                                                checked={formik.values.Days[index].DailyLeave}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].DailyLeave`, e.target.checked)}
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '30px' }} className='text-center'>
                                                                            <Checkbox
                                                                                checked={formik.values.Days[index].SickLeave}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].SickLeave`, e.target.checked)}
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.TotalLeave`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].TotalLeave}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '30px' }} className='text-center'>
                                                                            <Checkbox
                                                                                checked={formik.values.Days[index].MissionDay}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].MissionDay`, e.target.checked)}
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <Input
                                                                                className="rmdp-input"
                                                                                style={{ direction: "ltr" }}
                                                                                name={`Days.${index}.MissionHours`}
                                                                                mask="99:99"
                                                                                maskChar="-"
                                                                                onKeyDown={(e) => itemsKeyDownHandler(e)}
                                                                                value={formik.values.Days[index].MissionHours}
                                                                                onChange={(e) => formik.setFieldValue(`Days[${index}].MissionHours`, e.target.value)}
                                                                                autoComplete="off"
                                                                                alwaysShowMask={true}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Overtime`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Overtime}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.HolidayOvertime`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].HolidayOvertime}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Delay`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Delay}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.Rush`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].Rush}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '50px' }} className='text-center'>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`Days.${index}.WorkDeduction`}
                                                                                type='text'
                                                                                value={formik.values.Days[index].WorkDeduction}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}


                                                            </React.Fragment>

                                                        )}>
                                                    </FieldArray>
                                                </tbody>
                                            </table>
                                        </div>
                                        {formik?.errors?.Days?.map((error, index) => (
                                            <p className='error-msg' key={index}>
                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.product ? t(error.product) + "." : ""} ${error?.batchNumber ? t(error.batchNumber) + "." : ""} ${error?.measurementUnit ? t(error.measurementUnit) + "." : ""} ${error?.count ? t(error.count) + "." : ""}` : null}
                                            </p>
                                        ))}
                                    </div>}

                                </div>
                            </div>
                        </form>
                    </FormikProvider>
                </div>
            </div>
            <div>
                <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
                    <Button
                        variant="contained"
                        color="success"
                        type="button"
                        onClick={() => {
                            // if (formik.values.Days.length > 0) {
                            //     if (formik.errors.Days) {
                            //         tableError()
                            //     } else {
                            //         setClick(true)
                            //     }
                            //
                            // }
                            // else {
                            //     emptyError()
                            // }
                            formik.handleSubmit()

                        }}
                    >
                        {t("تایید")}
                    </Button>

                    <div className="Issuance">
                        <Button
                            variant="contained"
                            color="error"
                            style={i18n.dir() == 'rtl' ? { marginRight: "10px" } : { marginLeft: "10px" }}
                        >
                            <Link to={'/Payroll/workingHours'}>
                                {t("انصراف")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

        </>
    );
}
