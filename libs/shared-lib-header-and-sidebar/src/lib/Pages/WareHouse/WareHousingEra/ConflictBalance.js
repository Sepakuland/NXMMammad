import React, { useEffect, useRef, useState } from 'react'
import { Autocomplete, Box, Button, IconButton, TextField, useTheme } from '@mui/material';
import { definedAccountLookupData, descriptiveLookupData } from '../../FinancialTransaction/PaymentDocumention/Cash/Display/lookupData';
import { useTranslation } from 'react-i18next';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup"
import swal from 'sweetalert';
import CashData from '../../FinancialTransaction/PaymentDocumention/Cash/Display/CashData.json'
import { parsFloatFunction } from '../../../utils/parsFloatFunction';
import CurrencyInput from 'react-currency-input-field';
import DateObject from 'react-date-object';
import { AddTableRow, MoveBack, MoveForward } from '../../../utils/gridKeyboardNavigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams } from "react-router-dom";
import { history } from "../../../utils/history";

const emptyArticles = { definedAccount: '', descriptive: "", price: 0 };

const emptyArticlesTouch = { definedAccount: false, descriptive: false, price: false };

export default function ConflictBalance() {

    const { t, i18n } = useTranslation()

    const theme = useTheme();


    const [searchParams] = useSearchParams();
    const [rowData, setRowdata] = useState([]);

    const id = searchParams.get('id')
    useEffect(() => {
        let SearchRow = CashData.filter((item) => item.DocumentCode == id)
        console.log('SearchRow', SearchRow)
        let tempData = SearchRow.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                Price: cost,
                DocumentCode: parseInt(data.DocumentCode),
                PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
            }
        })
        console.log('tempData', tempData)
        setRowdata(tempData)
        formik.setFieldValue('initialBalance', tempData[0]?.Price)
    }, [])

    const firstArticles = { definedAccount: '', descriptive: rowData?.PartnerName, price: rowData?.Price };

    const [priceTotal, setPriceTotal] = useState(0)
    const [click, setClick] = useState(false)

    const dateRef = useRef()
    const [fileList, setFileList] = useState()
    const [uploadError, setUploadError] = useState(false)
    const [initialState, setInitialState] = useState({})


    console.log('', rowData)

    const formik = useFormik({
        initialValues: {

            documentArticles: [],
            balance: 0,
            initialBalance: 0
        },

        validationSchema: Yup.object({


            initialBalance: Yup.number(),

            documentArticles: Yup.array(
                Yup.object({
                    definedAccount: Yup.string().required('حساب معین باید انتخاب گردد'),
                    price: Yup.number().min(0, "میزان مبلغ باید مثبت باشد"),


                })
            ),
            balance: Yup.number().when("initialBalance", (initialBalance) => {
                if (parseFloat(initialBalance) !== parseFloat(formik.values.balance))
                    return Yup.number().min(initialBalance, "جمع مبلغ موارد وارد شده با کل مبلغ پرداختی یکسان نیست.").max(initialBalance, "جمع مبلغ موارد وارد شده با کل مبلغ پرداختی یکسان نیست.")
            }),

        }),





        validateOnChange: false,
        onSubmit: (values) => {

            DocumentSub()
            console.log('All Values:', values)
        }
    })

    console.log('Formik', formik.errors)
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


    console.log('formik.values', formik.values)
    console.log('formik.errors', formik.errors)


    function updateFileList(list) {
        setFileList(list)
    }
    const [date, setDate] = useState(new DateObject())

    useEffect(() => {
        if (rowData.length && formik.values.documentArticles.length == 0) {
            formik.setFieldValue('documentArticles', [{ definedAccount: '', descriptive: "0101001", price: rowData[0]?.Price }])
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
    const definedAccountRefs = useRef([]);
    const descriptiveRefs = useRef([]);
    const priceRefs = useRef([]);


    const [errorDialogState, setErrorDialogState] = useState(false)

    const [documentArticlesFocusedRow, setDocumentArticlesFocusedRow] = useState(1)
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

    }, [formik.errors.documentArticles])



    const [articlesTouch, setArticlesTouch] = useState([emptyArticlesTouch])

    function addDocumentArticlesRow() {
        formik.setFieldValue('documentArticles', [...formik.values.documentArticles, emptyArticles])
        setDefinedAccountOpen([...definedAccountOpen, false])
        setDescriptiveOpen([...descriptiveOpen, false])
    }

    function keyDownHandler(e, index, currentElm, nextElm, previousElm) {
        // console.log('previousElement', previousElm.current[index])
        // console.log('currentElement', currentElm.current[index])
        // console.log('nextElement', nextElm.current[index])

        if (e.keyCode === 40 && definedAccountOpen[index] === false && descriptiveOpen[index] === false) { /* Down Arrowkey */
            e.preventDefault()
            if (index === formik.values.documentArticles.length - 1) {
                AddTableRow(addDocumentArticlesRow, currentElm, index)
            } else {
                currentElm.current[index + 1].focus()
                currentElm.current[index + 1].select()
            }
        }
        if (e.keyCode === 38 && definedAccountOpen[index] === false && descriptiveOpen[index] === false) { /* Up ArrowKey */
            e.preventDefault()
            currentElm.current[index - 1].focus()
            currentElm.current[index - 1].select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            e.preventDefault()
            i18n.dir() === "rtl" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.documentArticles, addDocumentArticlesRow, currentElm, nextElm, index, 3)

        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            e.preventDefault()
            i18n.dir() === "ltr" ? MoveBack(currentElm, previousElm, index) : MoveForward(formik.values.documentArticles, addDocumentArticlesRow, currentElm, nextElm, index, 3)
        }
        if (e.keyCode === 13 && definedAccountOpen[index] === false && descriptiveOpen[index] === false) { /* Enter */   /* MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            MoveForward(formik.values.documentArticles, addDocumentArticlesRow, currentElm, nextElm, index, 3)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            nextElm.current[index].focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveForward(formik.values.documentArticles, addDocumentArticlesRow, currentElm, nextElm, index, 3)
            }
            else {
                MoveBack(currentElm, previousElm, index)
            }
        }
    }

    function HandlePriceChange(index, value) {
        let temp = value.replaceAll(',', '')
        formik.setFieldValue(`documentArticles[${index}].price`, parsFloatFunction(temp, 2))
    }



    useEffect(() => {

        let priceTemp = 0
        formik.values.documentArticles.forEach(element => {
            priceTemp += element.price
            setPriceTotal(parsFloatFunction(priceTemp, 2))
        });


    }, [formik.values.documentArticles])

    useEffect(() => {
        formik.setFieldValue("balance", priceTotal)
    }, [priceTotal])

    // useEffect(() => {
    //     if (formik.errors.documentArticles)
    //         setErrorDialogState(true)
    // }, [formik.errors])

    //Grid End


    function selectItem(e) {
        if (!e.itemData.hasOwnProperty('items')) {
            console.log("itemData", e.itemData)

            //   console.log("documentArticlesFocusedRow",documentArticlesFocusedRow)
            descriptiveRefs.current[documentArticlesFocusedRow - 1].focus()
            // console.log(definedAccountOpen)
            formik.setFieldValue(`documentArticles[${documentArticlesFocusedRow - 1}].definedAccount`, e.itemData.Code)

        }
    }


    // console.log("definedAccVal", definedAccVal)


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
                                                <div className='col-lg-6 col-6'>
                                                    <div className='title' >
                                                        <span> {t("مغایرت ریالی")} </span>
                                                    </div>
                                                    <div className='wrapper'>
                                                        <div>
                                                            <input
                                                                className='form-input'
                                                                type="text"
                                                                name="totalamount"

                                                                style={{ width: "100%" }}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={rowData[0]?.Price}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-lg-12 col-12'>
                                                    <div className='row align-items-center'>
                                                        <div className='row align-items-center flex-nowrap justify-content-between  '>
                                                            <div className='content col-lg-6 col-6'>
                                                                <div className='title mb-0'>
                                                                    <span className='span'> {t("تراز مغایرت ریالی")}:</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-md-6 col-6 d-flex justify-content-end' style={i18n.dir() === 'rtl' ? { marginLeft: '10px' } : { marginRight: '10px' }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    className="grid-add-btn"
                                                                    onClick={() => {
                                                                        addDocumentArticlesRow()
                                                                        setTimeout(() => {
                                                                            definedAccountRefs.current[formik.values.documentArticles.length].focus()
                                                                        }, 10);
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
                                                                            <th>{t("مبلغ")}</th>
                                                                            <th>{t("حذف")}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <FieldArray
                                                                            name="documentArticles"
                                                                            render={({ push, remove }) => (
                                                                                <React.Fragment>
                                                                                    {formik?.values?.documentArticles?.map((documentArticles, index) => (
                                                                                        <tr key={index} onFocus={(e) => setDocumentArticlesFocusedRow(e.target.closest("tr").rowIndex)}
                                                                                            className={documentArticlesFocusedRow === index + 1 ? 'focus-row-bg' : ''}
                                                                                        >
                                                                                            <td className='text-center' style={{ verticalAlign: 'middle', width: '40px' }}>
                                                                                                {index + 1}
                                                                                            </td>
                                                                                            <td style={{ minWidth: '120px' }}>
                                                                                                {/*<div className={`table-autocomplete ${formik?.errors?.documentArticles?.length&&formik?.errors?.documentArticles[index]?.definedAccount?'red-border':''}`}>*/}
                                                                                                <div className={`table-autocomplete `}>
                                                                                                    <Autocomplete

                                                                                                        ref={(el) => {
                                                                                                            definedAccountRefs.current[index] = el?.firstChild.firstChild.firstChild
                                                                                                        }
                                                                                                        }
                                                                                                        componentsProps={{
                                                                                                            paper: {
                                                                                                                sx: {
                                                                                                                    width: 300,
                                                                                                                    direction: i18n.dir(),
                                                                                                                    position: "absolute",
                                                                                                                    fontSize: '12px',
                                                                                                                    right: "0"
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
                                                                                                        isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                                                                        disableClearable={true}
                                                                                                        forcePopupIcon={false}
                                                                                                        id="definedAccount"
                                                                                                        name={`documentArticles.${index}.definedAccount`}
                                                                                                        open={definedAccountOpenRef.current[index]}
                                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                        options={definedAccountLookupData}


                                                                                                        getOptionLabel={option => option.FormersNames}
                                                                                                        renderOption={(props, option) => (
                                                                                                            <Box component="li" {...props}>
                                                                                                                {option.Code}-({option.FormersNames})
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


                                                                                                        //          style={{ width: 300 }}
                                                                                                        onInputChange={(event, value) => {
                                                                                                            if (value !== "" && event !== null) {
                                                                                                                HandleDefinedAccountOpenState(index, true)
                                                                                                            }
                                                                                                            else {
                                                                                                                HandleDefinedAccountOpenState(index, false)
                                                                                                            }
                                                                                                        }}
                                                                                                        onChange={(event, value) => {

                                                                                                            HandleDefinedAccountOpenState(index, false)

                                                                                                            formik.setFieldValue(`documentArticles[${index}].definedAccount`, value.Code)
                                                                                                        }}
                                                                                                        onBlur={(e) => {
                                                                                                            HandleDefinedAccountOpenState(index, false)
                                                                                                        }}
                                                                                                        onSubmit={(e) => console.log(e)}
                                                                                                        renderInput={params => (
                                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                                        )}
                                                                                                        onKeyDown={(e) => {
                                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && definedAccountOpen[index] === false) {    /* Enter */
                                                                                                                e.preventDefault()
                                                                                                                HandleDefinedAccountOpenState(index, false)
                                                                                                            }
                                                                                                            keyDownHandler(e, index, definedAccountRefs, descriptiveRefs, priceRefs)
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ minWidth: '120px' }} >
                                                                                                <div className={`table-autocomplete `}>
                                                                                                    <Autocomplete
                                                                                                        defaultValue={index == 0 ? initialState : { Code: "", Name: "" }}
                                                                                                        ref={(el) => {
                                                                                                            descriptiveRefs.current[index] = el?.firstChild.firstChild.firstChild
                                                                                                        }
                                                                                                        }

                                                                                                        componentsProps={{
                                                                                                            paper: {
                                                                                                                sx: {
                                                                                                                    width: 300,
                                                                                                                    direction: i18n.dir(),
                                                                                                                    position: "absolute",
                                                                                                                    fontSize: '12px',
                                                                                                                    right: "0"
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
                                                                                                        disableClearable={true}
                                                                                                        forcePopupIcon={false}
                                                                                                        id="descriptive"
                                                                                                        name={`documentArticles.${index}.descriptive`}
                                                                                                        open={descriptiveOpenRef.current[index]}
                                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                                        options={descriptiveLookupData}
                                                                                                        getOptionLabel={option => option.Name}
                                                                                                        renderOption={(props, option) => (
                                                                                                            <Box component="li" {...props}>
                                                                                                                {option.Code}-({option.Name})
                                                                                                            </Box>
                                                                                                        )}
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




                                                                                                        //        style={{ width: 300 }}
                                                                                                        onInputChange={(event, value) => {
                                                                                                            if (value !== "" && event !== null) {
                                                                                                                HandleDescriptiveOpenState(index, true)
                                                                                                            }
                                                                                                            else {
                                                                                                                HandleDescriptiveOpenState(index, false)
                                                                                                            }
                                                                                                        }}
                                                                                                        onChange={(event, value) => {
                                                                                                            HandleDescriptiveOpenState(index, false)
                                                                                                            formik.setFieldValue(`documentArticles[${index}].descriptive`, value.Code)
                                                                                                        }}
                                                                                                        onBlur={(e) => HandleDescriptiveOpenState(index, false)}
                                                                                                        renderInput={params => (
                                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                                        )}
                                                                                                        onKeyDown={(e) => {
                                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && descriptiveOpen[index] === false) {    /* Enter */
                                                                                                                e.preventDefault()
                                                                                                                HandleDescriptiveOpenState(index, false)
                                                                                                            }
                                                                                                            keyDownHandler(e, index, descriptiveRefs, priceRefs, definedAccountRefs)
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: '120px', minWidth: '90px' }}>
                                                                                                <CurrencyInput
                                                                                                    ref={el => (priceRefs.current[index] = el)}
                                                                                                    onKeyDown={(e) => keyDownHandler(e, index, priceRefs, definedAccountRefs, descriptiveRefs)}
                                                                                                    className={`form-input `}
                                                                                                    style={{ width: "100%" }}
                                                                                                    id="debits"
                                                                                                    name={`documentArticles.${index}.debits`}
                                                                                                    value={formik.values.documentArticles[index].price}
                                                                                                    decimalsLimit={2}
                                                                                                    onChange={(e) => HandlePriceChange(index, e.target.value)}
                                                                                                    autoComplete="off"
                                                                                                />
                                                                                            </td>


                                                                                            <td style={{ width: '40px' }}>
                                                                                                <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => {

                                                                                                    setPriceTotal(priceTotal - formik.values.documentArticles[index].price)
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
                                                                            <td>{t('جمع')}:</td>
                                                                            <td></td>
                                                                            <td />
                                                                            <td>
                                                                                <CurrencyInput
                                                                                    className='form-input'
                                                                                    id="debitsTotal"
                                                                                    disabled
                                                                                    value={priceTotal}
                                                                                    name={`documentArticles.debitsTotal`}
                                                                                    decimalsLimit={2}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>

                                                                            <td />
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                            {formik?.errors?.documentArticles?.map((error, index) => (
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

                            if (formik.errors.documentArticles || formik.errors.balance) {
                                tableError()
                            } else {
                                setClick(true)
                            }
                            let temp = articlesTouch.map((item, i) => (
                                { definedAccount: true, descriptive: true, debits: true, credits: true, notes: true }
                            ))
                            setArticlesTouch(temp)
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

        </>
    )
}

