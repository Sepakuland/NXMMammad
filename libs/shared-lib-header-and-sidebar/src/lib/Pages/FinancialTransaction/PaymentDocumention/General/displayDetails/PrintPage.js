import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
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
        DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
        ChequeMaturityDate:getLangDate(lang, new Date(data.ChequeMaturityDate)),
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
  }, [lang]);

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

      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      width: "50px",
      reorderable: true,
    },
    {
      field: "DocumentCode",
      name: "شماره",
      filter: "numeric",
      width: "90px",
      className: "word-break"
    },
    {
      field: "DocumentDate",
      name: "تاریخ",
      // format: "{0:d}",
      filter: "date",
      className: "word-break"
    },
    {
      field: "PartnerCode",
      filter: "nameric",
      width: "100px",
      name: "کد طرف حساب",
      className: "word-break"
    },
    {
      field: "PartnerName",
      width: "100px",
      name: "نام طرف حساب",
    },
    {
      field: "TotalPrice",
      name: "مبلغ",
      filter: "numeric",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
      className: "word-break"
    },
    {
      name: "نقد",
      field: "Cash",
      children: [
        {
          field: "CashCashAccount",
          name: "صندوق",
          className: "text-center",
        },
        {
          field: "CashPrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency3,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    },
    {
      name: "بانک",
      field: "Bank",
      children: [
        {
          field: "BankAccount",
          width: "100px",
          name: "حساب",
        },
        {
          field: "BankBillCode",
          name: "شماره فیش",
          filter: "numeric",
          className: "word-break"
        },
        {
          field: "BankPrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency4,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
        {
          field: "BankBankFee",
          name: "کارمزد",
          filter: "numeric",
          cell: CustomCurrency5,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    },
    {
      name: "چک",
      field: "Cheque",
      children: [
        {
          field: "ChequeSerial",
          name: "سریال",
          filter: "numeric",
          className: "word-break"
        },
        {
          field: "ChequeMaturityDate",
          name: "سررسید",
          // format: "{0:d}",
          filter: "date",
          className: "word-break"
        },
        {
          field: "ChequePrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency2,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    },

    {
      field: "DocumentDescription",
      width: "90px",
      name: "توضیحات",
      className: "text-center",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("پرداخت کلی")}
    />
  );
};
export default PrintPage;
