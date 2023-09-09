import { React, useEffect, useRef, useState } from "react";
import { CircularProgress, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../AccountReviewStyle.css";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";
import { useGetAllAccountingDocumentsByDocumentIdQuery, useGetAllAccountingDocumentsByDocumentId_ForPrintQuery } from "../../../../features/slices/accountingDocumentSlice";
import { useLocation } from "react-router";


const ReviewDocument = ({ accountDocumentQuerySearchParams, state }) => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location?.search)
    const obj = Object.fromEntries(params)
    const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`));
    const indexRef = JSON.parse(localStorage.getItem(`indexRef`));
    const [total, setTotal] = useState(0);
    const [content, setContent] = useState("");
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const [loading, setLoading] = useState(true);
    const dataRef = useRef()
    dataRef.current = data


    /* -------------------------------------------------------------------------- */
    /*                    Get Accounting Document by DocumentId                   */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {
        if (tempIndex[indexRef]?.type != tempIndex[indexRef - 1]?.type) {
            setSkip(false)
        }
    }, [tempIndex])
    const [skip, setSkip] = useState(true)
    const { data: AccountDocumentResult, isFetching: AccountDocumentIsFetching, error: AccountDocumentError, currentData: AccountDocumentCurrentData
    } = useGetAllAccountingDocumentsByDocumentIdQuery({
        id: state.DocumentCode, query: accountDocumentQuerySearchParams, obj: obj
    }, { skip: skip });
    useEffect(() => {
        if (AccountDocumentIsFetching) {
            setContent(<CircularProgress />)
        } else if (AccountDocumentError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            if (!!AccountDocumentResult?.header) {
                let pagination = JSON.parse(AccountDocumentResult?.header);
                setTotal(pagination.totalCount);
            }
            AccountDocumentResult?.data?.map((data, index) => {
                if (data?.customerChosenCodingDTOs?.length > 1) {
                    var x = data?.customerChosenCodingDTOs?.map((item, index2) => {
                        console.log("item", item, data?.detailedTypes4, index2)
                        return {
                            'AccountCodeGroup': item?.codingParentParent?.code,
                            'AccountNameGroup': item?.codingParentParent?.name,
                            'AccountCodeTotal': item?.codingParent?.code,
                            'AccountNameTotal': item?.codingParent?.name,
                            'AccountCodeSpecific': item?.code,
                            'AccountNameSpecific': item?.name,
                            'AccountNameEntity4': item?.detailedTypes4?.length != 0 ? item?.detailedTypes4?.detailedTitle : "",
                            "AccountCodeEntity4": item?.detailedTypes4?.length != 0 ? item?.detailedTypes4?.firstDetailedCode : "",
                            'AccountNameEntity5': item?.detailedTypes5?.length != 0 ? item?.detailedTypes5?.detailedTitle : "",
                            "AccountCodeEntity5": item?.detailedTypes5?.length != 0 ? item?.detailedTypes5?.firstDetailedCode : "",
                            'AccountNameEntity6': item?.detailedTypes6?.length != 0 ? item?.detailedTypes6?.detailedTitle : "",
                            "AccountCodeEntity6": item?.detailedTypes6?.length != 0 ? item?.detailedTypes6?.firstDetailedCode : "",
                            "Debtor": item?.debits,
                            'Creditor': item?.credits,
                            'ArticleDescription': data?.documentArticles[index2].notes
                        }

                    })
                    setData(x)

                }
                else {
                    var temp = {
                        'AccountCodeGroup': data?.customerChosenCodingDTOs[index]?.codingParentParent?.code,
                        'AccountNameGroup': data?.customerChosenCodingDTOs[index]?.codingParentParent?.name,
                        'AccountCodeTotal': data?.customerChosenCodingDTOs[index]?.codingParent?.code,
                        'AccountNameTotal': data?.customerChosenCodingDTOs[index]?.codingParent?.name,
                        'AccountCodeSpecific': data?.customerChosenCodingDTOs[index]?.code,
                        'AccountNameSpecific': data?.customerChosenCodingDTOs[index]?.name,
                        'AccountNameEntity4': data?.customerChosenCodingDTOs[index]?.detailedTypes4?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes4[index]?.detailedTitle : "",
                        "AccountCodeEntity4": data?.customerChosenCodingDTOs[index]?.detailedTypes4?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes4[index]?.firstDetailedCode : "",
                        'AccountNameEntity5': data?.customerChosenCodingDTOs[index]?.detailedTypes5?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes5[index]?.detailedTitle : "",
                        "AccountCodeEntity5": data?.customerChosenCodingDTOs[index]?.detailedTypes5?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes5[index]?.firstDetailedCode : "",
                        'AccountNameEntity6': data?.customerChosenCodingDTOs[index]?.detailedTypes6?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes6[index]?.detailedTitle : "",
                        "AccountCodeEntity6": data?.customerChosenCodingDTOs[index]?.detailedTypes6?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes6[index]?.firstDetailedCode : "",
                        "Debtor": data?.documentArticles[index]?.debits,
                        'Creditor': data?.documentArticles[index]?.credits,
                        'ArticleDescription': data?.documentArticles[index]?.notes
                    }
                    setData(temp)
                }

            })


        }
    }, [AccountDocumentIsFetching, location?.search, AccountDocumentCurrentData])
    useEffect(() => {
        if (!!data?.length) {
            setLoading(false)
        } else if (!AccountDocumentIsFetching && !data?.length) {
            setLoading(false)
        }
    }, [data])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,

            reorderable: false
        },
        {
            field: 'test1',
            name: "کد حساب",
            children: [
                {
                    field: 'AccountCodeEntity4',
                    filterable: true,
                    name: "تفضیلی 4",
                    filter: 'numeric',
                    width: '40px',
                },
                {
                    field: 'AccountCodeEntity5',
                    filterable: true,
                    name: "تفضیلی 5",
                    filter: 'numeric',
                    width: '40px',
                },
                {
                    field: 'AccountCodeEntity6',
                    filterable: true,
                    name: "تفضیلی 6",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountCodeSpecific',
                    filterable: true,
                    name: "معین",
                    width: '50px',
                    filter: 'numeric',
                },
                {
                    field: 'AccountCodeTotal',
                    filterable: true,
                    name: "کل",
                    width: '50px',
                    filter: 'numeric',
                },
                {
                    field: 'AccountCodeGroup',
                    filterable: true,
                    name: "گروه",
                    width: '50px',
                    filter: 'numeric',
                }
            ]

        },
        {
            field: 'test2',
            name: "عنوان حساب",
            children: [
                {
                    field: 'AccountNameGroup',
                    filterable: true,
                    name: "گروه",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameTotal',
                    filterable: true,
                    name: "کل",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameSpecific',
                    filterable: true,
                    name: "معین",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameEntity4',
                    filterable: true,
                    name: "تفضیلی 4",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameEntity5',
                    filterable: true,
                    name: "تفضیلی 5",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameEntity6',
                    filterable: true,
                    name: "تفضیلی 6",
                    filter: 'numeric',
                    width: '50px',
                },

            ]

        },


        {
            field: 'Debtor',
            filterable: true,
            name: "بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },
        {
            field: 'Creditor',
            filterable: true,
            name: "بستانکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },

        {
            field: 'ArticleDescription',
            filterable: true,
            name: "شرح آرتیکل",
            width: '90px',
        },

    ]
    function getSelectedRows(list) {
    }
    /* -------------------------------------------------------------------------- */
    /*              Get Accounting Document with id For Print & excel             */
    /* -------------------------------------------------------------------------- */
    const [printSkip, setPrintSkip] = useState(false)
    const { data: AccountDocument_ForPrintResult, isFetching: AccountDocument_ForPrintIsFetching, error: AccountDocument_ForPrintError, currentData: AccountDocument_ForPrintCurrentData
    } = useGetAllAccountingDocumentsByDocumentId_ForPrintQuery({
        id: state.DocumentCode, query: accountDocumentQuerySearchParams, obj: obj
    }, { skip: printSkip });
    useEffect(() => {
        if (AccountDocument_ForPrintIsFetching) {
            setContent(<CircularProgress />)
        } else if (AccountDocument_ForPrintError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")

            var temp = AccountDocument_ForPrintResult?.data?.map((data, index) => {
                return {
                    'AccountCodeGroup': data?.customerChosenCodingDTOs[index]?.codingParentParent?.code,
                    'AccountNameGroup': data?.customerChosenCodingDTOs[index]?.codingParentParent?.name,
                    'AccountCodeTotal': data?.customerChosenCodingDTOs[index]?.codingParent?.code,
                    'AccountNameTotal': data?.customerChosenCodingDTOs[index]?.codingParent?.name,
                    'AccountCodeSpecific': data?.customerChosenCodingDTOs[index]?.code,
                    'AccountNameSpecific': data?.customerChosenCodingDTOs[index]?.name,
                    'AccountNameEntity4': data?.customerChosenCodingDTOs[index]?.detailedTypes4?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes4[index]?.detailedTitle : "",
                    "AccountCodeEntity4": data?.customerChosenCodingDTOs[index]?.detailedTypes4?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes4[index]?.firstDetailedCode : "",
                    'AccountNameEntity5': data?.customerChosenCodingDTOs[index]?.detailedTypes5?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes5[index]?.detailedTitle : "",
                    "AccountCodeEntity5": data?.customerChosenCodingDTOs[index]?.detailedTypes5?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes5[index]?.firstDetailedCode : "",
                    'AccountNameEntity6': data?.customerChosenCodingDTOs[index]?.detailedTypes6?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes6[index]?.detailedTitle : "",
                    "AccountCodeEntity6": data?.customerChosenCodingDTOs[index]?.detailedTypes6?.length > 0 ? data?.customerChosenCodingDTOs[index]?.detailedTypes6[index]?.firstDetailedCode : "",
                    "Debtor": data?.documentArticles[index]?.debits,
                    'Creditor': data?.documentArticles[index]?.credits,
                    'ArticleDescription': data?.documentArticles[index]?.notes
                }
            })
            setExcelData(temp)
        }
    }, [AccountDocument_ForPrintIsFetching, AccountDocument_ForPrintCurrentData])


    useEffect(() => {
        if (excelData?.length > 0) {
            setPrintSkip(true)
            localStorage.setItem('excelDataReviewDocument', JSON.stringify(excelData));
        }
    }, [excelData])
    return (
        <>
            <RKGrid
                gridId={'AccountDocumentGrid2'}
                gridData={data}
                excelData={excelData}
                columnList={tempColumn}
                showSetting={true}
                showChart={false}
                showExcelExport={true}
                showPrint={true}
                rowCount={5}
                sortable={true}
                pageable={true}
                reorderable={true}
                selectable={false}
                selectionMode={'single'}
                selectKeyField={'AccountCompleteCode'}
                getSelectedRows={getSelectedRows}
                excelFileNam={t("صورت خلاصه تنخواه")}


            />
        </>
    )
}
export default ReviewDocument
