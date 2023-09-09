
import { React, useEffect, useRef, useState } from "react";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from './DataForGrid.json'
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";
import ActionCellMainUT from "./ActionCellMainUT";
import { Link, useLocation } from "react-router-dom";

const UnsentTotal = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([])
  const [excelData, setExcelData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = (data.TotalPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        TotalPrice: cost,
        TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
        OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
        MachineVolumeCapacity: data.MachineVolumeCapacity !== '' ? parseInt(data.MachineVolumeCapacity) : '',
        VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
        VolumeSumPercent: data.VolumeSumPercent !== '' ? parseInt(data.VolumeSumPercent) : '',
        MachineWeightCapacity: data.MachineWeightCapacity !== '' ? parseInt(data.MachineWeightCapacity) : '',
        WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
        WeightSumPercent: data.WeightSumPercent !== '' ? parseInt(data.WeightSumPercent) : '',

      }
    })
    setData(tempData)

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = (data.TotalPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        IndexCell: index + 1,
        TotalPrice: cost,
        OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
        MachineVolumeCapacity: data.MachineVolumeCapacity !== '' ? parseInt(data.MachineVolumeCapacity) : '',
        VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
        VolumeSumPercent: data.VolumeSumPercent !== '' ? parseInt(data.VolumeSumPercent) : '',
        MachineWeightCapacity: data.MachineWeightCapacity !== '' ? parseInt(data.MachineWeightCapacity) : '',
        WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
        WeightSumPercent: data.WeightSumPercent !== '' ? parseInt(data.WeightSumPercent) : '',
      }
    })
    setExcelData(tempExcel)
  }, [i18n.language])
  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: true,
      width: '60px',
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false
    },
    {
      field: 'TotalCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره سرجمع",
      filter: 'numeric',
      reorderable: true
    },
    {
      field: 'PayeeName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "موزع",
      reorderable: true
    },
    {
      field: 'DriverName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "راننده",
      reorderable: true
    },
    {
      field: 'Machine',
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "180px",
      name: "خودرو",
      reorderable: true
    },
    {
      field: 'OrdersCount',
      // columnMenu: ColumnMenu,
      filter: 'numeric',
      filterable: true,
      name: "تعداد پیش فاکتور",
      footerCell: CustomFooterSome,
      reorderable: true
    },
    {
      field: 'TotalPrice',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "جمع مبلغ",
      filter: 'numeric',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
      reorderable: true
    },
    {
      field: 'MachineVolumeCapacity',
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: 'numeric',
      // width: '100px',
      name: "ظرفیت حجمی(dm3/لیتر)",
      footerCell: CustomFooterSome,
      reorderable: true
    },
    {
      field: 'VolumeSum',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مجموع حجم(dm3/لیتر)",
      footerCell: CustomFooterSome,
      reorderable: true
    },
    {
      field: 'VolumeSumPercent',
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      name: "درصد حجم اشغال شده",
      footerCell: CustomFooterSome,
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'MachineWeightCapacity',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "ظرفیت وزنی(Kg)",
      footerCell: CustomFooterSome,
      filter: 'numeric',
      reorderable: true
    },
    {
      field: 'WeightSum',
      filterable: true,
      // columnMenu: ColumnMenu,
      filter: 'numeric',
      // width: '90px',
      name: "مجموع وزن(Kg)",
      footerCell: CustomFooterSome,
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'WeightSumPercent',
      filterable: true,
      // columnMenu: ColumnMenu,
      filter: 'numeric',
      // width: '100px',
      name: "درصد وزن اشغال شده",

      className: 'text-center',
      reorderable: true
    },
    {
      field: 'actionCell',
      filterable: false,
      width: "90px",
      name: "عملیات",
      cell: ActionCellMainUT,
      className: 'text-center',
      reorderable: false
    },

  ]

  const chartObj = [
    { value: "TotalPrice", title: t("جمع مبلغ") },
    { value: "TotalCode", title: t("شماره سرجمع") },
    { value: "OrdersCount", title: t("تعداد پیش فاکتور") },
    , { value: "MachineVolumeCapacity", title: t("ظرفیت حجمی(dm3/لیتر)") },
    { value: "VolumeSum", title: t("مجموع حجم(dm3/لیتر)") },
    { value: "VolumeSumPercent", title: t("درصد حجم اشغال شده") },
    { value: "MachineWeightCapacity", title: t("ظرفیت وزنی(Kg)") },
    { value: "WeightSum", title: t("مجموع وزن(Kg)") },
    { value: "WeightSumPercent", title: t("درصد وزن اشغال شده") },

  ]

  let savedCharts = [
    { title: 'تست 1', dashboard: false },
    { title: 'تست 2', dashboard: true },
  ]

  function getSavedCharts(list) {
    console.log('save charts list to request and save:', list)
  }

  function getSelectedRows(list) {
    console.log('selected row list to request:', list)
  }


  // const callComponent = () => {
  //   history.navigate(`/WareHouse/sale/approvedInvoices`);
  // }
  const url = `/WareHouse/sale/approvedInvoices`;
  const location = useLocation()
  const { state } = location

  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'unsent_Total'}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          excelFileName={t("ویرایش سرجمع های ارسال نشده")}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={false}
          selectable={false}
          selectKeyField={'TotalId'}
          getSelectedRows={getSelectedRows}
          
        />


        <div className="d-flex justify-content-end col-lg-12 col-12 mt-3">
          <Button variant="contained"
            color="primary"
          ><Link to={!!state?.prevPath ? state?.prevPath : url}>
              {t("بازگشت")}
            </Link>
          </Button >
        </div>

      </div>
    </>
  )
}
export default UnsentTotal
