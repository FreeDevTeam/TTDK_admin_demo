// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */

import {
  Archive,
  Home,
  Circle,
  DollarSign,
  List,
  Slack,
  BookOpen,
  User,
  Divide,
  Shield,
  HardDrive,
  Cast,
  Image,
  Settings,
  Book,
  MessageCircle,
  Cpu,
  Bell,
  CreditCard,
  Clipboard
} from 'react-feather'

const App = [
  {
    id: 'dashboards',
    title: 'home',
    icon: <Home size={20} />,
    navLink: '/dashboard/analytics',
    permissions: ['VIEW_DASHBOARD']
  },
  {
    id: 'manager_ttdk',
    title: 'manager_ttdk',
    icon: <Archive size={20} />,
    permissions: [],
    children: [
      {
        id: 'station',
        title: 'stations',
        icon: <HardDrive size={12} />,
        permissions: ['VIEW_STATIONS'],
        navLink: '/pages/station'
      },
      {
        id: 'center_staff',
        title: 'staff',
        icon: <Cast size={12} />,
        permissions: ['VIEW_STATIONS_USERS'],
        navLink: '/pages/center-staff'
      },
      {
        id: 'technicians',
        title: 'technicians',
        icon: <Slack size={12} />,
        permissions: ['VIEW_STATIONS_STAFFS'],
        navLink: '/pages/technicians'
      },
      {
        id: 'file',
        title: 'file',
        icon: <Circle size={12} />,
        permissions: ['VIEW_STATIONS_VEHICLES'],
        navLink: '/pages/file'
      },
      {
        id: 'schedules',
        title: 'schedules',
        icon: <Book size={12} />,
        permissions: ['VIEW_STATIONS_SCHEDULE'],
        navLink: '/pages/schedule'
      },
      {
        id: 'report',
        title: 'report',
        icon: <List size={12} />,
        permissions: ['VIEW_STATIONS_REPORT'],
        navLink: '/pages/report'
      },
      {
        id: 'device',
        title: 'devices',
        icon: <Divide size={12} />,
        permissions: ['VIEW_STATIONS_DEVICES'],
        navLink: '/pages/devices'
      }
    ]
  },
  {
    id: 'user',
    title: 'User',
    icon: <User size={12} />,
    permissions: [],
    children: [
      {
        id: 'User',
        title: 'list',
        icon: <Circle size={12} />,
        navLink: '/pages/users',
        permissions: ['VIEW_APP_USERS']
      },
      {
        id: 'account-admin',
        title: 'admin',
        icon: <Shield size={12} />,
        permissions: ['VIEW_STAFFS'],
        navLink: '/pages/account-admin'
      }
    ]
  },
  {
    id: 'vehicle',
    title: 'Vehicle',
    icon: <Cpu size={12} />,
    permissions: ['VIEW_VEHICLE'],
    // navLink: '/pages/vehicle',
    children: [
      {
        id: 'list-schedule',
        title: 'list',
        icon: <Circle size={12} />,
        permissions: ['VIEW_VEHICLE'],
        navLink: '/pages/vehicle',
      },
      {
        id: 'warning',
        title: 'warning',
        icon: <Circle size={12} />,
        permissions: ['VIEW_VEHICLE'],
        navLink: '/pages/warning',
      },
    ]
  },
  {
    id: 'consultation_form',
    title: 'consultation_form',
    icon: <Book size={12} />,
    permissions: ['MANAGE_SERVICE_SCHEDULE'],
    // permissions: ['VIEW_VEHICLE'],
    children: [
      {
        id: 'old_car_registration',
        title: 'old_car_registration',
        icon: <MessageCircle size={12} />,
        permissions: ['VIEW_CHAT'],
        navLink: '/pages/consultation_form/1'
      },
      {
        id: 'new_car_registration',
        title: 'new_car_registration',
        icon: <Bell size={12} />,
        permissions: ['VIEW_NOTIFICATION'],
        navLink: '/pages/consultation_form/2'
      },
      {
        id: 'new_car_profile',
        title: 'new_car_profile',
        icon: <BookOpen size={12} />,
        permissions: ['VIEW_DOCUMENTS'],
        navLink: '/pages/consultation_form/3'
      },
      {
        id: 'CHANGE_REGISTATION',
        title: 'CHANGE_REGISTATION',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/4'
      },
      {
        id: 'CONSULTANT_MAINTENANCE',
        title: 'CONSULTANT_MAINTENANCE',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/7'
      },
      {
        id: 'CONSULTANT_INSURANCE',
        title: 'CONSULTANT_INSURANCE',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/8'
      },
      {
        id: 'CONSULTANT_RENOVATION',
        title: 'CONSULTANT_RENOVATION',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/9'
      },
      {
        id: 'LOST_REGISTRATION_PAPER',
        title: 'LOST_REGISTRATION_PAPER',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/10'
      },
      {
        id: 'REISSUE_INSPECTION_STICKER',
        title: 'REISSUE_INSPECTION_STICKER',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/11'
      },
      {
        id: 'VEHICLE_INSPECTION_CONSULTATION',
        title: 'VEHICLE_INSPECTION_CONSULTATION',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/12'
      },
      {
        id: 'TRAFFIC_FINE_CONSULTATION',
        title: 'TRAFFIC_FINE_CONSULTATION',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/13'
      },
      {
        id: 'CONSULTANT_INSURANCE_TNDS',
        title: 'CONSULTANT_INSURANCE_TNDS',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/consultation_form/14'
      },

    ]
  },
  {
    id: 'Interact',
    title: 'Interact',
    icon: <Cpu size={12} />,
    permissions: [],
    children: [
      {
        id: 'Chat',
        title: 'Chat',
        icon: <MessageCircle size={12} />,
        permissions: ['VIEW_CHAT'],
        navLink: '/apps/chat'
      },
      {
        id: 'notification',
        title: 'notification',
        icon: <Bell size={12} />,
        permissions: ['VIEW_NOTIFICATION'],
        navLink: '/pages/notification'
      },
      {
        id: 'documentary',
        title: 'documentary',
        icon: <BookOpen size={12} />,
        permissions: ['VIEW_DOCUMENTS'],
        navLink: '/pages/documentary'
      },
      {
        id: 'news',
        title: 'post',
        icon: <Clipboard size={12} />,
        permissions: ['VIEW_NEWS'],
        navLink: '/pages/news'
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
  //TODO : Tạm đóng, khi nào cấp quyền thì mở ra lại cho đúng quyền theo yêu cầu
  {
    id: 'integrated',
    title: 'integrated',
    icon: <CreditCard size={12} />,
    permissions: ['VIEW_INTEGRATIONS'],
    navLink: '/pages/integrated'
  },
  {
    id: 'pay',
    title: 'pay',
    icon: <DollarSign size={12} />,
    permissions: [],
    children: [
      {
        id: 'schedule-pay',
        title: 'schedules',
        icon: <Circle size={12} />,
        navLink: '/pages/schedule-pay',
        permissions: ['VIEW_PAYMENTS'],
      },
      {
        id: 'bill-pay',
        title: 'bill',
        icon: <Circle size={12} />,
        navLink: '/pages/bill-pay',
        permissions: ['VIEW_PAYMENTS'],
      },
      {
        id: 'methods-pay',
        title: 'payment_methods',
        icon: <Circle size={12} />,
        navLink: '/pages/methods-pay',
        permissions: ['VIEW_PAYMENTS'],
      }
    ]
  },
  {
    id: 'setting',
    title: 'setting',
    icon: <Settings size={12} />,
    permissions: [],
    children: [
      {
        id: 'setting-system',
        title: 'setting-system',
        icon: <Circle size={12} />,
        navLink: '/pages/schedule-system',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
      {
        id: 'setting-home',
        title: 'setting-home',
        icon: <Circle size={12} />,
        navLink: '/pages/setting',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
      {
        id: 'advertising-banner',
        title: 'advertising-banner',
        icon: <Circle size={12} />,
        navLink: '/pages/advertising-banner',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
      {
        id: 'api_key',
        title: 'api_key',
        icon: <Circle size={12} />,
        navLink: '/pages/api-key',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
      {
        id: 'schedule_day_off',
        title: 'schedule_day_off',
        icon: <Circle size={12} />,
        navLink: '/pages/schedule-day-off',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
      {
        id: 'expand',
        title: 'expand',
        icon: <Circle size={12} />,
        navLink: '/pages/expand-setting',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
      {
        id: 'automation',
        title: 'automation',
        icon: <Circle size={12} />,
        navLink: '/pages/automation',
        permissions: ['VIEW_SYSTEM_CONFIGURATIONS'],
      },
    ]
  },
]

export default App
