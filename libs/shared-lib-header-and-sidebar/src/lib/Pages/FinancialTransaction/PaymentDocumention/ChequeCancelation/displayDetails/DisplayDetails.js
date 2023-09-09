import { React, useEffect, useRef, useState } from "react";
import RKGrid,{ IndexCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import ActionCellMainCheque from "./ActionCellGeneralPayment";
import { history } from "../../../../../utils/history";

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
        BankAccountCode: data.BankAccountCode !== "" ? parseInt(data.BankAccountCode) : "",
        BankAccountNumber: data.BankAccountNumber !== "" ? parseInt(data.BankAccountNumber) : "",
        StartSerial: data.StartSerial !== "" ? parseInt(data.StartSerial) : "",
        PaperCount: data.PaperCount !== "" ? parseInt(data.PaperCount) : "",

      };
    });
    setData(tempData);

    let tempExcel = dataForGrid?.map((data, index) => {
      return {
        ...data,
        IndexCell: index + 1,
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);


  let tempColumn = [
    {
      field: "IndexCell",
      filterable: true,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: false,
    },
    {
      name: "حساب بانکی",
      field: "Bank",
      children: [
        {
          field: "BankAccountCode",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "کد",
          filter: "numeric",
          reorderable: true,
        },
        {
          field: "BankAccountName",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "عنوان",
          reorderable: true,
        },
        {
          field: "BankAccountNumber",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "شماره حساب",
          filter: "numeric",
          reorderable: true,
        },
      ],
    },
    {
      name: "دسته چک",
      field: "ChequeBook",
      children: [
        {
          field: "ChequeDefinitionCode",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "کد",
          filter: "numeric",
          reorderable: true,
        },
        {
          field: "StartSerial",
          // columnMenu: ColumnMenu,
          filterable: true,
          filter: "numeric",
          name: "سریال شروع",
          reorderable: true,
        },
        {
          field: "PaperCount",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "تعداد برگ",
          filter: "numeric",
          reorderable: true,
        },
      ],
    },
    {
      field: "Serial",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "سریال برگ ابطال شده",
      reorderable: true,
    },

    {
      field: "Reason",
      filterable: true,
      // columnMenu: ColumnMenu,
      name: "دلیل ابطال",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "actionCell",
      filterable: false,
      width: "100px",
      name: "عملیات",
      cell: ActionCellMainCheque,
      className: "text-center",
      reorderable: false,
    },
  ];

  const chartObj = [
    { value: "BankAccountNumber", title: t("شماره حساب") },
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


  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/ChequeCancelation`,
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={"payment-cheque-cancelation"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          chartDependent={chartObj}
          rowCount={10}
          excelFileName={t("ابطال برگ چک")}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={false}
          selectKeyField={"DocumentId"}
          getSelectedRows={getSelectedRows}
          
        />

        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="contained"
            color="primary"
            onClick={callComponent}
          >
            {t("جدید")}
          </Button>
        </div>
      </div>
    </>
  );
};
export default DisplayDetails;
