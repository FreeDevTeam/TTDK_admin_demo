import React, { memo, useMemo, useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button, CardBody, FormGroup, Label, Badge } from 'reactstrap'
import { toast } from 'react-toastify'
import './index.scss'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useEffect } from 'react'
import StationFunctions from '../../../services/StationFunctions'
import MySwitch from '../../components/switch'
import IntegratedService from '../../../services/Integrated'

const IntegratedEdit = ({ intl }) => {
    const CONTENT_TAB = {
        system: {
          name: 'Hệ Thống',
          content: [
            { key: 'enableOperateMenu', value: 0, label: intl.formatMessage({ id: 'operation' }) },
            { key: 'enableCustomerMenu', value: 0, label: intl.formatMessage({ id: 'customer' })},
            { key: 'enableScheduleMenu', value: 0, label: intl.formatMessage({ id: 'schedule' })},
            { key: 'enableMarketingMessages', value: 0, label: intl.formatMessage({ id: 'marketing_online' })},
            { key: 'enableDocumentMenu', value: 0, label: intl.formatMessage({ id: 'documentEnable' }) },
            { key: 'enableDeviceMenu', value: 0, label: intl.formatMessage({ id: 'devices' }) },
            { key: 'enableManagerMenu', value: 0, label: intl.formatMessage({ id: 'management' })},
            { key: 'enableVehicleRegistrationMenu', value: 0, label: intl.formatMessage({ id: 'vehicleRegistration' }) },
            { key: 'enableContactMenu', value: 0, label: intl.formatMessage({ id: 'phone_book' }) },
            { key: 'enableChatMenu', value: 0, label: intl.formatMessage({ id: 'chat' }) },
            { key: 'enableNewsMenu', value: 0, label: intl.formatMessage({ id: 'News' }) }
          ]
        },
        //Dich vu update sau
        service: {
          name: 'Dịch vụ',
          content: [
            { key: 'stationEnableUseMomo', value: 0, label: 'Sử dụng Momo' },
            { key: 'stationEnableUseEmail', value: 0, label: 'Sử dụng Email' },
            { key: 'stationEnableUseVNPAY', value: 0, label: 'Sử dụng VNPAY' },
            { key: 'stationEnableUseZNS', value: 0, label: 'Sử dụng ZNS' },
            { key: 'stationEnableUseSMS', value: 0, label: 'Sử dụng SMS' }
          ]
        }
      }
  const [activeTab, setActiveTab] = useState('system')
  const [contentTab, setContentTab] = useState(CONTENT_TAB)
  const history = useHistory()
  const params = useParams()
  const stationID = params?.id
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const handleUpadateData = async (obj) => {
      const body = {
        id: stationID,
        data: {
          [obj.key]: obj.value
        }
      }
      const res = await IntegratedService.handleUpdateData(body)
      if (res.statusCode === 200) {
        // Tạo một bản sao của state contentTab
        const cloneTabContent = JSON.parse(JSON.stringify(contentTab))

        // Duyệt qua mỗi tab
        Object.keys(cloneTabContent).forEach((tabKey) => {
          // Duyệt qua mỗi mục trong content của tab đó
          cloneTabContent[tabKey].content.forEach((item) => {
            // Kiểm tra xem key của mục có trùng với key được truyền vào không
            if (item.key === obj.key) {
              // Cập nhật giá trị của mục
              item.value = obj.value
            }
          })
        })

        // Cập nhật state mới
        setContentTab(cloneTabContent)
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
      }else{
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))

      }
  }

  const memoizedCountContentWithValueOne = useMemo(() => {
    return () => {
      let res = {}
      Object.keys(contentTab).forEach((tabKey) => {
        const content = contentTab[tabKey].content;
        let count = 0
        content.forEach((item) => {
          if (item.value === 1) {
            count ++
          }
        });
        res = {
            ...res,
            [tabKey]:count
        }
      });

      return res;
    };
  }, [contentTab]);
  const handleGetStationById = async (id) => {
    if (id) {
      const { data } = await StationFunctions.getStaionById({ id })
      //map data
      const cloneTabContent = JSON.parse(JSON.stringify(contentTab))
      const keysTab = Object.keys(cloneTabContent)
      keysTab.forEach((keyTab) => {
        cloneTabContent[keyTab].content.forEach((item) => {
          // Kiểm tra xem item.key có trong dữ liệu trả về từ API không
          if (data.hasOwnProperty(item.key)) {
            // Cập nhật giá trị value của item từ dữ liệu API
            item.value = data[item.key]
          }
        })
      })
      // Cập nhật state mới
      setContentTab(cloneTabContent)
    }
  }

  useEffect(() => {
    handleGetStationById(stationID)
  }, [stationID])

  const renderTabContent = () => {
    return Object.keys(contentTab).map((key, index) => {
      const tab = contentTab[key]
      return (
        <TabPane key={index} tabId={key}>
          <Card>
            <CardBody>
              <Row>
                {tab.content.map((content, appIndex) => (
                  <Col sm="2" key={appIndex}>
                    <FormGroup>
                      <Label className="pr-2" for="isEnable">
                        {content.label}
                      </Label>
                      <div className="d-block">
                        <MySwitch
                          name={content.key}
                          checked={content.value}
                          onChange={(e) => {
                            handleUpadateData({
                              key: content.key,
                              value: e.target.checked ? 1 : 0
                            })
                          }}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </TabPane>
      )
    })
  }

  return (
    <div className="expand-setting">
      <div className="pointer mb-1" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>
      <Nav tabs>
        {Object.keys(contentTab).map((key, index) => (
          <NavItem key={index}>
            <NavLink className={activeTab === key ? 'active' : ''} onClick={() => toggleTab(key)}>
              {contentTab[key].name} 
              <Badge className='ml-2' color='primary' >{memoizedCountContentWithValueOne()[key]} </Badge>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>{renderTabContent()}</TabContent>
    </div>
  )
}

export default injectIntl(memo(IntegratedEdit))
