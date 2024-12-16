import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button, CardBody } from 'reactstrap';
import { toast } from 'react-toastify';
import teleSvg from '@src/assets/images/svg/telegram.svg'
import zalo from '@src/assets/images/svg/zalo.svg'
import ttdk from '@src/assets/images/svg/ttdk.svg'
import fpt from '@src/assets/images/svg/fpt.svg'
import viettel from '@src/assets/images/svg/viettel.svg'
import vnpt from '@src/assets/images/svg/vnpt.svg'
import vivas from '@src/assets/images/icons/logo_vivas.png'
import vmg from '@src/assets/images/icons/vmg.png'
import zaloZns from '@src/assets/images/icons/zalo-zns.png'
import mailgun from '@src/assets/images/svg/mailgun.svg'
import "./index.scss"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const EXPAND_SETTING_APP = {
    notification: {
        name: 'Thông báo',
        apps: [
            { name: 'Telegram',path:"/pages/telegram-integration",icon:teleSvg, isEnabled: true },
            { name: 'Zalo',icon:zalo, isEnabled: false }
        ],
    },
    sms: {
        name: 'SMS',
        apps: [
            { name: 'TTDK', icon:ttdk,isEnabled: false },
            { name: 'VMG', icon:vmg,isEnabled: false },
            { name: 'Vivas',icon:vivas,isEnabled: false },
            { name: 'FPT', icon:fpt,isEnabled: false },
            { name: 'VNPT', icon:vnpt,isEnabled: false },
            { name: 'Viettel', icon:viettel,isEnabled: false }
        ],
    },
    zaloMessage: {
        name: 'Tin nhắn Zalo',
        apps: [
            { name: 'TTDK',icon:ttdk, isEnabled: false },
            { name: 'Zalo ZNS',icon:zaloZns, isEnabled: false },
            { name: 'SmartGift',isEnabled: false }
        ],
    },
    email: {
        name: 'Email',
        apps: [
            { name: 'SMTP Server', isEnabled: false },
            { name: 'Mailgun',icon:mailgun, isEnabled: false }
        ],
    }
};

const toastMessage = 'Chức năng đang tắt. Vui lòng liên hệ đội ngũ kỹ thuật qua email info@ttdk.com.vn hoặc hotline 0343902960 (Zalo) để được hỗ trợ'

const ExpandSettingTabs = () => {
    const [activeTab, setActiveTab] = useState('notification');
    const history = useHistory()

    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const handleAppClick = (app) => {
        if (!app.isEnabled) {
            toast.error(toastMessage);
        } else {
            history.push(app.path)
        }
    };

    const renderTabContent = () => {
        return Object.keys(EXPAND_SETTING_APP).map((key, index) => {
            const tab = EXPAND_SETTING_APP[key];
            return (
                <TabPane key={index} tabId={key}>
                    <Row>
                        {tab.apps.map((app, appIndex) => (
                            <Col sm="4" key={appIndex}>
                                <Card onClick={() => handleAppClick(app)}>
                                 <CardBody className={`expand-setting_content ${app?.isEnabled ? '' :'expand-setting_disabled'}`}>
                                       {app?.icon ? <img src={app?.icon}/> : <div className='expand-setting_content-icon'>{app?.name}</div> } 
                                        <CardTitle className='expand-setting_title'>{app?.name}</CardTitle>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
            );
        });
    };

    return (
        <div className='expand-setting'>
            <Nav tabs>
                {Object.keys(EXPAND_SETTING_APP).map((key, index) => (
                    <NavItem key={index}>
                        <NavLink
                            className={activeTab === key ? 'active' : ''}
                            onClick={() => toggleTab(key)}
                        >
                            {EXPAND_SETTING_APP[key].name}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab}>
                {renderTabContent()}
            </TabContent>
        </div>
    );
};

export default ExpandSettingTabs;
