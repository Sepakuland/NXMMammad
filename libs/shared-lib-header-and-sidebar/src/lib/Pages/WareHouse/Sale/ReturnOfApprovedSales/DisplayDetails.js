import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome, TotalTitle,IndexCell,getLangDate,DateCell } from "rkgrid";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import ActionCellMain from "./ActionCellMain";

const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
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

    let tempExcel = dataForGrid?.map((data, index) => {
      return {
        ...data,
        IndexCell: index + 1,
        OrderInsertDate: getLangDate(
          i18n.language,
          new Date(data.OrderInsertDate)
        ),
        ReversionInsertDate: getLangDate(
          i18n.language,
          new Date(data.ReversionInsertDate)
        ),
        PartnerCode: parseInt(data.PartnerCode),
        OrderCode: parseInt(data.OrderCode),
        ReversionCode: parseInt(data.ReversionCode),
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "50px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false,
    },
    {
      field: "ReversionCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره برگشت",
      filter: "numeric",
    },
    {
      field: "OrderCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره فاکتور",
      filter: "numeric",
    },
    {
      field: "PartnerCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "کد طرف حساب",
      filter: "numeric",
    },
    {
      field: "PartnerName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام طرف حساب",
    },
    {
      field: "PartnerLegalName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام حقوقی",
    },
    {
      field: "PersonnelName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام ویزیتور",
    },
    {
      field: "OrderInsertDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ فاکتور",
      // format: "{0:d}",
      cell: DateCell,
      filter: "date",
    },
    {
      field: "ReversionInsertDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ برگشت",
      // format: "{0:d}",
      cell: DateCell,
      filter: "date",
    },
    {
      field: "WarehouseName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "انبار",
    },
    {
      field: "ReversionDescription",
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "100px",
      name: "توضیحات",
      className: "text-center",
      reorderable: false,
    },
    {
      field: "actionCell",
      filterable: false,
      width: "170px",
      name: "عملیات",
      cell: ActionCellMain,
      className: "text-center",
      reorderable: false,
    },
  ];

  const chartObj = [
    { value: "PartnerCode", title: t("کد طرف حساب") },
  ];

  let savedCharts = [
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ];

  function getSavedCharts(list) {
    console.log("save charts list to request and save:", list);
  }

  function getSelectedRows(list) {
    console.log("selected row list to request:", list);
  }

  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={"PrintReturnOfApprovedSalesPage"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={true}
          showPrint={true}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          excelFileName={t("برگشت از فروش های تایید شده")}
          reorderable={true}
          selectable={false}
        />
      </div>
    </>
  );
};
export default DisplayDetails;
