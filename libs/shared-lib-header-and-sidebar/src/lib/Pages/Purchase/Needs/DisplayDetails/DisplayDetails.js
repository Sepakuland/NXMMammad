import { React, useEffect, useRef, useState } from "react";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./DataForGrid.json";
import RKGrid, { FooterSome,IndexCell, TotalTitle } from "rkgrid";
import { history } from "../../../../utils/history";
import { useFormik } from "formik";
import { julianIntToDate } from "../../../../utils/dateConvert";
import * as Yup from "yup";
import swal from "sweetalert";
import DateObject from "react-date-object";
import Supplier from "./Supplier.json"
import { SelectBox } from "devextreme-react";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../utils/calenderLang";

const Factor = [];
const DisplayDetails = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const dataRef = useRef();
    dataRef.current = data;

    ////////////////////formik////////////////////
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            Date: julianIntToDate(new DateObject().toJulianDay()),
            Aggregation: true,
            Supplier: "",
            Amount: [],
            packageName: "",
            TableData: [dataForGrid]
        },
        validationSchema: Yup.object({
            Date: Yup.date().required("انتخاب تاریخ الزامی است")
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
    const dateRef = useRef()
    const [date, setDate] = useState(new DateObject());
    //////////////RK Grid//////////////////////////////////
    // const [pakageNames, setPakageNames] = useState([]);
    // console.log(pakageNames)



    useEffect(() => {
        let tempData = dataForGrid.map((data) => {

            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                ChequeMaturityDate: new Date(data.ChequeMaturityDate),
                WarehouseCode: data.WarehouseCode !== "" ? parseInt(data.WarehouseCode) : "",
                StuffCode: data.StuffCode !== "" ? parseInt(data.StuffCode) : "",
                StuffRealStock: data.StuffRealStock !== "" ? parseInt(data.StuffRealStock) : "",
                BuyOrderStock: data.BuyOrderStock !== "" ? parseInt(data.BuyOrderStock) : "",
                SaleOrderStock: data.SaleOrderStock !== "" ? parseInt(data.SaleOrderStock) : "",
                BuyReversionStock: data.BuyReversionStock !== "" ? parseInt(data.BuyReversionStock) : "",
                MinInWarehouse: data.MinInWarehouse !== "" ? parseInt(data.MinInWarehouse) : "",
                NeedToBuy: data.NeedToBuy !== "" ? parseInt(data.NeedToBuy) : "",
                SaleInRecent10Days: data.SaleInRecent10Days !== "" ? parseInt(data.SaleInRecent10Days) : "",
                SaleInRecent20Days: data.SaleInRecent20Days !== "" ? parseInt(data.SaleInRecent20Days) : "",
                SaleInRecent30Days: data.SaleInRecent30Days !== "" ? parseInt(data.SaleInRecent30Days) : "",
                SaleInRecent3Months: data.SaleInRecent3Months !== "" ? parseInt(data.SaleInRecent3Months) : "",
                PackageCoefficient: data.PackageCoefficient !== "" ? parseInt(data.PackageCoefficient) : "",
                StuffMinOrder: data.StuffMinOrder !== "" ? parseInt(data.StuffMinOrder) : "",
            };
        });
        setData(tempData);
        let tempExcel = dataForGrid?.map((data, index) => {
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                ChequeMaturityDate: new Date(data.ChequeMaturityDate),
                WarehouseCode: data.WarehouseCode !== "" ? parseInt(data.WarehouseCode) : "",
                StuffCode: data.StuffCode !== "" ? parseInt(data.StuffCode) : "",
                StuffRealStock: data.StuffRealStock !== "" ? parseInt(data.StuffRealStock) : "",
                BuyOrderStock: data.BuyOrderStock !== "" ? parseInt(data.BuyOrderStock) : "",
                SaleOrderStock: data.SaleOrderStock !== "" ? parseInt(data.SaleOrderStock) : "",
                BuyReversionStock: data.BuyReversionStock !== "" ? parseInt(data.BuyReversionStock) : "",
                MinInWarehouse: data.MinInWarehouse !== "" ? parseInt(data.MinInWarehouse) : "",
                NeedToBuy: data.NeedToBuy !== "" ? parseInt(data.NeedToBuy) : "",
                SaleInRecent10Days: data.SaleInRecent10Days !== "" ? parseInt(data.SaleInRecent10Days) : "",
                SaleInRecent20Days: data.SaleInRecent20Days !== "" ? parseInt(data.SaleInRecent20Days) : "",
                SaleInRecent30Days: data.SaleInRecent30Days !== "" ? parseInt(data.SaleInRecent30Days) : "",
                SaleInRecent3Months: data.SaleInRecent3Months !== "" ? parseInt(data.SaleInRecent3Months) : "",
                PackageCoefficient: data.PackageCoefficient !== "" ? parseInt(data.PackageCoefficient) : "",
                StuffMinOrder: data.StuffMinOrder !== "" ? parseInt(data.StuffMinOrder) : "",
            };
        });
        setExcelData(tempExcel);
    }, [i18n.language]);
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: "IndexCell",
            filterable: true,
            width: "60px",
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false,
        },
        {
            field: "WareHouse",
            name: "انبار",
            children: [
                {
                    field: "WarehouseCode",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "کد",
                    filter: "numeric",
                    // width: "90px",
                    reorderable: true,
                },
                {
                    field: "WarehouseName",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    // width: "100px",
                    name: "نام",
                    reorderable: true,
                },
            ]
        },
        {
            field: "Product",
            name: "کالا",
            children: [
                {
                    field: "StuffSubGroupName",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    // width: "100px",
                    name: "گروه",
                    reorderable: true,
                },
                {
                    field: "StuffSubGroupName",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    // width: "100px",
                    name: "زیرگروه",
                    reorderable: true,
                },
                {
                    field: "StuffCode",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "کد",
                    filter: "numeric",
                    // width: "90px",
                    reorderable: true,
                },

            ]
        },
        {
            field: "StuffRealStock",
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: "numeric",
            // width: "60px",
            name: "موجودی",
            reorderable: true,
        },
        {
            field: "Reservation",
            name: "رزرو",
            children: [
                {
                    field: "BuyOrderStock",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    filter: "numeric",
                    // width: "100px",
                    name: "خرید",
                    reorderable: true,
                },
                {
                    field: "SaleOrderStock",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    filter: "numeric",
                    // width: "100px",
                    name: "فروش",
                    reorderable: true,
                },
                {
                    field: "BuyReversionStock",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "برگشت از خرید",
                    filter: "numeric",
                    // width: "90px",
                    reorderable: true,
                },
                {
                    field: "SaleReversionStock",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "برگشت از فروش",
                    filter: "numeric",
                    // width: "90px",
                    reorderable: true,
                },

            ]
        },
        {
            field: "MinInWarehouse",
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: "numeric",
            // width: "100px",
            name: "نقطه سفارش",
            reorderable: true,
        },
        {
            field: "NeedToBuy",
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: "numeric",
            // width: "100px",
            name: "مورد نیاز",
            reorderable: true,
        },
        {
            field: "RecentDaysSale",
            name: "فروش روزهای اخیر",
            children: [
                {
                    field: "SaleInRecent10Days",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    filter: "numeric",
                    // width: "100px",
                    name: "10 روزه",
                    reorderable: true,
                },
                {
                    field: "SaleInRecent20Days",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    filter: "numeric",
                    // width: "100px",
                    name: "20 روزه",
                    reorderable: true,
                },
                {
                    field: "SaleInRecent30Days",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "30 روزه",
                    filter: "numeric",
                    // width: "90px",
                    reorderable: true,
                },
                {
                    field: "SaleInRecent3Months",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "3 ماهه",
                    filter: "numeric",
                    // width: "90px",
                    reorderable: true,
                },
            ]
        },
        {
            field: "PackageName",
            // // columnMenu: ColumnMenu,
            // filterable: true,
            name: "واحد",
            // filter: "numeric",
            width: "120px",
            // reorderable: true,
            cell: (props) => {

                return (
                    <td className="Unit_Needs">
                        <SelectBox
                            dataSource={props?.dataItem?.PackageName}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            // valueExpr="Id"
                            className='selectBox'
                            searchEnabled={true}
                            placeholder=''
                            showClearButton
                            noDataText={t("اطلاعات یافت نشد")}
                            displayExpr='name'

                            valueExpr='name'
                            onValueChanged={(e) => {
                                formik.setFieldValue('PackageName', e.value)
                            }}
                        />

                    </td>
                )
            }
        },
        {
            field: "Amount",
            // // columnMenu: ColumnMenu,
            // filterable: true,
            name: "مقدار",
            // filter: "numeric",
            width: "100px",
            // reorderable: true,
            cell: (props) => {

                return (
                    <td className="Amount_Needs">
                        <input
                            className="form-input"
                            type="text"
                            id="Amount"
                            name="Amount"
                            style={{ width: "80px" }}
                            onChange={(e) => formik.setFieldValue(`Amount[${props.dataIndex}]`, { value: e.target.value, id: props?.dataItem?.PackageId })}
                            onBlur={formik.handleBlur}
                            value={formik.values?.Amount[props.dataIndex]?.value}
                        />
                    </td>
                )
            }
        }



    ];




    // function getSavedCharts(list) {
    //     console.log("save charts list to request and save:", list);
    // }

    function getSelectedRows(list) {
        console.log("selected row list to request:", list);
    }

    const callComponent = () => {
        history.navigate(
            `/FinancialTransaction/PaymentDocument/general/issuance`,
            "noopener,noreferrer"
        );
    };

    //////////////////////////////////////////////
    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px",
                }}
            >
                <div className="col-lg-12 col-md-12 col-12">
                    <div className="row  form-design">
                        <div className=" col-lg-4 col-md-6 col-12">
                            <div className="row align-items-center font-weight-bold">
                                <div className=" col-lg-1 col-md-1 col-1">
                                    <div className="title">
                                        <span>‌</span>
                                    </div>
                                    <input
                                        className="form-input"
                                        type="checkBox"
                                        id="Aggregation"
                                        name="Aggregation"
                                        style={{ width: "30px" }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Aggregation}
                                        checked={formik.values.Aggregation}
                                    />
                                </div>
                                <div className=" col-lg-11 col-md-11 col-11" style={{ margin: "0px -15px 18px -15px" }}
                                >
                                    <div className="title">
                                        <span>‌</span>
                                    </div>
                                    {t("تجمیع همه انبارها")}</div>
                            </div>
                        </div>
                        <div className=" col-lg-4 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                            <div className="title">
                                <span>{t("تامین کننده")}</span>
                            </div>
                            <div>
                                <SelectBox
                                    dataSource={Supplier}
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
                                        formik.setFieldValue('Supplier', e.value)
                                    }}
                                />

                                {formik.touched.Supplier && formik.errors.Supplier &&
                                    !formik.values.Supplier ? (
                                    <div className='error-msg'>
                                        {t(formik.errors.Supplier)}
                                    </div>
                                ) : null}

                            </div>
                        </div>
                        <div className=" col-lg-4 col-md-6 col-12  ">

                            <div className="title">
                                <span>{t("تاریخ")}<span className="star">*</span></span>
                            </div>
                            <div className="wrapper date-picker position-relative">
                                <DatePicker
                                    ref={dateRef}
                                    name={"Date"}
                                    id={"Date"}
                                    calendarPosition="bottom-right"
                                    calendar={renderCalendarSwitch(i18n.language)}
                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                    onBlur={formik.handleBlur}
                                    onChange={(val) => {
                                        formik.setFieldValue("Date", julianIntToDate(val.toJulianDay()));
                                    }}
                                    value={date}
                                />
                                <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <CalendarMonthIcon className='calendarButton' />
                                    </div>
                                </div>
                                {formik.touched.Date && formik.errors.Date &&
                                    !formik.values.Date ? (
                                    <div className='error-msg'>
                                        {t(formik.errors.Date)}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 cl-md-12 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                    <RKGrid
                        gridId={"Buy_Needs"}
                        gridData={data}
                        excelData={excelData}
                        columnList={tempColumn}
                        showSetting={true}
                        showChart={false}
                        showExcelExport={true}
                        showPrint={true}
                        // chartDependent={chartObj}
                        rowCount={10}
                        excelFileName={t("نیازمندی های خرید")}
                        // savedChartsList={savedCharts}
                        // getSavedCharts={getSavedCharts}
                        sortable={true}
                        pageable={true}
                        reorderable={true}
                        selectable={false}
                        selectKeyField={"WarehouseId"}
                        getSelectedRows={getSelectedRows}
                        
                    />
                </div>


                <div className="d-flex justify-content-end mt-3">
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        onClick={formik.handleSubmit}
                    >
                        {t("تایید")}
                    </Button>
                </div>
            </div>
        </>
    );
};
export default DisplayDetails;
