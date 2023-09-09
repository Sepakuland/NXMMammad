import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintConfirmedPurchasesPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.OrderPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        OrderInsertDate: getLangDate(lang, new Date(data.OrderInsertDate)),
        OrderPrice: cost,
        PartnerCode: parseInt(data.PartnerCode),
      };
    });
    setData(tempData);
  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => (
    <CurrencyCell {...props} cell={"OrderPrice"} />
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
      field: "OrderCode",
      name: "شماره خرید",
      className: "word-break text-center",
    },
    {
      field: "PartnerCode",
      name: "کد طرف حساب",
      className: "word-break text-center",
    },
    {
      field: "PartnerName",
      name: "نام طرف حساب",
    },
    {
      field: "OrderInsertDate",
      name: "تاریخ خرید",
      className: "word-break",
      // format: "{0:d}",
      filter: "date",
    },
    {
      field: "Status",
      name: "وضعیت",
    },
    {
      field: "MaturateDate",
      name: "زمان تایید",
      className: "word-break",
      // format: "{0:d}",
      // cell:DateCell,
      filter: "date",
    },
    {
      field: "OrderPrice",
      name: "مبلغ فاکتور",
      filter: "numeric",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "WarehouseName",
      name: "انبار",
    },
    {
      field: "Description",
      name: "توضیحات",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("درخواست‌های خرید")}
    />
  );
};
export default PrintConfirmedPurchasesPage;
