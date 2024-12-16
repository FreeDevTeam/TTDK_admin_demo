import React, { Fragment, useState, memo, useMemo, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  CardHeader,
  CardBody,
  CardImg,
  CardText
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import StationDevice from '../../../services/statiosDevice'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { readAllArea } from '../../../helper/localStorage'
import FormInput from '../../components/FormHook/FormInput'
import FormSelect from '../../components/FormHook/FormSelect'

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990; // Năm bắt đầu
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};

const FormDevice = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { stationDevicesId } = location.state
  const readArea = readAllArea()

  const schema = useMemo(() => {
    return yup.object().shape({
      deviceName: yup.string().required(intl.formatMessage({ id: 'isRequired' }))
    });
  }, [intl]);

  const { register, control, setValue, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [paramsFilter, setParamsFilter] = useState()
  const [total, setTotal] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [idTrans, setIdTrans] = useState(null)
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [active, setActive] = useState('1')
  const [date, setDate] = useState('')
  const [liqui, setLiqui] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const optionStation = readLocal.map((item) => ({
    value: item.stationsId,
    label: item.stationCode
  }))

  const getDetailUserById = (stationDevicesId) => {
    StationDevice.getDetailUserById({
      id: stationDevicesId
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res

        console.log("data" , data);
        if (statusCode === 200) {
          for (const [key, value] of Object.entries(data)) {
            setValue(key, value);
          }
        }
      }
    })
  }

  function handleUpdateData(data) {
    StationDevice.updateById(data).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          //   getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
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

  useEffect(() => {
    getDetailUserById(stationDevicesId)
  }, [])

  const onSubmit = (data) => {
    console.log("data", data);
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
              <CardText className="h3">{intl.formatMessage({ id: 'edit_device' })}</CardText>
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
    </Fragment >
  )
}

export default injectIntl(memo(FormDevice))
