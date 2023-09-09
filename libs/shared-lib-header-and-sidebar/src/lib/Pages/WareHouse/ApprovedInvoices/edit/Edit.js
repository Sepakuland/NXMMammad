import React, { useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogContent, DialogContentText, FormControlLabel, FormGroup, IconButton, Modal, Switch, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { history } from '../../../../utils/history';
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { julianIntToDate } from "../../../../utils/dateConvert";
import DateObject from "react-date-object";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../utils/calenderLang";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SelectBox } from "devextreme-react";
import { useSearchParams } from "react-router-dom";
import Visitors from './Visitors.json'
import AccountPartyData from './AccountPartyData.json'
import CurrencyInput from "react-currency-input-field";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AddAccountParty from "../../../../components/Modals/AddAccountParty";
import cheque from '../../Sale/ReturnFromDistribution/Validate/Edit/cheque.json'
import { preInvoiceDatagridMeasurementUnitLookup, PreInvoiceGridData, revisionReasons, series } from "../../Sale/ReturnFromDistribution/Validate/Edit/datasources";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import DescriptionIcon from '@mui/icons-material/Description';
import BatchModal from "../../../../components/Modals/BatchModal";
import DescriptionModal from "../../../../components/Modals/DescriptionModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { cashDatagridCashLookup, goodGiftDatagridLookup } from "../../Sale/ReturnFromDistribution/Validate/Edit/fereidooniDatasources";
import Guid from 'devextreme/core/guid';
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../../utils/gridKeyboardNav3";
import settleList from "../../../sale/SalePhone/settleList.json";


const Edit = () => {
    const emptyPreInvoice = { formikId: new Guid().valueOf(), product: '', batchNumber: '', expireDate: '', unit: '', count: 0, quantity: 0, fee: -1, feeChange: 0, amount: 0, discountPercent: 0, discountAmount: 0, brokenDiscount: 0, afterDiscount: 0, includesTax: false, VATPercent: 0, VATAmount: 0, sum: 0, description: '', currentStock: 0, previousPurchase: 0 }
    const emptyGift = { formikId: new Guid().valueOf(), goods: "", buildSeries: "", expiredDate: "", unit: "", number: 0, amount: 0, fee: 0, price: 0 };
    const emptyOtherDeductions = { formikId: new Guid().valueOf(), title: "", moein: "", detailed: "", cash: "", amount: 0 };
    const emptyOtherAdditions = { formikId: new Guid().valueOf(), title: "", moein: "", detailed: "", cash: "", amount: 0 };
    const emptyCashPaymentDiscount = { formikId: new Guid().valueOf(), duration: 0, percent: 0, discountAmount: 0 }

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [timeValueSet, setTimeValueSet] = useState(false)
    const [priceEdit, setPriceEdit] = useState(false)
    const [taxEdit, setTaxEdit] = useState(false)
    const [discountEdit, setDiscountEdit] = useState(false)
    const [preInvoiceContainer, setPreInvoiceContainer] = useState([])
    const [container, setContainer] = useState([]);
    const [secondContainer, setSecondContainer] = useState([]);
    const [purchaseAllTotalSum, setPurchaseAllTotalSum] = useState(0)
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
        validateOnChange: false,
        initialValues: {
            PreInvoiceCode: Math.floor(Math.random() * 1000),
            SaleDate: julianIntToDate(new DateObject().toJulianDay()),
            Visitor: "",
            City: "",
            AccountParty: "",
            remaining: 0,
            Area: "",
            Address: "",
            Route: "",
            Telephones: "",
            Settle: "",
            SettlementDeadline: 0,
            Client: "",
            Registrar: "علیرضا سلطانی",
            Description: "",
            Description2: "",
            preInvoiceItems: [emptyPreInvoice],
            brokenDiscountPercent: 0,
            brokenDiscountAmount: 0,
            cashReward: 0,
            resendingCost: 0,
            giftReceived: [emptyGift],
            otherDeductionsReceived: [emptyOtherDeductions],
            otherAdditionsReceived: [emptyOtherAdditions],
            reversionReason: "",
            cashPaymentDiscount: [emptyCashPaymentDiscount]
        },
        validationSchema: Yup.object({
            SaleDate: Yup.date().required("انتخاب تاریخ الزامی است"),

            preInvoiceItems: Yup.array(Yup.object({
                fee: Yup.number().test(
                    'beneficial', 'فی کالاهای زیر کمتر از فی آخرین آنهاست',
                    (item, testContext) => {
                        console.log('parseFloat(item,2)', parseFloat(item, 2))
                        console.log('parseFloat(gridDataItem[testContext.options.index].lastBuyUnitPrice,2)', parseFloat(gridDataItem[testContext.options.index].lastBuyUnitPrice, 2))
                        return (parseFloat(item, 2) >= parseFloat(gridDataItem[testContext.options.index].lastBuyUnitPrice, 2))
                    }
                )
            }))
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
    const cities = [t("کرمانشاه"), t("بندرعباس"), t("کرج"), t("تهران"), t("اهواز"), t("دزفول")]
    const Areas = [t("منطقه 1"), t("منطقه 2"), t("منطقه 3"), t("منطقه 4"), t("منطقه 5")]
    const Routes = [t("مسیر1"), t("2مسیر"), t("مسیر3"), t("مسیر4"), t("مسیر5"), t("مسیر6")]

    const cancel = () => {
        history.navigate("/WareHouse/sale/approvedInvoices")
    }
    const getPreInvoiceBatchModalData = (val) => {
        console.log("Send a request and make batch with these datas:", val)
    }
    const getDescriptionModalData = (val) => {
        formik.setFieldValue(`preInvoiceItems[${preInvoiceFocusedRow - 1}].description`, val.description)
    }
    const HandlePriceEditChange = (event) => {
        setPriceEdit(event.target.checked)
    }
    const HandleTaxEditChange = (event) => {
        setTaxEdit(event.target.checked)
    }
    const HandleDiscountEditChange = (event) => {
        setDiscountEdit(event.target.checked)
    }
    //////////////////////////////dialog//////////////////////////////
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);
    //////////////////////////////////remaining/////////////////////
    useEffect(() => {
        let acc = AccountPartyData.filter(a => a.Id == formik.values.AccountParty)
        formik.setFieldValue("remaining", acc[0]?.PartnerAccountingRemainder)
        formik.setFieldValue("Address", acc[0]?.PartnerAddress)
        formik.setFieldValue("Telephones", acc[0]?.PartnerPhones)
    }, [formik.values.AccountParty])
    /////////////////////////////Grid///////////////////////////////
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = cheque.map((data) => {
            return {
                ...data,
                Amount: data.Amount !== '' ? parseInt(data.Amount) : '',
            }
        })
        setData(tempData)
    }, [i18n.language]);
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'Serial',
            filterable: false,
            name: "سریال",
            filter: 'numeric',
        },
        {
            field: 'Amount',
            filterable: false,
            name: "مبلغ",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },
        {
            field: 'maturity',
            filterable: false,
            name: "سررسید",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
        },
    ]
    /////////////////////////////////////////////////////////////////

    ///// PreInvoiceItems Grid \\\\\

    const [preInvoiceFocusedRow, setPreInvoiceFocusedRow] = useState(1)
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false)

    const [preInvoiceProductOpen, setPreInvoiceProductOpen] = useState(false)
    const [preInvoiceBatchNumberOpen, setPreInvoiceBatchNumberOpen] = useState(false)
    const [preInvoicePackageOpen, setPreInvoicePackageOpen] = useState(false)

    function addPreInvoiceItemsRow() {
        formik.setFieldValue('preInvoiceItems', [...formik.values.preInvoiceItems, emptyPreInvoice])
        setPreInvoiceContainer([...preInvoiceContainer, 0])
        setGridDataItem([...gridDataItem, { product: '', batchNumber: '', expireDate: '', unit: '', count: 0, quantity: 0, fee: -1, feeChange: 0, amount: 0, discountPercent: 0, discountAmount: 0, brokenDiscount: 0, afterDiscount: 0, includesTax: false, VATPercent: 0, VATAmount: 0, sum: 0, description: '', currentStock: 0, previousPurchase: 0 }])
    }

    function RenderPreInvoiceProductOpenState(index, state) {
        if (index === preInvoiceFocusedRow - 1) {
            setPreInvoiceProductOpen(state)
        }
        else {
            setPreInvoiceProductOpen(false)
        }
    }
    function RenderPreInvoiceBatchNumberOpenState(index, state) {
        if (index === preInvoiceFocusedRow - 1) {
            setPreInvoiceBatchNumberOpen(state)
        }
        else {
            setPreInvoiceBatchNumberOpen(false)
        }
    }
    function RenderPreInvoicePackageOpenState(index, state) {
        if (index === preInvoiceFocusedRow - 1) {
            setPreInvoicePackageOpen(state)
        }
        else {
            setPreInvoicePackageOpen(false)
        }
    }
    function preInvoiceKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && preInvoiceProductOpen === false && preInvoiceBatchNumberOpen === false && preInvoicePackageOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.preInvoiceItems.length === preInvoiceFocusedRow) {
                addPreInvoiceItemsRow()
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
        if (e.keyCode === 38 && preInvoiceProductOpen === false && preInvoiceBatchNumberOpen === false && preInvoicePackageOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.preInvoiceItems, addPreInvoiceItemsRow, next, preInvoiceFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.preInvoiceItems, addPreInvoiceItemsRow, next, preInvoiceFocusedRow)
        }
        if (e.keyCode === 13 && preInvoiceProductOpen === false && preInvoiceBatchNumberOpen === false && preInvoicePackageOpen === false) { /* Enter */
            MoveNext(formik.values.preInvoiceItems, addPreInvoiceItemsRow, next, preInvoiceFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            next.querySelector("input").focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.preInvoiceItems, addPreInvoiceItemsRow, next, preInvoiceFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }


    function HandlePreInvoiceCountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].count`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceQuantityChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].quantity`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceFeeChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].fee`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceFeeChangeChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].feeChange`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceAmountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].amount`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceDiscountAmountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].discountAmount`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceBrokenDiscountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].brokenDiscount`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceAfterDiscountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`, parsFloatFunction(temp, 2));
    }
    function HandlePreInvoiceVATAmountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`preInvoiceItems[${index}].VATAmount`, parsFloatFunction(temp, 2));
    }
    function AfterDiscount(value, index) {
        formik.setFieldValue(
            `preInvoiceItems[${index}].discountAmount`,
            ((parseInt(value) || 0) / 100) *
            (parseInt(formik.values.preInvoiceItems[index].amount) || 0)
        );
        formik.values.preInvoiceItems.forEach((item, index) => {
            let tempPrice = item.price;
            let tempDiscount = item.discountAmount;
            formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                (parseInt(item.amount) || 0) -
                ((parseInt(item.discountPercent) || 0) / 100) * (parseInt(item.amount) || 0) -
                ((parseInt(tempPrice - tempDiscount) * parseInt(item.brokenDiscount)) / 100 || 0)
            );
        });
    }

    const HandleHasTaxChange = (event, index) => {
        if (event.target.checked) {
            formik.setFieldValue(`preInvoiceItems[${index}].VATPercent`, 9)
            setTimeout(() => {
                formik.setFieldValue(`preInvoiceItems[${index}].VATAmount`,
                    (parseInt(formik.values.preInvoiceItems[index].afterDiscount) * 9) / 100);

                formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                    parseInt(formik.values.preInvoiceItems[index].afterDiscount) +
                    (parseInt(formik.values.preInvoiceItems[index].afterDiscount) * 9) / 100);
            }, 100);
        }
        else {
            formik.setFieldValue(`preInvoiceItems[${index}].VATPercent`, 0)
            setTimeout(() => {
                formik.setFieldValue(`preInvoiceItems[${index}].VATAmount`, 0);

                formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                    parseInt(formik.values.preInvoiceItems[index].afterDiscount));
            }, 100);
        }
    };

    const [preInvoiceCountTotal, setPreInvoiceCountTotal] = useState(0)
    const [preInvoiceQuantityTotal, setPreInvoiceQuantityTotal] = useState(0)
    const [preInvoiceAmountTotal, setPreInvoiceAmountTotal] = useState(0)
    const [preInvoiceDiscountAmountTotal, setPreInvoiceDiscountAmountTotal] = useState(0)
    const [preInvoiceBrokenDiscountTotal, setPreInvoiceBrokenDiscountTotal] = useState(0)
    const [preInvoiceAfterDiscountTotal, setPreInvoiceAfterDiscountTotal] = useState(0)
    const [preInvoiceVATAmountTotal, setPreInvoiceVATAmountTotal] = useState(0)
    const [preInvoiceSumTotal, setPreInvoiceSumTotal] = useState(0)

    function CalculatePreInvoiceCountTotal() {
        let preInvoiceCountTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceCountTemp += element.count;
            setPreInvoiceCountTotal(parsFloatFunction(preInvoiceCountTemp, 2));
        });
    }
    function CalculatePreInvoiceQuantityTotal() {
        let preInvoiceQuantityTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceQuantityTemp += element.quantity;
            setPreInvoiceQuantityTotal(parsFloatFunction(preInvoiceQuantityTemp, 2));
        });
    }
    function CalculatePreInvoiceAmountTotal() {
        let preInvoiceAmountTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceAmountTemp += element.amount;
            setPreInvoiceAmountTotal(parsFloatFunction(preInvoiceAmountTemp, 2));
        });
    }
    function CalculatePreInvoiceDiscountAmountTotal() {
        let preInvoiceDiscountAmountTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceDiscountAmountTemp += element.discountAmount;
            setPreInvoiceDiscountAmountTotal(parsFloatFunction(preInvoiceDiscountAmountTemp, 2));
        });
    }
    function CalculatePreInvoiceBrokenDiscountTotal() {
        let preInvoiceBrokenDiscountTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceBrokenDiscountTemp += element.brokenDiscount;
            setPreInvoiceBrokenDiscountTotal(parsFloatFunction(preInvoiceBrokenDiscountTemp, 2));
        });
    }
    function CalculatePreInvoiceAfterDiscountTotal() {
        let preInvoiceAfterDiscountTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceAfterDiscountTemp += element.afterDiscount;
            setPreInvoiceAfterDiscountTotal(parsFloatFunction(preInvoiceAfterDiscountTemp, 2));
        });
    }
    function CalculatePreInvoiceVATAmountTotal() {
        let preInvoiceVATAmountTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceVATAmountTemp += element.VATAmount;
            setPreInvoiceVATAmountTotal(parsFloatFunction(preInvoiceVATAmountTemp, 2));
        });
    }
    function CalculatePreInvoiceSumTotal() {
        let preInvoiceSumTemp = 0;
        formik.values.preInvoiceItems.forEach((element) => {
            preInvoiceSumTemp += element.sum;
            setPreInvoiceSumTotal(parsFloatFunction(preInvoiceSumTemp, 2));
        });
    }

    useEffect(() => {
        CalculatePreInvoiceCountTotal();
        CalculatePreInvoiceQuantityTotal();
        CalculatePreInvoiceAmountTotal();
        CalculatePreInvoiceDiscountAmountTotal();
        CalculatePreInvoiceBrokenDiscountTotal();
        CalculatePreInvoiceAfterDiscountTotal();
        CalculatePreInvoiceVATAmountTotal();
        CalculatePreInvoiceSumTotal();
    }, [formik.values.preInvoiceItems, preInvoiceBrokenDiscountTotal]);

    const [gridDataItem, setGridDataItem] = useState([]) /* For Validation Purposes */

    ///// End of PreInvoiceItems Grid \\\\\
    ///// Gift Grid \\\\\

    const [giftFocusedRow, setGiftFocusedRow] = useState(1);

    const [giftGoodsOpen, setGiftGoodsOpen] = useState(false);
    const [giftBuildSeriesOpen, setGiftBuildSeriesOpen] = useState(false);
    const [giftUnitOpen, setGiftUnitOpen] = useState(false);

    function addGiftReceivedRow() {
        formik.setFieldValue("giftReceived", [...formik.values.giftReceived, emptyGift]);
        setContainer([...container, 0]);
        setSecondContainer([...secondContainer, 0]);
    }

    function RenderGiftGoodsOpenState(index, state) {
        if (index === giftFocusedRow - 1) {
            setGiftGoodsOpen(state);
        } else {
            setGiftGoodsOpen(false);
        }
    }

    function RenderGiftBuildSeriesOpenState(index, state) {
        if (index === giftFocusedRow - 1) {
            setGiftBuildSeriesOpen(state);
        } else {
            setGiftBuildSeriesOpen(false);
        }
    }

    function RenderGiftUnitOpenState(index, state) {
        if (index === giftFocusedRow - 1) {
            setGiftUnitOpen(state);
        } else {
            setGiftUnitOpen(false);
        }
    }

    function HandleGiftNumberChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`giftReceived[${index}].number`, parsFloatFunction(temp, 2));
    }

    function HandleGiftAmountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`giftReceived[${index}].amount`, parsFloatFunction(temp, 2));
    }

    function HandleGiftFeeChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`giftReceived[${index}].fee`, parsFloatFunction(temp, 2));
    }

    function HandleGiftPriceChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`giftReceived[${index}].price`, parsFloatFunction(temp, 2));
    }

    function giftKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && giftGoodsOpen === false && giftBuildSeriesOpen === false && giftUnitOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.giftReceived.length === giftFocusedRow) {
                addGiftReceivedRow()
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
        if (e.keyCode === 38 && giftGoodsOpen === false && giftBuildSeriesOpen === false && giftUnitOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.giftReceived, addGiftReceivedRow, next, giftFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.giftReceived, addGiftReceivedRow, next, giftFocusedRow)
        }
        if (e.keyCode === 13 && giftGoodsOpen === false && giftBuildSeriesOpen === false && giftUnitOpen === false) { /* Enter */
            MoveNext(formik.values.giftReceived, addGiftReceivedRow, next, giftFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            next.querySelector("input").focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.giftReceived, addGiftReceivedRow, next, giftFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }

    const [giftNumberTotal, setGiftNumberTotal] = useState(0);
    const [giftAmountTotal, setGiftAmountTotal] = useState(0);
    const [giftFeeTotal, setGiftFeeTotal] = useState(0);
    const [giftPriceTotal, setGiftPriceTotal] = useState(0);

    function CalculateGiftNumberTotal() {
        let giftNumberTemp = 0;
        formik.values.giftReceived.forEach((element) => {
            giftNumberTemp += element.number;
            setGiftNumberTotal(parsFloatFunction(giftNumberTemp, 2));
        });
    }

    function CalculateGiftFeeTotal() {
        let giftFeeTemp = 0;
        formik.values.giftReceived.forEach((element) => {
            giftFeeTemp += element.fee;
            setGiftFeeTotal(parsFloatFunction(giftFeeTemp, 2));
        });
    }

    function CalculateGiftAmountTotal() {
        let giftAmountTemp = 0;
        formik.values.giftReceived.forEach((element) => {
            giftAmountTemp += element.amount;
            setGiftAmountTotal(parsFloatFunction(giftAmountTemp, 2));
        });
    }

    function CalculateGiftPriceTotal() {
        let giftPriceTemp = 0;
        formik.values.giftReceived.forEach((element) => {
            giftPriceTemp += element.price;
            setGiftPriceTotal(parsFloatFunction(giftPriceTemp, 2));
        });
    }

    const getGiftBatchModalData = (val) => {
        console.log("Send a request and make batch with these datas:", val);
    };
    ///// End of Gift Grid \\\\\
    ///// Other deductions Grid \\\\\

    const [otherDeductionsFocusedRow, setOtherDeductionsFocusedRow] = useState(1);

    const [otherDeductionsTitleOpen, setOtherDeductionsTitleOpen] =
        useState(false);
    const [otherDeductionsMoeinOpen, setOtherDeductionsMoeinOpen] =
        useState(false);
    const [otherDeductionsDetailedOpen, setOtherDeductionsDetailedOpen] =
        useState(false);

    function addOtherDeductionsReceivedRow() {
        formik.setFieldValue("otherDeductionsReceived", [...formik.values.otherDeductionsReceived, emptyOtherDeductions]);
    }

    function RenderOtherDeductionsMoeinOpenState(index, state) {
        if (index === otherDeductionsFocusedRow - 1) {
            setOtherDeductionsMoeinOpen(state);
        } else {
            setOtherDeductionsMoeinOpen(false);
        }
    }

    function RenderOtherDeductionsDetailedOpenState(index, state) {
        if (index === otherDeductionsFocusedRow - 1) {
            setOtherDeductionsDetailedOpen(state);
        } else {
            setOtherDeductionsDetailedOpen(false);
        }
    }

    function HandleOtherDeductionsAmountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(
            `otherDeductionsReceived[${index}].amount`,
            parsFloatFunction(temp, 2)
        );
    }

    function otherDeductionsKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && otherDeductionsMoeinOpen === false && otherDeductionsDetailedOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.otherDeductionsReceived.length === otherDeductionsFocusedRow) {
                addOtherDeductionsReceivedRow()
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
        if (e.keyCode === 38 && otherDeductionsMoeinOpen === false && otherDeductionsDetailedOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.otherDeductionsReceived, addOtherDeductionsReceivedRow, next, otherDeductionsFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.otherDeductionsReceived, addOtherDeductionsReceivedRow, next, otherDeductionsFocusedRow)
        }
        if (e.keyCode === 13 && otherDeductionsMoeinOpen === false && otherDeductionsDetailedOpen === false) { /* Enter */
            MoveNext(formik.values.otherDeductionsReceived, addOtherDeductionsReceivedRow, next, otherDeductionsFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            next.querySelector("input").focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.otherDeductionsReceived, addOtherDeductionsReceivedRow, next, otherDeductionsFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }

    const [otherDeductionsAmountTotal, setOtherDeductionsAmountTotal] =
        useState(0);

    function CalculateOtherDeductionsAmountTotal() {
        let otherDeductionsAmountTemp = 0;
        formik.values.otherDeductionsReceived.forEach((element) => {
            otherDeductionsAmountTemp += element.amount;
            setOtherDeductionsAmountTotal(
                parsFloatFunction(otherDeductionsAmountTemp, 2)
            );
        });
    }

    ///// Other Additions Grid \\\\\

    const [otherAdditionsFocusedRow, setOtherAdditionsFocusedRow] = useState(1);

    const [otherAdditionsTitleOpen, setOtherAdditionsTitleOpen] = useState(false);
    const [otherAdditionsMoeinOpen, setOtherAdditionsMoeinOpen] = useState(false);
    const [otherAdditionsDetailedOpen, setOtherAdditionsDetailedOpen] =
        useState(false);

    function addOtherAdditionsReceivedRow() {
        formik.setFieldValue("otherAdditionsReceived", [
            ...formik.values.otherAdditionsReceived,
            emptyOtherAdditions,
        ]);
    }

    function RenderOtherAdditionsMoeinOpenState(index, state) {
        if (index === otherAdditionsFocusedRow - 1) {
            setOtherAdditionsMoeinOpen(state);
        } else {
            setOtherAdditionsMoeinOpen(false);
        }
    }

    function RenderOtherAdditionsDetailedOpenState(index, state) {
        if (index === otherDeductionsFocusedRow - 1) {
            setOtherAdditionsDetailedOpen(state);
        } else {
            setOtherAdditionsDetailedOpen(false);
        }
    }

    function HandleOtherAdditionsAmountChange(index, value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(
            `otherAdditionsReceived[${index}].amount`,
            parsFloatFunction(temp, 2)
        );
    }
    function otherAdditionsKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && otherAdditionsMoeinOpen === false && otherAdditionsDetailedOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.otherAdditionsReceived.length === otherAdditionsFocusedRow) {
                addOtherAdditionsReceivedRow()
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
        if (e.keyCode === 38 && otherAdditionsMoeinOpen === false && otherAdditionsDetailedOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.otherAdditionsReceived, addOtherAdditionsReceivedRow, next, otherAdditionsFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.otherAdditionsReceived, addOtherAdditionsReceivedRow, next, otherAdditionsFocusedRow)
        }
        if (e.keyCode === 13 && otherAdditionsMoeinOpen === false && otherAdditionsDetailedOpen === false) { /* Enter */
            MoveNext(formik.values.otherAdditionsReceived, addOtherAdditionsReceivedRow, next, otherAdditionsFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            next.querySelector("input").focus()
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.otherAdditionsReceived, addOtherAdditionsReceivedRow, next, otherAdditionsFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }

    const [otherAdditionsAmountTotal, setOtherAdditionsAmountTotal] = useState(0);

    function CalculateOtherAdditionsAmountTotal() {
        let otherAdditionsAmountTemp = 0;
        formik.values.otherAdditionsReceived.forEach((element) => {
            otherAdditionsAmountTemp += element.amount;
            setOtherAdditionsAmountTotal(
                parsFloatFunction(otherAdditionsAmountTemp, 2)
            );
        });
    }

    useEffect(() => {
        if (
            formik.values.preInvoiceItems?.length &&
            formik.values.otherDeductionsReceived?.length &&
            formik.values.otherAdditionsReceived?.length
        ) {

            setPurchaseAllTotalSum(preInvoiceSumTotal - otherDeductionsAmountTotal + otherAdditionsAmountTotal - formik.values.cashReward);
        }
    }, [preInvoiceSumTotal, otherDeductionsAmountTotal, otherAdditionsAmountTotal, formik.values.cashReward]);

    function HandleCashRewardChange(value) {
        let temp = value.replaceAll(",", "");
        formik.setFieldValue(`cashReward`, parsFloatFunction(temp, 2));
    }

    /////Cash Payment Discount Grid Start \\\\\

    const [cashPaymentDiscountFocusedRow, setCashPaymentDiscountFocusedRow] = useState(1)

    // useEffect(() => {
    //     if (click) {
    //         tableError()
    //         setClick(false)
    //     }

    // }, [formik.errors.cashRewards])


    function addCashPaymentDiscountRow() {
        formik.setFieldValue('cashPaymentDiscount', [...formik.values.cashPaymentDiscount, emptyCashPaymentDiscount])
    }

    function cashPaymentDiscountKeyDownHandler(e) {
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
            if (formik.values.cashPaymentDiscount.length === cashPaymentDiscountFocusedRow) {
                addCashPaymentDiscountRow()
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
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.cashPaymentDiscount, addCashPaymentDiscountRow, next, cashPaymentDiscountFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.cashPaymentDiscount, addCashPaymentDiscountRow, next, cashPaymentDiscountFocusedRow)
        }
        if (e.keyCode === 13) { /* Enter */
            MoveNext(formik.values.cashPaymentDiscount, addCashPaymentDiscountRow, next, cashPaymentDiscountFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            next.querySelector("input").focus()
        }
        if (e.keyCode === 9) { /* Tab */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.cashPaymentDiscount, addCashPaymentDiscountRow, next, cashPaymentDiscountFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }
    }


    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>


                        <div className="row form-design">
                            <div className="col-lg-8 col-md-12 col-12">
                                <div className="row">
                                    <div className=" col-lg-4 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                        <div className="title">
                                            <span>{t("شماره پیش فاکتور")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="PreInvoiceCode"
                                                name="PreInvoiceCode"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.PreInvoiceCode}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col-12  ">
                                        <div className="title">
                                            <span>{t("تاریخ فروش")}<span className="star">*</span></span>
                                        </div>
                                        <div className="wrapper date-picker position-relative">
                                            <DatePicker
                                                ref={dateRef}
                                                name={"SaleDate"}
                                                id={"SaleDate"}
                                                tabIndex="-1"
                                                calendarPosition="bottom-right"
                                                calendar={renderCalendarSwitch(i18n.language)}
                                                locale={renderCalendarLocaleSwitch(i18n.language)}
                                                onBlur={formik.handleBlur}
                                                onChange={(val) => {
                                                    formik.setFieldValue("SaleDate", julianIntToDate(val.toJulianDay()));
                                                }}
                                                value={date}
                                            />
                                            <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <CalendarMonthIcon className='calendarButton' />
                                                </div>
                                            </div>
                                            {formik.touched.SaleDate && formik.errors.SaleDate &&
                                                !formik.values.SaleDate ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.SaleDate)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                        <div className="title">
                                            <span>{t("ویزیتور")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <SelectBox
                                                    dataSource={Visitors}
                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                    valueExpr="Id"
                                                    className='selectBox'
                                                    searchEnabled={true}
                                                    placeholder=''
                                                    tabIndex="1"
                                                    showClearButton
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return item && item.Code + '- ' + item.Name;
                                                    }}
                                                    displayValue='Name'
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('Visitor', e.value)
                                                    }}
                                                />

                                                {formik.touched.Visitor && formik.errors.Visitor &&
                                                    !formik.values.Visitor ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.Visitor)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col-12" >
                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 col-4 ">
                                                <div className="d-flex align-items-center">
                                                    <div >
                                                        <div className="title"><span>‌</span></div>
                                                        <Tooltip title={t("افزودن طرف حساب جدید")}>
                                                            <IconButton variant="contained" sx={{ width: '25px', height: '25px', margin: '0 3px' }} color="success" disabled={!formik.values.Route ? true : false}
                                                                tabIndex='11' onClick={() => handleClickOpen()}  >
                                                                <AddIcon style={{ fontSize: "30px" }} />
                                                            </IconButton >
                                                        </Tooltip>
                                                        <Dialog
                                                            open={open}
                                                            onClose={handleClose}
                                                            fullWidth={false}
                                                            maxWidth={'xl'}
                                                            aria-labelledby="scroll-dialog-title"
                                                            aria-describedby="scroll-dialog-description"

                                                        >
                                                            <DialogContent sx={{ background: "#edeff2" }} >
                                                                <DialogContentText
                                                                    id="scroll-dialog-description"
                                                                    ref={descriptionElementRef}
                                                                    tabIndex={-1}
                                                                    sx={{ background: "#edeff2" }}

                                                                >
                                                                    <AddAccountParty handleClose={handleClose} />
                                                                </DialogContentText>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                    <div >
                                                        <div className="title"><span>‌</span></div>
                                                        <Tooltip title={t("ویرایش")}>
                                                            <IconButton variant="contained" sx={{ width: '25px', height: '25px' }}
                                                                tabIndex='12' color='warning' className='kendo-action-btn' >
                                                                <EditIcon />
                                                            </IconButton >
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-8 col-md-8 col-8">
                                                <div className="title">
                                                    <span>{t("طرف حساب")}<span className="star">*</span></span>
                                                </div>
                                                <div className="wrapper">
                                                    <div>
                                                        <SelectBox
                                                            dataSource={AccountPartyData}
                                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                            valueExpr="Id"
                                                            className='selectBox'
                                                            searchEnabled={true}
                                                            placeholder=''
                                                            showClearButton
                                                            tabIndex="2"
                                                            noDataText={t("اطلاعات یافت نشد")}
                                                            displayExpr={function (item) {
                                                                return item && item.Code + '- ' + item.Name + `(${item.PartnerDefaultVisitor_Name})`;
                                                            }}
                                                            displayValue='Name'
                                                            onValueChanged={(e) => {
                                                                formik.setFieldValue('AccountParty', e.value)
                                                                if (e.value == null)
                                                                    formik.setFieldValue("remaining", '')
                                                                formik.setFieldValue("Address", '')
                                                            }}
                                                        />
                                                        {formik.touched.AccountParty && formik.errors.AccountParty &&
                                                            !formik.values.AccountParty ? (
                                                            <div className='error-msg'>
                                                                {t(formik.errors.AccountParty)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-12 ">
                                        <div className="title">
                                            <span>{t("مانده")}</span>
                                        </div>
                                        <CurrencyInput
                                            className={`form-input `}
                                            style={{ width: "100%" }}
                                            id="remaining"
                                            name="remaining"
                                            value={formik.values.remaining}
                                            decimalsLimit={2}
                                            disabled
                                        />
                                        {formik.touched.remaining && formik.errors.remaining &&
                                            !formik.values.remaining ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.remaining)}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col12" >
                                        <div className="title">
                                            <span>{t("ثبت کننده")}</span>
                                        </div>
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="Registrar"
                                                name="Registrar"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.Registrar}
                                                disabled
                                            />
                                            {formik.touched.Registrar && formik.errors.Registrar &&
                                                !formik.values.Registrar ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.Registrar)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>
                                    <div className="col-lg-4 col-md-6 col-12" >
                                        <div className="title">
                                            <span>{t("شهر")}<span className="star">*</span></span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <SelectBox
                                                    dataSource={cities}
                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                    className='selectBox'
                                                    tabIndex='5'
                                                    searchEnabled={true}
                                                    placeholder={t('همه شهرها')}
                                                    showClearButton
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    // displayExpr={function (item) {
                                                    //   return item && item.Code + ' - ' + item.Name;
                                                    // }}
                                                    // displayValue='Name'
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('City', e.value)
                                                    }}
                                                />

                                                {formik.touched.City && formik.errors.City &&
                                                    !formik.values.City ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.City)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-12" >
                                        <div className="title">
                                            <span>{t("منطقه")}<span className="star">*</span></span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <SelectBox
                                                    dataSource={Areas}
                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                    className='selectBox'
                                                    searchEnabled={true}
                                                    tabIndex='6'
                                                    placeholder={t('همه مناظق')}
                                                    showClearButton
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('Area', e.value)
                                                        if (e.value == null) {
                                                            formik.setFieldValue('Area', '')
                                                            formik.setFieldValue('Route', '')
                                                        }
                                                    }}
                                                    disabled={!formik.values.City ? true : false}
                                                />
                                                {formik.touched.Area && formik.errors.Area &&
                                                    !formik.values.Area ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.Area)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-12" >
                                        <div className="title">
                                            <span>{t("مسیر")}<span className="star">*</span></span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <SelectBox
                                                    dataSource={Routes}
                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                    tabIndex='7'
                                                    className='selectBox'
                                                    searchEnabled={true}
                                                    placeholder={t('همه مسیرها')}
                                                    showClearButton
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('Route', e.value)
                                                        if (e.value == null) {

                                                            formik.setFieldValue('Route', '')
                                                        }
                                                    }}
                                                    disabled={!formik.values.Area ? true : false}
                                                />
                                                {formik.touched.Route && formik.errors.Route &&
                                                    !formik.values.Route ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.Route)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12" >
                                        <div className="title">
                                            <span>{t("آدرس")}</span>
                                        </div>

                                        <input
                                            className="form-input"
                                            type="text"
                                            id="Address"
                                            name="Address"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.Address}
                                            disabled
                                        />
                                        {formik.touched.Address && formik.errors.Address &&
                                            !formik.values.Address ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Address)}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12" >
                                        <div className="title">
                                            <span>{t("تلفن ها")}</span>
                                        </div>

                                        <input
                                            className="form-input"
                                            type="text"
                                            id="Telephones"
                                            name="Telephones"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.Telephones}
                                            disabled
                                        />
                                        {formik.touched.Telephones && formik.errors.Telephones &&
                                            !formik.values.Telephones ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Telephones)}
                                            </div>
                                        ) : null}

                                    </div>
                                    <div className=" col-lg-4 col-md-6 col12" >
                                        <div className="title">
                                            <span>{t("نحوه تسویه")}</span>
                                        </div>
                                        <div>
                                            <SelectBox
                                                dataSource={settleList}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                valueExpr="Id"
                                                className='selectBox'
                                                searchEnabled={true}
                                                placeholder=''
                                                tabIndex="1"
                                                showClearButton
                                                noDataText={t("اطلاعات یافت نشد")}
                                                displayExpr={'Name'}
                                                displayValue='Name'
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('Settle', e.value)
                                                }}
                                            />
                                            {/*<input*/}
                                            {/*    className="form-input"*/}
                                            {/*    type="text"*/}
                                            {/*    id="Settle"*/}
                                            {/*    name="Settle"*/}
                                            {/*    tabIndex="3"*/}
                                            {/*    onChange={formik.handleChange}*/}
                                            {/*    onBlur={formik.handleBlur}*/}
                                            {/*    value={formik.values.Settle}*/}
                                            {/*/>*/}
                                            {formik.touched.Settle && formik.errors.Settle &&
                                                !formik.values.Settle ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.Settle)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>
                                    <div className=" col-lg-4 col-md-6 col12" >
                                        <div className="title">
                                            <span>{t("مهلت تسویه(روز)")}</span>
                                        </div>
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="SettlementDeadline"
                                                name="SettlementDeadline"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.SettlementDeadline}
                                                disabled
                                            />
                                            {formik.touched.SettlementDeadline && formik.errors.SettlementDeadline &&
                                                !formik.values.SettlementDeadline ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.SettlementDeadline)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>
                                    <div className=" col-lg-4 col-md-6 col12" >
                                        <div className="title">
                                            <span>{t("سفارش دهنده")}</span>
                                        </div>
                                        <div>
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="Client"
                                                name="Client"
                                                tabIndex='8'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.Client}
                                            />
                                            {formik.touched.Client && formik.errors.Client &&
                                                !formik.values.Client ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.Client)}
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("توضیحات")}</span>
                                        </div>
                                        <textarea
                                            className="form-input"
                                            type="text"
                                            rows={2}
                                            id="Description"
                                            name="Description"
                                            tabIndex='9'
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
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("توضیحات")}2</span>
                                        </div>
                                        <textarea
                                            className="form-input"
                                            type="text"
                                            rows={2}
                                            tabIndex='10'
                                            id="Description2"
                                            name="Description2"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.Description2}
                                        />
                                        {formik.touched.Description2 && formik.errors.Description2 &&
                                            !formik.values.Description2 ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Description2)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 col-12">
                                <div className="title">
                                    <span>‌</span>
                                </div>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch checked={priceEdit} onChange={HandlePriceEditChange} name="price" />}
                                        label={t("ویرایش قیمت‌ها")}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={taxEdit} onChange={HandleTaxEditChange} name="tax" />}
                                        label={t("ویرایش مالیات")}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={discountEdit} onChange={HandleDiscountEditChange} name="discount" />}
                                        label={t("ویرایش تخفیفات")}
                                    />
                                </FormGroup>
                                <div className="col-lg-12 col-md-12 col-12">
                                    <div style={{ margin: '0 -20px' }}>
                                        <RKGrid
                                            gridId={'Cheques'}
                                            gridData={data}
                                            columnList={tempColumn}
                                            showSetting={false}
                                            showChart={false}
                                            showExcelExport={false}
                                            showPrint={false}
                                            sortable={false}
                                            pageable={false}
                                            reorderable={false}
                                            selectable={false}
                                            selectKeyField={'id'}
                                        // getSelectedRows={getSelectedRows}
                                        // 
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="content col-12">
                                {/* PreInvoice Grid */}
                                <div className="row align-items-center">
                                    <div className="content col-6">
                                        <div className="title mb-0">
                                            <span className="span"> {t("اقلام پیش‌فاکتور")} :</span>
                                        </div>
                                    </div>
                                    <div className="content col-6">
                                        {/* Copyright Ghafourian© Grid V3.0
                                    All rights reserved */}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outlined"
                                                className="grid-add-btn"
                                                onClick={(e) => {
                                                    addPreInvoiceItemsRow();
                                                    setTimeout(() => {
                                                        let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                        while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                            added = findNextFocusable(added)
                                                        }
                                                        added.querySelector("input").focus()
                                                    }, 0);
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="content col-12">
                                        <div className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>{t("ردیف")}</th>
                                                        <th>{t("کالا")}</th>
                                                        <th>{t("سری ساخت")}</th>
                                                        <th>
                                                            <AddCircleOutlineIcon color="success" />
                                                        </th>
                                                        <th>{t("تاریخ انقضاء")}</th>
                                                        <th>{t("واحد")}</th>
                                                        <th>{t("تعداد")}</th>
                                                        <th>{t("مقدار")}</th>
                                                        <th>{t("فی")}</th>
                                                        <th>{t("تخفیف مبلغ معین")}</th>
                                                        <th>{t("مبلغ")}</th>
                                                        <th>{t("درصد تخفیف")}</th>
                                                        <th>{t("مبلغ تخفیف")}</th>
                                                        <th>{t("تخفیف حجمی سر‌شکن شده")}</th>
                                                        <th>{t("پس از کسر تخفیف")}</th>
                                                        <th>{t("شامل مالیات ا.ا.")}</th>
                                                        <th>{t("درصد مالیات ا.ا.")}</th>
                                                        <th>{t("مبلغ مالیات ا.ا.")}</th>
                                                        <th>{t("جمع")}</th>
                                                        <th>{t("توضیحات")}</th>
                                                        <th>{t("تغییر توضیحات")}</th>
                                                        <th>{t("موجودی")}</th>
                                                        <th>{t("خرید قبلی")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="preInvoiceItems"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik.values?.preInvoiceItems?.map((preInvoiceItem, index) => (
                                                                    <tr
                                                                        key={preInvoiceItem.formikId}
                                                                        onFocus={(e) => setPreInvoiceFocusedRow(e.target.closest("tr").rowIndex)}
                                                                        className={preInvoiceFocusedRow === index + 1 ? "focus-row-bg" : ""}
                                                                    >
                                                                        <td className="text-center" style={{ verticalAlign: "middle", width: "40px" }}>
                                                                            {index + 1}
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <div className="table-autocomplete">
                                                                                <Autocomplete

                                                                                    id="product"
                                                                                    name={`preInvoiceItems.${index}.product`}
                                                                                    options={PreInvoiceGridData}
                                                                                    renderOption={(props, option) => (
                                                                                        <Box component="li" {...props}>
                                                                                            {option.StuffCode} - {option.product}
                                                                                        </Box>
                                                                                    )}

                                                                                    filterOptions={(options, state) => {
                                                                                        let newOptions = [];
                                                                                        options.forEach((element) => {
                                                                                            if (
                                                                                                element.StuffCode.includes(state.inputValue.toLowerCase()) ||
                                                                                                element.product.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                newOptions.push(element);
                                                                                        });
                                                                                        return newOptions;
                                                                                    }}
                                                                                    getOptionLabel={option => option.product}
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: 150,
                                                                                                maxWidth: "90vw",
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
                                                                                    disableClearable={true}
                                                                                    forcePopupIcon={false}
                                                                                    open={preInvoiceFocusedRow === index + 1 ? preInvoiceProductOpen : false}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            RenderPreInvoiceProductOpenState(index, true)
                                                                                        }
                                                                                        else {
                                                                                            RenderPreInvoiceProductOpenState(index, false)
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {
                                                                                        RenderPreInvoiceProductOpenState(index, false)
                                                                                        if (value) {
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].product`, value.StuffCode)
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].fee`, value.fee)
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}.VATPercent]`, value.VATPercent)
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].currentStock`, value.currentStock)
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].previousPurchase`, value.previousPurchase)
                                                                                            let temp = gridDataItem
                                                                                            temp[index] = value
                                                                                            setGridDataItem([...temp])

                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].amount`,
                                                                                                parseInt(formik.values.preInvoiceItems[index].quantity)
                                                                                                * (parseInt(value.fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)));

                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                                                parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                                (parseInt(value.fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                                parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                                parseFloat(formik.values.preInvoiceItems[index].brokenDiscount));

                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].VATAmount`,
                                                                                                (parseInt(parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                                    (parseInt(value.fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                                    parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                                    parseFloat(formik.values.preInvoiceItems[index].brokenDiscount)) *
                                                                                                    parseInt(value.VATPercent)) / 100);

                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                                parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                                (parseInt(value.fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                                parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                                parseFloat(formik.values.preInvoiceItems[index].brokenDiscount) +
                                                                                                parseFloat(formik.values.preInvoiceItems[index].VATAmount)
                                                                                            );
                                                                                        }
                                                                                        else {
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].product`, "")
                                                                                        }

                                                                                        // setTimeout(() => {
                                                                                        //     if (value !== "") {
                                                                                        //         preInvoiceBatchNumberRefs.current[index].focus()
                                                                                        //     }
                                                                                        //     else {
                                                                                        //         preInvoicePackageRefs.current[index].focus()
                                                                                        //     }
                                                                                        // }, 1);
                                                                                    }}
                                                                                    onBlur={(e) => RenderPreInvoiceProductOpenState(index, false)}
                                                                                    renderInput={params => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && preInvoiceProductOpen === false) {
                                                                                            e.preventDefault()
                                                                                            RenderPreInvoiceProductOpenState(index, false)
                                                                                        }
                                                                                        setTimeout(() => {
                                                                                            preInvoiceKeyDownHandler(e)
                                                                                        }, 0);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "150px", minWidth: "90px" }}>
                                                                            <div className="table-autocomplete">
                                                                                <Autocomplete
                                                                                    disabled={formik.values.preInvoiceItems[index].product === ""}
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: 150,
                                                                                                maxWidth: "90vw",
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
                                                                                            background: formik.values.preInvoiceItems[index].product !== "" ? "#e9ecefd2" : "white",
                                                                                            borderRadius: 0,
                                                                                            fontSize: '12px'
                                                                                        }
                                                                                    }
                                                                                    id="batchNumber"
                                                                                    name={`preInvoiceItems.${index}.batchNumber`}
                                                                                    options={series}
                                                                                    renderOption={(props, option) => (
                                                                                        <Box component="li" {...props} >
                                                                                            {option.ExpirationDate} - {option.BatchNumber}
                                                                                        </Box>
                                                                                    )}
                                                                                    getOptionLabel={(option) => option.BatchNumber}
                                                                                    size="small"
                                                                                    disableClearable={true}
                                                                                    forcePopupIcon={false}
                                                                                    open={preInvoiceFocusedRow === index + 1 ? preInvoiceBatchNumberOpen : false}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            RenderPreInvoiceBatchNumberOpenState(index, true);
                                                                                        } else {
                                                                                            RenderPreInvoiceBatchNumberOpenState(index, false);
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {
                                                                                        RenderPreInvoiceBatchNumberOpenState(index, false);
                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].batchNumber`, value.BatchNumber);
                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].expireDate`, value.ExpirationDate);
                                                                                    }}
                                                                                    onBlur={(e) => RenderPreInvoiceBatchNumberOpenState(index, false)
                                                                                    }
                                                                                    renderInput={(params) => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && preInvoiceBatchNumberOpen === false) {
                                                                                            e.preventDefault();
                                                                                            RenderPreInvoiceBatchNumberOpenState(index, false);
                                                                                        }
                                                                                        setTimeout(() => {
                                                                                            preInvoiceKeyDownHandler(e);
                                                                                        }, 0);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "40px" }}>
                                                                            <IconButton
                                                                                variant="contained"
                                                                                color="success"
                                                                                className="kendo-action-btn"
                                                                                style={preInvoiceFocusedRow === index + 1 ? { display: "block" } : { display: "none" }}
                                                                                onClick={() => {
                                                                                    setBatchModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <AddCircleOutlineIcon />
                                                                            </IconButton>
                                                                        </td>
                                                                        <td style={{ minWidth: '120px' }}>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`preInvoiceItems.${index}.expireDate`}
                                                                                type='text'
                                                                                value={formik.values.preInvoiceItems[index].expireDate}
                                                                                autoComplete="off"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <div className="table-autocomplete">
                                                                                <Autocomplete

                                                                                    id="package"
                                                                                    name={`preInvoiceItems.${index}.package`}
                                                                                    options={preInvoiceDatagridMeasurementUnitLookup}
                                                                                    renderOption={(props, option) => (
                                                                                        <Box component="li" {...props}>
                                                                                            {option.Code} - {option.Name}
                                                                                        </Box>
                                                                                    )}
                                                                                    filterOptions={(options, state) => {
                                                                                        let newOptions = [];
                                                                                        options.forEach((element) => {
                                                                                            if (
                                                                                                element.Code.includes(state.inputValue.toLowerCase())
                                                                                                || element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                newOptions.push(element);
                                                                                        });
                                                                                        return newOptions;
                                                                                    }}
                                                                                    getOptionLabel={(option) => option.Name}
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: 200,
                                                                                                maxWidth: "90vw",
                                                                                                direction: i18n.dir(),
                                                                                                position: "absolute",
                                                                                                fontSize: "12px",
                                                                                                right: i18n.dir() === "rtl" ? "0" : "unset",
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    sx={{
                                                                                        direction: i18n.dir(),
                                                                                        position: "relative",
                                                                                        background: "#e9ecefd2",
                                                                                        borderRadius: 0,
                                                                                        fontSize: "12px",
                                                                                    }}
                                                                                    size="small"
                                                                                    clearOnBlur={true}
                                                                                    forcePopupIcon={false}
                                                                                    open={preInvoiceFocusedRow === index + 1 ? preInvoicePackageOpen : false}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            RenderPreInvoicePackageOpenState(index, true);
                                                                                        } else {
                                                                                            RenderPreInvoicePackageOpenState(index, false);
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {
                                                                                        RenderPreInvoicePackageOpenState(index, false);
                                                                                        if (value) {
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].package`, value.Code);
                                                                                            let temp = preInvoiceContainer;
                                                                                            temp[index] = value.Coefficient;
                                                                                            setPreInvoiceContainer(temp);
                                                                                            setTimeout(() => {

                                                                                                formik.setFieldValue(`preInvoiceItems[${index}].quantity`,
                                                                                                    parseInt(formik.values.preInvoiceItems[index].count)
                                                                                                    * value.Coefficient);

                                                                                                formik.setFieldValue(`preInvoiceItems[${index}].amount`,
                                                                                                    parseInt(formik.values.preInvoiceItems[index].count) * value.Coefficient
                                                                                                    * (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)));

                                                                                                formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                                                    parseInt(formik.values.preInvoiceItems[index].count) * value.Coefficient *
                                                                                                    (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                                    parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                                    parseFloat(formik.values.preInvoiceItems[index].brokenDiscount));

                                                                                                formik.setFieldValue(`preInvoiceItems[${index}.VATAmount]`,
                                                                                                    parseInt(formik.values.preInvoiceItems[index].count) * value.Coefficient *
                                                                                                    (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange))
                                                                                                    * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100)

                                                                                                formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                                    parseInt(formik.values.preInvoiceItems[index].count) * value.Coefficient *
                                                                                                    (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                                    parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                                    parseFloat(formik.values.preInvoiceItems[index].brokenDiscount) +
                                                                                                    (parseInt(formik.values.preInvoiceItems[index].count) * value.Coefficient *
                                                                                                        (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange))
                                                                                                        * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100));
                                                                                            }, 100);
                                                                                        }
                                                                                        else {
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].package`, "");
                                                                                        }
                                                                                    }}
                                                                                    onBlur={(e) => RenderPreInvoicePackageOpenState(index, false)}
                                                                                    renderInput={(params) => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && preInvoicePackageOpen === false) {
                                                                                            e.preventDefault();
                                                                                            RenderPreInvoicePackageOpenState(index, false);
                                                                                        }
                                                                                        setTimeout(() => {
                                                                                            preInvoiceKeyDownHandler(e);
                                                                                        }, 0);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                onKeyDown={(e) => preInvoiceKeyDownHandler(e)}
                                                                                className={`form-input`}
                                                                                style={{ width: "100%" }}
                                                                                id="count"
                                                                                name={`preInvoiceItems.${index}.count`}
                                                                                value={formik.values.preInvoiceItems[index].count}
                                                                                decimalsLimit={2}
                                                                                onChange={(e, value) => {
                                                                                    HandlePreInvoiceCountChange(index, e.target.value);
                                                                                    formik.setFieldValue(`preInvoiceItems[${index}].quantity`,
                                                                                        parseInt(e.target.value) * preInvoiceContainer[index]
                                                                                    );
                                                                                    formik.setFieldValue(`preInvoiceItems[${index}].amount`,
                                                                                        parseInt(e.target.value) * preInvoiceContainer[index] *
                                                                                        (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)));

                                                                                    formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                                        parseInt(e.target.value) * preInvoiceContainer[index] *
                                                                                        (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                        parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                        parseFloat(formik.values.preInvoiceItems[index].brokenDiscount));

                                                                                    formik.setFieldValue(`preInvoiceItems[${index}.VATAmount]`,
                                                                                        parseInt(e.target.value) * preInvoiceContainer[index] *
                                                                                        (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange))
                                                                                        * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100)

                                                                                    formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                        parseInt(e.target.value) * preInvoiceContainer[index] *
                                                                                        (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                        parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                        parseFloat(formik.values.preInvoiceItems[index].brokenDiscount) +
                                                                                        (parseInt(e.target.value) * preInvoiceContainer[index] *
                                                                                            (parseInt(formik.values.preInvoiceItems[index].fee) + parseInt(formik.values.preInvoiceItems[index].feeChange))
                                                                                            * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100));
                                                                                }}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                className={`form-input`}
                                                                                style={{ width: "100%" }}
                                                                                id="quantity"
                                                                                name={`preInvoiceItems.${index}.quantity`}
                                                                                disabled
                                                                                value={formik.values.preInvoiceItems[index].quantity}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) =>
                                                                                    HandlePreInvoiceQuantityChange(index, e.target.value)
                                                                                }
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                onKeyDown={(e) => preInvoiceKeyDownHandler(e)}
                                                                                className={`form-input`}
                                                                                style={{ width: "100%" }}
                                                                                id="fee"
                                                                                name={`preInvoiceItems.${index}.fee`}
                                                                                value={formik.values.preInvoiceItems[index].fee}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => {
                                                                                    HandlePreInvoiceFeeChange(index, e.target.value)

                                                                                    setTimeout(() => {
                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].amount`,
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) + parseInt(formik.values.preInvoiceItems[index].feeChange)) *
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity))

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].brokenDiscount))

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}.VATAmount]`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) + parseInt(formik.values.preInvoiceItems[index].feeChange))
                                                                                            * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100)

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) + parseInt(formik.values.preInvoiceItems[index].feeChange)) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].brokenDiscount) +
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) + parseInt(formik.values.preInvoiceItems[index].feeChange))
                                                                                            * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100);
                                                                                    }, 100);
                                                                                }}
                                                                                disabled={!Boolean(priceEdit)}
                                                                                onBlur={formik.handleBlur}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                onKeyDown={(e) => preInvoiceKeyDownHandler(e)}
                                                                                className={`form-input `}
                                                                                style={{ width: "100%" }}
                                                                                id="feeChange"
                                                                                name={`preInvoiceItems.${index}.feeChange`}
                                                                                value={formik.values.preInvoiceItems[index].feeChange}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => {
                                                                                    HandlePreInvoiceFeeChangeChange(index, e.target.value)
                                                                                    setTimeout(() => {

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].amount`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity)
                                                                                            * (parseInt(formik.values.preInvoiceItems[index].fee) + parsFloatFunction(e.target.value.replaceAll(",", ""), 2)));

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parseInt(formik.values.preInvoiceItems[index].fee) + parsFloatFunction(e.target.value.replaceAll(",", ""), 2)) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].brokenDiscount));

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}.VATAmount]`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parseInt(formik.values.preInvoiceItems[index].fee) + parsFloatFunction(e.target.value.replaceAll(",", ""), 2))
                                                                                            * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100)

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parseInt(formik.values.preInvoiceItems[index].fee) + parsFloatFunction(e.target.value.replaceAll(",", ""), 2)) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].discountAmount) -
                                                                                            parseFloat(formik.values.preInvoiceItems[index].brokenDiscount) +
                                                                                            parseInt(formik.values.preInvoiceItems[index].quantity) *
                                                                                            (parseInt(formik.values.preInvoiceItems[index].fee) + parsFloatFunction(e.target.value.replaceAll(",", ""), 2))
                                                                                            * parseInt(formik.values.preInvoiceItems[index].VATPercent) / 100);
                                                                                    }, 100);
                                                                                }}
                                                                                disabled={!Boolean(discountEdit)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                className={`form-input `}
                                                                                style={{ width: "100%" }}
                                                                                id="amount"
                                                                                name={`preInvoiceItems.${index}.amount`}
                                                                                value={formik.values.preInvoiceItems[index].amount}
                                                                                disabled
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => HandlePreInvoiceAmountChange(index, e.target.value)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <input
                                                                                className="form-input"
                                                                                onKeyDown={(e) => preInvoiceKeyDownHandler(e)}
                                                                                name={`preInvoiceItems.${index}.discountPercent`}
                                                                                value={formik.values.preInvoiceItems[index].discountPercent}
                                                                                type="number"
                                                                                onChange={(e) => {
                                                                                    // if (e.target.value) {
                                                                                    //     AfterDiscount(e.target.value, index);
                                                                                    if (e.target.value) {
                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].discountPercent`,
                                                                                            parseFloat(e.target.value));

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].discountAmount`,
                                                                                            (parseFloat(formik.values.preInvoiceItems[index].amount) * parseFloat(e.target.value)) / 100 || 0);

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                                            ((parseInt(formik.values.preInvoiceItems[index].amount) || 0) -
                                                                                                (parseFloat(formik.values.preInvoiceItems[index].amount) * parseFloat(e.target.value)) / 100 || 0) -
                                                                                            (parseInt(formik.values.preInvoiceItems[index].brokenDiscount) || 0));

                                                                                        let AfterDiscountTemp = ((parseInt(formik.values.preInvoiceItems[index].amount) || 0) -
                                                                                            (parseFloat(formik.values.preInvoiceItems[index].amount) * parseFloat(e.target.value)) / 100 || 0) -
                                                                                            (parseInt(formik.values.preInvoiceItems[index].brokenDiscount) || 0);

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].sum`, AfterDiscountTemp + formik.values.preInvoiceItems[index].VATAmount || 0);
                                                                                        // CalculatePurchaseDiscountAmountTotal();
                                                                                    }
                                                                                    // }
                                                                                }}
                                                                                disabled={!Boolean(discountEdit)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}                                                                                >
                                                                            <CurrencyInput
                                                                                onKeyDown={(e) => preInvoiceKeyDownHandler(e)}
                                                                                className={`form-input`}
                                                                                id="discountAmount"
                                                                                name={`preInvoiceItems.${index}.discountAmount`}
                                                                                value={formik.values.preInvoiceItems[index].discountAmount}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => {
                                                                                    if (e.target.value) {
                                                                                        HandlePreInvoiceDiscountAmountChange(index, e.target.value);

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].discountPercent`,
                                                                                            Number(((parsFloatFunction(e.target.value.replaceAll(",", ""), 2) * 100) /
                                                                                                formik.values.preInvoiceItems[index].amount)).toFixed(2));

                                                                                        formik.setFieldValue(
                                                                                            `preInvoiceItems[${index}].afterDiscount`,
                                                                                            (parseInt(formik.values.preInvoiceItems[index].amount) || 0) -
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) || 0) -
                                                                                            (parseInt(formik.values.preInvoiceItems[index].brokenDiscount) || 0));

                                                                                        let AfterDiscountTemp = (parseInt(formik.values.preInvoiceItems[index].amount) || 0) -
                                                                                            (parsFloatFunction(e.target.value.replaceAll(",", ""), 2) || 0) -
                                                                                            (parseInt(formik.values.preInvoiceItems[index].brokenDiscount) || 0);

                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                            AfterDiscountTemp + formik.values.preInvoiceItems[index].VATAmount || 0);
                                                                                    }
                                                                                }}
                                                                                disabled={!Boolean(discountEdit)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                className={`form-input `}
                                                                                style={{ width: "100%" }}
                                                                                id="price"
                                                                                name={`preInvoiceItems.${index}.brokenDiscount`}
                                                                                value={formik.values.preInvoiceItems[index].brokenDiscount}
                                                                                disabled
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => {
                                                                                    if (e.target.value) {
                                                                                        HandlePreInvoiceBrokenDiscountChange(index, e.target.value);
                                                                                    }
                                                                                }}
                                                                                onBlur={(e) => {
                                                                                    if (e.target.value) {
                                                                                        formik.setFieldValue(`preInvoiceItems[${index}].AfterDiscount`,
                                                                                            (parseInt(formik.values.preInvoiceItems[index].amount) || 0) -
                                                                                            (parseInt(formik.values.preInvoiceItems[index].discountAmount) || 0) -
                                                                                            (parseInt(formik.values.preInvoiceItems[index].brokenDiscount) || 0));
                                                                                    }
                                                                                }}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }} >
                                                                            <CurrencyInput
                                                                                className={`form-input `}
                                                                                style={{ width: "100%" }}
                                                                                id="afterDiscount"
                                                                                disabled
                                                                                name={`preInvoiceItems.${index}.afterDiscount`}
                                                                                value={formik.values.preInvoiceItems[index].afterDiscount}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) =>
                                                                                    HandlePreInvoiceAfterDiscountChange(index, e.target.value)
                                                                                }
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ Width: '40px' }}>
                                                                            <Checkbox
                                                                                defaultChecked={Boolean(preInvoiceItem.includesTax)}
                                                                                color="success"
                                                                                disabled={!Boolean(taxEdit)}
                                                                                onChange={(e) => HandleHasTaxChange(e, index)}
                                                                                size="small"
                                                                            />
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <input
                                                                                className="form-input"
                                                                                onKeyDown={(e) => preInvoiceKeyDownHandler(e)}
                                                                                name={`preInvoiceItems.${index}.VATPercent`}
                                                                                type="text"
                                                                                onChange={(e) => {
                                                                                    if (e.target.value) {
                                                                                        setTimeout(() => {
                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].VATAmount`,
                                                                                                (parseInt(formik.values.preInvoiceItems[index].afterDiscount) *
                                                                                                    parseInt(e.target.value)) / 100);

                                                                                            formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                                                parseInt(formik.values.preInvoiceItems[index].afterDiscount) +
                                                                                                (parseInt(formik.values.preInvoiceItems[index].afterDiscount) *
                                                                                                    parseInt(e.target.value)) / 100);
                                                                                        }, 100);
                                                                                    }
                                                                                }}
                                                                                disabled={!Boolean(taxEdit)}
                                                                                value={formik.values.preInvoiceItems[index].VATPercent}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                disabled
                                                                                className={`form-input `}
                                                                                style={{ width: "100%" }}
                                                                                id="VATAmount"
                                                                                name={`preInvoiceItems.${index}.VATAmount`}
                                                                                value={formik.values.preInvoiceItems[index].VATAmount}
                                                                                decimalsLimit={2}
                                                                                onChange={(e) => HandlePreInvoiceVATAmountChange(index, e.target.value)}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "120px", minWidth: "90px" }}>
                                                                            <CurrencyInput
                                                                                className={`form-input `}
                                                                                style={{ width: "100%" }}
                                                                                id="sum"
                                                                                disabled
                                                                                name={`preInvoiceItems.${index}.sum`}
                                                                                value={formik.values.preInvoiceItems[index].sum}
                                                                                decimalsLimit={2}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`preInvoiceItems.${index}.description`}
                                                                                value={formik.values.preInvoiceItems[index].description}
                                                                                type="text"
                                                                                disabled
                                                                                onChange={formik.handleChange}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "40px" }}>
                                                                            <IconButton
                                                                                variant="contained"
                                                                                className="kendo-action-btn"
                                                                                onClick={() => {
                                                                                    setDescriptionModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <DescriptionIcon />
                                                                            </IconButton>
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`preInvoiceRefs.${index}.currentStock`}
                                                                                value={formik.values.preInvoiceItems[index].currentStock}
                                                                                type="text"
                                                                                disabled
                                                                                onChange={formik.handleChange}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <input
                                                                                className="form-input"
                                                                                name={`preInvoiceRefs.${index}.previousPurchase`}
                                                                                value={formik.values.preInvoiceItems[index].previousPurchase}
                                                                                type="text"
                                                                                disabled
                                                                                onChange={formik.handleChange}
                                                                                autoComplete="off"
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        )}>

                                                    </FieldArray>
                                                </tbody>
                                                <tfoot>
                                                    <td colSpan={6}> {t("جمع")} :</td>
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalCount"
                                                            value={preInvoiceCountTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalQuantity"
                                                            value={preInvoiceQuantityTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td colSpan={2} />
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalAmount"
                                                            value={preInvoiceAmountTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td />
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalDiscountAmount"
                                                            value={preInvoiceDiscountAmountTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalBrokenDiscount"
                                                            value={preInvoiceBrokenDiscountTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalAfterDiscount"
                                                            value={preInvoiceAfterDiscountTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td colSpan={2} />
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalVATAmount"
                                                            value={preInvoiceVATAmountTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td>
                                                        <CurrencyInput
                                                            className="form-input"
                                                            disabled
                                                            id="totalSum"
                                                            value={preInvoiceSumTotal}
                                                            decimalsLimit={2}
                                                        />
                                                    </td>
                                                    <td colSpan={4}></td>
                                                </tfoot>
                                            </table>
                                        </div>
                                        {/* {console.log('formik?.errors?.preInvoiceItems', formik?.errors?.preInvoiceItems)}
                                        {console.log('formik?.values?.preInvoiceItems', formik?.values?.preInvoiceItems)}
                                        {console.log('gridDataItem', gridDataItem)} */}

                                    </div>
                                    <div className="content col-lg-6 col-12">
                                        {formik?.errors?.preInvoiceItems?.length ?
                                            <>
                                                <p className="error-msg">{t("فی کالاهای زیر کمتر از فی آخرین آنهاست")} :</p>
                                                <table className="table table-borderless" style={{ color: "red", fontSize: "12px" }}>
                                                    <thead>
                                                        <tr>
                                                            <th>{t("کالا")}</th>
                                                            <th>{t("فی فروش")}</th>
                                                            <th>{t("آخرین فی خرید")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formik?.errors?.preInvoiceItems?.map((error, index) => (

                                                            <tr key={index}>
                                                                <td style={{ width: "90px" }}>
                                                                    {gridDataItem[index].product ? gridDataItem[index].product : ""}
                                                                </td>
                                                                <td style={{ width: "90px" }}>
                                                                    {formik.values.preInvoiceItems[index].fee}
                                                                </td>
                                                                <td style={{ width: "90px" }}>
                                                                    {gridDataItem[index].lastBuyUnitPrice ? gridDataItem[index].lastBuyUnitPrice : ""}
                                                                </td>
                                                            </tr>


                                                        ))}
                                                    </tbody>
                                                </table>
                                            </> : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="row">
                                    <div className="content col-lg-6 col-12">
                                        <div className="title">
                                            <span>{t("جمع مبلغ کالا‌ها")} </span>
                                        </div>

                                        <CurrencyInput
                                            className="form-input"
                                            // style={{ width: "100%" }}
                                            id="totalAmount"
                                            disabled
                                            value={preInvoiceAmountTotal}
                                            name="totalAmount"
                                            decimalsLimit={2}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="content col-lg-6 col-12">
                                        <div className="title">
                                            <span> (-) {t("جمع تخفیفات سطری")} :</span>
                                        </div>

                                        <CurrencyInput
                                            className="form-input"
                                            // style={{ width: "100%" }}
                                            id="discountAmountTotal"
                                            disabled
                                            value={preInvoiceDiscountAmountTotal}
                                            name="discountAmountTotal"
                                            decimalsLimit={2}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="content col-lg-3 col-12">
                                        <div className="title">
                                            <span> (-) {t("درصد تخفیف حجمی")} :</span>
                                        </div>

                                        <input
                                            className="form-input"
                                            id="brokenDiscountPercent"
                                            name="brokenDiscountPercent"
                                            value={parseFloat(formik.values.brokenDiscountPercent, 2)}
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    formik.setFieldValue("brokenDiscountPercent", e.target.value);
                                                    formik.values.preInvoiceItems.forEach(
                                                        (item, index) => {
                                                            let tempAmount = item.amount;
                                                            let tempDiscountAmount = item.discountAmount;
                                                            formik.setFieldValue(`preInvoiceItems[${index}].brokenDiscount`,
                                                                (parseInt(tempAmount - tempDiscountAmount) * parseInt(e.target.value)) / 100);
                                                            let AfterDiscountTemp = (parseInt(tempAmount) || 0) -
                                                                ((parseInt(tempAmount) * parseInt(item.discountPercent)) / 100 || 0) -
                                                                (parseInt(((parseInt(tempAmount) - parseInt(tempDiscountAmount))
                                                                    * parseInt(e.target.value)) / 100 || 0) || 0);

                                                            formik.setFieldValue(`preInvoiceItems[${index}].afterDiscount`,
                                                                (parseInt(tempAmount) || 0) -
                                                                ((parseInt(tempAmount) * parseInt(item.discountPercent)) / 100 || 0) -
                                                                (parseInt(((parseInt(tempAmount) - parseInt(tempDiscountAmount))
                                                                    * parseInt(e.target.value)) / 100 || 0) || 0));

                                                            // formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                            //     parseInt(item.afterDiscount) +
                                                            //     (parseInt(item.afterDiscount) * parseInt(e.target.value)) / 100);

                                                            formik.setFieldValue(`preInvoiceItems[${index}].sum`,
                                                                AfterDiscountTemp + formik.values.preInvoiceItems[index].VATAmount || 0
                                                            );
                                                        }
                                                    );
                                                }
                                            }}
                                            type="text"
                                            disabled={!Boolean(discountEdit)}
                                            placeholder="%"
                                        />
                                    </div>
                                    <div className="content col-lg-3 col-12">
                                        <div className="title">
                                            <span> (-) {t("مبلغ تخفیف حجمی")} :</span>
                                        </div>

                                        <input
                                            className="form-input"
                                            // style={{ width: "100%" }}
                                            id="total"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    if (e.target.value[e.target.value.length - 1] !== ".") {
                                                        setPreInvoiceBrokenDiscountTotal(
                                                            parsFloatFunction(e.target.value.replaceAll(",", ""), 2)
                                                        );
                                                        // formik.setFieldValue(
                                                        //   "discountBrokenPercentage",parseFloat(
                                                        //   (parsFloatFunction(
                                                        //     e.target.value.replaceAll(",", ""),
                                                        //     2
                                                        //   ) || 0) /(
                                                        //     (purchasePriceTotal -
                                                        //       purchaseDiscountAmountTotal) || 1)*100,2)
                                                        // );
                                                        //  formik.values.purchaseReceived.forEach((item,index)=>{
                                                        //    let tempPrice = item.price;
                                                        //    let tempDiscount = item.discountAmount

                                                        //    console.log('tempPrice',tempPrice)
                                                        //    console.log('.....................',
                                                        //    (parseInt(tempPrice) || 0) -
                                                        //      ((parseInt(tempPrice) *
                                                        //        parseInt(item.discountPercentage)) /
                                                        //        100 || 0) -
                                                        //      (parseInt(
                                                        //        e.target.value ) || 0))
                                                        //    console.log('item.discountPercentage',item.discountPercentage)

                                                        //    formik.setFieldValue(
                                                        //     `purchaseReceived[${index}].AfterDiscount`,
                                                        //     (parseInt(tempPrice) || 0) -
                                                        //       ((parseInt(tempPrice) *
                                                        //         parseInt(item.discountPercentage)) /
                                                        //         100 || 0) -
                                                        //       (parseInt(
                                                        //         e.target.value ) || 0)
                                                        //   );
                                                        //  })
                                                    } else {
                                                        setPreInvoiceBrokenDiscountTotal(e.target.value.replaceAll(",", ""));
                                                    }
                                                    // (parseFloat(formik.values.))
                                                    // (parsFloatFunction(  e.target.value.replaceAll(',',''), 2)*100)/(formik.values.purchaseReceived[index].price)
                                                }
                                            }}
                                            value={preInvoiceBrokenDiscountTotal.toLocaleString()}
                                            name="total"
                                            disabled={!Boolean(discountEdit)}
                                            // decimalsLimit={2}
                                            // step={1}
                                            autoComplete="off"
                                        />
                                        {/* {console.log(
                                        "purchaseBrokenDiscountTotal:",
                                        purchaseBrokenDiscountTotal
                                    )} */}
                                    </div>
                                    <div className="content col-lg-6 col-12">
                                        <div className="title">
                                            <span> (-) {t("جایزه نقدی")} :</span>
                                        </div>

                                        <CurrencyInput
                                            className="form-input"
                                            // style={{ width: "100%" }}
                                            id="discountAmountTotal"
                                            disabled={!Boolean(discountEdit)}
                                            onChange={(e) =>
                                                HandleCashRewardChange(e.target.value)
                                            }
                                            value={formik.values.cashReward}
                                            name="discountAmountTotal"
                                            decimalsLimit={2}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="content col-lg-6 col-12">
                                        <div className="title">
                                            <span> (+) {t("جمع مالیات ا.ا")} :</span>
                                        </div>

                                        <CurrencyInput
                                            className="form-input"
                                            style={{ width: "100%" }}
                                            id="amountAddedTaxTotal"
                                            disabled
                                            value={preInvoiceVATAmountTotal}
                                            name="amountAddedTaxTotal"
                                            decimalsLimit={2}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="content col-lg-6 col-12">
                                        <div className="title">
                                            <span>{t("هزینه ارسال مجدد")} :</span>
                                        </div>

                                        <CurrencyInput
                                            className="form-input"
                                            // style={{ width: "100%" }}
                                            id="resendingCost"
                                            disabled
                                            value={formik.values.resendingCost}
                                            name="resendingCost"
                                            decimalsLimit={2}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="content col-lg-12 col-12 ">
                                {/* Gift Grid */}
                                <div className="row align-items-center">
                                    <div className="content col-lg-6 col-6">
                                        <div className="title mb-0">
                                            <span className="span"> {t("اقلام اشانتیون")} :</span>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-6">
                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outlined"
                                                className="grid-add-btn"
                                                onClick={(e) => {
                                                    addGiftReceivedRow();
                                                    setTimeout(() => {
                                                        let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                        while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                            added = findNextFocusable(added)
                                                        }
                                                        added.querySelector("input").focus()
                                                    }, 0);
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="content col-lg-12 col-12">
                                        <div className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>{t("ردیف")}</th>
                                                        <th>{t("کالا")}</th>
                                                        <th>{t("سری ساخت")}</th>
                                                        <th>
                                                            <AddCircleOutlineIcon color="success" />
                                                        </th>
                                                        <th>{t("تاریخ انقضاء")}</th>
                                                        <th>{t("واحد")}</th>
                                                        <th>{t("تعداد")}</th>
                                                        <th>{t("مقدار")}</th>
                                                        <th>{t("فی")}</th>
                                                        <th>{t("مبلغ")}</th>
                                                        <th>{t("حذف")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="giftReceived"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik?.values?.giftReceived?.map(
                                                                    (giftReceives, index) => (
                                                                        <tr key={index} className={giftFocusedRow === index + 1 ? "focus-row-bg" : ""}
                                                                            onFocus={(e) => setGiftFocusedRow(e.target.closest("tr").rowIndex)
                                                                            } >
                                                                            <td className="text-center" style={{ verticalAlign: "middle", width: "40px" }}>
                                                                                {index + 1}
                                                                            </td>

                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        id="goods"
                                                                                        name={`giftReceived.${index}.goods`}
                                                                                        options={goodGiftDatagridLookup}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.Name}
                                                                                            </Box>
                                                                                        )}
                                                                                        getOptionLabel={(option) => option.Name}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 200,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: "#e9ecefd2",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px",
                                                                                        }}
                                                                                        size="small"
                                                                                        clearOnBlur={true}
                                                                                        forcePopupIcon={false}
                                                                                        open={giftFocusedRow === index + 1 ? giftGoodsOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderGiftGoodsOpenState(index, true);
                                                                                            } else {
                                                                                                RenderGiftGoodsOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderGiftGoodsOpenState(index, false);
                                                                                            if (value) {
                                                                                                formik.setFieldValue(`giftReceived[${index}].goods`, value.Name);
                                                                                                formik.setFieldValue(`giftReceived[${index}].fee`, value.Fee);
                                                                                            } else {
                                                                                                formik.setFieldValue(`giftReceived[${index}].goods`, "");
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => RenderGiftGoodsOpenState(index, false)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && giftGoodsOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderGiftGoodsOpenState(index, false);
                                                                                            }
                                                                                            setTimeout(() => {
                                                                                                giftKeyDownHandler(e)
                                                                                            }, 0);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ width: "150px", minWidth: "90px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        disabled={formik.values.giftReceived[index].goods === ""}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 150,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: formik.values.giftReceived[index].goods !== "" ? "#e9ecefd2" : "white",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px"
                                                                                        }}
                                                                                        id="buildSeries"
                                                                                        name={`giftReceived.${index}.buildSeries`}
                                                                                        options={series}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.ExpirationDate} - {option.BatchNumber}
                                                                                            </Box>
                                                                                        )}
                                                                                        getOptionLabel={(option) => option.BatchNumber}
                                                                                        size="small"
                                                                                        disableClearable={true}
                                                                                        forcePopupIcon={false}
                                                                                        open={giftFocusedRow === index + 1 ? giftBuildSeriesOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderGiftBuildSeriesOpenState(index, true);
                                                                                            } else {
                                                                                                RenderGiftBuildSeriesOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderGiftBuildSeriesOpenState(index, false);
                                                                                            formik.setFieldValue(`giftReceived[${index}].buildSeries`, value.BatchNumber);
                                                                                            formik.setFieldValue(`giftReceived[${index}].expiredDate`, value.ExpirationDate);
                                                                                        }}
                                                                                        onBlur={(e) => RenderGiftBuildSeriesOpenState(index, false)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && giftBuildSeriesOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderGiftBuildSeriesOpenState(index, false);
                                                                                            }
                                                                                            setTimeout(() => {
                                                                                                giftKeyDownHandler(e);
                                                                                            }, 0);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ width: "40px" }}>
                                                                                <IconButton
                                                                                    variant="contained"
                                                                                    color="success"
                                                                                    className="kendo-action-btn"
                                                                                    onClick={() => {
                                                                                        setBatchModalOpen(true);
                                                                                    }}
                                                                                >
                                                                                    <AddCircleOutlineIcon />
                                                                                </IconButton>
                                                                            </td>
                                                                            <td style={{ width: "150px", minWidth: "90px" }}>
                                                                                <div>
                                                                                    <DatePicker
                                                                                        style={{ direction: "ltr" }}
                                                                                        name={`giftReceived.${index}.expiredDate`}
                                                                                        id="expiredDate"
                                                                                        disabled
                                                                                        calendar={renderCalendarSwitch(
                                                                                            i18n.language
                                                                                        )}
                                                                                        locale={renderCalendarLocaleSwitch(
                                                                                            i18n.language
                                                                                        )}
                                                                                        calendarPosition="bottom-right"
                                                                                        onOpen={false}
                                                                                        value={formik.values.giftReceived[index].expiredDate !== "" ? new DateObject(formik.values.giftReceived[index].expiredDate) : ""}
                                                                                        onOpenPickNewDate={false}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        id="unit"
                                                                                        name={`giftReceived.${index}.unit`}
                                                                                        options={preInvoiceDatagridMeasurementUnitLookup}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.Code} -{option.Name}
                                                                                            </Box>
                                                                                        )}
                                                                                        filterOptions={(options, state) => {
                                                                                            let newOptions = [];
                                                                                            options.forEach((element) => {
                                                                                                if (element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                    element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                    newOptions.push(element);
                                                                                            });
                                                                                            return newOptions;
                                                                                        }}
                                                                                        getOptionLabel={(option) => option.Name}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 200,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right: i18n.dir() === "rtl" ? "0" : "unset",
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: "#e9ecefd2",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px",
                                                                                        }}
                                                                                        size="small"
                                                                                        clearOnBlur={true}
                                                                                        forcePopupIcon={false}
                                                                                        open={giftFocusedRow === index + 1 ? giftUnitOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderGiftUnitOpenState(index, true);
                                                                                            } else {
                                                                                                RenderGiftUnitOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderGiftUnitOpenState(index, false);
                                                                                            if (value) {
                                                                                                formik.setFieldValue(`giftReceived[${index}].unit`, value.Code);
                                                                                                let temp = container;
                                                                                                temp[index] = value.Coefficient;
                                                                                                setContainer(temp);
                                                                                                setTimeout(() => {
                                                                                                    formik.setFieldValue(`giftReceived[${index}].amount`,
                                                                                                        parseInt(formik.values.giftReceived[index].number) * value.Coefficient);
                                                                                                    formik.setFieldValue(`giftReceived[${index}].price`,
                                                                                                        parseInt(formik.values.giftReceived[index].fee) * formik.values.giftReceived[index].number);
                                                                                                }, 100);
                                                                                            } else {
                                                                                                formik.setFieldValue(`giftReceived[${index}].unit`, "");
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => RenderGiftUnitOpenState(index, false)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField                                                                                                {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && giftUnitOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderGiftUnitOpenState(index, false);
                                                                                            }
                                                                                            setTimeout(() => {
                                                                                                giftKeyDownHandler(e);
                                                                                            }, 0);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => giftKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    style={{ width: "100%" }}
                                                                                    id="number"
                                                                                    name={`giftReceived.${index}.number`}
                                                                                    value={formik.values.giftReceived[index].number}
                                                                                    decimalsLimit={2}
                                                                                    onChange={(e) => HandleGiftNumberChange(index, e.target.value)}
                                                                                    onBlur={() => {
                                                                                        formik.setFieldValue(`giftReceived[${index}].amount`,
                                                                                            parseInt(formik.values.giftReceived[index].number) * container[index]);
                                                                                        formik.setFieldValue(`giftReceived[${index}].price`,
                                                                                            parseInt(formik.values.giftReceived[index].number) *
                                                                                            parseInt(formik.values.giftReceived[index].fee));
                                                                                    }}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => giftKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    style={{ width: "100%" }}
                                                                                    id="number"
                                                                                    name={`giftReceived.${index}.amount`}
                                                                                    value={formik.values.giftReceived[index].amount}
                                                                                    decimalsLimit={2}
                                                                                    onChange={(e) => HandleGiftAmountChange(index, e.target.value)}
                                                                                    onBlur={() => CalculateGiftAmountTotal()}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => giftKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    style={{ width: "100%" }}
                                                                                    id="fee"
                                                                                    name={`giftReceived.${index}.fee`}
                                                                                    value={formik.values.giftReceived[index].fee}
                                                                                    decimalsLimit={2}
                                                                                    onChange={(e) => HandleGiftFeeChange(index, e.target.value)}
                                                                                    onBlur={() => CalculateGiftFeeTotal()}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => giftKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    style={{ width: "100%" }}
                                                                                    id="price"
                                                                                    name={`giftReceived.${index}.price`}
                                                                                    value={formik.values.giftReceived[index].price}
                                                                                    decimalsLimit={2}
                                                                                    onChange={(e) => HandleGiftPriceChange(index, e.target.value)}
                                                                                    onBlur={() => CalculateGiftPriceTotal()}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>

                                                                            <td style={{ width: "40px" }}>
                                                                                <IconButton
                                                                                    variant="contained"
                                                                                    color="error"
                                                                                    className="kendo-action-btn"
                                                                                    onClick={() => {
                                                                                        setGiftPriceTotal(giftPriceTotal - formik.values.giftReceived[index].price);
                                                                                        remove(index);
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    ></FieldArray>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td>{t("جمع")}:</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            <CurrencyInput
                                                                className="form-input"
                                                                style={{ width: "100%" }}
                                                                id="price"
                                                                disabled
                                                                value={giftPriceTotal}
                                                                name={`giftReceived.giftPriceTotal`}
                                                                decimalsLimit={2}
                                                                autoComplete="off"
                                                            />
                                                        </td>

                                                        <td />
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        {formik?.errors?.cashReceived?.map((error, index) => (
                                            <p className="error-msg" key={index}>
                                                {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="content col-lg-6 col-12">
                                {/* Other deductions Grid */}
                                <div className="row align-items-center">
                                    <div className="content col-lg-6 col-6">
                                        <div className="title mb-0">
                                            <span className="span"> {t("سایر کسورات")} :</span>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-6">
                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outlined"
                                                className="grid-add-btn"
                                                onClick={(e) => {
                                                    addOtherDeductionsReceivedRow();
                                                    setTimeout(() => {
                                                        let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                        while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                            added = findNextFocusable(added)
                                                        }
                                                        added.querySelector("input").focus()
                                                    }, 0);
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="content col-lg-12 col-12">
                                        <div className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>{t("ردیف")}</th>
                                                        <th>{t("عنوان")}</th>
                                                        <th>{t("مبلغ")}</th>
                                                        <th>{t("حساب معین مشخص")}</th>
                                                        <th>{t("تفضیلی")}</th>
                                                        <th>{t("حذف")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="otherDeductionsReceived"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik?.values?.otherDeductionsReceived?.map(
                                                                    (otherDeductionsReceives, index) => (
                                                                        <tr
                                                                            key={otherDeductionsReceives.formikId}
                                                                            onFocus={(e) => setOtherDeductionsFocusedRow(e.target.closest("tr").rowIndex)}
                                                                            className={otherDeductionsFocusedRow === index + 1 ? "focus-row-bg" : ""}
                                                                        >
                                                                            <td className="text-center" style={{ verticalAlign: "middle", width: "40px" }}>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <input
                                                                                    className="form-input"
                                                                                    onKeyDown={(e) => otherDeductionsKeyDownHandler(e)}
                                                                                    name={`otherDeductionsReceived.${index}.title`}
                                                                                    type="text"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.otherDeductionsReceived[index].title}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => otherDeductionsKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    style={{ width: "100%" }}
                                                                                    id="amount"
                                                                                    name={`otherDeductionsReceived.${index}.amount`}
                                                                                    // value={
                                                                                    //   formik.values.cashReceived[
                                                                                    //     index
                                                                                    //   ].amount
                                                                                    // }
                                                                                    decimalsLimit={2}
                                                                                    onChange={(e) => HandleOtherDeductionsAmountChange(index, e.target.value)}
                                                                                    onBlur={() => CalculateOtherDeductionsAmountTotal()}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        id="moein"
                                                                                        clearIcon={false}
                                                                                        name={`otherDeductionsReceived.${index}.moein`}
                                                                                        options={cashDatagridCashLookup}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.Name}
                                                                                            </Box>
                                                                                        )}
                                                                                        getOptionLabel={(option) => option.Name}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 200,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right: i18n.dir() === "rtl" ? "0" : "unset",
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: "#e9ecefd2",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px",
                                                                                        }}
                                                                                        size="small"
                                                                                        clearOnBlur={true}
                                                                                        forcePopupIcon={false}
                                                                                        open={
                                                                                            otherDeductionsFocusedRow === index + 1 ? otherDeductionsMoeinOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderOtherDeductionsMoeinOpenState(index, true);
                                                                                            } else {
                                                                                                RenderOtherDeductionsMoeinOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderOtherDeductionsMoeinOpenState(index, false);
                                                                                            if (value) {
                                                                                                formik.setFieldValue(`otherDeductionsReceived[${index}].moein`, value.Name);
                                                                                            } else {
                                                                                                formik.setFieldValue(`otherDeductionsReceived[${index}].moein`, "");
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => RenderOtherDeductionsMoeinOpenState(index, false)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && otherDeductionsMoeinOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderOtherDeductionsMoeinOpenState(index, false);
                                                                                            }
                                                                                            setTimeout(() => {
                                                                                                otherDeductionsKeyDownHandler(e);
                                                                                            }, 0);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        id="detailed"
                                                                                        clearIcon={false}
                                                                                        name={`otherDeductionsReceived.${index}.detailed`}
                                                                                        options={cashDatagridCashLookup}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.Name}
                                                                                            </Box>
                                                                                        )}
                                                                                        getOptionLabel={(option) => option.Name}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 200,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: "#e9ecefd2",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px",
                                                                                        }}
                                                                                        size="small"
                                                                                        clearOnBlur={true}
                                                                                        forcePopupIcon={false}
                                                                                        open={otherDeductionsFocusedRow === index + 1 ? otherDeductionsDetailedOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderOtherDeductionsDetailedOpenState(index, true);
                                                                                            } else {
                                                                                                RenderOtherDeductionsDetailedOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderOtherDeductionsDetailedOpenState(index, false);
                                                                                            if (value) {
                                                                                                formik.setFieldValue(`otherDeductionsReceived[${index}].detailed`, value.Name);
                                                                                            } else {
                                                                                                formik.setFieldValue(`otherDeductionsReceived[${index}].detailed`, "");
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => RenderOtherDeductionsDetailedOpenState(index, false)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && otherDeductionsDetailedOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderOtherDeductionsDetailedOpenState(index, false);
                                                                                            }
                                                                                            setTimeout(() => {
                                                                                                otherDeductionsKeyDownHandler(e);
                                                                                            }, 0);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>

                                                                            <td style={{ width: "40px" }}>
                                                                                <IconButton
                                                                                    variant="contained"
                                                                                    color="error"
                                                                                    className="kendo-action-btn"
                                                                                    onClick={() => {
                                                                                        setOtherDeductionsAmountTotal(otherDeductionsAmountTotal - formik.values.otherDeductionsReceived[index].amount);
                                                                                        remove(index);
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    ></FieldArray>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={2}>{t("جمع")}:</td>
                                                        <td>
                                                            <CurrencyInput
                                                                className="form-input"
                                                                style={{ width: "100%" }}
                                                                id="otherDeductionsAmountTotal"
                                                                disabled
                                                                value={otherDeductionsAmountTotal}
                                                                name={`otherDeductionsReceived.otherDeductionsAmountTotal`}
                                                                decimalsLimit={2}
                                                                autoComplete="off"
                                                            />
                                                        </td>
                                                        <td colSpan={3} />
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        {formik?.errors?.otherDeductionsReceived?.map(
                                            (error, index) => (
                                                <p className="error-msg" key={index}>
                                                    {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="content col-lg-6 col-12">
                                {/* Other additions Grid */}
                                <div className="row align-items-center">
                                    <div className="content col-lg-6 col-6">
                                        <div className="title mb-0">
                                            <span className="span"> {t("سایر اضافات")} :</span>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-6">
                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outlined"
                                                className="grid-add-btn"
                                                onClick={(e) => {
                                                    addOtherAdditionsReceivedRow();
                                                    setTimeout(() => {
                                                        let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                        while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                            added = findNextFocusable(added)
                                                        }
                                                        added.querySelector("input").focus()
                                                    }, 0);
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="content col-lg-12 col-12">
                                        <div className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>{t("ردیف")}</th>
                                                        <th>{t("عنوان")}</th>
                                                        <th>{t("مبلغ")}</th>
                                                        <th>{t("حساب معین مشخص")}</th>
                                                        <th>{t("تفضیلی")}</th>
                                                        <th>{t("حذف")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="otherAdditionsReceived"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik?.values?.otherAdditionsReceived?.map(
                                                                    (otherAdditionsReceives, index) => (
                                                                        <tr
                                                                            key={otherAdditionsReceives.formikId}
                                                                            onFocus={(e) => setOtherAdditionsFocusedRow(e.target.closest("tr").rowIndex)}
                                                                            className={otherAdditionsFocusedRow === index + 1 ? "focus-row-bg" : ""}
                                                                        >
                                                                            <td className="text-center" style={{ verticalAlign: "middle", width: "40px" }}>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <input
                                                                                    className="form-input"
                                                                                    onKeyDown={(e) => otherDeductionsKeyDownHandler(e)}
                                                                                    name={`otherAdditionsReceived.${index}.title`}
                                                                                    type="text"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.otherAdditionsReceived[index].title}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => otherAdditionsKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    style={{ width: "100%" }}
                                                                                    id="amount"
                                                                                    name={`otherAdditionsReceived.${index}.amount`}
                                                                                    // value={
                                                                                    //   formik.values.cashReceived[
                                                                                    //     index
                                                                                    //   ].amount
                                                                                    // }
                                                                                    decimalsLimit={2}
                                                                                    onChange={(e) => HandleOtherAdditionsAmountChange(index, e.target.value)}
                                                                                    onBlur={() => CalculateOtherAdditionsAmountTotal()}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        id="moein"
                                                                                        clearOnBlur={true}
                                                                                        name={`otherAdditionsReceived.${index}.moein`}
                                                                                        options={cashDatagridCashLookup}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.Name}
                                                                                            </Box>
                                                                                        )}
                                                                                        getOptionLabel={(option) => option.Name}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 200,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: "#e9ecefd2",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px",
                                                                                        }}
                                                                                        size="small"
                                                                                        forcePopupIcon={false}
                                                                                        open={otherAdditionsFocusedRow === index + 1 ? otherAdditionsMoeinOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderOtherAdditionsMoeinOpenState(index, true);
                                                                                            } else {
                                                                                                RenderOtherAdditionsMoeinOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderOtherAdditionsMoeinOpenState(index, false);
                                                                                            if (value) {
                                                                                                formik.setFieldValue(`otherAdditionsReceived[${index}].moein`, value.Name);
                                                                                            } else {
                                                                                                formik.setFieldValue(`otherAdditionsReceived[${index}].moein`, "");
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => RenderOtherAdditionsMoeinOpenState(index, false)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && otherAdditionsMoeinOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderOtherAdditionsMoeinOpenState(index, false);
                                                                                            }
                                                                                            setTimeout(() => {
                                                                                                otherAdditionsKeyDownHandler(e);
                                                                                            }, 0);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <div className={`table-autocomplete `}>
                                                                                    <Autocomplete
                                                                                        id="detailed"
                                                                                        clearIcon={false}
                                                                                        name={`otherAdditionsReceived.${index}.detailed`}
                                                                                        options={cashDatagridCashLookup}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box component="li" {...props}>
                                                                                                {option.Name}
                                                                                            </Box>
                                                                                        )}
                                                                                        getOptionLabel={(option) => option.Name}
                                                                                        componentsProps={{
                                                                                            paper: {
                                                                                                sx: {
                                                                                                    width: 200,
                                                                                                    maxWidth: "90vw",
                                                                                                    direction: i18n.dir(),
                                                                                                    position: "absolute",
                                                                                                    fontSize: "12px",
                                                                                                    right:
                                                                                                        i18n.dir() === "rtl" ? "0" : "unset"
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        sx={{
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: "#e9ecefd2",
                                                                                            borderRadius: 0,
                                                                                            fontSize: "12px"
                                                                                        }}
                                                                                        size="small"
                                                                                        clearOnBlur={true}
                                                                                        forcePopupIcon={false}
                                                                                        open={otherAdditionsFocusedRow === index + 1 ? otherAdditionsDetailedOpen : false}
                                                                                        noOptionsText={t("اطلاعات یافت نشد")}
                                                                                        onInputChange={(event, value) => {
                                                                                            if (value !== "" && event !== null) {
                                                                                                RenderOtherAdditionsDetailedOpenState(index, true);
                                                                                            } else {
                                                                                                RenderOtherAdditionsDetailedOpenState(index, false);
                                                                                            }
                                                                                        }}
                                                                                        onChange={(event, value) => {
                                                                                            RenderOtherAdditionsDetailedOpenState(index, false);
                                                                                            if (value) {
                                                                                                formik.setFieldValue(`otherAdditionsReceived[${index}].detailed`, value.Name);
                                                                                            } else {
                                                                                                formik.setFieldValue(`otherAdditionsReceived[${index}].detailed`, "");
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) =>
                                                                                            RenderOtherAdditionsDetailedOpenState(index, false)
                                                                                        }
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="" variant="outlined" />
                                                                                        )}
                                                                                        onKeyDown={(e) => {
                                                                                            if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && otherAdditionsDetailedOpen === false) {
                                                                                                e.preventDefault();
                                                                                                RenderOtherAdditionsDetailedOpenState(index, false);
                                                                                            }
                                                                                            otherAdditionsKeyDownHandler(e);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>

                                                                            <td style={{ width: "40px" }}>
                                                                                <IconButton
                                                                                    variant="contained"
                                                                                    color="error"
                                                                                    className="kendo-action-btn"
                                                                                    onClick={() => {
                                                                                        setOtherAdditionsAmountTotal(otherAdditionsAmountTotal - formik.values.otherAdditionsReceived[index].amount);
                                                                                        remove(index);
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    ></FieldArray>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={2}>{t("جمع")}:</td>
                                                        <td>
                                                            <CurrencyInput
                                                                className="form-input"
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                                id="otherAdditionsAmountTotal"
                                                                disabled
                                                                value={otherAdditionsAmountTotal}
                                                                name={`otherAdditionsReceived.otherAdditionsAmountTotal`}
                                                                decimalsLimit={2}
                                                                autoComplete="off"
                                                            />
                                                        </td>

                                                        <td colSpan={3} />
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        {formik?.errors?.otherAdditionsReceived?.map(
                                            (error, index) => (
                                                <p className="error-msg" key={index}>
                                                    {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="content col-lg-6 col-12">

                                <div className="title">
                                    <span>{t("دلیل برگشتی")} :</span>
                                </div>

                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={revisionReasons}
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
                                                formik.setFieldValue('reversionReason', e.value)
                                            }}
                                        />

                                    </div>
                                </div>
                                <div className="title">
                                    <span>{t("مبلغ نهایی فاکتور")} </span>
                                </div>
                                <CurrencyInput
                                    className="form-input"
                                    id="allTotalSum"
                                    decimalsLimit={2}
                                    name="allTotalSum"
                                    disabled
                                    value={purchaseAllTotalSum}
                                    onBlur={formik.handleBlur}
                                    type="text"
                                />
                            </div>

                            <div className="content col-lg-6 col-12">
                                {/* Cash Payment Discount Grid */}
                                <div className="row align-items-center">
                                    <div className="content col-lg-6 col-6">
                                        <div className="title mb-0">
                                            <span className="span"> {t("تخفیف تسویه نقد")} :</span>
                                        </div>
                                    </div>
                                    <div className="content col-lg-6 col-6">
                                        {/* Copyright Ghafourian© Grid V3.0
                                                            All rights reserved */}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outlined"
                                                className="grid-add-btn"
                                                onClick={(e) => {
                                                    addCashPaymentDiscountRow();
                                                    setTimeout(() => {
                                                        let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                        while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                            added = findNextFocusable(added)
                                                        }
                                                        added.querySelector("input").focus()
                                                    }, 0);
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="content col-lg-12 col-12">
                                        <div className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>{t("ردیف")}</th>
                                                        <th>{t("مدت")}</th>
                                                        <th>{t("درصد")}</th>
                                                        <th>{t("مبلغ تخفیف")}</th>
                                                        <th>{t("حذف")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="cashPaymentDiscount"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik?.values?.cashPaymentDiscount?.map(
                                                                    (cashPaymentDiscount, index) => (
                                                                        <tr
                                                                            key={cashPaymentDiscount.formikId}
                                                                            onFocus={(e) => setCashPaymentDiscountFocusedRow(e.target.closest("tr").rowIndex)}
                                                                            className={cashPaymentDiscountFocusedRow === index + 1 ? "focus-row-bg" : ""}
                                                                        >
                                                                            <td className="text-center" style={{ verticalAlign: "middle", width: "40px" }}>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <input
                                                                                    className="form-input"
                                                                                    onKeyDown={(e) => cashPaymentDiscountKeyDownHandler(e)}
                                                                                    name={`cashPaymentDiscount.${index}.duration`}
                                                                                    type="text"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.cashPaymentDiscount[index].duration}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ minWidth: "120px" }}>
                                                                                <input
                                                                                    className="form-input"
                                                                                    onKeyDown={(e) => cashPaymentDiscountKeyDownHandler(e)}
                                                                                    name={`cashPaymentDiscount.${index}.percent`}
                                                                                    value={formik.values.cashPaymentDiscount[index].percent}
                                                                                    type="number"
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value) {
                                                                                            formik.setFieldValue(`cashPaymentDiscount[${index}].percent`,
                                                                                                parseFloat(e.target.value));

                                                                                            formik.setFieldValue(`cashPaymentDiscount[${index}].discountAmount`,
                                                                                                (preInvoiceAmountTotal * parseFloat(e.target.value)) / 100 || 0);

                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "120px", minWidth: "90px" }}>
                                                                                <CurrencyInput
                                                                                    onKeyDown={(e) => cashPaymentDiscountKeyDownHandler(e)}
                                                                                    className={`form-input `}
                                                                                    id="discountAmount"
                                                                                    name={`cashPaymentDiscount.${index}.discountAmount`}
                                                                                    value={formik.values.cashPaymentDiscount[index].discountAmount}
                                                                                    disabled
                                                                                    decimalsLimit={2}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "40px" }}>
                                                                                <IconButton
                                                                                    variant="contained"
                                                                                    color="error"
                                                                                    className="kendo-action-btn"
                                                                                    onClick={() => {
                                                                                        setOtherAdditionsAmountTotal(otherAdditionsAmountTotal - formik.values.otherAdditionsReceived[index].amount);
                                                                                        remove(index);
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    ></FieldArray>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div >
                    </form>
                </FormikProvider >
            </div >
            <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`}>
                <Button variant="contained" color="success"
                    type="button"
                    onClick={formik.handleSubmit}
                    tabIndex='13'
                >
                    {t("تایید")}
                </Button>

                <div className="Issuance">
                    <Button variant="contained"
                        style={{ marginRight: "5px" }}
                        color='error'
                        tabIndex={14}
                        onClick={cancel}>
                        {t("انصراف")}
                    </Button >
                </div>

                <Button variant="contained"
                    style={{ marginRight: "5px" }}
                    color='info'
                    disabled
                    tabIndex={15}
                    onClick={cancel}>
                    {t("ثبت و دریافت بلافاصله")}
                </Button >
            </div>
            <Modal
                open={batchModalOpen}
                onClose={() => setBatchModalOpen(false)}
            >
                <Box sx={style} style={{ width: '450px' }}>
                    <BatchModal getData={getPreInvoiceBatchModalData} closeModal={() => setBatchModalOpen(false)} />
                </Box>
            </Modal>
            <Modal
                open={descriptionModalOpen}
                onClose={() => setDescriptionModalOpen(false)}
            >
                <Box sx={style} style={{ width: '450px' }}>
                    <DescriptionModal getData={getDescriptionModalData} closeModal={() => setDescriptionModalOpen(false)} />
                </Box>
            </Modal>
        </>
    )
}


export default Edit
