
import { React, useEffect, useRef, useState } from "react";
import {useTheme, Button} from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGridSummaryGrid.json'
import ActionCellMain from "./ActionCellMainSummaryGrid";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";
import { history } from "../../../../utils/history";

const DisplayDetails = () => {
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
        DocumentDate: new Date(data.DocumentDate),
        TotalPrice: cost,
       
        DocumentCode: parseInt(data.DocumentCode),
       
      }
    })
    setData(tempData)

    let tempExcel = dataForGrid?.map((data, index) => {
      let temp = (data.TotalPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        TotalPrice: cost,
       
        DocumentCode: parseInt(data.DocumentCode),
      }
    })
    setExcelData(tempExcel)

  }, [i18n.language])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const callComponent = () => {
      history.navigate(`/FinancialTransaction/SummaryOfSalary`, 'noopener,noreferrer');
    }


    

  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '50px',
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
      cell: DateCell,
      filter: 'numeric',
     
      },
      {
          name: 'تنخواه گردان / صندوق',
          field: 'test2',
         
          children: [
              {
                  field: 'CreditAccountCode',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "کد",
                  filter: 'numeric',
                  // orderIndex:2
              },
              {
                  field: 'CreditAccountName',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "نام",
                  
                  
                 
              },
          ]
      },

    {
      field: 'TotalPrice',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "جمع مبلغ",
      filter: 'numeric',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
      
      },

    {
      field: 'DocumentDescription',
      // columnMenu: ColumnMenu,
      filterable: true,
      width: '100px',
      name: "توضیحات",
      className: 'text-center',
      reorderable: false
    },
       {
      field: 'actionCell',
      filterable: false,
      width: '100px',
      name: "عملیات",
      cell: ActionCellMain,
      className: 'text-center',
    
      reorderable: false
    }
  ]

  const chartObj = [
    { value: "TotalPrice", title: t('جمع مبلغ') },
    // { value: "DocumentCode", title: t('کد سند') },
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
                  gridId={'SummaryGrid'}
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
                  selectable={false}
                  excelFileName={t("صورت خلاصه تنخواه")}
                  

        />
          <div className="d-flex justify-content-end mt-3">
              <Button variant="contained"

                      onClick={callComponent}>
                  {t("جدید")}
              </Button >
          </div>
          </div>

    </>
  )
}
export default DisplayDetails
