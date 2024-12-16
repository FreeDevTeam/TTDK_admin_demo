// @ts-nocheck
// ** React Imports
import React, { Fragment, useState, useEffect, memo, lazy, useCallback, useMemo } from "react";
// ** Store & Actions
import { Home, User, Calendar, Cpu, Map } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import TabOverview from './tabOverview'
import "./index.scss";
import TabSchedule from './tabSchedule'
import ProductivityTab from './Center/productivityTab'
import LineTab from "./Center/lineTab";
import {
    Row,
    Col,
} from "reactstrap";
import ReportService from '../../../services/reportService'
import { injectIntl } from "react-intl";
import moment from "moment";
import TabStations from './tabStations'

import ActiveCenter from "./Center/ActiveCenter";
import EnableBooking from "./Center/EnableBooking";
import Wattage from "./Center/Wattage";

const DefaultFilter = {

};

const TabReport = ({ intl }) => {
    // ** Store Vars

    const [days, setDays] = useState([])
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(startDate.getDate() - 4);
    endDate.setDate(endDate.getDate() + 2);

    const FILTER_SCHEDULE = {
        filter: {

        },
        startDate: moment(startDate).format("DD/MM/YYYY"),
        endDate: moment(endDate).format("DD/MM/YYYY"),
    }
   
    let tabOverview = '1'
    let tabStations = '2'
    let tabUser = '3'
    let schedules = '4'
    let tabVehicle = '5'
    let statusNew = 0
    let statusConfirmed = 10
    let statusCanceled = 20
    let statusClosed = 30
    let tabCenter = '6'

    const [active, setActive] = useState(tabOverview)
    const [schedule, setSchedule] = useState([])
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
    const [total, setTotal] = useState()
    const [dayOverview, setDayOverview] = useState([])
    const [data, setData] = useState([]);
    const [totalConfirmedSchedule, setTotalConfirmedSchedule] = useState([])
    const [totalCanceledSchedule, setTotalCanceledSchedule] = useState([])
    const [totalClosedSchedule, setTotalClosedSchedule] = useState([])
    const [totalSchedule, setTotalSchedule] = useState([])

    const DataChart = (paramsFilter) => {
        ReportService.DataChart(paramsFilter).then((result) => {
            if (result) {
                setDays(result.data);
            }
        })
    }

    const DataChartSchedule = (paramsFilter) => {
        ReportService.DataChart(paramsFilter).then((result) => {
            if (result) {
                setDayOverview(result.data);
            }
        })
    }

    const ScheduleChart = (paramsFilter) => {
        ReportService.ScheduleChart(paramsFilter).then((result) => {
            if (result) {
                setSchedule(result.data);
                setTotal(result.total)
            }
        })
    }

    const totalConfirmedScheduleHandler = () => {
        const newData = {
            filter: {
                CustomerScheduleStatus: statusConfirmed
            },
            skip: 0,
            limit: 20
        }

        ReportService.ScheduleChart(newData).then((result) => {
            if (result) {
                setTotalConfirmedSchedule(result.total)
            }
        })
    }

    const totalCanceledScheduleHandler = () => {
        const newData = {
            filter: {
                CustomerScheduleStatus: statusCanceled
            },
            skip: 0,
            limit: 20
        }

        ReportService.ScheduleChart(newData).then((result) => {
            if (result) {
                setTotalCanceledSchedule(result.total)
            }
        })
    }

    const totalClosedScheduleHandler = () => {
        const newData = {
            filter: {
                CustomerScheduleStatus: statusClosed
            },
            skip: 0,
            limit: 20
        }

        ReportService.ScheduleChart(newData).then((result) => {
            if (result) {
                setTotalClosedSchedule(result.total)
            }
        })
    }

    const totalSchedules = () => {
        const newData = {
            filter: {

            },
            skip: 0,
            limit: 20
        }

        ReportService.ScheduleChart(newData).then((result) => {
            if (result) {
                setTotalSchedule(result.total)
            }
        })
    }

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const totalStation = readAllStationsDataFromLocal?.length || 0

    const totalOverload = useMemo(() => {
        let sum = 0;
        readAllStationsDataFromLocal.reduce((acc, value) => {
            if (!value?.availableStatus) {
                sum++
            }
        }, 0)
        return sum
    }, [readAllStationsDataFromLocal?.length])

    const totalActived = useMemo(() => {
        const totalActivedList = readAllStationsDataFromLocal.filter(station => {
            const bookingConfig = station.stationBookingConfig || {};
            return bookingConfig.some(config => config.enableBooking);
        });
        return totalActivedList.length
    }, [readAllStationsDataFromLocal?.length])

    const totalWorked = useMemo(() => {
        let sum = 0
        readAllStationsDataFromLocal.reduce((acc, value) => {
            if (value?.stationStatus) {
                sum++
            }
        }, 0)
        return sum
    }, [readAllStationsDataFromLocal?.length])

    useEffect(() => {
        DataChart(paramsFilter)
        ScheduleChart(FILTER_SCHEDULE)
        totalConfirmedScheduleHandler()
        totalCanceledScheduleHandler()
        totalClosedScheduleHandler()
        DataChartSchedule(FILTER_SCHEDULE)
        totalSchedules()
    }, []);

    return (
        <Fragment>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        active={active === tabOverview}
                        onClick={() => {
                            toggle(tabOverview)
                        }}
                    >
                        <Home size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'overview' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabUser}
                        onClick={() => {
                            toggle(tabUser)
                        }}
                    >
                        <User size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'User' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === schedules}
                        onClick={() => {
                            toggle(schedules)
                        }}
                    >
                        <Calendar size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'schedules' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabVehicle}
                        onClick={() => {
                            toggle(tabVehicle)
                        }}
                    >
                        <Cpu size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'Vehicle' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabCenter}
                        onClick={() => {
                            toggle(tabCenter)
                        }}
                    >
                        <Map size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'center' })}</span>
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId={tabOverview}>
                    <TabOverview
                        days={days}
                        data={data}
                    />
                </TabPane>
                <TabPane tabId={tabUser}>

                </TabPane>
                <TabPane tabId={schedules}>
                    <TabSchedule
                        days={days}
                        schedule={schedule}
                        total={total}
                        dayOverview={dayOverview}
                        totalConfirmedSchedule={totalConfirmedSchedule}
                        totalCanceledSchedule={totalCanceledSchedule}
                        totalClosedSchedule={totalClosedSchedule}
                        totalSchedule={totalSchedule}
                    />
                </TabPane>
                <TabPane tabId={tabCenter}>
                    <Row sm='12'>
                        <Col sm='6'>
                            <TabStations
                                totalStations={totalStation}
                                totalOverloadStations={totalOverload}
                                totalActivedStations={totalActived}
                                totalWorkedStations={totalWorked}
                            />
                        </Col>
                        <Col sm='6'>
                            <Row>
                                <Col sm="6">
                                    <ProductivityTab />
                                </Col>
                                <Col sm="6">
                                    <LineTab />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" md="4" lg="4">
                            {active === tabCenter ? <ActiveCenter /> : null}
                        </Col>
                        <Col sm="12" md="4" lg="4">
                            {active === tabCenter ? <EnableBooking /> : null}
                        </Col>
                        <Col sm="12" md="4" lg="4">
                            {active === tabCenter ? <Wattage /> : null}
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Fragment>
    );
};

export default injectIntl(memo(TabReport));
