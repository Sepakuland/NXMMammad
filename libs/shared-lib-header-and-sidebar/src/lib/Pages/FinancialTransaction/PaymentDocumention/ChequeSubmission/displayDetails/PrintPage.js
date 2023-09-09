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
      let temp = data.OutputPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
        MaturityDate: getLangDate(lang,new Date(data.MaturityDate)),
        OutputPrice: cost,
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
    <CurrencyCell {...props} cell={"OutputPrice"} />
  );

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: true,
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: true,
    },
    {
      field: "DocumentCode",
      name: "پشت نمره",
      className: 'word-break',
      width: "80px",
    },
    {
      field: "ChequeCode",
      name: "سریال",
      className: 'word-break',
    },
    {
      field: "DocumentDate",
      name: "تاریخ",
      className: 'word-break',
    },
    {
      field: "PartnerCode",
      className: 'word-break',
      width: "100px",
      name: "کد طرف حساب",
    },
    {
      field: "PartnerName",
      name: "طرف حساب",
    },
    {
      field: "PartnerTelephones",
      name: "تلفن",
      className: 'word-break text-center',
    },
    {
      field: "PartnerAddress",
      name: "آدرس",
    },
    {
      field: "BankName",
      name: "بانک",
    },
    {
      field: "Branch",
      name: "شعبه",
    },
    {
      field: "Delivery",
      width: "90px",
      name: "تحویل گیرنده",
      className: "text-center",
    },
    {
      field: "Issuance",
      width: "100px",
      name: "محل صدور",
      className: "text-center",
    },
    {
      field: "MaturityDate",
      name: "تاریخ سررسید",
      className: 'word-break',
    },
    {
      field: "OutputPrice",
      name: "مبلغ",
      className: 'word-break',
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "SettlementDocuments",
      width: "90px",
      name: "تسویه",
      className: "text-center",
    },
    {
      field: "chequeState",
      width: "90px",
      name: "وضعیت ",
      className: "text-center",
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
      subTitle={t("پرداخت چک")}
    />
  );
};
export default PrintPage;
