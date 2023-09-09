import React, { useEffect, useRef, useState } from "react";
import {Button, useTheme} from "@mui/material";
import { useTranslation } from "react-i18next";
import products from "../../Wasted-Sale-Order/DisplayDetails/product.json";
import ActionCellMain from "../../Wasted-Sale-Order/DisplayDetails/ActionCellMain";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";
import { history } from "../../../../utils/history";


const WastedFactorGrid = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])

    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = products.map((data) => {
            let temp = (data.InvoiceAmount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let temp2 = (data.SettledAmount).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)
            let temp3 = (data.WastedAmount).toString().replaceAll(',', '')
            let cost3 = parseFloat(temp3, 2)
            return {
                ...data,
                InvoiceAmount: cost,
                SettledAmount: cost2,
                WastedAmount: cost3,
                Code: parseInt(data.Code),
                AccountPartyCode: parseInt(data.AccountPartyCode),
            }
        })
        setData(tempData)

        let tempExcel = products?.map((data, index) => {
            let temp = (data.InvoiceAmount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let temp2 = (data.SettledAmount).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)
            let temp3 = (data.WastedAmount).toString().replaceAll(',', '')
            let cost3 = parseFloat(temp3, 2)
            return {
                ...data,
                IndexCell: index + 1,
                InvoiceAmount: cost,
                SettledAmount: cost2,
                WastedAmount: cost3,
                Code: parseInt(data.Code),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    const callComponent = () => {
        history.navigate(`/FinancialTransaction/wastedSaleOrder/newWastedSaleOrder`, 'noopener,noreferrer');
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
            field: 'InvoiceNumber',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شماره فاکتور",
            filter: 'numeric',
        },
        {
            field: 'InvoiceAmount',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ فاکتور",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            filter: 'numeric',
        },
        {
            field: 'SettledAmount',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ تسویه شده",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            filter: 'numeric',
        },
        {
            field: 'WastedAmount',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ سوختی",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            filter: 'numeric',
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
        { value: "InvoiceAmount", title: t('مبلغ چک') },
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
                    gridId={'WastedFactorGrid'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("فاکتور سوختی")}
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

export default WastedFactorGrid