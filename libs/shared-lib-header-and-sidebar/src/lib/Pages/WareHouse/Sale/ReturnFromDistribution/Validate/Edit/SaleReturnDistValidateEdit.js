import { React, useEffect, useRef, useState } from "react";
import RKGrid from "../../../../../../components/RKGrid/RKGrid";
import { Button, Dialog, DialogContent, DialogContentText, FormControlLabel, FormGroup, IconButton, Switch, Tooltip, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import IndexCell from "../../../../../../components/RKGrid/IndexCell";
import DateCell from "../../../../../../components/RKGrid/DateCell";
import FooterSome from "../../../../../../components/RKGrid/FooterSome";
import TotalTitle from "../../../../../../components/RKGrid/TotalTitle";
import CurrencyCell from "../../../../../../components/RKGrid/CurrencyCell";
import { history } from '../../../../../../utils/history';
import { useFormik } from "formik";
import * as Yup from "yup";
import { julianIntToDate } from "../../../../../../utils/dateConvert";
import DateObject from "react-date-object";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../../../../../utils/calenderLang";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SelectBox } from "devextreme-react";
import { useSearchParams } from "react-router-dom";
import Visitors from './Visitors.json'
import AccountPartyData from './AccountPartyData.json'
import CurrencyInput from "react-currency-input-field";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AddAccountParty from "../../../../../../components/Modals/AddAccountParty";
import cheque from './cheque.json'

const SaleReturnDistValidateEdit = () => {

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [timeValueSet, setTimeValueSet] = useState(false)
    const [priceEdit, setPriceEdit] = useState(false)
    const [taxEdit, setTaxEdit] = useState(false)
    const [discountEdit, setDiscountEdit] = useState(false)
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            PreInvoiceCode: Math.floor(Math.random() * 1000),
            SaleDate: julianIntToDate(new DateObject().toJulianDay()),
            Visitor: "",
            City: "",
            AccountParty: "",
            remaining: 0,
            Area: "",
            Address: "",
            Route: "",
            Telephones: "",
            Settle: "",
            SettlementDeadline: 0,
            Client: "",
            Registrar: "علیرضا سلطانی",
            Description: "",
            Description2: "",
        },
        validationSchema: Yup.object({
            SaleDate: Yup.date().required("انتخاب تاریخ الزامی است"),

        }),
        onSubmit: (values) => {
            console.log("here", values)
            factorSub()
        },
    });
    const factorSub = () => {
        swal({
            title: t("فاکتور با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
        });
    };
    const dateRef = useRef()
    const [date, setDate] = useState(new DateObject());
    const cities = [t("کرمانشاه"), t("بندرعباس"), t("کرج"), t("تهران"), t("اهواز"), t("دزفول")]
    const Areas = [t("منطقه 1"), t("منطقه 2"), t("منطقه 3"), t("منطقه 4"), t("منطقه 5")]
    const Routes = [t("مسیر1"), t("2مسیر"), t("مسیر3"), t("مسیر4"), t("مسیر5"), t("مسیر6")]

    const cancel = () => {
        history.navigate("/WareHouse/sale/approvedInvoices")
    }
    //////////////////////////////dialog//////////////////////////////
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
    //////////////////////////////////remaining/////////////////////
    useEffect(() => {
        let acc = AccountPartyData.filter(a => a.Id == formik.values.AccountParty)
        formik.setFieldValue("remaining", acc[0]?.PartnerAccountingRemainder)
        formik.setFieldValue("Address", acc[0]?.PartnerAddress)
        formik.setFieldValue("Telephones", acc[0]?.PartnerPhones)
    }, [formik.values.AccountParty])
    /////////////////////////////Grid///////////////////////////////
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = cheque.map((data) => {
            return {
                ...data,
                Amount: data.Amount !== '' ? parseInt(data.Amount) : '',
            }
        })
        setData(tempData)
    }, [i18n.language]);
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'Serial',
            filterable: false,
            name: "سریال",
            filter: 'numeric',
        },
        {
            field: 'Amount',
            filterable: false,
            name: "مبلغ",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },
        {
            field: 'maturity',
            filterable: false,
            name: "سررسید",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
        },
    ]

    const HandlePriceEditChange = (event) => {
        setPriceEdit(event.target.checked)
    }
    const HandleTaxEditChange = (event) => {
        setTaxEdit(event.target.checked)
    }
    const HandleDiscountEditChange = (event) => {
        setDiscountEdit(event.target.checked)
    }
    /////////////////////////////////////////////////////////////////
    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <div className="row form-design">
                    <div className="col-lg-8 col-md-8 col-12">
                        <div className="row">
                            <div className=" col-lg-4 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                <div className="title">
                                    <span>{t("شماره پیش فاکتور")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="PreInvoiceCode"
                                        name="PreInvoiceCode"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.PreInvoiceCode}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12  ">

                                <div className="title">
                                    <span>{t("تاریخ فروش")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper date-picker position-relative">
                                    <DatePicker
                                        ref={dateRef}
                                        name={"SaleDate"}
                                        id={"SaleDate"}
                                        calendarPosition="bottom-right"
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        onBlur={formik.handleBlur}
                                        onChange={(val) => {
                                            formik.setFieldValue("SaleDate", julianIntToDate(val.toJulianDay()));
                                        }}
                                        value={date}
                                    />
                                    <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton' />
                                        </div>
                                    </div>
                                    {formik.touched.SaleDate && formik.errors.SaleDate &&
                                        !formik.values.SaleDate ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.SaleDate)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                <div className="title">
                                    <span>{t("ویزیتور")}</span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={Visitors}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            valueExpr="Id"
                                            className='selectBox'
                                            searchEnabled={true}
                                            placeholder=''
                                            showClearButton
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={function (item) {
                                                return item && item.Code + '- ' + item.Name;
                                            }}
                                            displayValue='Name'
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('Visitor', e.value)
                                            }}
                                        />

                                        {formik.touched.Visitor && formik.errors.Visitor &&
                                            !formik.values.Visitor ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Visitor)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("شهر")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={cities}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            className='selectBox'
                                            searchEnabled={true}
                                            placeholder={t('همه شهرها')}
                                            showClearButton
                                            noDataText={t("اطلاعات یافت نشد")}
                                            // displayExpr={function (item) {
                                            //   return item && item.Code + ' - ' + item.Name;
                                            // }}
                                            // displayValue='Name'
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('City', e.value)
                                            }}
                                        />

                                        {formik.touched.City && formik.errors.City &&
                                            !formik.values.City ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.City)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("طرف حساب")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={AccountPartyData}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            valueExpr="Id"
                                            className='selectBox'
                                            searchEnabled={true}
                                            placeholder=''
                                            showClearButton
                                            noDataText={t("اطلاعات یافت نشد")}
                                            displayExpr={function (item) {
                                                return item && item.Code + '- ' + item.Name + `(${item.PartnerDefaultVisitor_Name})`;
                                            }}
                                            displayValue='Name'
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('AccountParty', e.value)
                                                if (e.value == null)
                                                    formik.setFieldValue("remaining", '')
                                                formik.setFieldValue("Address", '')
                                            }}
                                        />
                                        {formik.touched.AccountParty && formik.errors.AccountParty &&
                                            !formik.values.AccountParty ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.AccountParty)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12 ">
                                <div className="row">
                                    <div className="col-lg-3 col-md-3 col-3 ">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-6">
                                                <div className="title"><span>‌</span></div>
                                                <Tooltip title={t("افزودن طرف حساب جدید")}>
                                                    <IconButton variant="contained" className='' color="success" disabled={!formik.values.Route ? true : false} onClick={() => handleClickOpen()}  >
                                                        <AddIcon style={{ fontSize: "30px" }} />
                                                    </IconButton >
                                                </Tooltip>
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
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-6">
                                                <div className="title"><span>‌</span></div>
                                                <Tooltip title={t("ویرایش")}>
                                                    <IconButton variant="contained" color='warning' className='kendo-action-btn' >
                                                        <EditIcon />
                                                    </IconButton >
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-9 col-md-9 col-9">
                                        <div className="title">
                                            <span>{t("مانده")}</span>
                                        </div>
                                        <CurrencyInput
                                            className={`form-input `}
                                            style={{ width: "100%" }}
                                            id="remaining"
                                            name="remaining"
                                            value={formik.values.remaining}
                                            decimalsLimit={2}
                                        />
                                        {formik.touched.remaining && formik.errors.remaining &&
                                            !formik.values.remaining ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.remaining)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("منطقه")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={Areas}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            className='selectBox'
                                            searchEnabled={true}
                                            placeholder={t('همه مناظق')}
                                            showClearButton
                                            noDataText={t("اطلاعات یافت نشد")}
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('Area', e.value)
                                                if (e.value == null) {
                                                    formik.setFieldValue('Area', '')
                                                    formik.setFieldValue('Route', '')
                                                }
                                            }}
                                            disabled={!formik.values.City ? true : false}
                                        />
                                        {formik.touched.Area && formik.errors.Area &&
                                            !formik.values.Area ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Area)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("آدرس")}</span>
                                </div>

                                <input
                                    className="form-input"
                                    type="text"
                                    id="Address"
                                    name="Address"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Address}
                                    disabled
                                />
                                {formik.touched.Address && formik.errors.Address &&
                                    !formik.values.Address ? (
                                    <div className='error-msg'>
                                        {t(formik.errors.Address)}
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-lg-4 col-md-6 col-12"></div>
                            <div className="col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("مسیر")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper">
                                    <div>
                                        <SelectBox
                                            dataSource={Routes}
                                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                            className='selectBox'
                                            searchEnabled={true}
                                            placeholder={t('همه مسیرها')}
                                            showClearButton
                                            noDataText={t("اطلاعات یافت نشد")}
                                            onValueChanged={(e) => {
                                                formik.setFieldValue('Route', e.value)
                                                if (e.value == null) {

                                                    formik.setFieldValue('Route', '')
                                                }
                                            }}
                                            disabled={!formik.values.Area ? true : false}
                                        />
                                        {formik.touched.Route && formik.errors.Route &&
                                            !formik.values.Route ? (
                                            <div className='error-msg'>
                                                {t(formik.errors.Route)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12" >
                                <div className="title">
                                    <span>{t("تلفن ها")}</span>
                                </div>

                                <input
                                    className="form-input"
                                    type="text"
                                    id="Telephones"
                                    name="Telephones"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Telephones}
                                    disabled
                                />
                                {formik.touched.Telephones && formik.errors.Telephones &&
                                    !formik.values.Telephones ? (
                                    <div className='error-msg'>
                                        {t(formik.errors.Telephones)}
                                    </div>
                                ) : null}

                            </div>
                            <div className="col-lg-4 col-md-6 col-12"></div>
                            <div className=" col-lg-4 col-md-6 col12" >
                                <div className="title">
                                    <span>{t("نحوه تسویه")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Settle"
                                        name="Settle"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Settle}
                                    />
                                    {formik.touched.Settle && formik.errors.Settle &&
                                        !formik.values.Settle ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.Settle)}
                                        </div>
                                    ) : null}
                                </div>

                            </div>
                            <div className=" col-lg-4 col-md-6 col12" >
                                <div className="title">
                                    <span>{t("مهلت تسویه(روز)")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="SettlementDeadline"
                                        name="SettlementDeadline"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.SettlementDeadline}
                                        disabled
                                    />
                                    {formik.touched.SettlementDeadline && formik.errors.SettlementDeadline &&
                                        !formik.values.SettlementDeadline ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.SettlementDeadline)}
                                        </div>
                                    ) : null}
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-6 col-12"></div>
                            <div className=" col-lg-4 col-md-6 col12" >
                                <div className="title">
                                    <span>{t("سفارش دهنده")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Client"
                                        name="Client"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Client}
                                    />
                                    {formik.touched.Client && formik.errors.Client &&
                                        !formik.values.Client ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.Client)}
                                        </div>
                                    ) : null}
                                </div>

                            </div>
                            <div className=" col-lg-4 col-md-6 col12" >
                                <div className="title">
                                    <span>{t("ثبت کننده")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Registrar"
                                        name="Registrar"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Registrar}
                                        disabled
                                    />
                                    {formik.touched.Registrar && formik.errors.Registrar &&
                                        !formik.values.Registrar ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.Registrar)}
                                        </div>
                                    ) : null}
                                </div>

                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="title">
                                    <span>{t("توضیحات")}</span>
                                </div>
                                <textarea
                                    className="form-input"
                                    type="text"
                                    rows={2}
                                    id="Description"
                                    name="Description"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Description}
                                />
                                {formik.touched.Description && formik.errors.Description &&
                                    !formik.values.Description ? (
                                    <div className='error-msg'>
                                        {t(formik.errors.Description)}
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="title">
                                    <span>{t("توضیحات")}2</span>
                                </div>
                                <textarea
                                    className="form-input"
                                    type="text"
                                    rows={2}
                                    id="Description2"
                                    name="Description2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Description2}
                                />
                                {formik.touched.Description2 && formik.errors.Description2 &&
                                    !formik.values.Description2 ? (
                                    <div className='error-msg'>
                                        {t(formik.errors.Description2)}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                        <div className="title">
                            <span>‌</span>
                        </div>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={priceEdit} onChange={HandlePriceEditChange} name="price" />}
                                label={t("ویرایش قیمت‌ها")}
                            />
                            <FormControlLabel
                                control={<Switch checked={taxEdit} onChange={HandleTaxEditChange} name="tax" />}
                                label={t("ویرایش مالیات")}
                            />
                            <FormControlLabel
                                control={<Switch checked={discountEdit} onChange={HandleDiscountEditChange} name="discount" />}
                                label={t("ویرایش تخفیفات")}
                            />
                        </FormGroup>

                        <div className="col-lg-12 col-md-12 col-12">
                            <RKGrid
                                gridId={'Cheques'}
                                gridData={data}
                                columnList={tempColumn}
                                showSetting={false}
                                showChart={false}
                                showExcelExport={false}
                                showPrint={false}
                                sortable={false}
                                pageable={false}
                                reorderable={false}
                                selectable={false}
                                selectKeyField={'id'}
                            // getSelectedRows={getSelectedRows}
                            // 
                            />
                        </div>
                    </div>
                </div >
            </div >
            <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`}>
                <Button variant="contained" color="success"
                    type="button"
                    onClick={formik.handleSubmit}
                >
                    {t("ثبت تغییرات")}
                </Button>

                <div className="Issuance">
                    <Button variant="contained"
                        style={{ marginRight: "5px" }}
                        color='error'
                        onClick={cancel}>
                        {t("انصراف")}
                    </Button >
                </div>
            </div>

        </>
    )
}

export default SaleReturnDistValidateEdit
