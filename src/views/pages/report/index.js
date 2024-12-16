// @ts-nocheck
// ** React Imports
import React, { Fragment, useState, useEffect, memo, lazy } from "react";
// ** Store & Actions
import { Home, Settings, EyeOff, User, Calendar, HardDrive, Cpu, Map } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import TabOverview from './tabOverview'
import TabStations from './tabStations'
import "./index.scss";
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

import { injectIntl } from "react-intl";
const ActiveCenter = lazy(() =>import("./Center/ActiveCenter"))

const TabReport = ({ intl }) => {
    // ** Store Vars

    let tabOverview = '1'
    let tabStations = '2'
    let tabUser = '3'
    let schedules = '4'
    let tabVehicle = '5'
    let tabCenter = '6'
    const [active, setActive] = useState(tabOverview)

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }
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
                </TabPane>
                <TabPane tabId={tabCenter}>
                    <ActiveCenter />
                </TabPane>
            </TabContent>
        </Fragment>
    );
};

export default injectIntl(memo(TabReport));
