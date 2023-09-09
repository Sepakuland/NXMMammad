import React, { useEffect } from "react";
import { useState } from "react";
import "../../style.css";
import axios from "axios";

import { TreeView } from "devextreme-react";
import { Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { SelectBox } from "devextreme-react";

const AccessManagement = () => {
  ///////////////tree view/////////////////////////
  const { t, i18n } = useTranslation();
  const datasourceRef = React.useRef();
  const appConfig = window.globalConfig;
  const [datasource, setdatasource] = React.useState([]);
  const showCheckBoxesModes = ["normal", "selectAll", "none"];
  const selectionModes = ["multiple", "single"];
  const [showCheckBoxesMode, setshowCheckBoxesMode] = React.useState(
    showCheckBoxesModes[1]
  );
  const [selectionMode, setSelectionMode] = React.useState(selectionModes[0]);
  const [roleData, setRoleData] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  console.log("rolePermissions" , rolePermissions)
  const [roleID, setRoleID] = useState();
  const [result, setResult] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = React.useState([]);
  const [selectNodesRecursive, setselectNodesRecursive] = React.useState(true);
  const [selectByClick, setselectByClick] = React.useState(false);
  useEffect(() => {
    axios
      .get(`${appConfig.BaseURL}/api/ProgramPart`)
      .then((res) => setdatasource(res.data.data));
  }, []);
  const theme = useTheme();

  const treeViewSelectionChanged = (e) => {
    syncSelection(e.component);
  };

  function syncSelection(treeView) {
    setSelectedEmployees(
      treeView.getSelectedNodes().map((node) => node.itemData)
    );
  }
  const onItemClick = (e) => {
    console.log("Selected Item", e.itemData);
    e.itemData.roleID = roleID
    axios
      .put(`${appConfig.BaseURL}/api/ProgramPart/UpdateAccess/${roleID}` , e.itemData)
      .then((res) => setResult(res.data.data));
  };
  useEffect(() => {
    axios
      .get(`${appConfig.BaseURL}/api/ApplicationRole`)
      .then((res) => setRoleData(res.data.data));
  }, []);
  useEffect(() => {
    let temp = datasource.map((item) => {
      let t = rolePermissions.filter((f) => f.displayName === item.displayName)[0];
      return {
        ...item,
        selected: t?.selected || false,
      };
    });
    setdatasource(temp);
  }, [rolePermissions]);

  const getPermissionsByID = (value) => {
    axios
      .get(`${appConfig.BaseURL}/api/ProgramPart/GetByRoleId/${value}`)
      .then((res) => {
        let temp = res.data.data.map((item) => {
          return {
            ...item,
            selected: true,
          };
        });
        setRolePermissions(temp);
      });
  };
  /////////////////////////////////////////////////////
  return (
    <>
      {/*<div className='header'>*/}
      {/*    <span>{t("لیست منو ها")}</span>*/}
      {/*</div>*/}
      <div className="row justify-content-center">
        <div className="content col-lg-4 col-sm-6 col-12 t1">
          <Paper elevation={2} className="paper-pda">
            <div className="title">
              <span>{t("پست سازمانی")}</span>
            </div>
            <div className="wrapper">
              <div>
                <SelectBox
                  dataSource={roleData}
                  rtlEnabled={i18n.dir() == "ltr" ? false : true}
                  onValueChanged={(e) => {
                    console.log("------e111", e);
                    getPermissionsByID(e.value);
                    setRoleID(e.value)
                  }}
                  displayExpr={"roleName"}
                  valueExpr={"roleID"}
                  className="selectBox"
                  noDataText="اطلاعات یافت نشد"
                  placeholder=""
                  name="orgPost"
                  id="orgPost"
                  searchEnabled
                  showClearButton
                  //defaultValue={GroupingOne[0]}       نشان دادن مقدار اولیه
                />
              </div>
            </div>
            {datasource == null ? (
              <CircularProgress />
            ) : (
              <div className="form">
                  <TreeView
                    id="id"
                    dataStructure="plain"
                    displayExpr="displayName"
                    parentIdExpr="parentID"
                    ref={datasourceRef}
                    items={datasource}
                    selectNodesRecursive={selectNodesRecursive}
                    selectByClick={selectByClick}
                    showCheckBoxesMode={showCheckBoxesMode}
                    selectionMode={selectionMode}
                    onSelectionChanged={treeViewSelectionChanged}
                    onItemSelectionChanged={onItemClick}
                    className={theme.palette.mode === "dark" && "dark-tree"}
                    disabled={roleID == null ? true : false}
                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                    width={500}
                  />
              </div>
            )}
          </Paper>
        </div>
      </div>
    </>
  );
};

export default AccessManagement
