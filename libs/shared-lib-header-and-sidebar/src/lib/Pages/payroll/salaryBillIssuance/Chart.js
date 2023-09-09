import React, { useEffect, useState } from "react";
import data2 from "./salaryData.json";
import { useTranslation } from "react-i18next";
import ChartPage from "../../../components/chart/ChartPage";

function Chart() {
  const [data, setData] = useState([]);
  const { t, i18n } = useTranslation();
  const [savedCharts, setSavedCharts] = useState([
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ]);
  useEffect(() => {
    let tempData = data2.map((data) => {
      let temp = data.Benefits.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.Deductions.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.Loans.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      let temp4 = data.PurePayment.toString().replaceAll(",", "");
      let cost4 = parseFloat(temp4, 2);

      return {
        ...data,
        Benefits: cost,
        Deductions: cost2,
        Loans: cost3,
        PurePayment: cost4,
        BillCode: parseInt(data.BillCode),
        PersonnelCode: parseInt(data.PersonnelCode),
      };
    });
    setData(tempData);
  }, [i18n.language]);

  console.log("data", data);

  const columnsObj = [
    { value: "BillCode", title: t("شماره فیش") },
    { value: "PersonnelCode", title: t("کد پرسنل") },
    { value: "PersonnelName", title: t("نام پرسنل") },
    { value: "Month", title: t("ماه") },
    { value: "Benefits", title: t("جمع مزایا") },
    { value: "Deductions", title: t("جمع کسورات") },
    { value: "Loans", title: t("اقساط وام") },
    { value: "PurePayment", title: t("خالص پرداختنی") },
  ];

  const chartObj = [
    { value: "BillCode", title: t("شماره فیش") },
    { value: "PersonnelCode", title: t("کد پرسنل") },
    { value: "PersonnelName", title: t("نام پرسنل") },
    { value: "Month", title: t("ماه") },
    { value: "Benefits", title: t("جمع مزایا") },
    { value: "Deductions", title: t("جمع کسورات") },
    { value: "Loans", title: t("اقساط وام") },
    { value: "PurePayment", title: t("خالص پرداختنی") },
  ];

  return (
    <>
      <ChartPage
        data={data}
        columnsObj={columnsObj}
        chartObj={chartObj}
        savedCharts={savedCharts}
      />
    </>
  );
}

export default Chart;
