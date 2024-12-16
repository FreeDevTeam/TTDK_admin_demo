import { kFormatter } from '@utils'
import {
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  Progress
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import './AvgSessions.scss'
import _ from 'lodash'

const AvgSessions = props => {
  const { data = {} } = props 

  function findSMSValue(searchText1, searchText2) {
    if(data && data.totalSMSMessageByStatus && data.totalSMSMessageByStatus.length > 0) {
      let findMessageSent
      if(searchText2) {
        findMessageSent = data.totalSMSMessageByStatus.find(item => (item.customerMessageStatus === searchText2 ||  item.customerMessageStatus === searchText1))
      } else {
        findMessageSent = data.totalSMSMessageByStatus.find(item => item.customerMessageStatus === searchText1)
      }
      if(findMessageSent && findMessageSent.count) {
        return findMessageSent.count
      }
    }
    return 0
  }

  const SMSSent = findSMSValue("Completed")
  const SMSUnSend = findSMSValue("New","Sending")
  const SMSSendFail = findSMSValue("Failed","Canceled")

  return data !== null ? (
    <Card>
      <CardBody>
        <Row className='pb-50'>
          <Col
            sm={{ size: 6, order: 1 }}
            xs={{ order: 2 }}
            className='d-flex justify-content-between mt-lg-0 mt-2'
          >
            <div className='session-info mb-1 mb-lg-0'>
              <h2 className='font-weight-bold mb-25'>{kFormatter(data.totalSMSMessage ? data.totalSMSMessage : 0)}</h2>
              <CardText className='font-weight-bold mb-2'>{props.intl.formatMessage({id: "message"})} SMS</CardText>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className='pt-50'>
          <div className='col-12'>
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>{props.intl.formatMessage({id: "money"})} SMS: {kFormatter(data.smsSpentAmount ? data.smsSpentAmount : 0)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={data.smsSpentAmount ? (data.smsSpentAmount/data.TotalMoney*100) : 0} />
            </div>
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>{props.intl.formatMessage({id: "sent"}, {type: "SMS"})}: {kFormatter(SMSSent)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={SMSSent !== 0 ? (SMSSent/data.totalMessageCount*100) : SMSSent} />
            </div>
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>
                {props.intl.formatMessage({id: "unsentMessage"}, {type: "SMS"})} SMS: {kFormatter(SMSUnSend)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={SMSUnSend !== 0 ? (SMSUnSend/data.totalMessageCount*100) : SMSUnSend} />
            </div>
            {/*  */}
            <div className='mb-3'>
              <p className='mb-50 my_text'>
                {props.intl.formatMessage({id: "sendFailed"}, { type: "SMS" })} SMS: {kFormatter(SMSSendFail)}</p>
              <Progress className='avg-session-progress progress-bar-warning mt-25' value={SMSSendFail !== 0 ? (SMSSendFail/data.totalMessageCount*100) : SMSSendFail} />
            </div>
            {/*  */}
          </div>
        </Row>
      </CardBody>
    </Card>
  ) : null
}
export default injectIntl(AvgSessions)