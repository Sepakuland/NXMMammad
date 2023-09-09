import { React, useEffect, useRef, useState } from "react";
import { useTheme, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import RKGrid, { CurrencyCell, IndexCell, getLangDate, DateCell } from "rkgrid";
import { useLocation } from "react-router-dom";
import ActionCell from "./ActionCell";
import { useFetchFilteredGeneralDocumentMutation, useGetAllGeneralDocumentsQuery } from "../../../features/slices/GeneralDocumentSlice";
import { useSelector } from "react-redux";
import AttachmentCell from "./AttachmentCell";
import CustomPrintBtn from "./CustomPrintBtn";
import { Helmet } from "react-helmet-async";
import { AccountingTitles } from "../../../utils/pageTitles";
import swal from "sweetalert";

const GeneralDocuments = () => {
  /* ------------------------------- Whole Page ------------------------------- */
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const params = new URLSearchParams(location?.search);
  const pagination = Object.fromEntries(params);

    /* -------------------------------------------------------------------------- */
    /*                                  RTKQuery                                  */
    /* -------------------------------------------------------------------------- */
    const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
    const [content, setContent] = useState("")
    const {
        data: generalDocumentResult = { data: [] },
        isFetching: generalDocumentIsFetching,
        error: generalDocumentError,
        currentData: generalDocumentCurrent
    } = useGetAllGeneralDocumentsQuery(pagination,
        {
            skip: fiscalYear === 0 || Object.keys(pagination).length === 0
        })

    const [filterGeneralDocuments, filterResults] = useFetchFilteredGeneralDocumentMutation()
    /* -------------------------------------------------------------------------- */

  /* ---------------------------------- Grid ---------------------------------- */
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [total, setTotal] = useState(0);

    useEffect(() => {
        parseQueryData(generalDocumentResult, generalDocumentIsFetching, generalDocumentError)
    }, [generalDocumentIsFetching, generalDocumentCurrent])

    function parseQueryData(data, isFetching, error) {
        if (isFetching) {
            setContent(<CircularProgress />)
        }
        else if (error) {
            setContent(t("خطایی رخ داده است"))
        }
        else {
            setContent("")
            if (!!data?.header) {
                let pagination = JSON.parse(data?.header);
                setTotal(pagination.totalCount);
            }
            setData(data.data)

            let tempExcel = data.data.map((data, index) => {
                return {
                    ...data,
                    IndexCell: index + 1,
                    documentDate: data.documentDate ? getLangDate(i18n.language, new Date(data.documentDate)) : '',
                };
            });
            setExcelData(tempExcel);
        }
    }


    const dataRef = useRef();
    dataRef.current = data;

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: true
        },
        {
            field: 'generalDocumentNumber',
            filterable: true,
            name: "ش سند",
            filter: 'numeric',
        },
        {
            field: 'createdDate',
            filterable: true,
            filter: "date",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'balance',
            filterable: true,
            name: "تراز",
            cell: CurrencyCell,
            filter: 'numeric',
        },
        {
            field: 'createdByUser',
            filterable: true,
            name: "درج",
        },
        {
            field: 'documentDescription',
            filterable: true,
            width: '150px',
            name: "شرح",
        },
        {
            field: "attachments",
            filterable: false,
            filter: "none",
            width: "100px",
            name: "ریز اسناد",
            cell: AttachmentCell,
            className: "text-center",
            reorderable: false
        },
        {
            field: "actionCell",
            filterable: false,
            width: "50px",
            name: "عملیات",
            cell: ActionCell,
            className: "text-center",
            reorderable: false,
        },
    ]
    /* -------------------------------------------------------------------------- */

  /* ------------------------------- Grid Print ------------------------------- */

  const [actionList, setActionList] = useState([]);

  function getSelectedRows(list) {
    setActionList(list);
  }

    async function filterData(value) {
        await filterGeneralDocuments({ obj: pagination, filter: value })
            .unwrap()
            .then((res) => {
                parseQueryData(res, filterResults.isLoading, filterResults.isError)
            })
            .catch((error) => {
                let arr = error.data.errorList.map((item) => t(item));
                let msg = arr.join(" \n ");
                swal({
                    text: msg,
                    icon: "error",
                    button: t("باشه"),
                    className: "small-error",
                });
            });
    }


    return (
        <>
            <Helmet>
                <title>{t(AccountingTitles.GeneralDocument)}</title>
            </Helmet>
            {/* <style style={{ display: "block" }} contentEditable> */}
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px",
                }}
            >
                <RKGrid
                    gridId={"General_Documents"}
                    gridData={data}
                    excelData={excelData}
                    excelFileName={t('اسناد کل')}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={false}
                    showExcelExport={true}
                    showPrint={false}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    showAdd={true}
                    addTitle={t('جدید')}
                    addUrl={'/Accounting/GeneralDocuments/AddNew'}
                    showFilter={true}
                    total={total}
                    showTooltip={true}
                    loading={generalDocumentIsFetching || filterResults.isLoading}
                    selectable={true}
                    selectionMode={"multiple"}
                    selectKeyField={"generalDocumentId"}
                    getSelectedRows={getSelectedRows}
                    extraBtnSecond={
                        <>
                            <CustomPrintBtn disabled={actionList.length === 0} printData={actionList} />
                        </>
                    }
                    onfilter={filterData}
                />
            </div>
            {/* </style> */}
        </>
    );
};

export default GeneralDocuments;
