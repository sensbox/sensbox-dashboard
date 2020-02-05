import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

export const routes = [
  // System Pages
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/forgot',
    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard/alpha',
    component: loadable(() => import('pages/dashboard/alpha')),
    menuKey: 'dashboardAlfa',
  },
  {
    path: '/dashboards/:uuid',
    component: loadable(() => import('pages/dashboards/show')),
    exact: true,
    menuKey: 'dashboards',
  },
  {
    path: '/dashboards/builder/:uuid',
    component: loadable(() => import('pages/dashboards/builder')),
    exact: true,
    menuKey: 'dashboards',
  },
  {
    path: '/apps/profile',
    component: loadable(() => import('pages/apps/profile')),
    exact: true,
  },

  // CRUDS
  {
    path: '/dashboards',
    component: loadable(() => import('pages/dashboards/list')),
    exact: true,
    menuKey: 'dashboards',
  },
  {
    path: '/devices',
    component: loadable(() => import('pages/devices/list')),
    exact: true,
    menuKey: 'devices',
  },
  {
    path: '/devices/new',
    component: loadable(() => import('pages/devices/new')),
    exact: true,
    menuKey: 'devices',
  },
  {
    path: '/devices/settings/:uuid',
    component: loadable(() => import('pages/devices/edit')),
    exact: true,
    menuKey: 'devices',
  },
  {
    path: '/devices/console',
    component: loadable(() => import('pages/devices/console')),
    exact: true,
    menuKey: 'devices',
  },
  {
    path: '/organizations',
    component: loadable(() => import('pages/organizations/list')),
    exact: true,
    menuKey: 'organizations',
  },
  {
    path: '/organizations/new',
    component: loadable(() => import('pages/organizations/new')),
    exact: true,
    menuKey: 'organizations',
  },
  {
    path: '/organizations/edit',
    component: loadable(() => import('pages/organizations/edit')),
    exact: true,
    menuKey: 'organizations',
  },
  {
    path: '/organizations/:organizationId/zones',
    component: loadable(() => import('pages/zones/list')),
    exact: true,
    menuKey: 'organizations',
  },
  {
    path: '/organizations/:organizationId/zones/new',
    component: loadable(() => import('pages/zones/new')),
    exact: true,
    menuKey: 'organizations',
  },
  {
    path: '/organizations/:organizationId/zones/edit',
    component: loadable(() => import('pages/zones/edit')),
    exact: true,
    menuKey: 'organizations',
  },
  {
    path: '/accounts',
    component: loadable(() => import('pages/accounts/list')),
    exact: true,
    menuKey: 'accounts',
  },
  {
    path: '/accounts/new',
    component: loadable(() => import('pages/accounts/new')),
    exact: true,
    menuKey: 'accounts',
  },
  {
    path: '/accounts/edit',
    component: loadable(() => import('pages/accounts/edit')),
    exact: true,
    menuKey: 'accounts',
  },
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard/alpha" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
