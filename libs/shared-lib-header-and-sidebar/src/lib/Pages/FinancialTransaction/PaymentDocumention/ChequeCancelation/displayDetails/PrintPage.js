import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { IndexCell } from "rkgrid";
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
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones:
          data.PartnerTelephones !== "" ? parseInt(data.PartnerTelephones) : "",
      };
    });
    setData(tempData);
  }, [lang]);




  let tempColumn = [
    {
      field: "IndexCell",
      filterable: true,

      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: true,
    },
    {
      name: "حساب بانکی",
      field: "Bank",
      children: [
        {
          field: "BankAccountCode",
          name: "کد",
          className:'word-break',
          filter: "numeric",
        },
        {
          field: "BankAccountName",
          width: "100px",
          name: "عنوان",
        },
        {
          field: "BankAccountNumber",
          name: "شماره حساب",
          className:'word-break',
          filter: "numeric",
        },
      ],
    },
    {
      name: "دسته چک",
      field: "ChequeBook",
      children: [
        {
          field: "ChequeDefinitionCode",
          name: "کد",
          className:'word-break',
          filter: "numeric",
        },
        {
          field: "StartSerial",
          width: "100px",
          filter: "numeric",
          className:'word-break',
          name: "سریال شروع",
        },
        {
          field: "PaperCount",
          name: "تعداد برگ",
          className:'word-break',
          filter: "numeric",
        },
      ],
    },
    {
      field: "Serial",
      name: "سریال برگ ابطال شده",
      filter: "numeric",
      className:'word-break',
      width: "90px",
    },

    {
      field: "Reason",
      width: "90px",
      name: "دلیل ابطال",
      className: "text-center",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("ابطال برگ چک")}
    />
  );
};
export default PrintPage;
