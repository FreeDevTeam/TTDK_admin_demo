import React from 'react'
import { injectIntl } from 'react-intl'
import { VEHICLE_TYPE } from "./../../../constants/app";

const Type = ({ intl, vehicleType }) => {
  return (
    <div>
      {vehicleType === VEHICLE_TYPE.CAR
        ? intl.formatMessage({ id: 'car' })
        : vehicleType === VEHICLE_TYPE.OTHER
        ? intl.formatMessage({ id: 'other' })
        : intl.formatMessage({ id: 'ro_mooc' })}
    </div>
  )
}

export default injectIntl(Type)
