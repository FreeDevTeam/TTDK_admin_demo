// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */
import { List, Slack, BookOpen, User, MessageSquare, Shield, HardDrive, Cast, Image, Settings, Book, MessageCircle, Cpu } from 'react-feather'
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
    id: 'documentary',
    title: 'documentary',
    icon: <BookOpen size={12} />,
    permissions: [],
    navLink: '/pages/documentary'
  },
  {
    id: 'technicians',
    title: 'technicians',
    icon: <Slack size={12} />,
    permissions: [],
    navLink: '/pages/technicians'
  },
  {
    id: 'report',
    title: 'report',
    icon: <List size={12} />,
    permissions: [],
    navLink: '/pages/report'
  },
  // {
  //   id: 'advertising',
  //   title: 'advertising',
  //   icon: <Image size={12} />,
  //   permissions: [],
  //   navLink: '/pages/advertising'
  // },
  {
    id: 'chat',
    title: 'chat',
    icon: <MessageCircle size={12} />,
    permissions: [],
    navLink: '/pages/chat'
  },
]
