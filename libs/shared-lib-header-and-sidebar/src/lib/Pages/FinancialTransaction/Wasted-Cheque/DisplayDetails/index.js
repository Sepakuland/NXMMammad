import React, { useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import {Button, useTheme} from "@mui/material";
import { useTranslation } from "react-i18next";
import products from "../../Wasted-Cheque/DisplayDetails/product.json";
import ActionCellMain from "../../Wasted-Cheque/DisplayDetails/ActionCellMain";
import { history } from "../../../../utils/history";


const WastedChequeGrid = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])

    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = products.map((data) => {
            let temp = (data.ChequeAmount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                DueDate: new Date(data.DueDate),
                ChequeAmount: cost,
                Code: parseInt(data.Code),
                ChequeSerial: parseInt(data.ChequeSerial),
                AccountPartyCode: parseInt(data.AccountPartyCode),
            }
        })
        setData(tempData)

        let tempExcel = products?.map((data, index) => {
            let temp = (data.ChequeAmount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                IndexCell: index + 1,
                DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
                DueDate: getLangDate(i18n.language, new Date(data.DueDate)),
                ChequeAmount: cost,
                Code: parseInt(data.Code),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const callComponent = () => {
        history.navigate(`/FinancialTransaction/wastedCheque/newWastedCheque`, 'noopener,noreferrer');
      }

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'Code',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد",
            filter: 'numeric',
        },
        {
            field: 'AccountPartyCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد طرف حساب",
            filter: 'numeric',
        },
        {
            field: 'AccountPartyName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام طرف حساب",
        },
        {
            field: 'ChequeSerial',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "سریال چک",
            filter: 'numeric',
        },
        {
            field: 'ChequeAmount',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ چک",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            filter: 'numeric',
        },
        {
            field: 'DocumentDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "Date",
            // format: "{0:d}",
            name: "تاریخ سند",
            cell:DateCell,
            reorderable: true,
        },
        {
            field: 'DueDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "Date",
            // format: "{0:d}",
            name: "تاریخ سررسید",
            cell:DateCell,
            reorderable: true,
        },
        {
            field: 'Reason',
            // columnMenu: ColumnMenu,
            filterable: true,
            width: '150px',
            name: "دلیل",
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
        { value: "ChequeAmount", title: t('مبلغ چک') },
        { value: "Code", title: t('کد') },
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
    }

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'WastedChequeGrid'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("چک سوختی")}
                    chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={false}
                    selectionMode={'single'}  //single , multiple
                    selectKeyField={'DocumentId'}
                    getSelectedRows={getSelectedRows}
                    

                />
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="contained"
                            onClick={callComponent}>
                        {t("جدید")}
                    </Button >
                </div>
            </div>
        </>
    )
}

export default WastedChequeGrid