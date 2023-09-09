
import { React, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGridAutomaticAmendement.json'
import RKGrid, {  IndexCell,TotalTitle } from "rkgrid";
import Button from '@mui/material/Button';
import { useNavigate  } from "react-router-dom";





const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [data, setData] = useState([])
  const [selected,setSelected]=useState([])
    const dataRef = useRef()



    const referBack = () => {
        navigate(`/Accounting/AutomaticDocumentAmendment`);
    }
    const ProgressBar = () => {

      navigate('/Accounting/ProgressGridProp',{ state: { values: selected },replace: false })
  }
    dataRef.current = data



    // "DocumentTypeId": "00000000-0000-0000-0000-000000000102",
    // "DocumentType": "حواله انبار به انبار",
    // "AllCount": 20,
    // "CorrectedCount": 0,
    // "ErrorCount": 0,
    // "RemainedCount": 20,
    // "Progress": 0,
    // "ElapsedTime":26,
    // "RemainingTime":46

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
     
      return {
        ...data,
      
      }
    })
    setData(tempData)

  }, [i18n.language])


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
      field: 'DocumentType',
      filterable: false,
      name: "نوع سند",
    },
    {
      field: 'AllCount',       
      filterable: false,
      name: "تعداد سند",
    },
    {
      field: 'CorrectedCount',
      filterable: false,
      filter: "numeric",
      name: "اصلاح شده",
    },
    {
      field: 'ErrorCount',
      filterable: false,
      name: "ناموفق",
    },
    {
      field: 'RemainedCount',
      filterable: false,
      name: "باقیمانده",
    },
    {
      field: 'ElapsedTime',
      filterable: false,
      name: "زمان سپری شده",
      filter: 'numeric',
    },
    {
      field: 'RemainingTime',
      filterable: false,
      name: "زمان باقیمانده",
    },
      {
       field: 'Progress',
       filterable: false,
       width: '100px',
       name: "پیشرفت",
      },
    
  ]

  // const chartObj = [
  //   { value: "Price", title: t('مبلغ') },
  //   { value: "DocumentCode", title: t('کد سند') },
  // ]

  // let savedCharts = [
  //   { title: 'تست 1', dashboard: false },
  //   { title: 'تست 2', dashboard: true },
  // ]

  function getSavedCharts(list) {
    console.log('save charts list to request and save:', list)
  }

  function getSelectedRows(list) {
    setSelected(list)
    console.log('selected row list to request:', list)
  }


  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'AutomaticDocGrid'}
          gridData={data}
          columnList={tempColumn}
          showSetting={false}
          showChart={false}
          showExcelExport={false}
          showPrint={false}
          showFilter={false}
          sortable={true}
          pageable={false}
          reorderable={true}
          selectable={true}
          selectKeyField={'DocumentTypeId'}
          getSelectedRows={getSelectedRows}
          

        />
          </div>
          <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
              <Button variant="contained" color="success"
                  type="button"
                  onClick={ProgressBar}
              >
                  {t("تائید")}

              </Button>

              <div className="Issuance">
                  <Button variant="contained"
                      color='error'
                      onClick={referBack}>
                      {t("انصراف")}
                  </Button >
              </div>
          </div>
    </>
  )
}
export default DisplayDetails
