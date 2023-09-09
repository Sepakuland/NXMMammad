import { Button, Menu, MenuItem, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import RKGrid, { IndexCell,DateCell } from "rkgrid";
import SaleReturnDistActionCell from "./SaleReturnDistActionCell";
import { SaleReturnDistData } from "./SaleReturnDistData";
import SaleReturnDistPrintActionCell from "./SaleReturnDistPrintActionCell";

const SaleReturnDistGrid = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [batchValidateIDs, setBatchValidateIDs] = useState([])
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])

    const dataRef = useRef()
    dataRef.current = data

    let tempRequestData = []

    const [anchorElPrint, setAnchorElPrint] = useState(null);
    const BatchPrint = (event) => {
        setAnchorElPrint(event.currentTarget);
    };
    const handleClosePrint = () => {
        setAnchorElPrint(null);
    };

    const BatchValidate = () => {
        setBatchValidateIDs(data[0].TotalId)
        let temp = data.map(item => item.TotalId)

        console.log('Send Batch Validate Request:', temp)
    }






    useEffect(() => {
        let tempData = SaleReturnDistData.map((data) => {
            return {
                ...data,
                TotalId: data.Value.TotalId,
                TotalCode: data.Value.TotalCode !== '' ? parseInt(data.Value.TotalCode) : '',
                TotalDate: new Date(data.Value.TotalDate),
                TotalDescription: data.Value.TotalDescription,
                PayeeCode: data.Value.PayeeCode !== '' ? parseInt(data.Value.PayeeCode) : '',
                PayeeName: data.Value.PayeeName,
                DriverCode: data.Value.DriverCode !== '' ? parseInt(data.Value.DriverCode) : '',
                DriverName: data.Value.DriverName,
                Status: data.Value.Status
            }
        })
        setData(tempData)

        let tempExcelData = SaleReturnDistData.map((data, index) => {
            return {
                ...data,
                IndexCell: index + 1,
                TotalCode: data.Value.TotalCode !== '' ? parseInt(data.Value.TotalCode) : '',
                TotalDate: new Date(data.Value.TotalDate),
                TotalDescription: data.Value.TotalDescription,
                PayeeCode: data.Value.PayeeCode !== '' ? parseInt(data.Value.PayeeCode) : '',
                PayeeName: data.Value.PayeeName,
                DriverCode: data.Value.DriverCode !== '' ? parseInt(data.Value.DriverCode) : '',
                DriverName: data.Value.DriverName,
                Status: data.Value.Status
            }
        })
        setExcelData(tempExcelData)
    }, [i18n.language])

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: true
        },
        {
            field: 'TotalCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "سرجمع",
            filter: 'numeric',
        },
        {
            field: 'TotalDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "date",
            // format: "{0:d}",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'TotalDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
        },
        {
            field: 'PayeeCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد موزع",
            filter: 'numeric',
        },
        {
            field: 'PayeeName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام موزع",
        },
        {
            field: 'DriverCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد راننده",
            filter: 'numeric',
        },
        {
            field: 'DriverName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام راننده",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '170px',
            name: "چاپ",
            cell: SaleReturnDistPrintActionCell,
            className: 'text-center',
            reorderable: false
        },
        {
            field: 'Status',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "Status",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '140px',
            name: "عملیات",
            cell: SaleReturnDistActionCell,
            className: 'text-center',
            reorderable: false
        },
    ]

    const chartObj = [
        { value: "TotalCode", title: t("سرجمع") },
        { value: "TotalDate", title: t("تاریخ") },
        { value: "PayeeCode", title: t("کد موزع") },
        { value: "DriverCode", title: t("کد راننده") }
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
        tempRequestData = list?.map((data, index) => (
            tempRequestData[index] = data.DocumentId
        ))
        localStorage.setItem(`printList`, JSON.stringify(tempRequestData))
    }


    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'SaleReturnFromDistribution'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}

                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}

                    excelFileName={t('بازگشت از توزیع')}
                    chartDependent={chartObj}
                    rowCount={10}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectionMode={'multiple'}  //single , multiple
                    selectKeyField={'TotalId'}
                    getSelectedRows={getSelectedRows}


                />
                <div className="Issuance col-12 d-flex flex-wrap justify-content-end">

                    <Button variant="contained"
                        color="primary"
                        style={{ height: "38px", margin: "8px" }}
                        onClick={BatchValidate}
                    >
                        {t("تایید جمعی")}
                    </Button>

                    <Button variant="contained"
                        color="primary"
                        style={{ height: "38px", margin: "8px" }}
                        onClick={BatchPrint}>
                        {t("چاپ تجمیعی")}
                    </Button>

                </div>
            </div>

            <Menu
                id="moreOperationsMenu"
                anchorEl={anchorElPrint}
                open={Boolean(anchorElPrint)}
                onClose={handleClosePrint}
            >
                <Link target="_blank" rel="noopener noreferrer" className="linky" to={'/Warehouse/Sale/ReturnFromDist/PrintBatchTotalWC'}><MenuItem className="linky"> {t("همراه با قیمت")}</MenuItem></Link>
                <Link target="_blank" rel="noopener noreferrer" className="linky" to={'/Warehouse/Sale/ReturnFromDist/PrintBatchTotalWOC'}><MenuItem className="linky">{t("بدون قیمت")}</MenuItem></Link>
                <Link target="_blank" rel="noopener noreferrer" className="linky" to={'/Warehouse/Sale/ReturnFromDist/PrintBatchTotalDesc'}><MenuItem className="linky">{t("همراه با فضای توضیحات")}</MenuItem></Link>
            </Menu>
        </>
    )
}
export default SaleReturnDistGrid