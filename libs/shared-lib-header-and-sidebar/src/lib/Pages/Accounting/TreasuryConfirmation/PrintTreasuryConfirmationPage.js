import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintTreasuryConfirmationPage = () => {
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
      return {
        ...data,
        DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
        MaturityDate: getLangDate(lang,new Date(data.MaturityDate)),
        Price: cost,
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

  let tempColumn = [
    {
      field: "IndexCell",
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false,
    },
    {
      field: "DocumentType",
      name: "نوع تراکنش",
    },
    {
      field: "DocumentCode",
      name: "کد تراکنش",
      className:'word-break',
    },
    {
      field: "Operation",
      name: "نام عملیات",
    },
    {
      field: "DocumentDate",
      name: "تاریخ",
      className:'word-break',
    },
    {
      field: "PayerCode",
      className:'word-break',
      name: "کد پرداخت کننده",
    },
    {
      field: "PayerName",
      name: "نام پرداخت کننده",
    },
    {
      field: "RecipientCode",
      className:'word-break',
      name: "کد دریافت کننده",
    },
    {
      field: "RecipientName",
      name: "نام دریافت کننده",
    },
    {
      field: "Price",
      name: "مبلغ",
      className:'word-break',
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "ChequeCode",
      name: "سریال چک",
      className:'word-break',
    },
    {
      field: "MaturityDate",
      className:'word-break',
      name: "تاریخ سررسید",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("واریز به بانک")}
    />
  );
};
export default PrintTreasuryConfirmationPage;
