// Login.js
import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuthenticate } from "../Context";
import { Link, useHistory } from "react-router-dom";
import Center from "./Center";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuthenticate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function signIn(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch (error) {
      // Supabase-specific error handling
      switch (error.message) {
        case "Invalid login credentials":
          setError("Invalid email or password");
          break;
        case "Email not confirmed":
          setError("Please verify your email address");
          break;
        default:
          setError("Failed to log in: " + error.message);
      }
    }
    setLoading(false);
  }

  return (
    <Center>
      <Card
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        }}
        className="bg-light mx-auto"
      >
        <Card.Body>
          <h2 className="text-center text-primary mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={signIn}>
            <Form.Group id="email" className="mb-3">
              <Form.Control
                className="bg-light text-dark border border-primary rounded"
                type="email"
                placeholder="Email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group id="password" className="mb-4">
              <Form.Control
                className="bg-light text-dark border border-primary rounded"
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button
                disabled={loading}
                className="bg-primary border border-primary rounded"
                type="submit"
                style={{ width: "150px" }}
              >
                Log In
              </Button>
            </div>
          </Form>
          <div className="w-100 text-center text-danger mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="w-100 text-center text-dark mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Center>
  );
}