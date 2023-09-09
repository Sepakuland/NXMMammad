import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGridSharing from "./dataForGridSharing.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const ReturnOfApprovedSalesSharingPrint = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGridSharing.map((data) => {
      return {
        ...data,
        OrderInsertDate: getLangDate(lang, new Date(data.OrderInsertDate)),
      };
    });
    setData(tempData);
  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
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
      field: "OrderName",
      name: "کالا",
      className: "word-break text-center",
    },
    {
      field: "BuildSeries",
      name: "سری ساخت",
      className: "word-break text-center",
    },
    {
      field: "OrderInsertDate",
      name: "تاریخ انقضاء",
      className: "word-break",
    },
    {
      field: "OrderUnit",
      name: "واحد",
    },
    {
      field: "OrderCount",
      name: "تعداد",
    },
    {
      field: "OrderAmount",
      name: "مقدار",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("اقلام برگشت از فروش")}
    />
  );
};
export default ReturnOfApprovedSalesSharingPrint;
