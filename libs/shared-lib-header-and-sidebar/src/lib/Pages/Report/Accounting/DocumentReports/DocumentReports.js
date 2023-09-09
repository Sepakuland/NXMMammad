import { Button, CircularProgress, Paper, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import {
  renderCalendarLocaleSwitch,
  renderCalendarSwitch,
} from "../../../../utils/calenderLang";
import { julianIntToDate } from "../../../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TreeView } from "devextreme-react";
import swal from "sweetalert";
import * as Yup from "yup";
import {
  useAddAutoCodingMutation,
  useFetchCodingsQuery,
} from "../../../../features/slices/customerChosenCodingSlice";
import { useGetAllDocumentDefinitionQuery } from "../../../../features/slices/DocumentDefinitionSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { CreateQueryString } from "../../../../utils/createQueryString";
import ArticlesGrid from "./Components/ArticleGrid";
import DocumentGrid from "./Components/DocumentGrid";
import { useGetAllAccountingDocumentsArticleByDocumentIdQuery } from "../../../../features/slices/accountingDocumentSlice";

const DocumentReports = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [content, setContent] = useState("");
  const [querySearchParams, setQuerySearchParams] = useState("");
  // const [openRemove, setOpenRemove] = useState(false);
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const [data2, setData2] = useState([]);
  const data2Ref = useRef();
  data2Ref.current = data2;
  const navigate = useNavigate();
  const [skip, setSkip] = useState(true);
  const [skipArticle, setSkipArticle] = useState(true);
  const [total, setTotal] = useState(0);
  const [SearchParams] = useSearchParams();
  const id = SearchParams.get("id");

  ///////Form starts here
  const startDateRef = useRef();
  const endDateRef = useRef();
  const [date, setDate] = useState(new DateObject());
  const [date2, setDate2] = useState(new DateObject());
  const documentCodeRegMatch = /^[+]?\d*$/;
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [showArticles, setShowArticles] = useState(false);
  const formik = useFormik({
    initialValues: {
      DocumentDate: [
        julianIntToDate(new DateObject().toJulianDay()),
        julianIntToDate(new DateObject().toJulianDay()),
      ],
      DocumentNumber: [],
      DocumentTypeId: [],
      showArticles: false,
      MoeinAccountId:[]
    },
    onSubmit: (values) => {
      console.log("here", values);
      getQuery(values);
    },
  });
  const handleCancel = () => {
    // onClose();
    console.log("cancelllll");
  };

  function getQuery(value) {
    setQuerySearchParams(CreateQueryString(value));
  }

  console.log("mammad", formik.values);

  const {
    data: documentDefinitionList = [],
    isFetching: documentDefinitionlistIsFetching,
    error: documentDefinitionListError,
  } = useGetAllDocumentDefinitionQuery();
  console.log("documentDefinitionList", documentDefinitionList);

  const [expandedNode, setExpandedNode] = useState([]);
  const [expandedNodeStatus, setExpandedNodeStatus] = useState([]);
  useEffect(() => {
    let expTemp = codingDatasource.map((item) => ({
      codingId: item.codingId,
      expanded: item?.expanded || false,
    }));
    setExpandedNodeStatus(expTemp);
  }, [expandedNode]);

  /* ------------------------------- SweetAlerts ------------------------------ */
  const CodingSub = () => {
    swal({
      title: t("کدینگ با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };
  const CodingDetailedSub = () => {
    swal({
      title: t("تغییرات تفضیلی‌ها با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };
  const CreateOnMoeinError = () => {
    swal({
      title: t(
        "زیر مجموعه حساب های معین(تفضیلی) را میتوانید از منوی مربوط به آن در اطلاعات پایه اضافه کنید"
      ),
      icon: "error",
      button: t("باشه"),
      className: "small-error",
    });
  };
  const NoEditTreeheadError = () => {
    swal({
      title: t("مورد انتخاب شده قابل ویرایش نیست"),
      icon: "error",
      button: t("باشه"),
      className: "small-error",
    });
  };
  /* -------------------------------------------------------------------------- */
  // const [updateCodingDetailedMatch, updateResults] = useUpdateCodingDetailedMatchMutation()

  /* -------------------------------------------------------------------------- */

  /* -------------------------- CustomerChosenCoding -------------------------- */
  const [customerChosenCodingContent, setCustomerChosenCodingContent] =
    useState("");
  const {
    data: codingRes = [],
    isFetching: codingIsFetching,
    error: codingError,
  } = useFetchCodingsQuery();
  useEffect(() => {
    if (codingIsFetching) {
      setCustomerChosenCodingContent(<CircularProgress />);
    } else if (codingError) {
      setCustomerChosenCodingContent(t("خطایی رخ داده است"));
    } else {
      //Fulfilled
      setCustomerChosenCodingContent("");
      let displayNames = codingRes.map((item) => {
        if (item.completeCode !== "") {
          return {
            ...item,
            displayName: item.completeCode + " - " + item.name,
          };
        } else {
          return {
            ...item,
            displayName: item.name,
          };
        }
      });
      let temp = displayNames.map((item) => {
        let t = expandedNodeStatus.filter(
          (f) => f.codingId === item.codingId
        )[0];
        if (item.codingParentId == 0) {
          return {
            ...item,
            expanded: true,
          };
        } else {
          return {
            ...item,
            expanded: t?.expanded || false,
          };
        }
      });
      setCodingDatasource(temp);
    }
  }, [codingIsFetching]);

  const [addAutoCoding, addResults] = useAddAutoCodingMutation();
  /*                        Right Side (Coding Treeview)                        */
  /* -------------------------------------------------------------------------- */

  const [codingDatasource, setCodingDatasource] = useState([]);

  const createModalData = useRef();
  const [createCodingModalOpen, setCreateCodingModalOpen] = useState(false);
  function OpenCreateCodingModal() {
    console.log("createModal", createModalData.current);
    if (createModalData.current.codingLevel < 3) {
      setCreateCodingModalOpen(true);
    } else {
      CreateOnMoeinError();
    }
  }

  const updateModalData = useRef();
  const [updateCodingModalOpen, setUpdateCodingModalOpen] = useState(false);
  function OpenUpdateCodingModal() {
    if (updateModalData.current.codingLevel > 0) {
      setUpdateCodingModalOpen(true);
    } else {
      NoEditTreeheadError();
    }
  }

  const deleteCodingData = useRef();
  const [openRemove, setOpenRemove] = useState(false);

  const mergeCodingData = useRef({ codingLevel: 0 });
  const [mergeCodingModalOpen, setMergeCodingModalOpen] = useState(false);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const settingsModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: "background.paper",
    border: "1px solid #eee",
    boxShadow: 24,
    direction: i18n.dir(),
  };

  /* --------------------------- Treeview Functions --------------------------- */
  const contextMenuRef = useRef();
  // console.log('contextMenuRef', contextMenuRef)
  // console.log('contextMenuRef', !!contextMenuRef.current)
  // console.log(contextMenuRef.current?.instance?.option("items")[3].disabled)

  function setModalInfo(e) {
    updateModalData.current = e.itemData;
    createModalData.current = e.itemData;
    deleteCodingData.current = e.itemData.codingId;
    mergeCodingData.current = e.itemData;

    const isMoein = e.itemData.codingLevel === 3;
    contextMenuRef.current.instance.option("items[3].disabled", !isMoein);
    // console.log("updateModalData",updateModalData.current,"createModalData",createModalData.current,"deleteCodingData",deleteCodingData.current,"mergeCodingData",mergeCodingData.current)
    //    let items=document.querySelectorAll('.clicked-item-bg')
    //     items.forEach(item=>{
    //         item.classList.remove('clicked-item-bg')
    //     })

    //     e.itemElement.classList.add('clicked-item-bg')
  }

  function handleItemClick(e) {
    setValue("1");
    setModalInfo(e);
    if (e.itemData.codingLevel === 3) {
      detailedFormik.setFieldValue("codingId", e.itemData.codingId);
      let tempCoding4 = [];
      let tempCoding5 = [];
      let tempCoding6 = [];

      let temp4 = detailedTypeDatasource.map((item) => {
        if (e.itemData.detailedType4Ids.includes(item.detailedTypeID)) {
          tempCoding4.push(item.detailedTypeID);
          return {
            ...item,
            selected: true,
          };
        } else {
          return item;
        }
      });

      let temp5 = detailedTypeDatasource.map((item) => {
        if (e.itemData.detailedType5Ids.includes(item.detailedTypeID)) {
          tempCoding5.push(item.detailedTypeID);
          return {
            ...item,
            selected: true,
          };
        } else {
          return item;
        }
      });

      let temp6 = detailedTypeDatasource.map((item) => {
        if (e.itemData.detailedType6Ids.includes(item.detailedTypeID)) {
          tempCoding6.push(item.detailedTypeID);
          return {
            ...item,
            selected: true,
          };
        } else {
          return item;
        }
      });

      detailedFormik.setFieldValue("detailedType4", tempCoding4);
      detailedFormik.setFieldValue("detailedType5", tempCoding5);
      detailedFormik.setFieldValue("detailedType6", tempCoding6);
      setDetailedTab4(temp4);
      setDetailedTab5(temp5);
      setDetailedTab6(temp6);
    } else {
      detailedFormik.setFieldValue("codingId", 0);
      detailedFormik.setFieldValue("detailedType4", []);
      detailedFormik.setFieldValue("detailedType5", []);
      detailedFormik.setFieldValue("detailedType6", []);
      setDetailedTab4([]);
      setDetailedTab5([]);
      setDetailedTab6([]);
    }
  }

  const detailedFormik = useFormik({
    initialValues: {
      codingId: 0,
      detailedType4: [],
      detailedType5: [],
      detailedType6: [],
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      detailedType5: Yup.array().test(
        "4IsNotEmpty",
        "انتخاب تفضیلی سطح 5 بدون انتخاب تفضیلی سطح 4 امکان‌پذیر نیست",
        (item, testContext) => {
          return (
            item.length == 0 || testContext.parent.detailedType4.length !== 0
          );
        }
      ),
      detailedType6: Yup.array().test(
        "5IsNotEmpty",
        "انتخاب تفضیلی سطح 6 بدون انتخاب تفضیلی سطح 5 امکان‌پذیر نیست",
        (item, testContext) => {
          return (
            item.length == 0 || testContext.parent.detailedType5.length !== 0
          );
        }
      ),
    }),
    onSubmit: (values) => {
      // updateCodingDetailedMatch(values).unwrap()
      //     .catch((error) => {
      //         console.error(error)
      //     })
      CodingDetailedSub();
    },
  });

  const [detailedTab4, setDetailedTab4] = useState([]);
  const [detailedTab5, setDetailedTab5] = useState([]);
  const [detailedTab6, setDetailedTab6] = useState([]);

  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [detailedTypeDatasource, setDetailedTypeDatasource] = useState([]);
  const treeViewRef = useRef();
  function syncTreeViewSelection(e) {
    const treeView =
      (e.component.selectItem && e.component) ||
      (treeViewRef && treeViewRef.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        const values = e.value || formik.values.MoeinAccountId;
        values &&
          values.forEach((value) => {
            treeView.selectItem(value);
          });
      }
    }

    if (e.value !== undefined) {
      formik.setFieldValue("MoeinAccountId", e.value);
    }
  }
  function treeViewItemSelectionChanged(e) {
    formik.setFieldValue("MoeinAccountId", e.component.getSelectedNodeKeys());
  }

  // ***********************************Queryies**********************************

  const fiscalYear = useSelector(
    (state) => state.reducer.fiscalYear.fiscalYearId
  );

  
  const {
    data: accountingDocumentArticlesResult = {data: []},
    isFetching: accountingDocumentArticlesIsFetching,
    error: accountingDocumentArticlesError,
    currentData: AccountDocumentsArticleCurrentData,
  } = useGetAllAccountingDocumentsArticleByDocumentIdQuery({ obj: obj, query: querySearchParams }
    , {
    skip: skip,
  }
  );

  useEffect(() => {
    if (accountingDocumentArticlesIsFetching) {
      setContent(<CircularProgress />);
    } else if (accountingDocumentArticlesError) {
      setContent(t("خطایی رخ داده است"));
    } else {
      setContent("");
      if (!!accountingDocumentArticlesResult?.header) {
        let pagination = JSON.parse(accountingDocumentArticlesResult?.header);
        setTotal(pagination.totalCount);
      }
  
      let tempData = accountingDocumentArticlesResult.data.map((data) => {
        let documentState;
        if (data.documentState === 1) {
          documentState = "قطعی";
        } else if (data.documentState === 0) {
          documentState = "غیر قطعی";
        } else {
          documentState = "دائمی";
        }
        let documentArticlesData = data.documentArticles.map((item)=>{
          return{
            "moeinAccountId":item.moeinAccountId,
            "detailed4Id":item.detailed4Id,
            "detailed5Id":item.detailed5Id,
            "detailed6Id":item.detailed6Id,
            "debits":item.debits,
            "credits":item.credits,
            "notes":item.notes,
          }
        })
        console.log("documentArticlesData",documentArticlesData)
        return {
          ...data,
          "documentNumber": data.documentNumber,
          "documentDate": new Date(data.documentDate),
          "documentTypeId": data.documentDefinitionName,
          "refNumber": data.refNumber,
          "createdByUser": data.createdByUser,
          "folioNumber": data.folioNumber,
          "subsidiaryNumber": data.subsidiaryNumber,
          "dailyNumber": data.dailyNumber,
          "modifiedByUser": data.modifiedByUser,
          "documentState": documentState,
          "documentDescription": data.documentDescription,
          "documentArticles":documentArticlesData
        };
      });
      setData(tempData);
    }
  }, [accountingDocumentArticlesIsFetching,accountingDocumentArticlesResult,AccountDocumentsArticleCurrentData]);


  


  useEffect(() => {
    if (fiscalYear !== 0 && formik.values.showArticles === false) {
      setSkip(false);
    } else if (fiscalYear !== 0 && formik.values.showArticles === true) {
      setSkipArticle(false);
    }
  }, [fiscalYear, formik.values.showArticles]);







  let articleTemp = [];

  // article grid


  console.log("accountingDocumentArticlesResult.data",accountingDocumentArticlesResult.data)

  // temp column


  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          border: "none",
        }}
      >
        <div>
          <div style={{ marginBottom: "10px" }}>
            <form onSubmit={formik.handleSubmit}>
              <div style={{ paddingTop: "15px", background: "#eff2f6" }}>
                <div className="row">
                  <div className="content col-lg-8 col-md-6 col-12">
                    <Paper
                      elevation={2}
                      className="paper-pda"
                      sx={{
                        height: "30vh",
                        overflowY: "scroll",
                        overflowX: "hidden",
                      }}
                    >
                      <div className="row justify-content-center">
                        <div
                          className="content col-lg-5 col-md-6 col-12"
                          onFocus={() => {
                            endDateRef?.current?.closeCalendar();
                          }}
                        >
                          <div className="title">
                            <span> {t("تاریخ از")} :</span>
                          </div>
                          <div className="wrapper">
                            <div className="date-picker position-relative">
                              <DatePicker
                                name="startDate"
                                id="startDate"
                                ref={startDateRef}
                                value={
                                  formik?.values?.DocumentDate[0]
                                    ? new DateObject(
                                        formik?.values?.DocumentDate[0]
                                      )
                                    : ""
                                }
                                calendar={renderCalendarSwitch(i18n.language)}
                                locale={renderCalendarLocaleSwitch(
                                  i18n.language
                                )}
                                calendarPosition="bottom-right"
                                onBlur={formik.handleBlur}
                                onChange={(val) => {
                                  setDate(val);
                                  formik.setFieldValue(
                                    `DocumentDate[0]`,
                                    julianIntToDate(val.toJulianDay())
                                  );
                                }}
                              />
                              <div
                                className={`modal-action-button  ${
                                  i18n.dir() === "ltr" ? "action-ltr" : ""
                                }`}
                              >
                                <div className="d-flex align-items-center justify-content-center">
                                  <CalendarMonthIcon className="calendarButton" />
                                </div>
                              </div>
                            </div>
                            {formik?.touched?.DocumentDate &&
                            formik?.touched?.DocumentDate[0] &&
                            formik?.errors?.DocumentDate &&
                            formik?.errors?.DocumentDate[0] ? (
                              <div className="error-msg">
                                {t(formik?.errors?.DocumentDate[0])}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div
                          className="content col-lg-5 col-md-6 col-12"
                          onFocus={() => {
                            startDateRef?.current?.closeCalendar();
                          }}
                        >
                          <div className="title">
                            <span> {t("تا")} :</span>
                          </div>
                          <div className="wrapper">
                            <div className="date-picker position-relative">
                              <DatePicker
                                name="dateEnd"
                                id="dateEnd"
                                value={
                                  formik.values.DocumentDate[1]
                                    ? new DateObject(
                                        formik.values.DocumentDate[1]
                                      )
                                    : ""
                                }
                                ref={endDateRef}
                                calendar={renderCalendarSwitch(i18n.language)}
                                disabled={!formik.values.DocumentDate[0]}
                                minDate={
                                  new Date(formik.values.DocumentDate[0])
                                }
                                locale={renderCalendarLocaleSwitch(
                                  i18n.language
                                )}
                                calendarPosition="bottom-right"
                                onBlur={formik.handleBlur}
                                onChange={(val) => {
                                  setDate2(val);
                                  formik.setFieldValue(
                                    "DocumentDate[1]",
                                    julianIntToDate(val.toJulianDay())
                                  );
                                }}
                              />
                              <div
                                className={`modal-action-button  ${
                                  i18n.dir() === "ltr" ? "action-ltr" : ""
                                }`}
                              >
                                <div className="d-flex align-items-center justify-content-center">
                                  <CalendarMonthIcon className="calendarButton" />
                                </div>
                              </div>
                            </div>
                            {/* {formik?.touched?.DocumentDate[1] && formik?.errors?.DocumentDate[1] ? (<div className='error-msg'>{t(formik?.errors?.DocumentDate[1])}</div>) : null} */}
                          </div>
                        </div>
                        <div className="content col-lg-5 col-md-6 col-12">
                          <div className="title">
                            <span> {t("شماره سند از")} :</span>
                          </div>
                          <div className="wrapper">
                            <div
                              style={{ padding: "0 0" }}
                              className="form-design"
                            >
                              <input
                                className="form-input"
                                name="DocumentNumber[0]"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.DocumentNumber[0]}
                                autoComplete="off"
                              />
                              {formik.touched.DocumentNumber &&
                              formik.errors.DocumentNumber &&
                              formik.errors.DocumentNumber[0] ? (
                                <div className="error-msg">
                                  {t(formik.errors.DocumentNumber[0])}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className="content col-lg-5 col-md-6 col-12"
                          onFocus={() => {
                            endDateRef?.current?.closeCalendar();
                          }}
                        >
                          <div className="title">
                            <span> {t("تا")} :</span>
                          </div>
                          <div className="wrapper">
                            <div
                              style={{ padding: "0 0" }}
                              className="form-design"
                            >
                              <input
                                className="form-input"
                                name="DocumentNumber[1]"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.DocumentNumber[1]}
                                autoComplete="off"
                              />
                              {formik.touched.DocumentNumber &&
                              formik.errors.DocumentNumber &&
                              formik.errors.DocumentNumber[1] ? (
                                <div className="error-msg">
                                  {t(formik.errors.DocumentNumber[1])}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="content col-lg-8 col-md-6 col-12">
                          <div className="title">
                            <span> {t("نوع سند")} :</span>
                          </div>
                          <div className="wrapper">
                            <Autocomplete
                              className="w-100"
                              multiple
                              id="checkboxes-tags-demo"
                              name="DocumentDefinitionId"
                              options={documentDefinitionList}
                              disableCloseOnSelect
                              getOptionLabel={(option) =>
                                option.documentDefinitionName
                              }
                              onChange={(event, value) => {
                                let temp2 = [];
                                value.map((item) => {
                                  // herreeeeeee
                                  let temp3 = item.documentDefinitionId;
                                  temp2.push(temp3);
                                });
                                formik.setFieldValue(`DocumentTypeId`, temp2);
                                console.log("temp2", temp2);
                              }}
                              renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option.documentDefinitionName}
                                </li>
                              )}
                              style={{ width: 500 }}
                              renderInput={(params) => (
                                <TextField
                                  style={{ fontSize: "10px" }}
                                  {...params}
                                  //   label="نوع سند"
                                  placeholder="انتخاب نوع سند"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="content col-lg-2 col-md-6 col-12">
                          <div className="title">
                            <span> {t("‌")}</span>
                          </div>

                          <FormGroup>
                            <FormControlLabel
                              style={{ fontSize: "12px" }}
                              control={
                                <Checkbox
                                  style={{ fontSize: "12px" }}
                                  checked={formik.values.showArticles}
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      `showArticles`,
                                      e.target.checked
                                    );
                                  }}
                                  onBlur={formik.handleBlur}
                                  name="showArticles"
                                  id="showArticles"
                                />
                              }
                              label="نمایش آرتیکل‌ها"
                            />
                          </FormGroup>
                        </div>
                        <div
                          className="d-flex justify-content-center"
                          style={{ margin: "10px 0px" }}
                        >
                          <Button
                            onClick={(e) => {
                              setShowArticles(true);
                              formik.handleSubmit();
                            }}
                            variant="contained"
                            className="show_btn"
                            color="primary"
                          >
                            {t("نمایش اسناد")}
                          </Button>
                        </div>
                      </div>
                    </Paper>
                  </div>
                  <div className="content col-lg-4 col-md-6 col-12">
                    <Paper
                      elevation={2}
                      className="paper-pda"
                      sx={{ height: "30vh" }}
                    >
                      <TreeView
                        dataSource={codingDatasource}
                        ref={treeViewRef}
                        dataStructure="plain"
                        keyExpr="codingId"
                        parentIdExpr="codingParentId"
                        selectionMode="multiple"
                        showCheckBoxesMode="normal"
                        selectNodesRecursive={true}
                        displayExpr="displayName"
                        selectByClick={true}
                        onContentReady={syncTreeViewSelection}
                        onItemSelectionChanged={treeViewItemSelectionChanged}
                        className={theme.palette.mode === "dark" && "dark-tree"}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        onItemExpanded={(e) => setExpandedNode(e.node)}
                        width={"100%"}
                      />
                    </Paper>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/* <div style={{ marginTop: "40px" }}> */}
          <div>
           
        
          {/* <ArticlesGrid /> */}
          {showArticles && formik.values.showArticles ? (
              <ArticlesGrid  accountingDocumentArticlesResult={accountingDocumentArticlesResult.data}/>
            ) : showArticles && !formik.values.showArticles ? (
              <DocumentGrid  accountingDocumentArticlesResult={accountingDocumentArticlesResult.data}/>
            ) : (
              ""
            )}
          </div>
          {/* </div> */}
        </div>
      </div>
      {/* <div className="d-flex justify-content-center">
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
      </div> */}
    </>
  );
};

export default DocumentReports;
