import { Workbook } from 'exceljs';
import React, { useEffect, useState } from 'react'
import DataGrid, {
    Export, GroupPanel, Grouping,
} from 'devextreme-react/data-grid';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useSearchParams } from 'react-router-dom';
import * as faMessages from '../../../../../../libs/shared-lib-header-and-sidebar/src/lib/locales/fa/fa.json';
import * as enMessages from 'devextreme/localization/messages/en.json';
import * as arMessages from 'devextreme/localization/messages/ar.json';
import { useTranslation } from 'react-i18next';
import { loadMessages, locale } from 'devextreme/localization';
import CoddingIcon from '../../../assets/images/Logo/CoddingIcon.jpg'
import { jsPDF } from 'jspdf';
import * as pdfExporter from 'devextreme/pdf_exporter';
import { BNazaninNormal } from '../../../assets/fonts/B-NAZANIN-normal'
import { Helmet } from 'react-helmet-async';
import { AccountingTitles } from '@kara-erp/shared-lib-header-and-sidebar';
import { useFetchCodingsQuery } from '@kara-erp/shared-lib-header-and-sidebar';
import { BNazaninBold } from '../../../assets/fonts/B-NAZANIN-bold';

const exportFormats = ['pdf', 'xlsx'];

const Grid = () => {
    /* ------------------------------- Whole Page ------------------------------- */
    const { t, i18n } = useTranslation();
    const [ds, setDs] = useState([]);
    const [fontSize, setFontSize] = useState(13);
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                               RTKQuery/Redux                               */
    /* -------------------------------------------------------------------------- */

    /* --------------------------------- Queries -------------------------------- */
    const [customerChosenCodingContent, setCustomerChosenCodingContent] = useState("")
    const { data: codingRes = [], isFetching: codingIsFetching, error: codingError } = useFetchCodingsQuery();
    useEffect(() => {
        if (codingIsFetching) {
            setCustomerChosenCodingContent(<CircularProgress />)
        } else if (codingError) {
            setCustomerChosenCodingContent(t("خطایی رخ داده است"))
        } else { //Fulfilled
            setCustomerChosenCodingContent("")
            let hierarchicalData = buildHierarchy(codingRes)
            setDs(traverse(hierarchicalData[0]))
        }
    }, [codingIsFetching])


    /* ---------------------------------- Date ---------------------------------- */
    const [date, setDate] = useState();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')

    useEffect(() => {
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
        let extensibleData = JSON.parse(JSON.stringify(data))
        const hierarchy = [];
        const children = extensibleData.filter(item => item.codingParentId === parentId);

        for (const child of children) {
            const grandchildren = buildHierarchy(extensibleData, child.codingId)
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

    /* ----------------------------- Datagrid Export ---------------------------- */

    const onExporting = React.useCallback((e) => {
        e.cancel = true;
        switch (e.format) {
            case "pdf":
                const doc = new jsPDF();
                doc.addFileToVFS('B-NAZANIN-normal.ttf', BNazaninNormal);
                doc.addFileToVFS('B-NAZANIN-bold.ttf', BNazaninBold);
                doc.addFont('B-NAZANIN-normal.ttf', 'B-NAZANIN', 'normal');
                doc.addFont('B-NAZANIN-bold.ttf', 'B-NAZANIN', 'bold');
                doc.setFont('B-NAZANIN')
                pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                    indent: 5,
                    customizeCell({ gridCell, pdfCell }) {
                        if (gridCell.rowType === 'group') {
                          pdfCell.font.style = 'bold';
                        }
                      },
                }).then(() => {
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
    });
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
            {customerChosenCodingContent !== "" ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {customerChosenCodingContent}
                </Box>
            ) :
                <div className='row justify-content-center'>
                    <div className='col-lg-8 col-md-10 col-sm-12 col-12'>
                        <div
                            style={{ direction: `${lang == 'en' ? 'ltr' : 'rtl'}` }}>
                            <style >{`
                            tbody
                            {
                                font-size:${fontSize}px
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
                                            <Export enabled={true} formats={exportFormats} allowExportSelectedData={false} />
                                        </DataGrid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Grid;









