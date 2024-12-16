// @ts-nocheck
// ** React Imports
import React, { Fragment, useState, useEffect, memo, lazy } from "react";
// ** Store & Actions
import { Home, Settings, EyeOff, User, Calendar, HardDrive, Cpu, Map } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import TabOverview from './tabOverview'
import TabStations from './tabStations'
import "./index.scss";
import TabSchedule from './tabSchedule'
import {
    Card,
    CardHeader,
    CardBody,
    CardText,
    Input,
    Label,
    Row,
    Col,
} from "reactstrap";
import ReportService from '../../../services/reportService'
import { injectIntl } from "react-intl";


import moment from "moment";
const DefaultFilter = {
};


const ActiveCenter = lazy(() => import("./Center/ActiveCenter"))
const EnableBooking = lazy(() => import("./Center/EnableBooking"))


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
    const [filterShedule, setFilterSchedule] = useState(FILTER_SCHEDULE)

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
    const DataChart = (paramsFilter) => {
        ReportService.DataChart(paramsFilter).then((result) => {
            if (result) {
                setDays(result.data);
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
    const ScheduleOverview = (paramsFilter) => {
        ReportService.ScheduleOverview(paramsFilter).then((result) => {
            if (result) {
                setDayOverview(result.data);
            }
        })
    }

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const scheduleNew = schedule.filter(schedule => schedule?.CustomerScheduleStatus === statusNew)
    const scheduleConfirmed = schedule.filter(schedule => schedule?.CustomerScheduleStatus === statusConfirmed)
    const scheduleCanceled = schedule.filter(schedule => schedule?.CustomerScheduleStatus === statusCanceled)
    const scheduleClosed = schedule.filter(schedule => schedule?.CustomerScheduleStatus === statusClosed)
    const efficiencyNew = scheduleNew.length
    const efficiencyConfirmed = scheduleConfirmed.length
    const efficiencyCanceled = scheduleCanceled.length
    const efficiencyClosed = scheduleClosed.length

    useEffect(() => {
        DataChart(paramsFilter)
        ScheduleChart(filterShedule)
        ScheduleOverview(filterShedule)
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
                        active={active === tabStations}
                        onClick={() => {
                            toggle(tabStations)
                        }}
                    >
                        <HardDrive size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'stations' })}</span>
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
                    <TabOverview />
                </TabPane>
                <TabPane tabId={tabStations}>
                    <TabStations />
                </TabPane>
                <TabPane tabId={tabUser}>

                </TabPane>
                <TabPane tabId={schedules}>
                    <TabSchedule
                        days={days}
                        schedule={schedule}
                        efficiencyNew={efficiencyNew}
                        efficiencyConfirmed={efficiencyConfirmed}
                        efficiencyCanceled={efficiencyCanceled}
                        efficiencyClosed={efficiencyClosed}
                        total={total}
                        dayOverview={dayOverview}
                    />
                </TabPane>
                <TabPane tabId={tabCenter}>
                    <Row>
                        <Col sm="12" md="4" lg="4">
                            <ActiveCenter />
                        </Col>
                        <Col sm="12" md="4" lg="4">
                            <EnableBooking />
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Fragment>
    );
};

export default injectIntl(memo(TabReport));
