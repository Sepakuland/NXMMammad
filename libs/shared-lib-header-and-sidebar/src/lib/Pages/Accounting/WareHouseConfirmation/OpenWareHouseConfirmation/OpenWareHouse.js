import { React, useEffect, useRef, useState } from "react";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import OpenWareHouseData from "./OpenWareHouseData.json";
import RKGrid, {  IndexCell,getLangDate,DateCell } from "rkgrid";
import ActionCellMainEWH from "./ActionCellMainEWH";

const OpenWareHouse = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const [selectedRows, SetSelectedRows] = useState();

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

    let tempExcel = OpenWareHouseData?.map((data, index) => {
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
        DocumentCode: parseInt(data.DocumentCode),
        DocumentRefCode:
          data.DocumentRefCode !== "" ? parseInt(data.DocumentRefCode) : "",
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: false,
    },
    {
      field: "DocumentCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره رسید",
      filter: "numeric",
    },
    {
      field: "DocumentDate",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "تاریخ رسید",
      // format: "{0:d}",
      cell: DateCell,
      filter: "date",
    },
    {
      field: "Warehouse",
      filterable: true,
      // columnMenu: ColumnMenu,
      name: "انبار",
    },
    {
      field: "WarehouseKeeperName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "انباردار",
    },
    {
      field: "DocumentRefType",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نوع",
    },
    {
      field: "DocumentRefCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "کد سند ارجاع",
      filter: "numeric",
    },
    {
      field: "actionCell",
      filterable: false,
      width: "170px",
      name: "عملیات",
      cell: ActionCellMainEWH,
      className: "text-center",
      reorderable: false,
    },
  ];

  const chartObj = [
    { value: "Price", title: t("مبلغ") },
    { value: "DocumentCode", title: t("کد سند") },
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
    SetSelectedRows(list);
  }

  function confrim(list) {
    console.log(":/", selectedRows);
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
          gridId={"OpenWareHouse"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={false}
          showPrint={true}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={true}
          selectKeyField={"DocumentId"}
          getSelectedRows={getSelectedRows}
          
        />
      </div>
      <div className="Confrim">
        <Button variant="contained" color="primary" onClick={confrim}>
          {t("تایید")}
        </Button>
      </div>
    </>
  );
};
export default OpenWareHouse;