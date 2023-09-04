import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import "./style.css";
import { useTranslation } from "react-i18next";
import { FieldArray } from "formik";
import React from "react";
import InputGridDeleteRowBtn from "./components/InputGridDeleteRowBtn";
import { useTheme } from "@mui/material";
import { CreateTableError } from "./utils/createTableError";
import { findNextFocusable } from "./utils/gridNavigation";

const GHGrid = ({
    title,
    fieldArrayName,
    fieldArrayKey,
    fieldArrayValues,
    fieldArrayErrors,
    columns,
    footer,
    addRowFunction,
    rowFocusFunction,
    rowFocusState,
    removeRowOperation = () => {},
    showFooter = "true",
    showDelete = "true",
    showAddButton = "true",
    customUpperButtonFunction }) => {
    const { t, i18n } = useTranslation()
    const theme = useTheme();
    return (
        <>
            <div className="row align-items-center">
                <div className='content col-lg-6 col-6'>
                    <div className='title mb-0'>
                        <span className='span'> {title} </span>
                    </div>
                </div>
                {typeof (customUpperButtonFunction) === "undefined" ?
                    <div className='content col-lg-6 col-6'>
                        {/* Copyright Ghafourian© Grid V4.0
                        All rights reserved */}
                        {showAddButton ?
                            <div className='d-flex justify-content-end'>
                                <Button
                                    variant="outlined"
                                    className="grid-add-btn"
                                    onClick={(e) => {
                                        addRowFunction()
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
                            </div> : null}
                    </div>
                    : customUpperButtonFunction()}
                <div className='content col-lg-12 col-12'>
                    <div className={`table-responsive sticky-h-f gridRow ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>
                        <table className="table table-bordered ">
                            <thead>
                                <tr className='text-center'>
                                    <th>{t("ردیف")}</th>
                                    {columns.map((column, index) => (
                                        column.show || typeof (column.show) === "undefined" ?
                                            <th key={index}>{column.header}</th> : null
                                    ))}
                                    {showDelete ? <th>{t("حذف")}</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                <FieldArray
                                    name={fieldArrayName}
                                    validateOnChange={false}
                                    render={({ push, remove }) => (
                                        <React.Fragment>
                                            {fieldArrayValues?.map((item, arrayIndex) => (
                                                <tr
                                                    style={{ cursor: 'pointer' }}
                                                    key={item[fieldArrayKey]}
                                                    className={rowFocusState === arrayIndex + 1 ? 'focus-row-bg' : ''}
                                                    onFocus={(e) => rowFocusFunction(e)}
                                                >
                                                    <td className='text-center'
                                                        style={{
                                                            verticalAlign: 'middle',
                                                            width: '40px'
                                                        }}>
                                                        {arrayIndex + 1}
                                                    </td>
                                                    {columns.map((column, index) => (
                                                        column.show || typeof (column.show) === "undefined" ?
                                                            <td
                                                                key={index}
                                                                style={{
                                                                    width: column.width,
                                                                    minWidth: column.minWidth
                                                                }}
                                                            >
                                                                {column.content(arrayIndex)}
                                                            </td> : null
                                                    ))}
                                                    {showDelete ?
                                                        <td style={{ width: '40px' }}>
                                                            <InputGridDeleteRowBtn
                                                                onClick={() => {
                                                                    removeRowOperation(arrayIndex)
                                                                    remove(arrayIndex)
                                                                }}
                                                            />
                                                        </td> : null}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    )}
                                >
                                </FieldArray>
                            </tbody>
                            {showFooter ?
                                <tfoot>
                                    <tr>
                                        {footer.map((footerCell, index) => (
                                            <td
                                                key={index}
                                                colSpan={footerCell.colspan ? footerCell.colspan : 1}
                                            >
                                                {footerCell.content ? footerCell.content() : null}
                                            </td>
                                        ))}
                                    </tr>
                                </tfoot> : null}
                        </table>
                    </div>
                </div>
            </div>
            <div className='row align-items-start'>
                <div className='content col-lg-12 col-md-12 col-12'>
                    {fieldArrayErrors?.map((error, index) => (
                        <p className='error-msg' key={index}>
                            {error ? ` ${t("ردیف")} ${index + 1} : ${CreateTableError(error)}` : null}
                        </p>
                    ))}
                </div>
            </div>
        </>
    )
}
export default GHGrid