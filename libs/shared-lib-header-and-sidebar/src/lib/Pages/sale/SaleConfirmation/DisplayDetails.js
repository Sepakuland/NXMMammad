import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome, CurrencyCell, TotalTitle,IndexCell,DateCell,getLangDate } from "rkgrid";
import { useTheme,  Button } from "@mui/material";
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
      let temp = data.OrderPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.ReversionPrice.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.ReversionPrice.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      return {
        ...data,
        OrderInsertDate: new Date(data.OrderInsertDate),
        ReversionDate: new Date(data.ReversionDate),
        MaturateDate: new Date(data.MaturateDate),
        OrderPrice: cost,
        ReversionPrice: cost2,
        AcountSideBalance: cost3,
        PartnerCode: parseInt(data.PartnerCode),
      };
    });
    setData(tempData);

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = data.OrderPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.ReversionPrice.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.ReversionPrice.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      return {
        ...data,
        IndexCell: index + 1,
        OrderInsertDate: getLangDate(
          i18n.language,
          new Date(data.OrderInsertDate)
        ),
        ReversionDate: getLangDate(i18n.language, new Date(data.ReversionDate)),
        MaturateDate: getLangDate(i18n.language, new Date(data.MaturateDate)),
        OrderPrice: cost,
        ReversionPrice: cost2,
        AcountSideBalance: cost3,
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
  const CustomCurrency2 = (props) => (
    <CurrencyCell {...props} cell={"ReversionPrice"} />
  );
  const CustomCurrency3 = (props) => (
    <CurrencyCell {...props} cell={"AcountSideBalance"} />
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
      field: "InvoiceNumber",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "پیش فاکتور",
      filter: "numeric",
    },
    {
      name: "طرف حساب",
      field: "AcountSide",
      children: [
        {
          field: "AcountSideCode",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "کد",
          className: "text-center",
          reorderable: true,
        },
        {
          field: "AcountSideName",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "نام",
          className: "text-center",
          reorderable: true,
        },
        {
          field: "AcountSideLegalName",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "نام حقوقی",
          className: "text-center",
          reorderable: true,
        },
        {
          field: "AcountSideDescription",
          // columnMenu: DateMenu,
          filterable: true,
          name: "شرح",
          // format: "{0:d}",
          cell: DateCell,
          filter: "date",
        },
        {
          field: "AcountSideAddress",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "آدرس",
          className: "text-center",
          reorderable: true,
        },
        {
          field: "AcountSideArea",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "منطقه/مسیر",
          className: "text-center",
          reorderable: true,
        },
        {
          field: "AcountSideBalance",
          filterable: true,
          // columnMenu: ColumnMenu,
          width: "100px",
          name: "مانده حساب",
          filter: "numeric",
          className: "text-center",
          reorderable: true,
          cell: CustomCurrency3,
          footerCell: CustomFooterSome,
        },
      ],
    },
    {
      field: "DiscountPercentage",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "درصد تخفیف",
      filter: "numeric",
    },
    {
      field: "Gifts",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "اشانتیون",
    },
    {
      field: "OrderPrice",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: "numeric",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "Weight",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "وزن (KG)",
      filter: "numeric",
    },
    {
      field: "Size",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "حجم (لیتر)",
      filter: "numeric",
    },
    {
      field: "SettleType",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نحوه تسویه",
    },
    {
      field: "Visitor",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "ویزیتور",
    },
    {
      field: "OrderInsertDate",
      // columnMenu: DateMenu,
      filterable: true,
      name: "سفارش",
      // format: "{0:d}",
      cell: DateCell,
      filter: "date",
    },
    {
      field: "Time",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "ساعت",
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
      field: "LackReason",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "دلیل عدم توضیحات",
    },
    {
      field: "actionCell",
      filterable: false,
      width: "250px",
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
    console.log("confirmed");
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
          gridId={"PrintSaleConfirmationPage"}
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
          selectKeyField={"OrderId"}
          excelFileName={t("تایید پیش فاکتور")}
          reorderable={true}
          selectable={true}
        />
        <div className="d-flex justify-content-end mt-3">
          <Button variant="contained" color="primary" onClick={callComponent}>
            {t("تایید")}
          </Button>
        </div>
      </div>
    </>
  );
};
export default DisplayDetails;
