import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import ActionCellMainCheque from "./ActionCellGeneralPayment";
import { history } from "../../../../../utils/history";

const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.TotalPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.ChequePrice.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.CashPrice.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      let temp4 = data.BankPrice.toString().replaceAll(",", "");
      let cost4 = parseFloat(temp4, 2);
      let temp5 = data.BankBankFee.toString().replaceAll(",", "");
      let cost5 = parseFloat(temp5, 2);
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        ChequeMaturityDate: new Date(data.ChequeMaturityDate),
        TotalPrice: cost,
        ChequePrice: cost2,
        CashPrice: cost3,
        BankPrice: cost4,
        BankBankFee: cost5,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones:
          data.PartnerTelephones !== "" ? parseInt(data.PartnerTelephones) : "",
      };
    });
    setData(tempData);

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = data.TotalPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.ChequePrice.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.CashPrice.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      let temp4 = data.BankPrice.toString().replaceAll(",", "");
      let cost4 = parseFloat(temp4, 2);
      let temp5 = data.BankBankFee.toString().replaceAll(",", "");
      let cost5 = parseFloat(temp5, 2);
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
        ChequeMaturityDate: getLangDate(
          i18n.language,
          new Date(data.ChequeMaturityDate)
        ),
        TotalPrice: cost,
        ChequePrice: cost2,
        CashPrice: cost3,
        BankPrice: cost4,
        BankBankFee: cost5,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: parseInt(data.PartnerTelephones),
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => (
    <CurrencyCell {...props} cell={"TotalPrice"} />
  );
  const CustomCurrency2 = (props) => (
    <CurrencyCell {...props} cell={"ChequePrice"} />
  );
  const CustomCurrency3 = (props) => (
    <CurrencyCell {...props} cell={"CashPrice"} />
  );
  const CustomCurrency4 = (props) => (
    <CurrencyCell {...props} cell={"BankPrice"} />
  );
  const CustomCurrency5 = (props) => (
    <CurrencyCell {...props} cell={"BankBankFee"} />
  );

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
      field: "DocumentCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره",
      filter: "numeric",
      width: "90px",
      reorderable: true,
    },
    {
      field: "DocumentDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ",
      // format: "{0:d}",
      filter: "date",
      cell: DateCell,
      reorderable: true,
    },
    {
      field: "PartnerCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      width: "100px",
      name: "کد طرف حساب",
      reorderable: true,
    },
    {
      field: "PartnerName",
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "100px",
      name: "نام طرف حساب",
      reorderable: true,
    },
    {
      field: "TotalPrice",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: "numeric",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
      reorderable: true,
    },
    {
      name: "نقد",
      field: "Cash",
      children: [
        {
          field: "CashCashAccount",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "صندوق",
          className: "text-center",
          reorderable: true,
        },
        {
          field: "CashPrice",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency3,
          footerCell: CustomFooterSome,
          reorderable: true,
        },
      ],
    },
    {
      name: "بانک",
      field: "Bank",
      children: [
        {
          field: "BankAccount",
          // columnMenu: ColumnMenu,
          filterable: true,
          width: "100px",
          name: "حساب",
          reorderable: true,
        },
        {
          field: "BankBillCode",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "شماره فیش",
          filter: "numeric",
          reorderable: true,
        },
        {
          field: "BankPrice",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency4,
          footerCell: CustomFooterSome,
          reorderable: true,
        },
        {
          field: "BankBankFee",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "کارمزد",
          filter: "numeric",
          cell: CustomCurrency5,
          footerCell: CustomFooterSome,
          reorderable: true,
        },
      ],
    },
    {
      name: "چک",
      field: "Cheque",
      children: [
        {
          field: "ChequeSerial",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "سریال",
          filter: "numeric",
        },
        {
          field: "ChequeMaturityDate",
          // columnMenu: DateMenu,
          filterable: true,
          name: "سررسید",
          // format: "{0:d}",
          filter: "date",
          cell: DateCell,
          reorderable: true,
        },
        {
          field: "ChequePrice",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency2,
          footerCell: CustomFooterSome,
          reorderable: true,
        },
      ],
    },

    {
      field: "DocumentDescription",
      filterable: true,
      // columnMenu: ColumnMenu,
      width: "90px",
      name: "توضیحات",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "actionCell",
      filterable: false,
      width: "170px",
      name: "عملیات",
      cell: ActionCellMainCheque,
      className: "text-center",
      reorderable: false,
    },
  ];

  const chartObj = [
    { value: "Price", title: t("مبلغ") },
    { value: "DocumentCode", title: t("پشت نمره") },
    { value: "BankAccountNumber", title: t("شماره حساب") },
    { value: "PartnerCode", title: t("کد طرف حساب") },
  ];

  let savedCharts = [
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ];

  function getSavedCharts(list) {
    console.log("save charts list to request and save:", list);
  }

  function getSelectedRows(list) {
    console.log("selected row list to request:", list);
  }

  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/general/issuance`,
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={"payment-general-display"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={true}
          showPrint={true}
          chartDependent={chartObj}
          rowCount={10}
          excelFileName={t("پرداخت کلی")}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={false}
          selectKeyField={"DocumentId"}
          getSelectedRows={getSelectedRows}

        />

        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="contained"
            color="primary"
            onClick={callComponent}
          >
            {t("جدید")}
          </Button>
        </div>
      </div>
    </>
  );
};
export default DisplayDetails;
