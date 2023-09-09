import React, {useCallback, useEffect, useRef, useState} from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import products from "../../SaleTotalBatchReceipt/DisplayDetails/product.json";
import ActionCellMain from "../../SaleTotalBatchReceipt/DisplayDetails/ActionCellMain";
import { julianIntToDate } from "../../../../../components/DatePicker/dateConvert";
import { renderCalendarSwitch, renderCalendarLocaleSwitch } from '../../../../../utils/calenderLang'
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useFormik } from "formik";
import DateObject from "react-date-object";
import swal from "sweetalert";
import {Link} from 'react-router-dom'



const SaleTotalBatchReceiptGrid = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const dateRef = useRef()
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const [date, setDate] = useState(new DateObject())
    const dataRef = useRef()
    dataRef.current = data
    const formik = useFormik({
        initialValues: {
            id: Math.floor(Math.random() * 1000),
            datePrint: julianIntToDate(new DateObject().toJulianDay()),
        },

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
        let tempData = products.map((data) => {
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                TotalDate: new Date(data.TotalDate),
                ShipmentDate: new Date(data.ShipmentDate),
                TotalPrice: cost,
                TotalCode: parseInt(data.TotalCode),
                PayeeCode: parseInt(data.PayeeCode),
                DriverCode: parseInt(data.DriverCode),
            }
        })
        setData(tempData)

        let tempExcel = products?.map((data, index) => {
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                IndexCell: index + 1,
                TotalDate: getLangDate(i18n.language, new Date(data.TotalDate)),
                ShipmentDate: getLangDate(i18n.language, new Date(data.ShipmentDate)),
                TotalPrice: cost,
                TotalCode: parseInt(data.TotalCode),
                PayeeCode: parseInt(data.PayeeCode),
                DriverCode: parseInt(data.DriverCode),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'TotalCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "سرجمع",
            filter: 'numeric',
        },
        {
            field: 'TotalDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "date",
            // format: "{0:d}",
            name: "تاریخ سرجمع",
            cell: DateCell,
            reorderable: true,
        },
        {
            field: 'ShipmentDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "date",
            // format: "{0:d}",
            name: "تاریخ ارسال",
            cell: DateCell,
            reorderable: true,
        },
        {
            field: 'PayeeCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد موزع",
            filter: 'numeric',
        },
        {
            field: 'PayeeName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "موزع",
        },
        {
            field: 'DriverCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد راننده",
            filter: 'numeric',
        },
        {
            field: 'DriverName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام راننده",
        },
        {
            field: 'TotalPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ کل",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            filter: 'numeric',
        },
        {
            field: 'Status',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وضعیت",
        },
        {
            field: 'TotalDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            width: '150px',
            name: "توضیحات سرجمع",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '300px',
            name: "عملیات",
            cell: ActionCellMain,
            className: 'text-center',
            sortable: false,
            reorderable: false
        }
    ]

    const chartObj = [
        { value: "TotalPrice", title: t('مبلغ') },
        {value:"TotalCode",title:t('سرجمع')} ,
    ]

    let savedCharts = [
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ]

    const getSavedCharts = useCallback((list) => {
        console.log('getSavedCharts', list)
    }, []);
    const getSelectedRows = useCallback((list) => {
        console.log('getSelectedRows', list)
    }, []);

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}` }} >
                <RKGrid
                    gridId={'SaleTotalBatchReceiptGrid'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("شارژ صندوق")}
                    chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={false}
                    selectionMode={'single'}  //single , multiple
                    selectKeyField={'TotalCode'}
                    getSelectedRows={getSelectedRows}
                    


                />
                <div style={{padding:'0 20px'}}>
                    <div className='row'>
                        <div className={'col-12 justify-content-end'}>
                            <div className="d-flex justify-content-end mt-3 align-items-center">
                                <div className="title" style={{margin:'0 5px'}}>
                                    <span>{t("چاپ روز:")}</span>
                                </div>
                                <div className="wrapper date-picker position-relative" style={{margin:'0 5px'}}>
                                    <DatePicker
                                        name={"datePrint"}
                                        id={"datePrint"}
                                        editable={false}
                                        ref={dateRef}
                                        value={date}
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        onBlur={formik.handleBlur}
                                        onChange={(val) => {
                                            formik.setFieldValue(
                                                "datePrint",
                                                julianIntToDate(val.toJulianDay())
                                            );
                                        }}
                                    />
                                    <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton' />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="contained">
                                    <Link to={`/FinancialTransaction/receiptDocument/SaleTotalBatchReceipt/DisplayDetails/DatePrint?date=${formik.values.datePrint}`} target={'_blank'}>
                                        {t("چاپ")}
                                    </Link>

                                </Button >
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default SaleTotalBatchReceiptGrid