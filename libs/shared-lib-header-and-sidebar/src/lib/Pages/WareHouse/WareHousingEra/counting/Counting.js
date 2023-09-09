import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, IconButton, Modal, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup"
import swal from 'sweetalert';
import { parsFloatFunction } from '../../../../utils/parsFloatFunction';
import CurrencyInput from 'react-currency-input-field';
import DateObject from 'react-date-object';
import { useSearchParams } from "react-router-dom";
import { history } from "../../../../utils/history";
import data from './data.json';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BatchModal from '../../../../components/Modals/BatchModal';


export default function Counting() {

    const { t, i18n } = useTranslation()
    const theme = useTheme();
    const [Counting, setCounting] = useState(data)
    const [searchParams] = useSearchParams();
    const [rowData, setRowdata] = useState([]);
    const [priceTotal, setPriceTotal] = useState(0)
    const [click, setClick] = useState(false)
    const dateRef = useRef()
    const [fileList, setFileList] = useState()
    const [uploadError, setUploadError] = useState(false)
    const [initialState, setInitialState] = useState({})
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 4,
        direction: i18n.dir()
    };



    const formik = useFormik({
        initialValues: {
            CountingTable: Counting,

        },

        validationSchema: Yup.object({
            CountingTable: Yup.array(
                Yup.object({
                    CurrentStockPrice: Yup.number().typeError("فقط عدد مجاز است"),
                    CountedStockNumeric: Yup.number().typeError("فقط عدد مجاز است"),

                })
            ),
        }),
        validateOnChange: false,
        onSubmit: (values) => {
            DocumentSub()
            console.log('All Values:', values)
        }
    })


    const DocumentSub = () => {
        swal({
            title: t("سند با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }
    const tableError = () => {
        swal({
            title: t('خطاهای مشخص شده را برطرف کنید'),
            icon: "error",
            button: t("باشه")
        });
    }



    function updateFileList(list) {
        setFileList(list)
    }
    const [date, setDate] = useState(new DateObject())

    useEffect(() => {
        if (rowData.length && formik.values.CountingTable.length == 0) {
            formik.setFieldValue('CountingTable', [{ definedAccount: '', descriptive: "0101001", price: rowData[0]?.Price }])
            setInitialState({ "Code": "00000002", "Name": "وام مضاربه ای بانک سپه" })
        }
    }, [rowData])

    //function renderBalanceClassName() {
    //    if (creditsTotal > debitsTotal) {
    //        return "balanceFieldGreen"
    //    }
    //    else if (creditsTotal < debitsTotal) {
    //        return "balanceFieldRed"
    //    }
    //    else {
    //        return ""
    //    }
    //}
    function HandleBalanceChange(value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue('balance', parsFloatFunction(temp, 2))
    }
    //function renderBalanceState() {
    //    if (creditsTotal > debitsTotal) {
    //        return t("بستانکار")
    //    }
    //    else if (creditsTotal < debitsTotal) {
    //        return t("بدهکار")
    //    }
    //    else {
    //        return ""
    //    }
    //}
    ///////End of Form Functions\\\\\\\\\\\\


    //////Start of Grid Functions\\\\\\\\\\\
    // const definedAccountRefs = useRef([]);
    // const descriptiveRefs = useRef([]);

    const countedStockPriceRefs = useRef([]);
    const stockDescriptionRefs = useRef([]);
    const countedStockNumericRefs = useRef([]);

    const [errorDialogState, setErrorDialogState] = useState(false)

    const [CountingTableFocusedRow, setCountingTableFocusedRow] = useState(1)
    /* Defined Account AutoComplete */
    const [definedAccountOpen, setDefinedAccountOpen] = React.useState([false]);
    const definedAccountOpenRef = useRef();
    definedAccountOpenRef.current = definedAccountOpen
    //  console.log('definedAccountOpenRef.current', definedAccountOpenRef.current)

    function HandleDefinedAccountOpenState(index, state) {
        let temp = definedAccountOpen
        temp[index] = state
        // console.log('index', index)
        // console.log('temp', temp)
        setDefinedAccountOpen([...temp])
    }
    //  console.log('definedAccountOpen', definedAccountOpen)

    /* Descriptive AutoComplete */
    const [descriptiveOpen, setDescriptiveOpen] = React.useState([false]);
    const descriptiveOpenRef = useRef();
    descriptiveOpenRef.current = descriptiveOpen

    function HandleDescriptiveOpenState(index, state) {
        let temp = descriptiveOpen
        temp[index] = state
        setDescriptiveOpen([...temp])
    }

    useEffect(() => {
        if (click) {
            tableError()
            setClick(false)
        }

    }, [formik.errors.CountingTable])

    const [batchModalOpen, setBatchModalOpen] = useState(false)

    function MoveForwardLocal(currentElement, nextElement, index, lastFocusableCellIndex) {
        if (currentElement.current[index].closest("td").cellIndex === lastFocusableCellIndex) {

            nextElement.current[index + 1].focus()
            nextElement.current[index + 1].select()

        }
        else {
            nextElement.current[index].focus()
            nextElement.current[index].select()
        }
    }
    function MoveBackLocal(currentElement, previousElement, index) {
        if (currentElement.current[index].closest("td").cellIndex === 7 && index !== 0) {
            previousElement.current[index - 1].focus()
            previousElement.current[index - 1].select()
        }
        else {
            previousElement.current[index].focus()
            previousElement.current[index].select()
        }
    }
    // function addCountingTableRow() {
    //     formik.setFieldValue('CountingTable', [...formik.values.CountingTable, emptyArticles])
    //     setDefinedAccountOpen([...definedAccountOpen, false])
    //     setDescriptiveOpen([...descriptiveOpen, false])
    // }

    function keyDownHandler(e, index, currentElm, nextElm, previousElm) {
        // console.log('previousElement', previousElm.current[index])
        // console.log('currentElement', currentElm.current[index])
        // console.log('nextElement', nextElm.current[index])

        if (e.keyCode === 40) { /* Down Arrowkey */
            e.preventDefault()

            currentElm.current[index + 1].focus()
            currentElm.current[index + 1].select()

        }
        if (e.keyCode === 38) { /* Up ArrowKey */
            e.preventDefault()
            currentElm.current[index - 1].focus()
            currentElm.current[index - 1].select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            e.preventDefault()
            i18n.dir() === "rtl" ? MoveBackLocal(currentElm, previousElm, index) : MoveForwardLocal(currentElm, nextElm, index, 11)

        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            e.preventDefault()
            i18n.dir() === "ltr" ? MoveBackLocal(currentElm, previousElm, index) : MoveForwardLocal(currentElm, nextElm, index, 11)
        }
        if (e.keyCode === 13) { /* Enter */   /* MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            MoveForwardLocal(currentElm, nextElm, index, 11)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            nextElm.current[index].focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveForwardLocal(currentElm, nextElm, index, 11)
            }
            else {
                MoveBackLocal(currentElm, previousElm, index)
            }
        }
    }

    function HandlePriceChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`CountingTable[${index}].CountedStockPrice`, parsFloatFunction(temp, 2))
    }
    function HandleNumberChange(index, value) {

        formik.setFieldValue(`CountingTable[${index}].CountedStockNumeric`, value)
    }


    useEffect(() => {

        let priceTemp = 0
        formik.values.CountingTable.forEach(element => {
            priceTemp += element.price
            setPriceTotal(parsFloatFunction(priceTemp, 2))
        });


    }, [formik.values.CountingTable])

    useEffect(() => {
        formik.setFieldValue("balance", priceTotal)
    }, [priceTotal])

    // useEffect(() => {
    //     if (formik.errors.CountingTable)
    //         setErrorDialogState(true)
    // }, [formik.errors])

    //Grid End
    const getBatchModalData = (val) => {
        console.log("Send a request and make batch with these datas:", val)
    }

    function selectItem(e) {
        if (!e.itemData.hasOwnProperty('items')) {
            console.log("itemData", e.itemData)

            //   console.log("CountingTableFocusedRow",CountingTableFocusedRow)
            stockDescriptionRefs.current[CountingTableFocusedRow - 1].focus()
            // console.log(definedAccountOpen)
            formik.setFieldValue(`CountingTable[${CountingTableFocusedRow - 1}].CountedStockNumeric`, e.itemData.CountedStockNumeric)

        }
    }


    console.log("CountingTable", formik.values.CountingTable)


    return (
        <>
            <div
                className='form-template' style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    borderColor: `${theme.palette.divider}`
                }}
            >
                <div>
                    <div className='row'>

                        <div className='col-12 '>
                            <FormikProvider value={formik}>
                                <form onSubmit={formik.handleSubmit}>

                                    <div className=' col-12'>
                                        <div className='form-design'>
                                            <div className='row'>
                                                <div className='col-lg-12 col-12'>
                                                    <div className='row align-items-center'>
                                                        <div className='row align-items-center flex-nowrap justify-content-between  '>
                                                            <div className='content col-lg-6 col-6'>
                                                                <div className='title mb-0'>
                                                                    <span className='span'> {t("لیست کالاها")}:</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='content col-lg-12 col-12'>
                                                            <div className={`table-responsive gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>

                                                                <table className="table table-bordered">
                                                                    <thead>
                                                                        <tr className='text-center'>
                                                                            <th >{t("ردیف")}</th>
                                                                            <th >{t("کد کالا")}</th>
                                                                            <th>{t("نام کالا")}</th>
                                                                            <th>{t("سری ساخت")}</th>
                                                                            <th>
                                                                                <AddCircleOutlineIcon color="success" />
                                                                            </th>
                                                                            <th>{t("تاریخ انقضاء")}</th>
                                                                            <th>{t("موجودی سیستمی(تعدادی)")}</th>
                                                                            <th>{t("موجودی سیستمی(ریالی)")}</th>
                                                                            <th>{t("شمارش(تعدادی)")}</th>
                                                                            <th>{t("شمارش(ریالی)")}</th>
                                                                            <th>{t("مغایرت(تعدادی)")}</th>
                                                                            <th>{t("مغایرت(ریالی)")}</th>
                                                                            <th>{t("توضیحات")}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <FieldArray
                                                                            name="CountingTable"
                                                                            render={({ push, remove }) => (
                                                                                <React.Fragment>
                                                                                    {formik?.values?.CountingTable?.map((CountingTable, index) => (
                                                                                        <tr key={index} onFocus={(e) => setCountingTableFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                            className={CountingTableFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                                        >
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {index + 1}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {formik.values.CountingTable[index].StuffCode}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '120px' }}>
                                                                                                {formik.values.CountingTable[index].StuffName}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '70px' }}>
                                                                                                {formik.values.CountingTable[index].BatchNumber}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ width: '5px' }} >
                                                                                                {CountingTableFocusedRow === index + 1 ? <IconButton variant="contained" color="success" className='kendo-action-btn' onClick={() => {
                                                                                                    setBatchModalOpen(true)
                                                                                                }}>
                                                                                                    <AddCircleOutlineIcon />
                                                                                                </IconButton > : ''}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {formik.values.CountingTable[index].ExpirationDate}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {formik.values.CountingTable[index].CurrentStockNumeric}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {formik.values.CountingTable[index].CurrentStockPrice}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                <input
                                                                                                    className='form-input'
                                                                                                    type="number"
                                                                                                    name="CountedStockNumeric"
                                                                                                    ref={el => (countedStockNumericRefs.current[index] = el)}
                                                                                                    onKeyDown={(e) => keyDownHandler(e, index, countedStockNumericRefs, countedStockPriceRefs, stockDescriptionRefs)}
                                                                                                    style={{ width: "100%" }}
                                                                                                    onChange={(e) => { HandleNumberChange(index, e.target.value) }}
                                                                                                    onBlur={formik.handleBlur}
                                                                                                    value={formik.values.CountingTable[index].CountedStockNumeric}

                                                                                                />
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                <CurrencyInput
                                                                                                    ref={el => (countedStockPriceRefs.current[index] = el)}
                                                                                                    onKeyDown={(e) => keyDownHandler(e, index, countedStockPriceRefs, stockDescriptionRefs, countedStockNumericRefs)}
                                                                                                    className={`form-input `}
                                                                                                    style={{ width: "100%" }}
                                                                                                    id="CountedStockPrice"
                                                                                                    name={`CountingTable.${index}.CountedStockPrice`}
                                                                                                    value={formik.values.CountingTable[index].CountedStockPrice}
                                                                                                    decimalsLimit={2}
                                                                                                    onChange={(e) => HandlePriceChange(index, e.target.value)}
                                                                                                    autoComplete="off"
                                                                                                />
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {formik.values.CountingTable[index].ShortcomingStockNumeric}
                                                                                            </td>
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {formik.values.CountingTable[index].ShortcomingStockPrice}
                                                                                            </td>
                                                                                            <td style={{ width: '120px', minWidth: '90px' }}>
                                                                                                <input
                                                                                                    ref={el => (stockDescriptionRefs.current[index] = el)}
                                                                                                    onKeyDown={(e) => keyDownHandler(e, index, stockDescriptionRefs, countedStockNumericRefs, countedStockPriceRefs)}
                                                                                                    className={`form-input `}
                                                                                                    style={{ width: "100%" }}
                                                                                                    id="StockDescription"
                                                                                                    name={`CountingTable.${index}.StockDescription`}
                                                                                                    onChange={formik.handleChange}
                                                                                                    value={formik.values.CountingTable[index].StockDescription}
                                                                                                    autoComplete="off"
                                                                                                />
                                                                                            </td>


                                                                                            {/* <td style={{ width: '40px' }}>
                                                                                                <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {

                                                                                                    setPriceTotal(priceTotal - formik.values.CountingTable[index].price)
                                                                                                    remove(index)



                                                                                                }}>
                                                                                                    <DeleteIcon />
                                                                                                </IconButton >
                                                                                            </td> */}

                                                                                        </tr>
                                                                                    ))}


                                                                                </React.Fragment>

                                                                            )}>
                                                                        </FieldArray>
                                                                    </tbody>

                                                                </table>
                                                            </div>
                                                            {formik?.errors?.CountingTable?.map((error, index) => (
                                                                <p className='error-msg' key={index}>
                                                                    {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null}
                                                                </p>
                                                            ))}
                                                            {formik.errors.balance ? (
                                                                <div className='error-msg'>
                                                                    {t(formik.errors.balance)}
                                                                </div>
                                                            ) : null}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </FormikProvider>
                        </div>
                    </div>
                </div>
            </div >
            <div>
                <div className={`button-pos ${i18n.dir == 'ltr' ? 'ltr' : 'rtl'}`}>
                    <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        onClick={() => {

                            if (formik.errors.CountingTable || formik.errors.balance) {
                                tableError()
                            } else {
                                setClick(true)
                            }


                            formik.handleSubmit()
                        }}
                    >
                        {t("تایید")}
                    </Button>

                    <div className="Issuance">
                        <Button variant="contained" color="error" onClick={() => { history.navigate(`WareHouse/WareHousingEra`); }}>
                            {t("انصراف")}
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                open={batchModalOpen}
                onClose={() => setBatchModalOpen(false)}
            >
                <Box sx={style} style={{ width: '450px' }}>
                    <BatchModal getData={getBatchModalData} closeModal={() => setBatchModalOpen(false)} />
                </Box>
            </Modal>
        </>
    )
}

