import React, {useEffect, useRef, useState} from "react";
import RKGrid, { IndexCell,getLangDate,DateCell } from "rkgrid";
import {Box, Button, Modal, useTheme} from "@mui/material";
import { useTranslation } from "react-i18next";
import gData from './gData.json';
import ActionCell from './ActionCell'
import {Link} from "react-router-dom";
import warningImg from "../../../assets/images/icons/warning-icon.svg";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";



const TemporaryReceipt = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [openConfirm, setOpenConfirm] = useState(false)
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = gData.map((data) => {
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                StorekeeperCode: parseInt(data.StorekeeperCode),
                WarehouseCode: parseInt(data.WarehouseCode),
            }
        })
        setData(tempData)

        let tempExcel = gData?.map((data, index) => {
            return {
                ...data,
                IndexCell: index + 1,
                DocumentDate: getLangDate(i18n.language, new Date(data.DocumentDate)),
                StorekeeperCode: parseInt(data.StorekeeperCode),
                WarehouseCode: parseInt(data.WarehouseCode),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])



    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'DocumentDate',
            // columnMenu: DateMenu,
            filterable: true,
            filter: "date",
            // format: "{0:d}",
            name: "تاریخ رسید",
            cell: DateCell,
            reorderable: true,
        },
        {
            field: 'PersonName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "تحویل دهنده",
        },
        {
            field: 'StorekeeperCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'numeric',
            name: "کد انباردار",
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
            filter: 'numeric',
            name: "کد انبار",
        },
        {
            field: 'WarehouseName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام انبار",
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
            width: '150px',
            name: "عملیات",
            cell: ActionCell,
            className: 'text-center',
            sortable: false,
            reorderable: false
        }
    ]

    function getSelectedRows(list) {
        setSelectedRows(list)
    }

    const style2 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        maxWidth:'100%',
        textAlign:'center',
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 2,
        direction: i18n.dir()
    };

    const imgStyle={
        width:'70px',
        height:'auto',
        marginBottom:'40px'
    }



    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}` }} >
                <RKGrid
                    gridId={'Temporary_Receipt'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("رسیدهای موقت انبار")}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectionMode={'multiple'}  //single , multiple
                    selectKeyField={'DocumentId'}
                    getSelectedRows={getSelectedRows}

                />
                <div style={{padding:'0 20px'}}>
                    <div className='row'>
                        <div className={'col-12 d-flex justify-content-end'}>
                            <Button variant="contained" style={i18n.dir()==='rtl'?{marginLeft:'10px'}:{marginRight:'10px'}}>
                                <Link to={`/WareHouse/Provisional/Receipt/Form`} >
                                    {t("جدید")}
                                </Link>
                            </Button >
                            <Button variant="contained"  color={'success'} disabled={!selectedRows.length} onClick={() => setOpenConfirm(true)}>
                                {t("تایید")}
                            </Button >
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <Box sx={style2}>
                    <img src={warningImg} alt={'remove'} className='remove-icon' style={imgStyle}/>
                    <p>
                        {t('آیا از انجام عمل مورد نظر مطمئن هستید؟')}
                    </p>
                    <div className='d-flex justify-content-center'>
                        <Button variant="contained" color={'success'} startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />} style={{ margin: '0 2px' }}>{t('بله مطمئنم')}</Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenConfirm(false)}
                        >{t('انصراف')}</Button>

                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default TemporaryReceipt