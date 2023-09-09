
import { React, useEffect, useRef, useState } from "react";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGrid.json'
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import ActionCellMainR from "./ActionCellMainR";
import { history } from '../../../../../utils/history';

const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([])
  const [excelData, setExcelData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = (data.Price).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        Price: cost,
        DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
        PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
        PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
        BankTransferCode: data.BankTransferCode !== '' ? parseInt(data.BankTransferCode) : '',
      }
    })
    setData(tempData)

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = (data.Price).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        DocumentDate: getLangDate(i18n.language,new Date(data.DocumentDate)),
        Price: cost,
        DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
        PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
        PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
        BankTransferCode: data.BankTransferCode !== '' ? parseInt(data.BankTransferCode) : '',
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
      field: 'DocumentCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "کد",
      filter: 'numeric',
      reorderable: true
    },
    {
      field: 'DocumentDate',
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ",
      // format: "{0:d}",
      className: 'text-center',
      filter: 'date',
      cell: DateCell,
      reorderable: true
    },
    {
      field: 'PartnerCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "کد طرف حساب",
      className: 'text-center',
      filter: 'numeric',
      reorderable: true
    },
    {
      field: "PartnerName",
      // columnMenu: ColumnMenu,
      filterable: true,
      name: 'طرف حساب',
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'PartnerLegalName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام حقوقی",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'PartnerTelephones',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "تلفن",
      className: 'text-center',
      filter: 'numeric',
      reorderable: true
    },
    {
      field: 'PartnerAddress',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "آدرس",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'AccountName',
      // columnMenu: ColumnMenu,
      filterable: true,
           name: "بانک",
      width: '160px',
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'BankTransferCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره فیش",
      filter:'numeric',
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'Cashier',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "صندوقدار",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'CollectorName',
      filterable: true,
      // columnMenu: ColumnMenu,
      name: "تحصیلدار",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'Price',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: 'numeric',
      className: 'text-center',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
      reorderable: true
    },
    {
      field: 'SettlementDocuments',
      filterable: true,
      // columnMenu: ColumnMenu,
      name: "تسویه",
      width: '160px',
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'DocumentDescription',
      filterable: true,
      // columnMenu: ColumnMenu,
      name: "توضیحات",
      width: '160px',
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'actionCell',
      filterable: false,
      width: '170px',
      name: "عملیات",
      cell: ActionCellMainR,
      className: 'text-center',
      reorderable: false
    },

  ]

  const chartObj = [
    { value: "Price", title: t('مبلغ') },
    { value: "DocumentCode", title: t("کد") },
    { value: "BankAccountNumber", title: t("شماره حساب") },
    { value: "PartnerTelephones", title: t("تلفن") },
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

  const callComponent = () => {
    history.navigate(`/FinancialTransaction/receiptDocument/remittanceReceivable/Issuance`);
  }

  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'RemittandeReceivable'}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          excelFileName={t('دریافت بانکی')}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={false}
          selectKeyField={'DocumentId'}
          getSelectedRows={getSelectedRows}
          
        />
        <div className="row align-items-start">
          <div className="d-flex justify-content-end col-sm-12 col-12 mt-3">
            <Button variant="contained"
              color="primary"
              onClick={callComponent}>
              {t("جدید")}
            </Button >
          </div>
        </div>
      </div>
    </>
  )
}
export default DisplayDetails
