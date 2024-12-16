// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */
import { User, MessageSquare, Shield, HardDrive, Cast, Image, Settings, Book, MessageCircle, Cpu } from 'react-feather'
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
  // {
  //   id: 'device',
  //   title: 'devices',
  //   icon: <Cast size={12} />,
  //   permissions: [],
  //   navLink: '/pages/devices'
  // },
  {
    id: 'user',
    title: 'User',
    icon: <User size={12} />,
    permissions: [],
    navLink: '/pages/users'
  },
  {
    id: 'vehicle',
    title: 'Vehicle',
    icon: <Cpu size={12} />,
    permissions: [],
    navLink: '/pages/vehicle'
  },
  {
    id: 'sms',
    title: 'Quản lý SMS',
    icon: <MessageSquare size={12} />,
    permissions: [],
    children: [
      {
        id: 'statistical',
        title: 'statistical',
        icon: <Book size={24} />,
        permissions: [],
        navLink: '/pages/statistical'
      },
      {
        id: 'sentMessages',
        title: 'table-message-title',
        icon: <MessageCircle size={24} />,
        permissions: [],
        navLink: '/pages/sent-messages'
      },
      {
        id: 'sms',
        title: 'smsTempalte',
        icon: <MessageSquare size={24} />,
        permissions: [],
        navLink: '/pages/sms',
      }
    ]
  },
  // {
  //   id: 'advertising',
  //   title: 'advertising',
  //   icon: <Image size={12} />,
  //   permissions: [],
  //   navLink: '/pages/advertising'
  // },
  {
    id: 'setting',
    title: 'setting',
    icon: <Settings size={12} />,
    permissions: [],
    navLink: '/pages/setting',
  },
]
