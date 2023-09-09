import React, { useEffect } from "react";
import "../../style.css";
import axios from "axios";
import { TreeView } from "devextreme-react";
import { history } from "../../utils/history";
import { Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import Sortable from "devextreme-react/sortable";

const ProgramPartTreeView = () => {
  ///////////////tree view/////////////////////////
  const { t, i18n } = useTranslation();
  const datasourceRef = React.useRef();
  const [datasource, setdatasource] = React.useState([]);
  const selectionModes = ["multiple", "single"];
  const [selectionMode, setSelectionMode] = React.useState(selectionModes[0]);
  const [selectedEmployees, setSelectedEmployees] = React.useState([]);
  const [selectNodesRecursive, setselectNodesRecursive] = React.useState(true);
  const [selectByClick, setselectByClick] = React.useState(false);
  const appConfig = window.globalConfig;
  const callComponent = () => {
    history.navigate("/CreateMenu");
  };
  useEffect(() => {
    axios
      .get(`https://localhost:44324/api/ProgramPart`)
      .then((res) => setdatasource(res.data.data));
  }, []);
  const theme = useTheme();

  const treeViewDataSource = () => {
    return datasourceRef.current.instance;
  };
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
  };
  const onDragChange = (e) => {
    if (e.fromComponent == e.toComponent) {
      const fromNode = findNode(getTreeView(e.fromData), e.fromIndex);
      const toNode = findNode(getTreeView(e.toData), calculateToIndex(e));
      if (toNode !== null && isChildNode(fromNode, toNode)) {
        e.cancel = true;
      }
    }
  };

  const onDragEnd = (e) => {
    if (e.fromComponent == e.toComponent && e.fromIndex == e.toIndex) {
      return;
    }

    const fromTreeView = getTreeView(e.fromData);
    const toTreeView = getTreeView(e.toData);

    const fromNode = findNode(fromTreeView, e.fromIndex);
    const toNode = findNode(toTreeView, calculateToIndex(e));

    if (e.dropInsideItem && toNode !== null) {
      return;
    }

    const fromTopVisibleNode = getTopVisibleNode(e.fromComponent);
    const toTopVisibleNode = getTopVisibleNode(e.toComponent);
    const fromItems =
      getStateFieldName(e.fromData) == "datasource" && datasource;
    const toItems = getStateFieldName(e.toData) == "datasource" && datasource;
    moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);
    getStateFieldName(e.fromData) == "datasource" &&
      setdatasource([...fromItems]);
    fromTreeView.scrollToItem(fromTopVisibleNode);
    toTreeView.scrollToItem(toTopVisibleNode);
  };

  const getStateFieldName = (driveName) => {
    return "datasource";
  };

  const getTreeView = (e) => {
    return treeViewDataSource(e);
  };

  const calculateToIndex = (e) => {
    if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
      return e.toIndex;
    }

    return e.fromIndex >= e.toIndex ? e.toIndex : e.toIndex + 1;
  };

  const findNode = (treeView, index) => {
    const nodeElement = treeView
      .element()
      .querySelectorAll(".dx-treeview-node")[index];

    if (nodeElement) {
      return findNodeById(
        treeView.getNodes(),
        nodeElement.getAttribute("data-item-id")
      );
    }
    return null;
  };
  const findNodeById = (nodes, id) => {
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].key == id) {
        return nodes[i];
      }
      if (nodes[i].children) {
        const node = findNodeById(nodes[i].children, id);
        if (node != null) {
          return node;
        }
      }
    }
    return null;
  };

  const moveNode = (fromNode, toNode, fromItems, toItems, isDropInsideItem) => {
    const fromIndex = fromItems.findIndex(
      (item) => item.id == fromNode.itemData.id
    );
    fromItems.splice(fromIndex, 1);

    const toIndex =
      toNode == null || isDropInsideItem
        ? toItems.length
        : toItems.findIndex((item) => item.id == toNode.itemData.id);
    toItems.splice(toIndex, 0, fromNode.itemData);

    moveChildren(fromNode, fromItems, toItems);
    if (!isDropInsideItem) {
      console.log("toNode.itemData.id", toNode.itemData.id);
      fromNode.itemData.parentID = toNode.itemData.id - 1;
    } else {
      fromNode.itemData.parentID =
        toNode != null ? toNode.itemData.parentID : undefined;
    }
  };

  const moveChildren = (node, fromDataSource, toDataSource) => {
    node.children.forEach((child) => {
      moveChildren(child, fromDataSource, toDataSource);

      const fromIndex = fromDataSource.findIndex(
        (item) => item.id == child.itemData.id
      );
      fromDataSource.splice(fromIndex, 1);
      toDataSource.splice(toDataSource.length, 0, child.itemData);
    });
  };

  const isChildNode = (parentNode, childNode) => {
    let { parent } = childNode;
    while (parent !== null) {
      if (parent.itemData.id == parentNode.itemData.id) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  };

  const getTopVisibleNode = (component) => {
    const treeViewElement = component.element();
    const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
    const nodes = treeViewElement.querySelectorAll(".dx-treeview-node");
    for (let i = 0; i < nodes.length; i += 1) {
      const nodeTopPosition = nodes[i].getBoundingClientRect().top;
      if (nodeTopPosition >= treeViewTopPosition) {
        return nodes[i];
      }
    }

    return null;
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
            {datasource == null ? (
              <CircularProgress />
            ) : (
              <div className="form">
                <Sortable
                  filter=".dx-treeview-item"
                  group="shared"
                  data={datasource}
                  allowDropInsideItem={true}
                  allowReordering={true}
                  onDragChange={onDragChange}
                  onDragEnd={onDragEnd}
                >
                  <TreeView
                    id="id"
                    dataStructure="plain"
                    displayExpr="displayName"
                    parentIdExpr="parentID"
                    ref={datasourceRef}
                    items={datasource}
                    selectNodesRecursive={selectNodesRecursive}
                    selectByClick={selectByClick}
                    selectionMode={selectionMode}
                    onSelectionChanged={treeViewSelectionChanged}
                    onItemSelectionChanged={onItemClick}
                    className={theme.palette.mode === "dark" && "dark-tree"}
                    rtlEnabled={i18n.dir() == "ltr" ? false : true}
                    width={500}
                  />
                </Sortable>
              </div>
            )}
            <td colSpan="1">
              <div className="d-flex justify-content-between">
                <IconButton
                  variant="contained"
                  color="primary"
                  className="kendo-action-btn"
                  onClick={callComponent}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
                <IconButton
                  variant="contained"
                  color="info"
                  className="kendo-action-btn"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  variant="contained"
                  color="error"
                  className="kendo-action-btn"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </td>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default ProgramPartTreeView;
