
import { React, useEffect, useRef, useState } from "react";
import RKGrid, {  IndexCell } from "rkgrid";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGridProgressGrid.json'
import ProgressCell from "../../../Accounting/AutomaticDocumentAmendment/ProgressFolder/ProgressCell"
import { useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import { history } from "../../../../utils/history";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from 'sweetalert'



const DisplayDetails = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([])
  const [data1, setData1] = useState([])
  const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    const dataRef1 = useRef()

    const {state}= useLocation();

    
console.log('state----------------------------------',state?.values)



    const referBack = () => {
        history.navigate(`/Accounting/AutomaticDocumentAmendment/AmendmentGrid`);
    }
    dataRef.current = data

    dataRef1.current = data1
    const formik = useFormik({
      initialValues: {
        id: Math.floor(Math.random() * 1000),
        StartDate:"",
        EndDate:"",
        DocumentNumberStart:"",
        DocumentNumberEnd:"",
       
          },
      validationSchema: Yup.object({
      
  
        
        
      }),
      onSubmit: (values) => {

        
        swal({
          title: t("پایان عملیات"),
          icon: "success",
          text: t("عملیات اصلاح اسناد خودکار با 9 خطا به پایان رسید"),
          button:t("تائید"),
        });
         
          console.log('values',values);
         
        
      },
    });

    const mystyle = {
      color: "red",
      
    };
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
    let tempData = dataForGrid?.ProgressInformations?.map((data) => {
     
      return {
        ...data,
      
      }
    })
    setData(tempData)

 
    let tempData1 = dataForGrid?.Errors?.map((data1) => {
     
      return {
        ...data1,
      
      }
    })
    setData1(tempData1)

  }, [i18n.language])



  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '50px',
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
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
       cell:ProgressCell,
      },
    
  ]
  // "DocumentId": "777a07cd-67d9-498c-8086-0704348d087b",
  // "DocumentCode": "31633",
  // "DocumentDate": "1401/04/20",
  // "DocumentType": "فروش",
  // "RefDocumentCode": "12875",
  // "DocumentDescription": "ثبت بابت فروش کالا به مجید  مرادی طی شماره فاکتور 12875 پیش فاکتور 1014458 و حواله 1039 شرح ",
  // "DocumentBalance": 0,
  // "ErrorText": "تفضیلی کد 10212092 هنوز به تأیید قسمت حسابداری نرسیده است و امکان صدور سند حسابداری برای آن وجود ندارد.\r\n"


  //////////////////////////NextGrid\\\\\\\\\\\\\\\\\\\\\\\\\\


  let tempColumn2 = [
    {
      field: 'IndexCell',
      filterable: false,
      cell: IndexCell,
      width: '50px',
      name: "ردیف",  
      sortable: false,
      reorderable: false
    },
    {
      field: 'DocumentCode',
      filterable: false,
      name: "شماره سند",
    },
    {
      field: 'DocumentDate',       
      filterable: false,
      name: "تاریخ",
    },
    {
      field: 'DocumentType',
      filterable: false,
      
      name: "نوع سند",
    },
    {
      field: 'RefDocumentCode',
      filterable: false,
      name: "شماره ارجاع",
    },
    {
      field: 'DocumentDescription',
      filterable: false,
      name: "شرح سند",
    },
    {
      field: 'DocumentBalance',
      filterable: false,
      name: "تراز",
     
    },
    {
      field: 'ErrorText',
      filterable: false,    
      name: "خطا", 
      className:"thisone"
      
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
    console.log('selected row list to request:', list)
  }


  return (
    <>
      <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
        <RKGrid
          gridId={'AutomaticGrid'}
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



        <h6 style={{marginTop:20}}>{t("موارد ناموفق")}</h6>  

        <RKGrid
          gridId={'AutomaticGridProp'}
          gridData={data1}
          columnList={tempColumn2}
          showSetting={false}
          showChart={false}
          showExcelExport={false}
          showPrint={false}
          sortable={false}
          pageable={true}
          rowCount={10}
          reorderable={true}
          selectable={false}
          selectKeyField={'DocumentTypeId'}
          getSelectedRows={getSelectedRows}
          

        />
          </div>
          <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
          <Button variant="contained" color="success"
                  type="button"
                  style={{marginLeft:"10px"}}
                  onClick={formik.handleSubmit}
                 

              >
                  {t("تائید")}
              </Button>

              <div className="Issuance">
                  <Button variant="contained"
                      color='error'
                      onClick={referBack}
                  >
                      {t("انصراف")}
                  </Button >
              </div>
          </div>





          
    </>
  )
}
export default DisplayDetails
