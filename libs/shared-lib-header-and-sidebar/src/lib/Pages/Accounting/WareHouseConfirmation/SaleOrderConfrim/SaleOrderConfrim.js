
import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import SaleOrderConfrimData from './SaleOrderConfrimData.json'
import ActionCellMainSOC from "./ActionCellMainSOC";

const SaleOrderConfrim = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const [selectedRows, SetSelectedRows] = useState([]);

    useEffect(() => {
        let tempData = SaleOrderConfrimData.map((data) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,
                OrderCode: parseInt(data.OrderCode),
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : ''
            }
        })
        setData(tempData)

        let tempExcel = SaleOrderConfrimData?.map((data, index) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                IndexCell: index + 1,
                OrderInsertDate: getLangDate(i18n.language, new Date(data.OrderInsertDate)),
                OrderPrice: cost,
                OrderCode: parseInt(data.OrderCode),
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : ''

            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

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
            field: 'OrderPreCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "پیش فاکتور",
            filter: 'numeric',

        },
        {
            field: 'OrderCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "فاکتور",
            filter: 'numeric',
        },

        {
            field: 'OrderInsertDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ فاکتور",
            // format: "{0:d}",
            cell: DateCell,
            filter: 'date',
        },
        {
            field: 'PartnerName',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "طرف حساب",
        },
        {
            field: 'PersonnelName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ویزیتور",
        },
        {
            field: 'OrderPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            cell: CurrencyCell,
            filter: 'numeric',
            footerCell: CustomFooterSome,
        },

        {
            field: 'actionCell',
            filterable: false,
            width: '70px',
            name: "عملیات",
            cell: ActionCellMainSOC,
            className: 'text-center',
            orderIndex: 8,
            reorderable: false
        }
    ]
    const chartObj = [
        { value: "OrderPrice", title: t('مبلغ') },
        { value: "OrderCode", title: t('فاکتور') },
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
    function confrim(list) {

        console.log(":/", selectedRows)
    }
    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'SaleOrderConfrim'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={false}
                    showPrint={false}
                    chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectKeyField={'PersonnelCode'}
                    getSelectedRows={getSelectedRows}
                    

                />
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="contained"
                            color="primary"
                            onClick={confrim}
                            disabled={!selectedRows?.length}
                    >
                        {t("تایید")}
                    </Button >
                </div>
            </div>

        </>
    )
}
export default SaleOrderConfrim
