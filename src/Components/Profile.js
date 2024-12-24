import React, { useState, useEffect } from "react"
import { Card, Alert } from "react-bootstrap"
import { useAuthenticate } from "../Context"
import { Link } from "react-router-dom"
import Center from "./Center"

export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuthenticate()

  // Example useEffect to handle some side effects
  useEffect(() => {
    const checkUserStatus = async () => {
      // Perform any checks or fetch data here
      try {
        // Example: If needed to check current user status
        // await fetchUserData(currentUser.id); // Assuming you have such a function
      } catch (err) {
        setError("Failed to fetch user data.")
      }
    }

    checkUserStatus()
  }, [currentUser]) // Dependencies array, add variables to re-run when they change
  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      setError("Failed to log out. Please try again.")
    }
  }

  return (
    <Center>
      <Card className="bg-light">
        <Card.Body className="text-primary">
          <h2 className="text-center text-primary mb-4">My Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong className="text-dark">Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-danger w-100 mt-3">
            Log Out
          </button>
        </Card.Body>
      </Card>
    </Center>
  )
}