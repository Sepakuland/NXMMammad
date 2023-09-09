import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import RKGrid, { IndexCell,DateCell } from "rkgrid";
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogContent, DialogContentText, Tooltip, Typography, useTheme, } from "@mui/material";
import swal from "sweetalert";
import { useLocation } from "react-router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { SelectBox } from "devextreme-react";
import RowsData from './RowsData.json'
import AddIcon from '@mui/icons-material/Add';
import AddAccountParty from "../../../components/Modals/AddAccountParty";


export const reasonList = [
    'تکمیل بودن اجناس', 'خرید از عمده فروش', 'خارج از تایم کاری', 'عدم پاسخگویی', 'بی اعتبار بودن مشتری', 'بسته بودن', 'اعلام قطع همکاری', 'عدم تسویه', 'نارضایتی از قیمت ها'
]

const salePhoneVisitHistory = [
    {
        "visitDate": "2022/07/12",
        "visitTime": "15:04",
        "personnelName": "مدیر سیستم",
        "ConversationResult": "عدم پاسخگویی",
        "visitDescription": ""
    },
    {
        "visitDate": "2022/06/22",
        "visitTime": "12:31",
        "personnelName": "مدیر سیستم",
        "ConversationResult": "نارضایتی از قیمت ها",
        "visitDescription": ""
    },
    {
        "visitDate": "2022/06/26",
        "visitTime": "16:52",
        "personnelName": "مدیر سیستم",
        "ConversationResult": "نارضایتی ",
        "visitDescription": ""
    },

]



export default function EditForm() {

    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const location = useLocation()
    const { pathname, search } = location

    const [panel1, setPanel1] = React.useState(true);
    const [panel2, setPanel2] = React.useState(true);
    const [panel3, setPanel3] = React.useState(true);
    const [panel4, setPanel4] = React.useState(true);

    const handlePanel1 = () => (event, newExpanded) => {
        setPanel1(newExpanded);
    };
    const handlePanel2 = () => (event, newExpanded) => {
        setPanel2(newExpanded);
    };

    const handlePanel3 = () => (event, newExpanded) => {
        setPanel3(newExpanded);
    };
    const handlePanel4 = () => (event, newExpanded) => {
        setPanel4(newExpanded);
    };

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const [ConversationData, setConversationData] = useState([])
    const [orderData, setOrderData] = useState([])
    const [tempColumnOrder, setTempColumnOrder] = useState([])

    useEffect(() => {
        let tempData = salePhoneVisitHistory.map((data) => {
            return {
                ...data,
                visitDate: data.visitDate !== '' ? new Date(data.visitDate) : '',
            }
        })
        setConversationData(tempData)
    }, [i18n.language])

    useEffect(() => {
        let temp = RowsData.map((item) => {
            let dates = {}
            item?.Dates?.forEach((item) => {
                dates[item.Date] = item.Quantity
            })
            return {
                EntityCode: item.EntityCode,
                EntityName: item.EntityName,
                ...dates
            }
        })
        setOrderData(temp)
        let cTemp = RowsData[0].Dates.map((item) => item.Date)

        let column = cTemp.map((item) => ({
            field: item,
            filterable: false,
            name: item,
        }))

        setTempColumnOrder([
            {
                field: 'IndexCell',
                filterable: false,
                width: '40px',
                name: "ردیف",
                cell: IndexCell,
                sortable: false,
                reorderable: false
            },
            {
                field: 'EntityCode',
                filterable: false,
                name: "کد کالا",
            },
            ...column
        ]
        )

    }, [])


    let tempColumnConversation = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '40px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'visitDate',
            filterable: false,
            cell: DateCell,
            name: "تاریخ",
        },
        {
            field: 'visitTime',
            filterable: false,
            name: "ساعت",
        },
        {
            field: 'personnelName',
            filterable: false,
            name: "ثبت کننده",
        },
        {
            field: 'ConversationResult',
            filterable: false,
            name: "نتیجه",
        },
        {
            field: 'visitDescription',
            filterable: false,
            width: '120px',
            name: "شرح",
        },
    ]


    const formik = useFormik({
        initialValues: {
            Reason: '',
            Description: ''

        },
        validationSchema: Yup.object({
            Reason: Yup.string().required("دلیل عدم سفارش الزامی است"),

        }),
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = values;

            DocumentSub();
            console.log("All Values:", allValues);
        },
    });

    const DocumentSub = () => {
        swal({
            title: t("با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };


    return (
        <>
            <div className='mt-4'>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">

                        <div className="row">
                            <div className='col-6'>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="button"
                                    className='outlined-primary-hover'
                                    onClick={() => console.log('next')}
                                >
                                    <Link to={`${pathname}?id=`}>
                                        {i18n.dir() === 'rtl' ?
                                            <EastIcon sx={{ fontSize: '18px', marginLeft: '8px' }} /> :
                                            <WestIcon sx={{ fontSize: '18px', marginRight: '8px' }} />}
                                        {t('طرف حساب بعدی')}
                                    </Link>
                                </Button>
                            </div>
                            <div className='col-6 d-flex justify-content-end'>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="button"
                                    className='outlined-primary-hover'
                                    onClick={() => console.log('next')}
                                >
                                    <Link to={`${pathname}?id=`}>
                                        {t('طرف حساب قبلی')}
                                        {i18n.dir() === 'rtl' ?
                                            <WestIcon sx={{ fontSize: '18px', marginRight: '8px' }} /> :
                                            <EastIcon sx={{ fontSize: '18px', marginLeft: '8px' }} />}
                                    </Link>
                                </Button>
                            </div>
                            <div className="content col-xl-7 col-lg-6 col-md-12 col-12">
                                <Accordion expanded={panel1} onChange={handlePanel1()}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>{t("اطلاعات طرف حساب")}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='row-col-pm-8'>
                                            <div className='row align-items-center '>
                                                <div className='col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'>{t("نام")}:</h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>شرکت تولیدی آرپا نوش</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'>{t("نام حقوقی")}:</h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>شرکت تولیدی آرپا نوش</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'>{t("مانده حساب")}:</h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <Button variant="outlined" color='primary'
                                                                className='edit-btn' sx={{
                                                                    maxWidth: '100%!important',
                                                                    width: 'auto!important'
                                                                }}
                                                                style={{ direction: i18n.dir() }}>
                                                                {/*<Link to={`/Report/PartnerSpecifics?id=${props?.dataItem.PartnerId}`} target={"_blank"}>*/}
                                                                1,256,222,444 بس
                                                                {/*</Link>*/}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'>{t("کد")}:</h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>10001002</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-8 col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'>{t("تلفن ها")}:</h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>088-09038608011، 09038608011</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-8'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'>{t("آدرس")}:</h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>تهران صادقیه</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'> {t("توضیحات")} 1 : </h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>---</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-12'>
                                                    <div className='row align-items-center flex-lg-nowrap'>
                                                        <div className='col-auto'>
                                                            <h2 className='info-title'> {t("توضیحات")} 2 : </h2>
                                                        </div>
                                                        <div className='col-auto flex-grow-1'>
                                                            <p className='info-text'>---</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-12 justify-content-end d-flex'>
                                                    <Button variant='outlined' className='edit-btn-orange' onClick={() => handleClickOpen()}>
                                                        <EditIcon sx={{ fontSize: '16px', margin: '0 4px' }} />
                                                        {t('ویرایش')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={panel2} onChange={handlePanel2()}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        <Typography>{t("نتیجه تماس")}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='row'>
                                            <div className="content col-lg-4 col-md-4 col-sm-4 col-12 d-flex align-items-center">
                                                <div className="title m-0">
                                                    <span>{t("شماره پیشفاکتور")}:</span>
                                                </div>
                                                <Tooltip title={t("افزودن")}>
                                                    <IconButton sx={i18n.dir() == 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}>
                                                        <Link to={`/Sell/sellPhone/InvoiceForm`} state={{ prevPath: pathname + search }}>
                                                            <AddIcon color="success" />
                                                        </Link>
                                                    </IconButton >
                                                </Tooltip>
                                                {/*<div className='d-flex align-items-center'>*/}
                                                {/*    <span className='info-text' style={i18n.dir()=='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}>1233456</span>*/}
                                                {/*    <Tooltip title={t("ویرایش")}>*/}
                                                {/*        <IconButton sx={i18n.dir()=='rtl'?{marginRight:'7px'}:{marginLeft:'7px'}}>*/}
                                                {/*            <Link to={`/`}>*/}
                                                {/*                <EditIcon color="info" />*/}
                                                {/*            </Link>*/}
                                                {/*        </IconButton >*/}
                                                {/*    </Tooltip>*/}
                                                {/*</div>*/}
                                            </div>
                                            <div className="content col-lg-8 col-md-8 col-sm-8 col-12">
                                                <div className="title">
                                                    <span>{t("دلیل عدم سفارش")}<span className='star'>*</span></span>
                                                </div>
                                                <div className="wrapper">
                                                    <SelectBox
                                                        dataSource={reasonList}
                                                        rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                        onValueChanged={(e) => formik.setFieldValue('Reason', e.value)}
                                                        className='selectBox'
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        // displayExpr={'Name'}
                                                        // valueExpr="Name"
                                                        itemRender={null}
                                                        placeholder=''
                                                        name='receivingWarehouse'
                                                        id='receivingWarehouse'
                                                        searchEnabled
                                                    />
                                                    {formik.touched.Reason && formik.errors.Reason && !formik.values.Reason ? (<div className='error-msg'>{t(formik.errors.Reason)}</div>) : null}
                                                </div>
                                            </div>
                                            <div className="content col-12">
                                                <div className="title">
                                                    <span> {t("شرح")} </span>
                                                </div>
                                                <div className='wrapper'>
                                                    <div>
                                                        <textarea
                                                            className='form-input'
                                                            id='Description'
                                                            name='Description'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.Description}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </AccordionDetails>
                                </Accordion>

                            </div>
                            <div className="content col-xl-5 col-lg-6 col-md-12 col-12">
                                <Accordion expanded={panel3} onChange={handlePanel3()} sx={panel3 ? { minHeight: '100%' } : {}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3a-content"
                                        id="panel3a-header"
                                    >
                                        <Typography>{t("تاریخچه مکالمات")}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {!ConversationData.length && <div className='pt-2 pb-4'>
                                            <p className='empty-text'>{t('تماسی با این طرف حساب در سیستم ثبت نشده است')}</p>
                                        </div>}
                                        {!!ConversationData.length && <div className='accordion-grid'>
                                            <RKGrid
                                                gridId={'ConversationFormGrid'}
                                                gridData={ConversationData}
                                                columnList={tempColumnConversation}
                                                showSetting={false}
                                                showChart={false}
                                                showExcelExport={false}
                                                showPrint={false}
                                                rowCount={8}
                                                sortable={false}
                                                pageable={true}
                                                reorderable={false}
                                                selectable={false}
                                            />
                                        </div>}

                                    </AccordionDetails>
                                </Accordion>

                            </div>
                            <div className="content col-12">
                                <Accordion expanded={panel4} onChange={handlePanel4()} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel4a-content"
                                        id="panel4a-header"
                                    >
                                        <Typography>{t("تاریخچه سفارش اقلام")}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='accordion-grid'>
                                            {!orderData.length && <div className='pt-2 pb-4'>
                                                <p className='empty-text'>{t('سفارشی از این طرف حساب در سیستم ثبت نشده است')}</p>
                                            </div>}
                                            {!!(tempColumnOrder.length && orderData.length) && <RKGrid
                                                gridId={'orderFormGrid'}
                                                gridData={orderData}
                                                columnList={tempColumnOrder}
                                                showSetting={false}
                                                showChart={false}
                                                showExcelExport={false}
                                                showPrint={false}
                                                rowCount={10}
                                                sortable={false}
                                                pageable={true}
                                                reorderable={false}
                                                selectable={false}
                                            />}
                                        </div>

                                    </AccordionDetails>
                                </Accordion>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={false}
                maxWidth={'xl'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"

            >
                <DialogContent sx={{ background: "#edeff2" }} >
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        sx={{ background: "#edeff2" }}

                    >
                        <AddAccountParty handleClose={handleClose} />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <div>
                <div className={`button-pos ${i18n.dir == "ltr" ? "ltr" : "rtl"}`}>
                    <Button
                        variant="contained"
                        color="success"
                        type="button"
                        onClick={() => {
                            formik.handleSubmit()

                        }}
                    >
                        {t("تایید")}
                    </Button>

                    <div className="Issuance">
                        <Button
                            variant="contained"
                            color="error"
                            style={i18n.dir() == 'rtl' ? { marginRight: "10px" } : { marginLeft: "10px" }}
                        >
                            <Link to={'/Sell/sellPhone'}>
                                {t("انصراف")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
