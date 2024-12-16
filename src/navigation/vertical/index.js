/* eslint-disable import/no-anonymous-default-export */
// ** Navigation sections imports

import pages from './pages'

// import dashboards from './dashboards'
const user = JSON.parse(localStorage.getItem('TTDK_ADMIN_WEB_userData')) || {}
const allRouter = [...pages]

const checkPermissions = (routes) => {
  const newRoutes = []
  routes.forEach((element) => {
    const { permissions } = element || {}
    if (element?.children?.length > 0) {
      element.children = checkPermissions(element.children)
      if (element.children.length > 0) {
        newRoutes.push(element)
      }
    } else {
      const canAccess = permissions?.find((i) => user.permissions.match(i)?.length)
      if (!canAccess) return
      newRoutes.push(element)
    }
  })
  return newRoutes
}

const newRouter = Object.keys(user).length ? checkPermissions(allRouter) : []
// ** Merge & Export
export default newRouter
// export default allRouter
