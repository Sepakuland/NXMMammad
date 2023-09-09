import { Box, Button, Modal, Tooltip, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, {  IndexCell,getLangDate,DateCell } from "rkgrid";
import PrintBtn from "../Document/PrintBtn";
import AttachmentCellPrint from "./AttachmentCellPrint";
import { ParseDocumentStatesEnum, documentStates } from "../../../utils/Enums/DocumentStateEnum";
import { useFetchFilteredDocumentsInGeneralMutation } from "../../../features/slices/accountingDocumentSlice";
import swal from "sweetalert";

const AttachmentCell = (props) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  
  const [pagination, setPagination] = useState({
    PageNumber: 1,
    PageSize: parseInt(gridSetting?.take) || 10
  });
  
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "1px solid #eee",
    boxShadow: 24,
    p: 4,
    direction: i18n.dir(),
  };

  /* -------------------------------------------------------------------------- */
  /*                               RTKQuery/Redux                               */
  /* -------------------------------------------------------------------------- */
  const [filterDocumentsInGeneral, filterResults] = useFetchFilteredDocumentsInGeneralMutation()
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                    Modal                                   */
  /* -------------------------------------------------------------------------- */
  const [documentModalOpen, setDocumentModalOpen] = useState(false)

  /* ---------------------------------- Grid ---------------------------------- */
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(props.dataItem.documentCount)
  const [excelData, setExcelData] = useState([]);
  const [actionList, setActionList] = useState([]);

  const getParams = (val) => {
    setPagination({...val})
  }
  useEffect(() => {
    if (documentModalOpen){
      filterData(filterList)
    }
  }, [documentModalOpen, gridSetting?.take, pagination.PageNumber])

  function parseQueryData(data, isFetching, error) {
    if (!isFetching && !error) {
      if (!!data?.header) {
        let pagination = JSON.parse(data?.header);
        setTotal(pagination.totalCount);
      }
      let tempData = data.data.map((data) => {
        return {
          ...data,
          documentState: t(ParseDocumentStatesEnum(data.documentState)),
        }
      })
      setData(tempData)

      let tempExcelData = data.data.map((data, index) => {
        return {
          ...data,
          IndexCell: index + 1,
          documentDate: data.documentDate ? getLangDate(i18n.language, new Date(data.documentDate)) : '',
          documentState: t(ParseDocumentStatesEnum(data.documentState)),
        };
      })
      setExcelData(tempExcelData)
    }
  }


  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: true,
    },
    {
      field: "documentNumber",
      filterable: true,
      name: "ش سند",
      filter: "numeric",
    },
    {
      field: "documentDate",
      filterable: true,
      filter: "date",
      name: "تاریخ",
      cell: DateCell,
    },
    {
      field: "documentDefinitionName",
      filterable: true,
      name: "نوع",
    },
    {
      field: "refNumber",
      filterable: true,
      name: "ش ارجاع",
      filter: "numeric",
    },
    {
      field: "createdByUser",
      filterable: true,
      name: "درج",
    },
    {
      field: "folioNumber",
      filterable: true,
      filter: "numeric",
      name: "ش عطف",
    },
    {
      field: "subsidiaryNumber",
      filterable: true,
      filter: "numeric",
      name: "ش فرعی",
    },
    {
      field: "dailyNumber",
      filterable: true,
      filter: "numeric",
      name: "ش روزانه",
    },
    {
      field: "modifiedByUser",
      filterable: true,
      name: "آخرین تغییر",
    },
    {
      field: "documentState",
      filterable: true,
      filter: "enum",
      filterObject: documentStates,
      name: "وضعیت سند",
    },
    {
      field: "documentDescription",
      filterable: true,
      width: "150px",
      name: "شرح",
    },
    {
      field: "actionCell",
      filterable: false,
      width: "50px",
      name: "عملیات",
      cell: AttachmentCellPrint,
      className: "text-center",
      reorderable: false,
    },
  ];

  function getSelectedRows(list) {
    setActionList(list);
    localStorage.setItem(`printList`, JSON.stringify(list));
  }

  /* -------------------------------- Filtering ------------------------------- */
  const gridId = "GeneralDocuments_Documents"
  const gridSetting = JSON.parse(localStorage.getItem(`settings_${gridId}`))
  const [filterList, setFilterList] = useState([])
  
  async function filterData(value) {
    setFilterList(value)
    await filterDocumentsInGeneral({ obj: pagination, filter: value, generalDocumentId: props.dataItem.generalDocumentId })
      .unwrap()
      .then((res) => {
        parseQueryData(res, filterResults.isLoading, filterResults.isError)
      })
      .catch((error) => {
        console.error(error)
        let arr = error.map((item) => t(item));
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
      <td colSpan="1">
        <div className={`d-flex justify-content-around`} >
          <div>
            <Button
              variant="text"
              onClick={() => setDocumentModalOpen(true)}
            >
              {props.dataItem.documentCount} {t("سند")}
            </Button >
          </div>
        </div>
      </td>

      <Modal open={documentModalOpen} onClose={() => setDocumentModalOpen(false)}>

        <Box sx={style} style={{ textAlign: "center", width: "1000px" }}>
          <div>
            <RKGrid
              gridId={gridId}
              gridData={data}
              excelData={excelData}
              columnList={tempColumn}
              showSetting={true}
              showChart={false}
              showExcelExport={true}
              showPrint={false}
              excelFileName={t("اسناد حسابداری")}
              rowCount={10}
              sortable={true}
              pageable={true}
              reorderable={true}
              selectable={true}
              selectionMode={"multiple"} //single , multiple
              selectKeyField={"documentId"}
              getSelectedRows={getSelectedRows}
              showFilter={true}
              total={total}
              showTooltip={true}
              loading={filterResults.isLoading}
              extraBtnSecond={
                <>
                  <PrintBtn disabled={actionList.length === 0} />
                </>
              }
              disableQueryString={true}

              getParams={getParams}
              onfilter={filterData}
            />
          </div>
        </Box>

      </Modal >
    </>
  );

}
export default React.memo(AttachmentCell)