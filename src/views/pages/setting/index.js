import React from 'react'
import { 
  Card, Form, Input,
  Row, Col, Button,
  FormGroup, Label
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl';
import './setting.scss'
import Request from '../../../services/request'
import { toast } from 'react-toastify';

function Setting({ intl }) {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [setting, setSetting] = React.useState({
    pricePerSMS: 0,
    pricePerEmail: 0,
    pricePerTenant: 0
  })

  function fetchData() {
    Request.send({
      method: "POST",
      path: "SystemConfigurations/findById",
      data: {
        id: 1
      }
    }).then(result => {
      if(result && result.statusCode === 200) {
        const { data } = result
        setSetting(data)
      }
    })
  }

  React.useEffect(() => {
    fetchData()
  },[])

  function handleChangePrice(values) {
    Request.send({
      method: "POST",
      path: "SystemConfigurations/updateById",
      data: {
        data: values
      }
    }).then(res => {
      if(res && res.statusCode === 200) {
        toast.success(intl.formatMessage({id: "actionSuccess"}, { action: intl.formatMessage({id: "update" })}))
      } else {
        toast.error(intl.formatMessage({id: "actionFailed"}, { action: intl.formatMessage({id: "update" })}))
      }
    })
  }

  return (
    <React.Fragment>
      <Card>
        <div className="setting">
          <h1 className="setting__title">{intl.formatMessage({id: "setting"})}</h1>
          <Row>
            <Col sm="12" md="9">
              <Form onSubmit={handleSubmit((data) => {
                handleChangePrice(data)
              })}
              >
                <FormGroup row>
                  <Label sm="3" for='pricePerSMS'>
                  {intl.formatMessage({id: "settingPrice"}, { type: "SMS" })}
                  </Label>
                  <Col sm='5'>
                    <Input
                      id='pricePerSMS'
                      name='pricePerSMS'
                      innerRef={register({ required:  true })}
                      invalid={errors.pricePerSMS && true}
                      placeholder={intl.formatMessage({ id: "settingPrice" }, {type: "SMS"})}
                      value={setting.pricePerSMS}
                      type="number"
                      onChange={(e) => {
                        const { name, value } = e.target
                        setSetting({
                          ...setting,
                          [name]: value
                        })
                      }}
                    />
                  </Col>
                  <Col sm="4">
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="pricePerEmail">
                    {intl.formatMessage({id: "settingPrice"}, { type: "Email" })}
                  </Label>

                  <Col sm='5'>
                    <Input
                      id='pricePerEmail'
                      name='pricePerEmail'
                      innerRef={register({ required: true })}
                      invalid={errors.pricePerEmail && true}
                      placeholder={intl.formatMessage({ id: "settingPrice" }, {type: "Email"})}
                      type="number"
                      value={(setting && setting.pricePerEmail) || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setSetting({
                          ...setting,
                          [name]: value
                        })
                      }}
                    />
                  </Col>
                  <Col sm="4">
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="pricePerTenant">
                    {intl.formatMessage({id: "settingPrice"}, { type: intl.formatMessage({id: 'station'}) })}
                  </Label>

                  <Col sm='5'>
                    <Input
                      id='pricePerTenant'
                      name='pricePerTenant'
                      innerRef={register({ required: true })}
                      invalid={errors.pricePerTenant && true}
                      placeholder={intl.formatMessage({ id: "settingPrice" }, {type: intl.formatMessage({id: 'station'})})}
                      type="number"
                      value={(setting && setting.pricePerTenant) || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setSetting({
                          ...setting,
                          [name]: value
                        })
                      }}
                    />
                  </Col>
                  <Col sm="4">
                  </Col>
                </FormGroup>
                <FormGroup className='mb-0 mt-3'>
                  <Row>
                    <Col sm="4">
                      <Button.Ripple className='mr-1 mb-1 w-100' color='primary' type='submit'>
                        {intl.formatMessage({ id: "submit" })}
                      </Button.Ripple>
                    </Col>
                    <Col sm='4'>
                      <div>
                        <Button.Ripple  className='w-100' onClick={fetchData}>
                          {intl.formatMessage({ id: "cancel" })}
                        </Button.Ripple>
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
                
              </Form>

            </Col>
          </Row>
        </div>
      </Card>


    </React.Fragment >
  )
}

export default injectIntl(Setting)
