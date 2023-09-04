import React, {useEffect, useRef, useState} from "react";
import {SelectBox} from "devextreme-react/select-box";
import {FormControlLabel, RadioGroup, Radio, useTheme} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {getLangDate} from "../../utils/getLangDate";
import Chart from './index'
import PieChart from "./PieChart";
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {AreaChartOutlined} from "@ant-design/icons";
import preview from "./preview.gif";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import {useLocation, useSearchParams} from "react-router-dom";


function ChartPage({data,columnsObj,chartObj,savedCharts}) {

    const [searchParams] = useSearchParams();
    const gridId = searchParams.get('id')



    const settings = JSON.parse(localStorage.getItem(`chart_${gridId}`));
    const location = useLocation()
    const theme=useTheme()
    const [chartMap, setChartMap] = useState(settings?.chartMap);
    const [chartGrid, setChartGrid] = useState(settings?.chartGrid);
    const [xaxis, setXaxis] = useState([]);
    const [pieSeries,setPieSeries]=useState([])

    let dependentTemp={}
    chartObj.forEach((item)=>{
        dependentTemp[item.value]=false
    })

    const [dependentField,setDependentField]=useState(settings?.dependentField||dependentTemp)
    const [pieDependent,setPieDependent]=useState(settings?.pieDependent)
    const { t, i18n } = useTranslation();
    const [chartSeries,setChartSeries]=useState([])
    const [pieLabels,setPieLabels]=useState([])
    const [mainChartField, setMainChartField] = useState(settings?.mainChartField);
    const [chartType, setChartType] = useState(settings?.chartType);
    const [newChart,setNewChart]=useState('')




    const chartTypes=[
        {name:t('میله ای'),value:'bar',icon:<BarChartIcon/>},
        {name:t('دایره ای'),value:'pie',icon:<PieChartIcon/>},
        {name:t('خطی'),value:'line',icon:<ShowChartIcon/>},
        {name:t('مساحت'),value:'area',icon:<AreaChartOutlined style={{fontSize:'22px'}}/>},
        {name:t('پراکندگی'),value:'scatter',icon:<ScatterPlotIcon/>},
    ]



    const Item=(data)=> {
        return (
            <div className={`custom-select-item ${i18n.dir()==='rtl'?'rtl':''}`}>
                {data.icon}
                <div className="name">{data.name}</div>
            </div>
        );
    }





    useEffect(()=>{
        let temp=chartObj.map((field)=> {
            let obj1=dependentField[field.value]?{
                name: field.title,
                data: data.map((item) => {
                    let temp=(item[field.value] instanceof Date)?getLangDate(i18n.language,item[field.value]):item[field.value]
                    return `${temp}`
                })
            }: null
            return obj1
        })
        temp=temp.filter(item=>item!=null)
        setChartSeries(temp)
    },[dependentField,i18n.language,data])

    useEffect(()=>{
        let temp=data.map((item) => {
            let temp=(item[mainChartField] instanceof Date)?getLangDate(i18n.language,item[mainChartField]):item[mainChartField]
            return `${temp}`
        })
        setXaxis(temp)
        setPieLabels(temp)
    },[mainChartField,i18n.language,data])


    useEffect(()=>{
        let temp=data.map((item) => (item[pieDependent]))
        setPieSeries(temp)
    },[pieDependent,data])



    return(
        <>
            <div className="form-template grid-popover p-3" style={{
                backgroundColor: `${theme.palette.background.paper}`,
                borderColor: `${theme.palette.divider}`,
            }} >
                <div className='row'>
                    <div className='col-12' style={{minHeight:'700px'}}>
                        {chartSeries.length&&xaxis.length&&chartType !== 'pie'? <>

                                <div style={{ direction: 'ltr'}} className={i18n.dir()==='rtl'?'rtl-chart':''}>
                                    {chartType === 'bar' &&<Chart xaxis={xaxis} chartSeries ={chartSeries}
                                                                  type={'bar'} height={600} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>}
                                    {chartType === 'line' &&
                                        <Chart xaxis={xaxis} chartSeries ={chartSeries}
                                               type={'line'} height={600} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                    }
                                    {chartType === 'area' &&
                                        <Chart xaxis={xaxis} chartSeries ={chartSeries}
                                               type={'area'} height={600} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                    }
                                    {chartType === 'scatter' &&
                                        <Chart xaxis={xaxis} chartSeries ={chartSeries}
                                               type={'scatter'} height={600} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                    }

                                </div>

                            </>
                            :pieDependent&&mainChartField&&chartType === 'pie' ?
                                <div style={{ direction: 'ltr'}} className={i18n.dir()==='rtl'?'rtl-chart':''}>
                                    <PieChart pieLabels={pieLabels} pieSeries={pieSeries} height={600} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                </div>:<div className="d-flex align-items-center justify-content-center h-100"><img src={preview} alt={'chart'}/></div>
                        }

                    </div>
                    <div className='col-md-4 col-12'>
                        <h5 className="popover-title">
                            {t('تنظیمات')}
                        </h5>
                        <div className="title">
                            <span>{t("نوع نمودار")}</span>
                        </div>
                        <SelectBox
                            dataSource={chartTypes}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            onValueChanged={(e) => setChartType(e.value)}
                            defaultValue={chartType}
                            className='selectBox'
                            noDataText={t('اطلاعات یافت نشد')}
                            itemRender={Item}
                            valueExpr="value"
                            displayExpr='name'
                            placeholder={''}
                            name='chartType'
                            id='chartType'
                            searchEnabled
                        />
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={chartMap}
                                        onChange={(event) =>setChartMap(event.target.checked)
                                        }
                                        name="chartMap"
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="h6">
                                        {t('نمایش نقشه راهنما')}
                                    </Typography>
                                }
                                className='mt-3'
                            />
                        </div>
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={chartGrid}
                                        onChange={(event) =>setChartGrid(event.target.checked)
                                        }
                                        name="chartGrid"
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="h6">
                                        {t('نمایش خطوط راهنما')}
                                    </Typography>
                                }
                                className='mt-3'
                            />
                        </div>

                        <div className="title mt-3">
                            <span>{t("مولفه اصلی")}</span>
                        </div>
                        <SelectBox
                            dataSource={columnsObj}
                            value={mainChartField}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            onValueChanged={(e) => setMainChartField(e.value)}
                            className='selectBox'
                            noDataText={t('اطلاعات یافت نشد')}
                            itemRender={null}
                            displayExpr="title"
                            valueExpr="value"
                            placeholder={''}
                            name='chartType'
                            id='chartType'
                            searchEnabled
                        />
                        <h2 className='title mt-3'>{t('مولفه وابسته')}</h2>
                        <ul className='field-list'>
                            {chartType==='pie'?
                                <RadioGroup
                                    name="pie-field"
                                    defaultChecked={pieDependent}
                                    defaultValue={pieDependent}
                                    onChange={e=>setPieDependent(e.target.defaultValue)}
                                >
                                    {chartObj.map((item,index)=>(
                                        mainChartField!==item.value&&<li key={index}><FormControlLabel value={item.value} control={<Radio />} label={item.title} /></li>
                                    ))}

                                </RadioGroup>

                                :chartObj.map((item,index)=>(
                                    mainChartField!==item.value&&<li key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={dependentField[item.value]}
                                                    onChange={(event) => {
                                                        let temp= {...dependentField}
                                                        temp[item.value]=event.target.checked
                                                        setDependentField(temp)
                                                    }
                                                    }
                                                    name="checked"
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label={
                                                <Typography variant="h6">
                                                    {item.title}
                                                </Typography>
                                            }
                                        />
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className='col-12 col-md-8'>
                        <h5 className="popover-title">
                            {t('نمودارهای ذخیره شده')}
                        </h5>
                        {savedCharts.map((item,index)=>(
                            <div className='saved-item d-flex' key={index}>
                                <span className='index'>{index+1}</span>
                                <span className='title'>{item.title}</span>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={savedCharts[index].dashboard}
                                            onChange={(event) =>{
                                                let temp=savedCharts
                                                temp[index].dashboard=event.target.checked
                                                console.log('temp',temp)
                                                // setSavedCharts([...temp])
                                            }
                                            }
                                            name={`savedCharts[${index}].dashboard`}
                                            color="primary"
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="h6">
                                            {t('نمایش در داشبورد')}
                                        </Typography>
                                    }
                                />
                                <IconButton  variant="contained" color='primary' className='kendo-action-btn' onClick={()=>console.log('view')}>
                                    <VisibilityIcon/>
                                </IconButton >
                                <IconButton  variant="contained" color="error" className='kendo-action-btn' onClick={()=>{
                                    let temp=savedCharts.filter(s=>s.title!==item.title)
                                    // setSavedCharts(temp)
                                }}>
                                    <DeleteIcon/>
                                </IconButton >
                            </div>
                        ))}
                        <div className='d-flex mt-2'>
                            <div  style={{width:'70%'}}>
                                <div className='form-design p-0'>
                                    <div className='title'><span>{t('عنوان')}</span></div>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="title"
                                        name="title"
                                        onChange={(e)=>setNewChart(e.target.value)}
                                        value={newChart}
                                    />
                                </div>
                            </div>
                            <div style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}>
                                <div className='form-design p-0'>
                                    <div className='title'><span>‌</span></div>
                                    <Button
                                        variant="outlined"
                                        color='success'
                                        onClick={()=> {
                                            // setSavedCharts(s=>[...s, {title:newChart,dashboard:false}])
                                            setNewChart('')
                                        }}
                                        style={{ padding: '3px 15px 4px',fontSize:'12px'}}
                                    >
                                        {t('ذخیره نمودار')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChartPage