import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import { history } from '../../../../utils/history';
import ActionCellMainNAD from './ActionCellMainNAD';
import Data from './Data.json'
import * as Yup from "yup";
import swal from 'sweetalert';
import { julianIntToDate } from '../../../../utils/dateConvert';
import DateObject from 'react-date-object';
import DatePicker from 'react-multi-date-picker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from '../../../../utils/calenderLang';

const NewAggregatedDocument = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const [selectedRows, SetSelectedRows] = useState();
    const [date, setDate] = useState(new DateObject());
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            DocumentCode: Math.floor(Math.random() * 1000),
            DocumentDate: julianIntToDate(new DateObject().toJulianDay()),
            Description: "",
            SelectedRows: [],

        },
        validationSchema: Yup.object({
            DocumentDate: Yup.date().required("وارد کردن تاریخ الزامی است"),
            Description: Yup.string().required("وارد کردن شرح سند الزامی است")
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


    const dateRef = useRef();

    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: new Date(data.DocumentInsertDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                DocumentTrackCode: data.DocumentTrackCode !== '' ? parseInt(data.DocumentTrackCode) : '',
                RefDocumentCode: data.RefDocumentCode !== '' ? parseInt(data.RefDocumentCode) : '',
            }
        })
        setData(tempData)
        let tempExcel = Data.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: new Date(data.DocumentInsertDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                DocumentTrackCode: data.DocumentTrackCode !== '' ? parseInt(data.DocumentTrackCode) : '',
                RefDocumentCode: data.RefDocumentCode !== '' ? parseInt(data.RefDocumentCode) : '',
            }
        })
        setExcelData(tempExcel)
    }, [i18n.language])
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'DocumentCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ش سند",
            filter: 'numeric',
        },
        {
            field: 'DocumentTrackCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ش پیگیری",
            filter: 'numeric',
        },
        {
            field: 'DocumentInsertDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ",
            // format: "{0:d}",
            cell: DateCell,
            filter: "date",
        },
        {
            field: 'DocumentBalance',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "تراز",
            filter: 'numeric',
        },
        {
            field: 'DocumentTypeName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نوع",
        },
        {
            field: 'RefDocumentCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ش ارجاع",
            filter: 'numeric',
        }, {
            field: 'InsertUser',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "درج",
        },
        {
            field: 'LastUpdateUser',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "آخرین تغییر",
        },
        {
            field: 'DocumentState',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وضعیت",
        },
        {
            field: 'DocumentDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شرح",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '170px',
            name: "عملیات",
            cell: ActionCellMainNAD,
            className: 'text-center',
            reorderable: false
        }
    ]
    function getSelectedRows(list) {
        console.log('selected row list to request:', list)
        SetSelectedRows(list)
    }
    const callComponent = () => {
        history.navigate(`/Accounting/AggregatedDocument`, 'noopener,noreferrer');
    }
    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-design">
                            <div className="row">
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar();
                                }}>
                                    <div className="title">

                                        <span>{t("شماره سند")}</span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="DocumentCode"
                                                name="DocumentCode"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.DocumentCode}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-lg-6 col-md-6 col-12">
                                    <div className="title">
                                        <span>{t("تاریخ سند")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper date-picker position-relative">
                                        <DatePicker
                                            ref={dateRef}
                                            name={"DocumentDate"}
                                            id={"DocumentDate"}
                                            calendarPosition="bottom-right"
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            onBlur={formik.handleBlur}
                                            onChange={(val) => {
                                                formik.setFieldValue(
                                                    "DocumentDate",
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
                                <div className="content col-lg-6 col-md-6 col-12" onFocus={() => {
                                    dateRef?.current?.closeCalendar();
                                }}>
                                    <div className="title">
                                        <span>{t("شرح سند")}<span className="star">*</span></span>
                                    </div>
                                    <div className="wrapper">
                                        <textarea
                                            className="form-input"
                                            type="text"
                                            id="Description"
                                            name="Description"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.Description}

                                        />
                                        {formik.touched.Description && formik.errors.Description &&
                                            !formik.values.Description ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Description)}
                                            </div>
                                        ) : null}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <RKGrid
                    gridId={'NewAggregatedDocument'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={false}
                    showChart={false}
                    showExcelExport={false}
                    showPrint={false}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectKeyField={'DocumentId'}
                    getSelectedRows={getSelectedRows}
                    
                />
            </div>
            <div>
                <div className={`button-pos ${i18n.dir == 'ltr' ? 'ltr' : 'rtl'}`}>
                    <Button variant="contained" color="success"
                        type="button"
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
export default NewAggregatedDocument

