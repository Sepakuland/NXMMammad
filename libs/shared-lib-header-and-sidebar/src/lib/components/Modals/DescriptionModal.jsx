import { Button, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import DatePicker from "react-multi-date-picker";
import * as Yup from "yup"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useRef } from "react";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../utils/calenderLang";
import { julianIntToDate } from "../../utils/dateConvert";


export default function DescriptionModal({ getData, closeModal }) {
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const formik = useFormik({
        initialValues: {
            description: ""
        },
        onSubmit: (values) => {
            getData(values)
            closeModal()
        }
    })

    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    border: "none"
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        <div className="row">
                            <div className="content-col-12">
                                <div className="wrapper">
                                    <div>
                                        <textarea
                                            className="form-input"
                                            name="description"
                                            onChange={formik.handleChange}
                                            value={formik.values.description}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className='d-flex justify-content-center'>
                <Button
                    variant="contained"
                    color='success'
                    style={{ margin: '0 2px' }}
                    onClick={formik.handleSubmit}
                >
                    {t('ذخیره')}
                </Button>
                <Button
                    variant="outlined"
                    color='error'
                    style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                    onClick={() => closeModal()}
                >{t('انصراف')}
                </Button>
            </div>
        </>
    )
}