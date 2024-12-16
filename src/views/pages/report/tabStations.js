import { Fragment, useEffect, useState, memo } from 'react'
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
                size: 600,
                offsetY: 20,
                offsetX: 50,
                startAngle: -150,
                endAngle: 150,
                hollow: {
                    size: '65%'
                },
                track: {
                    background: '#fff',
                    strokeWidth: '100%'
                },
                dataLabels: {
                    name: {
                        offsetY: -5,
                        fontFamily: 'Segoe UI',
                        fontSize: '1.4rem',
                    },
                    value: {
                        offsetY: 15,
                        fontFamily: 'Segoe UI',
                        fontSize: '1.714rem',
                        fontWeight: "400"
                    },
                    total: {
                        show: false,
                        fontSize: '1rem',
                        label: props.intl.formatMessage({ id: "Activation" }),
                    }
                }
            }
        },
        colors: ['#7367f0'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.3,
                inverseColors: false,
                stops: [0, 100],
            },
        },
        stroke: {
            dashArray: 8,
        },
        labels: [label]
    }

    const totalProductives = ((data?.totalDeployedStation / data?.totalStations) * 100).toFixed(2)
    const series = [totalProductives]
    return (
        <Fragment>
            <Row>
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
                                    <Chart options={options} series={series} type='radialBar' height={400} width={700} />
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-between mt-1 '>
                                <div className='text-center'>
                                    <CardText className='mb-50 color_actived '>{props.intl.formatMessage({ id: 'actived' })}<Icon path={mdiHomeCityOutline} size={1} className="icon-actived" /></CardText>
                                    <span className='font-large-1 font-weight-bold color_actived'>{data?.totalActiveStation}</span>
                                </div>
                                <div className='text-center'>
                                    <CardText className='mb-50 color_deployed '>{props.intl.formatMessage({ id: 'activated' })}<Icon path={mdiHomeCityOutline} size={1} className="icon-deployed" /></CardText>
                                    <span className='font-large-1 font-weight-bold color_deployed '>{data?.totalDeployedStation}</span>
                                </div>
                                <div className='text-center'>
                                    <CardText className='mb-50 color_overload'>{props.intl.formatMessage({ id: 'overload' })} <Icon path={mdiHomeCityOutline} size={1} className="icon-overload" /></CardText>
                                    <span className='font-large-1 font-weight-bold color_overload  '>{data?.totalUnavailableStation || 0}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(memo(TabStations))
