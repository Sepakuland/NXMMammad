
import { React, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataSettingUltimateGrid.json'
import ActionCellMain from "./ActionCellMainSettingUltimateGrid";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";

const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([])
  const [excelData, setExcelData] = useState([])
  const dataRef = useRef()
  dataRef.current = data

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = (data.DebtorTotal).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)

      let temp2 = (data.CreditorTotal).toString().replaceAll(',', '')
      let cost2 = parseFloat(temp2, 2)
      
      let temp3 = (data.Remainder).toString().replaceAll(',', '')
      let cost3 = parseFloat(temp3, 2)

      let temp4 = (data.MatchedPrice).toString().replaceAll(',', '')
      let cost4 = parseFloat(temp4, 2)

      let temp5 = (data.NotMatchedPrice).toString().replaceAll(',', '')
      let cost5 = parseFloat(temp5, 2)
      return {
        ...data,
        DebtorTotal: cost,
        CreditorTotal: cost2,
        Remainder: cost3,
        MatchedPrice: cost4,
        NotMatchedPrice: cost5,
        EntityCode:parseInt(data.EntityCode),
        
      }
    })
    setData(tempData)

    let tempExcel = dataForGrid?.map((data, index) => {

      let temp = (data.DebtorTotal).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)

      let temp2 = (data.CreditorTotal).toString().replaceAll(',', '')
      let cost2 = parseFloat(temp2, 2)
      
      let temp3 = (data.Remainder).toString().replaceAll(',', '')
      let cost3 = parseFloat(temp3, 2)

      let temp4 = (data.MatchedPrice).toString().replaceAll(',', '')
      let cost4 = parseFloat(temp4, 2)

      let temp5 = (data.NotMatchedPrice).toString().replaceAll(',', '')
      let cost5 = parseFloat(temp5, 2)



      return {
        ...data,
        IndexCell: index + 1,
       
        DebtorTotal: cost,
        CreditorTotal: cost2,
        Remainder: cost3,
        MatchedPrice: cost4,
        NotMatchedPrice: cost5,
        EntityCode:parseInt(data.EntityCode),
      
        
      }
    })
    setExcelData(tempExcel)

  }, [i18n.language])


  // "EntityCode": "10001010",
  // "EntityName": "تامین کننده تست",
  // "PartnerLegalName": "",
  // "CentralEntityCode": "",
  // "CentralEntityName": "",
  // "DebtorTotal": "21,160,000",
  // "CreditorTotal": "344,200,000",
  // "Remainder": "323,040,000",
  // "RemainderType": "بس",
  // "MatchedPrice": "0",
  // "NotMatchedPrice": "21,160,000",
  // "EntityId": "a27fc732-b53a-427b-bda2-1eff122596e5"




  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

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
          name: 'تفضیلی',
          field: 'PartnerName',
          children: [
              {
                  field: 'EntityCode',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "کد",
                  filter:'numeric'
                
                
              },
              {
                  field: 'EntityName',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "نام",
                 
                 
              
              },
              {
                  field: 'PartnerLegalName',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "نام حقوقی",
              
                
              },
          ]
      },
      {
          name: 'دفتر مرکزی',
          field: 'PartnerName',
          // orderIndex:2,
          children: [
              {
                  field: 'CentralEntityCode',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "کد",
                  filter: 'numeric',
                 
              },
              {
                  field: 'CentralEntityName',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "نام",
                  
                 
              },
          ]
      },
      {
          name: 'گردش',
          field: 'PartnerLegalName',
        
          children: [
              {
                  field: 'DebtorTotal',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "بدهکار",
                  filter: 'numeric',
                  cell:CurrencyCell,
                  footerCell: CustomFooterSome,
              },
              {
                  field: 'CreditorTotal',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "بستانکار",
                  cell: CurrencyCell,
                  footerCell: CustomFooterSome,
                  filter: 'numeric',
                
              },
              {
                  field: 'Remainder',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "مانده",
                  cell: CurrencyCell,
                  footerCell: CustomFooterSome,
                  filter: 'numeric',
                  
              },
              {
                  field: 'RemainderType',
                  // columnMenu: ColumnMenu,
                  filterable: true,
                  name: "تشخیص",
                
               
               
              },
          ]
      },
    {
        field: 'MatchedPrice',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "تطبیق داده شده",
      cell: CurrencyCell,
      filter: 'numeric',
      footerCell: CustomFooterSome,
     
    },
    {
        field: 'NotMatchedPrice',
      // columnMenu: ColumnMenu,
      filterable: true,
      filter: "numeric",
      name: "تطبیق داده نشده",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
      },
     {
          field: 'actionCell',
          filterable: false,
          width: '60px',
          name: "عملیات",
          cell: ActionCellMain,
          className: 'text-center',
          reorderable: false
      }
   
  ]

  const chartObj = [
    { value: "Price", title: t('مبلغ') },
    { value: "DocumentCode", title: t('کد سند') },
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

  


  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'SettingGrid2'}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={true}
          excelFileName={t('تطبیق گردش اشخاص')}
          showPrint={true}
          chartDependent={chartObj}
          rowCount={10}
          savedChartsList={savedCharts}
          getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          
          getSelectedRows={getSelectedRows}
          

        />
          </div>
         
    </>
  )
}
export default DisplayDetails
