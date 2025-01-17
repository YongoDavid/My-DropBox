import React from "react"
import { ChakraProvider } from "@chakra-ui/react";
import Signup from "./Components/Signup"
import { AuthenticationProvider } from "./Context"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Profile from "./Components/Profile"
import Login from "./Components/Login"
import HelperRoute from "./Components/HelperRoute"
import ForgotPassword from "./Components/ForgotPassword"
import UpdateProfile from "./Components/UpdateProfile"
import Dashboard from "./Components/storage/Home"
import theme from "./theme"
function App() {
  return (
    <Router>
      <ChakraProvider theme={theme}>
        <AuthenticationProvider>
            <HelperRoute exact path="/" component={Dashboard} />
            <HelperRoute exact path="/folder/:folderId" component={Dashboard} />

            <HelperRoute path="/user" component={Profile} />
            <HelperRoute path="/update-profile" component={UpdateProfile} />

            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
        </AuthenticationProvider>
      </ChakraProvider>
    </Router>    
  )
}

export default App;