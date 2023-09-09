import { React, useEffect, useRef, useState } from "react";
import RKGrid, { FooterSome, IndexCell,getLangDate,DateCell } from "rkgrid";
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Data from './Data.json'
import { history } from '../../../utils/history';
import ActionCellMainWE from "./ActionCellMainWE";

const WareHousingEra = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = Data.map((data) => {
            return {
                ...data,
                PeriodDate: new Date(data.PeriodDate),
                PeriodCode: data.PeriodCode !== '' ? parseInt(data.PeriodCode) : '',
            }
        })
        setData(tempData)

        let tempExcel = Data?.map((data, index) => {
            return {
                ...data,
                PeriodDate: getLangDate(i18n.language, new Date(data.PeriodDate)),
                PeriodCode: data.PeriodCode !== '' ? parseInt(data.PeriodCode) : '',
            }
        })
        setExcelData(tempExcel)
    }, [i18n.language])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: true,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'PeriodCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد دوره",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: "PeriodName",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: 'نام دوره',
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'PeriodType',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نوع دوره",
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'PeriodDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ انبارگردانی",
            // format: "{0:d}",
            className: 'text-center',
            filter: 'date',
            cell: DateCell,
            reorderable: true
        },
        {
            field: 'Warehouse',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "انبار",
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'Storekeeper',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "انباردار",
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'PeriodDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'Status',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وضعیت",
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '170px',
            name: "عملیات",
            cell: ActionCellMainWE,
            className: 'text-center',
            reorderable: false
        },

    ]

    const chartObj = [
        { value: "Price", title: t('مبلغ') },
        { value: "PeriodCode", title: t("کد") },
        { value: "BankAccountNumber", title: t("شماره حساب") },
        { value: "PartnerTelephones", title: t("تلفن") },
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

    const callComponent = () => {
        history.navigate(`WareHouse/AddWareHouseEra`);
    }
    const callPrintTemplate = () => {

        window.open(`/WareHouse/WareHouseEra/PrintTemplate?lang=${i18n.language}`, '_blank');
    }

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'WareHouseEra'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t('دوره های انبارگردانی')}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={false}
                    selectKeyField={'WarehousingPeriodId'}
                    getSelectedRows={getSelectedRows}
                    
                />
                <div className="row align-items-start">
                    <div style={{ height: "40px" }} className="d-flex justify-content-end col-sm-12 col-12 mt-3 ">
                        <div className="d-flex justify-content-end align-items-center" style={{ width: "10%", height: "100%" }}>
                            <Button style={{ width: "100px", height: "100%" }} variant="contained"
                                color="primary"
                                onClick={callPrintTemplate}>
                                {t("چاپ تمپلیت")}
                            </Button ></div>
                        <div className="d-flex justify-content-center align-items-center" style={{ width: "10%", height: "100%" }}>
                            <Button style={{ width: "100px", height: "100%" }} variant="contained"
                                color="primary"
                                onClick={callComponent}>
                                {t("جدید")}
                            </Button ></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WareHousingEra
