import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuthenticate } from "../Context";
import { Link, useHistory } from "react-router-dom";
import Center from "./Center";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuthenticate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function signUp(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to create an account");
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
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // 3D look
        }}
        className="bg-light mx-auto"
      >
        <Card.Body>
          <h2 className="text-center text-primary mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={signUp}>
            <Form.Group id="email" className="mb-3">
              <Form.Control
                className="bg-light text-dark border border-primary rounded"
                placeholder="Email"
                type="email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Control
                className="bg-light text-dark border border-primary rounded"
                placeholder="Password"
                type="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Form.Group id="password-confirm" className="mb-4">
              <Form.Control
                className="bg-light text-dark border border-primary rounded"
                placeholder="Confirm Password"
                type="password"
                ref={passwordConfirmRef}
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
                Sign Up
              </Button>
            </div>
          </Form>
          <div className="w-100 text-center text-dark mt-2">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </Card.Body>
      </Card>
    </Center>
  );
}