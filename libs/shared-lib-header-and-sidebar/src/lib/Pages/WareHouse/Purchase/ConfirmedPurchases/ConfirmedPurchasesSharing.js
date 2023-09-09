import { history } from "../../../../utils/history";
import { Box, Modal, TextField } from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DateObject from "react-date-object";
import { julianIntToDate } from "../../../../utils/dateConvert";
import * as Yup from "yup";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import Typography from "@mui/material/Typography";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch, } from "../../../../utils/calenderLang";
import swal from "sweetalert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import { receivingWarehouses, storeKeepers } from "./datasources";
import { SelectBox } from "devextreme-react";
import { useTheme, Button, IconButton, } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGridSharing from "./dataForGridSharing.json";
import dataForGridSharing2 from "./dataForGridSharing2.json";
import ActionCellMainSharing from "./ActionCellMainSharing";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import CurrencyInput from "react-currency-input-field";
import DeleteIcon from "@mui/icons-material/Delete";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../../utils/gridKeyboardNav3";
import RKGrid, { FooterSome, IndexCell,getLangDate,DateCell } from "rkgrid";

const Factor = [];
const emptyCash = {
  product: "",
  unit: "",
  count: 0,
  amount: 0,
};
const emptyTemp = {
  product: "",
  unit: "",
  count: 0,
  amount: 0,
};
export const ConfirmedPurchasesSharing = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [excelData2, setExcelData2] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const data2Ref = useRef();
  data2Ref.current = data2;
  const [click, setClick] = useState(false);
  useEffect(() => {
    let tempData = dataForGridSharing.map((data) => {
      return {
        ...data,
        OrderInsertDate: new Date(data.OrderInsertDate),
      };
    });
    setData(tempData);

    let tempExcel = dataForGridSharing?.map((data, index) => {
      return {
        ...data,
        IndexCell: index + 1,
        OrderInsertDate: getLangDate(
          i18n.language,
          new Date(data.OrderInsertDate)
        ),
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);
  useEffect(() => {
    let tempData = dataForGridSharing2.map((data) => {
      return {
        ...data,
      };
    });
    setData2(tempData);

    let tempExcel = dataForGridSharing2?.map((data, index) => {
      return {
        ...data,
        IndexCell: index + 1,
      };
    });
    setExcelData2(tempExcel);
  }, [i18n.language]);
  function tempBarcode() {
    formik.setFieldValue("cashReceived", formik.values.tempReceived);
  }

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );



  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "50px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: false,
    },
    {
      field: "OrderName",
      filterable: false,
      name: "کالا",
    },
    {
      field: "BuildSeries",
      filterable: false,
      name: "سری ساخت",
    },
    {
      field: "OrderInsertDate",
      filterable: false,
      name: "تاریخ انقضاء",
      // format: "{0:d}",
      cell: DateCell,
      filter: "date",
    },
    {
      field: "OrderUnit",
      filterable: false,
      name: "واحد",
    },
    {
      field: "OrderCount",
      filterable: false,
      name: "تعداد",
    },
    {
      field: "OrderAmount",
      filterable: false,
      name: "مقدار",
    },
    {
      field: "actionCell",
      filterable: false,
      name: "عملیات",
      cell: ActionCellMainSharing,
      className: "text-center",
      reorderable: false,
    },
  ];
  let tempColumn2 = [
    {
      field: "IndexCell",
      filterable: false,
      width: "50px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: false,
    },
    {
      field: "product",
      filterable: false,
      name: "کالا",
    },
    {
      field: "unit",
      filterable: false,
      name: "واحد",
    },
    {
      field: "count",
      filterable: false,
      name: "تعداد",
    },
    {
      field: "amount",
      filterable: false,
      name: "مقدار",
    },
    {
      field: "actionCell",
      filterable: false,
      name: "عملیات",
      cell: ActionCellMainSharing,
      className: "text-center",
      reorderable: false,
    },
  ];

  //   const chartObj = [
  //     { value: "OrderPrice", title: t("مبلغ") },
  //     { value: "PartnerCode", title: t("کد") },
  //   ];

  let savedCharts = [
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ];

  function getSavedCharts(list) {
    console.log("save charts list to request and save:", list);
  }
  function getSavedCharts2(list) {
    console.log("save charts list to request and save:", list);
  }

  function getSelectedRows(list) {
    console.log("selected row list to request:", list);
  }
  function getSelectedRows2(list) {
    console.log("selected row list to request:", list);
  }
  const [alignment, setAlignment] = React.useState("");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const theme = useTheme();
  const dateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  const [timeValueSet, setTimeValueSet] = useState(false);
  const [factor, setFactor] = React.useState(Factor);
  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 1000),
      date: julianIntToDate(new DateObject().toJulianDay()),
      time: new Date(),
      receivingWarehouse: "",
      storeKeeper: "",
      cashReceived: [],
      tempReceived: [emptyCash],
    },
    validationSchema: Yup.object({
      receivingWarehouse: Yup.string().required("وارد کردن انبار الزامی است"),
      storeKeeper: Yup.string().required("وارد کردن انباردار الزامی است"),
    }),
    validateOnChange: false,

    onSubmit: (values) => {
      console.log("here", values);
      factorSub();
    },
  });
  const factorSub = () => {
    swal({
      title: t("فاکتور با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
  const callComponent = () => {
    history.navigate(
      `/WareHouse/purchase/confirmedPurchases`,
      "noopener,noreferrer"
    );
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [temp, setTemp] = React.useState("");
  ///// Cash Grid \\\\\


  const [tempFocusedRow, setTempFocusedRow] = useState(1);

  const [tempCashOpen, setTempCashOpen] = useState(false);

  function addTempReceivedRow() {
    formik.setFieldValue("tempReceived", [
      ...formik.values.tempReceived,
      emptyCash,
    ]);
  }

  function HandleTempCountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `tempReceived[${index}].count`,
      parsFloatFunction(temp, 2)
    );
  }
  function HandleTempAmountChange(index, value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(
      `tempReceived[${index}].amount`,
      parsFloatFunction(temp, 2)
    );
  }

  function tempKeyDownHandler(e) {
    let next = e.target.closest("td").nextSibling;
    while (
      next.cellIndex !== next.closest("tr").children.length - 1 &&
      (next.querySelector("button") || next.querySelector("input").disabled)
    ) {
      next = findNextFocusable(next);
    }

    let prev = e.target.closest("td").previousSibling;
    while (
      prev.cellIndex !== 0 &&
      (prev.querySelector("button") || prev.querySelector("input").disabled)
    ) {
      prev = findPreviousFocusable(prev);
    }

    if (
      e.keyCode === 40
    ) {
      /* Down Arrowkey */
      e.preventDefault();
      if (formik.values.tempReceived.length === tempFocusedRow) {
        addTempReceivedRow();
        setTimeout(() => {
          let temp =
            next.closest("tr").nextSibling.children[
            e.target.closest("td").cellIndex
            ];
          while (
            temp.cellIndex !== temp.closest("tr").children.length - 1 &&
            (temp.querySelector("button") ||
              temp.querySelector("input").disabled)
          ) {
            temp = findNextFocusable(temp);
          }
          temp.querySelector("input").focus();
          temp.querySelector("input").select();
        }, 0);
      } else {
        let down = e.target
          .closest("tr")
          .nextSibling.children[e.target.closest("td").cellIndex].querySelector(
            "input"
          );
        down.focus();
        down.select();
      }
    }
    if (
      e.keyCode === 38
    ) {
      /* Up ArrowKey */
      e.preventDefault();
      let up = e.target
        .closest("tr")
        .previousSibling.children[
        e.target.closest("td").cellIndex
      ].querySelector("input");
      up.focus();
      up.select();
    }

    if (e.keyCode === 39) {
      /* Right ArrowKey */
      i18n.dir() === "rtl"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.tempReceived,
          addTempReceivedRow,
          next,
          tempFocusedRow
        );
    }
    if (e.keyCode === 37) {
      /* Left ArrowKey */
      i18n.dir() === "ltr"
        ? MovePrevious(prev)
        : MoveNext(
          formik.values.tempReceived,
          addTempReceivedRow,
          next,
          tempFocusedRow
        );
    }
    if (
      e.keyCode === 13
    ) {
      /* Enter */
      MoveNext(
        formik.values.tempReceived,
        addTempReceivedRow,
        next,
        tempFocusedRow
      );
    } else if (e.keyCode === 13) {
      /* Enter */
      e.preventDefault();
      MoveNext(
        formik.values.tempReceived,
        addTempReceivedRow,
        next,
        tempFocusedRow
      );
    }
    if (e.keyCode === 9) {
      /* Tab */ /*MUST BECOME LANGUAGE DEPENDANT */
      e.preventDefault();
      if (e.shiftKey === false) {
        MoveNext(
          formik.values.tempReceived,
          addTempReceivedRow,
          next,
          tempFocusedRow
        );
      } else {
        MovePrevious(prev);
      }
    }
  }


  // const [cashAmountTotal, setCashAmountTotal] = useState(0);

  // function CalculateCashAmountTotal() {
  //   let cashAmountTemp = 0;
  //   formik.values.cashReceived.forEach((element) => {
  //     cashAmountTemp += element.amount;
  //     setCashAmountTotal(parsFloatFunction(cashAmountTemp, 2));
  //   });
  // }

  ///// End of Cash Grid \\\\\

  useEffect(() => {
    if (!timeValueSet) {
      var timeUpdate = setInterval(() => formik.setFieldValue("time", new Date()), 30000);
    }
    return () => {
      clearTimeout(timeUpdate);
    };
  }, [timeValueSet]);
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
          <form onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="row ">
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span> {t("تاریخ رسید")} </span>
                  </div>
                  <div className="wrapper">
                    <div className="row">
                      <div className="col-8">
                        <div className="date-picker position-relative">
                          <DatePicker
                            name="date"
                            id="date"
                            ref={dateRef}
                            value={date}
                            calendar={renderCalendarSwitch(i18n.language)}
                            locale={renderCalendarLocaleSwitch(i18n.language)}
                            calendarPosition="bottom-right"
                            onBlur={formik.handleBlur}
                            onChange={(val) => {
                              setDate(val);
                              formik.setFieldValue(
                                "date",
                                julianIntToDate(val?.toJulianDay())
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
                      </div>
                      <div className="col-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            ampm={false}
                            className="time-picker"
                            views={["hours", "minutes"]}
                            inputFormat="HH:mm"
                            mask="__:__"
                            value={formik.values.time}
                            onChange={(newValue) => {
                              formik.setFieldValue("time", newValue);
                              setTimeValueSet(true);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12"></div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {" "}
                      {t("انبار")} <span className="star">*</span>{" "}
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={receivingWarehouses}
                        rtlEnabled={i18n.dir() === "ltr" ? false : true}
                        onValueChanged={(e) =>
                          formik.setFieldValue("receivingWarehouse", e.value)
                        }
                        className="selectBox"
                        noDataText={t("اطلاعات یافت نشد")}
                        displayExpr={function (item) {
                          return item && item.Code + "- " + item.Name;
                        }}
                        valueExpr="Code"
                        itemRender={null}
                        placeholder=""
                        name="receivingWarehouse"
                        id="receivingWarehouse"
                      />
                    </div>
                    {formik.touched.receivingWarehouse &&
                      formik.errors.receivingWarehouse &&
                      !formik.values.receivingWarehouse ? (
                      <div className="error-msg">
                        {t(formik.errors.receivingWarehouse)}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {" "}
                      {t("انباردار")} <span className="star">*</span>{" "}
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={storeKeepers}
                        rtlEnabled={i18n.dir() === "ltr" ? false : true}
                        onValueChanged={(e) =>
                          formik.setFieldValue("storeKeeper", e.value)
                        }
                        className="selectBox"
                        noDataText={t("اطلاعات یافت نشد")}
                        displayExpr={function (item) {
                          return item && item.Code + "- " + item.Name;
                        }}
                        valueExpr="Code"
                        itemRender={null}
                        placeholder=""
                        name="storeKeeper"
                        id="storeKeeper"
                      />
                    </div>
                    {formik.touched.storeKeeper &&
                      formik.errors.storeKeeper &&
                      !formik.values.storeKeeper ? (
                      <div className="error-msg">
                        {t(formik.errors.storeKeeper)}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div content col-lg-12 col-md-12 col-xs-12>
                  <span className="mt-5">{t("اقلام سفارش خرید:")}</span>
                  <RKGrid
                    gridId={"ConfirmedPurchasesSharingPrintPage"}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}
                    //   chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={false}
                    pageable={true}
                    excelFileName={t("اقلام سفارش خرید")}
                    reorderable={false}
                    selectable={false}
                  />
                </div>
                <div
                  style={
                    formik.values.cashReceived.length == 0
                      ? { display: "none" }
                      : { display: "block" }
                  }
                  content
                  col-lg-12
                  col-md-12
                  col-xs-12
                >
                  <span className="mt-5">
                    {t("اقلام خوانده شده توسط بارکدخوان :")}
                  </span>
                  <RKGrid
                    gridId={"ConfirmedPurchasesSharingPrintPage2"}
                    gridData={formik.values.cashReceived}
                    excelData={excelData2}
                    columnList={tempColumn2}
                    showSetting={false}
                    showChart={false}
                    showExcelExport={false}
                    showPrint={false}
                    //   chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={getSavedCharts2}
                    getSavedCharts={getSavedCharts2}
                    sortable={false}
                    pageable={true}
                    excelFileName={t("اقلام خوانده شده توسط بارکدخوان :")}
                    reorderable={false}
                    selectable={false}
                  />
                </div>

                <div
                  style={{ width: "100px", marginRight: "33px" }}
                  className={`${i18n.dir() == "ltr" ? "ltr" : "rtl"}`}
                >
                  <Button
                    style={{ width: "145px" }}
                    className="bg-secondary text-light confirmedPurchasesSharingButtonModal"
                    onClick={handleOpen}
                  >
                    {t("استفاده از بارکدخوان")}
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      style={{ width: "80vw" }}
                      className={`${i18n.dir() == "ltr" ? "ltr" : "rtl"}`}
                      sx={style}
                    >
                      <FormikProvider value={formik}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <div className="content col-lg-12 col-5">
                            {/* Cash Grid */}
                            <div
                              style={{ direction: "rtl" }}
                              className="row align-items-center"
                            >
                              <div className="content col-lg-6 col-6">
                                <div className="title mb-0">
                                  <span className="span">
                                    {" "}
                                    {t("اقلام انبار")} :
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
                                      addTempReceivedRow();
                                      setTimeout((e) => {
                                        let added = e.target
                                          .closest("div")
                                          .parentElement.nextSibling.querySelector(
                                            "tbody tr:last-child td:nth-child(2)"
                                          );
                                        while (
                                          added.querySelector("button") ||
                                          added.querySelector("input").disabled
                                        ) {
                                          added = findNextFocusable(added);
                                        }
                                        added.querySelector("input").focus();
                                      }, 0);
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
                                        <th>{t("واحد")}</th>
                                        <th>{t("تعداد")}</th>
                                        <th>{t("مقدار")}</th>
                                        <th>{t("حذف")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <FieldArray
                                        name="tempReceived"
                                        render={({ push, remove }) => (
                                          <React.Fragment>
                                            {formik?.values?.tempReceived?.map(
                                              (tempReceives, index) => (
                                                <tr
                                                  key={index}
                                                  onFocus={(e) =>
                                                    setTempFocusedRow(
                                                      e.target.closest("tr")
                                                        .rowIndex
                                                    )
                                                  }
                                                  className={
                                                    tempFocusedRow === index + 1
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
                                                  <td
                                                    style={{
                                                      minWidth: "120px",
                                                    }}
                                                  >
                                                    <input

                                                      className="form-input w-100"
                                                      onKeyDown={(e) =>
                                                        tempKeyDownHandler(
                                                          e
                                                        )
                                                      }
                                                      name={`tempReceived.${index}.product`}
                                                      type="text"
                                                      onChange={
                                                        formik.handleChange
                                                      }
                                                      value={
                                                        formik.values
                                                          .tempReceived[index]
                                                          .product
                                                      }
                                                      autoComplete="off"
                                                    />
                                                  </td>
                                                  <td
                                                    style={{
                                                      minWidth: "120px",
                                                    }}
                                                  >
                                                    <input

                                                      className="form-input w-100"
                                                      onKeyDown={(e) =>
                                                        tempKeyDownHandler(
                                                          e
                                                        )
                                                      }
                                                      name={`tempReceived.${index}.unit`}
                                                      type="text"
                                                      onChange={
                                                        formik.handleChange
                                                      }
                                                      value={
                                                        formik.values
                                                          .tempReceived[index]
                                                          .unit
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

                                                      onKeyDown={(e) =>
                                                        tempKeyDownHandler(
                                                          e
                                                        )
                                                      }
                                                      className={`form-input `}
                                                      style={{ width: "100%" }}
                                                      id="count"
                                                      name={`tempReceived.${index}.count`}
                                                      decimalsLimit={2}
                                                      onChange={(e) =>
                                                        HandleTempCountChange(
                                                          index,
                                                          e.target.value
                                                        )
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

                                                      onKeyDown={(e) =>
                                                        tempKeyDownHandler(
                                                          e
                                                        )
                                                      }
                                                      className={`form-input `}
                                                      style={{ width: "100%" }}
                                                      id="amount"
                                                      name={`tempReceived.${index}.amount`}
                                                      decimalsLimit={2}
                                                      onChange={(e) =>
                                                        HandleTempAmountChange(
                                                          index,
                                                          e.target.value
                                                        )
                                                      }
                                                      autoComplete="off"
                                                      disabled
                                                    />
                                                  </td>

                                                  <td style={{ width: "40px" }}>
                                                    <IconButton
                                                      variant="contained"
                                                      color="error"
                                                      className="kendo-action-btn"
                                                      onClick={() => {
                                                        // setCashAmountTotal(
                                                        //   cashAmountTotal -
                                                        //     formik.values
                                                        //       .cashReceived[index]
                                                        //       .amount
                                                        // );
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
                                    {/* <tfoot>
                                    <tr>
                                      <td>{t("جمع")}:</td>
                                      <td></td>
                                      <td>
                                        <CurrencyInput
                                          className="form-input"
                                          style={{ width: "100%" }}
                                          id="cashAmountTotal"
                                          disabled
                                          value={cashAmountTotal}
                                          name={`cashReceived.cashAmountTotal`}
                                          decimalsLimit={2}
                                          autoComplete="off"
                                        />
                                      </td>

                                      <td />
                                    </tr>
                                  </tfoot> */}
                                  </table>
                                </div>
                                {formik?.errors?.tempReceived?.map(
                                  (error, index) => (
                                    <p className="error-msg" key={index}>
                                      {/* {error ? ` ${t("ردیف")} ${index + 1} : ${error?.definedAccount ? t(error.definedAccount) : ""}${error?.debits && error?.definedAccount ? "." : ""} ${error?.debits ? t(error.debits) : ""}${error?.credits ? "." : ""} ${error?.credits ? t(error.credits) : ""}` : null} */}
                                    </p>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`button-pos ${i18n.dir() == "ltr" ? "ltr" : "rtl"
                              }`}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              type="button"
                              onClick={() => {
                                tempBarcode();
                                handleClose();
                              }}
                            >
                              {t("ثبت تغییرات")}
                            </Button>
                          </div>
                        </Typography>
                      </FormikProvider>
                    </Box>
                  </Modal>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className={`button-pos ${i18n.dir() == "ltr" ? "ltr" : "rtl"}`}>
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
            style={{ marginRight: "10px" }}
            variant="contained"
            color="error"
            onClick={callComponent}
          >
            {t("انصراف")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmedPurchasesSharing;
