import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import { history } from '../../../utils/history';
import ActionCellMainAD from './ActionCellMainAD';
import DataForMainGrid from './DataForMainGrid.json'

const AggregatedDocument = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const [selectedRows, SetSelectedRows] = useState();

    useEffect(() => {
        let tempData = DataForMainGrid.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: new Date(data.DocumentInsertDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
            }
        })
        setData(tempData)

        let tempExcel = DataForMainGrid.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: new Date(data.DocumentInsertDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'DocumentCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ش سند",
            filter: 'numeric',
        },
        {
            field: 'DocumentInsertDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ",
            // format: "{0:d}",
            cell: DateCell,
            filter: "date",
        },
        {
            field: 'DocumentBalance',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "تراز",
            filter: 'numeric',
        },
        {
            field: 'InsertUser',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "درج",
        },
        {
            field: 'LastUpdateUser',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "آخرین تغییر",
        },
        {
            field: 'DocumentState',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وضعیت",
        },
        {
            field: 'DocumentDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شرح",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '270px',
            name: "عملیات",
            cell: ActionCellMainAD,
            className: 'text-center',
            reorderable: false
        }
    ]

    const chartObj = [
        { value: "DocumentBalance", title: t('تراز') },
        { value: "DocumentCode", title: t('ش سند') },
    ]

    let savedCharts = [
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ]

    function getSavedCharts(list) {
        console.log('save charts list to request and save:', list)
    }

    function getSelectedRows(list) {
        console.log('selected row list to request:', list)
        SetSelectedRows(list)
    }

    const CreateNew = () => {
        history.navigate(`/Accounting/AggregatedDocument/NewAggregatedDocument`)
    }
    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'AggregatedDocument'}
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
                    selectable={false}
                    selectKeyField={'DocumentId'}
                    getSelectedRows={getSelectedRows}
                    
                />
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="contained"
                        color="primary"
                        onClick={CreateNew}
                    >
                        {t("جدید")}
                    </Button >
                </div>
            </div>
        </>
    )
}
export default AggregatedDocument

