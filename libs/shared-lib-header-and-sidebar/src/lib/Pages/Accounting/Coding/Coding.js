import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import './../../../style.css';
import { ContextMenu, TreeView } from 'devextreme-react';
import { useFormik } from 'formik';
import { Paper, Button, RadioGroup, FormControlLabel, Radio, Box, Modal, Tab, Checkbox, Typography, FormGroup, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';
import swal from 'sweetalert';
import { Item } from 'devextreme-react/context-menu';
import UpdateCodingModal from '../../../components/Modals/Coding/UpdateCodingModal';
import CreateCodingModal from '../../../components/Modals/Coding/CreateCodingModal';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../assets/images/icons/trash-icon3.gif'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import SettingsIcon from '@mui/icons-material/Settings';
import CodingSettings from '../../../components/Modals/Coding/CodingSettings';
import * as Yup from 'yup';
import { useAddAutoCodingMutation, useDeleteCodingMutation, useFetchCodingsQuery, useUpdateCodingDetailedMatchMutation } from '../../../features/slices/customerChosenCodingSlice';
import { useFetchDetailedTypesQuery } from '../../../features/slices/detailedTypeSlice';
import MergeCodingModal from '../../../components/Modals/Coding/MergeCodingModal';
import { Helmet } from 'react-helmet-async';
import { AccountingTitles } from '../../../utils/pageTitles';



const Coding = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        direction: i18n.dir()
    };

    const callComponent = () => {
        window.open(`#/Accounting/Grid?lang=${i18n.language}`, '_blank');
    }

    /* -------------------------------------------------------------------------- */

    /* ---------------------------- No Coding Exists ---------------------------- */
    const [codingType, setCodingType] = useState()
    const [allowManualEntry, setAllowManualEntry] = useState(false)

    const codingFormik = useFormik({
        initialValues: {
            automaticCodingType: ""
        },
        validateOnChange: false,
        onSubmit: (values) => {
            console.log("all values", values);
            if (values.automaticCodingType !== "") {
                addAutoCoding(values.automaticCodingType)
            }
            else {
                setAllowManualEntry(true)
            }
            CodingSub(); //SweetAlert
        },
    })

    function ChangeCodingType(value) {
        setCodingType(value)
        if (value === "Manual") {
            codingFormik.setFieldValue("automaticCodingType", "")
        }
    }
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                        Right Side (Coding Treeview)                        */
    /* -------------------------------------------------------------------------- */

    const [codingDatasource, setCodingDatasource] = useState([]);

    const createModalData = useRef()
    const [createCodingModalOpen, setCreateCodingModalOpen] = useState(false)
    function OpenCreateCodingModal() {
        console.log("createModal", createModalData.current)
        if (createModalData.current.codingLevel < 3) {
            setCreateCodingModalOpen(true)
        }
        else {
            CreateOnMoeinError()
        }
    }

    const updateModalData = useRef()
    const [updateCodingModalOpen, setUpdateCodingModalOpen] = useState(false)
    function OpenUpdateCodingModal() {
        if (updateModalData.current.codingLevel > 0) {
            setUpdateCodingModalOpen(true)
        }
        else {
            NoEditTreeheadError()
        }
    }

    const deleteCodingData = useRef()
    const [openRemove, setOpenRemove] = useState(false)

    const mergeCodingData = useRef({ codingLevel: 0 })
    const [mergeCodingModalOpen, setMergeCodingModalOpen] = useState(false)

    const [settingsModalOpen, setSettingsModalOpen] = useState(false)
    const settingsModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        direction: i18n.dir()
    };

    /* --------------------------- Treeview Functions --------------------------- */
    const contextMenuRef = useRef()
    // console.log('contextMenuRef', contextMenuRef)
    // console.log('contextMenuRef', !!contextMenuRef.current)
    // console.log(contextMenuRef.current?.instance?.option("items")[3].disabled)

    function setModalInfo(e) {
        updateModalData.current = e.itemData
        createModalData.current = e.itemData
        deleteCodingData.current = e.itemData.codingId
        mergeCodingData.current = e.itemData

        const isMoein = e.itemData.codingLevel === 3
        contextMenuRef.current.instance.option('items[3].disabled', !isMoein)
        // console.log("updateModalData",updateModalData.current,"createModalData",createModalData.current,"deleteCodingData",deleteCodingData.current,"mergeCodingData",mergeCodingData.current)
        //    let items=document.querySelectorAll('.clicked-item-bg')
        //     items.forEach(item=>{
        //         item.classList.remove('clicked-item-bg')
        //     })

        //     e.itemElement.classList.add('clicked-item-bg')
    }
    function handleItemClick(e) {
        setValue('1')
        setModalInfo(e)
        if (e.itemData.codingLevel === 3) {
            detailedFormik.setFieldValue('codingId', e.itemData.codingId)
            let tempCoding4 = []
            let tempCoding5 = []
            let tempCoding6 = []

            let temp4 = detailedTypeDatasource.map(item => {
                if (e.itemData.detailedType4Ids.includes(item.detailedTypeID)) {
                    tempCoding4.push(item.detailedTypeID)
                    return {
                        ...item,
                        selected: true
                    }
                }
                else {
                    return item
                }
            })

            let temp5 = detailedTypeDatasource.map(item => {
                if (e.itemData.detailedType5Ids.includes(item.detailedTypeID)) {
                    tempCoding5.push(item.detailedTypeID)
                    return {
                        ...item,
                        selected: true
                    }
                }
                else {
                    return item
                }
            })

            let temp6 = detailedTypeDatasource.map(item => {
                if (e.itemData.detailedType6Ids.includes(item.detailedTypeID)) {
                    tempCoding6.push(item.detailedTypeID)
                    return {
                        ...item,
                        selected: true
                    }
                }
                else {
                    return item
                }
            })

            detailedFormik.setFieldValue('detailedType4', tempCoding4)
            detailedFormik.setFieldValue('detailedType5', tempCoding5)
            detailedFormik.setFieldValue('detailedType6', tempCoding6)
            setDetailedTab4(temp4)
            setDetailedTab5(temp5)
            setDetailedTab6(temp6)
        }
        else {
            detailedFormik.setFieldValue('codingId', 0)
            detailedFormik.setFieldValue('detailedType4', [])
            detailedFormik.setFieldValue('detailedType5', [])
            detailedFormik.setFieldValue('detailedType6', [])
            setDetailedTab4([])
            setDetailedTab5([])
            setDetailedTab6([])
        }
    }

    const [expandedNode, setExpandedNode] = useState([]);
    const [expandedNodeStatus, setExpandedNodeStatus] = useState([]);
    useEffect(() => {
        let expTemp = codingDatasource.map((item) => ({
            codingId: item.codingId,
            expanded: item?.expanded || false
        }))
        setExpandedNodeStatus(expTemp)

    }, [expandedNode])

    function rightClickMenu(e) {
        if (e.itemIndex === 0) {
            OpenCreateCodingModal()
        }
        if (e.itemIndex === 1) {
            OpenUpdateCodingModal()
        }
        if (e.itemIndex === 2) {
            setOpenRemove(true);
        }
        if (e.itemIndex === 3) {
            setMergeCodingModalOpen(true)
        }
    }

    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                       Left Side (Detailed Type Tabs)                       */
    /* -------------------------------------------------------------------------- */
    const detailedFormik = useFormik({
        initialValues: {
            codingId: 0,
            detailedType4: [],
            detailedType5: [],
            detailedType6: []
        },
        validateOnChange: false,
        validationSchema: Yup.object({
            detailedType5: Yup.array().test(
                '4IsNotEmpty', "انتخاب تفضیلی سطح 5 بدون انتخاب تفضیلی سطح 4 امکان‌پذیر نیست",
                (item, testContext) => {
                    return (item.length == 0 || testContext.parent.detailedType4.length !== 0)
                }
            ),
            detailedType6: Yup.array().test(
                '5IsNotEmpty', "انتخاب تفضیلی سطح 6 بدون انتخاب تفضیلی سطح 5 امکان‌پذیر نیست",
                (item, testContext) => {
                    return (item.length == 0 || testContext.parent.detailedType5.length !== 0)
                }
            ),
        }),
        onSubmit: (values) => {
            updateCodingDetailedMatch(values).unwrap()
                .catch((error) => {
                    console.error(error)
                })
            CodingDetailedSub();
        },
    })
    const [detailedTypeDatasource, setDetailedTypeDatasource] = useState([]);

    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [detailedTab4, setDetailedTab4] = useState([]);
    const [detailedTab5, setDetailedTab5] = useState([]);
    const [detailedTab6, setDetailedTab6] = useState([]);

    function handleChangeCheckbox4(id, checked) {
        let temp = detailedTab4.map(item => {
            if (item.detailedTypeID === id) {
                if (checked === true) {
                    detailedFormik.setFieldValue('detailedType4', [...detailedFormik.values.detailedType4, item.detailedTypeID])
                }
                else {
                    let temp = detailedFormik.values.detailedType4.filter((removingItem) => removingItem !== item.detailedTypeID)
                    detailedFormik.setFieldValue('detailedType4', temp)
                    if (temp.length === 0) {
                        detailedFormik.setFieldValue('detailedType5', temp)
                        detailedFormik.setFieldValue('detailedType6', temp)
                    }
                }
                return {
                    ...item,
                    selected: checked,
                }
            }
            return item
        })
        setDetailedTab4(temp)
    }

    function handleChangeCheckbox5(id, checked) {
        let temp = detailedTab5.map(item => {
            if (item.detailedTypeID === id) {
                if (checked === true) {
                    detailedFormik.setFieldValue('detailedType5', [...detailedFormik.values.detailedType5, item.detailedTypeID])
                }
                else {
                    let temp = detailedFormik.values.detailedType5.filter((removingItem) => removingItem !== item.detailedTypeID)
                    detailedFormik.setFieldValue('detailedType5', temp)
                    if (temp.length === 0) {
                        detailedFormik.setFieldValue('detailedType6', temp)
                    }
                }
                return {
                    ...item,
                    selected: checked,
                }
            }
            return item
        })
        setDetailedTab5(temp)
    }

    function handleChangeCheckbox6(id, checked) {
        let temp = detailedTab6.map(item => {
            if (item.detailedTypeID === id) {
                if (checked === true) {
                    detailedFormik.setFieldValue('detailedType6', [...detailedFormik.values.detailedType6, item.detailedTypeID])
                }
                else {
                    let temp = detailedFormik.values.detailedType6.filter((removingItem) => removingItem !== item.detailedTypeID)
                    detailedFormik.setFieldValue('detailedType6', temp)
                }
                return {
                    ...item,
                    selected: checked,
                }
            }
            return item
        })
        setDetailedTab6(temp)
    }

    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    Redux                                   */
    /* -------------------------------------------------------------------------- */

    /* -------------------------- CustomerChosenCoding -------------------------- */
    const [customerChosenCodingContent, setCustomerChosenCodingContent] = useState("")
    const { data: codingRes = [], isFetching: codingIsFetching, error: codingError } = useFetchCodingsQuery();
    useEffect(() => {
        if (codingIsFetching) {
            setCustomerChosenCodingContent(<CircularProgress />)
        } else if (codingError) {
            setCustomerChosenCodingContent(t("خطایی رخ داده است"))
        } else { //Fulfilled
            setCustomerChosenCodingContent("")
            let displayNames = codingRes.map((item) => {
                if (item.completeCode !== "") {
                    return {
                        ...item,
                        displayName: item.completeCode + " - " + item.name
                    }
                }
                else {
                    return {
                        ...item,
                        displayName: item.name
                    }
                }
            })
            let temp = displayNames.map((item) => {
                let t = expandedNodeStatus.filter(f => f.codingId === item.codingId)[0]
                if (item.codingParentId == 0) {
                    return {
                        ...item,
                        expanded: true
                    }
                }
                else {
                    return {
                        ...item,
                        expanded: t?.expanded || false
                    }
                }
            })
            setCodingDatasource(temp)
        }
    }, [codingIsFetching])

    const [deleteCoding, deleteResults] = useDeleteCodingMutation()
    useEffect(() => {
        if (deleteResults.status == "fulfilled" && deleteResults.isSuccess) {
            setOpenRemove(false)
        }
        else if (deleteResults.isError) {
            let arr = deleteResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }
    }, [deleteResults.status])

    const [updateCodingDetailedMatch, updateResults] = useUpdateCodingDetailedMatchMutation()
    useEffect(() => {
        if (updateResults.status == "fulfilled" && updateResults.isSuccess) {
            setOpenRemove(false)
        }
        else if (updateResults.isError) {
            let arr = updateResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }
    }, [updateResults.status])

    const [addAutoCoding, addResults] = useAddAutoCodingMutation()

    /* ------------------------------ DetailedType ------------------------------ */
    const [detailedTypeContent, setDetailedTypeContent] = useState("")
    const { data: detailedRes = [], isFetching: detailedIsFetching, error: detailedError } = useFetchDetailedTypesQuery();
    useEffect(() => {
        if (detailedIsFetching) {
            setDetailedTypeContent(<CircularProgress />)
        } else if (detailedError) {
            setDetailedTypeContent(t("خطایی رخ داده است"))
        } else { //Fulfilled
            setDetailedTypeContent("")
            let temp = detailedRes.map(item => {
                return {
                    ...item,
                    selected: false,
                }
            })
            setDetailedTypeDatasource(temp)
        }
    }, [detailedIsFetching])
    /* -------------------------------------------------------------------------- */

    /* ------------------------------- SweetAlerts ------------------------------ */
    const CodingSub = () => {
        swal({
            title: t("کدینگ با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }
    const CodingDetailedSub = () => {
        swal({
            title: t("تغییرات تفضیلی‌ها با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }
    const CreateOnMoeinError = () => {
        swal({
            title: t("زیر مجموعه حساب های معین(تفضیلی) را میتوانید از منوی مربوط به آن در اطلاعات پایه اضافه کنید"),
            icon: "error",
            button: t("باشه"),
            className: "small-error"
        });
    }
    const NoEditTreeheadError = () => {
        swal({
            title: t("مورد انتخاب شده قابل ویرایش نیست"),
            icon: "error",
            button: t("باشه"),
            className: "small-error"
        });
    }
    /* -------------------------------------------------------------------------- */

    return (

        <>
            {/*<div className='header'>*/}
            {/*    <span>{t("حسابداری - تعریف حساب")}</span>*/}
            {/*</div>*/}
            <Helmet>
                <title>{t(AccountingTitles.Coding)}</title>
            </Helmet>
            <form className='tree-sec'>
                <div className='row justify-content-center'>
                    <div className='content col-lg-5 col-sm-6 col-12 t1'>
                        <Paper elevation={2} className='paper-pda' sx={{ height: '100%' }}>
                            {customerChosenCodingContent !== "" ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {customerChosenCodingContent}
                                </Box>
                            ) :
                                codingDatasource.length === 1 && allowManualEntry === false ? (
                                    <div>
                                        <RadioGroup
                                            aria-labelledby="automatic-or-manual"
                                            name="automatic-or-manual"
                                            value={codingType}
                                            onChange={(event) => ChangeCodingType(event.target.value)}
                                        >

                                            <FormControlLabel
                                                className="mt-2"
                                                value="Manual"
                                                control={<Radio />}
                                                label={t("ایجاد حساب‌ها به صورت دستی")}
                                            />
                                            <FormControlLabel
                                                className="mt-2"
                                                value="Automatic"
                                                control={<Radio />}
                                                label={t("ایجاد حساب‌ها به صورت خودکار")}
                                            />
                                        </RadioGroup>

                                        {codingType === "Automatic" ?
                                            <div style={{ paddingRight: "20px" }}>
                                                <RadioGroup
                                                    aria-labelledby="choose-default-data"
                                                    name="choose-default-data"
                                                    onChange={(event) => codingFormik.setFieldValue("automaticCodingType", event.target.value)}
                                                >
                                                    <FormControlLabel
                                                        className="mt-2"
                                                        value="1"
                                                        control={<Radio />}
                                                        label={t("بازرگانی و پخش")}
                                                    />
                                                    <FormControlLabel
                                                        className="mt-2"
                                                        value="2"
                                                        control={<Radio />}
                                                        label={t("خدماتی")}
                                                    />
                                                    <FormControlLabel
                                                        className="mt-2"
                                                        value="3"
                                                        control={<Radio />}
                                                        label={t("تولیدی")}
                                                    />
                                                    <FormControlLabel
                                                        className="mt-2"
                                                        value="4"
                                                        control={<Radio />}
                                                        label={t("پیمانکاری")}
                                                    />
                                                </RadioGroup>
                                            </div> : null
                                        }
                                        <div>
                                            <div className={`button-pos ${i18n.dir == 'ltr' ? 'ltr' : 'rtl'}`}>
                                                <LoadingButton
                                                    variant="contained"
                                                    color="success"
                                                    type="button"
                                                    onClick={() => {
                                                        codingFormik.handleSubmit()
                                                    }}
                                                    loading={addResults.isLoading}
                                                >
                                                    {t("تایید")}
                                                </LoadingButton>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="form">
                                            <TreeView
                                                id='codingTreeView'
                                                dataStructure="plain"
                                                displayExpr="displayName"
                                                keyExpr="codingId"
                                                parentIdExpr="codingParentId"
                                                items={codingDatasource}
                                                className={theme.palette.mode === "dark" && "dark-tree"}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                onItemExpanded={(e) => setExpandedNode(e.node)}
                                                onItemClick={handleItemClick}
                                                width={'100%'}
                                                onItemContextMenu={(e) => setModalInfo(e)}
                                                selectByClick={true}
                                                selectionMode="single"
                                            // selectNodesRecursive={(e)=>{console.log("e",e)}}
                                            // showCheckBoxesMode={(e)=>{console.log("e",e)}}
                                            // onSelectionChanged={(e)=>{console.log("e",e)}}

                                            />
                                            <ContextMenu
                                                target="#codingTreeView"
                                                onItemClick={rightClickMenu}
                                                rtlEnabled
                                                ref={contextMenuRef}
                                                onInitialized={(e) => contextMenuRef.current?.instance?.option('items[3].disabled', true)}
                                            >
                                                <Item text="جدید" icon="plus" />
                                                <Item text="ویرایش" icon="edit" />
                                                <Item text="حذف" icon="trash" />
                                                <Item text="ادغام" icon="columnfield" />
                                            </ContextMenu>

                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex justify-content-center'>
                                                <Button
                                                    variant="contained"
                                                    color='success'
                                                    style={{ margin: '0 2px' }}
                                                    onClick={OpenCreateCodingModal}
                                                    disabled={typeof (createModalData.current) === "undefined"}
                                                >
                                                    {t('جدید')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color='warning'
                                                    style={{ margin: '0 2px' }}
                                                    onClick={OpenUpdateCodingModal}
                                                    disabled={typeof (updateModalData.current) === "undefined"}
                                                >
                                                    {t('ویرایش')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color='error'
                                                    style={{ margin: '0 2px' }}
                                                    onClick={() => setOpenRemove(true)}
                                                    disabled={typeof (deleteCodingData.current) === "undefined"}
                                                >
                                                    {t('حذف')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: '#aa00ff',
                                                        "&:hover": {
                                                            backgroundColor: '#8900cd',
                                                        },
                                                    }}
                                                    style={{ margin: '0 2px' }}
                                                    onClick={() => setMergeCodingModalOpen(true)}
                                                    disabled={mergeCodingData.current.codingLevel === 0 || contextMenuRef.current?.instance?.option("items[3].disabled") === true}
                                                >
                                                    {t('ادغام')}
                                                </Button>
                                            </div>
                                            <Tooltip title={t("ساختار کدینگ")}>
                                                <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={() => setSettingsModalOpen(true)}>
                                                    <SettingsIcon />
                                                </IconButton >
                                            </Tooltip>
                                        </div>

                                    </div>

                                )
                            }

                        </Paper>
                    </div>
                    <div className="content col-lg-4 col-sm-6 col-12 t2 ">
                        <Paper elevation={2} className='paper-pda' sx={{ height: '100%' }}>
                            <div className='selectable folder-tabs flex-column'>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} aria-label="access form"
                                            TabIndicatorProps={{ sx: { display: 'none' } }}
                                            sx={{
                                                '& .MuiTabs-flexContainer': {
                                                    flexWrap: 'wrap',
                                                },
                                            }}

                                        >
                                            <Tab label={t('سطح چهارم')} value="1" disabled={!detailedTab4.length} />
                                            <Tab label={t('سطح پنجم')} value="2" disabled={!detailedTab5.length || detailedTab4.every(item => !item.selected)} />
                                            <Tab label={t('سطح ششم')} value="3" disabled={!detailedTab6.length || detailedTab5.every(item => !item.selected) || detailedTab4.every(item => !item.selected)} />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1" sx={{ padding: '15px 5px', overflowY: "auto" }}>
                                        <FormGroup>
                                            {detailedTab4.map(item => (
                                                <FormControlLabel
                                                    key={item.detailedTypeID}
                                                    control={
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onChange={(e) => {
                                                                handleChangeCheckbox4(item.detailedTypeID, e.target.checked)
                                                            }}
                                                            name={`${item.detailedTypeID}`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    sx={{ margin: '0' }}
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            {item.detailedTitle}
                                                        </Typography>
                                                    }
                                                />
                                            ))}
                                        </FormGroup>
                                    </TabPanel>
                                    <TabPanel value="2" sx={{ padding: '15px 5px', overflowY: "auto" }}>
                                        <FormGroup>
                                            {detailedTab5.map(item => (
                                                <FormControlLabel
                                                    key={item.detailedTypeID}
                                                    control={
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onChange={(e) => handleChangeCheckbox5(item.detailedTypeID, e.target.checked)}
                                                            name={`${item.detailedTypeID}`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    sx={{ margin: '0' }}
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            {item.detailedTitle}
                                                        </Typography>
                                                    }
                                                />
                                            ))}
                                        </FormGroup>
                                    </TabPanel>
                                    <TabPanel value="3" sx={{ padding: '15px 5px', overflowY: "auto" }}>
                                        <FormGroup>
                                            {detailedTab6.map(item => (
                                                <FormControlLabel
                                                    key={item.detailedTypeID}
                                                    control={
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onChange={(e) => handleChangeCheckbox6(item.detailedTypeID, e.target.checked)}
                                                            name={`${item.detailedTypeID}`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    sx={{ margin: '0' }}
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            {item.detailedTitle}
                                                        </Typography>
                                                    }
                                                />
                                            ))}
                                        </FormGroup>
                                    </TabPanel>
                                </TabContext>
                            </div>
                            {detailedTab4.length ?
                                <div className='d-flex justify-content-center'>
                                    <LoadingButton
                                        variant="contained"
                                        color='success'
                                        style={{ margin: '0 2px' }}
                                        onClick={detailedFormik.handleSubmit}
                                        loading={updateResults.isLoading}
                                    // disabled={typeof(createModalData.current) === "undefined"}
                                    >
                                        {t('ثبت')}
                                    </LoadingButton>
                                </div> : null
                            }
                            {detailedFormik.errors.detailedType5 ? (<div className='error-msg'>{t(detailedFormik.errors.detailedType5)}</div>) : null}
                            {detailedFormik.errors.detailedType6 ? (<div className='error-msg'>{t(detailedFormik.errors.detailedType6)}</div>) : null}
                        </Paper>
                    </div>
                </div>
            </form>
            <div>
                <Button variant={'contained'} onClick={callComponent}
                    className="export mt-3">{t('خروجی و چاپ')}</Button>
            </div>
            <Modal
                open={createCodingModalOpen}
                onClose={() => setCreateCodingModalOpen(false)}
            >
                <Box sx={style} style={{ width: "50vw" }}>
                    <CreateCodingModal initData={createModalData.current} closeModal={() => setCreateCodingModalOpen(false)} />
                </Box>
            </Modal>
            <Modal
                open={updateCodingModalOpen}
                onClose={() => setUpdateCodingModalOpen(false)}
            >
                <Box sx={style} style={{ width: "50vw" }}>
                    <UpdateCodingModal initData={updateModalData.current} closeModal={() => setUpdateCodingModalOpen(false)} />
                </Box>
            </Modal>
            <Modal
                open={openRemove}
                onClose={() => setOpenRemove(false)}
            >
                <Box sx={style} style={{ textAlign: 'center', width: '450px', padding: '24px' }}>
                    <img src={trashIcon3} alt={'remove'} className='remove-icon' />
                    <p>
                        {t('با حذف یک کدینگ، تمام زیرمجموعه‌های آن نیز حذف می‌شوند')}
                        <br />
                        {t('آیا از این کار مطمئنید؟')}
                        <br />
                    </p>

                    <div className='d-flex justify-content-center'>
                        <LoadingButton
                            variant="contained"
                            color={'success'}
                            startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={{ margin: '0 2px' }}
                            onClick={() => {
                                deleteCoding(deleteCodingData.current).unwrap()
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }}
                            loadingPosition="start"
                            loading={deleteResults.isLoading}
                        >
                            {t('بله مطمئنم')}
                        </LoadingButton>

                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenRemove(false)}
                        >
                            {t('انصراف')}
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={mergeCodingModalOpen}
                onClose={() => setMergeCodingModalOpen(false)}
            >
                <Box style={{ width: "760px" }} sx={style} className="mergeCodingModal">
                    <MergeCodingModal initData={mergeCodingData.current} closeModal={() => setMergeCodingModalOpen(false)} detailedTypeDatasource={detailedTypeDatasource} />
                </Box>
            </Modal>
            <Modal
                open={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
            >
                <Box sx={settingsModalStyle}>
                    <CodingSettings closeModal={() => setSettingsModalOpen(false)} datasourceLength={codingDatasource.length} />
                </Box>
            </Modal>
        </>
    )
}

export default Coding