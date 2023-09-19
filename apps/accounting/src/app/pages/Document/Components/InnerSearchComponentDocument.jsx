import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useState, useMemo } from "react";
import * as React from "react";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from "react-i18next";
import { parsFloatFunction } from "../../../../utils/parsFloatFunction";
import { CreateQueryString } from "../../../../utils/createQueryString";
import { useSearchCodingQuery } from "../../../../features/slices/customerChosenCodingSlice";
import debounce from "lodash/debounce";
import { useGetDetailedAccount_DetailedTypeIdQuery } from "../../../../features/slices/accountingDocumentSlice";
import { SelectBox } from "devextreme-react";

export default function InnerSearchDocument({ getValues,onClose  }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const [definedAccountOpen, setDefinedAccountOpen] = useState(false);
  const [detailedOpen, setDetailedOpen] = useState(false);
  const [detailedAccountId,setDetailedAccountId] = useState(null);

  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */

  const [moeinSkip, setMoeinSkip] = useState(true);
  const [codingSearchParam, setCodingSearchParam] = useState("");
  const {
    data: codingSearchResult = [],
    isFetching: codingSearchIsFetching,
    error: codingSearchError,
  } = useSearchCodingQuery(codingSearchParam, {
    skip: moeinSkip,
  });
console.log("codingSearchResult",codingSearchResult)
  /* ----------------------------- Search Formiks ----------------------------- */

  const moeinAccountSearchFormik = useFormik({
    initialValues: {
      CompleteCode: "",
      FormersNames: "",
      CodingLevel: 3,
    },
    onSubmit: (values) => {
      setCodingSearchParam(CreateQueryString(values));
      setMoeinSkip(CreateQueryString(values) === "");
    },
  });
console.log("codingSearchParam",codingSearchParam)
  /* ----------------------------- Change Handlers ---------------------------- */
  const HandleMoeinAccountChange = (value) => {
    if (isNaN(value)) {
      moeinAccountSearchFormik.setFieldValue("FormersNames", value);
      moeinAccountSearchFormik.setFieldValue("CompleteCode", "");
    } else {
      moeinAccountSearchFormik.setFieldValue("CompleteCode", value);
      moeinAccountSearchFormik.setFieldValue("FormersNames", "");
    }
  };
  const debouncedMoeinAccountChangeHandler = useMemo(
    () => debounce(moeinAccountSearchFormik.handleSubmit, 500),
    []
  );

  const formik = useFormik({
    initialValues: {
      MoeinAccountId: 0,
      debits: [],
      credits: [],
      Notes: "",
      detailedAccountId: "",
      detailedTypeId: [],
    },
    onSubmit: (values) => {
      getValues(values);
      onClose()
      console.log("values", values);
    },
  });

  

  function HandleDebitsChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(`debits[0]`, parsFloatFunction(temp, 2));
  }
  function HandleDebits2Change(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue(`debits[1]`, parsFloatFunction(temp, 2));
  }

  function HandleCreditsChange(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("credits[0]", parsFloatFunction(temp, 2));
  }

  function HandleCredits2Change(value) {
    let temp = value.replaceAll(",", "");
    formik.setFieldValue("credits[1]", parsFloatFunction(temp, 2));
  }

  // multi select
  const [selectedOptions, setSelectedOptions] = useState(0);
  const [selected, setSelected] = useState([]);

  const { data: accountingDocumentResult } =
    useGetDetailedAccount_DetailedTypeIdQuery(selectedOptions);

  const handleChange = (event) => {
    formik.setFieldValue("detailedTypeId", event.target.value);

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
      console.log(
        "داااااااااااااری چییییییییییییییییی کار میکنننننننننننننننی!!!!!!!!!!"
      );
      console.log("temp", temp);
    }
    setSelectedOptions(temp);
  };
  console.log("selectedOption", selectedOptions);

  const detailedAccount = [
    { title: "تفضیلی4", id: 1, checked: false },
    { title: "تفضیلی5", id: 2, checked: false },
    { title: "تفضیلی6", id: 3, checked: false },
  ];

  const handleCancel = () => {
    onClose(); 
  };
  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          border: "none",
        }}
      >
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ padding: "0" }} className="form-design">
              <div className="row">
                <div className="content col-12">
                  <div className="title">
                    <span> {t("حساب معین")} :</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <Autocomplete
                        componentsProps={{
                          paper: {
                            sx: {
                              width: 300,
                              maxWidth: "90vw",
                              direction: i18n.dir(),
                              position: "absolute",
                              fontSize: "12px",
                              right: i18n.dir() === "rtl" ? "0" : "unset",
                            },
                          },
                        }}
                        sx={{
                          direction: i18n.dir(),
                          position: "relative",
                          background: "#e9ecefd2",
                          borderRadius: 0,
                          fontSize: "12px",
                        }}
                        size="small"
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option?.code}-{option?.formersNames}
                          </Box>
                        )}
                        filterOptions={(options, state) => {
                          let newOptions = [];
                          options?.forEach((element) => {
                            if (
                              element?.code?.includes(
                                state?.inputValue?.toLowerCase()
                              ) ||
                              element?.formersNames?.replace("/", "")
                                .toLowerCase()
                                .includes(state?.inputValue?.toLowerCase())
                            )
                              newOptions?.push(element);
                          });
                          return newOptions;
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        clearText={t("حذف")}
                        forcePopupIcon={false}
                        id="MoeinAccountId"
                        name="MoeinAccountId"
                        open={definedAccountOpen}
                        noOptionsText={t("اطلاعات یافت نشد")}
                        options={codingSearchResult}
                        // options={definedAccountLookupData}
                        getOptionLabel={(option) => option?.formersNames} //          style={{ width: 300 }}
                        onInputChange={(event, value) => {
                          if (value !== "" && event !== null) {
                            setDefinedAccountOpen(true);
                            HandleMoeinAccountChange(value);
                            debouncedMoeinAccountChangeHandler(value);
                          } else {
                            setDefinedAccountOpen(false);
                          }
                        }}
                        onChange={(event, value) => {
                          setDefinedAccountOpen(false);
                          console.log("valueeeeeeeeeeeeeeeemm",value)
                          formik.setFieldValue("MoeinAccountId", value?.codingId);
                        }}
                        onBlur={(e) => {
                          setDefinedAccountOpen(false);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="" variant="outlined" />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="content col-12">
                  <div className="row">
                    <div className="content col-lg-12 col-md-6 col-sx-6">
                      <div className="title">
                        <span> {t("نوع تفضیلی")} :</span>
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
                            value={formik.values?.detailedTypeId}
                            onChange={handleChange}
                            input={<Input />}
                            renderValue={(selected) => {
                              let temp = [];
                              selected?.forEach((item) => {
                                let obj = detailedAccount?.find(
                                  (f) => f.id === item
                                );
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
                            {detailedAccount?.map((item) => (
                              <MenuItem
                                key={item?.id}
                                value={item?.id}
                                sx={{
                                  direction: i18n.dir(),
                                  textAlign:
                                    i18n.dir() === "rtl" ? "right" : "left",
                                }}
                              >
                                <Checkbox
                                  checked={
                                    formik.values?.detailedTypeId?.indexOf(
                                      item?.id
                                    ) > -1
                                  }
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
                    <div className="content col-lg-12 col-md-6 col-sx-6">
                      <div className="title">
                        <span> {t("تفضیلی")} :</span>
                      </div>
                      <div className="wrapper">
                        <SelectBox
                          dataSource={accountingDocumentResult?.data}
                          searchEnabled
                          valueExpr="detailedAccountId"
                          className="selectBox"
                          name="detailedAccountId"
                          displayExpr={function (item) {
                            return (
                              item &&
                              item.detailedAccountCode +
                                "- " +
                                item.detailedAccountName
                            );
                          }}
                          displayValue="detailedAccountId"
                          rtlEnabled={i18n.dir() == "ltr" ? false : true}
                          itemRender={null}
                          placeholder=""
                          onValueChanged={(e) => formik.setFieldValue("detailedAccountId", e.value)}
                        ></SelectBox>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-sx-6">
                  <div className="title">
                    <span> {t("آرتیکل بدهکار از")} :</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="debits"
                        name="debits[0]"
                        value={formik.values.debits[0]}
                        decimalsLimit={2}
                        onChange={(e) => HandleDebitsChange(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-sx-6">
                  <div className="title">
                    <span> {t("تا")} :</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="debits"
                        name="debits[1]"
                        value={formik.values.debits[1]}
                        decimalsLimit={2}
                        onChange={(e) => HandleDebits2Change(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-sx-6">
                  <div className="title">
                    <span> {t("آرتیکل بستانکار از")} :</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="credits"
                        name="credits[0]"
                        value={formik.values.credits[0]}
                        decimalsLimit={2}
                        onChange={(e) => HandleCreditsChange(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-sx-6">
                  <div className="title">
                    <span> {t("تا")} :</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <CurrencyInput
                        className="form-input"
                        style={{ width: "100%" }}
                        id="credits"
                        name="credits[1]"
                        value={formik.values.credits[1]}
                        decimalsLimit={2}
                        onChange={(e) => HandleCredits2Change(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="content col-12">
                  <div className="title">
                    <span> {t("شرح آرتیکل")} :</span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <input
                        className="form-input"
                        name="Notes"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.Notes}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="d-flex justify-content-center">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "0 2px" }}
              onClick={formik.handleSubmit}
            >
              {t("تایید")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={
                i18n.dir() === "rtl"
                  ? { marginRight: "10px" }
                  : { marginLeft: "10px" }
              }
              onClick={handleCancel}
            >
              {t("بازگشت")}
            </Button>
          </div>
    </>
  );
}
