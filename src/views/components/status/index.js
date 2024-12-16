import React from 'react'
import './status.module.scss'
import { injectIntl } from 'react-intl';

const Status = ({ intl, params}) => {
  return (
    <div>
    {params >= 2 ? <div className='olnine'>
      <span className='text_olnine'>
      {intl.formatMessage({ id: 'Off' })}{' : '}
        {params}{' '}{intl.formatMessage({ id: 'day' })}</span>
    </div>
      : <p className='circle_blue'>{intl.formatMessage({ id: "actived" })}</p>}
  </div>
  )
}

export default injectIntl(Status)
