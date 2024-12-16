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
    path: '/pages/users',
    component: lazy(() => import('../../views/pages/user/index'))
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
    path: '/pages/setting',
    component: lazy(() => import('../../views/pages/setting/index'))
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
  }
]

export default PagesRoutes
