import React, { memo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
    Button,
    Card,
    CardText,
    CardTitle,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
  } from 'reactstrap';
import MySwitch from '../../components/switch';
import { ChevronLeft } from 'react-feather';
import { injectIntl } from "react-intl";
import "./index.scss";

function Detail({intl}) {
  const history = useHistory();
    const [activeTab, setActiveTab] = useState('1');
//    const toggle = (tab) => {
//         if (activeTab !== tab) {
//             setActiveTab(tab);
//         }
//       }
  return (
    <div>
  <Card className='mx-0 mt-1 mb-50 p-2'>
  <div className="pointer mb-1" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
    <Nav tabs>
      <NavItem>
        <NavLink
          className={activeTab == '1' ? 'active' : ''}
          onClick={() => setActiveTab('1')}
        >
          {intl.formatMessage({ id: "momo" })}
        </NavLink>
      </NavItem>
  
      <NavItem>
        <NavLink
          className={activeTab == '2' ? 'active' : ''}
          onClick={() => setActiveTab('2')}
        >
          {intl.formatMessage({ id: 'Zalo_ZNS' })}
        </NavLink>
      </NavItem>
  
      <NavItem>
        <NavLink
          className={activeTab == '3' ? 'active' : ''}
          onClick={() => setActiveTab('3')}
        >
          {intl.formatMessage({ id: "sms" })}
        </NavLink>
      </NavItem>
  
      <NavItem>
        <NavLink
          className={activeTab == '4' ? 'active' : ''}
          onClick={() => setActiveTab('4')}
        >
          {intl.formatMessage({ id: "email" })}
        </NavLink>
      </NavItem>
  
      <NavItem>
        <NavLink
          className={activeTab == '5' ? 'active' : ''}
          onClick={() => setActiveTab('5')}
        >
          {intl.formatMessage({ id: "VNPAY" })}
        </NavLink>
      </NavItem>
    </Nav>
    <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
          <MySwitch checked={true }/>
          </TabPane>
          <TabPane tabId="2">
          <MySwitch checked={false }/>
          </TabPane>
          <TabPane tabId="3">
          <MySwitch checked={true }/>
          </TabPane>
          <TabPane tabId="4">
          <MySwitch checked={false }/>
          </TabPane>
          <TabPane tabId="5">
          <MySwitch checked={true }/>
          </TabPane> 
      </TabContent>
  </Card>
</div>
  )
}
export default injectIntl(memo(Detail))