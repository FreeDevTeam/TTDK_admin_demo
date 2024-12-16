import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import { STATION_STATUS_FILTER, STATION_STATUS_FILTER_ZERO } from '../../../../constants/dateFormats'
import DataTableServerSide from '../../../pages/user/index'

const TotalUser = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
      active: STATION_STATUS_FILTER,
      appUserRoleId: STATION_STATUS_FILTER_ZERO
    },
    skip: 0,
    limit: 10
  }

  const [open, setOpen] = useState(false)

  return data !== undefined ? (
    <>
    <StatsWithAreaChart
      icon={<Box size={21} />}
      color='warning'
      stats={formatDisplayNumber(data)}
      statTitle={intl.formatMessage({id: "total_user"})}
      className='col-widget'
      symboy={true}
        open={open}
        setOpen={setOpen}
    />
    <Modal
        isOpen={open}
        toggle={() => setOpen(false)}
        className={`modal-dialog-centered `}
        style={{ maxWidth: window.innerWidth <= 768 ? '100%' : '80%' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'total_user' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <DataTableServerSide filterParam={DefaultFilter}/>
          </div>
        </ModalBody>
      </Modal>
    </>
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <SpinnerTextAlignment size={60} />
</Card>
}

export default injectIntl(TotalUser)