import { LoadingButton } from "@mui/lab";
import { Box, Button, ToggleButtonGroup, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { StyledToggleButton } from "../../StyledToggleButton";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useFetchSettingsQuery, useUpdateCodingLengthMutation } from "../../../features/slices/commonSystemSettingsSlice";


export default function CodingSettings({ closeModal, datasourceLength }) {

    /* -------------------------------------------------------------------------- */
    /*                                    Redux                                   */
    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Query --------------------------------- */
    const [content, setContent] = useState("")
    const { data: res, isFetching, error } = useFetchSettingsQuery();
    useEffect(() => {
        if (isFetching) {
            setContent(<CircularProgress />)
        } else if (error) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            formik.setFieldValue("groupLength", res.groupLength)
            formik.setFieldValue("kolLength", res.kolLength)
            formik.setFieldValue("moeinLength", res.moeinLength)
            formik.setFieldValue("detailedLength", res.detailedLength)
        }
    }, [isFetching])

    /* -------------------------------- Mutations ------------------------------- */
    const [updateCodingLength, updateResults] = useUpdateCodingLengthMutation()
    useEffect(() => {
        if (updateResults.status == "fulfilled" && updateResults.isSuccess) {
            closeModal()
        }
        else if (updateResults.isError) {
            let arr = updateResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }

    }, [updateResults.status])
    /* -------------------------------------------------------------------------- */

    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const formik = useFormik({
        initialValues: {
            groupLength: 0,
            kolLength: 0,
            moeinLength: 0,
            detailedLength: 0
        },
        onSubmit: (values) => {
            updateCodingLength({ id: 1, settings: values }).unwrap()
                .catch((error) => {
                    console.error(error)
                })
        }
    })

    const HandleGroupLengthChange = (event, newGroupLength) => {
        if (newGroupLength !== null) {
            formik.setFieldValue('groupLength', newGroupLength)
        }
    }
    const HandleKolLengthChange = (event, newKolLength) => {
        if (newKolLength !== null) {
            formik.setFieldValue('kolLength', newKolLength)
        }
    }
    const HandleMoeinLengthChange = (event, newMoeinLength) => {
        if (newMoeinLength !== null) {
            formik.setFieldValue('moeinLength', newMoeinLength)
        }
    }
    const HandleDetailedLengthChange = (event, newDetailedLength) => {
        if (newDetailedLength !== null) {
            formik.setFieldValue('detailedLength', newDetailedLength)
        }
    }
    /* -------------------------------------------------------------------------- */

    /* ------------------------------- SweetAlerts ------------------------------ */
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success mx-2',
            cancelButton: 'btn btn-danger mx-2',
            container: 'swalRTL'
        },
        width: "600px",
        buttonsStyling: false
    })
    const warningOnChange = () => {
        if (datasourceLength === 1) {
            formik.handleSubmit()
        }
        else {
            swalWithBootstrapButtons.fire({
                title: 'هشدار',
                text: "این عملیات مغایر قوانین مالیاتی و استانداردهای حسابداری است.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'تایید و ادامه',
                cancelButtonText: 'انصراف',
            }).then((result) => {
                if (result.isConfirmed) {
                    formik.handleSubmit()
                }
                else if (result.dismiss === Swal.DismissReason.cancel) {
                    closeModal()
                }
            })
        }
    }
    /* -------------------------------------------------------------------------- */

    return (
        <>
            <div style={{ display: "flex" }}></div>
            <div
                className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                <div className="title mb-0"> {t("طول کد حسابها")} </div>
                <button type='button' className='close-btn' onClick={() => closeModal()}>
                    <CloseIcon />
                </button>
            </div>
            {content == "" ?
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        <div className="d-flex justify-content-between my-3">
                            <div className="title">
                                <span> {t("گروه")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={formik.values.groupLength}
                                        exclusive
                                        onChange={HandleGroupLengthChange}
                                        aria-label="Platform"
                                        dir="rtl"
                                    >
                                        <StyledToggleButton size="small" value={2}>2</StyledToggleButton>
                                        <StyledToggleButton size="small" value={3}>3</StyledToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between my-3">
                            <div className="title">
                                <span> {t("کل")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={formik.values.kolLength}
                                        exclusive
                                        onChange={HandleKolLengthChange}
                                        aria-label="Platform"
                                    >
                                        <StyledToggleButton size="small" value={2}>2</StyledToggleButton>
                                        <StyledToggleButton size="small" value={3}>3</StyledToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between my-3">
                            <div className="title">
                                <span> {t("معین")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={formik.values.moeinLength}
                                        exclusive
                                        onChange={HandleMoeinLengthChange}
                                        aria-label="Platform"
                                    >
                                        <StyledToggleButton size="small" value={2}>2</StyledToggleButton>
                                        <StyledToggleButton size="small" value={3}>3</StyledToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between my-3">
                            <div className="title">
                                <span> {t("تفضیلی")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={formik.values.detailedLength}
                                        exclusive
                                        onChange={HandleDetailedLengthChange}
                                        aria-label="Platform"
                                    >
                                        <StyledToggleButton size="small" value={6}>6</StyledToggleButton>
                                        <StyledToggleButton size="small" value={7}>7</StyledToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center' style={{ marginTop: "30px" }}>
                            <LoadingButton
                                variant="contained"
                                color='success'
                                style={{ margin: '0 2px' }}
                                onClick={warningOnChange}
                                loading={updateResults.isLoading}
                            >
                                {t('تایید')}
                            </LoadingButton>
                            <Button
                                variant="outlined"
                                color='error'
                                style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                                onClick={() => closeModal()}
                            >{t('بازگشت')}
                            </Button>
                        </div>
                    </div>
                </form>
                :
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {content}
                </Box>
            }
        </>
    )
}