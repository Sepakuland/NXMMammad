import { Button, CircularProgress, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetAllProfitAndLossCodingsWithNonZeroBalanceQuery } from "../../../features/slices/customerChosenCodingSlice";
import { useEffect, useRef, useState } from "react";
import { TreeView } from "devextreme-react";
import { useFormik } from "formik";
import CloseIcon from '@mui/icons-material/Close';


export default function ChooseMoeinAccountModal({ initData, getData, closeModal }) {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                              RTKQuery / Redux                              */
    /* -------------------------------------------------------------------------- */

    /* --------------------------------- Queries -------------------------------- */
    const { data: profitOrLossCodings = [], isFetching: profitOrLossCodingsIsFetching, error: profitOrLossCodingsError } = useGetAllProfitAndLossCodingsWithNonZeroBalanceQuery();
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Form Data ------------------------------- */
    const [codingDatasource, setCodingDatasource] = useState([]);
    const formik = useFormik({
        initialValues: {
            chosenCodings: initData
        },
        onSubmit: (values) => {
            let moeins = codingDatasource.filter(a => a.codingLevel === 3)
            let moeinIds = moeins.map(moein => moein.codingId)
            var intersection = values.chosenCodings.filter(value => moeinIds.includes(value.key));
            getData(intersection)
            closeModal()
        }
    })

    /* ---------------------------- TreeViewComponent --------------------------- */
    const treeViewRef = useRef()
    const [expandedNode, setExpandedNode] = useState([]);
    const [expandedNodeStatus, setExpandedNodeStatus] = useState([]);
    useEffect(() => {
        let expTemp = codingDatasource.map((item) => ({
            codingId: item.codingId,
            expanded: item?.expanded || false
        }))
        setExpandedNodeStatus(expTemp)

    }, [expandedNode])

    const [codingContent, setCodingContent] = useState("")
    useEffect(() => {
        if (profitOrLossCodingsIsFetching) {
            setCodingContent(<CircularProgress />)
        }
        else if (profitOrLossCodingsError) {
            setCodingContent(t("خطایی رخ داده است"))
        }
        else {
            setCodingContent("")
            let displayNames = profitOrLossCodings.map((item) => {
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
    }, [profitOrLossCodingsIsFetching])

    function syncTreeViewSelection(e) {
        const treeView = (e.component.selectItem && e.component)
            || (treeViewRef && treeViewRef.instance);

        if (treeView) {
            if (e.value === null) {
                treeView.unselectAll();
            } else {
                const values = e.value || formik.values.chosenCodings;
                values && values.forEach((value) => {
                    treeView.selectItem(value);
                });
            }
        }

        if (e.value !== undefined) {
            formik.setFieldValue("chosenCodings", e.value)
        }
    }

    function treeViewItemSelectionChanged(e) {
        formik.setFieldValue("chosenCodings", e.component.getSelectedNodes())
    }

    console.log("modalFormik",formik.values)

    return (
        <>
            <div
                className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                <div className="title mb-0"> {t("انتخاب معین")} </div>
                <button type='button' className='close-btn' onClick={() => closeModal()}>
                    <CloseIcon />
                </button>
            </div>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px 0",
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-design">
                        {codingContent == "" ?
                            <TreeView dataSource={codingDatasource}
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
                                width={'100%'}
                            />
                            : codingContent}
                    </div>
                </form>
                <div className='d-flex justify-content-center'>
                    <Button
                        variant="contained"
                        color='success'
                        style={{ margin: '0 2px' }}
                        onClick={formik.handleSubmit}
                    >
                        {t('تایید')}
                    </Button>
                    <Button
                        variant="outlined"
                        color='error'
                        style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                        onClick={() => closeModal()}
                    >{t('انصراف')}
                    </Button>
                </div>
            </div>
        </>
    )
}