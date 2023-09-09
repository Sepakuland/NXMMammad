import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
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
      let temp3 = data.ReversionPrice.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      return {
        ...data,
        OrderInsertDate: getLangDate(lang, new Date(data.OrderInsertDate)),
        AcountSideBalance: cost3,
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
  const CustomCurrency3 = (props) => (
    <CurrencyCell {...props} cell={"AcountSideBalance"} />
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
      field: "InvoiceNumber",
      name: "پیش فاکتور",
    },
    {
      name: "طرف حساب",
      field: "AcountSide",
      children: [
        {
          field: "AcountSideCode",
          name: "کد",
          className: "text-center",
        },
        {
          field: "AcountSideName",
          name: "نام",
          className: "text-center",
        },
        {
          field: "AcountSideLegalName",
          name: "نام حقوقی",
          className: "text-center",
        },
        {
          field: "AcountSideDescription",
          name: "شرح",
          // format: "{0:d}",
          filter: "date",
        },
        {
          field: "AcountSideAddress",
          name: "آدرس",
          className: "text-center",
        },
        {
          field: "AcountSideArea",
          name: "منطقه/مسیر",
          className: "text-center",
        },
        {
          field: "AcountSideBalance",
          name: "مانده حساب",
          className: "text-center",
          cell: CustomCurrency3,
          footerCell: CustomFooterSome,
        },
      ],
    },
    {
      field: "DiscountPercentage",
      name: "درصد تخفیف",
      filter: "numeric",
    },
    {
      field: "Gifts",
      name: "اشانتیون",
    },
    {
      field: "OrderPrice",
      name: "مبلغ",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "Weight",
      name: "وزن (KG)",
    },
    {
      field: "Size",
      name: "حجم (لیتر)",
    },
    {
      field: "SettleType",
      name: "نحوه تسویه",
    },
    {
      field: "Visitor",
      name: "ویزیتور",
    },
    {
      field: "OrderInsertDate",
      name: "سفارش",
      // format: "{0:d}",
    },
    {
      field: "Time",
      name: "ساعت",
    },
    {
      field: "Description",
      name: "توضیحات",
      className: "text-center",
    },
    {
      field: "LackReason",
      name: "دلیل عدم توضیحات",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("تایید پیش فاکتور")}
    />
  );
};
export default PrintConfirmedPurchasesPage;
