import React, { useEffect, useState, useRef } from "react";
import Print from "../../../../components/print";
import IndexCell from "../../../../components/RKGrid/IndexCell";
import TotalTitle from "../../../../components/RKGrid/TotalTitle";
import FooterSome from "../../../../components/RKGrid/FooterSome";
import { useTranslation } from "react-i18next";
import dataForGridSharing from "./dataForGridSharing.json";
import { getLangDate } from "../../../../utils/getLangDate";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const ConfirmedPurchasesSharingPrint = () => {
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
    },
    {
      field: "BuildSeries",
      name: "سری ساخت",
    },
    {
      field: "OrderInsertDate",
      name: "تاریخ انقضاء",
      // format: "{0:d}",
      filter: "date",
    },
    {
      field: "OrderPack",
      name: "بسته",
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
      subTitle={t("اقلام سفارش خرید")}
    />
  );
};
export default ConfirmedPurchasesSharingPrint;
