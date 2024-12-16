import { lazy } from 'react'
// import { Redirect } from 'react-router-dom'

const PagesRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/station',
    component: lazy(() => import('../../views/pages/station/index'))
  },
  {
    path: '/pages/form-station',
    component: lazy(() => import('../../views/pages/station/formStation'))
  },
  {
    path: '/pages/form-SMS',
    component: lazy(() => import('../../views/pages/station/formSMS'))
  },
  {
    path: '/pages/form-ZNS',
    component: lazy(() => import('../../views/pages/station/formZNS'))
  },
  {
    path: '/pages/form-email',
    component: lazy(() => import('../../views/pages/station/formEmail'))
  },
  {
    path: '/pages/form-vnpay',
    component: lazy(() => import('../../views/pages/station/formVNPay'))
  },
  {
    path: '/pages/users',
    component: lazy(() => import('../../views/pages/user/index'))
  },
  {
    path: '/pages/vehicle',
    component: lazy(() => import('../../views/pages/vehicle/index'))
  },
  {
    path: '/pages/documentary',
    component: lazy(() => import('../../views/pages/documentary/index'))
  },
  {
    path: '/pages/technicians',
    component: lazy(() => import('../../views/pages/technicians/index'))
  },
  {
    path: '/pages/report',
    component: lazy(() => import('../../views/pages/report/index'))
  },
  {
    path: '/documentary/form-documentary',
    component: lazy(() => import('../../views/pages/documentary/formDocumentary'))
  },
  {
    path: '/documentary/add-documentary',
    component: lazy(() => import('../../views/pages/documentary/addDocumentary'))
  },
  {
    path: '/pages/account-admin',
    component: lazy(() => import('../../views/pages/account-admin/index'))
  },
  {
    path: '/pages/devices',
    component: lazy(() => import('../../views/pages/device/index'))
  },
  {
    path: '/pages/statistical',
    component: lazy(() => import('../../views/pages/statistical')),
  },
  {
    path: '/pages/sms',
    component: lazy(() => import('../../views/pages/sms/index'))
  },
  {
    path: '/pages/form-template-sms',
    component: lazy(() => import('../../views/pages/sms/formTemplateSMS'))
  },
  {
    path: '/pages/advertising',
    component: lazy(() => import('../../views/pages/advertising/index'))
  },
  {
    path: '/user/change-password',
    component: lazy(() => import('../../views/pages/change-password/index'))
  },
  {
    path: '/user/list',
    component: lazy(() => import('../../views/pages/change-password/index'))
  },
  {
    path: '/user/form-user',
    component: lazy(() => import('../../views/pages/user/formUser'))
  },
  {
    path: '/user/form-technicians',
    component: lazy(() => import('../../views/pages/technicians/formTechnician'))
  },
  {
    path: '/pages/setting',
    component: lazy(() => import('../../views/pages/setting/index'))
  },
  {
    path: '/pages/sent-messages/detail',
    component: lazy(() => import('../../views/pages/setting/messageDetail')),
  },
  {
    path: '/pages/sent-messages',
    component: lazy(() => import('../../views/pages/setting/messages')),
  },
  {
    path: '/misc/not-authorized',
    component: lazy(() => import('../../views/pages/misc/NotAuthorized')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/maintenance',
    component: lazy(() => import('../../views/pages/misc/Maintenance')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/error',
    component: lazy(() => import('../../views/pages/misc/Error')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/pages/role/add',
    component: lazy(() => import('../../views/pages/role/add')),
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/pages/role/edit',
    component: lazy(() => import('../../views/pages/role/edit')),
    meta: {
      publicRoute: true
    }
  },

]

export default PagesRoutes
