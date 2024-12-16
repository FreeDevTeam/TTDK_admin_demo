import { Fragment, useEffect, useState, memo } from 'react'
import {
    Card,
    Row,
    Col,
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import './index.scss'
import { readAllStationsDataFromLocal } from "../../../../helper/localStorage"
import Icon from '@mdi/react';
import { mdiCartOutline, mdiLinkVariant } from '@mdi/js';

const ProductivityTab = ({ intl }) => {

    const totalLine = (array) => {
        let sum = 0;
        array.map((value) => {
            sum += value?.totalInspectionLine;
        });

        return sum;
    }

    const totalReality = (array) => {
        let sum = 0;
        array.map((value) => {
            value?.stationBookingConfig.filter(
                (item, oneValue = 1) => {
                    if (item?.enableBooking === oneValue) {
                        return sum += item?.limitSmallCar + item?.limitOtherVehicle
                    }
                }
            )
        });
        return sum
    }

    const totalLineInspect = totalLine(readAllStationsDataFromLocal)
    const totalRealitys = totalReality(readAllStationsDataFromLocal)
    const totalProductives = totalLineInspect * 40
    const totalNotOpen = totalProductives - totalRealitys


    return (
        <Fragment>
            <Row className='height-row'>
                <Col sm='12'>
                    <Card sm='6'>
                        <Row className="block-content">
                            <Col sm='12'><div className='size-title'>{intl.formatMessage({ id: "wattage" })}</div></Col>
                            <Col sm='12'><div className='text-content'>{totalProductives}</div></Col>
                        </Row>
                        <Row>
                            <Col sm='6' className="block-content ml-10">
                                <Col sm='6'>
                                    <div className='block-icon'>
                                        <Icon className='mdiCartOutline-color' path={mdiCartOutline} size={1} />
                                    </div>
                                </Col>
                                <Col sm='6'>
                                    <div className='width-content text-others margintop-5'>
                                        {intl.formatMessage({ id: "notopen" })}
                                    </div>
                                </Col>
                            </Col>
                            <Col sm='6' className="block-content ml-10">
                                <Col sm='6'>
                                    <div>
                                        <Icon className='mdiLinkVariant-color' path={mdiLinkVariant} size={1} />
                                    </div>
                                </Col>
                                <Col sm='6'>
                                    <div className='width-content text-others'>
                                        {intl.formatMessage({ id: "reality" })}
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm='6' className='ps-10 ps-10-reponsive'>{totalNotOpen}</Col>
                            <Col sm='6' className='ps-10 mt-30'>{totalRealitys}</Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(memo(ProductivityTab))
