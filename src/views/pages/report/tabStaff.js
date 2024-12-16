import React, { memo, Fragment, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import tabStaffService from '../../../services/tabStaffService'

import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, Media } from 'reactstrap'

const TabStaff = ({ active,intl }) => {

    const DefaultFilter = {
        filter: {

        },
        limit: 20,
        skip: 0,
        order: {
            "key": "createdAt",
            "value": "desc"
        }
    }
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
    const [dataStaff, setDataStaff] = useState()
    let statusActivedTabStaff = "2"

    const dataStaffHandler = (paramsFilter) => {
        tabStaffService.getListStaff(paramsFilter).then((result) => {
            if (result) {
                setDataStaff(result.data);
            }
        })
    }

    const transactionsArr = [
        {
            title: 'Wallet',
            color: 'light-primary',
            subtitle: 'Starbucks',
            amount: '- $74',
            Icon: Icon['Pocket'],
            down: true
        },
        {
            title: 'Bank Transfer',
            color: 'light-success',
            subtitle: 'Add Money',
            amount: '+ $480',
            Icon: Icon['Check']
        },
        {
            title: 'Paypal',
            color: 'light-danger',
            subtitle: 'Add Money',
            amount: '+ $590',
            Icon: Icon['DollarSign']
        },
        {
            title: 'Mastercard',
            color: 'light-warning',
            subtitle: 'Ordered Food',
            amount: '- $12',
            Icon: Icon['CreditCard'],
            down: true
        },
        {
            title: 'Transfer',
            color: 'light-info',
            subtitle: 'Refund',
            amount: '+ $98',
            Icon: Icon['TrendingUp']
        }
    ]

    const renderTransactions = () => {
        return transactionsArr.map(item => {
            return (
                <div key={item.title} className='transaction-item'>
                    <Media>
                        <Avatar className='rounded' color={item.color} icon={<item.Icon size={18} />} />
                        <Media body>
                            <h6 className='transaction-title'>{item.title}</h6>
                            <small>{item.subtitle}</small>
                        </Media>
                    </Media>
                    <div className={`font-weight-bolder ${item.down ? 'text-danger' : 'text-success'}`}>{item.amount}</div>
                </div>
            )
        })
    }

    useEffect(() => {
        if (active === statusActivedTabStaff) {
            dataStaffHandler(paramsFilter)
        }
        else {
            return 1
        }
    }, [active]);

    return (
        <Fragment>
            <Card className='card-transaction'>
                <CardHeader>
                    <CardTitle tag='h4'>{intl.formatMessage({ id: 'staff' })}</CardTitle>
                    <Icon.MoreVertical size={18} className='cursor-pointer' />
                </CardHeader>
                <CardBody>{renderTransactions()}</CardBody>
            </Card>
        </Fragment>
    )
}
export default injectIntl(memo(TabStaff))