// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */
import { User, MessageSquare, Shield, HardDrive, Cast, Image, Settings } from 'react-feather'
export default [
  {
    id: 'station',
    title: 'stations',
    icon: <HardDrive size={12} />,
    permissions: [],
    navLink: '/pages/station'
  },
  {
    id: 'account-admin',
    title: 'admin',
    icon: <Shield size={12} />,
    permissions: [],
    navLink: '/pages/account-admin'
  },
  {
    id: 'device',
    title: 'devices',
    icon: <Cast size={12} />,
    permissions: [],
    navLink: '/pages/devices'
  },
  {
    id: 'user',
    title: 'User',
    icon: <User size={12} />,
    permissions: [],
    navLink: '/pages/users'
  },
  {
    id: 'sms',
    title: 'sms',
    icon: <MessageSquare size={12} />,
    permissions: [],
    navLink: '/pages/sms'
  },
  {
    id: 'advertising',
    title: 'advertising',
    icon: <Image size={12} />,
    permissions: [],
    navLink: '/pages/advertising'
  },
  {
    id: 'setting',
    title: 'setting',
    icon: <Settings size={12} />,
    permissions: [],
    navLink: '/pages/setting'
  },
]
