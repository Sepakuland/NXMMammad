
import { React, useEffect, useRef, useState } from "react";
import {useTheme, Button} from "@mui/material";
import { useTranslation } from "react-i18next";
import Data from './Data.json'
import ActionCellMain from "./ActionCellMain";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";

const IncomeConfirmation = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [selected, setSelected] = useState([])
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = (data.TotalPayingPrices).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                TotalPayingPrices: cost,
                Year: parseInt(data.Year),

            }
        })
        setData(tempData)

        let tempExcel = Data.map((data,index) => {
            let temp = (data.TotalPayingPrices).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                IndexCell:index+1,
                TotalPayingPrices: cost,
                Year: parseInt(data.Year),

            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    const callComponent = () => {
        console.log('selected',selected)
    }


    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false,
            footerCell:TotalTitle
        },
        {
            field: 'Year',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "سال",
            filter: 'numeric',
        },
        {
            field: 'Month',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ماه",
        },
        {
            field: 'Personnel',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "پرسنل",
        },
        {
            field: 'BillCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شماره فیش",
        },
        {
            field: 'TotalPayingPrices',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "جمع خالص پرداختی",
            filter: 'numeric',
            cell:CurrencyCell,
            footerCell: CustomFooterSome,
        },
       
        {
            field: 'actionCell',
            filterable: false,
            width: '50px',
            name: "عملیات",
            cell: ActionCellMain,
            className: 'text-center',
            reorderable: false
        }
    ]

    const chartObj = [
        { value: "Year", title: t('سال') },
        { value: "TotalPayingPrices", title: t('خالص پرداختی') },
    ]

    let savedCharts = [
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ]

    function getSavedCharts(list) {
        console.log('save charts list to request and save:', list)
    }

    function getSelectedRows(list) {
        setSelected(list)
        console.log('selected row list to request:', list)
    }


    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'IncomeConfirmationGrid'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectKeyField={'YearMonthPersonnel'}
                    getSelectedRows={getSelectedRows}
                    
                    excelFileName={t("تائید حقوق و دستمزد")}

                />
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="contained"
                            color="primary"
                            onClick={callComponent}>
                        {t("تایید")}
                    </Button >

                </div>

            </div>
           
        </>
    )
}
export default IncomeConfirmation

