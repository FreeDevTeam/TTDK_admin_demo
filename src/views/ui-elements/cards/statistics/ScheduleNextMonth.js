import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import moment from 'moment'
import { useState } from 'react'
import { Box } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import ListSchedule from '../../../pages/schedule/index'
import './index.scss'

const ScheduleNextMonth = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 10,
    startDate: moment().add(1, 'month').startOf('month').format('DD/MM/YYYY'),
    endDate: moment().add(1, 'month').endOf('month').format('DD/MM/YYYY')
  }

  const [open, setOpen] = useState(false)

  return data !== undefined ? (
    <>
      <StatsWithAreaChart
        icon={<Box size={21} />}
        color="warning"
        stats={formatDisplayNumber(data)}
        statTitle={intl.formatMessage({ id: 'schedule_next_month' })}
        className="col-widget"
        symboy={true}
        open={open}
        setOpen={setOpen}
      />
      <Modal
        isOpen={open}
        toggle={() => setOpen(false)}
        className={`modal-dialog-centered `}
        style={{ maxWidth: window.innerWidth <= 768 ? '100%' : '80%' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'schedule_next_month' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <ListSchedule filterParam={DefaultFilter} />
          </div>
        </ModalBody>
      </Modal>
    </>
  ) : (
    <Card className="col-widget d-flex justify-content-center align-items-center">
      <SpinnerTextAlignment size={60} />
    </Card>
  )
}

export default injectIntl(ScheduleNextMonth)
