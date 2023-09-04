import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useCreateClosingDocumentMutation } from "../../../features/slices/accountingDocumentSlice";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../utils/calenderLang";
import DateObject from "react-date-object";
import { julianIntToDateTime } from "../../../utils/dateConvert";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { LoadingButton } from "@mui/lab";


export default function CreateClosingDocumentModal({ closeModal, fiscalYear }) {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    /* -------------------------------------------------------------------------- */
    /*                                    Redux                                   */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Mutation -------------------------------- */
    const [createClosingDocument, closingResults] = useCreateClosingDocumentMutation()
    useEffect(() => {
        if (closingResults.status == "fulfilled" && closingResults.isSuccess) {
            closingDocumentSub(fiscalYear.fiscalYearName)
            closeModal()
        }
        else if (closingResults.isError) {
            let arr = closingResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }

    }, [closingResults.status])
    console.log("closingResults", closingResults)
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const formik = useFormik({
        initialValues: {
            DocumentDate: '',
            SubsidiaryNumber: '',
            FiscalYearId: fiscalYear.fiscalYearId
        },
        onSubmit: (values) => {
            createClosingDocument(values).unwrap()
            .catch((error) => {
                console.error(error)
            })
        },
    });

    const dateRef = useRef()
    /* -------------------------------------------------------------------------- */

    /* ------------------------------- SweetAlerts ------------------------------ */
    const closingDocumentSub = (fiscalYearName) => {
        swal({
            title: t(`سند اختتامیه ${fiscalYearName} و سند افتتاحیه سال بعدی با موفقیت ثبت شد`),
            icon: "success",
            button: t("باشه"),
        });
    };
    /* -------------------------------------------------------------------------- */

    return (
        <>
            <div className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                <div className="title mb-0"> {t("سند اختتامیه")} </div>
                <button type='button' className='close-btn' onClick={() => closeModal()}>
                    <CloseIcon />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='form-design'>
                    <div className='row'>
                        <div className='col-sm-6 col-12'>
                            <div className="title">
                                <span>{t("تاریخ سند")}</span>
                            </div>
                            <div className="wrapper date-picker position-relative">
                                <DatePicker
                                    name={`DocumentDate`}
                                    ref={dateRef}
                                    id="DocumentDate"
                                    calendar={renderCalendarSwitch(i18n.language)}
                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                    calendarPosition="bottom-right"
                                    value={formik.values.DocumentDate ? new DateObject(formik.values.DocumentDate) : ''}
                                    onChange={(date) => {
                                        formik.setFieldValue(`DocumentDate`, date ? julianIntToDateTime(date.toJulianDay()) : '');
                                    }}
                                />
                                <div
                                    className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <CalendarMonthIcon className='calendarButton' /></div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6 col-12'>
                            <div className="title">
                                <span> {t("شماره فرعی")} </span>
                            </div>
                            <div className='wrapper'>
                                <input
                                    className='form-input'
                                    id='SubsidiaryNumber'
                                    name='SubsidiaryNumber'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.SubsidiaryNumber}
                                />
                            </div>
                        </div>
                        <div className='col-12 mb-0'>
                            <div className={`button-pos ${i18n.dir()}`}>
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={formik.handleSubmit}
                                    loading = {closingResults.isLoading}
                                >
                                    {t("تایید")}
                                </LoadingButton>
                                <div className="Issuance">
                                    <Button variant="contained"
                                        color='error'
                                        onClick={closeModal}
                                    >
                                        {t("انصراف")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}