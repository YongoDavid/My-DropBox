import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuthenticate } from "../Context"
import { Link } from "react-router-dom"
import Center from "./Center"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuthenticate()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function passwordReset(e) { e.preventDefault()
    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }
    setLoading(false)
  }
  return (
    <Center>
      <Card>
        <Card.Body className="bg-light">
          <h2 className="text-center mb-4 text-primary">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={passwordReset}>
            <Form.Group id="email">
              <Form.Control className="text-dark bg-light" type="email"  placeholder="Email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="btn btn-primary w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/login">Login</Link>
          </div>
          <div className="w-100 text-center mt-2 text-dark">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Center>
  )
}