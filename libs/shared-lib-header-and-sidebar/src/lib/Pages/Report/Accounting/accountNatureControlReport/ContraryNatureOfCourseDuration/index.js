import { Button, CircularProgress, useTheme } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../../utils/calenderLang";
import DateObject from "react-date-object";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DropDownBox, SelectBox, TreeView } from "devextreme-react";
import * as Yup from "yup";
import { useGetAllContraryToNatureArticlesQuery } from "../../../../../features/slices/accountingDocumentArticleSlice";
import { useSelector } from "react-redux";
import { useFetchFiscalYearQuery } from "../../../../../features/slices/FiscalYearSlice";
import { useFetchCodingsQuery } from "../../../../../features/slices/customerChosenCodingSlice";
import { CreateQueryString } from "../../../../../utils/createQueryString";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";


const codingNatureList = [
    { Name: 'مانده بدهکار', Code: 1 },
    { Name: 'مانده بستانکار', Code: 2 }
]

const ContraryToNatureArticlesGrid = () => {
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
    const [contraryArticleSearchParam, setContraryArticleSearchParam] = useState("")
    const { data: contraryArticles = { data: [] }, isFetching: contraryArticlesIsFetching, error: contraryArticlesError, currentData: contraryArticlesCurrentData } = useGetAllContraryToNatureArticlesQuery({ pagination: pagination, query: contraryArticleSearchParam },
        {
            skip: fiscalYear === 0 || Object.keys(pagination).length === 0
        });

    const { data: allCodings = [], isFetching: codingIsFetching, error: codingError } = useFetchCodingsQuery();

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
            MoeinAccountId: [],
        },
        validationSchema: Yup.object({
            FromFiscalYear: Yup.string().required("از دوره مالی الزامی است"),
            UntilFiscalYear: Yup.string().required("تا دوره مالی الزامی است"),
            ContraryCodingNature: Yup.string().required("مانده خلاف ماهیت الزامی است"),
            TotalCodingNature: Yup.string().required("نوع حساب الزامی است"),
            MoeinAccountId: Yup.array().min(1, "مشخص کردن حداقل یک حساب معین الزامی است"),
        }),
        onSubmit: (values) => {
            setContraryArticleSearchParam(CreateQueryString(values))
            console.log("All Values:", values);
        },
    });

    const dateRef = useRef()
    const [codingDatasource, setCodingDatasource] = useState([]);
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                            Handling Moein Search                           */
    /* -------------------------------------------------------------------------- */

    /* --------------------------- DropDown Component --------------------------- */

    /* --------------------------- Treeview Component --------------------------- */
    const treeViewRef = useRef()

    const [expandedNode, setExpandedNode] = useState([]);
    const [expandedNodeStatus, setExpandedNodeStatus] = useState([]);
    useEffect(() => {
        let expTemp = codingDatasource.map((item) => ({
            codingId: item.codingId,
            expanded: item?.expanded || false
        }))
        setExpandedNodeStatus(expTemp)

    }, [expandedNode])


    const [codingContent, setCodingContent] = useState("")
    useEffect(() => {
        if (codingIsFetching) {
            setCodingContent(<CircularProgress />)
        }
        else if (codingError) {
            setCodingContent(t("خطایی رخ داده است"))
        }
        else {
            setCodingContent("")
            let displayNames = allCodings.map((item) => {
                if (item.completeCode !== "") {
                    return {
                        ...item,
                        displayName: item.completeCode + " - " + item.name
                    }
                }
                else {
                    return {
                        ...item,
                        displayName: item.name
                    }
                }
            })
            let temp = displayNames.map((item) => {
                let t = expandedNodeStatus.filter(f => f.codingId === item.codingId)[0]
                if (item.codingParentId == 0) {
                    return {
                        ...item,
                        expanded: true
                    }
                }
                else {
                    return {
                        ...item,
                        expanded: t?.expanded || false
                    }
                }
            })
            setCodingDatasource(temp)
        }
    }, [codingIsFetching])

    function syncTreeViewSelection(e) {
        const treeView = (e.component.selectItem && e.component)
            || (treeViewRef && treeViewRef.instance);

        if (treeView) {
            if (e.value === null) {
                treeView.unselectAll();
            } else {
                const values = e.value || formik.values.MoeinAccountId;
                values && values.forEach((value) => {
                    treeView.selectItem(value);
                });
            }
        }

        if (e.value !== undefined) {
            formik.setFieldValue("MoeinAccountId", e.value)
        }
    }

    function treeViewRender() {
        return (
            <TreeView dataSource={codingDatasource}
                ref={treeViewRef}
                dataStructure="plain"
                keyExpr="codingId"
                parentIdExpr="codingParentId"
                selectionMode="multiple"
                showCheckBoxesMode="normal"
                selectNodesRecursive={true}
                displayExpr="displayName"
                selectByClick={true}
                onContentReady={syncTreeViewSelection}
                onItemSelectionChanged={treeViewItemSelectionChanged}

                className={theme.palette.mode === "dark" && "dark-tree"}
                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                onItemExpanded={(e) => setExpandedNode(e.node)}
                width={'100%'}
            />
        );
    }

    function treeViewItemSelectionChanged(e) {
        formik.setFieldValue("MoeinAccountId", e.component.getSelectedNodeKeys())
    }
    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Grid ---------------------------------- */
    const [data, setData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!contraryArticlesIsFetching && !contraryArticlesError) {
            if (!!contraryArticles?.header) {
                let pagination = JSON.parse(contraryArticles?.header)
                setTotal(pagination.totalCount);
            }

            setData(contraryArticles.data)

            let tempExcel = contraryArticles.data.map((data, index) => {
                return {
                    ...data,
                    IndexCell: index + 1,
                }
            })
            setExcelData(tempExcel)
        }


    }, [contraryArticlesIsFetching, contraryArticlesCurrentData])

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
            field: 'documentNumber',
            filterable: true,
            name: "شماره سند",
            filter: 'numeric'
        },
        {
            field: 'moeinCompleteCode',
            filterable: true,
            name: "کد معین",
            filter: 'numeric',
        },
        {
            field: 'moeinName',
            filterable: true,
            name: "عنوان معین",
        },
        {
            field: 'detailed4Name',
            filterable: true,
            name: "تفضیلی 4",
            // filter: 'numeric',
        },
        {
            field: 'detailed5Name',
            filterable: true,
            name: "تفضیلی 5",
            // filter: 'numeric',
        },
        {
            field: 'detailed6Name',
            filterable: true,
            name: "تفضیلی 6",
            // filter: 'numeric',
        },
        {
            field: 'Remain',
            name: "مانده",
            children: [
                {
                    field: 'debits',
                    filterable: true,
                    name: "بدهکار",
                    filter: 'numeric',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'credits',
                    filterable: true,
                    name: "بستانکار",
                    filter: 'numeric',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
            ]
        },

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
                            <div className="content col-xl-6 col-lg-6 col-md-8 col-sm-6 col-12" onFocus={() => {
                                dateRef?.current?.closeCalendar();
                            }}>
                                <div className="title">
                                    <span> {t("معین")} <span className='star'>*</span> </span>
                                </div>
                                <div className='wrapper'>
                                    <DropDownBox
                                        value={formik.values.MoeinAccountId}
                                        valueExpr="codingId"
                                        displayExpr="name"
                                        placeholder=""
                                        showClearButton={true}
                                        dataSource={codingDatasource}
                                        onValueChanged={syncTreeViewSelection}
                                        contentRender={treeViewRender}
                                        className="selectBox"
                                    />
                                    {formik.touched.MoeinAccountId && formik.errors.MoeinAccountId && !formik.values.MoeinAccountId ? (<div className='error-msg'>{t(formik.errors.MoeinAccountId)}</div>) : null}
                                </div>
                            </div>
                            <div className="content col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 d-flex d-sm-block justify-content-center" >
                                <div className="title d-none d-sm-block">
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
                    gridId={"Articles_Contrary_To_Nature"}
                    gridData={data}
                    excelData={excelData}
                    excelFileName={t('خلاف ماهیت طی دوره')}
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
                    loading={contraryArticlesIsFetching}
                />

            </div>

        </>
    );
};

export default ContraryToNatureArticlesGrid;
