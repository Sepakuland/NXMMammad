
import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CashData from './salaryData.json'
import ActionCellMain from "./ActionCellMain";
import { history } from "../../../utils/history";

const BillDisplay = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = CashData.map((data) => {
            let temp = (data.Benefits).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let temp2 = (data.Deductions).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)
            let temp3 = (data.Loans).toString().replaceAll(',', '')
            let cost3 = parseFloat(temp3, 2)
            let temp4 = (data.PurePayment).toString().replaceAll(',', '')
            let cost4 = parseFloat(temp4, 2)

            return {
                ...data,
                Benefits: cost,
                Deductions: cost2,
                Loans: cost3,
                PurePayment: cost4,
                BillCode: parseInt(data.BillCode),
                PersonnelCode: parseInt(data.PersonnelCode),
            }
        })
        setData(tempData)

        let tempExcel = CashData?.map((data, index) => {

            let temp = (data.Benefits).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let temp2 = (data.Deductions).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)
            let temp3 = (data.Loans).toString().replaceAll(',', '')
            let cost3 = parseFloat(temp3, 2)
            let temp4 = (data.PurePayment).toString().replaceAll(',', '')
            let cost4 = parseFloat(temp4, 2)
            return {
                ...data,
                IndexCell: index + 1,
                Benefits: cost,
                Deductions: cost2,
                Loans: cost3,
                PurePayment: cost4,
                BillCode: parseInt(data.BillCode),
                PersonnelCode: parseInt(data.PersonnelCode),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const callComponent = () => {
        history.navigate(`/Payroll/salaryBillIssuance/PrintList`);
    }
    const callComponent2 = () => {
        history.navigate(`/Payroll/salaryBillIssuance/PrintTicket`);
    }
    const callComponent3 = () => {
        history.navigate(`/Payroll/salaryBillIssuance/Edit`);
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
            field: 'BillCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شماره فیش",
            filter: 'numeric',
        },
        {
            field: 'PersonnelCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد پرسنل",
            filter: 'numeric',
        },
        {
            field: 'PersonnelName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام پرسنل",
        },
        {
            field: 'Month',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ماه",
        },
        {
            field: 'Benefits',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "جمع مزایا",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'Deductions',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "جمع کسورات",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'Loans',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "اقساط وام",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'PurePayment',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "خالص پرداختنی",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
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
        { value: "PurePayment", title: t('مبلغ') },
        { value: "BillCode", title: t('کد سند') },
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
                    gridId={'salaryBillIssuancePayrollGrid'}
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
                    selectKeyField={'BillId'}
                    getSelectedRows={getSelectedRows}

                    excelFileName={t("فیش‌های حقوق")}

                />
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="contained"
                        onClick={callComponent3}>
                        {t("جدید")}
                    </Button >
                    <Button style={{ margin: "0 10px" }} variant="contained"
                        onClick={callComponent2}>
                        {t("چاپ فیش")}
                    </Button >
                    <Button variant="contained"
                        onClick={callComponent}>
                        {t("چاپ لیست")}
                    </Button >
                </div>
            </div>

        </>
    )
}
export default BillDisplay

