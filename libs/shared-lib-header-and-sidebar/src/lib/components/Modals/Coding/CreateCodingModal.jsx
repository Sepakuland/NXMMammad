import { LoadingButton } from "@mui/lab";
import { Button, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material";
import { SelectBox } from "devextreme-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import * as Yup from "yup";
import CodingInputMask from "../../CodingInputMask";
import { useFetchSettingsQuery } from "../../../features/slices/commonSystemSettingsSlice";
import { useCreateCodingMutation } from "../../../features/slices/customerChosenCodingSlice";
import CloseIcon from '@mui/icons-material/Close';


export default function CreateCodingModal({ closeModal, initData }) {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    Redux                                   */
    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Query --------------------------------- */
    const { data: res = { groupLength: 2, kolLength: 2, moeinLength: 2 }, isFetching, error } = useFetchSettingsQuery();

    /* -------------------------------- Mutation -------------------------------- */
    const [createCoding, createResults] = useCreateCodingMutation()
    useEffect(() => {
        if (createResults.status == "fulfilled" && createResults.isSuccess) {
            closeModal()
        }
        else if (createResults.isError) {
            let arr = createResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }

    }, [createResults.status])

    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const formik = useFormik({
        initialValues: {
            codingParentId: initData.codingId,
            code: "",
            name: "",
            totalCodingType: 0,
            totalCodingNature: 0,
            isEntityEssential: false,
            followUpCharacteristics: false
        },
        validateOnChange: false,
        validationSchema: Yup.object({
            code: Yup.string().required("وارد کردن کد الزامی است").test(
                'hasDash', "کد نمی‌تواند شامل کاراکتر غیرعددی باشد",
                (item, testContext) => {
                    return (!item.includes("–"))
                }
            ),
            name: Yup.string().required("وارد کردن عنوان حساب الزامی است"),
            totalCodingType: Yup.number().moreThan(0, "تعیین نوع حساب الزامی است")
        }),
        onSubmit: (values) => {
            createCoding(values).unwrap()
                .catch((error) => {
                    console.error(error)
                })
        }
    })

    const levels = [
        { value: 1, name: "گروه" },
        { value: 2, name: "کل" },
        { value: 3, name: "معین" }
    ]
    const totalCodingTypes = [
        { value: 1, name: t("سود و زیانی") },
        { value: 2, name: t("ترازنامه‌ای") },
        { value: 3, name: t("انتظامی") }
    ]
    const totalCodingNatures = [
        { value: 0, name: t("بدون کنترل") },
        { value: 1, name: t("مانده بدهکار") },
        { value: 2, name: t("مانده بستانکار") }
    ]

    const [codingTypeDisabled, setCodingTypeDisabled] = useState(false)
    const [codingMask, setCodingMask] = useState("")
    function handleMaskChange(e) {
        formik.setFieldValue('code', e.target.value)
    }

    useEffect(() => {
        if (initData.codingGuid !== "00000000-0000-0000-0000-000000000000") {
            formik.setFieldValue("totalCodingType", totalCodingTypes.filter(item => item.value === initData.totalCodingType)[0].value)
            formik.setFieldValue("totalCodingNature", totalCodingNatures.filter(item => item.value === initData.totalCodingNature)[0].value)
        }

        if (initData.codingLevel > 0) {
            setCodingTypeDisabled(true)
        }

        let maskLength = 0
        switch (initData.codingLevel) {
            case 0:
                maskLength = res.groupLength
                break;
            case 1:
                maskLength = res.kolLength
                break;
            case 2:
                maskLength = res.moeinLength
                break;
            default:
                break;
        }
        let tempMask = ""
        for (let i = 0; i < maskLength; i++) {
            tempMask += "9"
        }
        setCodingMask(tempMask)
    }, [initData])
    /* -------------------------------------------------------------------------- */

    return (
        <>
            <div
                className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                <div className="title mb-0"> {t("ایجاد حساب")} </div>
                <button type='button' className='close-btn' onClick={() => closeModal()}>
                    <CloseIcon />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-design">
                    <div className="row">
                        <div className="content col-lg-6 col-md-6 col-12">
                            <div className="title">
                                <span> {t("سطح")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <SelectBox
                                        dataSource={levels}
                                        valueExpr="value"
                                        className='selectBox'
                                        displayExpr="name"
                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                        onValueChanged={(e) => {
                                            console.log(e)
                                        }
                                        }
                                        itemRender={null}
                                        placeholder=""
                                        defaultValue={initData.codingLevel + 1}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="content col-lg-6 col-md-6 col-xs-12">
                            <div className="title">
                                <span> {t("کد حساب")} </span>
                            </div>
                            <div className="wrapper">
                                <div>
                                    <label className='d-inline-flex align-items-center' style={{ fontSize: "small" }}>
                                        <CodingInputMask
                                            handleValueChange={handleMaskChange}
                                            value={formik.values.code}
                                            maskExpression={codingMask}
                                        />
                                        <span style={{ margin: "5px" }}>{initData.completeCode}</span>
                                    </label>
                                </div>
                            </div>
                            {formik.touched.code && formik.errors.code ? (
                                <div className='error-msg'>{t(formik.errors.code)}</div>) : null}
                        </div>
                        <div className="content col-12">
                            <div className="title">
                                <span> {t("عنوان حساب")} </span>
                            </div>
                            <div className="wrapper">
                                <div style={{ fontSize: "small" }}>
                                    {initData.formersNames}
                                    <input
                                        className="form-input"
                                        name="name"
                                        type='text'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                        autoComplete="off"
                                        list="autocompleteOff"
                                    />
                                </div>
                            </div>
                            {formik.touched.name && formik.errors.name && !formik.values.name ? (
                                <div className='error-msg'>{t(formik.errors.name)}</div>) : null}
                        </div>
                        <div className="content col-lg-6 col-md-6 col-12">
                            <div className="title">
                                <span> {t("نوع حساب")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <SelectBox
                                        dataSource={totalCodingTypes}
                                        valueExpr="value"
                                        className='selectBox'
                                        displayExpr={function (item) {
                                            return (
                                                item &&
                                                item.name
                                            );
                                        }}
                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                        onValueChanged={(e) =>
                                            formik.setFieldValue("totalCodingType", e.value)
                                        }
                                        itemRender={null}
                                        placeholder=""
                                        defaultValue={initData.totalCodingType}
                                        disabled={codingTypeDisabled}
                                    />
                                </div>
                            </div>
                            {formik.touched.totalCodingType && formik.errors.totalCodingType && !formik.values.totalCodingType ? (
                                <div className='error-msg'>{t(formik.errors.totalCodingType)}</div>) : null}
                        </div>
                        <div className="content col-lg-6 col-md-6 col-12">
                            <div className="title">
                                <span> {t("ماهیت حساب")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <SelectBox
                                        dataSource={totalCodingNatures}
                                        valueExpr="value"
                                        className='selectBox'
                                        displayExpr={function (item) {
                                            return (
                                                item &&
                                                item.name
                                            );
                                        }}
                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                        onValueChanged={(e) =>
                                            formik.setFieldValue("totalCodingNature", e.value)
                                        }
                                        itemRender={null}
                                        placeholder=""
                                        defaultValue={initData.totalCodingNature}
                                    />
                                </div>
                            </div>
                        </div>
                        {initData.codingLevel === 2 ?
                            <>
                                <div className="col-12">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => {
                                                    formik.setFieldValue(`followUpCharacteristics`, e.target.checked)
                                                }}
                                                onBlur={formik.handleBlur}
                                                name="followUpCharacteristics"
                                                color="primary"
                                                size="small"
                                                id="followUpCharacteristics"
                                                defaultChecked={initData.followUpCharacteristics}
                                            />
                                        }
                                        sx={{ margin: '0' }}
                                        label={
                                            <Typography variant="h6">
                                                {t("قابلیت پیگیری")}
                                            </Typography>
                                        }
                                    />
                                </div>
                                <div className="col-12">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => {
                                                    formik.setFieldValue(`isEntityEssential`, e.target.checked)
                                                }}
                                                onBlur={formik.handleBlur}
                                                name="isEntityEssential"
                                                color="primary"
                                                size="small"
                                                id="isEntityEssential"
                                                defaultChecked={initData.isEntityEssential}
                                            />
                                        }
                                        sx={{ margin: '0' }}
                                        label={
                                            <Typography variant="h6">
                                                {t("درج اجباری تفضیلی برای حساب معین")}
                                            </Typography>
                                        }
                                    />
                                </div>
                            </> : null
                        }
                    </div>
                    <div className='d-flex justify-content-center' style={{ marginTop: "30px" }}>
                        <LoadingButton
                            variant="contained"
                            color='success'
                            type="button"
                            style={{ margin: '0 2px' }}
                            onClick={formik.handleSubmit}
                            loading={createResults.isLoading}
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
        </>
    )

}