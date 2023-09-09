import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CashData from "./salaryData.json";
import ActionCellMain from "./ActionCellMain";
import { history } from "../../../utils/history";

const BillDisplay = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = CashData.map((data) => {
      let temp = data.LoanAmount.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.Installment_Amount.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      return {
        ...data,
        LoanAmount: cost,
        Installment_Amount: cost2,
        Installment_Count: parseInt(data.Installment_Count),
        PersonnelCode: parseInt(data.PersonnelCode),
        Installment_CountInstalled: parseInt(data.Installment_CountInstalled),
        Installment_CountRemained: parseInt(data.Installment_CountRemained),
        ReceiptDate: data.ReceiptDate?new Date(data.ReceiptDate):'',
      };
    });
    setData(tempData);

    let tempExcel = CashData?.map((data, index) => {
      let temp = data.LoanAmount.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.Installment_Amount.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);

      return {
        ...data,
        IndexCell: index + 1,
        LoanAmount: cost,
        Installment_Amount: cost2,
        Installment_Count: parseInt(data.Installment_Count),
        PersonnelCode: parseInt(data.PersonnelCode),
        Installment_CountInstalled: parseInt(data.Installment_CountInstalled),
        Installment_CountRemained: parseInt(data.Installment_CountRemained),
        ReceiptDate:data.ReceiptDate? getLangDate(i18n.language,new Date(data.ReceiptDate)):'',
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );

  const callComponent3 = () => {
    history.navigate(`/Payroll/loans/Edit`);
  };

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
      field: "LoanTitle",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "عنوان",
    },
    {
      field: "PersonnelCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "کد پرسنل",
      filter: "numeric",
    },
    {
      field: "PersonnelName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام پرسنل",
    },
    {
      field: "ReceiptDate",
      filterable: true,
      // columnMenu: DateMenu,
      name: "تاریخ دریافت",
      className: "break-line",
      // format: "{0:d}",
    },
    {
      field: "LoanAmount",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ وام",
      filter: "numeric",
      cell: CurrencyCell,
    },
    {
      name: "بازپرداخت",
      field: "Refund",
      children: [
        {
          field: "Installment_Amount",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "مبلغ قسط",
          filter: "numeric",
          cell: CurrencyCell,
        },
        {
          field: "Installment_Count",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "تعداد قسط",
          filter: "numeric",
        },
        {
          field: "Installment_CountInstalled",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "تسویه شده",
          filter: "numeric",
        },
        {
          field: "Installment_CountRemained",
          // columnMenu: ColumnMenu,
          filterable: true,
          name: "باقی مانده",
          filter: "numeric",
        },
        {
          field: "Installment_Start",
          name: "شروع",
          className: "text-center word-break",
        },
        {
          field: "Installment_End",
          name: "پایان",
          className: "text-center word-break",
        },
      ],
    },
    {
      field: "actionCell",
      filterable: false,
      width: "150px",
      name: "عملیات",
      cell: ActionCellMain,
      className: "text-center",
      reorderable: false,
    },
  ];

  const chartObj = [
    { value: "LoanAmount", title: t("مبلغ وام") },
    { value: "PersonnelCode", title: t("کد پرسنل") },
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
          gridId={"loansBillIssuancePayrollGrid"}
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
          selectKeyField={"LoanId"}
          getSelectedRows={getSelectedRows}
          
          excelFileName={t("وام‌ها")}
        />
        <div className="d-flex justify-content-end mt-3">
          <Button variant="contained" onClick={callComponent3}>
            {t("جدید")}
          </Button>
        </div>
      </div>
    </>
  );
};
export default BillDisplay;
