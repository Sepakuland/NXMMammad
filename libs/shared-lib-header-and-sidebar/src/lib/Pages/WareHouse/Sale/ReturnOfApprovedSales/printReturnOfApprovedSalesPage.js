import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintReturnOfApprovedSalesPage = () => {
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
        OrderInsertDate: new Date(data.OrderInsertDate),
        ReversionInsertDate: new Date(data.ReversionInsertDate),
        PartnerCode: parseInt(data.PartnerCode),
        OrderCode: parseInt(data.OrderCode),
        ReversionCode: parseInt(data.ReversionCode),
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
      field: "ReversionCode",
      name: "شماره برگشت",
    },
    {
      field: "OrderCode",
      name: "شماره فاکتور",
    },
    {
      field: "PartnerCode",
      name: "کد طرف حساب",
    },
    {
      field: "PartnerName",
      name: "نام طرف حساب",
    },
    {
      field: "PartnerLegalName",
      name: "نام حقوقی",
    },
    {
      field: "PersonnelName",
      name: "نام ویزیتور",
    },
    {
      field: "OrderInsertDate",
      name: "تاریخ فاکتور",
      // format: "{0:d}",
      filter: "date",
    },
    {
      field: "ReversionInsertDate",
      name: "تاریخ برگشت",
      // format: "{0:d}",
      filter: "date",
    },
    {
      field: "WarehouseName",
      name: "انبار",
    },
    {
      field: "ReversionDescription",
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
      subTitle={t("برگشت از فروش های تایید شده")}
    />
  );
};
export default PrintReturnOfApprovedSalesPage;
