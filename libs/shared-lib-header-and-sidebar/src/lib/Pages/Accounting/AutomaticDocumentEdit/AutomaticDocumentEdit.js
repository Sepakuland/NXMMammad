import React from "react";
import { useFormik} from "formik";
import { useTheme} from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import * as Yup from "yup";
import { Button } from '@mui/material';

export const AutomaticDocumentEdit = () => {


    const { t, i18n } = useTranslation();
    const theme = useTheme();
    // const methodSelect = [t("بازه کد"), t("کد های خاص")];
    const methodSelect = [
        {value:0,title:"بازه کد"},
        {value:1,title:"کد های خاص"},
    ];
    const formik = useFormik({
        initialValues: {
         selectMethod:methodSelect[0].value,
         CodeStart:'',
            CodeEnd: '',
           codeGroup:''
        },
          
        validationSchema: Yup.object({
            selectMethod:Yup.number(),
            CodeStart: Yup.string().when("selectMethod", (selectMethod) => {
                if (selectMethod === 0)
                    return Yup.string().required("وارد کردن از کد الزامیست")
            }),
            codeGroup: Yup.string().when("selectMethod", (selectMethod) => {
                if (selectMethod === 1 )
                    return Yup.string().required("وارد کردن کد کالا الزامیست")
            }),
            CodeEnd: Yup.string().when("selectMethod", (selectMethod) => {
                if (selectMethod === 0)
                    return Yup.string().required("وارد کردن تا کد الزامیست")
            }).when("CodeStart", (CodeStart) => {
                if (parseFloat(formik.values.CodeEnd) < parseFloat(CodeStart) ) {
                    return Yup.number().min(CodeStart, "کد پایانی باید بیشتر از کد شروع باشد")
                }
            }),

        }),
    
        onSubmit: (values) => {

            console.log("values", values);
        },
    });

    console.log('----',formik.values.selectMethod)



  return (
    <>
       <div className='form-template' style={{
              backgroundColor: `${theme.palette.background.paper}`,
              borderColor: `${theme.palette.divider}`,
          }}>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-design">

            <div className="row ">
              <div className='col-12'>
                  <h3 className='title mb-4' style={{color: 'red'}} >{t('عملیات محاسبه مجدد بهای تمام شده بسته به حجم اطلاعات مورد ویرایش، ممکن است زمان زیادی طول بکشد. همچنین توصیه می شود که این عملیات در زمانی که تمام کاربران از سیستم خارج شده اند صورت پذیرد.')}</h3>
              </div>
              <div className="content col-lg-6 col-md-6 col-12" >
                                      <div className="title">
                                          <span>{t("انتخاب روش")}</span>
                                      </div>
                                      <div className="wrapper">
                                          <SelectBox
                                              dataSource={methodSelect}
                                              rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                              className='selectBox'
                                              noDataText={t('اطلاعات یافت نشد')}
                                              itemRender={null}
                                              displayExpr={(item)=>t(item.title)}
                                              valueExpr="value"
                                              placeholder=''
                                              onValueChanged={ (e) => formik.setFieldValue('selectMethod', e.value)}
                                              searchEnabled
                                              //showClearButton
                                              defaultValue={methodSelect[0].value}

                                          />
                                      </div>
                                  </div>
                <div className='content col-lg-6 col-md-6'></div>

                <div className="content col-lg-6 col-md-6 col-12">

                           {!!(formik.values.selectMethod == 0) &&
                                      <>
                   <div className="title">
                      <span>{t("از کد")}<span className="star">*</span></span>
                  </div>
                  <div className="wrapper date-picker position-relative">
                  <input
                    className="form-input"
                    type="number"
                    id="CodeStart"
                    name="CodeStart"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.CodeStart}
                  />
                  </div>
                    {formik.touched.CodeStart && formik.errors.CodeStart ? (
                       <div className='error-msg'>
                        {t(formik.errors.CodeStart)}
                       </div>
                    ) : null}
                    </>
                    }

                   {!!(formik.values.selectMethod == 1) &&
                        <>
                            <div className="title">
                                <span> {t("کد کالاها")} ({t('کد کالاها باید با کاما جدا شود')})<span className="star">*</span></span>
                            </div>
                            <div className="wrapper date-picker position-relative">
                                <textarea
                                    className="form-input"
                                    placeholder="11111,22222,..."
                                    id="codeGroup"
                                    name="codeGroup"
                                    onChange={formik.handleChange }
                                    onBlur={formik.handleBlur}
                                      value={formik.values.codeGroup}
                                />

                            </div>
                               {formik.touched.codeGroup && formik.errors.codeGroup ? (
                                <div className='error-msg'>
                                {t(formik.errors.codeGroup)}
                                </div>
                            ) : null}
                        </>
                    }


              </div>
              <div className="content col-lg-6 col-md-6 col-12">
                      {!!(formik.values.selectMethod == 0) &&
                    <>

                        <div className="title">
                            <span> {t("تا کد")} <span className="star">*</span></span>

                        </div>
                        <div className="wrapper">
                            <div>
                                <input
                                    className="form-input"
                                    type="number"
                                    id="CodeEnd"
                                    name="CodeEnd"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.CodeEnd}
                                />

                            </div>
                        </div>

                        {formik.touched.CodeEnd && formik.errors.CodeEnd ? (
                            <div className='error-msg'>
                                {t(formik.errors.CodeEnd)}
                            </div>
                        ) : null}

                        </>}




              </div>
            
            </div>
          </div>


            </form>
      </div>
        <div>
            <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
                  <Button variant="contained" color="success"
                      type="button"
                      onClick={formik.handleSubmit}

                  >
                      {t("انجام اصلاح")}
                  </Button>
            </div>
        </div>




    </>

  )
}

export default AutomaticDocumentEdit;