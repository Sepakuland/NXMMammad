import {
    Button,
    Checkbox, FormControlLabel, Typography,
    useTheme
} from "@mui/material";
import React, {useEffect, useState,useRef} from "react";
import {useTranslation} from "react-i18next";
import DateCell from "../../../components/RKGrid/DateCell";
import IndexCell from "../../../components/RKGrid/IndexCell";
import RKGrid from "../../../components/RKGrid/RKGrid";
import {useLocation} from "react-router-dom";
import gridData from './data.json'
import CurrencyCell from "../../../components/RKGrid/CurrencyCell";
import {useFormik} from "formik";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import {renderCalendarLocaleSwitch, renderCalendarSwitch} from "../../../utils/calenderLang";
import DateObject from "react-date-object";
import {julianIntToDate} from "../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DocumentGrid = () => {
    const location = useLocation();

    const theme = useTheme();
    const {t, i18n} = useTranslation();

    const [rowData, setRowData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);


    const dateRef=useRef()

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            User: 'مدیرسیستم',
            ConfirmationAll: false,
            Date: '',
            Selected:[]
        },
        onSubmit: (values) => {
            let allValue={}
            DocumentSub();
            if(values.ConfirmationAll){
                allValue={
                    User:values.User,
                    Date:values.Date,
                }
            }else{
                allValue={
                    User:values.User,
                    Selected:values.Selected,
                }
            }
            console.log("All Values:", allValue);
        },
    });

    const DocumentSub = () => {
        swal({
            title: t("با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };

    function getData() {
        // setLoading(true);
        // axios.get(`${appConfig.BaseURL}/api/TestPaginate${location?.search}`)
        //     .then((res) => {
        //         setRowData(res.data.data);
        //         let pagination = JSON.parse(res.headers.pagination);
        //         setTotal(pagination.totalCount);
        //     })
        //     .finally(() => setLoading(false));
    }

    useEffect(() => {

        let tempData = gridData.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: new Date(data.DocumentInsertDate),
                DocumentBalance: cost,
            }
        })
        setData(tempData)
        setLoading(false)

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
            field: 'DocumentCode',
            filterable: true,
            name: "ش سند",
            filter: 'numeric',
        },
        {
            field: 'DocumentTrackCode',
            filterable: true,
            name: "ش پیگیری",
            filter: 'numeric',
        },
        {
            field: 'DocumentInsertDate',
            filterable: true,
            filter: "date",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'DocumentBalance',
            filterable: true,
            name: "تراز",
            cell: CurrencyCell,
            filter: 'numeric',
        },
        {
            field: 'DocumentTypeName',
            filterable: true,
            name: "نوع",
        },
        {
            field: 'RefDocumentCode',
            filterable: true,
            name: "ش ارجاع",
            filter: 'numeric',
        },
        {
            field: 'InsertUser',
            filterable: true,
            name: "درج",
        },
        {
            field: 'LastUpdateUser',
            filterable: true,
            name: "آخرین تغییر",
        },
        {
            field: 'DocumentState',
            filterable: true,
            name: "وضعیت سند",
        },
        {
            field: 'DocumentDescription',
            filterable: true,
            width: '150px',
            name: "شرح",
        }
    ]


    useEffect(() => {
        if (location?.search !== "") {
            getData();
        }
    }, [location]);

    function getSelectedRows(list) {
        formik.setFieldValue('Selected',list)
    }



    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px 0",
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        <div className="row">
                            <div className="content col-xl-3 col-lg-3 col-md-3 col-12">
                                <div className="title">
                                    <span>{t("کاربر قطعی کننده")}</span>
                                </div>
                                <div className='wrapper'>
                                    <div>
                                        <input
                                            className='form-input'
                                            id='User'
                                            name='User'
                                            value={formik.values.User}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="content col-xl-5 col-lg-6 col-md-7 col-12">
                                <div className="title">
                                    <span>‌</span>
                                </div>
                                <div className='d-sm-flex align-items-center'>
                                    <div  onFocus={() => {
                                        dateRef?.current?.closeCalendar();
                                    }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formik.values.ConfirmationAll}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    name={`ConfirmationAll`}
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            sx={{margin: '0'}}
                                            label={
                                                <Typography variant="h6" sx={{fontSize: '12px'}}>
                                                    {t('قطعی کردن تمام اسناد تا تاریخ')}
                                                </Typography>
                                            }
                                        />
                                    </div>
                                    <div className='wrapper date-picker position-relative flex-grow-1 m-xs-0' style={i18n.dir()==='rtl'?{marginRight:'30px'}:{marginLeft:'30px'}}>
                                        <DatePicker
                                            name={`Date`}
                                            ref={dateRef}
                                            id="StartDate"
                                            calendar={renderCalendarSwitch(i18n.language)}
                                            locale={renderCalendarLocaleSwitch(i18n.language)}
                                            calendarPosition="bottom-right"
                                            value={formik.values.Date ? new DateObject(formik.values.Date) : ''}
                                            onChange={(date) => {
                                                formik.setFieldValue(`Date`,date? julianIntToDate(date.toJulianDay()):'');
                                            }}
                                            disabled={!formik.values.ConfirmationAll}
                                        />
                                        <div
                                            className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                            <div className='d-flex align-items-center justify-content-center'>
                                                <CalendarMonthIcon className='calendarButton'/></div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="content col-xl-4 col-lg-3 col-md-2 col-12 d-flex d-md-block justify-content-center" onFocus={() => {
                                dateRef?.current?.closeCalendar();
                            }}>
                                <div className="title d-none d-md-block">
                                    <span>‌</span>
                                </div>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={formik.handleSubmit}
                                    disabled={(formik.values.ConfirmationAll&&!formik.values.Date)||(!formik.values.ConfirmationAll&&!formik.values.Selected.length)}
                                >
                                    {t("قطعی کردن")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className='position-relative'>
                    {formik.values.ConfirmationAll?<div className='disable-block' style={theme.palette.mode==='dark'?{backgroundColor:'rgba(18,18,18,.4)'}:{backgroundColor:'rgba(255,255,255,.4)'}}></div>:null}
                    <div className={formik.values.ConfirmationAll?'disable-section':''}>
                        <RKGrid
                            gridId={"Confirmation_Documents"}
                            gridData={data}
                            columnList={tempColumn}
                            showSetting={true}
                            showChart={false}
                            showExcelExport={false}
                            showPrint={false}
                            rowCount={10}
                            sortable={true}
                            pageable={true}
                            reorderable={false}
                            selectable={!formik.values.ConfirmationAll}
                            selectionMode={'multiple'}
                            selectKeyField={'DocumentId'}
                            getSelectedRows={getSelectedRows}
                            showFilter={true}
                            total={30}
                            showTooltip={true}
                            loading={loading}
                        />
                    </div>
                </div>

            </div>

        </>
    );
};

export default DocumentGrid;
