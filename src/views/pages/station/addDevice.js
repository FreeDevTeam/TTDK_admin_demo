import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import React, { Fragment, memo, useState, useMemo } from 'react'
import { ChevronLeft } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm, Controller } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'
import './index.scss'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { readAllArea } from '../../../helper/localStorage'
import StationDevice from '../../../services/statiosDevice'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../components/FormHook/FormInput'
import FormSelect from '../../components/FormHook/FormSelect'

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990; // Năm bắt đầu
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push({
      value: year.toString(),
      label: year.toString()
    });
  }
  return years;
};

const AddDevice = ({ intl }) => {
  const history = useHistory()

  const schema = useMemo(() => {
    return yup.object().shape({
      deviceName: yup.string().required(intl.formatMessage({ id: 'isRequired' }))
    });
  }, [intl]);

  const { register, control, errors, handleSubmit } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {}
  });

  const onSubmit = (data) => {
    console.log("data", data);
  }

  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [date, setDate] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const readArea = readAllArea()
  const listStation = readLocal.sort((a, b) => a - b)
  const optionStation = readLocal.map((item) => ({
    value: item.stationsId,
    label: item.stationCode
  }))

  function handleInsert(data) {
    StationDevice.handleInsert(data).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
    setUserDataTouched({
      ...userDataTouched,
      [name]: value
    })
  }

  return (
    <Fragment>
      <Row>
        <Col sm="8" xs="12">
          <Card>
            <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
              <ChevronLeft />
              {intl.formatMessage({ id: 'goBack' })}
            </div>
            <CardHeader className="justify-content-center flex-column">
              <CardText className="h3">{intl.formatMessage({ id: 'add_device' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(onSubmit)}
              >
                <Row>
                  <Col sm="6" xs="12">
                    <FormSelect control={control} labelId='center' name="stationsId" rules={{ required: true }} errors={errors} intl={intl} options={optionStation} />
                    <FormInput control={control} labelId='device_name' name="deviceName" rules={{ required: true }} errors={errors} intl={intl} isRequired />
                    <FormInput control={control} labelId='status' name="status" rules={{ required: true }} errors={errors} intl={intl} />
                    <FormInput control={control} labelId='chain_type' name="deviceType" rules={{ required: true }} errors={errors} intl={intl} />
                  </Col>
                  <Col sm="6" xs="12">
                    <FormInput control={control} labelId='serial_number' name="serialNumber" rules={{ required: true }} errors={errors} intl={intl} />
                    <FormInput control={control} labelId='brand' name="deviceBrand" rules={{ required: true }} errors={errors} intl={intl} />
                    <FormSelect control={control} labelId='year_manufacture' name="manufactureYear" rules={{ required: true }} errors={errors} intl={intl} options={getYearOptions()} />
                  </Col>
                </Row>
                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: 'submit' })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(AddDevice))
