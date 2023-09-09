import React, {useEffect, useRef, useState} from "react";
import RKGrid, { FooterSome, TotalTitle,IndexCell } from "rkgrid";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import gData from './gData.json';
import ActionCell from './ActionCell'
import CloseIcon from '@mui/icons-material/Close';
import UploadFile from "../../../components/UploadComponent/UploadFile";
import {FileExcelOutlined} from "@ant-design/icons";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import {Link} from 'react-router-dom'



const WorkingHours = () => {

    const theme = useTheme();
    const {t, i18n} = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    const [fileList, setFileList] = useState()
    const [uploadError, setUploadError] = useState(false)
    function updateFileList(list) {
        setFileList(list)
    }

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        let tempData = gData.map((data) => {
            return {
                ...data,
                PersonnelCode: parseInt(data.PersonnelCode),
                Absence: parseInt(data.Absence),
                MissionDay: parseInt(data.MissionDay),
            }
        })
        setData(tempData)

        let tempExcel = gData?.map((data, index) => {
            return {
                ...data,
                IndexCell: index + 1,
                PersonnelCode: parseInt(data.PersonnelCode),
                Absence: parseInt(data.Absence),
                MissionDay: parseInt(data.MissionDay),
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])



    const chartObj = [
        {value: "PersonnelCode", title: t('کد پرسنل')},
        {value: "Absence", title: t('غیبت')},
        {value: "MissionDay", title: t('ماموریت روزانه')},
    ]



    const CustomFooterSome=(props)=><FooterSome {...props} data={dataRef.current} />


    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell:TotalTitle,
            reorderable: false
        },

        {
            field: 'PersonnelCode',
            filterable: true,
            // columnMenu: ColumnMenu,
            filter: "numeric",
            name: "کد پرسنل",
        },
        {
            field: 'PersonnelName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام پرسنل",
        },
                {
            field: 'RuleTitle',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "حکم",
        },
        {
            field: 'Month',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ماه",
        },
        {
            field: 'ShouldWorkHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "موظفی",
        },
        {
            field: 'WorkingHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "حضور",
        },
        {
            field: 'LeaveSum',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "مرخصی",
        },
        {
            field: 'LatencyHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "تاخیر",
        },
        {
            field: 'RushHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "تعجیل",
        },
        {
            field: 'Absence',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: "numeric",
            footerCell:CustomFooterSome,
            name: "غیبت",
        },
        {
            field: 'DeficitHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "کسر کار",
        },
        {
            field: 'ExtraHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "اضافه کار",
        },
        {
            field: 'OffDayExtraHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "اضافه کار تعطیل",
        },
        {
            field: 'MissionDay',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: "numeric",
            footerCell:CustomFooterSome,
            name: "ماموریت روزانه",
        },
        {
            field: 'MissionHours',
            // columnMenu: ColumnMenu,
            filterable: true,
            filter: 'time',
            name: "ماموریت ساعتی",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '100px',
            name: "عملیات",
            cell: ActionCell,
            className: 'text-center',
            sortable: false,
            reorderable: false
        }
    ]


    return (
        <>
            <div style={{backgroundColor: `${theme.palette.background.paper}`}}>
                <RKGrid
                    gridId={'workingHours'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    chartDependent={chartObj}
                    excelFileName={t("ساعات حضور پرسنل")}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={false}

                />
                <div className="d-flex justify-content-end mt-3" style={{padding:'20px'}}>
                    <Button variant="contained"
                            color="primary"
                            onClick={()=>setOpen(true)}
                            sx={i18n.dir()==='rtl'?{marginLeft:'10px'}:{marginRight:'10px'}}
                    >
                        {t("ورود از Excel")}
                    </Button >
                    <Button variant="contained"
                            color="primary"
                    >
                        <Link to={'/Payroll/workingHours/workingHoursForm'}>
                            {t("جدید")}
                        </Link>
                    </Button >
                </div>
            </div>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}
                fullWidth={false}
                maxWidth={'md'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <div className={`modal-header ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                    <h2>{t('آپلود فایل')}</h2>
                    <button type='button' className='close-btn' onClick={() => setOpen(false)}><CloseIcon /></button>
                </div>
                <DialogContent >

                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                        sx={{width:'400px',direction:i18n.dir()}}
                    >
                        <div className='d-flex align-items-center mb-3'>
                            <span className='file-name'>{t('فایل اکسل:')}
                                <FileExcelOutlined />
                                <a download="example.txt" target="_blank" href="./">file.xlsx</a>
                            </span>
                            <Tooltip title={t("تایید")}>
                                <IconButton variant="contained" color='success' className='kendo-action-btn'>
                                    <CheckIcon />
                                </IconButton >
                            </Tooltip>
                        </div>
                        <UploadFile
                            title={t("بارگذاری فایل")}
                            multiple={false}
                            uploadError={uploadError}
                            updateFileList={updateFileList}
                            accept={".xlsx"}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{direction:i18n.dir()}}>
                    <div className='d-flex justify-content-center w-100'>
                        <Button onClick={()=>setOpen(false)} variant="contained" color='success' sx={i18n.dir()==='rtl'?{marginLeft:'7px'}:{marginRight:'7px'}}>{t("تایید")}</Button>
                        <Button onClick={()=>setOpen(false)} variant="outlined" color='error'>{t("بازگشت")}</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default WorkingHours