import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, IndexCell, getLangDate, DateCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import Data from "./Data.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = Data.map((data) => {
      return {
        ...data,
        PeriodDate: getLangDate(lang, new Date(data.DocumentDate)),
        PeriodCode: data.PeriodCode !== "" ? parseInt(data.PeriodCode) : "",
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
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
    },
    {
      field: "PeriodCode",
      name: "کد دوره",
      filter: "numeric",
    },
    {
      field: "PeriodName",
      name: "نام دوره",
      className: "text-center",
    },
    {
      field: "PeriodType",
      name: "نوع دوره",
      className: "text-center",
    },
    {
      field: "PeriodDate",
      name: "تاریخ انبارگردانی",
      // format: "{0:d}",
      className: "text-center",
      filter: "date",
      cell: DateCell,
    },
    {
      field: "Warehouse",
      name: "انبار",
      className: "text-center",
    },
    {
      field: "Storekeeper",
      name: "انباردار",
      className: "text-center",
    },
    {
      field: "PeriodDescription",
      name: "توضیحات",
      className: "text-center",
    },
    {
      field: "Status",
      name: "وضعیت",
      className: "text-center",
    },
  ];

  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("دوره های انبارگردانی")}
      >
        <div className="row betweens">
          <div className="col-lg-3 col-md-3 col-3">{t("تاریخ ثبت")}:</div>
          <div className="col-lg-3 col-md-3 col-3">{t("انبار")} :</div>
          <div className="col-lg-3 col-md-3 col-3">{t("انباردار")} :</div>
          <div className="col-lg-3 col-md-3 col-3">{t("توضیحات")} :</div>
        </div>
      </Print>
    </>
  );
};
export default PrintPage;
