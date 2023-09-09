import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import {
  FooterSome,
  CurrencyCell,
  TotalTitle,
  IndexCell,
  getLangDate,
} from "rkgrid";
import { useTranslation } from "react-i18next";
import products from "../../BankCharge/DisplayDetails/product.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const BankPrintPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = products.map((data, index) => {
      let temp = data.Amount.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        IndexCell: index + 1,
        Date: getLangDate(lang, new Date(data.Date)),
        Amount: cost,
        Code: parseInt(data.Code),
      };
    });
    setData(tempData);
  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={"Amount"} />;

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      className: "break-line",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false,
    },
    {
      field: "Code",
      className: "text-center break-line",
      filterable: false,
      name: "کد",
    },
    {
      field: "SourceFund",
      filterable: false,
      name: "صندوق مبدأ",
    },
    {
      field: "OriginBank",
      filterable: false,
      name: "بانک مبدأ",
    },
    {
      field: "AccountName",
      filterable: false,
      name: "نام حساب",
    },
    {
      field: "Amount",
      filterable: false,
      name: "مبلغ",
      className: "break-line",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "Date",
      filterable: false,
      name: "تاریخ",
      className: "break-line",
      // format: "{0:d}",
    },
    {
      field: "Description",
      filterable: false,
      width: "140px",
      name: "توضیحات",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("شارژ بانک")}
    />
  );
};
export default BankPrintPage;
