import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintRemittancePayablePage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.BankFee.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      return {
        ...data,
        DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
        Price: cost,
        BankFee: cost2,
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
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={"Price"} />;
  const CustomCurrency2 = (props) => (
    <CurrencyCell {...props} cell={"BankFee"} />
  );

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false,
    },
    {
      field: "DocumentCode",
      name: "کد",
      className: "word-break text-center"
    },
    {
      field: "DocumentDate",
      name: "تاریخ",
      className: "word-break"
    },
    {
      field: "PartnerCode",
      name: "کد طرف حساب",
      className: "word-break"
    },
    {
      field: "PartnerName",
      name: "طرف حساب",
    },
    {
      field: "PartnerLegalName",
      name: "نام حقوقی",
    },
    {
      field: "PartnerTelephones",
      name: "تلفن",
      className: "word-break"
    },
    {
      field: "PartnerAddress",
      name: "آدرس",
    },
    {
      field: "CashAccountName",
      name: "حساب واریز کننده",
    },
    {
      field: "BankTransferCode",
      name: "شماره فیش",
      className: "word-break"
    },
    {
      field: "Price",
      name: "مبلغ",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
      className: "word-break"
    },
    {
      field: "BankFee",
      name: "کارمزد",
      cell: CustomCurrency2,
      footerCell: CustomFooterSome,
      className: "word-break"
    },
    {
      field: "SettlementDocuments",
      name: "تسویه",
      className: "text-center",
    },
    {
      field: "DocumentDescription",
      name: "توضیحات",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("حواله پرداختنی")}
    />
  );
};
export default PrintRemittancePayablePage;
