import { useTheme } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import ActionCellMainSD from './ActionCellMainSD';
import Document1 from './Document1.json'


const ShowDocument = ({ id }) => {


    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const [selectedRows, SetSelectedRows] = useState();
    useEffect(() => {
        let tempData = Document1.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                DocumentTrackCode: data.DocumentTrackCode !== '' ? parseInt(data.DocumentTrackCode) : '',
                RefDocumentCode: data.RefDocumentCode !== '' ? parseInt(data.RefDocumentCode) : '',
            }
        })
        setData(tempData)

        let tempExcel = Document1.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                DocumentTrackCode: data.DocumentTrackCode !== '' ? parseInt(data.DocumentTrackCode) : '',
                RefDocumentCode: data.RefDocumentCode !== '' ? parseInt(data.RefDocumentCode) : '',
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
            name: "ش سند",
            filter: 'numeric',
        },
        {
            field: 'DocumentTrackCode',
            name: "ش پیگیری",
            filter: 'numeric',
        },
        {
            field: 'DocumentDate',
            name: "تاریخ",
            // format: "{0:d}",
            cell: DateCell,
            filter: "date",
        },
        {
            field: 'DocumentBalance',
            name: "تراز",
            filter: 'numeric',
        },
        {
            field: 'DocumentType',
            name: "نوع",
        },
        {
            field: 'RefDocumentCode',
            name: "ش ارجاع",
        },
        {
            field: 'InsertUser',
            name: "درج",
        },
        {
            field: 'LastUpdateUser',
            name: "آخرین تغییر",
        },
        {
            field: 'Description',
            width: '200px',
            name: "شرح",
        },
        {
            field: 'actionCell',
            width: '60px',
            name: "عملیات",
            cell: ActionCellMainSD,
            className: 'text-center',
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

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px', direction: 'rtl' }} >
                <RKGrid
                    gridId={'ShowDocument'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={false}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}
                    showFilter={false}
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
               
            </div>
        </>
    )
}
export default ShowDocument

