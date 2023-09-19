import { Autocomplete, Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Paper, Tab, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useMergeCodingsMutation, useSearchCodingQuery } from "../../../features/slices/customerChosenCodingSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import swal from "sweetalert";


export default function MergeCodingModal({ closeModal, initData, detailedTypeDatasource }) {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    Redux                                   */
    /* -------------------------------------------------------------------------- */

    /* --------------------------------- Queries -------------------------------- */

    const [destinationCodingSkip, setDestinationCodingSkip] = useState(true)

    const [codingSearchParam, setCodingSearchParam] = useState("")
    const { data: codingSearchResult = [], isFetching: codingSearchIsFetching, error: codingSearchError } = useSearchCodingQuery(codingSearchParam
        , {
            skip: destinationCodingSkip
        }
    );

    /* -------------------------------- Mutations ------------------------------- */
    const [mergeCodings, mergeResults] = useMergeCodingsMutation()
    useEffect(() => {
        if (mergeResults.status == "fulfilled" && mergeResults.isSuccess) {
            MergeSub()
            closeModal()
        }
        else if (mergeResults.isError) {
            let arr = mergeResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",

            });
        }
    }, [mergeResults.status])


    /* -------------------------------- Form Data ------------------------------- */
    const formik = useFormik({
        initialValues: {
            originCodingId: initData.codingId,
            destinationCodingId: "",
            transferAllDetailed: false,
            deleteCodingAfterMerge: false,
            detailedType4: [],
            detailedType5: [],
            detailedType6: []
        },
        validateOnChange: false,
        validationSchema: Yup.object({
            destinationCodingId: Yup.object().required('حساب مقصد باید انتخاب گردد').nullable(true)
                .test(
                    'requiresDetailedTypes', 'با توجه به تفضیل‌پذیر بودن حساب معین، انتخاب حداقل یک نوع تفضیلی الزامی است',
                    (item, testContext) => {
                        return !(testContext.parent.detailedType4.length === 0 && testContext.parent.detailedType5.length === 0 && testContext.parent.detailedType6.length === 0 && (initData.detailedType4Ids.length > 0 || initData.detailedType5Ids.length > 0 && initData.detailedType6Ids.length > 0))
                    }
                )
        }),
        onSubmit: (values) => {
            var destinationCoding = JSON.parse(JSON.stringify(values.destinationCodingId))
            values.destinationCodingId = values.destinationCodingId.codingId
            values.detailedType4 = [... new Set(values.detailedType4)]
            values.detailedType5 = [... new Set(values.detailedType5)]
            values.detailedType6 = [... new Set(values.detailedType6)]

            mergeCodings(values).unwrap()

                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    formik.setFieldValue('destinationCodingId', destinationCoding)
                })
        }
    })
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                 Right Side                                 */
    /* -------------------------------------------------------------------------- */

    /* ------------------- AutoComplete open state and handler ------------------ */
    const [destinationCodingOpen, setDestinationCodingOpen] = useState(false)

    /* ----------------------------- Search Formiks ----------------------------- */

    const destinationCodingSearchFormik = useFormik({
        initialValues: {
            CompleteCode: "",
            FormersNames: "",
            CodingLevel: 3
        },
        onSubmit: (values) => {
            setCodingSearchParam(CreateQueryString(values))
            setDestinationCodingSkip(CreateQueryString(values) === "")
        }
    })

    const HandleDestinationCodingChange = (value) => {
        if (isNaN(value)) {
            destinationCodingSearchFormik.setFieldValue('FormersNames', value)
            destinationCodingSearchFormik.setFieldValue('CompleteCode', "")
        }
        else {
            destinationCodingSearchFormik.setFieldValue('CompleteCode', value)
            destinationCodingSearchFormik.setFieldValue('FormersNames', "")
        }
    }
    const debouncedDestinationCodingChangeHandler = useMemo(
        () => debounce(destinationCodingSearchFormik.handleSubmit, 500)
        , []);
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                  Left Side                                 */
    /* -------------------------------------------------------------------------- */
    const [tabContextValue, setTabContextValue] = useState('1');
    const HandleTabContextChange = (event, newValue) => {
        setTabContextValue(newValue);
    };

    const [detailedTab4, setDetailedTab4] = useState(detailedTypeDatasource);
    const [detailedTab5, setDetailedTab5] = useState(detailedTypeDatasource);
    const [detailedTab6, setDetailedTab6] = useState(detailedTypeDatasource);

    const [enabledCount, setEnabledCount] = useState(0)


    useEffect(() => {
        let counter = 0;
        let temp4 = detailedTypeDatasource.map(item => {
            if (!initData.detailedType4Ids.includes(item.detailedTypeID)) {
                return {
                    ...item,
                    disabled: true
                }
            }
            else {
                counter++
                return {
                    ...item,
                    disabled: false
                }
            }
        })
        let temp5 = detailedTypeDatasource.map(item => {
            if (!initData.detailedType5Ids.includes(item.detailedTypeID)) {
                return {
                    ...item,
                    disabled: true
                }
            }
            else {
                counter++
                return {
                    ...item,
                    disabled: false
                }
            }
        })
        let temp6 = detailedTypeDatasource.map(item => {
            if (!initData.detailedType6Ids.includes(item.detailedTypeID)) {
                return {
                    ...item,
                    disabled: true
                }
            }
            else {
                counter++
                return {
                    ...item,
                    disabled: false
                }
            }
        })
        setDetailedTab4(temp4)
        setDetailedTab5(temp5)
        setDetailedTab6(temp6)
        setEnabledCount(counter)
    }, [detailedTypeDatasource])


    function handleChangeCheckbox4(id, checked) {
        let temp = detailedTab4.map(item => {
            if (item.detailedTypeID === id) {
                if (checked === true) {
                    if (formik.values.detailedType4.length + formik.values.detailedType5.length + formik.values.detailedType6.length + 1 === enabledCount) {
                        formik.setFieldValue('transferAllDetailed', checked)
                    }
                    formik.setFieldValue('detailedType4', [...formik.values.detailedType4, item.detailedTypeID])
                }
                else {
                    let temp = formik.values.detailedType4.filter((removingItem) => removingItem !== item.detailedTypeID)
                    formik.setFieldValue('detailedType4', temp)
                }
                return {
                    ...item,
                    selected: checked,
                }
            }
            return item
        })
        setDetailedTab4(temp)

        if (checked === false) {
            formik.setFieldValue('transferAllDetailed', checked)
            formik.setFieldValue('deleteCodingAfterMerge', checked)
        }

    }

    function handleChangeCheckbox5(id, checked) {
        let temp = detailedTab5.map(item => {
            if (item.detailedTypeID === id) {
                if (checked === true) {
                    if (formik.values.detailedType4.length + formik.values.detailedType5.length + formik.values.detailedType6.length + 1 === enabledCount) {
                        formik.setFieldValue('transferAllDetailed', checked)
                    }
                    formik.setFieldValue('detailedType5', [...formik.values.detailedType5, item.detailedTypeID])
                }
                else {
                    let temp = formik.values.detailedType5.filter((removingItem) => removingItem !== item.detailedTypeID)
                    formik.setFieldValue('detailedType5', temp)
                }
                return {
                    ...item,
                    selected: checked,
                }
            }
            return item
        })
        setDetailedTab5(temp)

        if (checked === false) {
            formik.setFieldValue('transferAllDetailed', checked)
            formik.setFieldValue('deleteCodingAfterMerge', checked)
        }
    }

    function handleChangeCheckbox6(id, checked) {
        let temp = detailedTab6.map(item => {
            if (item.detailedTypeID === id) {
                if (checked === true) {
                    if (formik.values.detailedType4.length + formik.values.detailedType5.length + formik.values.detailedType6.length + 1 === enabledCount) {
                        formik.setFieldValue('transferAllDetailed', checked)
                    }
                    formik.setFieldValue('detailedType6', [...formik.values.detailedType6, item.detailedTypeID])
                }
                else {
                    let temp = formik.values.detailedType6.filter((removingItem) => removingItem !== item.detailedTypeID)
                    formik.setFieldValue('detailedType6', temp)
                }
                return {
                    ...item,
                    selected: checked,
                }
            }
            return item
        })
        setDetailedTab6(temp)

        if (checked === false) {
            formik.setFieldValue('transferAllDetailed', checked)
            formik.setFieldValue('deleteCodingAfterMerge', checked)
        }
    }

    function SelectAllCheckboxes(e) {
        if (e.target.checked) {
            let temp4 = detailedTab4.map(item => {
                if (item.disabled === false) {
                    formik.setFieldValue('detailedType4', [...formik.values.detailedType4, item.detailedTypeID])
                    return {
                        ...item,
                        selected: true
                    }
                }
                else {
                    return item
                }
            })
            setDetailedTab4(temp4)

            let temp5 = detailedTab5.map(item => {
                if (item.disabled === false) {
                    formik.setFieldValue('detailedType5', [...formik.values.detailedType5, item.detailedTypeID])
                    return {
                        ...item,
                        selected: true
                    }
                }
                else {
                    return item
                }
            })
            setDetailedTab5(temp5)

            let temp6 = detailedTab6.map(item => {
                if (item.disabled === false) {
                    formik.setFieldValue('detailedType6', [...formik.values.detailedType6, item.detailedTypeID])
                    return {
                        ...item,
                        selected: true
                    }
                }
                else {
                    return item
                }
            })
            setDetailedTab6(temp6)
        }
        else {
            formik.setFieldValue('deleteCodingAfterMerge', false)
        }
    }

    /* -------------------------------------------------------------------------- */

    /* ------------------------------- SweetAlerts ------------------------------ */
    const MergeSub = () => {
        swal({
            title: t("تغییرات کدینگ با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه"),
            className: "small-error"
        });
    }


    return (
        <>
            <div
                className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                <div className="title mb-0"> {t("ادغام حسابها")} </div>
                <button type='button' className='close-btn' onClick={() => closeModal()}>
                    <CloseIcon />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit} style={{ marginTop: '15px' }}>
                <div className="form-design">
                    <div className="row">
                        <div className="content col-lg-6 col-12">
                            <div className="row">
                                <div className="content col-12">
                                    <div className="title">
                                        <span> {t("حساب مبدا")} </span>
                                    </div>
                                    <div className="wrapper">
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                id='originCodingId'
                                                name='originCodingId'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={initData.formersNames}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="content col-12">
                                    <div className="title">
                                        <span> {t("حساب مقصد")} </span>
                                    </div>
                                    <div className="wrapper">
                                        <div
                                            className={`table-autocomplete position-relative`}>
                                            <Autocomplete
                                                componentsProps={{
                                                    paper: {
                                                        sx: {
                                                            width: 300,
                                                            maxWidth: '90vw',
                                                            direction: i18n.dir(),
                                                            position: "absolute",
                                                            fontSize: '12px',
                                                            right: i18n.dir() === "rtl" ? "0" : "unset"
                                                        }
                                                    }
                                                }}
                                                sx={
                                                    {
                                                        direction: i18n.dir(),
                                                        position: "relative",
                                                        background: '#FFFFFF',
                                                        borderRadius: 0,
                                                        fontSize: '12px'
                                                    }

                                                }
                                                size="small"
                                                renderOption={(props, option) => {
                                                    return (
                                                        <Box
                                                            component="li" {...props} key={option.completeCode}>
                                                            {option.completeCode}-{option.formersNames}
                                                        </Box>
                                                    )
                                                }}
                                                filterOptions={(options, state) => {
                                                    let newOptions = [];
                                                    options.forEach((element) => {
                                                        if (
                                                            element.completeCode.includes(state.inputValue.toLowerCase()) ||
                                                            element.formersNames.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                        )
                                                            newOptions.push(element);
                                                    });
                                                    return newOptions;
                                                }}
                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                disableClearable={true}
                                                forcePopupIcon={false}
                                                id="destinationCodingId"
                                                name={`destinationCodingId`}
                                                open={destinationCodingOpen}
                                                noOptionsText={t("اطلاعات یافت نشد")}
                                                options={codingSearchResult}
                                                getOptionLabel={option => option.formersNames}
                                                loading
                                                loadingText={codingSearchIsFetching ? <CircularProgress /> : t("اطلاعات یافت نشد")}
                                                onInputChange={(event, value) => {
                                                    if (value !== "" && event !== null) {
                                                        setDestinationCodingOpen(true)
                                                        HandleDestinationCodingChange(value)
                                                        debouncedDestinationCodingChangeHandler(value)
                                                    } else {
                                                        setDestinationCodingOpen(false)
                                                    }
                                                }}
                                                onChange={(event, value) => {
                                                    setDestinationCodingOpen(false)
                                                    formik.setFieldValue('destinationCodingId', value)
                                                }}
                                                onBlur={(e) => {
                                                    setDestinationCodingOpen(false)
                                                }}
                                                renderInput={params => (
                                                    <TextField {...params}
                                                        label=""
                                                        variant="outlined" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {formik.touched.destinationCodingId && formik.errors.destinationCodingId && !!formik.values.destinationCodingId ? (
                                        <div className='error-msg'>{t(formik.errors.destinationCodingId)}</div>) : null}
                                </div>
                                <div className="col-12">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => {
                                                    formik.setFieldValue("transferAllDetailed", e.target.checked)
                                                    SelectAllCheckboxes(e)
                                                }}
                                                onBlur={formik.handleBlur}
                                                name="transferAllDetailed"
                                                color="primary"
                                                size="small"
                                                id="transferAllDetailed"
                                                checked={formik.values.transferAllDetailed}
                                            />
                                        }
                                        sx={{ margin: '0' }}
                                        label={
                                            <Typography variant="h6">
                                                {t("انتقال تمام تفضیلی‌ها")}
                                            </Typography>
                                        }
                                    />
                                </div>
                                <div className="col-12">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => {
                                                    formik.setFieldValue("deleteCodingAfterMerge", e.target.checked)
                                                }}
                                                onBlur={formik.handleBlur}
                                                name="deleteCodingAfterMerge"
                                                color="primary"
                                                size="small"
                                                id="deleteCodingAfterMerge"
                                                disabled={!Boolean(formik.values.transferAllDetailed)}
                                                checked={formik.values.deleteCodingAfterMerge}
                                            />
                                        }
                                        sx={{ margin: '0' }}
                                        label={
                                            <Typography variant="h6">
                                                {t("حذف حساب مبدا پس از ادغام")}
                                            </Typography>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="content col-lg-6 col-12">
                            <Paper elevation={2} className='paper-pda' sx={{ height: '100%' }}>
                                <div className='selectable folder-tabs flex-column'>
                                    <TabContext value={tabContextValue}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={HandleTabContextChange} aria-label="access form"
                                                TabIndicatorProps={{ sx: { display: 'none' } }}
                                                sx={{
                                                    '& .MuiTabs-flexContainer': {
                                                        flexWrap: 'wrap',
                                                    },
                                                }}

                                            >
                                                <Tab label={t('سطح چهارم')} value="1" disabled={!detailedTypeDatasource.length} />
                                                <Tab label={t('سطح پنجم')} value="2" disabled={!detailedTypeDatasource.length} />
                                                <Tab label={t('سطح ششم')} value="3" disabled={!detailedTypeDatasource.length} />
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
                                                                disabled={item.disabled}
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
                                                                disabled={item.disabled}
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
                                                                disabled={item.disabled}
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
                            </Paper>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center' style={{ marginTop: "30px" }}>
                        <LoadingButton
                            variant="contained"
                            color='success'
                            type="button"
                            style={{ margin: '0 2px' }}
                            onClick={formik.handleSubmit}
                        //    loading={createResults.isLoading}
                        >
                            {t('تایید')}
                        </LoadingButton>
                        <Button
                            variant="outlined"
                            color='error'
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => closeModal()}
                        >{t('بازگشت')}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}