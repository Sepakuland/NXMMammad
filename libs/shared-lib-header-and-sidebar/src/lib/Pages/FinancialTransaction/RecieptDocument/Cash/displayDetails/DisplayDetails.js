
import { React, useEffect, useRef, useState } from "react";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from '../../Cash/displayDetails/dataForGrid.json'
import ActionCellMainCash from "./ActionCellMainCash";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
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
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
      }
    })
    setData(tempData)

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = (data.Price).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
        Price: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: parseInt(data.PartnerTelephones),
      }
    })
    setExcelData(tempExcel)

  }, [i18n.language])

  const callComponent = () => {
    history.navigate(`/FinancialTransaction/receiptDocument/Cash/issuance`, 'noopener,noreferrer');
  }

  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={'Price'} />

  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
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

    },
    {
      field: 'DocumentDate',
      // columnMenu: DateMenu,
      filterable: true,
      name: "تاریخ",
      // format: "{0:d}",
      filter:'date',
      cell: DateCell,
    },
    {
      field: 'PartnerCode',
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      name: "کد طرف حساب",
    },
    {
      field: 'PartnerName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "طرف حساب",
    },
    {
      field: 'PartnerLegalName',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نام حقوقی",
    },
    {
      field: 'PartnerTelephones',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "تلفن",
      width: "110px",
      filter: 'numeric',
    },
    {
      field: 'PartnerAddress',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "آدرس",
    },
    {
      field: 'CashAccountName',
      // columnMenu: ColumnMenu,
      filterable: true,
      width: "100px",
      name: "صندوق",
    },
    {
      field: 'CollectorName',
      filterable: true,
      // columnMenu: ColumnMenu,
      name: "تحصیلدار",
      width: "110px",
      className: 'text-center',
      reorderable: false
    },
    {
      field: 'Price',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "مبلغ",
      filter: 'numeric',
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: 'SettlementDocuments',
      filterable: true,
      // columnMenu: ColumnMenu,
      width: "110px",
      name: "تسویه",
      className: 'text-center',
      reorderable: false
    },
    {
      field: 'DocumentDescription',
      filterable: true,
      // columnMenu: ColumnMenu,
      width: "110px",
      name: "توضیحات",
      className: 'text-center',
      reorderable: false
    },
    {
      field: 'actionCell',
      filterable: false,
      width: '170px',
      name: "عملیات",
      cell: ActionCellMainCash,
      className: 'text-center',
      reorderable: false
    }
  ]

  const chartObj = [
    { value: "Price", title: t('مبلغ') },

  ]


  let savedCharts = [
    { title: 'تست 1', dashboard: false },
    { title: 'تست 2', dashboard: true },
  ]

  function getSavedCharts(list) {
    console.log('save charts list to request and save:', list)
  }



  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'payment_cash'}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={true}
          showExcelExport={true}
          showPrint={true}
          excelFileName={t('دریافت نقد')}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={false}

        />

        <div className="Issuance col-12 d-flex justify-content-end">
          <Button variant="contained"
            color="primary"
            onClick={callComponent}>
            {t("جدید")}
          </Button >
        </div>
      </div>
    </>
  )
}
export default DisplayDetails
