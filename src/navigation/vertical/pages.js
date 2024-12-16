// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */
import { User, Book, Shield, HardDrive, Cast, Image } from 'react-feather'
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
    id: 'advertising',
    title: 'advertising',
    icon: <Image size={12} />,
    permissions: [],
    navLink: '/pages/advertising'
  },
]
