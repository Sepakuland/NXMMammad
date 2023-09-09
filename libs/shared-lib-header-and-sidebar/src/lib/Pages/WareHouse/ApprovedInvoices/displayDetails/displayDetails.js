import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, Tooltip, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import DisplayDitailsData from './DisplayDitailsData.json'
import { history } from '../../../../utils/history';
import ActionCellMainAI from "./ActionCellMainAI";
import { useFormik } from "formik";
import * as Yup from "yup";
import { julianIntToDate } from "../../../../utils/dateConvert";
import DateObject from "react-date-object";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../utils/calenderLang";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { IconQuestionMark } from '@tabler/icons';
import Drivers from './Drivers.json'
import { SelectBox } from "devextreme-react";
import { Box } from "@mui/system";
import CarsData from './CarsData.json'
import DistributorData from './DistributorData.json'
import LinearProgress from '@mui/material/LinearProgress';
import CurrencyInput from "react-currency-input-field";
import { Link, useLocation, useSearchParams } from "react-router-dom";


const Factor = [];
const DisplayDetails = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [show, setShow] = useState(!!id)
    /////////////////////RK Grid/////////////////
    const [excelData, setExcelData] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = DisplayDitailsData.map((data) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
            }
        })
        setData(tempData)

        let tempExcel = DisplayDitailsData?.map((data, index) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                IndexCell: index + 1,
                OrderInsertDate: getLangDate(i18n.language, new Date(data.OrderInsertDate)),
                OrderPrice: cost,
                OrderPreCode: parseInt(data.OrderPreCode),
                PartnerCode: parseInt(data.PartnerCode),
                VolumeSum: parseInt(data.VolumeSum),
                WeightSum: parseInt(data.WeightSum),
            }
        })
        setExcelData(tempExcel)
    }, [i18n.language])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: true,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'OrderPreCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شماره پیش فاکتور",
            filter: 'numeric',

            reorderable: true
        },
        {
            field: 'PartnerCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد طرف حساب",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'PartnerName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام طرف حساب",
            reorderable: true
        },
        {
            field: "PartnerZuneAndPath",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: 'منطقه و مسیر',
            reorderable: true
        },
        {
            field: 'PartnerDistributionPath',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مسیر توزیع",
            reorderable: true
        },
        {
            field: 'PartnerAddress',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "آدرس",
            reorderable: true
        },
        {
            field: 'OrderPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'SettlementType',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نحوه تسویه",
            width: '70px',
            reorderable: true
        },
        {
            field: 'PersonnelName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ویزیتور",
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'OrderInsertDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ فاکتور",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            reorderable: true
        },
        {
            field: 'Description',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
            reorderable: true
        },
        {
            field: 'VolumeSum',
            filterable: true,
            // columnMenu: ColumnMenu,
            filter: 'numeric',
            name: "حجم (لیتر)",
            width: '50px',
            className: 'text-center',
            footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'WeightSum',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "وزن (Kg)",
            filter: 'numeric',
            width: '50px',
            className: 'text-center',
            footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '150px',
            name: "عملیات",
            cell: ActionCellMainAI,
            className: 'text-center',
            reorderable: false
        },

    ]

    const chartObj = [
        { value: "OrderPreCode", title: t("شماره پیش فاکتور") },
        { value: "PartnerCode", title: t("کد طرف حساب") },
        { value: "OrderPrice", title: t("مبلغ") },
        { value: "OrderInsertDate", title: t("تاریخ فاکتور") },
        { value: "VolumeSum", title: t("حجم (لیتر)") },
        { value: "WeightSum", title: t("وزن (Kg)") },

    ]
    let savedCharts = [
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ]
    function getSavedCharts(list) {
        console.log('save charts list to request and save:', list)
    }
    function getSelectedRows(list) {
        console.log('selected row list to request:', list)
        setSelectedRow(list);
    }
    const callPrintTemplate = () => {

        window.open(`/WareHouse/WareHouseEra/PrintTemplate?lang=${i18n.language}`, '_blank');
    }
    const newApprovedInvoices = () => {
        setShow(true)
    }

    console.log('show',show)

    const callUnSentTotals = () => {
        history.navigate("/WareHouse/sale/approvedInvoices/unsentTotal")
    }
    //////////////////////new Total/////////////////////
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            TotalNumber: Math.floor(Math.random() * 1000),
            SuggestedDeliveryDate: julianIntToDate(new DateObject().toJulianDay()),
            Driver: "",
            TransportVehicle: "",
            Distributor: "",
            SeccoundDistributor: "",
            Discription: "",
            FactorCount: 0,
            TotalPrice: 0,
            MaxVolumePercent: 0,
            MaxWeightPercent: 0,
            Rows: [],
            show: true,
        },
        show: Yup.boolean(),
        validationSchema: Yup.object({

        }),
        onSubmit: (values) => {
            console.log("here", values)
            formik.setFieldValue("Rows", selectedRow)
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
    const dateRef = useRef()
    const [date, setDate] = useState(new DateObject());
   
    console.log("!!id", !!id)
    //////////////calculation progressBars///////////////
    const [progress, setProgress] = useState(0);
    const [car, setCar] = useState([]);
    const [literTotalPercent, setLiterTotalPercent] = useState(0);
    const [literTotal, setLiterTotal] = useState(0);
    const [showContent, setShowContent] = useState(0);
    const [showWeight, setShowWeight] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalWeightPercent, setTotalWeightPercent] = useState(0);
    useEffect(() => {
        setShowContent(parseFloat(car[0]?.MaxVolumePercent))
        setShowWeight(parseFloat(car[0]?.MaxWeightPercent))
        let tempTotalContent = selectedRow?.reduce(
            (acc, current) => acc + parseFloat(current.VolumeSum) || 0, 0);

        let tempTotalWeight = selectedRow?.reduce(
            (acc, current) => acc + parseFloat(current.WeightSum) || 0, 0);

        if (tempTotalContent < car[0]?.MaxVolumePercent) {
            if (tempTotalContent > 0) {
                setLiterTotal(car[0]?.MaxVolumePercent - tempTotalContent)
                setLiterTotalPercent(100 - (car[0]?.MaxVolumePercent - tempTotalContent))

            }
            if (tempTotalContent == 0) {
                setLiterTotalPercent(0)
            }
        }

        if (tempTotalWeight < car[0]?.MaxWeightPercent) {
            if (tempTotalWeight > 0) {
                setTotalWeight(car[0]?.MaxWeightPercent - tempTotalWeight)
                setTotalWeightPercent(100 - (car[0]?.MaxWeightPercent - tempTotalWeight))

            }
            if (tempTotalWeight == 0) {
                setTotalWeightPercent(0)
            }
        }
        else if (tempTotalContent == car[0]?.MaxVolumePercent) {
            setLiterTotalPercent(100)
        }
        else if (tempTotalWeight == car[0]?.MaxWeightPercent) {
            setTotalWeightPercent(100)
        }
        else if (tempTotalContent > car[0]?.MaxVolumePercent) {
            setLiterTotalPercent(404)
        }
        else if (tempTotalWeight > car[0]?.MaxWeightPercent) {
            setTotalWeightPercent(404)
        }
        else {
            setLiterTotalPercent(0)
            setTotalWeightPercent(0)
        }
        if (car[0]?.MaxVolumePercent > 0) {
            formik.setFieldValue("MaxVolumePercent", car[0]?.MaxVolumePercent)
        }
        else {
            formik.setFieldValue("MaxVolumePercent", 0)
        }
        if (car[0]?.MaxWeightPercent > 0) {
            formik.setFieldValue("MaxWeightPercent", car[0]?.MaxWeightPercent)
        }
        else {
            formik.setFieldValue("MaxWeightPercent", 0)
        }
    }, [car, selectedRow])

    const location = useLocation()
    const { state } = location
    useEffect(() => {
        formik.setFieldValue("FactorCount", selectedRow.length)
        let tempTotalContent = selectedRow?.reduce(
            (acc, current) => acc + parseFloat(current.OrderPrice) || 0,
            0
        );
        formik.setFieldValue("TotalPrice", parseFloat(tempTotalContent))
    }, [selectedRow])

    /////////////////////////////////////////////////////
    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'ApprovedInvoices'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("پیش فاکتورهای تایید شده")}
                    rowCount={10}
                    chartDependent={chartObj}
                    savedChartsList={savedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectKeyField={'OrderId'}
                    getSelectedRows={getSelectedRows}
                    
                />

                {
                    !show  ? (<div className="row align-items-start">
                        <div style={{ height: "40px" }} className="d-flex justify-content-end col-sm-12 col-12 mt-3 ">
                            <div className="d-flex justify-content-center align-items-center" style={{ width: "5%", height: "100%", marginRight: "40px", marginLeft: "40px" }}>
                                <Button style={{ width: "100px", height: "100%" }} variant="contained"
                                    color="primary"
                                    onClick={() => newApprovedInvoices()}>
                                    {t("سرجمع جدید")}
                                </Button ></div>
                            <div className="d-flex justify-content-end align-items-center" style={{ width: "10%", height: "100%" }}>
                                <Button style={{ width: "150px", height: "100%" }} variant="contained"
                                    color="primary"
                                    onClick={callUnSentTotals}>
                                    {t("سرجمع های ارسال نشده")}
                                </Button ></div>

                        </div>
                    </div>) : (
                        <>
                            <div className="informationTotal row form-design">
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="row ">
                                        <div className=" col-lg-6 col-md-6 col-12  " onFocus={() => dateRef?.current?.closeCalendar()}>
                                            <div className="title">
                                                <span>{t("شماره سرجمع")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        id="TotalNumber"
                                                        name="TotalNumber"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.TotalNumber}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-lg-5 col-md-5 col-11  ">
                                            <div className="title">
                                                <span>{t("تاریخ تراکنش")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper date-picker position-relative">
                                                <DatePicker
                                                    ref={dateRef}
                                                    name={"SuggestedDeliveryDate"}
                                                    id={"SuggestedDeliveryDate"}
                                                    calendarPosition="bottom-right"
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(val) => {
                                                        formik.setFieldValue("SuggestedDeliveryDate", julianIntToDate(val.toJulianDay()));
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
                                        <div className=" col-lg-1 col-md-1 col-1  ">
                                            <div className="title">
                                                <span>‌</span>
                                            </div>
                                            <Tooltip title={t("این تاریخ به معنی ارسال حواله سرجمع نبوده و صرفا در زمان ارسال به کاربر جهت ثبت پیشنهاد شده و همچنین در چاپ سرجمع ها و صورتحساب های فروش از آن استفاده خواهد شد")}>
                                                <Button variant="contained" color='info' className='kendo-action-btn'  >
                                                    <IconQuestionMark />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                        <div className=" col-lg-6 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                            <div className="title">
                                                <span>{t("راننده")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        dataSource={Drivers}
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
                                                            formik.setFieldValue('Driver', e.value)
                                                        }}
                                                    />

                                                    {formik.touched.Driver && formik.errors.Driver &&
                                                        !formik.values.Driver ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.Driver)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-lg-5 col-md-5 col-11" >
                                            <div className="title">
                                                <span>{t("خودروی حمل")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        dataSource={CarsData}
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        valueExpr="MachineId"
                                                        className='selectBox'
                                                        searchEnabled={true}
                                                        placeholder=''
                                                        showClearButton
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        displayExpr={function (item) {
                                                            return item && item.MachineCode + ' - ' + item.MachineName;
                                                        }}
                                                        displayValue='MachineName'
                                                        onValueChanged={(e) => {
                                                            setCar(CarsData?.filter(a => a.MachineId == e.value))
                                                            formik.setFieldValue('TransportVehicle', e.value)

                                                        }}
                                                    />

                                                    {formik.touched.TransportVehicle && formik.errors.TransportVehicle &&
                                                        !formik.values.TransportVehicle ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.TransportVehicle)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-lg-6 col-md-6 col-12" >
                                            <div className="title">
                                                <span>{t("موزع")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        dataSource={DistributorData}
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        valueExpr="Id"
                                                        className='selectBox'
                                                        searchEnabled={true}
                                                        placeholder=''
                                                        showClearButton
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        displayExpr={function (item) {
                                                            return item && item.Code + ' - ' + item.Name;
                                                        }}
                                                        displayValue='Name'
                                                        onValueChanged={(e) => {
                                                            formik.setFieldValue('Distributor', e.value)
                                                        }}
                                                    />

                                                    {formik.touched.Distributor && formik.errors.Distributor &&
                                                        !formik.values.Distributor ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.Distributor)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-lg-5 col-md-5 col-11" >
                                            <div className="title">
                                                <span>{t("موزع دوم")}<span className="star">*</span></span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        dataSource={DistributorData}
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        valueExpr="Id"
                                                        className='selectBox'
                                                        searchEnabled={true}
                                                        placeholder=''
                                                        showClearButton
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        displayExpr={function (item) {
                                                            return item && item.Code + ' - ' + item.Name;
                                                        }}
                                                        displayValue='Name'
                                                        onValueChanged={(e) => {
                                                            formik.setFieldValue('SeccoundDistributor', e.value)
                                                        }}
                                                    />

                                                    {formik.touched.SeccoundDistributor && formik.errors.SeccoundDistributor &&
                                                        !formik.values.Distributor ? (
                                                        <div className='error-msg'>
                                                            {t(formik.errors.SeccoundDistributor)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-lg-11 col-md-11 col-11">
                                            <div className="title">
                                                <span>{t("توضیحات")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <textarea

                                                        className="form-input"
                                                        type="text"
                                                        id="Discription"
                                                        name="Discription"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.Discription}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                                <div className="col-lg-6 col-md-6 col-12" >
                                    <div className="row">
                                        <div className="col-lg-2 col-md-2 col-2">
                                            <div className="col-lg-12 col-md-12 col-12">
                                                <div className="title"><span>{t("تعداد فاکتور")}</span></div>
                                                <div className="wrapper">
                                                    <div>
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            id="FactorCount"
                                                            name="FactorCount"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.FactorCount}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-12" style={{ marginTop: "8%" }}>
                                                <div className="title"><span>{t("ظرفیت حجمی")} m3</span></div>
                                                <div className="wrapper">
                                                    <div>
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            id="liter"
                                                            name="liter"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.MaxVolumePercent}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12" style={{ marginTop: "26%" }}>
                                                <div className="title"><span>{t("ظرفیت وزنی")} kg</span></div>
                                                <div className="wrapper">
                                                    <div>
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            id="liter"
                                                            name="liter"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.MaxWeightPercent}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-lg-10 col-md-10 col-10">
                                            <div className="row">
                                                <div className="col-lg-1 col-md-1 col-1"></div>
                                                <div className="col-lg-4 col-md-4 col-4">
                                                    <div className="title"><span>{t("مجموع مبلغ")}</span></div>
                                                    <div className="wrapper">
                                                        <CurrencyInput
                                                            className={`form-input `}
                                                            style={{ width: "100%" }}
                                                            id="TotalPrice"
                                                            name="TotalPrice"
                                                            value={formik.values.TotalPrice}
                                                            decimalsLimit={2}
                                                        />
                                                    </div>

                                                </div>
                                                <div className="col-lg-7 col-md-7 col-7"></div>
                                                <div className="col-lg-1 col-md-1 col-1">
                                                    <div className="title"><span>‌</span></div>
                                                    {literTotalPercent !== (404) &&
                                                        (<Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {literTotalPercent > 0 ?
                                                                    Math.round(1.25 * literTotalPercent)
                                                                    : 0}%
                                                            </Typography>
                                                        </Box>)}
                                                </div>
                                                <div className="col-lg-11 col-md-11 col-11 dir-ltr" >
                                                    <table width={"100%"}>
                                                        <thead style={{ direction: "ltr", fontSize: "12px" }}>
                                                            <th>
                                                                <td className="col-9" >0%</td>
                                                                <td className="col-1">90%</td>
                                                                <td className="col-2">100%</td>
                                                                <td className="col-1">125%</td>
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <Box sx={{ height: "60px", direction: "ltr" }}>
                                                                    <LinearProgress variant="determinate" color={literTotalPercent == 0 ? 'inherit' : literTotalPercent < 80 ? "success" : "error"} value={literTotalPercent}
                                                                    /></Box>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    <table width={"100%"} style={{ "margin-top": "-4%" }}>
                                                        <thead style={{ direction: "ltr", fontSize: "12px" }}>
                                                            <th>
                                                                <td className="col-9" >0 m3</td>
                                                                <td className="col-1">{showContent > 0 ? (showContent * 0.9) : 0} m3</td>
                                                                <td className="col-2">{showContent > 0 ? showContent : 0} m3</td>
                                                                <td className="col-1">{showContent > 0 ? ((showContent * 0.25) + showContent) : 0}m3</td>
                                                            </th>
                                                        </thead>
                                                    </table>
                                                    {literTotalPercent === (404) && (<span style={{ color: "red", direction: "rtl" }}>{t("حجم انتخابی بیش از حد مجاز است")}</span>)}
                                                </div>

                                                <div className="col-lg-1 col-md-1 col-1">
                                                    <div className="title"><span>‌</span></div>
                                                    {literTotalPercent !== (404) &&
                                                        (<Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {literTotalPercent > 0 ?
                                                                    Math.round(1.25 * literTotalPercent)
                                                                    : 0}%
                                                            </Typography>
                                                        </Box>)}
                                                </div>
                                                <div className="col-lg-11 col-md-11 col-11 dir-ltr" >
                                                    <table width={"100%"}>
                                                        <thead style={{ direction: "ltr", fontSize: "12px" }}>
                                                            <th>
                                                                <td className="col-9" >0%</td>
                                                                <td className="col-1">90%</td>
                                                                <td className="col-2">100%</td>
                                                                <td className="col-1">125%</td>
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <Box sx={{ height: "60px", direction: "ltr" }}>
                                                                    <LinearProgress variant="determinate" color={totalWeightPercent == 0 ? 'inherit' : totalWeightPercent < 80 ? "success" : "error"} value={totalWeightPercent}
                                                                    /></Box>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    <table width={"100%"} style={{ "margin-top": "-4%" }}>
                                                        <thead style={{ direction: "ltr", fontSize: "12px" }}>
                                                            <th>
                                                                <td className="col-9" >0 kg</td>
                                                                <td className="col-1">{showWeight > 0 ? (showWeight * 0.9) : 0} kg</td>
                                                                <td className="col-2">{showWeight > 0 ? showWeight : 0} kg</td>
                                                                <td className="col-1">{showWeight > 0 ? ((showWeight * 0.25) + showWeight) : 0} kg</td>
                                                            </th>
                                                        </thead>
                                                    </table>
                                                    {totalWeightPercent === (404) && (<span style={{ color: "red", direction: "rtl" }}>{t("حجم انتخابی بیش از حد مجاز است")}</span>)}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div >

                            <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`}>
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
                                        onClick={(e)=>{
                                            if(!!id){
                                                e.preventDefault()
                                            }else{
                                                setShow(false)
                                            }
                                            
                                        }}
                                    >
                                        {!!id ?<Link to={ "/WareHouse/sale/approvedInvoices/unsentTotal" } state={{ prevPath: state?.prevPath }}>
                                            {t("انصراف")}
                                        </Link>:<>{t("انصراف")}</>}

                                    </Button >
                                </div>
                            </div>

                        </>)
                }

            </div >
        </>
    )
}

export default DisplayDetails
