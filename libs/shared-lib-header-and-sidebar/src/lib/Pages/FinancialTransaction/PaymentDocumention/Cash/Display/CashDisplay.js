
import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CashData from './CashData.json'
import ActionCellMain from "./ActionCellMain";
import { history } from "../../../../../utils/history";

const CashDisplay = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = CashData.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                Price: cost,
                DocumentCode: parseInt(data.DocumentCode),
                PartnerCode: data.PartnerCode ? parseInt(data.PartnerCode) : '',
                // PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
            }
        })
        setData(tempData)

        let tempExcel = CashData?.map((data, index) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                IndexCell: index + 1,
                DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
                Price: cost,
                DocumentCode: parseInt(data.DocumentCode),
                PartnerCode: data.PartnerCode ? parseInt(data.PartnerCode) : '',
                // PartnerTelephones: parseInt(data.PartnerTelephones),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const callComponent = () => {
        history.navigate(`/FinancialTransaction/PaymentDocument/Cash/issuance`, 'noopener,noreferrer');
    }


    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'DocumentCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد",
            filter: 'numeric',
        },
        {
            field: 'DocumentDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ",
            // format: "{0:d}",
            cell: DateCell,
            filter: 'date',
        },
        {
            field: 'PartnerCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: "numeric",
            name: "کد طرف حساب",
        },
        {
            field: 'PartnerName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "طرف حساب",
        },
        {
            field: 'PartnerLegalName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام حقوقی",
        },
        {
            field: 'PartnerTelephones',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "تلفن",
            // filter: 'numeric',
        },
        {
            field: 'PartnerAddress',
            // columnMenu: ColumnMenu,
            filterable: true,
            width: '100px',
            name: "آدرس",
        },
        {
            field: 'CashAccountName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "صندوق",
        },

        {
            field: 'Price',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },

        {
            field: 'SettlementDocuments',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "تسویه",
            reorderable: false
        },
        {
            field: 'DocumentDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            width: '100px',
            name: "توضیحات",
            className: 'text-center',
            reorderable: false
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '170px',
            name: "عملیات",
            cell: ActionCellMain,
            className: 'text-center',
            reorderable: false
        }
    ]

    const chartObj = [
        { value: "Price", title: t('مبلغ') },
        { value: "DocumentCode", title: t('کد سند') },
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
                    gridId={'PaymentCashGrid'}
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
                    selectKeyField={'DocumentId'}
                    getSelectedRows={getSelectedRows}

                    excelFileName={t("نمایش نقد")}

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
export default CashDisplay

