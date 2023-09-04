import ReactApexChart from "react-apexcharts";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import './style.css'
import {useTheme} from "@mui/material";

var ar = require("apexcharts/dist/locales/ar.json")
var fa = require("apexcharts/dist/locales/fa.json")
var en = require("apexcharts/dist/locales/en.json")

const Chart = ({pieSeries,pieLabels,height,width,chartMap,chartGrid,colors}) =>{

    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const chart=useRef()

    useEffect(()=>{
        chart?.current?.chart?.setLocale(i18n.language)
    },[i18n.language])

    const pieOption = {
        chart: {
            width: width,
            type: 'pie',
            defaultLocale: i18n.language==='fa'?'fa':i18n.language==='ar'?'ar':'en',
            locales: [en,fa,ar],
        },
        labels: pieLabels,
        grid: {
            show: chartGrid
        },
        theme: {
            mode: theme.palette.mode,
        },
        legend: {
            show: chartMap,
            fontFamily: 'IRANSansWeb',
            offsetX: 10,
            offsetY: 10,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: '50%',
                offsexX: 2,
                offsexY: 2
            },
            itemMargin: {
                horizontal: 15,
                vertical: 50
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    if(colors){
        pieOption.colors=colors
    }

    return(
        <>
            <ReactApexChart
                ref={chart}
                options={pieOption}
                series={pieSeries}
                type={'pie'}
                height={height}
                width={width}/>
        </>
    )
}

export default React.memo(Chart)