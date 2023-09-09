import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import { julianIntToDate } from "../../../utils/dateConvert";
import * as Yup from "yup";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../utils/calenderLang";
import { cashDatagridCashLookup, itemsDatagridMeasurementUnitLookup, goodGiftDatagridLookup, } from "./datasources2";
import { Autocomplete, Box, Button, IconButton, TextField, useTheme, Modal, } from "@mui/material";
import swal from "sweetalert";
import { parsFloatFunction } from "../../../utils/parsFloatFunction";
import DatePicker from "react-multi-date-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyInput from "react-currency-input-field";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { history } from "../../../utils/history";
import shoppingData from "./dataForSharing.json";
import { AddTableRow, MoveBack, MoveForward, } from "../../../utils/gridKeyboardNavigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import series from "./series.json";
import BatchModal from "../../../components/Modals/BatchModal";

const emptyPurchase = {
  goods: "",
  buildSeries: "",
  expiredDate: "",
  unit: "",
  number: 0,
  amount: 0,
  fee: 0,
  closeFee: 0,
  price: 0,
  discountPercentage: 0,
  discountAmount: 0,
  brokenDiscount: 0,
  AfterDiscount: 0,
  percentageAddedTax: 0,
  amountAddedTax: 0,
  sum: 0,
  preFeeAverage: 0,
};
const emptyGift = {
  goods: "",
  buildSeries: "",
  expiredDate: "",
  unit: "",
  number: shoppingData[0].OrderCount,
  amount: 0,
  fee: 0,
  price: 0,
};
const emptyOtherDeductions = {
  title: "",
  moein: "",
  detailed: "",
  cash: "",
  amount: 0,
};
const emptyOtherAdditions = {
  title: "",
  moein: "",
  detailed: "",
  cash: "",
  amount: 0,
};

export default function ReceiptDocument() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "1px solid #eee",
    boxShadow: 24,
    p: 4,
    direction: i18n.dir(),
  };

  const dateRef = useRef();
  const date2Ref = useRef();
  const date3Ref = useRef();
  const [date, setDate] = useState(new DateObject());
  const [date2, setDate2] = useState(new DateObject());
  const [date3, setDate3] = useState(new DateObject());
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [container, setContainer] = useState([]);
  const [secondContainer, setSecondContainer] = useState([]);

  const currencyRef = useRef();

  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 100000),
      purchaseDate: julianIntToDate(new DateObject().toJulianDay()),
      maturityDate: julianIntToDate(new DateObject().toJulianDay()),
      deadLine: julianIntToDate(new DateObject().toJulianDay()),
      totalReceived: 0,
      acountSide: shoppingData[0].PartnerName,
      purchaseCode: shoppingData[0].OrderCode,
      collector: "",
      accountParty: "",
      receivedFrom: true,
      definedAccount: "",
      Description: shoppingData[0].OrderDescription,
      balance: 0,
      discountBrokenPercentage: 0,
      discountBrokenAmount: 0,
      purchaseReceived: [emptyPurchase],
      giftReceived: [emptyGift],
      otherDeductionsReceived: [emptyOtherDeductions],
      otherAdditionsReceived: [emptyOtherAdditions],
    },
    validationSchema: Yup.object({}),
    validateOnChange: false,
    onSubmit: (values) => {
      let allValues = values;

      DocumentSub();
      console.log("All Values:", allValues);
    },
  });

  const DocumentSub = () => {
    swal({
      title: t("سند با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };
  const tableError = () => {
    swal({
      title: t("خطاهای مشخص شده را برطرف کنید"),
      icon: "error",
      button: t("باشه"),
    });
  };

  // formik.values.purchaseReceived.forEach((item,index)=>{
  //   item.lsk
  // })

  function HandleTotalreceivedChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("totalreceived", parsFloatFunction(temp, 2));
  }

  function HandleBalanceChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("balance", parsFloatFunction(temp, 2));
  }

  const [chequeDues, setChequeDues] = useState(0);
  const [allPaymentsDues, setAllPaymentsDues] = useState(0);
  const [finalDues, setFinalDues] = useState(0);

  ///// purchase Grid \\\\\
  const purchaseGoodsRefs = useRef([]);
  const purchaseBuildSeriesRefs = useRef([]);
  const purchaseExpiredDateRefs = useRef([]);
  const purchaseUnitRefs = useRef([]);
  const purchaseNumberRefs = useRef([]);
  const purchaseFeeRefs = useRef([]);
  const purchaseCloseFeeRefs = useRef([]);
  const purchaseAmountRefs = useRef([]);
  const purchasePriceRefs = useRef([]);
  const purchaseDiscountPercentageRefs = useRef([]);
  const purchaseDiscountAmountRefs = useRef([]);
  const purchaseBrokenDiscountRefs = useRef([]);
  const purchaseAfterDiscountRefs = useRef([]);
  const purchasePercentageAddedTaxRefs = useRef([]);
  const purchaseAmountAddedTaxRefs = useRef([]);
  const purchaseSumRefs = useRef([]);
  const purchasePreFeeAverageRefs = useRef([]);

  const [purchaseFocusedRow, setPurchaseFocusedRow] = useState(1);

  const [purchaseGoodsOpen, setPurchaseGoodsOpen] = useState(false);
  const [purchaseBuildSeriesOpen, setPurchaseBuildSeriesOpen] = useState(false);
  const [purchaseUnitOpen, setPurchaseUnitOpen] = useState(false);

  function addPurchaseReceivedRow() {
    formik.setFieldValue("purchaseReceived", [
      ...formik.values.purchaseReceived,
      emptyPurchase,
    ]);
  }

  function RenderPurchaseGoodsOpenState(index, state) {
    if (index === purchaseFocusedRow - 1) {
      setPurchaseGoodsOpen(state);
    } else {
      setPurchaseGoodsOpen(false);
    }
  }

  function RenderPurchaseBuildSeriesOpenState(index, state) {
    if (index === purchaseFocusedRow - 1) {
      setPurchaseBuildSeriesOpen(state);
    } else {
      setPurchaseBuildSeriesOpen(false);
    }
  }

  function RenderPurchaseUnitOpenState(index, state) {
    if (index === purchaseFocusedRow - 1) {
      setPurchaseUnitOpen(state);
    } else {
      setPurchaseUnitOpen(false);
    }
  }

  function HandlePurchaseNumberChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].number`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseFeeChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].fee`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseCloseFeeChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].closeFee`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchasePriceChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].price`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseDiscountAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].discountAmount`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseBrokenDiscountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].brokenDiscount`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseAfterDiscountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].AfterDiscount`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseAmountAddedTaxChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `purchaseReceived[${index}].amountAddedTax`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandlePurchaseSumChange(index, value) {
    // let temp = value.replaceAll(",", "");
    // formik.setFieldValue(
    //     `purchaseReceived[${index}].sum`,
    //     parsFloatFunction(temp, 2)
    // );
  }

  function purchaseKeyDownHandler(e, index, currentElm, nextElm, previousElm) {
    if (
      e.keyCode === 40 &&
      purchaseGoodsOpen === false &&
      purchaseBuildSeriesOpen === false &&
      purchaseUnitOpen === false
    ) {
      /* Down Arrowkey */
      e.preventDefault();
      if (index === formik.values.purchaseReceived.length - 1) {
        AddTableRow(addPurchaseReceivedRow, currentElm, index);
      } else {
        currentElm.current[index + 1].focus();
        currentElm.current[index + 1].select();
      }
    }
    if (
      e.keyCode === 38 &&
      purchaseGoodsOpen === false &&
      purchaseBuildSeriesOpen === false &&
      purchaseUnitOpen === false
    ) {
      /* Up ArrowKey */
      e.preventDefault();
      currentElm.current[index - 1].focus();
      currentElm.current[index - 1].select();
    }

    if (e.keyCode === 39) {
      /* Right ArrowKey */
      e.preventDefault();
      i18n.dir() === "rtl"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.purchaseReceived,
          addPurchaseReceivedRow,
          currentElm,
          nextElm,
          index,
          18
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      e.preventDefault();
      i18n.dir() === "ltr"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.purchaseReceived,
          addPurchaseReceivedRow,
          currentElm,
          nextElm,
          index,
          18
        );
    }
    if (
      e.keyCode === 13 &&
      purchaseGoodsOpen === false &&
      purchaseBuildSeriesOpen === false &&
      purchaseUnitOpen === false
    ) {
      /* Enter */
      e.preventDefault();
      MoveForward(
        formik.values.purchaseReceived,
        addPurchaseReceivedRow,
        currentElm,
        nextElm,
        index,
        18
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      nextElm.current[index].focus();
    }
    if (e.keyCode === 9) {
      /* Tab */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveForward(
          formik.values.purchaseReceived,
          addPurchaseReceivedRow,
          currentElm,
          nextElm,
          index,
          18
        );
      } else {
        MoveBack(currentElm, previousElm, index);
      }
    }
  }

  const [purchaseNumberTotal, setPurchaseNumberTotal] = useState(0);
  const [purchaseAmountTotal, setPurchaseAmountTotal] = useState(0);
  const [purchaseFeeTotal, setPurchaseFeeTotal] = useState(0);
  const [purchaseCloseFeeTotal, setPurchaseCloseFeeTotal] = useState(0);
  const [purchasePriceTotal, setPurchasePriceTotal] = useState(0);
  const [purchaseDiscountAmountTotal, setPurchaseDiscountAmountTotal] =
    useState(0);
  const [purchaseBrokenDiscountTotal, setPurchaseBrokenDiscountTotal] =
    useState(0);
  const [purchaseAfterDiscountTotal, setPurchaseAfterDiscountTotal] =
    useState(0);
  const [purchaseAmountAddedTaxTotal, setPurchaseAmountAddedTaxTotal] =
    useState(0);
  const [purchaseSumTotal, setPurchaseSumTotal] = useState(0);
  const [purchaseAllTotalSum, setPurchaseAllTotalSum] = useState(0);

  function CalculatePurchaseNumberTotal() {
    let purchaseNumberTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseNumberTemp += element.number;
      setPurchaseNumberTotal(parsFloatFunction(purchaseNumberTemp, 2));
    });
  }

  function CalculatePurchaseFeeTotal() {
    let purchaseFeeTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseFeeTemp += element.fee;
      setPurchaseFeeTotal(parsFloatFunction(purchaseFeeTemp, 2));
    });
  }

  function CalculatePurchaseAmountTotal() {
    let purchaseAmountTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseAmountTemp += element.amount;
      setPurchaseAmountTotal(parsFloatFunction(purchaseAmountTemp, 2));
    });
  }

  function CalculatePurchasePriceTotal() {
    let purchasePriceTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchasePriceTemp += element.price;
      setPurchasePriceTotal(parsFloatFunction(purchasePriceTemp, 2));
    });
  }

  function CalculatePurchaseDiscountAmountTotal() {
    let purchaseDiscountAmountTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseDiscountAmountTemp += element.discountAmount;
      setPurchaseDiscountAmountTotal(
        parsFloatFunction(purchaseDiscountAmountTemp, 2)
      );
    });
  }

  function CalculatePurchaseBrokenDiscountTotal() {
    let purchaseBrokenDiscountTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseBrokenDiscountTemp += element.brokenDiscount;
      setPurchaseBrokenDiscountTotal(
        parsFloatFunction(purchaseBrokenDiscountTemp, 2)
      );
    });
  }

  function CalculatePurchaseAfterDiscountTotal() {
    let purchaseAfterDiscountTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseAfterDiscountTemp += element.AfterDiscount;
      setPurchaseAfterDiscountTotal(
        parsFloatFunction(purchaseAfterDiscountTemp, 2)
      );
    });
  }

  function CalculatePurchaseAmountAddedTaxTotal() {
    let purchaseAmountAddedTaxTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseAmountAddedTaxTemp += element.amountAddedTax;
      setPurchaseAmountAddedTaxTotal(
        parsFloatFunction(purchaseAmountAddedTaxTemp, 2)
      );
    });
  }

  function CalculatePurchaseSumTotal() {
    let purchaseSumTemp = 0;
    formik.values.purchaseReceived.forEach((element) => {
      purchaseSumTemp += element.sum;
      setPurchaseSumTotal(parsFloatFunction(purchaseSumTemp, 2));
    });
  }

  useEffect(() => {
    CalculatePurchaseDiscountAmountTotal();
    CalculatePurchaseBrokenDiscountTotal();
    CalculatePurchaseAfterDiscountTotal();
    CalculatePurchaseAmountAddedTaxTotal();
    CalculatePurchaseSumTotal();
    CalculatePurchasePriceTotal();
  }, [formik.values.purchaseReceived]);

  ///// End of purchase Grid \\\\\
  ///// Gift Grid \\\\\
  const giftGoodsRefs = useRef([]);
  const giftBuildSeriesRefs = useRef([]);
  const giftExpiredDateRefs = useRef([]);
  const giftUnitRefs = useRef([]);
  const giftNumberRefs = useRef([]);
  const giftFeeRefs = useRef([]);
  const giftAmountRefs = useRef([]);
  const giftPriceRefs = useRef([]);

  const [giftFocusedRow, setGiftFocusedRow] = useState(1);

  const [giftGoodsOpen, setGiftGoodsOpen] = useState(false);
  const [giftBuildSeriesOpen, setGiftBuildSeriesOpen] = useState(false);
  const [giftExpiredDateOpen, setGiftExpiredDateOpen] = useState(false);
  const [giftUnitOpen, setGiftUnitOpen] = useState(false);

  function addGiftReceivedRow() {
    formik.setFieldValue("giftReceived", [
      ...formik.values.giftReceived,
      emptyGift,
    ]);
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
    formik.setFieldValue(
      `giftReceived[${index}].number`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandleGiftAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `giftReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandleGiftFeeChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `giftReceived[${index}].fee`,
      parsFloatFunction(temp, 2)
    );
  }

  function HandleGiftPriceChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `giftReceived[${index}].price`,
      parsFloatFunction(temp, 2)
    );
  }

  function giftKeyDownHandler(e, index, currentElm, nextElm, previousElm) {
    if (
      e.keyCode === 40 &&
      giftGoodsOpen === false &&
      giftBuildSeriesOpen === false &&
      giftUnitOpen === false
    ) {
      /* Down Arrowkey */
      e.preventDefault();
      if (index === formik.values.giftReceived.length - 1) {
        AddTableRow(addGiftReceivedRow, currentElm, index);
      } else {
        currentElm.current[index + 1].focus();
        currentElm.current[index + 1].select();
      }
    }
    if (
      e.keyCode === 38 &&
      giftGoodsOpen === false &&
      giftBuildSeriesOpen === false &&
      giftUnitOpen === false
    ) {
      /* Up ArrowKey */
      e.preventDefault();
      currentElm.current[index - 1].focus();
      currentElm.current[index - 1].select();
    }

    if (e.keyCode === 39) {
      /* Right ArrowKey */
      e.preventDefault();
      i18n.dir() === "rtl"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.giftReceived,
          addGiftReceivedRow,
          currentElm,
          nextElm,
          index,
          9
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      e.preventDefault();
      i18n.dir() === "ltr"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.giftReceived,
          addGiftReceivedRow,
          currentElm,
          nextElm,
          index,
          9
        );
    }
    if (
      e.keyCode === 13 &&
      giftGoodsOpen === false &&
      giftBuildSeriesOpen === false &&
      giftUnitOpen === false
    ) {
      /* Enter */
      e.preventDefault();
      MoveForward(
        formik.values.giftReceived,
        addGiftReceivedRow,
        currentElm,
        nextElm,
        index,
        9
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      nextElm.current[index].focus();
    }
    if (e.keyCode === 9) {
      /* Tab */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveForward(
          formik.values.giftReceived,
          addGiftReceivedRow,
          currentElm,
          nextElm,
          index,
          9
        );
      } else {
        MoveBack(currentElm, previousElm, index);
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

  const getBatchModalData = (val) => {
    console.log("Send a request and make batch with these datas:", val);
  };
  ///// End of Gift Grid \\\\\
  ///// Other deductions Grid \\\\\
  const otherDeductionsTitleRefs = useRef([]);
  const otherDeductionsMoeinRefs = useRef([]);
  const otherDeductionsDetailedRefs = useRef([]);
  const otherDeductionsAmountRefs = useRef([]);

  const [otherDeductionsFocusedRow, setOtherDeductionsFocusedRow] = useState(1);

  const [otherDeductionsTitleOpen, setOtherDeductionsTitleOpen] =
    useState(false);
  const [otherDeductionsMoeinOpen, setOtherDeductionsMoeinOpen] =
    useState(false);
  const [otherDeductionsDetailedOpen, setOtherDeductionsDetailedOpen] =
    useState(false);

  function addOtherDeductionsReceivedRow() {
    formik.setFieldValue("otherDeductionsReceived", [
      ...formik.values.otherDeductionsReceived,
      emptyOtherDeductions,
    ]);
  }

  console.log("formi----------out-------", formik.values.purchaseReceived);

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

  function otherDeductionsKeyDownHandler(
    e,
    index,
    currentElm,
    nextElm,
    previousElm
  ) {
    if (
      e.keyCode === 40 &&
      otherDeductionsMoeinOpen === false &&
      otherDeductionsDetailedOpen === false
    ) {
      /* Down Arrowkey */
      e.preventDefault();
      if (index === formik.values.otherDeductionsReceived.length - 1) {
        AddTableRow(addOtherDeductionsReceivedRow, currentElm, index);
      } else {
        currentElm.current[index + 1].focus();
        currentElm.current[index + 1].select();
      }
    }
    if (
      e.keyCode === 38 &&
      otherDeductionsMoeinOpen === false &&
      otherDeductionsDetailedOpen === false
    ) {
      /* Up ArrowKey */
      e.preventDefault();
      currentElm.current[index - 1].focus();
      currentElm.current[index - 1].select();
    }

    if (e.keyCode === 39) {
      /* Right ArrowKey */
      e.preventDefault();
      i18n.dir() === "rtl"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.otherDeductionsReceived,
          addOtherDeductionsReceivedRow,
          currentElm,
          nextElm,
          index,
          4
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      e.preventDefault();
      i18n.dir() === "ltr"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.otherDeductionsReceived,
          addOtherDeductionsReceivedRow,
          currentElm,
          nextElm,
          index,
          4
        );
    }
    if (
      e.keyCode === 13 &&
      otherDeductionsMoeinOpen === false &&
      otherDeductionsDetailedOpen === false
    ) {
      /* Enter */
      e.preventDefault();
      MoveForward(
        formik.values.otherDeductionsReceived,
        addOtherDeductionsReceivedRow,
        currentElm,
        nextElm,
        index,
        4
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      nextElm.current[index].focus();
    }
    if (e.keyCode === 9) {
      /* Tab */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveForward(
          formik.values.otherDeductionsReceived,
          addOtherDeductionsReceivedRow,
          currentElm,
          nextElm,
          index,
          4
        );
      } else {
        MoveBack(currentElm, previousElm, index);
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
  const otherAdditionsTitleRefs = useRef([]);
  const otherAdditionsMoeinRefs = useRef([]);
  const otherAdditionsDetailedRefs = useRef([]);
  const otherAdditionsAmountRefs = useRef([]);

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

  function otherAdditionsKeyDownHandler(
    e,
    index,
    currentElm,
    nextElm,
    previousElm
  ) {
    if (
      e.keyCode === 40 &&
      otherAdditionsMoeinOpen === false &&
      otherAdditionsDetailedOpen === false
    ) {
      /* Down Arrowkey */
      e.preventDefault();
      if (index === formik.values.otherAdditionsReceived.length - 1) {
        AddTableRow(addOtherAdditionsReceivedRow, currentElm, index);
      } else {
        currentElm.current[index + 1].focus();
        currentElm.current[index + 1].select();
      }
    }
    if (
      e.keyCode === 38 &&
      otherAdditionsMoeinOpen === false &&
      otherAdditionsDetailedOpen === false
    ) {
      /* Up ArrowKey */
      e.preventDefault();
      currentElm.current[index - 1].focus();
      currentElm.current[index - 1].select();
    }

    if (e.keyCode === 39) {
      /* Right ArrowKey */
      e.preventDefault();
      i18n.dir() === "rtl"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.otherAdditionsReceived,
          addOtherAdditionsReceivedRow,
          currentElm,
          nextElm,
          index,
          4
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      e.preventDefault();
      i18n.dir() === "ltr"
        ? MoveBack(currentElm, previousElm, index)
        : MoveForward(
          formik.values.otherAdditionsReceived,
          addOtherAdditionsReceivedRow,
          currentElm,
          nextElm,
          index,
          4
        );
    }
    if (
      e.keyCode === 13 &&
      otherAdditionsMoeinOpen === false &&
      otherAdditionsDetailedOpen === false
    ) {
      /* Enter */
      e.preventDefault();
      MoveForward(
        formik.values.otherAdditionsReceived,
        addOtherAdditionsReceivedRow,
        currentElm,
        nextElm,
        index,
        4
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      nextElm.current[index].focus();
    }
    if (e.keyCode === 9) {
      /* Tab */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveForward(
          formik.values.otherAdditionsReceived,
          addOtherAdditionsReceivedRow,
          currentElm,
          nextElm,
          index,
          4
        );
      } else {
        MoveBack(currentElm, previousElm, index);
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

  const [maturityDate, setMaturityDate] = useState({});

  const callComponent = () => {
    history.navigate(`/buy/order`);
  };

  function getData(data) {
    console.log("getData data", data);
  }

  function AfterDiscount(value, index) {
    formik.setFieldValue(
      `purchaseReceived[${index}].discountAmount`,
      ((parseInt(value) || 0) / 100) *
      (parseInt(formik.values.purchaseReceived[index].price) || 0)
    );

    console.log("helllllllllllllllllo", formik.values.purchaseReceived[index]);
    formik.values.purchaseReceived.forEach((item, index) => {
      let tempPrice = item.price;
      let tempDiscount = item.discountAmount;
      formik.setFieldValue(
        `purchaseReceived[${index}].AfterDiscount`,
        (parseInt(item.price) || 0) -
        ((parseInt(item.discountPercentage) || 0) / 100) *
        (parseInt(item.price) || 0) -
        ((parseInt(tempPrice - tempDiscount) *
          parseInt(item.brokenDiscount)) /
          100 || 0)
      );
    });
  }

  useEffect(() => {
    if (
      formik.values.purchaseReceived?.length &&
      formik.values.otherDeductionsReceived?.length &&
      formik.values.otherAdditionsReceived?.length
    ) {
      let tempTotal = formik.values.purchaseReceived?.reduce(
        (acc, current) => acc + parseFloat(current.sum) || 0,
        0
      );
      let tempTotal2 = formik.values.otherDeductionsReceived?.reduce(
        (acc, current) => acc + parseFloat(current.amount) || 0,
        0
      );
      let tempTotal3 = formik.values.otherAdditionsReceived?.reduce(
        (acc, current) => acc + parseFloat(current.amount) || 0,
        0
      );
      setPurchaseAllTotalSum(tempTotal - tempTotal2 + tempTotal3);
    }
  }, [
    purchaseSumRefs.current,
    otherDeductionsAmountRefs.current,
    otherAdditionsAmountRefs.current,
    formik.values.purchaseReceived,
    formik.values.otherDeductionsReceived,
    formik.values.otherAdditionsReceived,
  ]);

  console.log("currencyRef.current", currencyRef.current);

  return (
    <>
      <div
        className="form-template"
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <div>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-design">
                <div className="row">
                  <div className="content col-6">
                    <div className="title">
                      <span> {t("شماره خرید")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="purchaseCode"
                          name="purchaseCode"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.purchaseCode}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-6">
                    <div className="title">
                      <span> {t("تاریخ خرید")}</span>
                    </div>
                    <div className="wrapper">
                      <div className="date-picker position-relative">
                        <DatePicker
                          name="date"
                          id="date"
                          ref={dateRef}
                          editable={false}
                          value={date}
                          calendar={renderCalendarSwitch(i18n.language)}
                          locale={renderCalendarLocaleSwitch(i18n.language)}
                          calendarPosition="bottom-right"
                          onBlur={formik.handleBlur}
                          onChange={(val) => {
                            setDate(val);
                            formik.setFieldValue(
                              "purchaseDate",
                              julianIntToDate(val.toJulianDay())
                            );
                          }}
                        />
                        <div
                          className={`modal-action-button  ${i18n.dir() === "ltr" ? "action-ltr" : ""
                            }`}
                        >
                          <div className="d-flex align-items-center justify-content-center">
                            <CalendarMonthIcon className="calendarButton" />
                          </div>
                        </div>
                      </div>
                      {formik.touched.date &&
                        formik.errors.date &&
                        !formik.values.date ? (
                        <div className="error-msg">{t(formik.errors.date)}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="content col-6">
                    <div className="title">
                      <span> {t("تاریخ سر‌رسید")}</span>
                    </div>
                    <div className="wrapper">
                      <div className="date-picker position-relative">
                        <DatePicker
                          name="date"
                          id="date"
                          ref={date2Ref}
                          editable={false}
                          value={date2}
                          calendar={renderCalendarSwitch(i18n.language)}
                          locale={renderCalendarLocaleSwitch(i18n.language)}
                          calendarPosition="bottom-right"
                          onBlur={formik.handleBlur}
                          onChange={(val) => {
                            setDate(val);
                            formik.setFieldValue(
                              "maturityDate",
                              julianIntToDate(val.toJulianDay())
                            );
                          }}
                        />
                        <div
                          className={`modal-action-button  ${i18n.dir() === "ltr" ? "action-ltr" : ""
                            }`}
                        >
                          <div className="d-flex align-items-center justify-content-center">
                            <CalendarMonthIcon className="calendarButton" />
                          </div>
                        </div>
                      </div>
                      {formik.touched.date &&
                        formik.errors.date &&
                        !formik.values.date ? (
                        <div className="error-msg">{t(formik.errors.date)}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="content col-6">
                    <div className="title">
                      <span> {t("طرف حساب")} </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          id="acountSide"
                          name="acountSide"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.acountSide}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="content col-6">
                    <div className="title">
                      <span> {t("مهلت تسویه")}</span>
                    </div>
                    <div className="wrapper">
                      <div className="date-picker position-relative">
                        <DatePicker
                          name="date"
                          id="date"
                          ref={date3Ref}
                          editable={false}
                          value={date3}
                          calendar={renderCalendarSwitch(i18n.language)}
                          locale={renderCalendarLocaleSwitch(i18n.language)}
                          calendarPosition="bottom-right"
                          onBlur={formik.handleBlur}
                          onChange={(val) => {
                            setDate(val);
                            formik.setFieldValue(
                              "deadLine",
                              julianIntToDate(val.toJulianDay())
                            );
                          }}
                        />
                        <div
                          className={`modal-action-button  ${i18n.dir() === "ltr" ? "action-ltr" : ""
                            }`}
                        >
                          <div className="d-flex align-items-center justify-content-center">
                            <CalendarMonthIcon className="calendarButton" />
                          </div>
                        </div>
                      </div>
                      {formik.touched.date &&
                        formik.errors.date &&
                        !formik.values.date ? (
                        <div className="error-msg">{t(formik.errors.date)}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="content col-6">
                    <div className="title">
                      <span>
                        {" "}
                        {t("توضیحات")} <span className="star">*</span>
                      </span>
                    </div>
                    <div className="wrapper">
                      <div>
                        <textarea
                          className="form-input"
                          id="documentDescription"
                          name="documentDescription"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.Description}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="content col-lg-12 col-12">
                    {/* Purchase Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span">
                            {" "}
                            {t("اقلام فاکتور خرید")} :
                          </span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={() => {
                              addPurchaseReceivedRow();
                              setTimeout(() => {
                                purchaseGoodsRefs.current[
                                  formik.values.purchaseReceived.length
                                ].focus();
                              }, 1);
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </div>
                      </div>
                      <div className="content col-lg-12 col-12">
                        <div
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
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
                                <th>{t("فی‌ریز")}</th>
                                <th>{t("فی‌بسته")}</th>
                                <th>{t("مبلغ")}</th>
                                <th>{t("درصد تخفیف")}</th>
                                <th>{t("مبلغ تخفیف")}</th>
                                <th>{t("تخفیف حجمی سر‌شکن شده")}</th>
                                <th>{t("پس از کسر تخفیف")}</th>
                                <th>{t("درصد مالیات ا.ا.")}</th>
                                <th>{t("مبلغ مالیات ا.ا.")}</th>
                                <th>{t("جمع")}</th>
                                <th>{t("میانگین فی قبلی")}</th>
                                <th>{t("حذف")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name="purchaseReceived"
                                render={({ push, remove }) => (
                                  <React.Fragment>
                                    {formik?.values?.purchaseReceived?.map(
                                      (purchaseReceives, index) => (
                                        <>
                                          <tr
                                            key={index}
                                            onFocus={(e) =>
                                              setPurchaseFocusedRow(
                                                e.target.closest("tr").rowIndex
                                              )
                                            }
                                            className={
                                              purchaseFocusedRow === index + 1
                                                ? "focus-row-bg"
                                                : ""
                                            }
                                          >
                                            <td
                                              className="text-center"
                                              style={{
                                                verticalAlign: "middle",
                                                width: "40px",
                                              }}
                                            >
                                              {index + 1}
                                            </td>

                                            <td style={{ minWidth: "120px" }}>
                                              <div
                                                className={`table-autocomplete `}
                                              >
                                                <Autocomplete
                                                  ref={(el) => {
                                                    purchaseGoodsRefs.current[
                                                      index
                                                    ] =
                                                      el?.firstChild.firstChild.firstChild;
                                                  }}
                                                  id="goods"
                                                  name={`purchaseReceived.${index}.goods`}
                                                  options={
                                                    goodGiftDatagridLookup
                                                  }
                                                  renderOption={(
                                                    props,
                                                    option
                                                  ) => (
                                                    <Box
                                                      component="li"
                                                      {...props}
                                                    >
                                                      {option.Name}
                                                    </Box>
                                                  )}
                                                  getOptionLabel={(option) =>
                                                    option.Name
                                                  }
                                                  componentsProps={{
                                                    paper: {
                                                      sx: {
                                                        width: 200,
                                                        maxWidth: "90vw",
                                                        direction: i18n.dir(),
                                                        position: "absolute",
                                                        fontSize: "12px",
                                                        right:
                                                          i18n.dir() === "rtl"
                                                            ? "0"
                                                            : "unset",
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
                                                    purchaseFocusedRow ===
                                                      index + 1
                                                      ? purchaseGoodsOpen
                                                      : false
                                                  }
                                                  noOptionsText={t(
                                                    "اطلاعات یافت نشد"
                                                  )}
                                                  onInputChange={(
                                                    event,
                                                    value
                                                  ) => {
                                                    if (
                                                      value !== "" &&
                                                      event !== null
                                                    ) {
                                                      RenderPurchaseGoodsOpenState(
                                                        index,
                                                        true
                                                      );
                                                    } else {
                                                      RenderPurchaseGoodsOpenState(
                                                        index,
                                                        false
                                                      );
                                                    }
                                                  }}
                                                  onChange={(event, value) => {
                                                    RenderPurchaseGoodsOpenState(
                                                      index,
                                                      false
                                                    );
                                                    if (value) {
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].goods`,
                                                        value.Name
                                                      );
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].number`,
                                                        value.Count
                                                      );
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].fee`,
                                                        value.Fee
                                                      );
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].closeFee`,
                                                        value.CloseFee
                                                      );
                                                    } else {
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].goods`,
                                                        ""
                                                      );
                                                    }
                                                  }}
                                                  onBlur={(e) =>
                                                    RenderPurchaseGoodsOpenState(
                                                      index,
                                                      false
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      label=""
                                                      variant="outlined"
                                                    />
                                                  )}
                                                  onKeyDown={(e) => {
                                                    if (
                                                      (e.keyCode === 13 ||
                                                        e.keyCode === 9 ||
                                                        e.keyCode === 38 ||
                                                        e.keyCode === 40 ||
                                                        e.keyCode === 37 ||
                                                        e.keyCode === 39) &&
                                                      purchaseGoodsOpen[
                                                      index
                                                      ] === false
                                                    ) {
                                                      e.preventDefault();
                                                      RenderPurchaseGoodsOpenState(
                                                        index,
                                                        false
                                                      );
                                                    }
                                                    purchaseKeyDownHandler(
                                                      e,
                                                      index,
                                                      purchaseGoodsRefs,
                                                      purchaseBuildSeriesRefs,
                                                      purchasePreFeeAverageRefs
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                width: "150px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <div
                                                className={`table-autocomplete `}
                                              >
                                                <Autocomplete
                                                  ref={(el) => {
                                                    purchaseBuildSeriesRefs.current[
                                                      index
                                                    ] =
                                                      el?.firstChild.firstChild.firstChild;
                                                  }}
                                                  disabled={
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .goods === ""
                                                  }
                                                  componentsProps={{
                                                    paper: {
                                                      sx: {
                                                        width: 150,
                                                        maxWidth: "90vw",
                                                        direction: i18n.dir(),
                                                        position: "absolute",
                                                        fontSize: "12px",
                                                        right:
                                                          i18n.dir() === "rtl"
                                                            ? "0"
                                                            : "unset",
                                                      },
                                                    },
                                                  }}
                                                  sx={{
                                                    direction: i18n.dir(),
                                                    position: "relative",
                                                    background:
                                                      formik.values
                                                        .purchaseReceived[index]
                                                        .goods !== ""
                                                        ? "#e9ecefd2"
                                                        : "white",
                                                    borderRadius: 0,
                                                    fontSize: "12px",
                                                  }}
                                                  id="buildSeries"
                                                  name={`purchaseReceived.${index}.buildSeries`}
                                                  options={series}
                                                  renderOption={(
                                                    props,
                                                    option
                                                  ) => (
                                                    <Box
                                                      component="li"
                                                      {...props}
                                                    >
                                                      {option.ExpirationDate}-
                                                      {option.BatchNumber}
                                                    </Box>
                                                  )}
                                                  getOptionLabel={(option) =>
                                                    option.BatchNumber
                                                  }
                                                  size="small"
                                                  disableClearable={true}
                                                  forcePopupIcon={false}
                                                  open={
                                                    purchaseFocusedRow ===
                                                      index + 1
                                                      ? purchaseBuildSeriesOpen
                                                      : false
                                                  }
                                                  noOptionsText={t(
                                                    "اطلاعات یافت نشد"
                                                  )}
                                                  onInputChange={(
                                                    event,
                                                    value
                                                  ) => {
                                                    if (
                                                      value !== "" &&
                                                      event !== null
                                                    ) {
                                                      RenderPurchaseBuildSeriesOpenState(
                                                        index,
                                                        true
                                                      );
                                                    } else {
                                                      RenderPurchaseBuildSeriesOpenState(
                                                        index,
                                                        false
                                                      );
                                                    }
                                                  }}
                                                  onChange={(event, value) => {
                                                    RenderPurchaseBuildSeriesOpenState(
                                                      index,
                                                      false
                                                    );
                                                    formik.setFieldValue(
                                                      `purchaseReceived[${index}].buildSeries`,
                                                      value.BatchNumber
                                                    );

                                                    formik.setFieldValue(
                                                      `purchaseReceived[${index}].expiredDate`,
                                                      value.ExpirationDate
                                                    );
                                                  }}
                                                  onBlur={(e) =>
                                                    RenderPurchaseBuildSeriesOpenState(
                                                      index,
                                                      false
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      label=""
                                                      variant="outlined"
                                                    />
                                                  )}
                                                  onKeyDown={(e) => {
                                                    if (
                                                      (e.keyCode === 13 ||
                                                        e.keyCode === 9 ||
                                                        e.keyCode === 38 ||
                                                        e.keyCode === 40 ||
                                                        e.keyCode === 37 ||
                                                        e.keyCode === 39) &&
                                                      purchaseBuildSeriesOpen[
                                                      index
                                                      ] === false
                                                    ) {
                                                      e.preventDefault();
                                                      RenderPurchaseBuildSeriesOpenState(
                                                        index,
                                                        false
                                                      );
                                                    }
                                                    purchaseKeyDownHandler(
                                                      e,
                                                      index,
                                                      purchaseBuildSeriesRefs,
                                                      purchaseUnitRefs,
                                                      purchaseGoodsRefs
                                                    );
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
                                            <td
                                              style={{
                                                width: "150px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <div>
                                                <DatePicker
                                                  style={{ direction: "ltr" }}
                                                  name={`purchaseReceived.${index}.expiredDate`}
                                                  id="expiredDate"
                                                  ref={(el) =>
                                                  (purchaseExpiredDateRefs.current[
                                                    index
                                                  ] =
                                                    el?.firstChild.firstChild)
                                                  }
                                                  disabled
                                                  calendar={renderCalendarSwitch(
                                                    i18n.language
                                                  )}
                                                  locale={renderCalendarLocaleSwitch(
                                                    i18n.language
                                                  )}
                                                  calendarPosition="bottom-right"
                                                  onOpen={false}
                                                  value={
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .expiredDate !== ""
                                                      ? new DateObject(
                                                        formik.values.purchaseReceived[
                                                          index
                                                        ].expiredDate
                                                      )
                                                      : ""
                                                  }
                                                  onOpenPickNewDate={false}
                                                />
                                              </div>
                                            </td>
                                            <td style={{ minWidth: "120px" }}>
                                              <div
                                                className={`table-autocomplete `}
                                              >
                                                <Autocomplete
                                                  ref={(el) => {
                                                    purchaseUnitRefs.current[
                                                      index
                                                    ] =
                                                      el?.firstChild.firstChild.firstChild;
                                                  }}
                                                  id="unit"
                                                  name={`purchaseReceived.${index}.unit`}
                                                  // value={{ Name: "باکس" }}
                                                  options={
                                                    itemsDatagridMeasurementUnitLookup
                                                  }
                                                  renderOption={(
                                                    props,
                                                    option
                                                  ) => (
                                                    <Box
                                                      component="li"
                                                      {...props}
                                                    >
                                                      {option.Code} -
                                                      {option.Name}
                                                    </Box>
                                                  )}
                                                  filterOptions={(
                                                    options,
                                                    state
                                                  ) => {
                                                    let newOptions = [];
                                                    options.forEach(
                                                      (element) => {
                                                        if (
                                                          element.Code.includes(
                                                            state.inputValue.toLowerCase()
                                                          ) ||
                                                          element.Name.replace(
                                                            "/",
                                                            ""
                                                          )
                                                            .toLowerCase()
                                                            .includes(
                                                              state.inputValue.toLowerCase()
                                                            )
                                                        )
                                                          newOptions.push(
                                                            element
                                                          );
                                                      }
                                                    );
                                                    return newOptions;
                                                  }}
                                                  getOptionLabel={(option) =>
                                                    option.Name
                                                  }
                                                  componentsProps={{
                                                    paper: {
                                                      sx: {
                                                        width: 200,
                                                        maxWidth: "90vw",
                                                        direction: i18n.dir(),
                                                        position: "absolute",
                                                        fontSize: "12px",
                                                        right:
                                                          i18n.dir() === "rtl"
                                                            ? "0"
                                                            : "unset",
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
                                                    purchaseFocusedRow ===
                                                      index + 1
                                                      ? purchaseUnitOpen
                                                      : false
                                                  }
                                                  noOptionsText={t(
                                                    "اطلاعات یافت نشد"
                                                  )}
                                                  onInputChange={(
                                                    event,
                                                    value
                                                  ) => {
                                                    if (
                                                      value !== "" &&
                                                      event !== null
                                                    ) {
                                                      RenderPurchaseUnitOpenState(
                                                        index,
                                                        true
                                                      );
                                                    } else {
                                                      RenderPurchaseUnitOpenState(
                                                        index,
                                                        false
                                                      );
                                                    }
                                                  }}
                                                  onChange={(event, value) => {
                                                    RenderPurchaseUnitOpenState(
                                                      index,
                                                      false
                                                    );
                                                    if (value) {
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].unit`,
                                                        value.Code
                                                      );
                                                      let temp =
                                                        secondContainer;
                                                      temp[index] =
                                                        value.Coefficient;
                                                      setSecondContainer(temp);
                                                      setTimeout(() => {
                                                        formik.setFieldValue(
                                                          `purchaseReceived[${index}].amount`,
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].number
                                                          ) * value.Coefficient
                                                        );
                                                        formik.setFieldValue(
                                                          `purchaseReceived[${index}].price`,
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].number
                                                          ) *
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].closeFee
                                                          )
                                                        );
                                                        formik.setFieldValue(
                                                          `purchaseReceived[${index}].AfterDiscount`,
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].number
                                                          ) *
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].closeFee
                                                          ) -
                                                          parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].discountAmount
                                                          ) -
                                                          parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].brokenDiscount
                                                          )
                                                        );

                                                        console.log(
                                                          "formi-----------------",
                                                          formik.values
                                                            .purchaseReceived[
                                                          index
                                                          ]
                                                        );

                                                        formik.setFieldValue(
                                                          `purchaseReceived[${index}].sum`,
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].number
                                                          ) *
                                                          parseInt(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].closeFee
                                                          ) -
                                                          parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].discountAmount
                                                          ) -
                                                          parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].brokenDiscount
                                                          ) +
                                                          parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].amountAddedTax
                                                          )
                                                        );
                                                      }, 100);
                                                    } else {
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].unit`,
                                                        ""
                                                      );
                                                    }
                                                  }}
                                                  onBlur={(e) =>
                                                    RenderPurchaseUnitOpenState(
                                                      index,
                                                      false
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      label=""
                                                      variant="outlined"
                                                    />
                                                  )}
                                                  onKeyDown={(e) => {
                                                    if (
                                                      (e.keyCode === 13 ||
                                                        e.keyCode === 9 ||
                                                        e.keyCode === 38 ||
                                                        e.keyCode === 40 ||
                                                        e.keyCode === 37 ||
                                                        e.keyCode === 39) &&
                                                      purchaseUnitOpen[
                                                      index
                                                      ] === false
                                                    ) {
                                                      e.preventDefault();
                                                      RenderPurchaseUnitOpenState(
                                                        index,
                                                        false
                                                      );
                                                    }
                                                    purchaseKeyDownHandler(
                                                      e,
                                                      index,
                                                      purchaseUnitRefs,
                                                      purchaseNumberRefs,
                                                      purchaseExpiredDateRefs
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseNumberRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseNumberRefs,
                                                    purchaseAmountRefs,
                                                    purchaseUnitRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="number"
                                                name={`purchaseReceived.${index}.number`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .number
                                                }
                                                decimalsLimit={2}
                                                onChange={(e, value) => {
                                                  HandlePurchaseNumberChange(
                                                    index,
                                                    e.target.value
                                                  );
                                                  formik.setFieldValue(
                                                    `purchaseReceived[${index}].price`,
                                                    parseInt(e.target.value) *
                                                    parseInt(
                                                      formik.values
                                                        .purchaseReceived[
                                                        index
                                                      ].closeFee
                                                    )
                                                  );
                                                  let temp = secondContainer;
                                                  temp[index] =
                                                    value.Coefficient;
                                                  setSecondContainer(temp);
                                                  formik.setFieldValue(
                                                    `purchaseReceived[${index}].amount`,
                                                    parseInt(
                                                      formik.values
                                                        .purchaseReceived[index]
                                                        .number
                                                    ) * value.Coefficient
                                                  );
                                                }}
                                                // onBlur={() => {
                                                //     CalculatePurchaseNumberTotal();
                                                // }}
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseAmountRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseAmountRefs,
                                                    purchaseFeeRefs,
                                                    purchaseNumberRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="number"
                                                name={`purchaseReceived.${index}.amount`}
                                                disabled
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .amount
                                                }
                                                decimalsLimit={2}
                                                onChange={(e) =>
                                                  HandlePurchaseAmountChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                // onBlur={() =>
                                                //     CalculatePurchaseAmountTotal()
                                                // }
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseFeeRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseFeeRefs,
                                                    purchaseCloseFeeRefs,
                                                    purchaseAmountRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="fee"
                                                name={`purchaseReceived.${index}.fee`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index].fee
                                                }
                                                decimalsLimit={2}
                                                onChange={(e) =>
                                                  HandlePurchaseFeeChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                // onBlur={() =>
                                                //     CalculatePurchaseFeeTotal()
                                                // }
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseCloseFeeRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseCloseFeeRefs,
                                                    purchasePriceRefs,
                                                    purchaseFeeRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="closeFee"
                                                name={`purchaseReceived.${index}.closeFee`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .closeFee
                                                }
                                                decimalsLimit={2}
                                                onChange={(e) =>
                                                  HandlePurchaseCloseFeeChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                onBlur={formik.handleBlur}
                                                autoComplete="off"
                                              />
                                            </td>

                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchasePriceRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchasePriceRefs,
                                                    purchaseDiscountPercentageRefs,
                                                    purchaseCloseFeeRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="price"
                                                name={`purchaseReceived.${index}.price`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .price
                                                }
                                                disabled
                                                decimalsLimit={2}
                                                onChange={(e) =>
                                                  HandlePurchasePriceChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                // onBlur={() =>
                                                //     CalculatePurchasePriceTotal()
                                                // }
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td style={{ minWidth: "120px" }}>
                                              <input
                                                ref={(el) =>
                                                (purchaseDiscountPercentageRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                className="form-input"
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseDiscountPercentageRefs,
                                                    purchaseDiscountAmountRefs,
                                                    purchasePriceRefs
                                                  )
                                                }
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .discountPercentage
                                                }
                                                name={`purchaseReceived.${index}.discountPercentage`}
                                                type="number"
                                                onChange={(e) => {
                                                  if (e.target.value) {
                                                    AfterDiscount(
                                                      e.target.value,
                                                      index
                                                    );
                                                    if (e.target.value) {
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].discountPercentage`,
                                                        parseFloat(
                                                          e.target.value
                                                        )
                                                      );

                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].AfterDiscount`,
                                                        ((parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].price
                                                        ) || 0) -
                                                          (parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].price
                                                          ) *
                                                            parseFloat(
                                                              e.target.value
                                                            )) /
                                                          100 || 0) -
                                                        (parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].brokenDiscount
                                                        ) || 0)
                                                      );

                                                      let AfterDiscountTemp =
                                                        ((parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].price
                                                        ) || 0) -
                                                          (parseFloat(
                                                            formik.values
                                                              .purchaseReceived[
                                                              index
                                                            ].price
                                                          ) *
                                                            parseFloat(
                                                              e.target.value
                                                            )) /
                                                          100 || 0) -
                                                        (parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].brokenDiscount
                                                        ) || 0);

                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].discountAmount`,
                                                        (parseFloat(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].price
                                                        ) *
                                                          parseFloat(
                                                            e.target.value
                                                          )) /
                                                        100 || 0
                                                      );
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].sum`,
                                                        AfterDiscountTemp +
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].amountAddedTax || 0
                                                      );
                                                      // CalculatePurchaseDiscountAmountTotal();
                                                    }
                                                  }
                                                }}
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseDiscountAmountRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseDiscountAmountRefs,
                                                    purchaseBrokenDiscountRefs,
                                                    purchaseDiscountPercentageRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                id="price"
                                                name={`purchaseReceived.${index}.discountAmount`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .discountAmount
                                                }
                                                decimalsLimit={2}
                                                onChange={(e) => {
                                                  if (e.target.value) {
                                                    HandlePurchaseDiscountAmountChange(
                                                      index,
                                                      e.target.value
                                                    );
                                                    formik.setFieldValue(
                                                      `purchaseReceived[${index}].discountPercentage`,
                                                      (parsFloatFunction(
                                                        e.target.value.replaceAll(
                                                          ",",
                                                          ""
                                                        ),
                                                        2
                                                      ) *
                                                        100) /
                                                      formik.values
                                                        .purchaseReceived[
                                                        index
                                                      ].price
                                                    );
                                                    formik.setFieldValue(
                                                      `purchaseReceived[${index}].AfterDiscount`,
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].price
                                                      ) || 0) -
                                                      (parsFloatFunction(
                                                        e.target.value.replaceAll(
                                                          ",",
                                                          ""
                                                        ),
                                                        2
                                                      ) || 0) -
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].brokenDiscount
                                                      ) || 0)
                                                    );
                                                    let AfterDiscountTemp =
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].price
                                                      ) || 0) -
                                                      (parsFloatFunction(
                                                        e.target.value.replaceAll(
                                                          ",",
                                                          ""
                                                        ),
                                                        2
                                                      ) || 0) -
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].brokenDiscount
                                                      ) || 0);
                                                    formik.setFieldValue(
                                                      `purchaseReceived[${index}].sum`,
                                                      AfterDiscountTemp +
                                                      formik.values
                                                        .purchaseReceived[
                                                        index
                                                      ].amountAddedTax || 0
                                                    );

                                                    // CalculatePurchaseDiscountAmountTotal();
                                                  }
                                                }}
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseBrokenDiscountRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseBrokenDiscountRefs,
                                                    purchaseAfterDiscountRefs,
                                                    purchaseDiscountAmountRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="price"
                                                name={`purchaseReceived.${index}.brokenDiscount`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .brokenDiscount
                                                }
                                                disabled
                                                decimalsLimit={2}
                                                onChange={(e) => {
                                                  if (e.target.value) {
                                                    HandlePurchaseBrokenDiscountChange(
                                                      index,
                                                      e.target.value
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) => {
                                                  if (e.target.value) {
                                                    formik.setFieldValue(
                                                      `purchaseReceived[${index}].AfterDiscount`,
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].price
                                                      ) || 0) -
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].discountAmount
                                                      ) || 0) -
                                                      (parseInt(
                                                        formik.values
                                                          .purchaseReceived[
                                                          index
                                                        ].brokenDiscount
                                                      ) || 0)
                                                    );
                                                    // CalculatePurchaseBrokenDiscountTotal();
                                                  }
                                                }}
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseAfterDiscountRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseAfterDiscountRefs,
                                                    purchasePercentageAddedTaxRefs,
                                                    purchaseBrokenDiscountRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="price"
                                                disabled
                                                name={`purchaseReceived.${index}.AfterDiscount`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .AfterDiscount
                                                }
                                                decimalsLimit={2}
                                                onChange={(e) =>
                                                  HandlePurchaseAfterDiscountChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                // onBlur={() =>
                                                //     CalculatePurchaseAfterDiscountTotal()
                                                // }
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td style={{ minWidth: "120px" }}>
                                              <input
                                                ref={(el) =>
                                                (purchasePercentageAddedTaxRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                className="form-input"
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchasePercentageAddedTaxRefs,
                                                    purchaseAmountAddedTaxRefs,
                                                    purchaseAfterDiscountRefs
                                                  )
                                                }
                                                name={`purchaseReceived.${index}.percentageAddedTax`}
                                                type="text"
                                                onChange={(e) => {
                                                  console.log(
                                                    "hhhhhhhhhhhhhhhhhh",
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .AfterDiscount
                                                  );
                                                  if (e.target.value) {
                                                    setTimeout(() => {
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].amountAddedTax`,
                                                        (parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].AfterDiscount
                                                        ) *
                                                          parseInt(
                                                            e.target.value
                                                          )) /
                                                        100
                                                      );
                                                      formik.setFieldValue(
                                                        `purchaseReceived[${index}].sum`,
                                                        parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].AfterDiscount
                                                        ) +
                                                        (parseInt(
                                                          formik.values
                                                            .purchaseReceived[
                                                            index
                                                          ].AfterDiscount
                                                        ) *
                                                          parseInt(
                                                            e.target.value
                                                          )) /
                                                        100
                                                      );
                                                    }, 100);
                                                  }
                                                }}
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseAmountAddedTaxRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseAmountAddedTaxRefs,
                                                    purchaseSumRefs,
                                                    purchasePercentageAddedTaxRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="price"
                                                name={`purchaseReceived.${index}.amountAddedTax`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .amountAddedTax
                                                }
                                                decimalsLimit={2}
                                                onChange={(e) =>
                                                  HandlePurchaseAmountAddedTaxChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                // onBlur={() =>
                                                //     CalculatePurchaseAmountAddedTaxTotal()
                                                // }
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "120px",
                                                minWidth: "90px",
                                              }}
                                            >
                                              <CurrencyInput
                                                ref={(el) =>
                                                (purchaseSumRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchaseSumRefs,
                                                    purchasePreFeeAverageRefs,
                                                    purchaseAmountAddedTaxRefs
                                                  )
                                                }
                                                className={`form-input `}
                                                style={{ width: "100%" }}
                                                id="price"
                                                name={`purchaseReceived.${index}.sum`}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index].sum
                                                }
                                                decimalsLimit={2}
                                                // onChange={(e) =>
                                                //     HandlePurchaseSumChange(
                                                //         index,
                                                //         e.target.value
                                                //     )
                                                // }
                                                // onBlur={() =>
                                                //     CalculatePurchaseSumTotal()
                                                // }
                                                autoComplete="off"
                                              />
                                            </td>
                                            <td style={{ minWidth: "120px" }}>
                                              <input
                                                ref={(el) =>
                                                (purchasePreFeeAverageRefs.current[
                                                  index
                                                ] = el)
                                                }
                                                className="form-input"
                                                onKeyDown={(e) =>
                                                  purchaseKeyDownHandler(
                                                    e,
                                                    index,
                                                    purchasePreFeeAverageRefs,
                                                    purchaseGoodsRefs,
                                                    purchaseSumRefs
                                                  )
                                                }
                                                name={`purchaseReceived.${index}.preFeeAverage`}
                                                type="text"
                                                onChange={formik.handleChange}
                                                value={
                                                  formik.values
                                                    .purchaseReceived[index]
                                                    .preFeeAverage
                                                }
                                                autoComplete="off"
                                              />
                                            </td>

                                            <td style={{ width: "40px" }}>
                                              <IconButton
                                                variant="contained"
                                                color="error"
                                                className="kendo-action-btn"
                                                onClick={() => {
                                                  setPurchaseNumberTotal(
                                                    purchaseNumberTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .number
                                                  );
                                                  setPurchaseAmountTotal(
                                                    purchaseAmountTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .amount
                                                  );
                                                  setPurchaseFeeTotal(
                                                    purchaseFeeTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .fee
                                                  );
                                                  setPurchaseCloseFeeTotal(
                                                    purchaseCloseFeeTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .closeFee
                                                  );
                                                  setPurchasePriceTotal(
                                                    purchasePriceTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .price
                                                  );
                                                  setPurchaseDiscountAmountTotal(
                                                    purchaseDiscountAmountTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .discountAmount
                                                  );
                                                  setPurchaseBrokenDiscountTotal(
                                                    purchaseBrokenDiscountTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .brokenDiscount
                                                  );
                                                  setPurchaseAfterDiscountTotal(
                                                    purchaseAfterDiscountTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .AfterDiscount
                                                  );
                                                  setPurchaseAmountAddedTaxTotal(
                                                    purchaseAmountAddedTaxTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .amountAddedTax
                                                  );
                                                  setPurchaseSumTotal(
                                                    purchaseSumTotal -
                                                    formik.values
                                                      .purchaseReceived[index]
                                                      .sum
                                                  );
                                                  remove(index);
                                                }}
                                              >
                                                <DeleteIcon />
                                              </IconButton>
                                            </td>
                                          </tr>
                                          {/* <div
                                            style={{
                                              position: "absolute",
                                              top: "49%",
                                              height: "50px",
                                            }}
                                            className="content col-lg-12 col-5 d-flex justify-content-center"
                                          >
                                            <div className="row align-items-center">
                                              <div className="content col-lg-4 col-md-4 col-12">
                                                <div className="title">
                                                  <span>
                                                    {" "}
                                                    {t("تخفیف حجمی")}{" "}
                                                  </span>
                                                </div>
                                                <div className="wrapper">
                                                  <div>
                                                    <input
                                                      className="form-input"
                                                      type="text"
                                                      id="id"
                                                      name="id"
                                                      style={{ width: "100%" }}
                                                      onChange={
                                                        (e) => {
                                                          if(e.target.value){
                                                            setTimeout(()=>{
                                                              formik.setFieldValue(
                                                                `purchaseReceived[${index}].brokenDiscount`,
                                                           (parseInt(formik.values.purchaseReceived[index].sum))*((parseInt(formik.values.purchaseReceived[index].discountPercentage)/100)) -
                                                           (parseInt(formik.values.purchaseReceived[index].sum))*(((parseInt(e.target.value))/100))
                                                          //  hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
                                                              )
                                                            },100)
                                                          }
                                                        }
                                                      }
                                                      onBlur={formik.handleBlur}
                                                      placeholder="%"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="content col-lg-4 col-md-4 col-12">
                                                <div className="title">
                                                  <span> {t("‌")} </span>
                                                </div>
                                                <div className="wrapper">
                                                  <div>
                                                    <input
                                                      className="form-input"
                                                      type="text"
                                                      id="id"
                                                      name="id"
                                                      style={{ width: "100%" }}
                                                      value={formik.values.purchaseReceived[index].brokenDiscount}
                                                      onChange={
                                                        formik.handleChange
                                                      }
                                                      onBlur={formik.handleBlur}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div> */}
                                          {/* <div
                                            className="content col-lg-2 col-md-4 col-12 d-flex justify-content-center"
                                            style={{
                                              position: "absolute",
                                              top: "52%",
                                              // height: "20px",
                                            }}
                                          >
                                            <span style={{ fontSize: "10px" }}>
                                              {t("جمع کل")}{" "}
                                            </span>
                                            <input
                                              className="form-input"
                                              id="total"
                                              name="total"
                                              style={{ height: "100%" }}
                                              onBlur={formik.handleBlur}
                                              value={
                                                formik.values.purchaseReceived[
                                                  index
                                                ].sum
                                              }
                                              type="text"
                                            />
                                          </div> */}
                                        </>
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
                                <td></td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="price"
                                    disabled
                                    value={purchasePriceTotal}
                                    name={`purchaseReceived.purchasePriceTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td />
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="discountAmount"
                                    disabled
                                    value={purchaseDiscountAmountTotal}
                                    name={`purchaseReceived.purchaseDiscountAmountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="brokenDiscount"
                                    disabled
                                    value={purchaseBrokenDiscountTotal}
                                    name={`purchaseReceived.purchaseBrokenDiscountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="afterDiscount"
                                    disabled
                                    value={purchaseAfterDiscountTotal}
                                    name={`purchaseReceived.purchaseAfterDiscountTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td />
                                {/* here */}
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="amountAddedTax"
                                    disabled
                                    value={purchaseAmountAddedTaxTotal}
                                    name={`purchaseReceived.purchaseAmountAddedTaxTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td>
                                  <CurrencyInput
                                    className="form-input"
                                    style={{ width: "100%" }}
                                    id="sum"
                                    disabled
                                    value={purchaseSumTotal}
                                    name={`purchaseReceived.purchaseSumTotal`}
                                    decimalsLimit={2}
                                    autoComplete="off"
                                  />
                                </td>
                                <td />
                                <td />
                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        {formik?.errors?.purchaseReceived?.map(
                          (error, index) => (
                            <p className="error-msg" key={index}>
                              {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {/* herererrer */}
                  <div className="row">
                    <div className="content col-lg-6 col-12">
                      <div className="title">
                        <span>{t("جمع مبلغ کالا‌ها")} </span>
                      </div>

                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="totalPrice"
                        disabled
                        value={purchasePriceTotal}
                        name="totalPrice"
                        decimalsLimit={2}
                        autoComplete="off"
                      />
                    </div>
                    <div className="content col-lg-6 col-12">
                      <div className="title">
                        <span>{t("جمع تخفیفات سطری")} </span>
                      </div>

                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="discountAmountTotal"
                        disabled
                        value={purchaseDiscountAmountTotal}
                        name="discountAmountTotal"
                        decimalsLimit={2}
                        autoComplete="off"
                      />
                    </div>
                    <div className="content col-lg-3 col-12">
                      <div className="title">
                        <span>{t("تخفیف حجمی")}</span>
                      </div>

                      <input
                        className="form-input"
                        id="discountBrokenPercentage"
                        name="discountBrokenPercentage"
                        value={parseFloat(formik.values.discountBrokenPercentage, 2)}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          if (e.target.value) {
                            formik.setFieldValue(
                              "discountBrokenPercentage",
                              e.target.value
                            );
                            formik.values.purchaseReceived.forEach(
                              (item, index) => {
                                let tempPrice = item.price;
                                let tempDiscount = item.discountAmount;
                                formik.setFieldValue(
                                  `purchaseReceived[${index}].brokenDiscount`,
                                  (parseInt(tempPrice - tempDiscount) *
                                    parseInt(e.target.value)) /
                                  100
                                );
                                let AfterDiscountTemp =
                                  (parseInt(tempPrice) || 0) -
                                  ((parseInt(tempPrice) *
                                    parseInt(item.discountPercentage)) /
                                    100 || 0) -
                                  (parseInt(
                                    ((parseInt(tempPrice) -
                                      parseInt(tempDiscount)) *
                                      parseInt(e.target.value)) /
                                    100 || 0
                                  ) || 0);
                                formik.setFieldValue(
                                  `purchaseReceived[${index}].AfterDiscount`,
                                  (parseInt(tempPrice) || 0) -
                                  ((parseInt(tempPrice) *
                                    parseInt(item.discountPercentage)) /
                                    100 || 0) -
                                  (parseInt(
                                    ((parseInt(tempPrice) -
                                      parseInt(tempDiscount)) *
                                      parseInt(e.target.value)) /
                                    100 || 0
                                  ) || 0)
                                );
                                formik.setFieldValue(
                                  `purchaseReceived[${index}].sum`,
                                  parseInt(item.AfterDiscount) +
                                  (parseInt(item.AfterDiscount) *
                                    parseInt(e.target.value)) /
                                  100
                                );
                                formik.setFieldValue(
                                  `purchaseReceived[${index}].sum`,
                                  AfterDiscountTemp +
                                  formik.values.purchaseReceived[index]
                                    .amountAddedTax || 0
                                );
                              }
                            );
                          }
                        }}
                        type="text"
                        placeholder="%"
                      />
                    </div>
                    <div className="content col-lg-3 col-12" ref={currencyRef}>
                      <div className="title">
                        <span>{t("‌")} </span>
                      </div>

                      <input
                        className="form-input"
                        style={{ width: "100%" }}
                        id="total"
                        onChange={(e) => {
                          console.log(
                            "eeeeeeeeeeeee",
                            parsFloatFunction(
                              e.target.value.replaceAll(",", ""),
                              2
                            )
                          );
                          if (e.target.value) {
                            if (
                              e.target.value[e.target.value.length - 1] !== "."
                            ) {
                              setPurchaseBrokenDiscountTotal(
                                parsFloatFunction(
                                  e.target.value.replaceAll(",", ""),
                                  2
                                )
                              );
                              console.log(
                                "purchasePriceTotal-purchaseDiscountAmountTotal",
                                purchasePriceTotal - purchaseDiscountAmountTotal
                              );
                              formik.setFieldValue(
                                "discountBrokenPercentage", parseFloat(
                                  (parsFloatFunction(
                                    e.target.value.replaceAll(",", ""),
                                    2
                                  ) || 0) / (
                                    (purchasePriceTotal -
                                      purchaseDiscountAmountTotal) || 1) * 100, 2)
                              );
                            } else {
                              setPurchaseBrokenDiscountTotal(
                                e.target.value.replaceAll(",", "")
                              );
                            }
                            // (parseFloat(formik.values.))
                            // (parsFloatFunction(  e.target.value.replaceAll(',',''), 2)*100)/(formik.values.purchaseReceived[index].price)
                          }
                        }}
                        value={purchaseBrokenDiscountTotal.toLocaleString()}
                        name="total"
                        // decimalsLimit={2}
                        // step={1}
                        autoComplete="off"
                      />
                      {console.log(
                        "purchaseBrokenDiscountTotal:",
                        purchaseBrokenDiscountTotal
                      )}
                    </div>
                    <div className="content col-lg-6 col-12">
                      <div className="title">
                        <span>{t("جمع مالیات ا.ا")} </span>
                      </div>

                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="amountAddedTaxTotal"
                        disabled
                        value={purchaseAmountAddedTaxTotal}
                        name="amountAddedTaxTotal"
                        decimalsLimit={2}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* end of hererererrere */}
                  <div className="content col-lg-12 col-12 ">
                    {/* Gift Grid */}
                    <div className="row align-items-center">
                      <div className="content col-lg-6 col-6">
                        <div className="title mb-0">
                          <span className="span"> {t("اقلام اشانتیون")} :</span>
                        </div>
                      </div>
                      <div className="content col-lg-6 col-6">
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={() => {
                              addGiftReceivedRow();
                              setTimeout(() => {
                                giftGoodsRefs.current[
                                  formik.values.giftReceived.length
                                ].focus();
                              }, 1);
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </div>
                      </div>
                      <div className="content col-lg-12 col-12">
                        <div
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
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
                                        <tr
                                          key={index}
                                          onFocus={(e) =>
                                            setGiftFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            giftFocusedRow === index + 1
                                              ? "focus-row-bg"
                                              : ""
                                          }
                                        >
                                          <td
                                            className="text-center"
                                            style={{
                                              verticalAlign: "middle",
                                              width: "40px",
                                            }}
                                          >
                                            {index + 1}
                                          </td>

                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  giftGoodsRefs.current[index] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                id="goods"
                                                name={`giftReceived.${index}.goods`}
                                                options={goodGiftDatagridLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
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
                                                  giftFocusedRow === index + 1
                                                    ? giftGoodsOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderGiftGoodsOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderGiftGoodsOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderGiftGoodsOpenState(
                                                    index,
                                                    false
                                                  );
                                                  if (value) {
                                                    formik.setFieldValue(
                                                      `giftReceived[${index}].goods`,
                                                      value.Name
                                                    );
                                                    formik.setFieldValue(
                                                      `giftReceived[${index}].fee`,
                                                      value.Fee
                                                    );
                                                  } else {
                                                    formik.setFieldValue(
                                                      `giftReceived[${index}].goods`,
                                                      ""
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) =>
                                                  RenderGiftGoodsOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    giftGoodsOpen[index] ===
                                                    false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderGiftGoodsOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  giftKeyDownHandler(
                                                    e,
                                                    index,
                                                    giftGoodsRefs,
                                                    giftBuildSeriesRefs,
                                                    giftPriceRefs
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td
                                            style={{
                                              width: "150px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  giftBuildSeriesRefs.current[
                                                    index
                                                  ] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                disabled={
                                                  formik.values.giftReceived[
                                                    index
                                                  ].goods === ""
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 150,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
                                                    },
                                                  },
                                                }}
                                                sx={{
                                                  direction: i18n.dir(),
                                                  position: "relative",
                                                  background:
                                                    formik.values.giftReceived[
                                                      index
                                                    ].goods !== ""
                                                      ? "#e9ecefd2"
                                                      : "white",
                                                  borderRadius: 0,
                                                  fontSize: "12px",
                                                }}
                                                id="buildSeries"
                                                name={`giftReceived.${index}.buildSeries`}
                                                options={series}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.ExpirationDate}-
                                                    {option.BatchNumber}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.BatchNumber
                                                }
                                                size="small"
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                open={
                                                  giftFocusedRow === index + 1
                                                    ? giftBuildSeriesOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderGiftBuildSeriesOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderGiftBuildSeriesOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderGiftBuildSeriesOpenState(
                                                    index,
                                                    false
                                                  );
                                                  formik.setFieldValue(
                                                    `giftReceived[${index}].buildSeries`,
                                                    value.BatchNumber
                                                  );

                                                  formik.setFieldValue(
                                                    `giftReceived[${index}].expiredDate`,
                                                    value.ExpirationDate
                                                  );
                                                }}
                                                onBlur={(e) =>
                                                  RenderGiftBuildSeriesOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    giftBuildSeriesOpen[
                                                    index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderGiftBuildSeriesOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  giftKeyDownHandler(
                                                    e,
                                                    index,
                                                    giftBuildSeriesRefs,
                                                    giftUnitRefs,
                                                    giftGoodsRefs
                                                  );
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
                                          <td
                                            style={{
                                              width: "150px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <div>
                                              <DatePicker
                                                style={{ direction: "ltr" }}
                                                name={`giftReceived.${index}.expiredDate`}
                                                id="expiredDate"
                                                ref={(el) =>
                                                (giftExpiredDateRefs.current[
                                                  index
                                                ] = el?.firstChild.firstChild)
                                                }
                                                disabled
                                                calendar={renderCalendarSwitch(
                                                  i18n.language
                                                )}
                                                locale={renderCalendarLocaleSwitch(
                                                  i18n.language
                                                )}
                                                calendarPosition="bottom-right"
                                                onOpen={false}
                                                value={
                                                  formik.values.giftReceived[
                                                    index
                                                  ].expiredDate !== ""
                                                    ? new DateObject(
                                                      formik.values.giftReceived[
                                                        index
                                                      ].expiredDate
                                                    )
                                                    : ""
                                                }
                                                onOpenPickNewDate={false}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  giftUnitRefs.current[index] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                id="unit"
                                                name={`giftReceived.${index}.unit`}
                                                options={
                                                  itemsDatagridMeasurementUnitLookup
                                                }
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Code} -{option.Name}
                                                  </Box>
                                                )}
                                                filterOptions={(
                                                  options,
                                                  state
                                                ) => {
                                                  let newOptions = [];
                                                  options.forEach((element) => {
                                                    if (
                                                      element.Code.includes(
                                                        state.inputValue.toLowerCase()
                                                      ) ||
                                                      element.Name.replace(
                                                        "/",
                                                        ""
                                                      )
                                                        .toLowerCase()
                                                        .includes(
                                                          state.inputValue.toLowerCase()
                                                        )
                                                    )
                                                      newOptions.push(element);
                                                  });
                                                  return newOptions;
                                                }}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
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
                                                  giftFocusedRow === index + 1
                                                    ? giftUnitOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderGiftUnitOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderGiftUnitOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderGiftUnitOpenState(
                                                    index,
                                                    false
                                                  );
                                                  if (value) {
                                                    formik.setFieldValue(
                                                      `giftReceived[${index}].unit`,
                                                      value.Code
                                                    );
                                                    let temp = container;
                                                    temp[index] =
                                                      value.Coefficient;
                                                    setContainer(temp);
                                                    setTimeout(() => {
                                                      formik.setFieldValue(
                                                        `giftReceived[${index}].amount`,
                                                        parseInt(
                                                          formik.values
                                                            .giftReceived[index]
                                                            .number
                                                        ) * value.Coefficient
                                                      );
                                                      formik.setFieldValue(
                                                        `giftReceived[${index}].price`,
                                                        parseInt(
                                                          formik.values
                                                            .giftReceived[index]
                                                            .fee
                                                        ) *
                                                        formik.values
                                                          .giftReceived[index]
                                                          .number
                                                      );
                                                    }, 100);
                                                  } else {
                                                    formik.setFieldValue(
                                                      `giftReceived[${index}].unit`,
                                                      ""
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) =>
                                                  RenderGiftUnitOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    giftUnitOpen[index] ===
                                                    false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderGiftUnitOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  giftKeyDownHandler(
                                                    e,
                                                    index,
                                                    giftUnitRefs,
                                                    giftNumberRefs,
                                                    giftExpiredDateRefs
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              ref={(el) =>
                                              (giftNumberRefs.current[index] =
                                                el)
                                              }
                                              onKeyDown={(e) =>
                                                giftKeyDownHandler(
                                                  e,
                                                  index,
                                                  giftNumberRefs,
                                                  giftAmountRefs,
                                                  giftUnitRefs
                                                )
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="number"
                                              name={`giftReceived.${index}.number`}
                                              value={
                                                formik.values.giftReceived[
                                                  index
                                                ].number
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleGiftNumberChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() => {
                                                formik.setFieldValue(
                                                  `giftReceived[${index}].amount`,
                                                  parseInt(
                                                    formik.values.giftReceived[
                                                      index
                                                    ].number
                                                  ) * container[index]
                                                );
                                                formik.setFieldValue(
                                                  `giftReceived[${index}].price`,
                                                  parseInt(
                                                    formik.values.giftReceived[
                                                      index
                                                    ].number
                                                  ) *
                                                  parseInt(
                                                    formik.values
                                                      .giftReceived[index].fee
                                                  )
                                                );
                                              }}
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              ref={(el) =>
                                              (giftAmountRefs.current[index] =
                                                el)
                                              }
                                              onKeyDown={(e) =>
                                                giftKeyDownHandler(
                                                  e,
                                                  index,
                                                  giftAmountRefs,
                                                  giftFeeRefs,
                                                  giftNumberRefs
                                                )
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="number"
                                              name={`giftReceived.${index}.amount`}
                                              value={
                                                formik.values.giftReceived[
                                                  index
                                                ].amount
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleGiftAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateGiftAmountTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              ref={(el) =>
                                              (giftFeeRefs.current[index] =
                                                el)
                                              }
                                              onKeyDown={(e) =>
                                                giftKeyDownHandler(
                                                  e,
                                                  index,
                                                  giftFeeRefs,
                                                  giftPriceRefs,
                                                  giftAmountRefs
                                                )
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="fee"
                                              name={`giftReceived.${index}.fee`}
                                              value={
                                                formik.values.giftReceived[
                                                  index
                                                ].fee
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleGiftFeeChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateGiftFeeTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              ref={(el) =>
                                              (giftPriceRefs.current[index] =
                                                el)
                                              }
                                              onKeyDown={(e) =>
                                                giftKeyDownHandler(
                                                  e,
                                                  index,
                                                  giftPriceRefs,
                                                  giftGoodsRefs,
                                                  giftFeeRefs
                                                )
                                              }
                                              className={`form-input `}
                                              style={{ width: "100%" }}
                                              id="price"
                                              name={`giftReceived.${index}.price`}
                                              value={
                                                formik.values.giftReceived[
                                                  index
                                                ].price
                                              }
                                              decimalsLimit={2}
                                              onChange={(e) =>
                                                HandleGiftPriceChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateGiftPriceTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>

                                          <td style={{ width: "40px" }}>
                                            <IconButton
                                              variant="contained"
                                              color="error"
                                              className="kendo-action-btn"
                                              onClick={() => {
                                                setGiftPriceTotal(
                                                  giftPriceTotal -
                                                  formik.values.giftReceived[
                                                    index
                                                  ].price
                                                );
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
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={() => {
                              addOtherDeductionsReceivedRow();
                              setTimeout(() => {
                                otherDeductionsTitleRefs.current[
                                  formik.values.otherDeductionsReceived.length
                                ].focus();
                              }, 1);
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </div>
                      </div>
                      <div className="content col-lg-12 col-12">
                        <div
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
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
                                          key={index}
                                          onFocus={(e) =>
                                            setOtherDeductionsFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            otherDeductionsFocusedRow ===
                                              index + 1
                                              ? "focus-row-bg"
                                              : ""
                                          }
                                        >
                                          <td
                                            className="text-center"
                                            style={{
                                              verticalAlign: "middle",
                                              width: "40px",
                                            }}
                                          >
                                            {index + 1}
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              ref={(el) =>
                                              (otherDeductionsTitleRefs.current[
                                                index
                                              ] = el)
                                              }
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                otherDeductionsKeyDownHandler(
                                                  e,
                                                  index,
                                                  otherDeductionsTitleRefs,
                                                  otherDeductionsAmountRefs,
                                                  otherDeductionsDetailedRefs
                                                )
                                              }
                                              name={`otherDeductionsReceived.${index}.title`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values
                                                  .otherDeductionsReceived[
                                                  index
                                                ].title
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              ref={(el) =>
                                              (otherDeductionsAmountRefs.current[
                                                index
                                              ] = el)
                                              }
                                              onKeyDown={(e) =>
                                                otherDeductionsKeyDownHandler(
                                                  e,
                                                  index,
                                                  otherDeductionsAmountRefs,
                                                  otherDeductionsMoeinRefs,
                                                  otherDeductionsTitleRefs
                                                )
                                              }
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
                                              onChange={(e) =>
                                                HandleOtherDeductionsAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateOtherDeductionsAmountTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  otherDeductionsMoeinRefs.current[
                                                    index
                                                  ] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                id="moein"
                                                clearIcon={false}
                                                name={`otherDeductionsReceived.${index}.moein`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
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
                                                  otherDeductionsFocusedRow ===
                                                    index + 1
                                                    ? otherDeductionsMoeinOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderOtherDeductionsMoeinOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderOtherDeductionsMoeinOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderOtherDeductionsMoeinOpenState(
                                                    index,
                                                    false
                                                  );
                                                  if (value) {
                                                    formik.setFieldValue(
                                                      `otherDeductionsReceived[${index}].moein`,
                                                      value.Name
                                                    );
                                                  } else {
                                                    formik.setFieldValue(
                                                      `otherDeductionsReceived[${index}].moein`,
                                                      ""
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) =>
                                                  RenderOtherDeductionsMoeinOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    otherDeductionsMoeinOpen[
                                                    index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderOtherDeductionsMoeinOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  otherDeductionsKeyDownHandler(
                                                    e,
                                                    index,
                                                    otherDeductionsMoeinRefs,
                                                    otherDeductionsDetailedRefs,
                                                    otherDeductionsAmountRefs
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  otherDeductionsDetailedRefs.current[
                                                    index
                                                  ] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                id="detailed"
                                                clearIcon={false}
                                                name={`otherDeductionsReceived.${index}.detailed`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
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
                                                  otherDeductionsFocusedRow ===
                                                    index + 1
                                                    ? otherDeductionsDetailedOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderOtherDeductionsDetailedOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderOtherDeductionsDetailedOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderOtherDeductionsDetailedOpenState(
                                                    index,
                                                    false
                                                  );
                                                  if (value) {
                                                    formik.setFieldValue(
                                                      `otherDeductionsReceived[${index}].detailed`,
                                                      value.Name
                                                    );
                                                  } else {
                                                    formik.setFieldValue(
                                                      `otherDeductionsReceived[${index}].detailed`,
                                                      ""
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) =>
                                                  RenderOtherDeductionsDetailedOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    otherDeductionsDetailedOpen[
                                                    index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderOtherDeductionsDetailedOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  otherDeductionsKeyDownHandler(
                                                    e,
                                                    index,
                                                    otherDeductionsDetailedRefs,
                                                    otherDeductionsTitleRefs,
                                                    otherDeductionsMoeinRefs
                                                  );
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
                                                setOtherDeductionsAmountTotal(
                                                  otherDeductionsAmountTotal -
                                                  formik.values
                                                    .otherDeductionsReceived[
                                                    index
                                                  ].amount
                                                );
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

                                <td />
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
                        {/* Copyright Ghafourian© Grid V2.1
                                                            All rights reserved */}
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outlined"
                            className="grid-add-btn"
                            onClick={() => {
                              addOtherAdditionsReceivedRow();
                              setTimeout(() => {
                                otherAdditionsTitleRefs.current[
                                  formik.values.otherAdditionsReceived.length
                                ].focus();
                              }, 1);
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </div>
                      </div>
                      <div className="content col-lg-12 col-12">
                        <div
                          className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""
                            }`}
                        >
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
                                          key={index}
                                          onFocus={(e) =>
                                            setOtherAdditionsFocusedRow(
                                              e.target.closest("tr").rowIndex
                                            )
                                          }
                                          className={
                                            otherAdditionsFocusedRow ===
                                              index + 1
                                              ? "focus-row-bg"
                                              : ""
                                          }
                                        >
                                          <td
                                            className="text-center"
                                            style={{
                                              verticalAlign: "middle",
                                              width: "40px",
                                            }}
                                          >
                                            {index + 1}
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <input
                                              ref={(el) =>
                                              (otherAdditionsTitleRefs.current[
                                                index
                                              ] = el)
                                              }
                                              className="form-input"
                                              onKeyDown={(e) =>
                                                otherDeductionsKeyDownHandler(
                                                  e,
                                                  index,
                                                  otherAdditionsTitleRefs,
                                                  otherAdditionsAmountRefs,
                                                  otherAdditionsDetailedRefs
                                                )
                                              }
                                              name={`otherAdditionsReceived.${index}.title`}
                                              type="text"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values
                                                  .otherAdditionsReceived[index]
                                                  .title
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              width: "120px",
                                              minWidth: "90px",
                                            }}
                                          >
                                            <CurrencyInput
                                              ref={(el) =>
                                              (otherAdditionsAmountRefs.current[
                                                index
                                              ] = el)
                                              }
                                              onKeyDown={(e) =>
                                                otherAdditionsKeyDownHandler(
                                                  e,
                                                  index,
                                                  otherAdditionsAmountRefs,
                                                  otherAdditionsMoeinRefs,
                                                  otherAdditionsTitleRefs
                                                )
                                              }
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
                                              onChange={(e) =>
                                                HandleOtherAdditionsAmountChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={() =>
                                                CalculateOtherAdditionsAmountTotal()
                                              }
                                              autoComplete="off"
                                            />
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  otherAdditionsMoeinRefs.current[
                                                    index
                                                  ] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                id="moein"
                                                clearOnBlur={true}
                                                name={`otherAdditionsReceived.${index}.moein`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
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
                                                open={
                                                  otherAdditionsFocusedRow ===
                                                    index + 1
                                                    ? otherAdditionsMoeinOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderOtherAdditionsMoeinOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderOtherAdditionsMoeinOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderOtherAdditionsMoeinOpenState(
                                                    index,
                                                    false
                                                  );
                                                  if (value) {
                                                    formik.setFieldValue(
                                                      `otherAdditionsReceived[${index}].moein`,
                                                      value.Name
                                                    );
                                                  } else {
                                                    formik.setFieldValue(
                                                      `otherAdditionsReceived[${index}].moein`,
                                                      ""
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) =>
                                                  RenderOtherAdditionsMoeinOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    otherAdditionsMoeinOpen[
                                                    index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderOtherAdditionsMoeinOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  otherAdditionsKeyDownHandler(
                                                    e,
                                                    index,
                                                    otherAdditionsMoeinRefs,
                                                    otherAdditionsDetailedRefs,
                                                    otherAdditionsAmountRefs
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td style={{ minWidth: "120px" }}>
                                            <div
                                              className={`table-autocomplete `}
                                            >
                                              <Autocomplete
                                                ref={(el) => {
                                                  otherAdditionsDetailedRefs.current[
                                                    index
                                                  ] =
                                                    el?.firstChild.firstChild.firstChild;
                                                }}
                                                id="detailed"
                                                clearIcon={false}
                                                name={`otherAdditionsReceived.${index}.detailed`}
                                                options={cashDatagridCashLookup}
                                                renderOption={(
                                                  props,
                                                  option
                                                ) => (
                                                  <Box
                                                    component="li"
                                                    {...props}
                                                  >
                                                    {option.Name}
                                                  </Box>
                                                )}
                                                getOptionLabel={(option) =>
                                                  option.Name
                                                }
                                                componentsProps={{
                                                  paper: {
                                                    sx: {
                                                      width: 200,
                                                      maxWidth: "90vw",
                                                      direction: i18n.dir(),
                                                      position: "absolute",
                                                      fontSize: "12px",
                                                      right:
                                                        i18n.dir() === "rtl"
                                                          ? "0"
                                                          : "unset",
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
                                                  otherAdditionsFocusedRow ===
                                                    index + 1
                                                    ? otherAdditionsDetailedOpen
                                                    : false
                                                }
                                                noOptionsText={t(
                                                  "اطلاعات یافت نشد"
                                                )}
                                                onInputChange={(
                                                  event,
                                                  value
                                                ) => {
                                                  if (
                                                    value !== "" &&
                                                    event !== null
                                                  ) {
                                                    RenderOtherAdditionsDetailedOpenState(
                                                      index,
                                                      true
                                                    );
                                                  } else {
                                                    RenderOtherAdditionsDetailedOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                }}
                                                onChange={(event, value) => {
                                                  RenderOtherAdditionsDetailedOpenState(
                                                    index,
                                                    false
                                                  );
                                                  if (value) {
                                                    formik.setFieldValue(
                                                      `otherAdditionsReceived[${index}].detailed`,
                                                      value.Name
                                                    );
                                                  } else {
                                                    formik.setFieldValue(
                                                      `otherAdditionsReceived[${index}].detailed`,
                                                      ""
                                                    );
                                                  }
                                                }}
                                                onBlur={(e) =>
                                                  RenderOtherAdditionsDetailedOpenState(
                                                    index,
                                                    false
                                                  )
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label=""
                                                    variant="outlined"
                                                  />
                                                )}
                                                onKeyDown={(e) => {
                                                  if (
                                                    (e.keyCode === 13 ||
                                                      e.keyCode === 9 ||
                                                      e.keyCode === 38 ||
                                                      e.keyCode === 40 ||
                                                      e.keyCode === 37 ||
                                                      e.keyCode === 39) &&
                                                    otherAdditionsDetailedOpen[
                                                    index
                                                    ] === false
                                                  ) {
                                                    e.preventDefault();
                                                    RenderOtherAdditionsDetailedOpenState(
                                                      index,
                                                      false
                                                    );
                                                  }
                                                  otherAdditionsKeyDownHandler(
                                                    e,
                                                    index,
                                                    otherAdditionsDetailedRefs,
                                                    otherAdditionsTitleRefs,
                                                    otherAdditionsMoeinRefs
                                                  );
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
                                                setOtherAdditionsAmountTotal(
                                                  otherAdditionsAmountTotal -
                                                  formik.values
                                                    .otherAdditionsReceived[
                                                    index
                                                  ].amount
                                                );
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

                                <td />
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

                  <div className="row d-flex justify-content-center">
                    <div className="content col-lg-3 col-12">
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
                  </div>
                </div>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
      <div>
        <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
          <Button
            variant="contained"
            color="success"
            type="button"
            onClick={formik.handleSubmit}
          >
            {t("ثبت تغییرات")}
          </Button>

          <div className="Issuance">
            <Button
              variant="contained"
              color="error"
              onClick={callComponent}
              style={{ marginRight: "10px" }}
            >
              {t("انصراف")}
            </Button>
          </div>
        </div>
      </div>
      <Modal open={batchModalOpen} onClose={() => setBatchModalOpen(false)}>
        <Box sx={style} style={{ width: "450px" }}>
          <BatchModal
            getData={getBatchModalData}
            closeModal={() => setBatchModalOpen(false)}
          />
        </Box>
      </Modal>
    </>
  );
}
