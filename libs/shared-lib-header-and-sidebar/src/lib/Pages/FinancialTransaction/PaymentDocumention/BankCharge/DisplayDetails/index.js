import React, { useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import products from "../../BankCharge/DisplayDetails/product.json";
import ActionCellMain from "../../BankCharge/DisplayDetails/ActionCellMain";
import { history } from "../../../../../utils/history";


const BankChargeGrid = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])

    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = products.map((data) => {
            let temp = (data.Amount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                Date: new Date(data.Date),
                Amount: cost,
                Code: parseInt(data.Code),
            }
        })
        setData(tempData)

        let tempExcel = products?.map((data, index) => {
            let temp = (data.Amount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                IndexCell: index + 1,
                Date: getLangDate(i18n.language, new Date(data.Date)),
                Amount: cost,
                Code: parseInt(data.Code),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const callComponent = () => {
        history.navigate(`/FinancialTransaction/PaymentDocument/BankCharge`, 'noopener,noreferrer');
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
            width: '60px',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد",
            filter: 'numeric',
        },
        {
            field: 'SourceFund',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "صندوق مبدأ",
        },
        {
            field: 'OriginBank',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "بانک مبدأ",
        },
        {
            field: 'AccountName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام حساب",
        },
        {
            field: 'Date',
            // columnMenu: DateMenu,
            cell: DateCell,
            filterable: true,
            filter: "date",
            // format: "{0:d}",
            name: "تاریخ",
            reorderable: true,
        },
        {
            field: 'Amount',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            filter: 'numeric',
        },
        {
            field: 'Description',
            // columnMenu: ColumnMenu,
            filterable: true,
            width: '150px',
            name: "توضیحات",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '100px',
            name: "عملیات",
            cell: ActionCellMain,
            className: 'text-center',
            reorderable: false
        }
    ]

    const chartObj = [
        { value: "Amount", title: t('مبلغ') },
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
                    gridId={'BankChargeGrid'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("شارژ بانک")}
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

export default BankChargeGrid