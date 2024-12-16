import React, { memo, useState } from 'react'
import { ChevronLeft, HelpCircle } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardLink, CardTitle, Container, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap'
import ThirdPartyIntegration from '../../../../services/thirdPartyIntegrationService'
import MySwitch from '../../../components/switch'
import "./index.scss"

export function TelegramNotification({ intl }) {
  const history = useHistory()

  const [telegramForm, setTelegramForm] = useState({
    groupId: '',
    botToken: '',
    reportAppointmentCount: false,
    notifyNewAppointment: false,
    notifyNewDocument: false,
    isConnected: false,
    isEnable: false
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setTelegramForm({
      ...telegramForm,
      [name]: newValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const payload = {
        "id": 0,
        "data": {
          "telegramBotToken": telegramForm.botToken,
          "telegramChatId": telegramForm.groupId
        }
      }
      ThirdPartyIntegration.updateConfigsTelegram(payload)
    } catch (error) {
      
    }
     };

  return (
    <div className='telegram-noti'>
      <div className="pt-1 pl-1" style={{ cursor: 'pointer' }} onClick={() => history.push("/pages/expand-setting")}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>

      <Card className='telegram-noti_content'>
        <CardBody>
          <CardTitle>Các thông báo liên quan đến hệ thống sẽ được gửi đến Telegram (Group)</CardTitle>
          <CardLink href="#">
            Hướng dẫn cài đặt chatbot vào Group Telegram
          </CardLink>

          <div className='pt-1'>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label className='pr-2' for="isEnable">Hoạt Động</Label>
                <MySwitch
                  className="d-block"
                  name="isEnable"
                  checked={telegramForm.isEnable}
                  onChange={e => {
                    setTelegramForm({
                      ...telegramForm,
                      isEnable: e.target.checked
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="groupId">
                  Group / Channel ID
                  <span className="text-danger">*</span>
                  <HelpCircle className='ml-1' size={15} />
                </Label>
                <Input
                  required
                  type="text"
                  name="groupId"
                  id="groupId"
                  value={telegramForm.groupId}
                  onChange={handleChange}
                  addon={true}
                />
              </FormGroup>
              <FormGroup>
                <Label for="botToken">
                  Bot Token
                  <HelpCircle className='ml-1' size={15} />
                </Label>
                <Input
                  type="text"
                  name="botToken"
                  id="botToken"
                  value={telegramForm.botToken}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  type="checkbox"
                  id="reportAppointmentCount"
                  name="reportAppointmentCount"
                  checked={telegramForm.reportAppointmentCount}
                  onChange={handleChange}
                />
                <Label check>
                  Báo cáo số lượng lịch hẹn mỗi ngày
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  type="checkbox"
                  id="notifyNewAppointment"
                  name="notifyNewAppointment"
                  checked={telegramForm.notifyNewAppointment}
                  onChange={handleChange}
                />
                <Label check>

                  Thông báo có lịch hẹn mới
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  type="checkbox"
                  id="notifyNewDocument"
                  name="notifyNewDocument"
                  checked={telegramForm.notifyNewDocument}
                  onChange={handleChange}
                />
                <Label check>

                  Thông báo có công văn mới
                </Label>
              </FormGroup>
              <FormGroup className='pt-1'>
                <Label>Trạng thái kết nối:</Label>
                <Badge className='expand-status' color={telegramForm.isConnected ? 'success' : 'secondary'}>
                  {telegramForm.isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                </Badge>
              </FormGroup>
              <Button className='mr-2' color="primary" type="submit">Cập nhật</Button>

              <Button outline type="button">Gửi thử nhiệm</Button>
            </Form>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
export default injectIntl(memo(TelegramNotification))
