import { Workbook } from 'exceljs';
import React, { useEffect, useState } from 'react'
import DataGrid, {
    Export, GroupPanel, Grouping,
} from 'devextreme-react/data-grid';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import * as faMessages from '../../../locales/fa/fa.json';
import * as enMessages from 'devextreme/localization/messages/en.json';
import * as arMessages from 'devextreme/localization/messages/ar.json';
import { useTranslation } from 'react-i18next';
import { loadMessages, locale } from 'devextreme/localization';
import CoddingIcon from '../../../assets/images/Logo/CoddingIcon.jpg'
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as pdfExporter from 'devextreme/pdf_exporter';
import { font } from '../../../assets/fonts/B-NAZANIN-normal'
import { Helmet } from 'react-helmet-async';
import { AccountingTitles } from '../../../utils/pageTitles';

const exportFormats = ['pdf', 'xlsx'];

const Grid = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const appConfig = window.globalConfig;
    const { t, i18n } = useTranslation();
    const [ds, setDs] = useState([]);
    const [fontSize, setFontSize] = useState(13);
    /* -------------------------------------------------------------------------- */

    /* ---------------------------------- Date ---------------------------------- */
    const [date, setDate] = useState();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')

    useEffect(() => {
        getData() //Axios Request
        switch (lang) {
            case 'ar':
                setDate(new Date().toLocaleDateString("ar-u-nu-arab"));
                break;
            case 'en':
                setDate(new Date().toLocaleDateString("en-US"));
                break;
            case 'fa':
                setDate(new Date().toLocaleDateString("fa-IR"));
                break;
            default:
                break;
        }
    }, [])
    /* -------------------------------------------------------------------------- */

    /* ------------------------- Building the datasource ------------------------ */
    // Turn plain data into hierarchical data
    function buildHierarchy(data, parentId = 0) {
        const hierarchy = [];
        const children = data.filter(item => item.codingParentId === parentId);

        for (const child of children) {
            const grandchildren = buildHierarchy(data, child.codingId)
            if (grandchildren.length) {
                child.children = grandchildren;
            }
            hierarchy.push(child);
        }
        return hierarchy;
    }

    // traverse the hierarchical data
    function traverse(node, path = [], result = []) {
        if (!node.hasOwnProperty('children')) {
            result.push(path.concat(node.name));
        }
        else {
            for (const child of node.children)
                traverse(child, path.concat(node.name), result);
        }

        return result;
    }
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Font Size ------------------------------- */
    const AddSize = () => {
        if (fontSize <= 35) {
            setFontSize(fontSize + 1);
        }
    }
    const DecreaseSize = () => {
        if (fontSize >= 11) {
            setFontSize(fontSize - 1);
        }
    }
    /* -------------------------------------------------------------------------- */

    /* ----------------------------- Axios Requests ----------------------------- */
    const getData = () => {
        axios
            .get(`${appConfig.BaseURL}/api/CustomerChosenCoding`)
            .then((res) => {
                let hierarchicalData = buildHierarchy(res.data.data)
                setDs(traverse(hierarchicalData[0]))
            })
            .catch((error) => error);
    }
    /* -------------------------------------------------------------------------- */

    /* ----------------------------- Datagrid Export ---------------------------- */

    function convertToUnicode(str) {
        return str.replace(/[\u0600-\u06FF]/g, function (c) {
            return c.charCodeAt(0) + 0xFB50 - 0x0600;
        })
    }
    const onExporting = (e) => {
        e.cancel = true;
        switch (e.format) {
            //PDF DOES NOT CURRENTLY WORK CORRECTLY, NEED TO FIND A SOLUTION FOR FONT
            case "pdf":
                const doc = new jsPDF();
                pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                    indent: 5
                }).then(() => {
                    console.log(e.component)
                    console.log(doc)
                    doc.addFileToVFS('B-NAZANIN-normal.ttf', font);
                    doc.addFont('B-NAZANIN-normal.ttf', 'B-NAZANIN', 'normal');
                    doc.setFont('B-NAZANIN')
                    doc.save("Coding.pdf");
                });
                break;

            case "xlsx":
                const workbook = new Workbook();
                const worksheet = workbook.addWorksheet("Coding");
                exportDataGrid({
                    component: e.component,
                    worksheet: worksheet,
                    autoFilterEnabled: true
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(
                            new Blob([buffer], { type: "application/octet-stream" }),
                            "Coding.xlsx"
                        );
                    });
                });
                break;
        }
    }
    /* -------------------------------------------------------------------------- */
    useEffect(() => {

        locale(lang === 'fa' ? "fa-IR" : lang === 'ar' ? 'ar' : 'en')
        loadMessages(lang === 'fa' ? faMessages : lang === 'ar' ? arMessages : enMessages);
    }, [i18n.language, lang])

    return (

        <div className='p-3 print-page'>
            <Helmet>
                <title>{t(AccountingTitles.PrintCoding)}</title>
            </Helmet>
            <div className='row justify-content-center'>
                <div className='col-lg-8 col-md-10 col-sm-12 col-12'>
                    <div
                        style={{ direction: `${lang == 'en' ? 'ltr' : 'rtl'}` }}>
                        <style >{`
                            tbody
                            {
                                font-size:${fontSize}px
                            }
                          .dx-overlay-wrapper .dx-list-item:last-child 
                          {
                            display: none !important;
                          }`
                        }</style>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-12'>
                                <div className='header-print-grid'>
                                    <div className='row mb-0'>
                                        <div className='col-lg-4 col-md-4 col-4 m-0'>
                                            <img className='CoddingIcon' src={CoddingIcon} alt={'pic'} />
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-4 m-0 d-flex align-items-center justify-content-center'>
                                            <h3 className='title m-0'>{t("کدینگ حساب ها")}</h3>
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-4 m-0'>
                                            <div className='date_icon'>
                                                <div className='icons'>
                                                    <Button className='iconButton ' onClick={() => DecreaseSize()}><ZoomOutIcon /></Button>
                                                    <Button className='iconButton' onClick={() => AddSize()} ><ZoomInIcon /></Button>
                                                </div>

                                                <div className='date'>
                                                    <p>{t(date)} {t(":تاریخ چاپ")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col-lg-12 col-md-12 col-12'>

                                <div className='grid'
                                >
                                    <DataGrid
                                        id="gridContainer"
                                        rtlEnabled={true}
                                        dataSource={ds}
                                        showBorders={true}
                                        onExporting={onExporting}
                                        paging={false}>

                                        {/* <Selection mode="multiple" /> */}
                                        <GroupPanel visible={true} />
                                        <Grouping autoExpandAll={true} />

                                        {/* <Column caption={"کد گروه"} />
                <Column caption={"کد گروه"}/>
                <Column caption={"کد گروه"}/>
                <Column caption={"کد گروه"} />
                <Column caption={"کد گروه"} /> */}
                                        <Export enabled={true} formats={exportFormats} allowExportSelectedData={true} />
                                    </DataGrid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Grid;









