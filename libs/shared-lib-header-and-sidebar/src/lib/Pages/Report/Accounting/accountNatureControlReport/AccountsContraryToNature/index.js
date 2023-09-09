import { Button, useTheme } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../../utils/calenderLang";
import DateObject from "react-date-object";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SelectBox } from "devextreme-react";
import * as Yup from "yup";
import { useFetchFiscalYearQuery } from "../../../../../features/slices/FiscalYearSlice";
import { useGetContraryToNatureCodingsQuery } from "../../../../../features/slices/customerChosenCodingSlice";
import { CreateQueryString } from "../../../../../utils/createQueryString";
import { useSelector } from "react-redux";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";


const codingNatureList = [
    { Name: 'مانده بدهکار', Code: 1 },
    { Name: 'مانده بستانکار', Code: 2 }
]

const ContraryToNatureCodingsGrid = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const paginationParams = new URLSearchParams(location?.search);
    const pagination = Object.fromEntries(paginationParams);
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                              RTKQuery / Redux                              */
    /* -------------------------------------------------------------------------- */

    /* --------------------------------- Queries -------------------------------- */
    const { data: fiscalYearList = [], isFetching: fiscalYearListIsFetching, error: fiscalYearListError } = useFetchFiscalYearQuery();

    const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
    const [contraryCodingSearchParam, setContraryCodingSearchParam] = useState("")
    const { data: contraryCodings = {data: []}, isFetching: contraryCodingsIsFetching, error: contraryCodingsError, currentData: contraryCodingCurrentData } = useGetContraryToNatureCodingsQuery({ pagination: pagination, query: contraryCodingSearchParam },
        {
            skip: fiscalYear === 0 || Object.keys(pagination).length === 0
        });

    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            FromFiscalYear: '',
            UntilFiscalYear: '',
            ContraryCodingNature: '',
            TotalCodingNature: '',
            Date: '',
        },
        validationSchema: Yup.object({
            FromFiscalYear: Yup.string().required("از دوره مالی الزامی است"),
            UntilFiscalYear: Yup.string().required("تا دوره مالی الزامی است"),
            ContraryCodingNature: Yup.string().required("مانده خلاف ماهیت الزامی است"),
            TotalCodingNature: Yup.string().required("نوع حساب الزامی است"),
        }),
        onSubmit: (values) => {
            setContraryCodingSearchParam(CreateQueryString(values))
        },
    });

    const dateRef = useRef()
    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Grid ---------------------------------- */

    const [data, setData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!contraryCodingsIsFetching && !contraryCodingsError) {
            if (!!contraryCodings?.header) {
                let pagination = JSON.parse(contraryCodings?.header);
                setTotal(pagination.totalCount);
            }

            let temp = contraryCodings.data.map((data) => {
                return{
                    ...data,
                    status: data.debitsTotal > data.creditsTotal ? t('بدهکار') :
                    data.debitsTotal < data.creditsTotal ? t('بستانکار') : ''
                }
            })
            setData(temp)

            let tempExcel = contraryCodings.data.map((data, index) => {
                return {
                    ...data,
                    IndexCell: index + 1,
                    status: data.debitsTotal > data.creditsTotal ? t('بدهکار') :
                    data.debitsTotal < data.creditsTotal ? t('بستانکار') : ''
                };
            });
            setExcelData(tempExcel);
        }

    }, [contraryCodingsIsFetching, contraryCodingCurrentData])

    const dataRef = useRef()
    dataRef.current = data

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
            reorderable: true
        },
        {
            field: 'completeCode',
            filterable: true,
            name: "کد معین",
            filter: 'numeric',
        },
        {
            field: 'name',
            filterable: true,
            name: "عنوان معین",
        },
        {
            field: 'Remain',
            name: "مانده",
            children: [
                {
                    field: 'debitsTotal',
                    filterable: true,
                    name: "بدهکار",
                    filter: 'numeric',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'creditsTotal',
                    filterable: true,
                    name: "بستانکار",
                    filter: 'numeric',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
            ]
        },
        {
            field: 'status',
            filterable: true,
            name: "ماهیت مانده",
        }
    ]


    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px 0",
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        <div className="row">
                            <div className="content col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
                                <div className="title">
                                    <span> {t("از دوره مالی")} <span className='star'>*</span> </span>
                                </div>
                                <div className='wrapper'>
                                    <div>
                                        <SelectBox
                                            dataSource={fiscalYearList}
                                            rtlEnabled={i18n.dir() === "rtl"}
                                            onValueChanged={(e) => formik.setFieldValue('FromFiscalYear', e.value)}
                                            className='selectBox'
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={'fiscalYearName'}
                                            valueExpr="startDate"
                                            itemRender={null}
                                            placeholder=''
                                            name='FromFiscalYear'
                                            id='FromFiscalYear'
                                            searchEnabled
                                        />
                                    </div>
                                    {formik.touched.FromFiscalYear && formik.errors.FromFiscalYear && !formik.values.FromFiscalYear ? (<div className='error-msg'>{t(formik.errors.FromFiscalYear)}</div>) : null}
                                </div>
                            </div>
                            <div className="content col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
                                <div className="title">
                                    <span> {t("تا دوره مالی")} <span className='star'>*</span> </span>
                                </div>
                                <div className='wrapper'>
                                    <div>
                                        <SelectBox
                                            dataSource={fiscalYearList}
                                            rtlEnabled={i18n.dir() === "rtl"}
                                            onValueChanged={(e) => formik.setFieldValue('UntilFiscalYear', e.value)}
                                            className='selectBox'
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={'fiscalYearName'}
                                            valueExpr="endDate"
                                            itemRender={null}
                                            placeholder=''
                                            name='UntilFiscalYear'
                                            id='UntilFiscalYear'
                                            searchEnabled
                                        />
                                    </div>
                                    {formik.touched.UntilFiscalYear && formik.errors.UntilFiscalYear && !formik.values.UntilFiscalYear ? (<div className='error-msg'>{t(formik.errors.UntilFiscalYear)}</div>) : null}
                                </div>
                            </div>
                            <div className="content col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12" onFocus={() => {
                                dateRef?.current?.closeCalendar();
                            }}>
                                <div className="title">
                                    <span> {t("مانده خلاف ماهیت")} <span className='star'>*</span> </span>
                                </div>
                                <div className='wrapper'>
                                    <div>
                                        <SelectBox
                                            dataSource={codingNatureList}
                                            rtlEnabled={i18n.dir() === "rtl"}
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('ContraryCodingNature', e.value)
                                                formik.setFieldValue('TotalCodingNature', codingNatureList.filter((item) => item.Code != e.value)[0].Code)
                                            }}
                                            className='selectBox'
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={'Name'}
                                            valueExpr="Code"
                                            value={formik.values.ContraryCodingNature}
                                            itemRender={null}
                                            placeholder=''
                                            name='ContraryCodingNature'
                                            id='ContraryCodingNature'
                                            searchEnabled
                                        />
                                    </div>
                                    {formik.touched.ContraryCodingNature && formik.errors.ContraryCodingNature && !formik.values.ContraryCodingNature ? (<div className='error-msg'>{t(formik.errors.ContraryCodingNature)}</div>) : null}
                                </div>
                            </div>
                            <div className="content col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12" onFocus={() => {
                                dateRef?.current?.closeCalendar();
                            }}>
                                <div className="title">
                                    <span> {t("نوع حساب")} <span className='star'>*</span> </span>
                                </div>
                                <div className='wrapper'>
                                    <div>
                                        <SelectBox
                                            dataSource={codingNatureList}
                                            rtlEnabled={i18n.dir() === "rtl"}
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('TotalCodingNature', e.value)
                                                formik.setFieldValue('ContraryCodingNature', codingNatureList.filter((item) => item.Code != e.value)[0].Code)
                                            }}
                                            className='selectBox'
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={'Name'}
                                            valueExpr="Code"
                                            value={formik.values.TotalCodingNature}
                                            itemRender={null}
                                            placeholder=''
                                            name='TotalCodingNature'
                                            id='TotalCodingNature'
                                            searchEnabled
                                        />
                                    </div>
                                    {formik.touched.TotalCodingNature && formik.errors.TotalCodingNature && !formik.values.TotalCodingNature ? (<div className='error-msg'>{t(formik.errors.TotalCodingNature)}</div>) : null}
                                </div>
                            </div>
                            <div className="content col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
                                <div className="title">
                                    <span>{t('تا تاریخ')}</span>
                                </div>
                                <div className='wrapper date-picker position-relative'>
                                    <DatePicker
                                        name={`Date`}
                                        ref={dateRef}
                                        id="Date"
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        calendarPosition="bottom-right"
                                        value={formik.values.Date ? new DateObject(formik.values.Date) : ''}
                                        onChange={(date) => {
                                            formik.setFieldValue(`Date`, date ? julianIntToDate(date.toJulianDay()) : '');
                                        }}
                                    />
                                    <div
                                        className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton' /></div>
                                    </div>
                                    {formik.touched.Date && formik.errors.Date && !formik.values.Date ? (<div className='error-msg'>{t(formik.errors.Date)}</div>) : null}
                                </div>
                            </div>
                            <div className="content col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 d-flex d-lg-block justify-content-center" >
                                <div className="title d-none d-lg-block">
                                    <span>‌</span>
                                </div>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={formik.handleSubmit}
                                >
                                    {t("جستجو")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
                <RKGrid
                    gridId={"Accounts_Contrary_To_Nature"}
                    gridData={data}
                    excelData={excelData}
                    excelFileName={t('حساب های خلاف ماهیت')}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={false}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={false}
                    showFilter={true}
                    total={total}
                    showTooltip={true}
                    loading={contraryCodingsIsFetching}
                />

            </div>

        </>
    );
};

export default ContraryToNatureCodingsGrid;
