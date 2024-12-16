
import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useState } from 'react'
import { injectIntl } from "react-intl"
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import ListBanner from './listBanner'

const Automation = ({intl}) => {
    const [active, setActive] = useState('1')

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
            active={active === '1'}
            onClick={() => {
                toggle('1')
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'Banner' })}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
                toggle('2')
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'marketing' })}</span>
          </NavLink>
        </NavItem>
      </Nav>
        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId={'1'}>
            <Row >
              <Col sm='12' xs='12'>
                <ListBanner />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={'2'}>
            <Row >
              <Col sm='12' xs='12'>
                {/* <Marketing /> */}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Fragment>
  );
}

export default injectIntl(memo(Automation)) 

