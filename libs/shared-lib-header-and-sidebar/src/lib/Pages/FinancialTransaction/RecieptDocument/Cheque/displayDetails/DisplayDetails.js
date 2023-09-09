
import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from '../../Cheque/displayDetails/dataForGrid.json'
import ActionCellMainCheque from "./ActionCellMainCheque";
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
      let temp = (data.InputPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        MaturityDate: new Date(data.MaturityDate),
        InputPrice: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
      }
    })
    setData(tempData)

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = (data.InputPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
        MaturityDate: getLangDate(i18n.language, new Date(data.MaturityDate)),
        InputPrice: cost,
        DocumentCode: parseInt(data.DocumentCode),
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
      name: "پشت نمره",
      filter: 'numeric',
      width: "90px",
      reorderable: true
    },
    {
      field: 'ChequeCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره چک",
      filter: 'numeric',
      reorderable: true
    },
    {
      field: 'BankAccountNumber',
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      name: "شماره حساب",
      reorderable: true
    },
    {
      field: 'BankName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "بانک",
      reorderable: true
    },
    {
      field: 'Branch',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شعبه",
      reorderable: true
    },
    {
      field: 'DocumentDate',
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ",
      // format: "{0:d}",
      filter: 'date',
      cell:DateCell,
      reorderable: true
    },
    {
      field: 'PartnerCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: 'numeric',
      // width: '100px',
      name: "کد طرف حساب",
      reorderable: true
    },
    {
      field: 'PartnerName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "طرف حساب",
      reorderable: true
    },
    {
      field: 'PartnerTelephones',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "تلفن",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'PartnerAddress',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "آدرس",
      reorderable: true
    },
    {
      field: 'Delivery',
      filterable: true,
      // columnMenu: ColumnMenu,
      // width: '90px',
      name: "تحویل دهنده",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'CashAccount',
      filterable: true,
      // columnMenu: ColumnMenu,
      // width: '100px',
      name: "صندوق",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'Cashier',
      filterable: true,
      // columnMenu: ColumnMenu,
      // width: '100px',
      name: "صندوقدار",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'Issuance',
      filterable: true,
      // columnMenu: ColumnMenu,
      // width: '100px',
      name: "محل صدور",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'MaturityDate',
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ سررسید",
      // format: "{0:d}",
      filter: 'date',
      cell:DateCell,
      reorderable: true
    },
    {
      field: 'InputPrice',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: 'numeric',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
      reorderable: true
    },
    {
      field: 'SettlementDocuments',
      // columnMenu: ColumnMenu,
      filterable: true,
      // width: '90px',
      name: "تسویه",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'PayedToPartnerName',
      filterable: true,
      // columnMenu: ColumnMenu,
      // width: '90px',
      name: "خرج به",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'chequeState',
      // columnMenu: ColumnMenu,
      filterable: true,
      // width: '90px',
      name: "وضعیت",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'DocumentDescription',
      filterable: true,
      // columnMenu: ColumnMenu,
      width: '90px',
      name: "توضیحات",
      className: 'text-center',
      reorderable: true
    },
    {
      field: 'actionCell',
      filterable: false,
      width: '170px',
      name: "عملیات",
      cell: ActionCellMainCheque,
      className: 'text-center',
      reorderable: false
    },

  ]

  const chartObj = [
    { value: "InputPrice", title: t('مبلغ') },
    { value: "DocumentCode", title: t("پشت نمره") },
    { value: "BankAccountNumber", title: t("شماره حساب") },
    { value: "PartnerCode", title: t("کد طرف حساب") },
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
    history.navigate(`/FinancialTransaction/receiptDocument/Cheque/Issuance`, 'noopener,noreferrer');
  }
  function callInProgress() {
    history.navigate(`/FinancialTransaction/receiptDocument/Cheque/InProgress`, 'noopener,noreferrer')
  }
  function callCollection() {
    history.navigate(`/FinancialTransaction/receiptDocument/Cheque/Collection`, 'noopener,noreferrer')
  }
  function CallReturn() {
    history.navigate(`/FinancialTransaction/receiptDocument/Cheque/Return`, 'noopener,noreferrer')
  }
  function CallGiveBack() {
    history.navigate(`/FinancialTransaction/receiptDocument/Cheque/GiveBack`, 'noopener,noreferrer')
  }
  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'payment_cheque'}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          excelFileName={t('چک های دریافتی')}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={true}
          selectKeyField={'DocumentId'}
          getSelectedRows={getSelectedRows}
          
        />
        <div className="row align-items-start">
          <div className="col-sm-10 col-12 flex-wrap d-flex ">
            <Button variant="contained" className='mt-3' style={i18n.dir()==='rtl'?{marginLeft:'15px'}:{marginRight:'15px'}}
              color="primary"
              onClick={callInProgress}>
              {t("در جریان وصول")}
            </Button >
            <Button variant="contained" className='mt-3'  style={i18n.dir()==='rtl'?{marginLeft:'15px'}:{marginRight:'15px'}}
              color="primary"
              onClick={callCollection}>
              {t("وصول")}
            </Button >
            <Button variant="contained"  className='mt-3' style={i18n.dir()==='rtl'?{marginLeft:'15px'}:{marginRight:'15px'}}
              onClick={CallReturn}
              color="primary">
              {t("برگشت")}
            </Button >
            <Button variant="contained" className='mt-3' style={i18n.dir()==='rtl'?{marginLeft:'15px'}:{marginRight:'15px'}}
              color="primary"
              onClick={CallGiveBack}>
              {t("بازپسدهی")}
            </Button >
          </div>
          <div className="d-flex justify-content-end col-sm-2 col-12 mt-3">
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
