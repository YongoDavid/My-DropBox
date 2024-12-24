import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuthenticate } from "../Context"

export default function HelperRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuthenticate()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}>
      </Route>
  )
}