import {Button, FormControlLabel, Radio, RadioGroup, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import React, {useRef, useState} from "react";
import {useFormik} from "formik";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import Popover from "@mui/material/Popover";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import {renderCalendarLocaleSwitch, renderCalendarSwitch} from "../../../utils/calenderLang";
import {julianIntToDate} from "../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {SelectBox} from "devextreme-react/select-box";
import {TreeView} from "devextreme-react";
import {accountParty, customers} from "./file";

const VisitPeriodData = ['دوره 1', 'دوره 2', 'دوره 3', 'دوره 4', 'دوره 5']

const SearchBtn = () => {

    const theme = useTheme();
    const {t, i18n} = useTranslation();
    const dateRef = useRef()

    const [anchorSearch, setAnchorSearch] = useState(null);
    const openSearch = Boolean(anchorSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const formik = useFormik({
        initialValues: {
            date: '',
            VisitPeriod: '',
            searchType: 'or',
            selectedTree1:[],
            selectedTree2:[]

        },
        validateOnChange:false,
        onSubmit: (values) => {
            console.log("here", values);

        },
    });


    function syncSelection1(treeView) {
        formik.setFieldValue('selectedTree1',treeView.getSelectedNodes()
            .map((node) => node.itemData))
    }
    function syncSelection2(treeView) {
        formik.setFieldValue('selectedTree2',treeView.getSelectedNodes()
            .map((node) => node.itemData))
    }



    return (

        <div>
            <Tooltip title={t("جستجو")} arrow>
                <Button
                    aria-describedby={idSearch}
                    variant="outlined"
                    style={i18n.dir() === 'rtl' ? {marginRight: '10px'} : {marginLeft: '10px'}}
                    className="kendo-setting-btn"
                    onClick={(e) => setAnchorSearch(e.currentTarget)}

                >
                    <SearchIcon/>
                </Button>
            </Tooltip>
            <Popover
                id={idSearch}
                open={openSearch}
                anchorEl={anchorSearch}
                onClose={() => setAnchorSearch(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: i18n.dir() === "rtl" ? "right" : "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: i18n.dir() === "rtl" ? "right" : "left"
                }}
                PaperProps={{
                    style: {width: "460px"}
                }}
                sx={{direction: i18n.dir()}}
                className="grid-popover search-popover"
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        <div className="row">
                            <div className='col-12'>
                                <h5 className="popover-title">
                                    {t("جستجو")}
                                </h5>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="title">
                                    <span>{t("تاریخ")}</span>
                                </div>
                                <div className='date-picker position-relative'>
                                    <DatePicker
                                        name="date"
                                        id="date"
                                        ref={dateRef}
                                        value={formik.values.date!==''?new DateObject(formik.values.date):''}
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        calendarPosition="bottom-right"
                                        onBlur={formik.handleBlur}
                                        onChange={val => {
                                            formik.setFieldValue('date', julianIntToDate(val?.toJulianDay()));
                                        }}
                                    />
                                    <div
                                        className={`modal-action-button  ${i18n.dir() === "ltr" ? 'action-ltr' : ''}`}>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <CalendarMonthIcon className='calendarButton'/></div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6' onFocus={() => dateRef?.current?.closeCalendar()}>
                                <div className="title">
                                    <span>{t("دوره ویزیت")}</span>
                                </div>
                                <SelectBox
                                    dataSource={VisitPeriodData}
                                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                    // valueExpr="id"
                                    className='selectBox'
                                    searchEnabled={true}
                                    placeholder=''
                                    showClearButton
                                    noDataText={t("اطلاعات یافت نشد")}
                                    // displayExpr={function (item) {
                                    //     return item && item.Code + '- ' + item.Name;
                                    // }}
                                    // displayValue='Name'
                                    onValueChanged={(e) => {
                                        formik.setFieldValue('VisitPeriod', e.value)
                                    }}
                                />
                            </div>
                            <div className='col-12 mt-3'>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={formik.values.searchType}
                                    name="searchType"
                                    row
                                    onChange={(e) => formik.setFieldValue('searchType', e.target.defaultValue)}
                                >
                                    <FormControlLabel value="or" size="small" control={<Radio/>} style={i18n.dir()=='rtl'?{marginLeft:'10px'}:{marginRight:'10px'}} label={t("یا")}/>
                                    <FormControlLabel value="and" size="small" control={<Radio/>} label={t("و")}/>
                                </RadioGroup>
                            </div>
                            <div className="col-6">
                                <div className='mt-3 popover-treeView'>
                                    <TreeView
                                        className={theme.palette.mode === "dark" && "dark-tree"}
                                        id={"TreeView1"}
                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                        width={'100%'}
                                        height={200}
                                        items={accountParty}
                                        selectNodesRecursive={true}
                                        selectByClick={true}
                                        showCheckBoxesMode={'normal'}
                                        selectionMode={'multiple'}
                                        onSelectionChanged={(e)=>syncSelection1(e.component)}
                                        onContentReady={(e)=>syncSelection1(e.component)}
                                        itemRender={(item)=>`${item.text}`}
                                        // onItemSelectionChanged={onItemClick}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className='mt-3 popover-treeView'>
                                    <TreeView
                                        className={theme.palette.mode === "dark" && "dark-tree"}
                                        id={"TreeView2"}
                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                        width={'100%'}
                                        height={200}
                                        items={customers}
                                        selectNodesRecursive={true}
                                        selectByClick={true}
                                        showCheckBoxesMode={'normal'}
                                        selectionMode={'multiple'}
                                        onSelectionChanged={(e)=>syncSelection2(e.component)}
                                        onContentReady={(e)=>syncSelection2(e.component)}
                                        itemRender={(item)=>`${item.text}`}
                                        // onItemSelectionChanged={onItemClick}
                                    />
                                </div>
                            </div>
                            <div className='col-12 mt-3 d-flex justify-content-center'>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                        setAnchorSearch(null);
                                        formik.submitForm()
                                    }}
                                >
                                    {t('جستجو')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        setAnchorSearch(null);
                                    }}
                                    style={i18n.dir() === "rtl" ? { marginRight: "10px" } : { marginLeft: "10px" }}
                                >
                                    {t("انصراف")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>

            </Popover>
        </div>

    )

}

export default SearchBtn