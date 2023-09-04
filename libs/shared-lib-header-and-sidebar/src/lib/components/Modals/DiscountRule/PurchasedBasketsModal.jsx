import { Autocomplete, Box, Button, IconButton, TextField, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Guid from 'devextreme/core/guid';
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
import { purchasedBasketsModalProductGroups, purchasedBasketsModalProducts } from "./datasources";
import { findNextFocusable, findPreviousFocusable, MoveNext, MovePrevious } from "../../../utils/gridKeyboardNav3";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";

export default function PurchasedBasketsModal({ getData, closeModal, initData }) {
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const emptyPurchasedBasketsModal = { formikId: new Guid().valueOf(), productGroup: "", product: "" }

    const formik = useFormik({
        initialValues: {
            purchasedBasketsModal: initData
        },
        validationSchema: Yup.object({
            purchasedBasketsModal: Yup.array(Yup.object({
                productGroup: Yup.object().test(
                    'oneOfTwo', 'فقط یکی از موارد کالا یا گروه کالا را انتخاب کنید',
                    (item, testContext) => {
                        if (typeof (testContext.parent.product) === "object") {
                            return (item === "" || typeof (item) === "undefined")
                        }
                        else {
                            return true
                        }
                    }
                ),
                product: Yup.object().test(
                    'oneOfTwo', 'فقط یکی از موارد کالا یا گروه کالا را انتخاب کنید',
                    (item, testContext) => {
                        if (typeof (testContext.parent.productGroup) === "object") {
                            return (item === "" || typeof (item) === "undefined")
                        }
                        else {
                            return true
                        }
                    }
                )
            }))
        }),
        onSubmit: (values) => {
            getData(values)
            closeModal()
        }
    })
    console.log("errors", formik.errors)
    // console.log("formik.values.purchasedBasketsModal", formik.values.purchasedBasketsModal)
    ///// SpecificProducts Grid \\\\\

    const [purchasedBasketsModalFocusedRow, setPurchasedBasketsModalFocusedRow] = useState(1)
    const [productGroupOpen, setProductGroupOpen] = useState(false)
    const [productOpen, setProductOpen] = useState(false)

    function AddPurchasedBasketsModalRow() {
        formik.setFieldValue('purchasedBasketsModal', [...formik.values.purchasedBasketsModal, emptyPurchasedBasketsModal])
    }

    function RenderProductGroupOpenState(index, state) {
        if (index === purchasedBasketsModalFocusedRow - 1) {
            setProductGroupOpen(state)
        }
        else {
            setProductGroupOpen(false)
        }
    }
    function RenderProductOpenState(index, state) {
        if (index === purchasedBasketsModalFocusedRow - 1) {
            setProductOpen(state)
        }
        else {
            setProductOpen(false)
        }
    }

    function purchasedBasketsModalKeyDownHandler(e) {
        let next = e.target.closest("td").nextSibling
        while (next.cellIndex !== next.closest("tr").children.length - 1 && (next.querySelector("button:not([aria-label='Clear'])") || next.querySelector("input").disabled)) {
            next = findNextFocusable(next)
        }

        let prev = e.target.closest("td").previousSibling
        while (prev.cellIndex !== 0 && (prev.querySelector("button:not([aria-label='Clear'])") || prev.querySelector("input").disabled)) {
            prev = findPreviousFocusable(prev)
        }

        if (e.keyCode === 40 && productOpen === false && productGroupOpen === false) { /* Down Arrowkey */
            e.preventDefault()
            if (formik.values.purchasedBasketsModal.length === purchasedBasketsModalFocusedRow) {
                AddPurchasedBasketsModalRow()
                setTimeout(() => {
                    let temp = next.closest("tr").nextSibling.children[e.target.closest("td").cellIndex]
                    while (temp.cellIndex !== temp.closest("tr").children.length - 1 && (temp.querySelector("button:not([aria-label='Clear'])") || temp.querySelector("input").disabled)) {
                        temp = findNextFocusable(temp)
                    }
                    temp.querySelector("input").focus()
                    temp.querySelector("input").select()
                }, 0);
            }
            else {
                let down = e.target.closest("tr").nextSibling.children[e.target.closest("td").cellIndex].querySelector("input")
                down.focus()
                down.select()
            }
        }
        if (e.keyCode === 38 && productOpen === false && productGroupOpen === false) { /* Up ArrowKey */
            e.preventDefault()
            let up = e.target.closest("tr").previousSibling.children[e.target.closest("td").cellIndex].querySelector("input")
            up.focus()
            up.select()
        }

        if (e.keyCode === 39) { /* Right ArrowKey */
            i18n.dir() === "rtl" ? MovePrevious(prev) : MoveNext(formik.values.purchasedBasketsModal, AddPurchasedBasketsModalRow, next, purchasedBasketsModalFocusedRow)
        }
        if (e.keyCode === 37) { /* Left ArrowKey */
            i18n.dir() === "ltr" ? MovePrevious(prev) : MoveNext(formik.values.purchasedBasketsModal, AddPurchasedBasketsModalRow, next, purchasedBasketsModalFocusedRow)
        }
        if (e.keyCode === 13 && productOpen === false && productGroupOpen === false) { /* Enter */
            MoveNext(formik.values.purchasedBasketsModal, AddPurchasedBasketsModalRow, next, purchasedBasketsModalFocusedRow)
        }
        else if (e.keyCode === 13) {    /* Enter */
            e.preventDefault()
            MoveNext(formik.values.purchasedBasketsModal, AddPurchasedBasketsModalRow, next, purchasedBasketsModalFocusedRow)
        }
        if (e.keyCode === 9) { /* Tab */    /*MUST BECOME LANGUAGE DEPENDANT */
            e.preventDefault()
            if (e.shiftKey === false) {
                MoveNext(formik.values.purchasedBasketsModal, AddPurchasedBasketsModalRow, next, purchasedBasketsModalFocusedRow)
            }
            else {
                MovePrevious(prev)
            }
        }


    }



    ///// End of SpecificProducts Grid \\\\\

    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    border: "none"
                }}
            >
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row form-design">
                            <div className="content col-12">
                                { /* PurchasedBasketsModal */}
                                <div className="row align-items-center">
                                    <div className="content col-12">
                                        {/* Copyright Ghafourian© Grid V3.0
                                        All rights reserved */}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outlined"
                                                className="grid-add-btn"
                                                onClick={(e) => {
                                                    AddPurchasedBasketsModalRow();
                                                    setTimeout(() => {
                                                        let added = e.target.closest("div").parentElement.nextSibling.querySelector('tbody tr:last-child td:nth-child(2)')
                                                        while (added.querySelector("button:not([aria-label='Clear'])") || added.querySelector("input").disabled) {
                                                            added = findNextFocusable(added)
                                                        }
                                                        added.querySelector("input").focus()
                                                    }, 0);
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="content col-12">
                                        <div className={`table-responsive gridRow ${theme.palette.mode === "dark" ? "dark" : ""}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>{t("ردیف")}</th>
                                                        <th>{t("گروه کالا")}</th>
                                                        <th>{t("کالا")}</th>
                                                        <th>{t("حذف")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <FieldArray
                                                        name="purchasedBasketsModal"
                                                        render={({ push, remove }) => (
                                                            <React.Fragment>
                                                                {formik.values?.purchasedBasketsModal?.map((purchasedBasketModal, index) => (
                                                                    <tr
                                                                        key={purchasedBasketModal.formikId}
                                                                        onFocus={(e) => setPurchasedBasketsModalFocusedRow(e.target.closest("tr").rowIndex)}
                                                                        className={purchasedBasketsModalFocusedRow === index + 1 ? "focus-row-bg" : ""}
                                                                    >
                                                                        <td className="text-center" style={{ verticalAlign: "middle", width: "40px" }}>
                                                                            {index + 1}
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <div className="table-autocomplete">
                                                                                <Autocomplete
                                                                                    value={purchasedBasketModal.productGroup ? purchasedBasketModal.productGroup : null}
                                                                                    id="productGroup"
                                                                                    name={`purchasedBasketsModal.${index}.productGroup`}
                                                                                    options={purchasedBasketsModalProductGroups}
                                                                                    renderOption={(props, option) => (
                                                                                        <Box component="li" {...props}>
                                                                                            {option.Name}
                                                                                        </Box>
                                                                                    )}
                                                                                    filterOptions={(options, state) => {
                                                                                        let newOptions = [];
                                                                                        options.forEach((element) => {
                                                                                            if (
                                                                                                element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                newOptions.push(element);
                                                                                        });
                                                                                        return newOptions;
                                                                                    }}
                                                                                    getOptionLabel={option => option.Name}
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: '100%',
                                                                                                maxWidth: "90vw",
                                                                                                direction: i18n.dir(),
                                                                                                position: "absolute",
                                                                                                fontSize: '12px',
                                                                                                right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    sx={
                                                                                        {
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: '#e9ecefd2',
                                                                                            borderRadius: 0,
                                                                                            fontSize: '12px'
                                                                                        }
                                                                                    }
                                                                                    size="small"
                                                                                    // disableClearable={true}
                                                                                    clearOnBlur={true}
                                                                                    forcePopupIcon={false}
                                                                                    open={purchasedBasketsModalFocusedRow === index + 1 ? productGroupOpen : false}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            RenderProductGroupOpenState(index, true)
                                                                                        }
                                                                                        else {
                                                                                            RenderProductGroupOpenState(index, false)
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {
                                                                                        RenderProductGroupOpenState(index, false)

                                                                                        if (value) {
                                                                                            formik.setFieldValue(`purchasedBasketsModal[${index}].productGroup`, value)
                                                                                        }
                                                                                        else {
                                                                                            formik.setFieldValue(`purchasedBasketsModal[${index}].productGroup`, "")
                                                                                        }
                                                                                    }}
                                                                                    onBlur={(e) => RenderProductGroupOpenState(index, false)}
                                                                                    renderInput={params => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && productGroupOpen === false) {
                                                                                            e.preventDefault()
                                                                                            RenderProductGroupOpenState(index, false)
                                                                                        }
                                                                                        setTimeout(() => {
                                                                                            purchasedBasketsModalKeyDownHandler(e)
                                                                                        }, 0);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <div className="table-autocomplete">
                                                                                <Autocomplete
                                                                                    value={purchasedBasketModal.product ? purchasedBasketModal.product : null}
                                                                                    id="product"
                                                                                    name={`purchasedBasketsModal.${index}.product`}
                                                                                    options={purchasedBasketsModalProducts}
                                                                                    renderOption={(props, option) => (
                                                                                        <Box component="li" {...props}>
                                                                                            {option.Code} - {option.Name}
                                                                                        </Box>
                                                                                    )}
                                                                                    filterOptions={(options, state) => {
                                                                                        let newOptions = [];
                                                                                        options.forEach((element) => {
                                                                                            if (
                                                                                                element.Code.includes(state.inputValue.toLowerCase()) ||
                                                                                                element.Name.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase()))
                                                                                                newOptions.push(element);
                                                                                        });
                                                                                        return newOptions;
                                                                                    }}
                                                                                    getOptionLabel={option => option.Name}
                                                                                    componentsProps={{
                                                                                        paper: {
                                                                                            sx: {
                                                                                                width: '100%',
                                                                                                maxWidth: "90vw",
                                                                                                direction: i18n.dir(),
                                                                                                position: "absolute",
                                                                                                fontSize: '12px',
                                                                                                right: i18n.dir() === "rtl" ? "0" : "unset"
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    sx={
                                                                                        {
                                                                                            direction: i18n.dir(),
                                                                                            position: "relative",
                                                                                            background: '#e9ecefd2',
                                                                                            borderRadius: 0,
                                                                                            fontSize: '12px'
                                                                                        }
                                                                                    }
                                                                                    size="small"
                                                                                    // disableClearable={true}
                                                                                    clearOnBlur={true}
                                                                                    forcePopupIcon={false}
                                                                                    open={purchasedBasketsModalFocusedRow === index + 1 ? productOpen : false}
                                                                                    noOptionsText={t("اطلاعات یافت نشد")}
                                                                                    onInputChange={(event, value) => {
                                                                                        if (value !== "" && event !== null) {
                                                                                            RenderProductOpenState(index, true)
                                                                                        }
                                                                                        else {
                                                                                            RenderProductOpenState(index, false)
                                                                                        }
                                                                                    }}
                                                                                    onChange={(event, value) => {
                                                                                        RenderProductOpenState(index, false)

                                                                                        if (value) {
                                                                                            formik.setFieldValue(`purchasedBasketsModal[${index}].product`, value)
                                                                                        }
                                                                                        else {
                                                                                            formik.setFieldValue(`purchasedBasketsModal[${index}].product`, "")
                                                                                        }
                                                                                    }}
                                                                                    onBlur={(e) => RenderProductOpenState(index, false)}
                                                                                    renderInput={params => (
                                                                                        <TextField {...params} label="" variant="outlined" />
                                                                                    )}
                                                                                    onKeyDown={(e) => {
                                                                                        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && productOpen === false) {
                                                                                            e.preventDefault()
                                                                                            RenderProductOpenState(index, false)
                                                                                            setTimeout(() => {
                                                                                                purchasedBasketsModalKeyDownHandler(e)
                                                                                            }, 0);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>

                                                                        <td style={{ width: "40px" }}>
                                                                            <IconButton
                                                                                variant="contained"
                                                                                color="error"
                                                                                className="kendo-action-btn"
                                                                                onClick={() => {
                                                                                    remove(index);
                                                                                }}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        )}>

                                                    </FieldArray>
                                                </tbody>
                                            </table>
                                        </div>
                                        {formik?.errors?.purchasedBasketsModal?.map((error, index) => (
                                            <p className='error-msg' key={index}>
                                                {error ? ` ${t("ردیف")} ${index + 1} : ${error?.productGroup ? t(error.productGroup) : ""}  ` : null}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormikProvider>
            </div>
            <div className='d-flex justify-content-center'>
                <Button
                    variant="contained"
                    color='success'
                    style={{ margin: '0 2px' }}
                    onClick={formik.handleSubmit}
                >
                    {t('تایید')}
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