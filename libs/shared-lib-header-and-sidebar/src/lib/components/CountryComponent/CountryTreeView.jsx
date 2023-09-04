import {useState,useEffect, createRef} from 'react';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import TreeView, { SearchEditorOptions } from 'devextreme-react/tree-view';
import { geographicalList } from './geographicalList';
import { Box, Button, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function CountryTreeView({getAddress}) {
  const[open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {t, i18n} = useTranslation();
  const [lastSelected, SetLastSelected] = useState()
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 564,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  let treeViewRef = createRef();
  const [country, SetCountry] = useState("")
  const [province, SetProvince] = useState("")
  const [city, SetCity] = useState("")
  
  function treeViewSelectionChanged(e) {
    //console.log(e.component.getSelectedNodes())
    if (e.component.getSelectedNodes().length == 0)
    {
      lastSelected.expanded? collapseNode(lastSelected.key) : expandNode(lastSelected.key)
      return;
    }
    if (e.component.getSelectedNodes()[0].children.length == 0)
    {
      //console.log("syncselection")
      syncSelection(e.component); 
    }
    else {
      SetLastSelected(e.component.getSelectedNodes()[0])
      e.component.getSelectedNodes()[0].expanded? collapseNode(e.component.getSelectedNodes()[0].key) : expandNode(e.component.getSelectedNodes()[0].key);
    }

  }
   function syncSelection(treeView) {
     SetCountry(treeView.getSelectedNodes()[0].parent.parent.text)
     SetProvince(treeView.getSelectedNodes()[0].parent.text)
     SetCity(treeView.getSelectedNodes()[0].text)
     
  }

  useEffect(()=>{
    if(country && province && city)
    {
      getAddress([country,province,city])
      handleClose()
    }   
  },[country,province,city])

    function expandNode(key) {
      treeViewRef.current.instance.expandItem(key);
    }
    function collapseNode(key) {
      treeViewRef.current.instance.collapseItem(key);
    }

  return (
    <>
      <Button onClick={handleOpen}><HighlightAltIcon/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
          <Box sx = {style}>
      <TreeView
        id="treeview"
        items={geographicalList}
        width={500}
        searchMode={'contains'}
        searchEnabled={true}
        rtlEnabled={i18n.dir() == "ltr" ? false : true}
        selectByClick={true}
        selectionMode='single'
        onSelectionChanged={treeViewSelectionChanged}
        ref={treeViewRef}
        >
          <SearchEditorOptions
          placeholder={t("جست و جو...")}
          />
        </TreeView>
      </Box>
      </Modal>
    </>
  );
}

