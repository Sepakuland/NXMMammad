import React,{useRef} from 'react'
import { useTranslation } from "react-i18next";
import DatePicker from "react-multi-date-picker";
import { julianIntToDate } from "../../../utils/dateConvert";
import { useFormik } from "formik";
import * as Yup from "yup";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTheme } from "@mui/material";
import { renderCalendarLocaleSwitch } from "../../../utils/calenderLang";
import { renderCalendarSwitch } from '../../../utils/calenderLang'
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
   



export const AutomaticDocument = () => {
    


    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const dateRef1=useRef()
    const dateRef2=useRef()


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

            navigate('/Accounting/AutomaticDocumentAmendment/AmendmentGrid',{ state: { values: values },replace: false })
           
            console.log('values',values);
           
          
        },
      });



  return (
      <>

          <div className='form-template'
              style={{
                  backgroundColor: `${theme.palette.background.paper}`,
                  borderColor: `${theme.palette.divider}`,
              }}
          >
      <div className="form-design">
              <div className="row">

              <div className="content col-lg-6 col-md-6 col-12">
              <div className="title">
                    <span>{t("تاریخ از")}</span>
                </div>
                <div className="wrapper date-picker position-relative" onFocus={()=> dateRef2?.current?.closeCalendar()} >
                      <DatePicker
                          name="StartDate"
                          id="StartDate"
                          ref={dateRef1}
                          editable={false}
                            calendar={renderCalendarSwitch(i18n.language)}
                            locale={renderCalendarLocaleSwitch(i18n.language)}
                          onBlur={formik.handleBlur}
                          onChange={(val) => {
                              formik.setFieldValue(
                                  "StartDate",
                                  julianIntToDate(val.toJulianDay())
                              );
                          }}
                  />
                     <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>  
                          <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton'/></div>
                     </div>   
                  </div> 
              </div>
              <div className="content col-lg-6 col-md-6 col-12" onFocus={()=> dateRef1?.current?.closeCalendar()}>
              <div className="title">
                    <span>{t("تا")}</span>
                </div>  
               <div className="wrapper date-picker position-relative">
                      <DatePicker
                          name="EndDate"
                          id="EndDate"
                          editable={false}
                          ref={dateRef2}
                          calendar={renderCalendarSwitch(i18n.language)}
                          locale={renderCalendarLocaleSwitch(i18n.language)}
                          disabled={!formik.values.StartDate}
                          minDate={new Date(formik.values.StartDate)}
                          onBlur={formik.handleBlur}
                          onChange={(val) => {
                              formik.setFieldValue(
                                  "EndDate",
                                  julianIntToDate(val.toJulianDay())
                              );
                          }}
                      />
                   <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}> 
                      <div className='d-flex align-items-center justify-content-center'><CalendarMonthIcon className='calendarButton'/></div>
                  </div>  
               </div> 
              </div>
              <div className="content col-lg-6 col-md-6 col-12" onFocus={()=> dateRef2?.current?.closeCalendar()}>
              <div className="title">
                      <span>{t("شماره سند از")}</span>
                </div>  
                      <div className="wrapper">
                        <div style={{position:'relative'}}>
                        <input
                          className="form-input"
                          type="number"
                          id="DocumentNumberStart"
                          name="DocumentNumberStart"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.DocumentNumberStart}
                        />
                        </div>
                      </div>
              </div>
              <div className="content col-lg-6 col-md-6 col-12">
              <div className="title">
                      <span>{t("تا")} </span>
                 </div>
                      <div className="wrapper">
                      <input
                          className="form-input"
                          type="number"
                          id="DocumentNumberEnd"
                          name="DocumentNumberEnd"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.DocumentNumberEnd}
                        />
                      </div>
              </div>
              </div>
            </div>

          </div>

           <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
          
              <Button variant="contained" color="success"
                      onClick={formik.handleSubmit}
                      type="button">                
                  <span>{t("نمایش")} </span>
              </Button>


             </div>
   </>
  )

       


}

export default AutomaticDocument