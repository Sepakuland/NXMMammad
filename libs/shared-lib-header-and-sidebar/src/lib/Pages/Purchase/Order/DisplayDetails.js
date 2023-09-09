import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import ActionCellMain from "./ActionCellMain";
import { history } from "../../../utils/history";

const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.OrderPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        OrderInsertDate: new Date(data.OrderInsertDate),
        OrderPrice: cost,
        PartnerCode: parseInt(data.PartnerCode),
      };
    });
    setData(tempData);

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = data.OrderPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        IndexCell: index + 1,
        OrderInsertDate: getLangDate(
          i18n.language,
          new Date(data.OrderInsertDate)
        ),
        OrderPrice: cost,
        PartnerCode: parseInt(data.PartnerCode),
      };
    });
    setExcelData(tempExcel);
  }, [i18n.language]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => (
    <CurrencyCell {...props} cell={"OrderPrice"} />
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
      field: "OrderCode",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره خرید",
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
      field: "OrderInsertDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ خرید",
      // format: "{0:d}",
      cell: DateCell,
      filter: "date",
    },
    {
      field: "Status",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "وضعیت",
    },
    {
      field: "MaturateDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "زمان تایید",
      // format: "{0:d}",
      // cell: DateCell,
      filter: "date",
    },
    {
      field: "OrderPrice",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ فاکتور",
      filter: "numeric",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },

    {
      field: "WarehouseName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "انبار",
    },
    {
      field: "Description",
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
    { value: "OrderPrice", title: t("مبلغ") },
    { value: "PartnerCode", title: t("کد") },
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
      `/buy/order/Sharing`,
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
          gridId={"PrintPurchaseOrderPage"}
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
          excelFileName={t("درخواست‌های خرید")}
          reorderable={true}
          selectable={false}
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
