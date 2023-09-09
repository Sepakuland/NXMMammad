import { Button, useTheme } from "@mui/material"
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";
import DocumentVoucherActionCell from "./DocumentVoucherActionCell";
import { DocumentVoucherData } from "./DocumentVoucherData"

const DocumentVoucherGrid = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])

    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = DocumentVoucherData.map((data) => {
            let temp = (data.Value.Price).toString().replaceAll(',', '')
            let price = temp !== '' ? parseFloat(temp, 2) : 0

            return {
                ...data,
                DocumentCode: data.Value.DocumentCode !== '' ? parseInt(data.Value.DocumentCode) : '',
                PersonName: data.Value.PersonName,
                StorekeeperCode: data.Value.StorekeeperCode !== '' ? parseInt(data.Value.StorekeeperCode) : '',
                StorekeeperName: data.Value.StorekeeperName,
                WarehouseCode: data.Value.WarehouseCode !== '' ? parseInt(data.Value.WarehouseCode) : '',
                WarehouseName: data.Value.WarehouseName,
                DocumentTypeName: data.Value.DocumentTypeName,
                DocumentRefCode: data.Value.DocumentRefCode !== '' ? parseInt(data.Value.DocumentRefCode) : '',
                DocumentDate: new Date(data.Value.DocumentDate),
                Price: price,
                DocumentId: data.Value.DocumentId
            }
        })
        setData(tempData)

        let tempExcel = DocumentVoucherData.map((data, index) => {
            let temp = (data.Value.Price).toString().replaceAll(',', '')
            let price = temp !== '' ? parseFloat(temp, 2) : 0

            return {
                ...data,
                IndexCell: index + 1,
                DocumentCode: data.Value.DocumentCode !== '' ? parseInt(data.Value.DocumentCode) : '',
                PersonName: data.Value.PersonName,
                StorekeeperCode: data.Value.StorekeeperCode !== '' ? parseInt(data.Value.StorekeeperCode) : '',
                StorekeeperName: data.Value.StorekeeperName,
                WarehouseCode: data.Value.WarehouseCode !== '' ? parseInt(data.Value.WarehouseCode) : '',
                WarehouseName: data.Value.WarehouseName,
                DocumentTypeName: data.Value.DocumentTypeName,
                DocumentRefCode: data.Value.DocumentRefCode !== '' ? parseInt(data.Value.DocumentRefCode) : '',
                DocumentDate: new Date(data.Value.DocumentDate),
                Price: price
            }
        })
        setExcelData(tempExcel)
    }, [i18n.language])

    const NewVoucher = () => {
        navigate(`/Warehouse/Document/Voucher/New`, { replace: false });
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
            // // columnMenu: ColumnMenu,
            filterable: true,
            name: "ش رسید",
            filter: 'numeric',
        },
        {
            field: 'PersonName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "تحویل‌دهنده",
        },
        {
            field: 'StorekeeperCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد انباردار",
            filter: 'numeric',
        },
        {
            field: 'StorekeeperName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام انباردار",
        },
        {
            field: 'WarehouseCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد انبار",
            filter: 'numeric',
        },
        {
            field: 'WarehouseName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام انبار",
        },
        {
            field: 'DocumentTypeName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نوع",
        },
        {
            field: 'DocumentRefCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "شماره ارجاع",
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
            field: 'Price',
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
            width: '140px',
            name: "عملیات",
            cell: DocumentVoucherActionCell,
            className: 'text-center',
            reorderable: false
        }
    ]

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'DocumentVouchers'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}

                    excelFileName={t('رسیدهای انبار')}
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
                    onClick={NewVoucher}>
                    {t("جدید")}
                </Button>
            </div>
        </>
    )
}

export default DocumentVoucherGrid