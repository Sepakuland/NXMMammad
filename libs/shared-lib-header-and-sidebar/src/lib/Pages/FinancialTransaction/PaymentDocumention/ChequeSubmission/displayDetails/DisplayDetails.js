import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import ActionCellMainCheque from "./ActionCellMainCheque";
import { history } from "../../../../../utils/history";

const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [selectedKey, setSelectedKey] = useState({});
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.OutputPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        MaturityDate: new Date(data.MaturityDate),
        OutputPrice: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones:
          data.PartnerTelephones !== "" ? parseInt(data.PartnerTelephones) : "",
      };
    });
    setData(tempData);

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = data.OutputPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
        MaturityDate: getLangDate(i18n.language, new Date(data.MaturityDate)),
        OutputPrice: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: parseInt(data.PartnerTelephones),
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => (
    <CurrencyCell {...props} cell={"InputPrice"} />
  );

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: true,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false,
    },
    {
      field: "DocumentCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "پشت نمره",
      filter: "numeric",
      width: "80px",
      reorderable: true,
    },
    {
      field: "ChequeCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "سریال",
      filter: "numeric",
      reorderable: true,
    },
    {
      field: "DocumentDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ",
      // format: "{0:d}",
      filter: "date",
      cell: DateCell,
      reorderable: true,
    },
    {
      field: "PartnerCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      width: "100px",
      name: "کد طرف حساب",
      reorderable: true,
    },
    {
      field: "PartnerName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "طرف حساب",
      reorderable: true,
    },
    {
      field: "PartnerTelephones",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "تلفن",
      filter: "numeric",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "PartnerAddress",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "آدرس",
      reorderable: true,
    },
    {
      field: "BankName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "بانک",
      reorderable: true,
    },
    {
      field: "Branch",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شعبه",
      reorderable: true,
    },
    {
      field: "Delivery",
      filterable: true,
      // columnMenu: ColumnMenu,
      width: "90px",
      name: "تحویل گیرنده",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "Issuance",
      filterable: true,
      // columnMenu: ColumnMenu,
      width: "100px",
      name: "محل صدور",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "MaturityDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ سررسید",
      // format: "{0:d}",
      filter: "date",
      cell: DateCell,
      reorderable: true,
    },
    {
      field: "OutputPrice",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: "numeric",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
      reorderable: true,
    },
    {
      field: "SettlementDocuments",
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "90px",
      name: "تسویه",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "chequeState",
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "90px",
      name: "وضعیت",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "DocumentDescription",
      filterable: true,
      // columnMenu: ColumnMenu,
      width: "90px",
      name: "توضیحات",
      className: "text-center",
      reorderable: true,
    },
    {
      field: "actionCell",
      filterable: false,
      width: "200px",
      name: "عملیات",
      cell: ActionCellMainCheque,
      className: "text-center",
      reorderable: false,
    },
  ];

  const chartObj = [
    { value: "OutputPrice", title: t("مبلغ") },
    { value: "DocumentCode", title: t("پشت نمره") },
  ];

  let savedCharts = [
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ];

  function getSavedCharts(list) {
    console.log("save charts list to request and save:", list);
  }

  function getSelectedRows(list) {
    if(list.length){
      setSelectedKey(list[0])
    }

    console.log("selected row list to request:", list);
  }


  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/issuance`,
      "noopener,noreferrer"
    );
  };
  const callComponent2 = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/displayDetails/ReturnPage`,
      "noopener,noreferrer"
    );
  };
  const callComponent3 = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/displayDetails/PassPage?id=${selectedKey.DocumentId}`
    );
  };
  const callComponent4 = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/Cheque/displayDetails/RetractionPage`,
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
          gridId={"payment_cheque_displayDetails"}
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
          excelFileName={t("پرداخت چک")}
          selectionMode={"single"} //single , multiple
          selectKeyField={"DocumentId"}
          getSelectedRows={getSelectedRows}
          
        />
        <div className='row mt-3'>
          <div className='col-sm-9 col-12'>
            <div className="Issuance d-flex">
              <Button
                  variant="contained"
                  color="primary"
                  disabled={!Object.keys(selectedKey).length}
                  onClick={callComponent3}
                  style={i18n.dir()==='rtl'?{marginLeft:'10px'}:{marginRight:'10px'}}
              >
                {t("پاس")}
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  disabled={!Object.keys(selectedKey).length}
                  onClick={callComponent2}
                  style={i18n.dir()==='rtl'?{marginLeft:'10px'}:{marginRight:'10px'}}
              >
                {t("بر‌گشت")}
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  disabled={!Object.keys(selectedKey).length}
                  onClick={callComponent4}
              >
                {t("باز‌پسگیری")}
              </Button>
            </div>
          </div>
          <div className='col-sm-3 col-12'>
            <div className="Issuance d-flex justify-content-end">
              <Button
                  variant="contained"
                  color="primary"
                  onClick={callComponent}
              >
                {t("جدید")}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
export default DisplayDetails;
