import { React, useEffect, useRef, useState } from "react";
import RKGrid,{ IndexCell } from "rkgrid";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { julianIntToDate } from "../../utils/dateConvert";
import DateObject from "react-date-object";
import swal from "sweetalert";
import DatePicker from "react-multi-date-picker";
import { renderCalendarLocaleSwitch, renderCalendarSwitch } from "../../utils/calenderLang";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SelectBox } from "devextreme-react";
import { useSearchParams } from "react-router-dom";
import { IconQuestionMark } from '@tabler/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import routes from '../../pages/WareHouse/ApprovedInvoices/edit/routes.json'
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SpecialVisitor from '../../pages/WareHouse/ApprovedInvoices/edit/SpecialVisitor.json'
import PeriodicVisit from '../../pages/WareHouse/ApprovedInvoices/edit/PeriodicVisit.json'
import Validity from '../../pages/WareHouse/ApprovedInvoices/edit/Validity.json'
import CheckIcon from '@mui/icons-material/Check';
import FormGroup from "@mui/material/FormGroup";


const branches=[
    {name:'شعبه 1',value:false},
    {name:'شعبه 2',value:false},
    {name:'شعبه 3',value:false},
    {name:'شعبه 4',value:false},
    {name:'شعبه 5',value:false}
]

const AddAccountParty = ({ handleClose }) => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const Customers = [{ name: "افق کوروش", value: false }, { name: "خرده فروش شهر", value: false }, { name: "سوپر مارکت", value: false }, { name: "فست فود", value: false }]
    const FactorPrintArray = [t("فاکتور رسمی"), t("فاکتور غیررسمی")]
    const phoneRegMatch = /^[0-9]{1,13}$/
    const urlRegMatch = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
    const nationalIdRegMatch = /^[0-9]{10}$/
    const iranPostalCodeRegMatch = /^\b(?!(\d)\1{ Yup.string().3})[13-9]{4}[1346-9][013-9]{5}\b/
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            PreferentialCode: Math.floor(Math.random() * 1000),
            RegistrationDate: julianIntToDate(new DateObject().toJulianDay()),
            PreferentialName: "",
            PreferentialActive: true,
            Name: "",
            Surname: "",
            LegalName: "",
            PrePhoneNumber1: "",
            PrePhoneNumber2: "",
            PhoneNumber1: "",
            PhoneNumber2: "",
            Fax: "",
            PreFax: "",
            MobileNumber: "",
            Email: "",
            WebSite: "",
            PostalCode: "",
            Address: "",
            Description1: "",
            Description2: "",
            TaxCalculation: true,
            AccountParty: "",
            Area: "",
            Branches:branches,
            DeliveryTime: "",
            OwnershipType: "",
            FreightCompany: "",
            EconomicCode: "",
            RegistrationNumber: "",
            NationalID: "",
            NationalCode: "",
            SpecialVisitor: "",
            CustomerGroup: Customers,
            DefaultInvoicePrinting: "",
            AccountNumber: "",
            AccountPartyTypeSupplier: "",
            AccountPartyTypeCustomer: "",
            RowOnTheTrack: "",
            Validity: "",
            Factor: "",
            Debt: "",
            DebtPlusPreInvoice: "",
            UnsettledInvoice: "",
            UnsettledInvoiceCount: "",
            MinimumInvoice: "",
            MaximumCheckAmount: "",
            CheckMaturity: "",
            ChecksPrincipal: "",
            UncollectedChecksAmount: "",
            UncollectedChecksCount: "",
            Spot: "",
            MinimumPurchase: "",
            during: "",
            Blacklisted: false,
            BlacklistedDate: "",
            FactorNumber: "",
            reason: ""
        },
        validationSchema: Yup.object({
            Name: Yup.string().required("نام الزامی است"),
            Surname: Yup.string().required("نام خانوادگی الزامی است"),
            // CustomerGroup: Yup.string().required("انتخاب گروه مشتریان الزامی است"),
            RegistrationDate: Yup.date().required("انتخاب تاریخ الزامی است"),
            PrePhoneNumber1: Yup.number().typeError("تنها عدد مجاز است"),
            PrePhoneNumber2: Yup.number().typeError("تنها عدد مجاز است"),
            PhoneNumber1: Yup.string()
                .matches(phoneRegMatch, "شماره تلفن صحیح نیست"),
            PhoneNumber2: Yup.string()
                .matches(phoneRegMatch, "شماره تلفن صحیح نیست"),
            Fax: Yup.number().typeError("تنها عدد مجاز است"),
            PreFax: Yup.number().typeError("تنها عدد مجاز است"),
            MobileNumber: Yup.number().typeError("تنها عدد مجاز است"),
            Email: Yup.string().email(),
            WebSite: Yup.string()
                .matches(urlRegMatch, "آدرس سایت صحیح نیست"),
            NationalID: Yup.string()
                .matches(nationalIdRegMatch, "کد ملی  باید ده رقم باشد"),
            PostalCode: Yup.string()
                .length(10, "کد پستی باید 10 رقم باشد")
                .matches(iranPostalCodeRegMatch, "کد پستی صحیح نیست"),
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

    //////////////////////radio Group//////////////////
    const handleChange = (event) => {
        formik.setFieldValue("AccountParty", event.target.value);
    };
    /////////////////////accordiaon////////////////////
    const [panel1, setPanel1] = useState(true);
    const [panel2, setPanel2] = useState(true);
    const [panel3, setPanel3] = useState(false);
    const [panel4, setPanel4] = useState(false);
    const [panel5, setPanel5] = useState(false);
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
    const handlePanel5 = () => (event, newExpanded) => {
        setPanel5(newExpanded);
    };

    useEffect(() => {
        if (formik.isSubmitting) {
            let condition2 = !!(formik.touched.Name && formik.errors.Name) ||
                !!(formik.touched.Surname && formik.errors.Surname) ||
                !!(formik.touched.PhoneNumber1 && formik.errors.PhoneNumber1) ||
                !!(formik.touched.PhoneNumber2 && formik.errors.PhoneNumber2) ||
                !!(formik.touched.PreFax && formik.errors.PreFax) ||
                !!(formik.touched.PrePhoneNumber1 && formik.errors.PrePhoneNumber1) ||
                !!(formik.touched.PrePhoneNumber2 && formik.errors.PrePhoneNumber2) ||
                !!(formik.touched.Fax && formik.errors.Fax) ||
                !!(formik.touched.Email && formik.errors.Email) ||
                !!(formik.touched.WebSite && formik.errors.WebSite) ||
                !!(formik.touched.MobileNumber && formik.errors.MobileNumber);



            let condition3 = !!(formik.touched.CustomerGroup && formik.errors.CustomerGroup) ||
                !!(formik.touched.RegistrationDate && formik.errors.RegistrationDate);

            setPanel2(condition2 || panel2)
            setPanel3(condition3 || panel3)
        }
    }, [formik])

    //////////////////Grid////////////////
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = PeriodicVisit.map((data) => {
            return {
                ...data,
                CoursLength: data.CoursLength !== '' ? parseInt(data.CoursLength) : '',
            }
        })
        setData(tempData)
    }, [i18n.language]);

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,

        },
        {
            field: 'courseTitle',
            filterable: false,
            name: "عنوان دوره",
            filter: 'numeric',
        },
        {
            field: 'CoursLength',
            filterable: false,
            name: "طول دوره",
            filter: 'numeric',

        },
        {
            field: 'Sellers',
            filterable: false,
            name: "فروشندگان",
        },
    ]
    ////////////calculation///////////////

    const calculation = () => {

        let data = Validity.filter(a => a.id == formik.values.Validity)
        formik.setFieldValue("Factor", data[0].CreditOrder)
        formik.setFieldValue("Debt", data[0].CreditDebet)
        formik.setFieldValue("DebtPlusPreInvoice", data[0].CreditDebetWithPreOrders)
        formik.setFieldValue("UnsettledInvoice", data[0].UnpaidPeriod)
        formik.setFieldValue("UnsettledInvoiceCount", data[0].UnsettledOrdersCount)
        formik.setFieldValue("MinimumInvoice", data[0].MinimumOrderPrice)
        formik.setFieldValue("MaximumCheckAmount", data[0].CreditCheque)
        formik.setFieldValue("CheckMaturity", data[0].ChequePeriod)
        formik.setFieldValue("ChecksPrincipal", data[0].ChequeMeanPeriod)
        formik.setFieldValue("UncollectedChecksAmount", data[0].UncashedCheques)
        formik.setFieldValue("Spot", data[0].ConsiderUncashedChequesAsDebt)
        formik.setFieldValue("MinimumPurchase", data[0].MinBuyOverTime_BuyPrice)
        formik.setFieldValue("UncollectedChecksCount", data[0].UncashedChequesCount)
        formik.setFieldValue("during", data[0].MinBuyOverTime_Time)
    }
    useEffect(() => {

        if (formik.values.Validity === null) {
            formik.setFieldValue("Factor", "")
            formik.setFieldValue("Debt", "")
            formik.setFieldValue("DebtPlusPreInvoice", "")
            formik.setFieldValue("UnsettledInvoice", "")
            formik.setFieldValue("UnsettledInvoiceCount", "")
            formik.setFieldValue("MinimumInvoice", "")
            formik.setFieldValue("MaximumCheckAmount", "")
            formik.setFieldValue("CheckMaturity", "")
            formik.setFieldValue("ChecksPrincipal", "")
            formik.setFieldValue("UncollectedChecksAmount", "")
            formik.setFieldValue("Spot", "")
            formik.setFieldValue("MinimumPurchase", "")
            formik.setFieldValue("UncollectedChecksCount", "")
            formik.setFieldValue("during", "")
        }
    }, [formik.values.Validity])
    //////////////////////////////////////
    return (
        <>
            <div style={{ backgroundColor: "#edeff2", padding: '20px', direction: i18n.dir(), width: "100%" }}>
                <Accordion expanded={panel1} onChange={handlePanel1()}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1b-content"
                        id="panel1b-header"
                    >
                        <Typography>{t("تفضیلی")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row form-design">
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("کد تفضیلی")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="PreferentialCode"
                                        name="PreferentialCode"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.PreferentialCode}
                                        disabled
                                    />
                                    {formik.touched.PreferentialCode && formik.errors.PreferentialCode && !formik.values.PreferentialCode ?
                                        (<div className='error-msg'>{t(formik.errors.PreferentialCode)}</div>) : null}
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("نام تفضیلی")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="PreferentialName"
                                        name="PreferentialName"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.PreferentialName}
                                        disabled
                                    />
                                    {formik.touched.PreferentialName && formik.errors.PreferentialName && !formik.values.PreferentialName ?
                                        (<div className='error-msg'>{t(formik.errors.PreferentialName)}</div>) : null}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-12">
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formik.values.PreferentialActive}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    name="PreferentialActive"
                                                    color="primary"
                                                    size="small"
                                                    id="PreferentialActive"
                                                />
                                            }
                                            sx={{margin:'0'}}
                                            label={
                                                <Typography variant="h6">
                                                    {t("تفضیلی فعال است")}
                                                </Typography>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-12">
                                        <div className="title">
                                            <span>{t('شعبه ها')}</span>
                                        </div>
                                        <FormGroup>
                                            {formik.values.Branches.map((item,index)=>(
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={item.value}
                                                            onChange={(e) => {
                                                                formik.setFieldValue(`Branches[${index}].value`, e.target.checked)
                                                            }}
                                                            onBlur={formik.handleBlur}
                                                            name="Branches"
                                                            color="primary"
                                                            size="small"
                                                            id="Branches"
                                                        />
                                                    }
                                                    sx={{margin:'0'}}
                                                    label={
                                                        <Typography variant="h6">
                                                            {item.name}
                                                        </Typography>
                                                    }
                                                />
                                            ))}

                                        </FormGroup>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={panel2} onChange={handlePanel2()}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1b-content"
                        id="panel1b-header"
                    >
                        <Typography>{t("شخص")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row form-design">
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("نام")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Name"
                                        name="Name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Name}
                                    />
                                </div>
                                {formik.touched.Name && formik.errors.Name && !formik.values.Name ?
                                    (<div className='error-msg'>{t(formik.errors.Name)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("نام خانوادگی")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Surname"
                                        name="Surname"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Surname}
                                    />
                                </div>
                                {formik.touched.Surname && formik.errors.Surname && !formik.values.Surname ?
                                    (<div className='error-msg'>{t(formik.errors.Surname)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("نام حقوقی")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="LegalName"
                                        name="LegalName"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.LegalName}
                                    />
                                </div>
                                {formik.touched.LegalName && formik.errors.LegalName && !formik.values.LegalName ?
                                    (<div className='error-msg'>{t(formik.errors.LegalName)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="row">
                                    <div className=" col-lg-10 col-md-10 col-10">
                                        <div className="title">
                                            <span>{t("تلفن")} 1</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="PhoneNumber1"
                                                name="PhoneNumber1"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.PhoneNumber1}
                                            />
                                        </div>
                                        {formik.touched.PhoneNumber1 && formik.errors.PhoneNumber1 && !formik.values.PhoneNumber1 ?
                                            (<div className='error-msg'>{t(formik.errors.PhoneNumber1)}</div>) : null}
                                    </div>
                                    <div className=" col-lg-2 col-md-2 col-2">
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="PrePhoneNumber1"
                                                name="PrePhoneNumber1"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.PrePhoneNumber1}
                                            />
                                        </div>
                                        {formik.touched.PrePhoneNumber1 && formik.errors.PrePhoneNumber1 && !formik.values.PrePhoneNumber1 ?
                                            (<div
                                                className='error-msg'>{t(formik.errors.PrePhoneNumber1)}</div>) : null}
                                    </div>
                                </div>


                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="row">
                                    <div className=" col-lg-10 col-md-10 col-10">
                                        <div className="title">
                                            <span>{t("تلفن")} 2</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="PhoneNumber2"
                                                name="PhoneNumber2"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.PhoneNumber2}
                                            />
                                        </div>
                                        {formik.touched.PhoneNumber2 && formik.errors.PhoneNumber2 && !formik.values.PhoneNumber2 ?
                                            (<div className='error-msg'>{t(formik.errors.PhoneNumber2)}</div>) : null}
                                    </div>
                                    <div className=" col-lg-2 col-md-2 col-2">
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="PrePhoneNumber2"
                                                name="PrePhoneNumber2"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.PrePhoneNumber2}
                                            />
                                        </div>
                                        {formik.touched.PrePhoneNumber2 && formik.errors.PrePhoneNumber2 && !formik.values.PrePhoneNumber2 ?
                                            (<div
                                                className='error-msg'>{t(formik.errors.PrePhoneNumber2)}</div>) : null}
                                    </div>
                                </div>


                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="row">
                                    <div className=" col-lg-10 col-md-10 col-10">
                                        <div className="title">
                                            <span>{t("فکس")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="Fax"
                                                name="Fax"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.Fax}
                                            />
                                        </div>
                                        {formik.touched.Fax && formik.errors.Fax && !formik.values.Fax ?
                                            (<div className='error-msg'>{t(formik.errors.Fax)}</div>) : null}
                                    </div>
                                    <div className=" col-lg-2 col-md-2 col-2">
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="PreFax"
                                                name="PreFax"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.PreFax}
                                            />
                                        </div>
                                        {formik.touched.PreFax && formik.errors.PreFax && !formik.values.PreFax ?
                                            (<div className='error-msg'>{t(formik.errors.PreFax)}</div>) : null}
                                    </div>
                                </div>


                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("موبایل")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="MobileNumber"
                                        name="MobileNumber"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.MobileNumber}
                                    />
                                </div>
                                {formik.touched.MobileNumber && formik.errors.MobileNumber && !formik.values.MobileNumber ?
                                    (<div className='error-msg'>{t(formik.errors.MobileNumber)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("پست الکترونیک")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Email"
                                        name="Email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Email}
                                    />
                                </div>
                                {formik.touched.Email && formik.errors.Email && !formik.values.Email ?
                                    (<div className='error-msg'>{t(formik.errors.Email)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("وبسایت")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="WebSite"
                                        name="WebSite"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.WebSite}
                                    />
                                </div>
                                {formik.touched.WebSite && formik.errors.WebSite && !formik.values.WebSite ?
                                    (<div className='error-msg'>{t(formik.errors.WebSite)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("کد پستی")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="PostalCode"
                                        name="PostalCode"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.PostalCode}
                                    />
                                </div>
                                {formik.touched.PostalCode && formik.errors.PostalCode && !formik.values.PostalCode ?
                                    (<div className='error-msg'>{t(formik.errors.PostalCode)}</div>) : null}
                            </div>
                            <div className=" col-lg-8 col-md-12 col-12">
                                <div className="title">
                                    <span>{t("آدرس")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Address"
                                        name="Address"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Address}
                                    />
                                </div>
                                {formik.touched.Address && formik.errors.Address && !formik.values.Address ?
                                    (<div className='error-msg'>{t(formik.errors.Address)}</div>) : null}
                            </div>
                            <div className=" col-lg-12 col-md-12 col-12">
                                <div className="title">
                                    <span>{t("توضیحات")}</span>
                                </div>
                                <div className="wrapper">
                                    <textarea
                                        className="form-input"
                                        type="text"
                                        rows={2}
                                        id="Description1"
                                        name="Description1Description1"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Description1}
                                    />
                                </div>
                                {formik.touched.Description1 && formik.errors.Description1 && !formik.values.Description1 ?
                                    (<div className='error-msg'>{t(formik.errors.Description1)}</div>) : null}
                            </div>
                            <div className=" col-lg-6 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("توضیحات")}2</span>
                                </div>
                                <div className="wrapper">
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
                                </div>
                                {formik.touched.Description2 && formik.errors.Description2 && !formik.values.Description2 ?
                                    (<div className='error-msg'>{t(formik.errors.Description2)}</div>) : null}
                            </div>
                            <div className=" col-lg-6 col-md-6 col-12">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-12">
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="TaxCalculation"
                                                    name="TaxCalculation"
                                                    color="primary"
                                                    size="small"
                                                    checked={formik.values.TaxCalculation}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}

                                                />
                                            }
                                            sx={{margin:'0'}}
                                            label={
                                                <Typography variant="h6">
                                                    {t("محاسبه مالیات ا.ا.")}
                                                </Typography>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={panel3} onChange={handlePanel3()}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1b-content"
                        id="panel1b-header"
                    >
                        <Typography>{t("طرف حساب")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row form-design">

                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("طرف حساب")}</span>
                                </div>
                                <div>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={formik.values.AccountParty}
                                        onChange={handleChange}
                                        row
                                    >
                                        <FormControlLabel value="real" control={<Radio/>} label={t("حقیقی")}/>
                                        <FormControlLabel value="legal" control={<Radio/>} label={t("حقوقی")}/>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12 "
                                 onFocus={() => dateRef?.current?.closeCalendar()}>
                                <div className="title">
                                    <span>{t("منطقه/مسیر")}</span>
                                </div>
                                <div>
                                    <SelectBox
                                        dataSource={routes}
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
                                            formik.setFieldValue('Area', e.value)
                                        }}
                                    />

                                    {formik.touched.Area && formik.errors.Area &&
                                    !formik.values.Area ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.Area)}
                                        </div>
                                    ) : null}

                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12  ">

                                <div className="title">
                                    <span>{t("تاریخ ثبت")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper date-picker position-relative">
                                    <DatePicker
                                        ref={dateRef}
                                        name={"RegistrationDate"}
                                        id={"RegistrationDate"}
                                        calendarPosition="bottom-right"
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        onBlur={formik.handleBlur}
                                        onChange={(val) => {
                                            formik.setFieldValue("RegistrationDate", julianIntToDate(val.toJulianDay()));
                                        }}
                                        value={date}
                                    />
                                    <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton'/>
                                        </div>
                                    </div>
                                    {formik.touched.RegistrationDate && formik.errors.RegistrationDate &&
                                    !formik.values.RegistrationDate ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.RegistrationDate)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12 "
                                 onFocus={() => dateRef?.current?.closeCalendar()}>
                                <div className="title">
                                    <span>{t("ساعت تحویل")}</span>
                                </div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        ampm={false}
                                        className='time-picker'
                                        views={['hours', 'minutes']}
                                        inputFormat="HH:mm"
                                        mask="__:__"
                                        value={formik.values.DeliveryTime}
                                        onChange={(newValue) => {
                                            formik.setFieldValue("DeliveryTime", newValue)
                                            // setTimeValueSet(true)
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("نوع مالکیت")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="OwnershipType"
                                        name="OwnershipType"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.OwnershipType}
                                    />
                                </div>
                                {formik.touched.OwnershipType && formik.errors.OwnershipType && !formik.values.OwnershipType ?
                                    (<div className='error-msg'>{t(formik.errors.OwnershipType)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("بنگاه باربری")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="FreightCompany"
                                        name="FreightCompany"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.FreightCompany}
                                    />
                                </div>
                                {formik.touched.FreightCompany && formik.errors.FreightCompany && !formik.values.FreightCompany ?
                                    (<div className='error-msg'>{t(formik.errors.FreightCompany)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("کد اقتصادی")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="EconomicCode"
                                        name="EconomicCode"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.EconomicCode}
                                    />
                                </div>
                                {formik.touched.EconomicCode && formik.errors.EconomicCode && !formik.values.EconomicCode ?
                                    (<div className='error-msg'>{t(formik.errors.EconomicCode)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("شماره ثبت")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="RegistrationNumber"
                                        name="RegistrationNumber"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.RegistrationNumber}
                                    />
                                </div>
                                {formik.touched.RegistrationNumber && formik.errors.RegistrationNumber && !formik.values.RegistrationNumber ?
                                    (<div className='error-msg'>{t(formik.errors.RegistrationNumber)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-12 col-12">
                                <div className="title">
                                    <span>{t("شناسه ملی")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="NationalID"
                                        name="NationalID"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.NationalID}
                                    />
                                </div>
                                {formik.touched.NationalID && formik.errors.NationalID && !formik.values.NationalID ?
                                    (<div className='error-msg'>{t(formik.errors.NationalID)}</div>) : null}
                            </div>
                            <div className="col-lg-8 col-md-12 col-12">
                                <div className="row">
                                    <div className=" col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("کد ملی")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="NationalCode"
                                                name="NationalCode"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.NationalCode}
                                            />
                                        </div>
                                        {formik.touched.NationalCode && formik.errors.NationalCode && !formik.values.NationalCode ?
                                            (<div className='error-msg'>{t(formik.errors.NationalCode)}</div>) : null}
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("ویزیتور خاص")}</span>
                                        </div>
                                        <div>
                                            <SelectBox
                                                dataSource={SpecialVisitor}
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
                                                    formik.setFieldValue('SpecialVisitor', e.value)
                                                }}
                                            />

                                            {formik.touched.SpecialVisitor && formik.errors.SpecialVisitor &&
                                            !formik.values.SpecialVisitor ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.SpecialVisitor)}
                                                </div>
                                            ) : null}

                                        </div>
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("چاپ فاکتور پیشفرض")}</span>
                                        </div>
                                        <div>
                                            <SelectBox
                                                dataSource={FactorPrintArray}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                className='selectBox'
                                                searchEnabled={true}
                                                placeholder=''
                                                showClearButton
                                                noDataText={t("اطلاعات یافت نشد")}
                                                onValueChanged={(e) => {
                                                    formik.setFieldValue('DefaultInvoicePrinting', e.value)
                                                }}
                                            />

                                            {formik.touched.DefaultInvoicePrinting && formik.errors.DefaultInvoicePrinting &&
                                            !formik.values.DefaultInvoicePrinting ? (
                                                <div className='error-msg'>
                                                    {t(formik.errors.DefaultInvoicePrinting)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("حساب بانکی")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <input
                                                className="form-input"
                                                type="text"
                                                id="AccountNumber"
                                                name="AccountNumber"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.AccountNumber}
                                            />
                                        </div>
                                        {formik.touched.AccountNumber && formik.errors.AccountNumber && !formik.values.AccountNumber ?
                                            (<div className='error-msg'>{t(formik.errors.AccountNumber)}</div>) : null}
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12">
                                        <div className="row">
                                            <div className=" col-lg-3 col-md-3 col-3">
                                                <div className="title">
                                                    <span>{t("نوع طرف حساب")}</span>
                                                </div>
                                            </div>
                                            <div className=" col-lg-9 col-md-9 col-9 ">
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id="AccountPartyTypeSupplier"
                                                                name="AccountPartyTypeSupplier"
                                                                color="primary"
                                                                size="small"
                                                                checked={formik.values.AccountPartyTypeSupplier}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}

                                                            />
                                                        }
                                                        sx={{margin:'0'}}
                                                        label={
                                                            <Typography variant="h6">
                                                                {t("تأمین کننده")}
                                                            </Typography>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id="AccountPartyTypeCustomer"
                                                                name="AccountPartyTypeCustomer"
                                                                color="primary"
                                                                size="small"
                                                                checked={formik.values.AccountPartyTypeCustomer}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}

                                                            />
                                                        }
                                                        sx={{margin:'0'}}
                                                        label={
                                                            <Typography variant="h6">
                                                                {t("مشتری")}
                                                            </Typography>
                                                        }
                                                    />

                                                </FormGroup>

                                            </div>
                                        </div>
                                    </div>
                                    <div className=" col-lg-6 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("ردیف در مسیر")}</span>
                                        </div>
                                        <input
                                            className="form-input"
                                            type="text"
                                            id="RowOnTheTrack"
                                            name="RowOnTheTrack"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.RowOnTheTrack}
                                        />
                                        {formik.touched.RowOnTheTrack && formik.errors.RowOnTheTrack && !formik.values.RowOnTheTrack ?
                                            (<div className='error-msg'>{t(formik.errors.RowOnTheTrack)}</div>) : null}
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <RKGrid
                                            gridId={'Periodic_Visit'}
                                            gridData={data}
                                            columnList={tempColumn}
                                            showSetting={false}
                                            showChart={false}
                                            showExcelExport={false}
                                            showPrint={false}
                                            excelFileName={t("پیش فاکتورهای تایید شده")}
                                            sortable={false}
                                            pageable={false}
                                            reorderable={false}
                                            selectable={true}
                                            selectKeyField={'id'}
                                            // getSelectedRows={getSelectedRows}
                                            // 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="row">
                                    <div className=" col-lg-3 col-md-3 col-3">
                                        <div className="title">
                                            <span>{t("گروه مشتریان")}</span>
                                            <Tooltip title={t("لطفا یکی از گروه های مشتریان را انتخاب نمایید")}>
                                                <Button variant="contained" color='error' className='kendo-action-btn'
                                                        style={{width: "25px", height: "25px", margin: "10px"}}>
                                                    <IconQuestionMark/>
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className=" col-lg-9 col-md-9 col-9 ">
                                        <FormGroup>
                                            {formik.values.CustomerGroup.map((a, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    control={
                                                        <Checkbox
                                                            id="CustomerGroup"
                                                            name="CustomerGroup"
                                                            color="primary"
                                                            size="small"
                                                            checked={formik.values.CustomerGroup[index].value}
                                                            onChange={(e) => {
                                                                formik.setFieldValue(`CustomerGroup[${index}].value`, e.target.checked)
                                                            }}
                                                        />
                                                    }
                                                    sx={{margin:'0'}}
                                                    label={
                                                        <Typography variant="h6">
                                                            {a.name}
                                                        </Typography>
                                                    }
                                                />

                                            ))}
                                        </FormGroup>
                                        {formik.touched.CustomerGroup && formik.errors.CustomerGroup && !formik.values.CustomerGroup ?
                                            (<div className='error-msg'>{t(formik.errors.CustomerGroup)}</div>) : null}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={panel4} onChange={handlePanel4()}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1b-content"
                        id="panel1b-header"
                    >
                        <Typography>{t("میزان اعتبار")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row form-design">
                            <div className="col-lg-6 col-md-6 col-12">
                                <div className="row align-content-center align-items-center">
                                    <div className="col-lg-10 col-md-10 col-12">
                                        <div className="title">
                                            <span>{t("اعتبار")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <SelectBox
                                                    dataSource={Validity}
                                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                    className='selectBox'
                                                    valueExpr="id"
                                                    searchEnabled={true}
                                                    placeholder=""
                                                    showClearButton
                                                    noDataText={t("اطلاعات یافت نشد")}
                                                    displayExpr={function (item) {
                                                        return item && item.name;
                                                    }}
                                                    displayValue='name'
                                                    onValueChanged={(e) => {
                                                        formik.setFieldValue('Validity', e.value)

                                                    }}
                                                />

                                                {formik.touched.Validity && formik.errors.Validity &&
                                                !formik.values.Validity ? (
                                                    <div className='error-msg'>
                                                        {t(formik.errors.City)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-2 col-2" style={{paddingTop: "20px"}}>
                                        <IconButton variant="contained" color='success' className='kendo-action-btn'
                                                    onClick={() => calculation()}>
                                            <CheckIcon/>
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12"></div>

                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("فاکتور")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Factor"
                                        name="Factor"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Factor}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("بدهی")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="Debt"
                                        name="Debt"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Debt}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("بدهی + پیش فاکتور")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="DebtPlusPreInvoice"
                                        name="DebtPlusPreInvoice"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.DebtPlusPreInvoice}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("فاکتور تسویه نشده")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="UnsettledInvoice"
                                        name="UnsettledInvoice"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.UnsettledInvoice}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("تعداد فاکتور تسویه نشده")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="UnsettledInvoiceCount"
                                        name="UnsettledInvoiceCount"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.UnsettledInvoiceCount}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("حداقل فاکتور")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="MinimumInvoice"
                                        name="MinimumInvoice"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.MinimumInvoice}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("حداکثر مبلغ چک")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="MaximumCheckAmount"
                                        name="MaximumCheckAmount"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.MaximumCheckAmount}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("سررسید چک")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="CheckMaturity"
                                        name="CheckMaturity"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.CheckMaturity}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("رأس کل چک ها")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="ChecksPrincipal"
                                        name="ChecksPrincipal"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.ChecksPrincipal}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("مبلغ چک های وصول نشده")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="UncollectedChecksAmount"
                                        name="UncollectedChecksAmount"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.UncollectedChecksAmount}
                                    />
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-12">
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="Spot"
                                                    name="Spot"
                                                    color="primary"
                                                    size="small"
                                                    checked={formik.values.Spot}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}

                                                />
                                            }
                                            sx={{margin:'0'}}
                                            label={
                                                <Typography variant="h6">
                                                    {t("در نظر گرفتن چک های وصول نشده به عنوان بدهی")}
                                                </Typography>
                                            }
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("حداقل خرید")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="MinimumPurchase"
                                        name="MinimumPurchase"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.MinimumPurchase}
                                    />
                                </div>
                                {formik.touched.MinimumPurchase && formik.errors.MinimumPurchase && !formik.values.MinimumPurchase ?
                                    (<div className='error-msg'>{t(formik.errors.MinimumPurchase)}</div>) : null}
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("تعداد چک های وصول نشده")}</span>
                                </div>
                                <div className="wrapper">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="UncollectedChecksCount"
                                        name="UncollectedChecksCount"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.UncollectedChecksCount}
                                    />
                                </div>
                                {formik.touched.UncollectedChecksCount && formik.errors.UncollectedChecksCount && !formik.values.UncollectedChecksCount ?
                                    (<div className='error-msg'>{t(formik.errors.UncollectedChecksCount)}</div>) : null}
                            </div>
                            <div className="col-lg-4 col-md-6 col-12"></div>
                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="title">
                                    <span>{t("طی")}</span>
                                </div>
                                <input
                                    className="form-input"
                                    type="text"
                                    id="during"
                                    name="during"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.during}
                                />

                                {formik.touched.during && formik.errors.during && !formik.values.during ?
                                    (<div className='error-msg'>{t(formik.errors.during)}</div>) : null}
                            </div>

                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={panel5} onChange={handlePanel5()}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1b-content"
                        id="panel1b-header"
                    >
                        <Typography>{t("لیست سیاه")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row form-design">

                            <div className=" col-lg-4 col-md-6 col-12">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-12 " onFocus={() => dateRef?.current?.closeCalendar()}>
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="Blacklisted"
                                                    name="Blacklisted"
                                                    color="primary"
                                                    size="small"
                                                    checked={formik.values.Blacklisted}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}

                                                />
                                            }
                                            sx={{margin:'0'}}
                                            label={
                                                <Typography variant="h6">
                                                    {t("ثبت در لیست سیاه")}
                                                </Typography>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-12  ">
                                <div className="title">
                                    <span>{t("تاریخ")}<span className="star">*</span></span>
                                </div>
                                <div className="wrapper date-picker position-relative">
                                    <DatePicker
                                        ref={dateRef}
                                        name={"BlacklistedDate"}
                                        id={"BlacklistedDate"}
                                        calendarPosition="bottom-right"
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        onBlur={formik.handleBlur}
                                        onChange={(val) => {
                                            formik.setFieldValue("BlacklistedDate", julianIntToDate(val.toJulianDay()));
                                        }}
                                        value={date}
                                        disabled={formik.values.Blacklisted == true ? false : true}
                                    />
                                    <div className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton'/>
                                        </div>
                                    </div>
                                    {formik.touched.BlacklistedDate && formik.errors.BlacklistedDate &&
                                    !formik.values.BlacklistedDate ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.BlacklistedDate)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-12" onFocus={() => dateRef?.current?.closeCalendar()}>
                                <div className="title">
                                    <span>{t("شماره فاکتور")}</span>
                                </div>
                                <div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="FactorNumber"
                                        name="FactorNumber"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.FactorNumber}
                                        disabled={formik.values.Blacklisted == true ? false : true}

                                    />
                                    {formik.touched.FactorNumber && formik.errors.FactorNumber &&
                                    !formik.values.FactorNumber ? (
                                        <div className='error-msg'>
                                            {t(formik.errors.FactorNumber)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="title"><span>{t("دلیل")}</span></div>
                                <textarea
                                    className="form-input"
                                    type="text"
                                    rows={2}
                                    id="reason"
                                    name="reason"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.reason}
                                    disabled={formik.values.Blacklisted == true ? false : true}
                                />
                            </div>

                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className={`button-pos`} style={{ direction: i18n.dir() }}>
                <Button variant="contained" color="success"
                    type="submit"
                    onClick={() => {
                        formik.handleSubmit()
                        if (formik.errors.length <= 0) { handleClose() }
                    }}
                >
                    {t("ثبت تغییرات")}
                </Button>

                <div className="Issuance">
                    <Button variant="contained"
                        style={{ marginRight: "5px" }}
                        color='error'
                        onClick={handleClose}>
                        {t("انصراف")}
                    </Button >
                </div>
            </div>
        </>


    )
}
export default AddAccountParty