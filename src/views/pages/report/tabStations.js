import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardText,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Row,
    Col,
    Collapse
} from 'reactstrap'
import Chart from 'react-apexcharts'
import { injectIntl } from 'react-intl'
import './index.scss'
import ReportService from '../../../services/reportService'
import Icon from '@mdi/react';
import { mdiHomeCityOutline } from '@mdi/js';


const DefaultFilter = {
};

const TabStations = props => {
    const [data, setData] = useState(null)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
    const label = props.intl.formatMessage({ id: "Activation" })

    const getData = (paramsFilter) => {
        ReportService.getList(paramsFilter).then((result) => {
            if (result) {
                setData(result);
            }
        })
    }

    useEffect(() => {
        getData(paramsFilter)
    }, [])

    const options = {
        plotOptions: {
            radialBar: {
                size: 150,
                offsetY: 20,
                startAngle: -150,
                endAngle: 150,
                hollow: {
                    size: '65%'
                },
                track: {
                    background: '#7367f0',
                    strokeWidth: '0%'
                },
                dataLabels: {
                    name: {
                        offsetY: -5,
                        fontFamily: 'Montserrat',
                        fontSize: '1rem',
                    },
                    value: {
                        offsetY: 15,
                        fontFamily: 'Montserrat',
                        fontSize: '1.714rem',
                    },
                    total: {
                        show: false,
                        fontSize: '1rem',
                        label: props.intl.formatMessage({ id: "Activation" }),
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.5,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
            }
        },
        stroke: {
            dashArray: 30,
        },
        labels: [label]
    }

    const totalProductives = ((data?.totalDeployedStation / data?.totalStations) * 100).toFixed(2)
    const series = [totalProductives]

    return (
        <Fragment>
            <Row className='height-row'>
                <Col sm='6'>
                    <Card>
                        <CardHeader className='pb-0'>
                            <CardTitle tag='h4'>{props.intl.formatMessage({ id: "overview-stations" })}</CardTitle>
                            <UncontrolledDropdown className='chart-dropdown'>
                                <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col sm='2' className='d-flex flex-column flex-wrap text-center'>
                                    <h1 className='font-large-2 font-weight-bolder mt-2 mb-0'>{data?.totalStations}</h1>
                                    <CardText className='width-title'>{props.intl.formatMessage({ id: 'numberOfStation' })}</CardText>
                                </Col>
                                <Col sm='10' className='d-flex justify-content-center'>
                                    <Chart options={options} series={series} type='radialBar' height={270} />
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-between mt-1'>
                                <div className='text-center'>
                                    <CardText className='mb-50 color_actived '>{props.intl.formatMessage({ id: 'actived' })}<Icon path={mdiHomeCityOutline} size={1} className="icon-actived"/></CardText>
                                    <span className='font-large-1 font-weight-bold color_actived'>{data?.totalActiveStation}</span>
                                </div>
                                <div className='text-center'>
                                    <CardText className='mb-50 color_deployed '>{props.intl.formatMessage({ id: 'activated' })}<Icon path={mdiHomeCityOutline} size={1} className="icon-deployed" /></CardText>
                                    <span className='font-large-1 font-weight-bold color_deployed '>{data?.totalDeployedStation}</span>
                                </div>
                                <div className='text-center'>
                                    <CardText className='mb-50 color_overload'>{props.intl.formatMessage({ id: 'overload' })} <Icon path={mdiHomeCityOutline} size={1} className="icon-overload" /></CardText>
                                    <span className='font-large-1 font-weight-bold color_overload  '>{data?.availableStatus || 0}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(TabStations)
