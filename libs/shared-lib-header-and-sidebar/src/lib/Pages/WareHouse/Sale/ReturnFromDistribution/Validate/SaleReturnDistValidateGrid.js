import { Autocomplete, Box, Button, IconButton, TextField, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RKGrid, { FooterSome, CurrencyCell,IndexCell} from "rkgrid";
import SaleReturnDistValidateActionCell from "./SaleReturnDistValidateActionCell";
import { ValidateGridDatasource } from "./SaleReturnDistValidateData";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup'
import { AddTableRow, MoveBack, MoveForward } from "../../../../../utils/gridKeyboardNavigation";
import swal from "sweetalert";
import { parsFloatFunction } from "../../../../../utils/parsFloatFunction";
import AddIcon from '@mui/icons-material/Add';
import CurrencyInput from "react-currency-input-field";
import DeleteIcon from '@mui/icons-material/Delete';
import { definedAccountLookupData, descriptiveLookupData } from "./datasources";
import DatePicker from "react-multi-date-picker";
import { julianIntToDate } from "../../../../../utils/dateConvert";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../../utils/calenderLang";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';



const emptyResponsible = { definedAccount: '', descriptive: '', debits: 0, notes: '' };

const SaleReturnDistValidateGrid = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [preInvoiceData, setpreInvoiceData] = useState([])
    const preInvoiceDataRef = useRef()
    preInvoiceDataRef.current = preInvoiceData

    const [reversionsData, setReversionsData] = useState([])
    const reversionsDataRef = useRef()
    reversionsDataRef.current = reversionsData


    const NavigateToMainGrid = () => {
        navigate(`/Warehouse/Sale/ReturnFromDist`, { replace: false });
    }

    useEffect(() => {
        let tempPreInvoiceData = ValidateGridDatasource.map((data) => {
            return data.Data.Orders.map((orderData) => {
                return {
                    ...orderData
                }
            })
        })
        setpreInvoiceData(tempPreInvoiceData)

        let tempReversionsData = ValidateGridDatasource.map((data) => {
            return data.Data.Reversions.map((reversionsData) => {
                return {
                    ...reversionsData
                }
            })
        })
        setReversionsData(tempReversionsData[0])
    }, [i18n.language])

    const CustomOrderCodeCell = (props) => {
        return (
            <td>
                {props.dataItem.OrderCode === -1 ?
                    t("کاملا مرجوعی") :
                    props.dataItem.OrderCode
                }
            </td>
        )
    }

    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${i18n.language == 'en' ? 'border-right-0' : 'border-left-0'}`} colSpan={6} >
                <div className={`d-flex justify-content-start`}>
                    {t("جمع")}
                </div>
            </td>

        );
    };
    const CustomFooterSum = (props) => <FooterSome {...props} data={reversionsDataRef.current} />


    const [totalShortPrice, setTotalShortPrice] = useState(0)
    const totalShortPriceRef = useRef()
    totalShortPriceRef.current = totalShortPrice


    useEffect(() => {
        if (reversionsDataRef.current?.length) {
            let tempTotalShort = reversionsDataRef.current?.reduce(
                (acc, current) => acc + (parseFloat(current.ShortcommingPrice) || 0),
                0
            );
            console.log('tempTotalShort.......', tempTotalShort)
            setTotalShortPrice(tempTotalShort)
        }

    }, [reversionsDataRef.current])

    const CustomFooterSumShortPrice = (props) => {



        return (
            <td className={totalShortPriceRef.current === debitsTotalRef.current ? '' : 'td-red-bg'}>
                {totalShortPriceRef.current.toLocaleString()}
            </td>


        );
    };

    let tempPreInvoiceColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: true
        },
        {
            field: 'OrderPreCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "پیش‌فاکتور",
        },
        {
            field: 'OrderCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "فاکتور",
            cell: CustomOrderCodeCell
        },
        {
            field: 'PartnerCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد طرف حساب",
        },
        {
            field: 'PartnerName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام طرف حساب",
        },
        {
            field: 'PartnerLegalName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام حقوقی",
        },
        {
            field: 'VisitorName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام ویزیتور",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '140px',
            name: "عملیات",
            cell: SaleReturnDistValidateActionCell,
            className: 'text-center',
            reorderable: false
        }
    ]

    let tempRevisionsColumn = [
        {
            field: "IndexCell",
            filterable: false,
            width: "60px",
            name: "ردیف",
            cell: IndexCell,
            footerCell: CustomTotalTitle
        },
        {
            field: "StuffCode",
            className: "text-center",
            name: "کد کالا",
            footerCell: () => <></>
        },
        {
            field: "StuffName",
            className: "text-center",
            name: "نام کالا",
            footerCell: () => <></>
        },
        {
            field: "BatchNumber",
            className: "text-center",
            name: "سری ساخت",
            footerCell: () => <></>
        },
        {
            field: "ExpirationDate",
            className: "text-center",
            name: "تاریخ انقضا",
            footerCell: () => <></>,
        },
        {
            field: "PackageName",
            className: "text-center",
            name: "واحد",
            footerCell: () => <></>
        },
        {
            field: "Quantity",
            className: "text-center",
            name: "تعداد",
            footerCell: CustomFooterSum
        },
        {
            field: "InWarehouse",
            className: "text-center",
            name: "تحویل به انبار",
            footerCell: CustomFooterSum
        },
        {
            field: "Shortcomming",
            className: "text-center",
            name: "کسری",
            footerCell: CustomFooterSum
        },
        {
            field: "ShortcommingPrice",
            className: "text-center",
            name: "مبلغ کسری",
            cell: CurrencyCell,
            footerCell: CustomFooterSumShortPrice


        }
    ]
    const formik = useFormik({
        initialValues: {
            shortResponsible: [emptyResponsible],
            documentDate: "",
            documentDescription: ""
        },
        validationSchema: Yup.object({
            shortResponsible: Yup.array(
                Yup.object({
                    definedAccount: Yup.string().required('حساب معین باید انتخاب گردد'),
                })
            )
        }),
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = values
            ShortSub()
            console.log('All Values:', allValues)
        }
    })

    const ShortSub = () => {
        swal({
            title: t("کسری موزع با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        })
    }
    const tableError = () => {
        swal({
            title: t('خطاهای مشخص شده را برطرف کنید'),
            icon: "error",
            button: t("باشه")
        });
    }

    const dateRef = useRef()

    //////Start of Grid Functions\\\\\\\\\\\
    const [debitsTotal, setDebitsTotal] = useState(0)
    const debitsTotalRef = useRef()
    debitsTotalRef.current = debitsTotal
    const [click, setClick] = useState(false)

    const definedAccountRefs = useRef([]);
    const descriptiveRefs = useRef([]);
    const debitsRefs = useRef([]);
    const notesRefs = useRef([]);

    // const [errorDialogState, setErrorDialogState] = useState(false)

    const [shortResponsibleFocusedRow, setShortResponsibleFocusedRow] = useState(1)
    /* Defined Account AutoComplete */
    const [definedAccountOpen, setDefinedAccountOpen] = useState(false);
    function RenderDefinedAccountOpenState(index, state) {
        if (index === shortResponsibleFocusedRow - 1) {
            setDefinedAccountOpen(state)
        }
        else {
            setDefinedAccountOpen(false)
        }
    }

    /* Descriptive AutoComplete */
    const [descriptiveOpen, setDescriptiveOpen] = React.useState(false);

    function RenderDescriptiveOpenState(index, state) {
        if (index === shortResponsibleFocusedRow - 1) {
            setDescriptiveOpen(state)
        }
        else {
            setDescriptiveOpen(false)
        }
    }

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }

    }, [formik.errors.shortResponsible])


    function AddShortResponsibleRow() {
        formik.setFieldValue('shortResponsible', [...formik.values.shortResponsible, emptyResponsible])
    }

    function keyDownHandler(e, index, currentElm, nextElm, previousElm) {
        // console.log('previousElement', previousElm.current[index])
        // console.log('currentElement', currentElm.current[index])
        // console.log('nextElement', nextElm.current[index])

        if (e.keyCode === 40 && definedAccountOpen === false && descriptiveOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (index === formik.values.shortResponsible.length - 1) {
                AddTableRow(AddShortResponsibleRow, currentElm, index)
            } else {
                currentElm.current[index + 1].focus()
                currentElm.current[index + 1].select()
            }
        }
        if (e.keyCode === 38 && definedAccountOpen === false && descriptiveOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            currentElm.current[index - 1].focus()
            currentElm.current[index - 1].select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            e.preventDefault()
            i18n.dir() === "rtl" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.shortResponsible, AddShortResponsibleRow, currentElm, nextElm, index, 4)

        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            e.preventDefault()
            i18n.dir() === "ltr" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.shortResponsible, AddShortResponsibleRow, currentElm, nextElm, index, 4)
        }
        if (e.keyCode === 13 && definedAccountOpen === false && descriptiveOpen === false) { /* Enter */   /* MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            MoveForward(formik.values.shortResponsible, AddShortResponsibleRow, currentElm, nextElm, index, 4)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            nextElm.current[index].focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveForward(formik.values.shortResponsible, AddShortResponsibleRow, currentElm, nextElm, index, 4)
            }
            else {
                MoveBack(currentElm, previousElm, index)
            }
        }
    }

    function HandleDebitsChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`shortResponsible[${index}].debits`, parsFloatFunction(temp, 2))
    }

    function CalculateDebitsTotal() {
        let debitsTemp = 0
        formik.values.shortResponsible.forEach(element => {
            debitsTemp += element.debits
            setDebitsTotal(parsFloatFunction(debitsTemp, 2))
        });
    }

    function RenderDebitsTotalClassName() {
        if (totalShortPriceRef.current === debitsTotalRef.current) {
            return ""
        }
        else {
            return "td-red-bg"
        }
    }

    //Grid end

    return (
        <>
            <div
                className='form-template' style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    borderColor: `${theme.palette.divider}`
                }}
            >
                <div className="form-design">
                    <div className="row">
                        <div className="content col-lg-6 col-md-6 col-xs-12">
                            <div className='title'>
                                <span> {t("شماره سرجمع")} : {ValidateGridDatasource[0]?.Data.TotalCode} </span>
                            </div>
                        </div>
                        <div className="content col-lg-6 col-md-6 col-xs-12">
                            <div className='title'>
                                <span> {t("تاریخ")} : {ValidateGridDatasource[0]?.Data.TotalDate} </span>
                            </div>
                        </div>
                        <div className="content col-lg-4 col-md-6 col-xs-12">
                            <div className='title'>
                                <span> {t("موزع")} : {ValidateGridDatasource[0]?.Data.PayeeName} </span>
                            </div>
                        </div>
                        <div className="content col-lg-4 col-md-6 col-xs-12">
                            <div className='title'>
                                <span> {t("موزع دوم")} : {ValidateGridDatasource[0]?.Data.PayeeName2} </span>
                            </div>
                        </div>
                        <div className="content col-lg-4 col-md-6 col-xs-12">
                            <div className='title'>
                                <span> {t("راننده")} : {ValidateGridDatasource[0]?.Data.DriverName} </span>
                            </div>
                        </div>
                        <div className="content col-12">
                            <div className='title mb-0'>
                                <span className='span'> {t("پیش‌فاکتورها")} :</span>
                            </div>
                            <RKGrid
                                gridId={'SaleReturnFromDistributionValidate'}
                                gridData={preInvoiceData[0]}
                                // excelData={excelData}
                                columnList={tempPreInvoiceColumn}

                                showSetting={false}
                                showChart={false}
                                showExcelExport={false}
                                showPrint={false}

                                // excelFileName={t('بازگشت از توزیع')}
                                // chartDependent={chartObj}
                                // rowCount={10}
                                // savedChartsList={savedCharts}
                                // getSavedCharts={getSavedCharts}
                                sortable={true}
                                pageable={false}
                                reorderable={false}
                                selectable={false}
                            // selectionMode={'multiple'}  //single , multiple
                            // selectKeyField={'TotalId'}
                            // getSelectedRows={getSelectedRows}
                            // 
                            />
                        </div>
                        <div className="content col-12">
                            <div className='title'>
                                <span className='span'> {t("اقلام مرجوعی")} :</span>
                            </div>
                            <RKGrid
                                gridId={'SaleReturnFromDistributionValidate2'}
                                gridData={reversionsData}
                                // excelData={excelData}
                                columnList={tempRevisionsColumn}

                                showSetting={false}
                                showChart={false}
                                showExcelExport={false}
                                showPrint={false}

                                // excelFileName={t('حواله‌های انبار')}
                                //   chartDependent={chartObj}
                                // rowCount={10}
                                //   savedChartsList={savedCharts}
                                //   getSavedCharts={getSavedCharts}
                                sortable={true}
                                pageable={false}
                                reorderable={false}
                                selectable={false}
                            // selectionMode={'multiple'}  //single , multiple
                            // selectKeyField={'DocumentId'}
                            // getSelectedRows={getSelectedRows}
                            // 

                            />
                        </div>
                        <div className="content col-12">
                            <FormikProvider value={formik}>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className='form-design'>
                                        <div className='row align-items-center'>
                                            <div className='content col-lg-6 col-6'>
                                                <div className='title mb-0'>
                                                    <span className='span'> {t("بررسی مسئول کسری")} :</span>
                                                </div>
                                            </div>
                                            <div className='content col-lg-6 col-6'>
                                                {/* Copyright Ghafourian© Grid V2.1
                                All rights reserved */}
                                                <div className='d-flex justify-content-end'>
                                                    <Button
                                                        variant="outlined"
                                                        className="grid-add-btn"
                                                        onClick={() => {
                                                            AddShortResponsibleRow()
                                                            setTimeout(() => {
                                                                definedAccountRefs.current[formik.values.shortResponsible.length].focus()
                                                            }, 1);
                                                        }}

                                                    >
                                                        <AddIcon />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className='content col-lg-12 col-12'>
                                                <div className={`table-responsive gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>

                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr className='text-center'>
                                                                <th >{t("ردیف")}</th>
                                                                <th >{t("حساب معین")}</th>
                                                                <th>{t("تفضیلی")}</th>
                                                                <th>{t("بدهکار")}</th>
                                                                <th>{t("توضیحات")}</th>
                                                                <th>{t("حذف")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <FieldArray
                                                                name="shortResponsible"
                                                                render={({ push, remove }) => (
                                                                    <React.Fragment>
                                                                        {formik?.values?.shortResponsible?.map((shortResponsible, index) => (
                                                                            <tr key={index} onFocus={(e) => setShortResponsibleFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                className={shortResponsibleFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                            >
                                                                                <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                    {index + 1}
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete
                                                                                            ref={(el) => {
                                                                                                definedAccountRefs.current[index] = el?.querySelector('input')
                                                                                            }
                                                                                            }
                                                                                            componentsProps={{
                                                                                                paper: {
                                                                                                    sx: {
                                                                                                        width: 300,
                                                                                                        maxWidth: '90vw',
                                                                                                        direction: i18n.dir(),
                                                                                                        position: "absolute",
                                                                                                        fontSize: '12px',
                                                                                                        right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                            sx={
                                                                                                {
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "relative",
                                                                                                    background: '#e9ecefd2',
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: '12px'
                                                                                                }
                                                                                            }

                                                                                            size="small"
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.Code}-{option.FormersNames}
                                                                                                </Box>
                                                                                            )}
                                                                                            filterOptions={(options, state) => {
                                                                                                let newOptions = [];
                                                                                                options.forEach((element) => {
                                                                                                    if (
                                                                                                        element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.FormersNames.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                    )
                                                                                                        newOptions.push(element);
                                                                                                });
                                                                                                return newOptions;
                                                                                            }}
                                                                                            isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                            disableClearable={true}
                                                                                            forcePopupIcon={false}
                                                                                            id="definedAccount"
                                                                                            name={`shortResponsible.${index}.definedAccount`}
                                                                                            open={shortResponsibleFocusedRow === index + 1 ? definedAccountOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            options={definedAccountLookupData}
                                                                                            getOptionLabel={option => option.FormersNames}                                                            //          style={{ width: 300 }}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderDefinedAccountOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderDefinedAccountOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderDefinedAccountOpenState(index, false)

                                                                                                formik.setFieldValue(`shortResponsible[${index}].definedAccount`, value.Code)

                                                                                                setTimeout(() => {
                                                                                                    if (value !== "") {
                                                                                                        descriptiveRefs.current[index].focus()
                                                                                                    }
                                                                                                    else {
                                                                                                        debitsRefs.current[index].focus()
                                                                                                    }
                                                                                                }, 1);
                                                                                            }}
                                                                                            onBlur={(e) => {
                                                                                                RenderDefinedAccountOpenState(index, false)
                                                                                            }}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && definedAccountOpen === false) {    /* Enter */
                                                                                                    e.preventDefault()
                                                                                                    RenderDefinedAccountOpenState(index, false)
                                                                                                }
                                                                                                if (formik.values.shortResponsible[index].definedAccount !== "") {
                                                                                                    keyDownHandler(e, index, definedAccountRefs, descriptiveRefs, notesRefs)
                                                                                                }
                                                                                                else {
                                                                                                    keyDownHandler(e, index, definedAccountRefs, debitsRefs, notesRefs)
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }} >
                                                                                    <div className={`table-autocomplete `}>
                                                                                        <Autocomplete

                                                                                            ref={(el) => {
                                                                                                descriptiveRefs.current[index] = el?.firstChild.firstChild.firstChild
                                                                                            }
                                                                                            }
                                                                                            renderOption={(props, option) => (
                                                                                                <Box component="li" {...props}>
                                                                                                    {option.Code}-({option.Name})
                                                                                                </Box>
                                                                                            )}
                                                                                            disabled={formik.values.shortResponsible[index].definedAccount === ""}
                                                                                            filterOptions={(options, state) => {
                                                                                                let newOptions = [];
                                                                                                options.forEach((element) => {
                                                                                                    if (
                                                                                                        element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                        element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                                                                    )
                                                                                                        newOptions.push(element);
                                                                                                });
                                                                                                return newOptions;
                                                                                            }}
                                                                                            componentsProps={{
                                                                                                paper: {
                                                                                                    sx: {
                                                                                                        width: 300,
                                                                                                        direction: i18n.dir(),
                                                                                                        position: "absolute",
                                                                                                        fontSize: '12px',
                                                                                                        right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                            sx={
                                                                                                {
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "relative",
                                                                                                    background: formik.values.shortResponsible[index].definedAccount !== "" ? "#e9ecefd2" : "white",
                                                                                                    borderRadius: 0,
                                                                                                    fontSize: '12px'
                                                                                                }

                                                                                            }

                                                                                            size="small"
                                                                                            disableClearable={true}
                                                                                            forcePopupIcon={false}
                                                                                            id="descriptive"
                                                                                            name={`shortRepsonsible.${index}.descriptive`}
                                                                                            open={shortResponsibleFocusedRow === index + 1 ? descriptiveOpen : false}
                                                                                            noOptionsText={t("اطلاعات یافت نشد")}
                                                                                            options={descriptiveLookupData}
                                                                                            getOptionLabel={option => option.Name}                                                            //          style={{ width: 300 }}
                                                                                            onInputChange={(event, value) => {
                                                                                                if (value !== "" && event !== null) {
                                                                                                    RenderDescriptiveOpenState(index, true)
                                                                                                }
                                                                                                else {
                                                                                                    RenderDescriptiveOpenState(index, false)
                                                                                                }
                                                                                            }}
                                                                                            onChange={(event, value) => {
                                                                                                RenderDescriptiveOpenState(index, false)
                                                                                                formik.setFieldValue(`documentArticles[${index}].descriptive`, value.Code)
                                                                                            }}
                                                                                            onBlur={(e) => RenderDescriptiveOpenState(index, false)}
                                                                                            renderInput={params => (
                                                                                                <TextField {...params} label="" variant="outlined" />
                                                                                            )}
                                                                                            onKeyDown={(e) => {
                                                                                                if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && descriptiveOpen === false) {
                                                                                                    e.preventDefault()
                                                                                                    RenderDescriptiveOpenState(index, false)
                                                                                                }
                                                                                                keyDownHandler(e, index, descriptiveRefs, debitsRefs, definedAccountRefs)
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '120px', minWidth: '90px' }}>
                                                                                    <CurrencyInput
                                                                                        ref={el => (debitsRefs.current[index] = el)}
                                                                                        onKeyDown={(e) => {
                                                                                            if (formik.values.shortResponsible[index].definedAccount !== "") {
                                                                                                keyDownHandler(e, index, debitsRefs, notesRefs, descriptiveRefs)
                                                                                            }
                                                                                            else {
                                                                                                keyDownHandler(e, index, debitsRefs, notesRefs, definedAccountRefs)
                                                                                            }
                                                                                        }
                                                                                        }
                                                                                        className={`form-input `}
                                                                                        style={{ width: "100%" }}
                                                                                        id="debits"
                                                                                        name={`shortResponsible.${index}.debits`}
                                                                                        value={formik.values.shortResponsible[index].debits}
                                                                                        decimalsLimit={2}
                                                                                        onChange={(e) => HandleDebitsChange(index, e.target.value)}
                                                                                        onBlur={() => CalculateDebitsTotal()}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ minWidth: '120px' }}>
                                                                                    <input
                                                                                        ref={el => (notesRefs.current[index] = el)}
                                                                                        className="form-input"
                                                                                        onKeyDown={(e) => keyDownHandler(e, index, notesRefs, definedAccountRefs, debitsRefs)}
                                                                                        name={`shortResponsible.${index}.notes`}
                                                                                        placeholder='---'
                                                                                        type='text'
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        value={formik.values.shortResponsible[index].notes}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                </td>
                                                                                <td style={{ width: '40px' }}>
                                                                                    <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {
                                                                                        setDebitsTotal(debitsTotal - formik.values.shortResponsible[index].debits)
                                                                                        remove(index)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton >
                                                                                </td>

                                                                            </tr>
                                                                        ))}


                                                                    </React.Fragment>

                                                                )}>
                                                            </FieldArray>
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td>{t("جمع")}:</td>
                                                                <td></td>
                                                                <td />
                                                                <td className={RenderDebitsTotalClassName()}>
                                                                    <CurrencyInput
                                                                        className="form-input"
                                                                        style={{ width: "100%" }}
                                                                        id="debitsTotal"
                                                                        disabled
                                                                        value={debitsTotal}
                                                                        name={`shortResponsible.debitsTotal`}
                                                                        decimalsLimit={2}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>
                                                                <td />
                                                                <td />
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                {formik?.errors?.shortResponsible?.map((error, index) => (
                                                    <p className='error-msg' key={index}>
                                                        {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="row">
                                    <div className="content col-lg-4 col-md-4 col-xs-12">
                                        <div className='title'>
                                            <span> {t("تاریخ سند")} </span>
                                        </div>
                                        <div className='date-picker position-relative'>
                                            <DatePicker
                                                name="documentDate"
                                                id="documentDate"
                                                ref={dateRef}
                                                calendar={renderCalendarSwitch(i18n.language)}
                                                locale={renderCalendarLocaleSwitch(i18n.language)}
                                                calendarPosition="bottom-right"
                                                onBlur={formik.handleBlur}
                                                onChange={val => {
                                                    formik.setFieldValue('documentDate', julianIntToDate(val?.toJulianDay()));
                                                }}
                                            />
                                            <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton' /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-md-6 col-xs-12" onFocus={() => {
                                        dateRef?.current?.closeCalendar()
                                    }}>
                                        <div className='title'>
                                            <span> {t("شرح سند")} </span>
                                        </div>
                                        <div className='wrapper'>
                                            <div>
                                                <textarea
                                                    className='form-input'
                                                    id="documentDescription"
                                                    name="documentDescription"
                                                    style={{ width: "100%", height: "35px" }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.documentDescription}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content col-lg-2 col-md-2 col-xs-12">
                                        <div className='title'>
                                            <span> ‌ </span>
                                        </div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="button"
                                            onClick={() => {
                                                if (formik.errors.shortResponsible) {
                                                    tableError()
                                                } else {
                                                    setClick(true)
                                                }
                                                formik.handleSubmit()
                                            }}
                                        >
                                            {t("بدهکار")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Button variant="contained"
                                        color="error"
                                        style={{ height: "38px", margin: "8px" }}
                                        onClick={NavigateToMainGrid}>
                                        {t("بازگشت")}
                                    </Button>
                                </div>

                            </FormikProvider>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default SaleReturnDistValidateGrid