import React, { useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome, CurrencyCell, TotalTitle,IndexCell,DateCell } from "rkgrid";
import { Box, Button, Dialog, DialogContent, DialogContentText, FormControlLabel, FormGroup, IconButton, Modal, Switch, Tooltip, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { history } from '../../../../utils/history';
import { FormikProvider, useFormik } from "formik";
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
import cheque from '../../../WareHouse/Sale/ReturnFromDistribution/Validate/Edit/cheque.json'
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import BatchModal from "../../../../components/Modals/BatchModal";
import DescriptionModal from "../../../../components/Modals/DescriptionModal";
import Guid from 'devextreme/core/guid';
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../../utils/gridKeyboardNav3";
import settleList from "../../../sale/SalePhone/settleList.json";
import WareHouse from './WareHouse.json'
import WareHouser from './WareHouser.json'

const AddSaleProforma = () => {
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
            WareHouser: "",
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
            WareHouse: "",
            cashReward: 0,
            resendingCost: 0,
            giftReceived: [emptyGift],
            otherDeductionsReceived: [emptyOtherDeductions],
            otherAdditionsReceived: [emptyOtherAdditions],
            reversionReason: "",
            ShipImmediately: false,
            cashPaymentDiscount: [emptyCashPaymentDiscount]
        },
        validationSchema: Yup.object({
            SaleDate: Yup.date().required("انتخاب تاریخ الزامی است"),


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
        history.navigate("/Sell/Order")
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
                            <div className="col-lg-2 col-md-6 col-12" style={{ marginTop: "35px" }}>
                                <label className='d-flex align-items-center '>
                                    <input
                                        className="form-input"
                                        type="checkBox"
                                        id="ShipImmediately"
                                        name="ShipImmediately"
                                        style={{ width: "15px", margin: `${i18n.dir() == 'rtl' ? '0 0 0 8px' : '0 8px 0 0'}` }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.ShipImmediately}
                                        checked={formik.values.ShipImmediately}
                                    />
                                    {t("ارسال بلافاصله")}
                                </label>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("انبار")}</span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={WareHouse}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            className='selectBox'
                                            searchEnabled={true}
                                            showClearButton
                                            disabled={!formik.values.ShipImmediately}
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={function (item) {
                                                return item && item.Code + ' - ' + item.Name;
                                            }}
                                            displayValue='Name'
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('WareHouse', e.value)
                                            }}
                                        />

                                        {formik.touched.WareHouse && formik.errors.WareHouse &&
                                            !formik.values.WareHouse ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.WareHouse)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("انباردار")}</span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={WareHouser}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            className='selectBox'
                                            searchEnabled={true}
                                            showClearButton
                                            disabled={!formik.values.ShipImmediately}
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={function (item) {
                                                return item && item.Code + ' - ' + item.Name;
                                            }}
                                            displayValue='Name'
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('WareHouser', e.value)
                                            }}
                                        />

                                        {formik.touched.WareHouser && formik.errors.WareHouser &&
                                            !formik.values.WareHouse ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.WareHouser)}
                                            </div>
                                        ) : null}
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
                    disabled={!formik.values.ShipImmediately}
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


export default AddSaleProforma
