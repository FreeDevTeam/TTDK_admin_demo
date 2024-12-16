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

const LineTab = ({ intl }) => {

    const totalLine = (array) => {
        let sum = 0;
        array.map((value) => {
            sum += value?.totalInspectionLine;
        });

        return sum;
    }

    const totalActive = (array) => {
        let sum = 0;
        array?.filter((item, oneValue = 1) => {
            if (item?.stationStatus === oneValue) {
                console.log(item)
                return item
            }
            if (item) {
                [item]?.map((value) => {
                    return sum += value?.totalInspectionLine;
                });
            }

        }
        )
        return sum
    }
    const totalNotActive = (array) => {
        let sum = 0;
       const x=  array?.filter((item, zeroValue = 0) => {
            if (item?.stationStatus === zeroValue) {
                 return true
            }
           

        }
        )
        return sum
    }


    const totalLineInspect = totalLine(readAllStationsDataFromLocal)
    const totalActives = totalActive(readAllStationsDataFromLocal)
    const totalNotActives = totalNotActive(readAllStationsDataFromLocal)

    console.log(totalActive(readAllStationsDataFromLocal))
    return (
        <Fragment>
            <Row className='height-row'>
                <Col sm='12'>
                    <Card sm='6'>
                        <Row className="block-content">
                            <Col sm='12'><div className='size-title'>{intl.formatMessage({ id: "chain_number" })}</div></Col>
                            <Col sm='12'><div className='text-content'>{totalLineInspect}</div></Col>
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
                                        {intl.formatMessage({ id: "actived" })}
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
                                        {intl.formatMessage({ id: "pause" })}
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm='6' className='ps-10 ps-10-reponsive'>{totalActives}</Col>
                            <Col sm='6' className='ps-10 mt-30'>{totalNotActives}</Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(memo(LineTab))
