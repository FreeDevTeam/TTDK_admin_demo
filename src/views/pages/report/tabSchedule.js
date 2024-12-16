import Chart from 'react-apexcharts'
import { Fragment, useState, useEffect, memo } from "react";
import { Card, CardTitle, CardText, CardBody, CardHeader, Row, Col, Progress } from 'reactstrap'
import { injectIntl } from "react-intl";
import { kFormatter } from '@utils'
import { Bar } from 'react-chartjs-2'
import Icon from '@mdi/react';
import { mdiClockCheckOutline } from '@mdi/js';
import './index.scss'
const TabSchedule = 
({  
    gridLineColor, 
    intl, 
    days, 
    schedule, 
    total, 
    dayOverview,
    totalConfirmedSchedule,
    totalNewSchedule,
    totalClosedSchedule,
    totalSchedule
}) => {

   
    const options = {
        elements: {
            rectangle: {
                borderWidth: 1,
                borderSkipped: 'bottom',
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
            display: false
        },
        tooltips: {
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: ["#16a34a"],
            backgroundColor: '#fff',
            titleFontColor: '#000',
            bodyFontColor: gridLineColor,
        },
        scales: {
            xAxes: [
                {
                    display: true,
                    gridLines: {
                        display: false,
                        color: gridLineColor,
                        zeroLineColor: gridLineColor,

                    },
                    scaleLabel: {
                        display: false
                    },
                    ticks: {
                        fontColor: gridLineColor,
                        fontSize: 7
                    }
                }
            ],
            yAxes: [
                {
                    display: false,
                    borderColor: 'transparent',
                    gridLines: {
                        display: false,
                        zeroLineColor: gridLineColor,
                    },
                    ticks: {
                        stepSize: 1,
                        min: 0,
                        max: days.legenth,
                        fontColor: gridLineColor,
                    }
                }
            ]
        }
    }
    const data = {
        labels:
            dayOverview.map(item => {
                return item.date
            })
        ,
        datasets: [
            {
                data: dayOverview?.map(item => {
                    return item.quantity
                }),
                backgroundColor: "#7367f0",
                borderColor: 'transparent',
                barThickness: 10,
                borderWidth: 1,
                borderRadius: 10,
            }
        ]
    }

    return (
        <>
            <Row sm='6'>
                <Col sm='6'>
                    <Card >
                        <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column size-title'>
                            <CardTitle tag='h4'>{intl.formatMessage({ id: "overview-schedule" })}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row sm='10'>
                                <Col sm='2'>
                                    <Card className='ml-15'>
                                        <Row><CardTitle className="title-total">{total}</CardTitle></Row>
                                        <Row>{intl.formatMessage({ id: 'total_scheduled' })}</Row>
                                    </Card>
                                </Col>
                                <Col sm='10'>
                                    <Bar data={data} options={options} height={300} />
                                </Col>
                            </Row>
                            <div className='border rounded '>
                                <Row sm='6' className='m-1 h-247'>
                                    <Col sm='4'>
                                        <div className='block-icon width-200'>
                                            <div className='bg-deployed'><Icon path={mdiClockCheckOutline} size={1} className='color_deployed ' /></div>
                                            <div className='color_deployed'>{intl.formatMessage({ id: 'done' })}</div>
                                        </div>
                                        <div className='color_deployed'>{totalClosedSchedule}</div>
                                        <Progress color="success" value={(totalClosedSchedule / totalSchedule) * 100} />
                                    </Col>
                                    <Col sm='4'>
                                        <div className='block-icon'>
                                            <div className='bg-actived'><Icon path={mdiClockCheckOutline} size={1} className='color_actived' /></div>
                                            <div className='color_actived'>{intl.formatMessage({ id: 'confirmed' })}</div>
                                        </div>
                                        <div className='color_actived'>{totalConfirmedSchedule}</div>
                                        <Progress color="#7367f0" value={(totalConfirmedSchedule / totalSchedule) * 100}  />
                                    </Col>
                                    <Col sm='4'>
                                        <div className='block-icon width-200'>
                                            <div className='bg-overload '><Icon path={mdiClockCheckOutline} size={1} className='color_overload' /></div>
                                            <div className='color_overload'>{intl.formatMessage({ id: 'unconfimred' })}</div>
                                        </div>
                                        <div className='color_overload'>{totalNewSchedule}</div>
                                        <Progress color="danger" value={(totalNewSchedule / totalSchedule) * 100} />
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default injectIntl(memo(TabSchedule))
