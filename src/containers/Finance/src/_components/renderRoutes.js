import React from 'react'
import { Route } from 'react-router'
import PrivateRoute from './PrivateRoute'

function renderRoutes (routes, extraProps = {}) {
  return routes
    ? routes.map((route, index) => {
      if (route.routes) {
        return route.protected ? <React.Fragment key={index}><PrivateRoute
          key={index + 'route'}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          roles={route.roles}
          title={route.title}
          withoutBase={route.withoutBase}
          component={() => <route.component {...extraProps} />} />{renderRoutes(route.routes)}</React.Fragment>
          : <React.Fragment><Route key={index + 'route'}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            roles={route.roles}
            without
            component={() => <route.component {...extraProps} />} />{ renderRoutes(route.routes)}</React.Fragment>
      } else {
        return route.protected ? <PrivateRoute
          key={index + 'route'}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          roles={route.roles}
          title={route.title}
          withoutBase={route.withoutBase}
          component={() => <route.component {...extraProps} />} />
          : <Route key={index + 'route'}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            roles={route.roles}
            component={() => <route.component {...extraProps} />} />
      }
    }) : null
}

export default renderRoutes
