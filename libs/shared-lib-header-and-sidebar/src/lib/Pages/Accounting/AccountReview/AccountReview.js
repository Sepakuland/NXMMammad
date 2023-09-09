import React, { useEffect, useRef, useState } from "react";
import { useTheme, IconButton, FormControl, Input, MenuItem, ListItemText, Select, Checkbox, Typography, FormControlLabel, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./AccountReviewStyle.css";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useFormik } from "formik";
import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-multi-date-picker";
import { julianIntToDate } from "../../../utils/dateConvert";
import { renderCalendarLocaleSwitch } from "../../../utils/calenderLang";
import { renderCalendarSwitch } from '../../../utils/calenderLang'
import DateObject from "react-date-object";
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from "react-router-dom";
import AccountingReview_Level1 from "./levels/level1/AccountingReview_Level1";
import AccountingReview_Level2 from "./levels/level2/AccountingReview_Level2";
import AccountingReview_Level3 from "./levels/level3/AccountingReview_Level3";
import AccountingReview_Level8 from "./levels/level8/AccountingReview_Level8";
import AccountingReview_Level9 from "./levels/level9/AccountingReview_Level9";
import AccountingReview_Level4 from "./levels/level4/AccountingReview_Level4";
import AccountingReview_Level5 from "./levels/level5/AccountingReview_Level5";
import AccountingReview_Level6 from "./levels/level6/AccountingReview_Level6";
import AccountingReview_Level12 from "./levels/level12/AccountingReview_Level12";
import AccountingReview_Level11 from "./levels/level11/AccountingReview_Level11";
import AccountingReview_Level10 from "./levels/level10/AccountingReview_Level10";
import AccountingReview_Level7 from "./levels/level7/AccountingReview_Level7";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useFetchBranchesQuery } from "../../../features/slices/branchSlice";
import { useGetAllFiscalYearQuery } from "../../../features/slices/FiscalYearSlice";
import { useSelector } from "react-redux";
import AccountCirculation from "./AccountCirculation/AccountCirculation";
import { SelectBox } from "devextreme-react";
import { useGetDetailedAccount_DetailedTypeIdQuery } from "../../../features/slices/accountingDocumentSlice";
import ReviewDocument from "./ReviewDocument/ReviewDocument";

const AccountReview = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [index, setIndex] = useState(0)
    const [indexOfState, setIndexOfState] = useState(0)
    const params = new URLSearchParams(location)
    const obj = Object.fromEntries(params)
    const dataRef = useRef()
    // const [date, setDate] = useState(new DateObject())

    const [state, setState] = useState([{ state: "", name: "", id: 0, level: 1 }]);
    const [tempIndex, setTempIndex] = useState([{
        level: 1,
        type: 'R',
        title: "گروه",
        id: 0,
        AccountReview: [],
        stateOfTable: "مرور حساب",
        stateTitle: ""
    }])
    const indexRef = useRef()
    indexRef.current = index
    const indexOfStateRef = useRef()
    indexOfStateRef.current = indexOfState
    const [querySearchParams, setQuerySearchParams] = useState("")
    const formik = useFormik({
        initialValues: {
            DocumentDate: [null, null],
            BranchId: [],
            DocumentState: [0]
        },
        onSubmit: (values) => {
            setQuerySearchParams(CreateQueryString(values))
        },
    });
    const dateRef2 = useRef()
    /* -------------------------------------------------------------------------- */
    /*                               Get fiscal year                              */
    /* -------------------------------------------------------------------------- */
    const { data: fiscalYearResult, isFetching: fiscalYearIsFetching, error: fiscalYearError,
    } = useGetAllFiscalYearQuery(obj);
    const [dateData, setDateData] = useState([])
    const [dateContent, setDateContent] = useState([])
    useEffect(() => {
        if (fiscalYearIsFetching) {
            setDateContent(<CircularProgress />)
        } else if (fiscalYearError) {
            setDateContent(t("خطایی رخ داده است"))
        } else {
            setDateContent("")
            let tempData = fiscalYearResult.map((data) => {
                return {
                    ...data,
                    "FiscalYearName": data.fiscalYearName,
                    "StartDate": new Date(data.startDate),
                    "EndDate": new Date(data.endDate),
                    "Description": data.description
                }
            })
            setDateData(tempData)
            dataRef.current = tempData
        }
    }, [fiscalYearIsFetching, fiscalYearResult])
    const dateId = useSelector((state) => state?.reducer?.fiscalYear?.fiscalYearId);
    const [startDate, setStartDate] = useState();
    useEffect(() => {
        if (!!dateData?.length) {
            var temp = dateData?.filter(a => a.fiscalYearId === dateId)
            setStartDate(temp[0]?.startDate)
        }
    }, [dateId, dateData])
    /* -------------------------------------------------------------------------- */
    /*                                Get Branches                                */
    /* -------------------------------------------------------------------------- */
    const [branches, setBranches] = useState([]);
    const { data: branchList, isFetching: branchlistIsFetching, error: branchListError } = useFetchBranchesQuery()
    useEffect(() => {
        if (!branchlistIsFetching && !branchListError) {
            let displayNames = branchList.map((item) => {
                return {
                    ...item,
                    displayName: item.branchCode + " - " + item.branchName
                }
            })
            setBranches(displayNames)
        }
    }, [branchlistIsFetching, branchList])
    /* -------------------------------------------------------------------------- */
    /*                      Functions to manage table's data                      */
    /* -------------------------------------------------------------------------- */
    const [cancel, setCancel] = useState(false)
    const [selectedId, setSelectedId] = useState()
    const [selectedAccountingReview, setSelectedAccountingReview] = useState([]);
    const GetSelectedId = (id) => {

        setSelectedId(id)
    }
    const GetAccountingReview = (list) => {
        console.log("list----------------", list)
        setSelectedAccountingReview(list)
        if (!!selectedAccountingReview[0]?.AccountCodeEntity5 || !!selectedAccountingReview[0]?.AccountCodeEntity6) {
            localStorage.setItem(`selectedAccountingReview`, list);
        }
    }
    const GetStatusCirculation = (data) => {

        setIndexOfState(indexOfStateRef.current + 1)
        setState((x) => [...x, data]);
    }
    const GetStatusDocument = (data) => {
        setIndexOfState(indexOfStateRef.current + 1)
        setState((x) => [...x, data]);
    }
    useEffect(() => {
        if (state[indexOfStateRef.current]?.state === "گردش حساب") {
            addNewRoute(state[indexOfStateRef.current]?.level, 'C', tempIndex[indexRef.current]?.title, state[indexOfStateRef.current]?.id, tempIndex[indexRef.current]?.AccountReview, state[indexOfStateRef.current]?.state)
        }
        if (state[indexOfStateRef.current]?.state === "گردش اسناد") {
            addNewRoute(tempIndex[indexRef.current]?.level, 'D', tempIndex[indexRef.current]?.title, state[indexOfStateRef.current]?.DocumentCode, tempIndex[indexRef.current]?.AccountReview, state[indexOfStateRef.current]?.state)
        }
    }, [state])
    /* -------------------------------------------------------------------------- */
    /*                              get title states                              */
    /* -------------------------------------------------------------------------- */
    const getStateTitle = (index) => {
        let level = tempIndex[indexRef.current]?.level
        if (index <= 6) {
            return ""
        } else {
            if (level == 1 || level == 7) {
                return selectedAccountingReview[selectedAccountingReview.length - 1].AccountNameGroup
            }
            else if (level == 2 || level == 8) {
                return selectedAccountingReview[selectedAccountingReview.length - 1].AccountNameTotal
            }
            else if (level == 3 || level == 9) {
                return selectedAccountingReview[selectedAccountingReview.length - 1].AccountNameSpecific
            }
            else if (level == 4 || level == 10) {
                return selectedAccountingReview[selectedAccountingReview.length - 1].AccountNameEntity4
            }
            else if (level == 5 || level == 11) {
                return selectedAccountingReview[selectedAccountingReview.length - 1].AccountNameEntity5
            }
            else if (level == 6 || level == 12) {
                return selectedAccountingReview[selectedAccountingReview.length - 1].AccountNameEntity6
            }
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                            set back and frw btn                            */
    /* -------------------------------------------------------------------------- */
    const moveForward = () => {
        if (indexRef.current < tempIndex.length - 1) {
            setIndex(indexRef.current + 1)
        }
    }
    const [Back, setBack] = useState(0)
    const moveBackward = () => {
        if (indexRef.current !== 0) {
            setBack(Back + 1)
            setIndex(indexRef.current - 1)
        }
    }
    const addNewRoute = (level, type, title, stateTitle, id, AccountReview, stateOfTable) => {
        if (type === 'C') {
            setTempIndex(t => [...t.slice(0, indexRef.current + 1), { level: level, type: type, title: title, id: state[indexOfStateRef.current]?.id, AccountReview: '', stateOfTable: state[indexOfStateRef.current], stateTitle: getStateTitle(level) }])
            setIndex(indexRef.current + 1)
        }
        else {
            if (Back > 0) {
                setTempIndex(t => [...t.slice(0, indexRef.current + Back + 1), { level: level, type: type, title: title, id: selectedId, AccountReview: selectedAccountingReview, stateOfTable: '', stateTitle: getStateTitle(level) }])
                setIndex(indexRef.current + Back + 1)
                setBack(0)


            } else {
                if (type === 'D') {
                    setTempIndex(t => [...t.slice(0, indexRef.current + 1), { level: level, type: type, title: title, id: state[indexOfStateRef.current]?.DocumentCode, AccountReview: "", stateOfTable: state[indexOfStateRef.current], stateTitle: getStateTitle(level) }])
                    setIndex(indexRef.current + 1)
                }
                else {
                    setTempIndex(t => [...t.slice(0, indexRef.current + 1), { level: level, type: type, title: title, id: selectedId, AccountReview: selectedAccountingReview, stateOfTable: '', stateTitle: getStateTitle(level) }])
                    setIndex(indexRef.current + 1)
                }
            }
        }
    }
    const returnTitleOFAccountingReview = () => {
        let index2 = indexRef.current - 1
        while (!(tempIndex[index2]?.level > 0 && tempIndex[index2]?.level <= 6)) {
            if (index2 > 0) {
                index2--;
            } else {
                break
            }
        }
        return tempIndex[index2]?.title
    }
    const handleChange = (event) => {
        formik.setFieldValue('BranchId', event.target.value);
    };
    useEffect(() => {
        setQuerySearchParams([])
        localStorage.setItem(`tempIndex`, JSON.stringify(tempIndex));
        localStorage.setItem(`indexRef`, JSON.stringify(indexRef.current));
        localStorage.setItem(`querySearchParams`, JSON.stringify(querySearchParams));



    }, [tempIndex])

    const resetSearch = () => {
        setCancel(true)
        if (tempIndex[indexRef.current]?.type === 'R') {
            formik.setFieldValue(`DocumentDate`, [null, null]);
            formik.setFieldValue("BranchId", [])
            formik.setFieldValue("DocumentState", [0])
        }
        else if (tempIndex[indexRef.current]?.type === 'C') {

            setDetailedAccountSkip(false)
            AccountCirculationformik.setFieldValue(`DocumentDate`, [null, null]);
            AccountCirculationformik.setFieldValue(`detailedType`, []);
            AccountCirculationformik.setFieldValue(`detailedAccountId`, 0);
            AccountCirculationformik.setFieldValue(`DocumentDesc`, false);
            AccountCirculationformik.setFieldValue(`ArticleDesc`, false);
            AccountCirculationformik.setFieldValue(`DocumentState`, [0]);
        }
        setQuerySearchParams("")
        setAccountCirculationQuerySearchParams("")
    }
    /* -------------------------------------------------------------------------- */
    /*                         Get Accounting Circulation                         */
    /* -------------------------------------------------------------------------- */
    /* -- get detailed type and get detailed account with using detailed types -- */
    const [selectedOptions, setSelectedOptions] = useState(0);
    const [detailedAccountSkip, setDetailedAccountSkip] = useState(true)

    const detailedTypes = [
        { title: "تفضیلی4", id: 1, checked: false },
        { title: "تفضیلی5", id: 2, checked: false },
        { title: "تفضیلی6", id: 3, checked: false },
    ];
    const { data: accountingDocumentResult } =
        useGetDetailedAccount_DetailedTypeIdQuery(selectedOptions, { skip: detailedAccountSkip });
    const AccountCirculationformik = useFormik({
        initialValues: {
            DocumentDate: [null, null],
            detailedType: [],
            detailedAccountId: 0,
            DocumentState: [0]
        },
        onSubmit: (values) => {
            setAccountCirculationQuerySearchParams(CreateQueryString(values))
        },
    });
    const detailedTypeHandleChange = (event) => {
        AccountCirculationformik.setFieldValue('detailedType', event.target.value);

        let temp;
        if (event.target.value?.length == 1) {
            if (event.target.value[0] == 1) {
                temp = 1;
            } else if (event.target.value[0] == 2) {
                temp = 2;
            } else if (event.target.value[0] == 3) {
                temp = 3;
            }
        } else if (event.target.value?.length == 2) {
            if (
                (event.target.value[0] == 1 && event.target.value[1] == 2) ||
                (event.target.value[0] == 2 && event.target.value[1] == 1)
            ) {

                temp = 4;
            } else if (
                (event.target.value[0] == 1 && event.target.value[1] == 3) ||
                (event.target.value[0] == 3 && event.target.value[1] == 1)
            ) {
                temp = 5;
            } else if (
                (event.target.value[0] == 2 && event.target.value[1] == 3) ||
                (event.target.value[0] == 3 && event.target.value[1] == 2)
            ) {
                temp = 6;
            }
        } else if (event.target.value?.length == 3) {
            temp = 7;
        } else {
            temp = 0;
            console.log("داااااااااااااری چییییییییییییییییی کار میکنننننننننننننننی!!!!!!!!!!");
        }
        setSelectedOptions(temp);
    };
    const [accountCirculationQuerySearchParams, setAccountCirculationQuerySearchParams] = useState("");
    useEffect(() => {
        localStorage.setItem(`accountCirculationQuerySearchParams`, JSON.stringify(accountCirculationQuerySearchParams));
    }, [accountCirculationQuerySearchParams])
    useEffect(() => {
        if (tempIndex[indexRef.current]?.type == 'C') {
            setDetailedAccountSkip(false)
        }
        if (tempIndex[indexRef.current - 1]?.type !== tempIndex[indexRef.current]?.type) {

            resetSearch()
        }
    }, [tempIndex[indexRef.current]?.type])
    /* ----------------- Date for show in document review header ---------------- */
    const [documentReviewDate, setDocumentReviewDate] = useState();
    useEffect(() => {
        if (tempIndex[indexRef.current]?.type === 'D') {
            setDocumentReviewDate(tempIndex[indexRef.current]?.stateOfTable?.Date)
        }
    }, [tempIndex])

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }}>
                <div className="row">
                    {tempIndex[indexRef.current]?.type === 'R' ?
                        <form onSubmit={formik.handleSubmit}>

                            <div className="form-design" style={{ padding: "0" }}>
                                <div className="row ">
                                    <div className="content col-lg-3 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("از تاریخ")}</span>
                                        </div>
                                        <div className="wrapper date-picker position-relative">
                                            <DatePicker
                                                name={"startDate"}
                                                id={"startDate"}

                                                editable={false}
                                                value={formik?.values?.DocumentDate[0]}
                                                calendar={renderCalendarSwitch(i18n.language)}

                                                locale={renderCalendarLocaleSwitch(i18n.language)}
                                                onBlur={formik.handleBlur}
                                                onChange={(val) => {
                                                    // setDate(val)
                                                    formik.setFieldValue(
                                                        `DocumentDate[0]`,
                                                        julianIntToDate(val.toJulianDay())
                                                    );
                                                }}
                                            />
                                            <div
                                                className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <CalendarMonthIcon className='calendarButton' /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content col-lg-3 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("تا")}</span>
                                        </div>
                                        <div className="wrapper date-picker position-relative">
                                            <DatePicker
                                                name={"endDate"}
                                                id={"endDate"}

                                                editable={false}
                                                value={formik?.values?.DocumentDate[1]}
                                                calendar={renderCalendarSwitch(i18n.language)}
                                                disabled={!formik.values.DocumentDate[0]}
                                                minDate={new Date(formik.values.DocumentDate[0])}
                                                locale={renderCalendarLocaleSwitch(i18n.language)}
                                                onBlur={formik.handleBlur}
                                                onChange={(val) => {
                                                    // setDate2(val)
                                                    formik.setFieldValue(
                                                        "DocumentDate[1]",
                                                        julianIntToDate(val.toJulianDay())
                                                    );
                                                }}
                                            />
                                            <div
                                                className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <CalendarMonthIcon className='calendarButton' /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div onFocus={() => {
                                        dateRef2?.current?.closeCalendar();
                                    }} className="content col-lg-3 col-md-6 col-12">
                                        <div className="title">
                                            <span>{t("شعب")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <FormControl className={'form-input p-0'} sx={{ direction: i18n.dir(), width: '100%' }}>
                                                <Select
                                                    labelId="demo-mutiple-checkbox-label"
                                                    id="demo-mutiple-checkbox"
                                                    className={i18n.dir() === 'rtl' ? 'rtl-select' : ''}
                                                    multiple
                                                    value={formik.values?.BranchId}
                                                    onChange={handleChange}
                                                    input={<Input />}
                                                    renderValue={(selected) => {
                                                        let temp = []
                                                        selected.forEach((item) => {
                                                            let obj = branches?.find(f => f.branchId === item)
                                                            temp.push(obj?.displayName)
                                                        })
                                                        return temp.join(', ')
                                                    }}
                                                    sx={{ direction: i18n.dir(), width: '100%', "&:before": { display: 'none' }, "&:after": { display: 'none' } }}
                                                >
                                                    {branches.map((item) => (

                                                        <MenuItem key={item?.branchId} value={item?.branchId} sx={{ direction: i18n.dir(), textAlign: i18n.dir() === 'rtl' ? 'right' : 'left' }}>
                                                            <Checkbox checked={formik.values?.BranchId.indexOf(item?.branchId) > -1} size={"small"} sx={{ direction: i18n.dir(), padding: '5px' }} />
                                                            <ListItemText className={'multiselect-text'} primary={item.displayName} sx={{ direction: i18n.dir() }} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='content col-lg-3 col-md-6 col-12'>
                                        <div className="title">
                                            <span>‌</span>
                                        </div>
                                        <div className='d-flex align-items-center'>
                                            <div className="checkbox-label mt-0">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formik.values.DocumentState.length === 2}
                                                            onChange={(e) => {

                                                                if (e.target.checked === true) {
                                                                    formik.setFieldValue("DocumentState", [1, 2])
                                                                }
                                                                else {
                                                                    formik.setFieldValue("DocumentState", [0])
                                                                }
                                                            }}
                                                            name={`DocumentState`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    sx={{ margin: '0' }}
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            {t("فقط اسناد قطعی")}
                                                        </Typography>
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <IconButton onClick={formik.handleSubmit}>
                                                    <CheckCircleIcon color="success" />

                                                </IconButton>
                                                <IconButton onClick={() => { resetSearch() }}>
                                                    <CancelIcon sx={{ color: 'red' }} />

                                                </IconButton>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </form> :
                        tempIndex[indexRef.current]?.type === "C" || tempIndex[indexRef.current]?.type === "D" ?
                            <form onSubmit={AccountCirculationformik.handleSubmit}>
                                <div className="form-design" style={{ padding: "0" }}>
                                    <div className="row ">

                                        <div className="content col-lg-2 col-md-6 col-12">
                                            <div className="title">
                                                <span>{t("از تاریخ")}</span>
                                            </div>
                                            <div className="wrapper date-picker position-relative">
                                                <DatePicker
                                                    name={"startDate"}
                                                    id={"startDate"}
                                                    ref={dataRef}
                                                    editable={false}
                                                    value={AccountCirculationformik.values.DocumentDate[0] ? new DateObject(AccountCirculationformik.values.DocumentDate[0]) : ''}
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    calendarPosition="bottom-right"
                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                    onBlur={AccountCirculationformik.handleBlur}
                                                    onChange={(val) => {
                                                        // setDate(val)
                                                        AccountCirculationformik.setFieldValue(`DocumentDate[0]`, julianIntToDate(val.toJulianDay()));
                                                    }}
                                                />
                                                <div
                                                    className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                    <div className='d-flex align-items-center justify-content-center'>
                                                        <CalendarMonthIcon className='calendarButton' /></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-2 col-md-6 col-12">
                                            <div className="title">
                                                <span>{t("تا")}</span>
                                            </div>
                                            <div className="wrapper date-picker position-relative">
                                                <DatePicker
                                                    name={"endDate"}
                                                    id={"endDate"}
                                                    editable={false}
                                                    value={AccountCirculationformik?.values?.DocumentDate[1] ? new DateObject(AccountCirculationformik.values.DocumentDate[1]) : ''}
                                                    calendar={renderCalendarSwitch(i18n.language)}
                                                    disabled={!AccountCirculationformik.values.DocumentDate[0]}
                                                    minDate={new Date(AccountCirculationformik.values.DocumentDate[0])}
                                                    locale={renderCalendarLocaleSwitch(i18n.language)}
                                                    onBlur={AccountCirculationformik.handleBlur}
                                                    onChange={(val) => {
                                                        AccountCirculationformik.setFieldValue("DocumentDate[1]", julianIntToDate(val.toJulianDay()));
                                                    }}
                                                />
                                                <div
                                                    className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                                    <div className='d-flex align-items-center justify-content-center'>
                                                        <CalendarMonthIcon className='calendarButton' /></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div onFocus={() => {
                                            dateRef2?.current?.closeCalendar();
                                        }} className="content col-lg-2 col-md-6 col-12" style={{ height: "30px", marginTop: "1px" }}>
                                            <div className="title">
                                                <span>{t("نوع تفضیلی")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <FormControl
                                                    className={"form-input p-0"}
                                                    sx={{ direction: i18n.dir(), width: "100%" }}
                                                >
                                                    <Select
                                                        labelId="demo-mutiple-checkbox-label"
                                                        id="demo-mutiple-checkbox"
                                                        className={i18n.dir() === "rtl" ? "rtl-select" : ""}
                                                        multiple
                                                        value={AccountCirculationformik.values?.detailedType}
                                                        onChange={detailedTypeHandleChange}
                                                        input={<Input />}
                                                        renderValue={(selected) => {
                                                            let temp = [];
                                                            selected?.forEach((item) => {
                                                                let obj = detailedTypes?.find((f) => f.id === item);
                                                                temp.push(obj?.title);
                                                            });
                                                            return temp.join(" , ");
                                                        }}
                                                        sx={{
                                                            direction: i18n.dir(),
                                                            width: "100%",
                                                            "&:before": { display: "none" },
                                                            "&:after": { display: "none" },
                                                        }}
                                                    >
                                                        {detailedTypes?.map((item) => (
                                                            <MenuItem
                                                                key={item?.id}
                                                                value={item?.id}
                                                                sx={{
                                                                    direction: i18n.dir(),
                                                                    textAlign: i18n.dir() === "rtl" ? "right" : "left",
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={AccountCirculationformik.values?.detailedType?.indexOf(item?.id) > -1}
                                                                    size={"small"}
                                                                    sx={{ direction: i18n.dir(), padding: "5px" }}
                                                                />
                                                                <ListItemText
                                                                    className={"multiselect-text"}
                                                                    primary={item.title}
                                                                    sx={{ direction: i18n.dir() }}
                                                                />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="detailedId content col-lg-2 col-md-6 col-12" style={{ height: "30px", marginTop: "1px" }}>
                                            <div className="title">
                                                <span>{t("تفضیلی")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <SelectBox
                                                        dataSource={accountingDocumentResult?.data}
                                                        searchEnabled
                                                        value={AccountCirculationformik.values?.detailedAccountId}
                                                        valueExpr="detailedAccountId"
                                                        className="selectBox"
                                                        displayExpr={function (item) {
                                                            return (
                                                                item && item.detailedAccountCode + "- " + item.detailedAccountName
                                                            );
                                                        }}
                                                        displayValue="detailedAccountName"

                                                        onValueChange={(e) => {
                                                            AccountCirculationformik.setFieldValue("detailedAccountId", e)
                                                        }}
                                                        rtlEnabled={i18n.dir() === "ltr" ? false : true}
                                                        itemRender={null}
                                                        placeholder=""
                                                    ></SelectBox>


                                                </div>
                                            </div>
                                        </div>
                                        <div className='content col-lg-2 col-md-6 col-12' style={{ display: "flex" }}>
                                            <div className="title">
                                                <span>‌</span>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <div className="checkbox-label " style={{ marginTop: "26px" }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={AccountCirculationformik?.values?.DocumentState?.length === 2}
                                                                onChange={(e) => {

                                                                    if (e?.target?.checked === true) {
                                                                        AccountCirculationformik?.setFieldValue("DocumentState", [1, 2])
                                                                    }
                                                                    else {
                                                                        AccountCirculationformik?.setFieldValue("DocumentState", [0])
                                                                    }
                                                                }}
                                                                name={`DocumentState`}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        }
                                                        sx={{ margin: '0' }}
                                                        label={
                                                            <Typography variant="subtitle2">
                                                                {t("فقط اسناد قطعی")}
                                                            </Typography>
                                                        }
                                                    />
                                                </div>
                                                <div style={{ marginTop: "21px" }}>
                                                    <IconButton onClick={AccountCirculationformik.handleSubmit}>
                                                        <CheckCircleIcon color="success" />
                                                    </IconButton>
                                                    <IconButton onClick={() => { resetSearch() }}>
                                                        <CancelIcon sx={{ color: 'red' }} />

                                                    </IconButton>
                                                </div>

                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </form>
                            : ""}
                    <div className='row mt-3'>
                        <div className='content col-xl-1 d-none d-xl-block mb-0'></div>
                        <div className='content col-xl-11 col-lg-12 col-md-12 col-12 mb-0'>
                            <div className={`${tempIndex[indexRef.current]?.type === 'R' ? "review-title1" : tempIndex[indexRef.current]?.type === 'C' ? "review-title2" : "review-title3"}`}>
                                {tempIndex[indexRef.current]?.level > 6 && tempIndex[indexRef.current]?.type === 'R' && tempIndex[indexRef.current]?.level <= 6 ?
                                    <div className="d-flex justify-content-start">
                                        <div>
                                            <span>{tempIndex[indexRef.current]?.title}</span>
                                        </div>
                                        <div style={{ position: "absolute", right: "110px" }}>
                                            <span>{returnTitleOFAccountingReview()}:</span>
                                        </div>
                                    </div>
                                    : tempIndex[indexRef.current]?.type === 'R' && tempIndex[indexRef.current].level > 6 ?
                                        <div className="d-flex justify-content-start">
                                            <div >
                                                <span style={{ fontWeight: "bold" }}>{tempIndex[indexRef.current]?.title}  :</span>
                                            </div>
                                            <div style={{ position: "absolute", right: "110px" }}>
                                                <span>{tempIndex[indexRef.current]?.stateTitle}</span>
                                            </div>
                                        </div>
                                        :
                                        tempIndex[indexRef.current]?.type === "C" ?
                                            <div className="d-flex justify-content-start">
                                                <div >
                                                    <span style={{ fontWeight: "bold" }}>{tempIndex[indexRef.current]?.stateOfTable?.state}  :</span>
                                                </div>
                                                <div style={{ position: "absolute", right: "110px" }}>
                                                    <span>{tempIndex[indexRef.current]?.stateOfTable?.name}</span>
                                                </div>
                                            </div>
                                            :
                                            tempIndex[indexRef.current]?.type === "D" ?

                                                <div className="d-flex justify-content-start">
                                                    <div style={{ margin: "0px 10px 0px 10px" }}>
                                                        <span style={{ fontSize: "11px", fontWeight: "bold" }}>{t("شماره سند")} : </span>
                                                        <span style={{ fontSize: "11px" }}>{tempIndex[indexRef.current]?.stateOfTable?.DocumentCode}</span>
                                                    </div>
                                                    <div style={{ margin: "0px 10px 0px 10px" }}>
                                                        <span style={{ fontSize: "11px", fontWeight: "bold" }}>{t("تاریخ")} : </span>
                                                        <span style={{ fontSize: "11px" }}>{documentReviewDate?.toLocaleDateString(i18n?.language, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}</span>

                                                    </div>
                                                    <div style={{ margin: "0px 10px 0px 10px" }}>
                                                        <span style={{ fontSize: "11px", fontWeight: "bold" }}>{t("شرح سند")} : </span>
                                                        <span style={{ fontSize: "11px" }}>{tempIndex[indexRef.current]?.stateOfTable?.ArticleDescription}</span>
                                                    </div>
                                                </div>
                                                :
                                                <div style={{ fontWeight: "bold" }}>
                                                    <span>{tempIndex[indexRef.current]?.title}</span>
                                                </div>
                                }
                            </div>
                        </div>
                    </div>


                </div >
                <div className="row">
                    <div className="content col-md-2 col-xl-custom-1 col-lg-2 col-12" >
                        <div className="btngroup row" style={{ marginTop: "20px" }}>
                            <div className='col-md-12 col-sm-3 col-6 '>
                                <div className="d-flex align-items-center search-btn-title">
                                    <div style={{ width: "calc(100% - 35px)", flex: "0 0 calc(100% - 35px)" }}  >
                                        <Button onClick={(e) => {
                                            addNewRoute(1, 'R', 'گروه', getStateTitle(1))
                                        }}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            className={`show-icon-hover ${tempIndex[indexRef.current]?.level === 1 ? 'active' : ''}`}
                                            key="one"> {t('گروه')}</Button>
                                    </div >
                                    <div className="search-btn-btn-review">
                                        <Button className={`serch-btn-review
                                         ${!selectedAccountingReview?.length
                                                || tempIndex[indexRef.current]?.level === 1
                                                || tempIndex[indexRef.current]?.level === 7
                                                ? "serch-btn-review-none" : ""}`}
                                            onClick={(e) => {
                                                addNewRoute(7, 'R', "ریز گروه")
                                            }}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                        >
                                            <SearchIcon sx={{ fontSize: '18px' }} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-12 col-sm-3 col-6'>
                                <div className="d-flex align-items-center search-btn-title">
                                    <div style={{ width: "calc(100% - 35px)", flex: "0 0 calc(100% - 35px)" }}>
                                        <Button
                                            onClick={(e) => {
                                                addNewRoute(2, 'R', "کل")
                                            }}

                                            className={`show-icon-hover ${tempIndex[indexRef.current]?.level === 2 ? 'active' : ''}`}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            key="two">
                                            {t('کل')}
                                        </Button>
                                    </div>
                                    <div className="search-btn-btn-review">
                                        <Button className={`serch-btn-review 
                                        ${tempIndex[indexRef.current]?.level === 2
                                                || tempIndex[indexRef.current]?.level === 8
                                                || !selectedAccountingReview?.length
                                                ? "serch-btn-review-none" : ""}`}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            onClick={(e) => {
                                                console.log("ttttttttttt", tempIndex[indexRef.current])
                                                addNewRoute(8, 'R', "ریز کل")
                                            }}
                                        >
                                            <SearchIcon sx={{ fontSize: '18px' }} />
                                        </Button>
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-12 col-sm-3 col-6'>
                                <div className="d-flex align-items-center search-btn-title">
                                    <div style={{ width: "calc(100% - 35px)", flex: "0 0 calc(100% - 35px)" }}>
                                        <Button
                                            onClick={(e) => {
                                                addNewRoute(3, 'R', 'معین')
                                            }}
                                            className={`show-icon-hover ${tempIndex[indexRef.current]?.level === 3 ? 'active' : ''}`}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            key="three">
                                            {t('معین')}
                                        </Button>
                                    </div>
                                    <div className="search-btn-btn-review">
                                        <Button className={`serch-btn-review 
                                        ${tempIndex[indexRef.current]?.level === 3
                                                || tempIndex[indexRef.current]?.level === 9
                                                || !selectedAccountingReview?.length
                                                ? "serch-btn-review-none" : ""}`}
                                            onClick={(e) => {
                                                addNewRoute(9, 'R', 'ریز معین')
                                            }}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                        >
                                            <SearchIcon sx={{ fontSize: '18px' }} />
                                        </Button>
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-12 col-sm-3 col-6'>
                                <div className="d-flex align-items-center search-btn-title">
                                    <div style={{ width: "calc(100% - 35px)", flex: "0 0 calc(100% - 35px)" }}>
                                        <Button
                                            className={`show-icon-hover ${tempIndex[indexRef.current]?.level === 4 ? 'active' : ''}`}
                                            onClick={() => {
                                                addNewRoute(4, 'R', 'تفضیلی 4')
                                            }}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                        >
                                            {t('تفضیلی 4')}

                                        </Button>
                                    </div>
                                    <div className="search-btn-btn-review">
                                        <Button className={`serch-btn-review
                                  
                                         ${tempIndex[indexRef.current]?.level === 4
                                                || tempIndex[indexRef.current]?.level === 10
                                                || !!(selectedAccountingReview[0]?.AccountCodeEntity4 === '' && selectedAccountingReview[0]?.DetailedTypeIds4?.length === 0)
                                                || selectedAccountingReview.length === 0
                                                || selectedAccountingReview[0]?.DetailedTypeIds4 === null ? 'serch-btn-review-none' : ''}`}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            onClick={() => {
                                                addNewRoute(10, 'R', 'ریز تفضیلی 4')
                                            }}>
                                            <SearchIcon sx={{ fontSize: '18px' }} />
                                        </Button>
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-12 col-sm-3 col-6'>
                                <div className="d-flex align-items-center search-btn-title ">
                                    <div style={{ width: "calc(100% - 35px)", flex: "0 0 calc(100% - 35px)" }}>
                                        <Button
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            className={`show-icon-hover ${tempIndex[indexRef.current]?.level === 5 ? 'active' : ''}`}
                                            onClick={() => {
                                                addNewRoute(5, 'R', 'تفضیلی 5')
                                            }}>
                                            {t('تفضیلی 5')}
                                        </Button>
                                    </div>

                                    <div className="search-btn-btn-review">
                                        <Button className={`serch-btn-review 
                                        ${tempIndex[indexRef.current]?.level === 5
                                                || tempIndex[indexRef.current]?.level === 11
                                                || !!(selectedAccountingReview[0]?.AccountCodeEntity5 === '' && selectedAccountingReview[0]?.DetailedTypeIds5?.length === 0)
                                                || selectedAccountingReview.length === 0
                                                || selectedAccountingReview[0]?.DetailedTypeIds4 === null ? "serch-btn-review-none" : ""}`}
                                            onClick={() => {
                                                addNewRoute(11, 'R', 'ریز تفضیلی 5')
                                            }}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                        >
                                            <SearchIcon sx={{ fontSize: '18px' }} />
                                        </Button>
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-12 col-sm-3 col-6'>
                                <div className="d-flex align-items-center search-btn-title ">
                                    <div style={{ width: "calc(100% - 35px)", flex: "0 0 calc(100% - 35px)" }}>
                                        <Button
                                            className={`show-icon-hover ${tempIndex[indexRef.current]?.level === 6 ? 'active' : ''}`}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                            onClick={() => {
                                                addNewRoute(6, 'R', 'تفضیلی 6')
                                            }}>
                                            {t('تفضیلی 6')}
                                        </Button>
                                    </div>
                                    {console.log("selectedAccountingReview", selectedAccountingReview)}
                                    <div className="search-btn-btn-review">
                                        < Button className={`serch-btn-review
                                         ${tempIndex[indexRef.current]?.level === 6
                                                || tempIndex[indexRef.current - 1]?.level === 6
                                                || tempIndex[indexRef.current]?.level === 12
                                                || !!(selectedAccountingReview[0]?.AccountCodeEntity6 === '' && selectedAccountingReview[0]?.DetailedTypeIds6?.length === 0)
                                                || selectedAccountingReview.length === 0
                                                || selectedAccountingReview[0]?.DetailedTypeIds6 === null ? "serch-btn-review-none" : ""}`}
                                            onClick={() => {
                                                addNewRoute(12, 'R', 'ریز تفضیلی 6')
                                            }}
                                            disabled={tempIndex[indexRef.current]?.type !== 'R'}
                                        >
                                            <SearchIcon sx={{ fontSize: '18px' }} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 d-flex justify-content-between navigate-btn-sec'>
                                <Tooltip title={t('بعدی')}>
                                    <Button variant="outlined" id="rightArrow" onClick={() => { moveForward() }}>
                                        <KeyboardDoubleArrowRightIcon />
                                    </Button>
                                </Tooltip>
                                <Tooltip title={t('قبلی')}>
                                    <Button variant="outlined" id="leftArrow"
                                        onClick={(e) => {
                                            moveBackward()
                                        }}>
                                        <KeyboardDoubleArrowLeftIcon />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {tempIndex[indexRef.current]?.type === "R" ?
                        <div className="content col-md-10 col-xl-custom-11 col-lg-10 col-12">
                            <div style={{ margin: '0 -20px' }}>
                                {tempIndex[indexRef.current]?.level === 1 ?
                                    <AccountingReview_Level1 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                    tempIndex[indexRef.current]?.level === 2 ?
                                        <AccountingReview_Level2 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                        tempIndex[indexRef.current]?.level === 3 ?
                                            <AccountingReview_Level3 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                            tempIndex[indexRef.current]?.level === 4 ?
                                                <AccountingReview_Level4 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                tempIndex[indexRef.current]?.level === 5 ?
                                                    <AccountingReview_Level5 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                    tempIndex[indexRef.current]?.level === 6 ?
                                                        <AccountingReview_Level6 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                        tempIndex[indexRef.current]?.level === 7 ?
                                                            <AccountingReview_Level7 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                            tempIndex[indexRef.current]?.level === 8 ?
                                                                <AccountingReview_Level8 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} id={tempIndex[indexRef.current]?.id} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                                tempIndex[indexRef.current]?.level === 9 ?
                                                                    <AccountingReview_Level9 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} id={tempIndex[indexRef.current]?.id} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                                    tempIndex[indexRef.current]?.level === 10 ?
                                                                        <AccountingReview_Level10 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} id={tempIndex[indexRef.current]?.id} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                                        tempIndex[indexRef.current]?.level === 11 ?
                                                                            <AccountingReview_Level11 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} id={tempIndex[indexRef.current]?.id} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                                            tempIndex[indexRef.current]?.level === 12 ?
                                                                                <AccountingReview_Level12 cancel={cancel} GetStatus={GetStatusCirculation} location={location?.search} id={tempIndex[indexRef.current]?.id} GetSelectedId={GetSelectedId} level={tempIndex[indexRef.current]?.level} lastLevel={tempIndex[indexRef.current - 1]?.level} selectedAccountingReview={tempIndex[indexRef.current]?.AccountReview} GetAccountingReview={GetAccountingReview} querySearchParams={querySearchParams} /> :
                                                                                null}
                            </div>
                        </div> :
                        tempIndex[indexRef.current]?.type === "C" ?
                            < div className="content col-md-10 col-xl-custom-11 col-lg-10 col-12">
                                <div className="accountCirculation" style={{ margin: '0 -20px' }}>
                                    <AccountCirculation accountCirculationQuerySearchParams={accountCirculationQuerySearchParams} state={state[indexOfStateRef.current]} GetStatus={GetStatusDocument} tempIndex={tempIndex} indexRef={indexRef.current} />
                                </div>
                            </div>
                            :
                            < div className="content col-md-10 col-xl-custom-11 col-lg-10 col-12">
                                <div className="accountCirculation" style={{ margin: '0 -20px' }}>
                                    <ReviewDocument accountDocumentQuerySearchParams={accountCirculationQuerySearchParams} state={state[indexOfStateRef.current]} />
                                </div>
                            </div>
                    }
                </div>
            </div >
        </>
    )
}

export default AccountReview
