import { useEffect, useMemo, useState } from "react";
import { useGetAllProfitAndLossCodingsWithNonZeroBalanceQuery } from "../../../features/slices/customerChosenCodingSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete, Box, Button, CircularProgress, TextField, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import { SelectBox } from "devextreme-react";
import { LoadingButton } from "@mui/lab";
import { CreateQueryString } from "../../../utils/createQueryString";
import { debounce } from "lodash";
import { useGetChooseByDetailedPartialArticlesQuery, useSearchDetailedAccountQuery } from "../../../features/slices/detailedAccountSlice";

const detailedLevelList = [
    { Name: 'سطح چهار', Level: 4 },
    { Name: 'سطح پنج', Level: 5 },
    { Name: 'سطح شش', Level: 6 }
]


export default function ChooseByDetailedModal({ getData, closeModal }) {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                              RTKQuery / Redux                              */
    /* -------------------------------------------------------------------------- */
    const [detailedSkip, setDetailedSkip] = useState(true)
    const [partialArticlesSkip, setPartialArticlesSkip] = useState(true)
    /* --------------------------------- Queries -------------------------------- */
    const [detailedSearchParam, setDetailedSearchParam] = useState("")
    const { data: detailedSearchResult = [], isFetching: detailedSearchIsFetching, error: detailedSearchError } = useSearchDetailedAccountQuery(detailedSearchParam
        , {
            skip: detailedSkip
        }
    );

    const [partialArticlesSearchParam, setPartialArticlesSearchParam] = useState("")
    const { data: partialArticles, isFetching: partialArticlesIsFetching, error: partialArticlesError } = useGetChooseByDetailedPartialArticlesQuery(partialArticlesSearchParam
        , {
            skip: partialArticlesSkip,
            refetchOnMountOrArgChange: true
        })
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                AutoComplete                                */
    /* -------------------------------------------------------------------------- */
    const [detailedAccountOpen, setDetailedAccountOpen] = useState(false)


    /* -------------------------------------------------------------------------- */

    /* ------------------------------ Search Formik ----------------------------- */
    const detailedAccountSearchFormik = useFormik({
        initialValues: {
            DetailedAccountCode: "",
            DetailedAccountName: ""
        },
        onSubmit: (values) => {
            setDetailedSearchParam(CreateQueryString(values))
            setDetailedSkip(CreateQueryString(values) === "")
        }
    })

    const HandleDetailedAccountChange = (value) => {
        if (isNaN(value)) {
            detailedAccountSearchFormik.setFieldValue('DetailedAccountName', value)
            detailedAccountSearchFormik.setFieldValue('DetailedAccountCode', "")
        }
        else {
            detailedAccountSearchFormik.setFieldValue('DetailedAccountCode', value)
            detailedAccountSearchFormik.setFieldValue('DetailedAccountName', "")
        }
    }
    const debouncedHandleDetailedAccountChange = useMemo(
        () => debounce(detailedAccountSearchFormik.handleSubmit, 500)
        , []);
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const formik = useFormik({
        initialValues: {
            DetailedAccountId: 0,
            DetailedLevel: 4
        },
        validationSchema: Yup.object({
            DetailedAccountId: Yup.number().required("انتخاب یک تفضیلی الزامی است"),
            DetailedLevel: Yup.number().required("انتخاب سطح تفضیلی الزامی است")
        }),
        onSubmit: (values) => {
            setPartialArticlesSearchParam(CreateQueryString(values))
            setPartialArticlesSkip(CreateQueryString(values) === "")
        }
    })

    useEffect(() => {
        if (!partialArticlesIsFetching && !partialArticlesError && typeof (partialArticles) === "object") {
            getData(partialArticles)
            closeModal()
        }
    }, [partialArticlesIsFetching])


    /* -------------------------------------------------------------------------- */
    return (
        <>
            <div
                className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                <div className="title mb-0"> {t("انتخاب با تفضیلی")} </div>
                <button type='button' className='close-btn' onClick={() => closeModal()}>
                    <CloseIcon />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-design">
                    <div className="row">
                        <div className="content col-lg-6 col-md-6 col-12">
                            <div className="title">
                                <span> {t("حساب تفضیلی")} <span className='star'>*</span> </span>
                            </div>
                            <div className="wrapper">
                                <div>
                                    <Autocomplete
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li" {...props} key={option.detailedAccountId}>
                                                {option.detailedAccountCode}-({option.detailedAccountName})
                                            </Box>
                                        )}
                                        filterOptions={(options, state) => {
                                            let newOptions = [];
                                            options.forEach((element) => {
                                                if (
                                                    element.detailedAccountCode.includes(state.inputValue.toLowerCase()) ||
                                                    element.detailedAccountName.replace("/", "").toLowerCase().includes(state.inputValue.toLowerCase())
                                                )
                                                    newOptions.push(element);
                                            });
                                            return newOptions;
                                        }}
                                        isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                        componentsProps={{
                                            paper: {
                                                sx: {
                                                    width: '100%',
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
                                                fontSize: '12px',
                                            }
                                        }
                                        size="small"
                                        disableClearable={true}
                                        forcePopupIcon={false}
                                        id="DetailedAccountId"
                                        name={`DetailedAccountId`}
                                        open={detailedAccountOpen}
                                        noOptionsText={t("اطلاعات یافت نشد")}
                                        options={detailedSearchResult}
                                        getOptionLabel={option => option.detailedAccountCode + " - " + option.detailedAccountName}
                                        loading
                                        loadingText={detailedSearchIsFetching ? <CircularProgress /> : t("اطلاعات یافت نشد")}
                                        onInputChange={(event, value) => {
                                            if (value !== "" && event !== null) {
                                                setDetailedAccountOpen(true)
                                                HandleDetailedAccountChange(value)
                                                debouncedHandleDetailedAccountChange(value)
                                            } else {
                                                setDetailedAccountOpen(false)
                                            }
                                        }}
                                        onChange={(event, value) => {
                                            setDetailedAccountOpen(false)
                                            formik.setFieldValue(`DetailedAccountId`, value.detailedAccountId)
                                        }}
                                        onBlur={(e) => setDetailedAccountOpen(false)}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input type="text" {...params.inputProps} className="form-input" />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="content col-lg-6 col-md-6 col-12">
                            <div className="title">
                                <span> {t("انتخاب سطح")} </span>
                            </div>
                            <div className='wrapper'>
                                <div>
                                    <SelectBox
                                        dataSource={detailedLevelList}
                                        rtlEnabled={i18n.dir() === "rtl"}
                                        onValueChanged={(e) => {
                                            formik.setFieldValue('DetailedLevel', e.value)
                                        }}
                                        className='selectBox'
                                        noDataText={t("اطلاعات یافت نشد")}
                                        displayExpr={'Name'}
                                        valueExpr="Level"
                                        // value={formik.values.detailedLevel}
                                        itemRender={null}
                                        placeholder=''
                                        name='DetailedLevel'
                                        id='DetailedLevel'
                                        defaultValue={detailedLevelList[0].Level}
                                    />
                                </div>
                                {formik.touched.DetailedLevel && formik.errors.DetailedLevel && !formik.values.DetailedLevel ? (<div className='error-msg'>{t(formik.errors.detailedLevel)}</div>) : null}
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center' style={{ marginTop: "30px" }}>
                        <LoadingButton
                            variant="contained"
                            color='success'
                            type="button"
                            style={{ margin: '0 2px' }}
                            onClick={formik.handleSubmit}
                            loading={partialArticlesIsFetching}
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