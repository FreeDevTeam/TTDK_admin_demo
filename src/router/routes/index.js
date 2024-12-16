// ** Routes Imports
 import AppRoutes from './Apps'
// import FormRoutes from './Forms'
import PagesRoutes from './Pages'
// import TablesRoutes from './Tables'
// import ChartMapsRoutes from './ChartsMaps'
import DashboardRoutes from './Dashboards'
// import UiElementRoutes from './UiElements'
// import ExtensionsRoutes from './Extensions'
// import PageLayoutsRoutes from './PageLayouts'
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../helper/localStorage'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const user = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY)) || {}
let DefaultRoute = ''
if(user?.permissions === "MANAGE_SERVICE_SCHEDULE"){
  DefaultRoute = "/pages/consultation_form"
} else {
  DefaultRoute = '/pages/station'
}

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...AppRoutes,
  ...PagesRoutes,
  // ...UiElementRoutes,
  // ...ExtensionsRoutes,
  // ...PageLayoutsRoutes,
  // ...FormRoutes,
  // ...TablesRoutes,
  // ...ChartMapsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
