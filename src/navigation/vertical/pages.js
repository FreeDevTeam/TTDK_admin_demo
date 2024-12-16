// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */
import { List, Slack, BookOpen, User, Divide, Shield, HardDrive, Cast, Image, Settings, Book, MessageCircle, Cpu,Bell } from 'react-feather'
const user = JSON.parse(localStorage.getItem("TTDK_ADMIN_WEB_userData")) || []

 const App = [
  {
    id: 'station',
    title: 'stations',
    icon: <HardDrive size={12} />,
    permissions: 'MANAGE_STATION',
    navLink: '/pages/station'
  },
  {
    id: 'account-admin',
    title: 'admin',
    icon: <Shield size={12} />,
    permissions: 'MANAGE_STAFF',
    navLink: '/pages/account-admin'
  },
  {
    id: 'user',
    title: 'User',
    icon: <User size={12} />,
    permissions: 'MANAGE_USER',
    navLink: '/pages/users'
  },
  {
    id: 'vehicle',
    title: 'Vehicle',
    icon: <Cpu size={12} />,
    permissions: 'MANAGE_VEHICLE',
    navLink: '/pages/vehicle'
  },
  {
    id: 'schedules',
    title: 'schedules',
    icon: <Book size={12} />,
    // permissions: 'MANAGE_SCHEDULES',
    permissions: [],
    navLink: '/pages/schedule'
  },
  {
    id: 'documentary',
    title: 'documentary',
    icon: <BookOpen size={12} />,
    permissions: 'MANAGE_DOCUMENT',
    navLink: '/pages/documentary'
  },
  {
    id: 'technicians',
    title: 'technicians',
    icon: <Slack size={12} />,
    permissions: 'MANAGE_STATION_STAFF',
    navLink: '/pages/technicians'
  },
  {
    id: 'center_staff',
    title: 'staff',
    icon: <Cast size={12} />,
    permissions: 'MANAGE_STATION_USER',
    navLink: '/pages/center-staff'
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
    id: 'Chat',
    title: 'Chat',
    icon: <MessageCircle size={12} />,
    permissions: 'MANAGE_CHAT',
    navLink: '/apps/chat'
  },
  {
    id: 'notification',
    title: 'notification',
    icon: <Bell size={12} />,
    permissions: 'MANAGE_NOTIFICATION',
    navLink: '/pages/notification'
  },
  {
    id: 'device',
    title: 'devices',
    icon: <Divide size={12} />,
    permissions: [],
    navLink: '/pages/devices'
  },
]

const newApp = App.map(item =>{
  const b = user.permissions?.indexOf(item.permissions)
  if( b === -1 ){
    delete item.id
    delete item.title
    delete item.icon
    delete item.permissions
    delete item.navLink
  }
  return {...item}
})

const newArr = newApp?.filter(el => {
  const check = Object.keys(el).length
  if(check > 0){
    return el
  }
} )

export default newArr
