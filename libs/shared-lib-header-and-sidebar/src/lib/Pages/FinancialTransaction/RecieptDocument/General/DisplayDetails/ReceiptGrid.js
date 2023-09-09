import { Button, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import ReceiptActionCell from "./ReceiptActionCell";
import { ReceiptData } from "./ReceiptData";

const ReceiptGrid = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    const navigate = useNavigate();

    useEffect(() => {
        let tempData = ReceiptData.map((data) => {
            let temp = (data.Value.TotalPrice).toString().replaceAll(',', '')
            let totalPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = (data.Value.CashPrice).toString().replaceAll(',', '')
            let cashPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = (data.Value.BankPrice).toString().replaceAll(',', '')
            let bankPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = (data.Value.ChequePrice).toString().replaceAll(',', '')
            let chequePrice = temp !== '' ? parseFloat(temp, 2) : 0
            return {
                ...data,
                DocumentCode: parseInt(data.Value.DocumentCode),
                DocumentDate: new Date(data.Value.DocumentDate),
                PartnerCode: parseInt(data.Value.PartnerCode),
                PartnerName: data.Value.PartnerName,
                TotalPrice: totalPrice,
                CashCashAccount: data.Value.CashCashAccount,
                CashPrice: cashPrice,
                BankAccount: data.Value.BankAccount,
                BankBillCode: parseInt(data.Value.BankBillCode),
                BankPrice: bankPrice,
                ChequeCashAccount: data.Value.ChequeCashAccount,
                ChequeCashier: data.Value.ChequeCashier,
                ChequeSerial: data.Value.ChequeSerial !== '' ? parseInt(data.Value.ChequeSerial) : '',
                ChequeMaturityDate: new Date(data.Value.ChequeMaturityDate),
                ChequePrice: chequePrice,
                DocumentDescription: data.Value.DocumentDescription,
                DocumentId: data.Value.DocumentId
            }
        })
        setData(tempData)

        let tempExcel = ReceiptData?.map((data, index) => {
            let temp = (data.Value.TotalPrice).toString().replaceAll(',', '')
            let totalPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = (data.Value.CashPrice).toString().replaceAll(',', '')
            let cashPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = (data.Value.BankPrice).toString().replaceAll(',', '')
            let bankPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = (data.Value.ChequePrice).toString().replaceAll(',', '')
            let chequePrice = temp !== '' ? parseFloat(temp, 2) : 0
            return {
                ...data,
                IndexCell: index + 1,
                DocumentCode: parseInt(data.Value.DocumentCode),
                DocumentDate: getLangDate(i18n.language, new Date(data.Value.DocumentDate)),
                PartnerCode: parseInt(data.Value.PartnerCode),
                PartnerName: data.Value.PartnerName,
                TotalPrice: totalPrice,
                CashCashAccount: data.Value.CashCashAccount,
                CashPrice: cashPrice,
                BankAccount: data.Value.BankAccount,
                BankBillCode: parseInt(data.Value.BankBillCode),
                BankPrice: bankPrice,
                ChequeCashAccount: data.Value.ChequeCashAccount,
                ChequeCashier: data.Value.ChequeCashier,
                ChequeSerial: parseInt(data.Value.ChequeSerial),
                ChequeMaturityDate: getLangDate(i18n.language, new Date(data.Value.ChequeMaturityDate)),
                ChequePrice: chequePrice,
                DocumentDescription: data.Value.DocumentDescription
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])

    const NewReceipt = () => {
        navigate(`/FinancialTransaction/ReceiptDocument/General/Issuance`, { replace: false });
    }

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
            sortable: false,
            reorderable: true
        },
        {
            field: 'DocumentCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شماره",
            filter: 'numeric',
        },
        {
            field: 'DocumentDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "date",
            // format: "{0:d}",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'PartnerCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد طرف حساب",
            filter: 'numeric',
        },
        {
            field: 'PartnerName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام طرف حساب",
        },
        {
            field: 'TotalPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            cell: CurrencyCell,
            filter: 'numeric',
            footerCell: CustomFooterSome,
        },
        {
            name: "نقد",
            field: "cash",
            children: [
                {
                    field: 'CashCashAccount',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "صندوق",
                },
                {
                    field: 'CashPrice',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "مبلغ",
                    cell: CurrencyCell,
                    filter: 'numeric',
                    footerCell: CustomFooterSome,
                }
            ]
        },
        {
            name: "بانک",
            field: "bank",
            children: [
                {
                    field: 'BankAccount',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "حساب",
                },
                {
                    field: 'BankBillCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "شماره فیش",
                    filter: 'numeric',
                },
                {
                    field: 'BankPrice',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "مبلغ",
                    cell: CurrencyCell,
                    filter: 'numeric',
                    footerCell: CustomFooterSome,
                }
            ]
        },
        {
            name: "چک",
            field: "cheque",
            children: [
                {
                    field: 'ChequeCashAccount',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "صندوق",
                },
                {
                    field: 'ChequeCashier',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "صندوقدار",
                },
                {
                    field: 'ChequeSerial',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "سریال",
                    filter: 'numeric',
                },
                {
                    field: 'ChequeMaturityDate',
                    // columnMenu: DateMenu,
                    filterable: true,
                    filter: "date",
                    // format: "{0:d}",
                    name: "سررسید",
                    cell: DateCell,
                },
                {
                    field: 'ChequePrice',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "مبلغ",
                    cell: CurrencyCell,
                    filter: 'numeric',
                    footerCell: CustomFooterSome,
                },
            ]
        },
        {
            field: 'DocumentDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '140px',
            name: "عملیات",
            cell: ReceiptActionCell,
            className: 'text-center',
            reorderable: false
        }
    ]

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'ReceiptDocuments'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}

                    excelFileName={t('دریافت کلی')}
                    //   chartDependent={chartObj}
                    rowCount={10}
                    //   savedChartsList={savedCharts}
                    //   getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                // selectable={true}
                // selectionMode={'multiple'}  //single , multiple
                // selectKeyField={'DocumentId'}
                // getSelectedRows={getSelectedRows}
                // 

                />
            </div>
            <div className="Issuance col-12 d-flex justify-content-end">
                <Button variant="contained"
                    color="primary"
                    style={{ height: "38px", margin: "8px" }}
                    onClick={NewReceipt}>
                    {t("جدید")}
                </Button>
            </div>
        </>
    )
}

export default ReceiptGrid