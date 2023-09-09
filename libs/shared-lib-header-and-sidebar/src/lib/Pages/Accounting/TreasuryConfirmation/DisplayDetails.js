import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { useTheme, Button, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import ActionCellMain from "./ActionCellMainTC";


const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const [selectedRows, SetSelectedRows] = useState();

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        MaturityDate: new Date(data.MaturityDate),
        Price: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PayerCode: parseInt(data.PayerCode),
        RecipientCode: parseInt(data.RecipientCode),
        ChequeCode: data.ChequeCode?parseInt(data.ChequeCode):data.ChequeCode,
      };
    });
    setData(tempData);

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
        MaturityDate: getLangDate(i18n.language, new Date(data.MaturityDate)),
        Price: cost,
        DocumentCode: parseInt(data.DocumentCode),
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
      field: "DocumentType",
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "100px",
      name: "نوع تراکنش",
    },
    {
      field: "DocumentCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "کد تراکنش",
      filter: "numeric",
      width: "100px",
    },
    {
      field: "Operation",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "عملیات",
    },
    {
      field: "DocumentDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ",
      filter: "date",
      // format: "{0:d}",
      cell: DateCell,
    },
    {
      field: "PayerCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      name: "کد پرداخت کننده",
    },
    {
      field: "PayerName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام پرداخت کننده",
    },
    {
      field: "RecipientCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      name: "کد دریافت کننده",
    },
    {
      field: "RecipientName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام دریافت کننده",
    },
    {
      field: "Price",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: "numeric",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "ChequeCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "سریال چک",
      filter: "numeric",
    },
    {
      field: "MaturityDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "سررسید چک",
      filter: "date",
      // format: "{0:d}",
      cell: DateCell,
    },
    {
      field: "actionCell",
      filterable: false,
      width: "90px",
      name: "عملیات",
      cell: ActionCellMain,
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

  function confirm(list) {
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
          gridId={"TreasuryConfirmationDisplayDetailsPage"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={true}
          excelFileName={t("تایید خزانه داری")}
          selectKeyField={"DocumentId"}
          getSelectedRows={getSelectedRows}
          
        />

        <div className="d-flex justify-content-end mt-3">
          <Button variant="contained" color="primary" onClick={confirm}>
            {t("تایید")}
          </Button>
        </div>
      </div>

    </>
  );
};
export default DisplayDetails;
