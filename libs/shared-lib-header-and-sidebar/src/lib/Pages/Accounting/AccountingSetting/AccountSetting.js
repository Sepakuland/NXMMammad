import { karadummyLeft } from "../../../components/SetGrid/karadummyLeft.js";
import { karadummyRight } from "../../../components/SetGrid/karadummyRight";
import Button from '@mui/material/Button';
import { useTheme} from "@mui/material";
import React, { useEffect, useState } from 'react'
import { Kara } from "../../../components/SetGrid/Kara";
import { useTranslation } from 'react-i18next';
import { history } from "../../../utils/history";

export const AccountSetting = () => {
   const { t, i18n } = useTranslation()

    const [matches,setMatches]=useState([])

    useEffect(()=>{
        setMatches([
            
            {
                "Id": 200,
                "DebtorArticleId": 2,
                "CreditorArticleId": 21,
                "MatchPrice": 80000
            }

        ])
    },[])

    const theme=useTheme()
function getData(data){
    console.log('getData data',data)
  }
    const GobackGrid = () => {
        history.navigate(`/Accounting/SettingUltimateGridR`, 'noopener,noreferrer');
    }

  return (

      <div className="form-template p-4" style={{
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
      }} >
         <div className="row"   >
             <div className='content col-auto flex-grow-1'>
                 <p className='kara-table-info'>{t('کد تفضیلی') }:10001002</p>
             </div>
             <div className='content col-auto flex-grow-1'>
                 <p className='kara-table-info'>{t('نام تفضیلی')}: شرکت تولیدی آرپا نوش</p>
             </div>
             <div className='content col-auto flex-grow-1'>
                 <p className='kara-table-info'> {t('جمع بدهکار')}: 2,844,223,646</p>
             </div>
             <div className='content col-auto flex-grow-1'>
                 <p className='kara-table-info'>{t('جمع بستانکار')}: 1,256,742,444</p>
             </div>
            
         </div>

         <Kara debtor={karadummyRight} creditor={karadummyLeft} matches={matches}  showOtherBtn={true} getData={getData}/>
          <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
              <Button variant="contained" color="success"
                  type="button"
                  style={{marginLeft:"10px"}}
                 

              >
                  {t("ثبت تغییرات")}
              </Button>

              <div className="Issuance">
                  <Button variant="contained"

                      color='error'
                      onClick={GobackGrid}
                  >
                      {t("انصراف")}
                  </Button >
              </div>
          </div>
      </div>

  )



}
export default AccountSetting;

