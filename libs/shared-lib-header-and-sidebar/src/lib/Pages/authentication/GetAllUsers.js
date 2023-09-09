import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { getLangDate } from "../../utils/getLangDate";
import ActionCell from "../../components/kenoGride/ActionCell";
import RKGrid from "../../components/RKGrid/RKGrid";
import axios from "axios";
import IndexCell from "../../components/RKGrid/IndexCell";
import DateCell from "../../components/RKGrid/DateCell";
import FooterSome from "../../components/RKGrid/FooterSome";

const GetAllUsers = () => {
  const { t, i18n } = useTranslation();

  const appConfig = window.globalConfig;

  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const dataRef = useRef();
  dataRef.current = rawData;

  useEffect(() => {
    if (rawData.length) {
      let tempData = rawData.map((data) => {
        return {
          ...data,
          passExpiryTime: new Date(data.passExpiryTime),
          passiveExpiryTime: new Date(data.passiveExpiryTime),
        };
      });
      setData(tempData);

      let tempExcel = rawData?.map((data, index) => {
        return {
          ...data,
          IndexCell: index + 1,
          passExpiryTime: getLangDate(
            i18n.language,
            new Date(data.passExpiryTime)
          ),
          passiveExpiryTime: getLangDate(
            i18n.language,
            new Date(data.passiveExpiryTime)
          ),
        };
      });
      setExcelData(tempExcel);
    }
  }, [i18n.language, rawData]);

  console.log(rawData);
  const theme = useTheme();

  console.log("rawData:", rawData);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );

  useEffect(() => {
    axios
      .get(`${appConfig.BaseURL}/api/authenticate/GetAllUsers/`)
      .then((res) => setRawData(res.data))
      .catch((error) => error);
  }, []);

  function getSavedCharts(list) {
    console.log("save charts list to request and save:", list);
  }

  function getSelectedRows(list) {
    console.log("selected row list to request:", list);
  }

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: true,
    },
    {
      field: "userName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام کاربری",
      // orderIndex:5
    },
    {
      field: "userIP",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "آی پی کاربر",
      // orderIndex:6
    },
    {
      field: "isRemoved",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "حذف شده",
      // orderIndex:4
    },
    {
      field: "lockoutEnabled",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "فعال",
      // orderIndex:7
    },
    {
      field: "passExpiryTime",
      // columnMenu: DateMenu,
      filterable: true,
      filter: "date",
      // format: "{0:d}",
      name: "تاریخ انقضا رمز عبور",
      cell: DateCell,
      // orderIndex:3
    },
    {
      field: "passiveExpiryTime",
      // columnMenu: DateMenu,
      filter: "date",
      // format: "{0:d}",
      filterable: true,
      name: "تاریخ غیرفعال شدن",
      cell: DateCell,
      // orderIndex:8
    },
    {
      field: "actionCell",
      filterable: false,
      width: "100px",
      name: "عملیات",
      cell: ActionCell,
      className: "text-center",
      // orderIndex:10,
      reorderable: false,
    },
  ];
  const chartObj = [
    { value: "DocumentBalance", title: t("تراز سند") },
    { value: "DocumentCode", title: t("کد سند") },
  ];

  let savedCharts = [
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={"allusers"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          excelFileName={"گرید تست"}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectKeyField={"userID"}
          getSelectedRows={getSelectedRows}
          
        />
      </div>
    </>
  );
};

export default GetAllUsers;
