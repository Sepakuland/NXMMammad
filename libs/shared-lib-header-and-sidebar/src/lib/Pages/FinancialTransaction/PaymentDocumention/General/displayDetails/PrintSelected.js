import React, { useEffect, useState, useRef } from "react";
import Print, { PrintGrid } from "sepakuland-component-print";
import {CurrencyCell, FooterSome,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintSelectedData from "./PrintSelectedData.json";
import printGridSelectedData from "./printGridSelectedData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSelected = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const [data2, setData2] = useState([]);
  const dataRef2 = useRef();
  dataRef2.current = data2;

  useEffect(() => {
    let tempData = PrintSelectedData.map((data) => {
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
      };
    });
    setData2(tempData);

    let tempGridData = printGridSelectedData.map((data) => {
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
        ChequePrice: cost2,
        CashPrice: cost3,
        BankPrice: cost4,
        BankBankFee: cost5,
      };
    });
    setData(tempGridData);
  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  // const CustomCurrency = (props) => <CurrencyCell {...props} cell={"Price"} />;
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
      filterable: false,
      name: "ردیف",
      cell: IndexCell,
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
          className: "word-break",
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
          className: "word-break",
        },
        {
          field: "BankPrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency4,
          footerCell: CustomFooterSome,
          className: "word-break",
        },
        {
          field: "BankBankFee",
          name: "کارمزد",
          filter: "numeric",
          cell: CustomCurrency5,
          footerCell: CustomFooterSome,
          className: "word-break",
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
          className: "word-break",
        },
        {
          field: "ChequeMaturityDate",
          name: "سررسید",
          // format: "{0:d}",
          filter: "date",
          className: "word-break",
        },
        {
          field: "ChequePrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CustomCurrency2,
          footerCell: CustomFooterSome,
          className: "word-break",
        },
      ],
    },
  ];
  let tempColumn2 = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
    },
    {
      field: "type",
      className: "text-center",
      name: "نوع",
    },
    {
      field: "number",
      name: "شماره",
      className: "word-break",
    },
    {
      field: "Price",
      filterable: false,
      name: "مبلغ",
      className: "word-break",
    },
    {
      field: "ComplyWithReceipt",
      filterable: false,
      name: "تطبیق با این دریافت",
      className: "word-break",
    },
  ];

  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("پرداخت")}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-6 col-6">{t("کد‌پرداخت")}: 598</div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("تاریخ ‌پرداخت")} : 1401/06/03
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("جمع مبلغ")} :180,800
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("کد طرف حساب")} :132132
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("نام طرف حساب")} : شرکت دولتی پست بانکشرکت دولتی پست بانک
          </div>
          <div className="col-lg-4 col-md-6 col-6">{t("نام حقوقی")} :1365</div>
          <div className="col-lg-4 col-md-6 col-6">{t("توضیحات")} :</div>
        </div>
      </Print>
      <PrintGrid printData={data2} columnList={tempColumn2}></PrintGrid>
    </>
  );
};
export default PrintSelected;
