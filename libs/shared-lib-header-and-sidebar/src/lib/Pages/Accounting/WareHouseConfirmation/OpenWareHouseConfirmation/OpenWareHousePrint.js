import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { IndexCell,DateCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import OpenWareHouseData from "./OpenWareHouseData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const OpenWareHousePrint = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = OpenWareHouseData.map((data) => {
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        DocumentCode: parseInt(data.DocumentCode),
        DocumentRefCode:
          data.DocumentRefCode !== "" ? parseInt(data.DocumentRefCode) : "",
      };
    });
    setData(tempData);
  }, [lang]);

  let tempColumn = [
    {
      field: "IndexCell",
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
    },
    {
      field: "DocumentCode",
      name: "شماره رسید",
      width: "60px",
      filter: "numeric",
    },
    {
      field: "DocumentDate",
      name: "تاریخ رسید",
      width: "60px",
      // format: "{0:d}",
      cell: DateCell,
    },
    {
      field: "Warehouse",
      width: "60px",
      name: "انبار",
    },
    {
      field: "WarehouseKeeperName",
      width: "60px",
      name: "انباردار",
    },
    {
      field: "DocumentRefType",
      width: "60px",
      name: "نوع",
    },
    {
      field: "DocumentRefCode",
      width: "60px",
      name: "کد سند ارجاع",
      filter: "numeric",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("تایید ورود از انبار")}
    />
  );
};
export default OpenWareHousePrint;
