import React, { useState } from "react";
import { Button, TextInput, Anchor, GroupBox } from "react95";
import {
  login,
  register,
  sendPasswordResetEmail,
  resetPassword,
  fetchProfile,
} from "../../services/api";
import { useAuth } from "@/contexts/AuthContext";
import styled from "styled-components";

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.progress};
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const AuthPage = () => {
  const [formData, setFormData] = useState({
    handle: "",
    password: "",
    email: "",
    code: "",
  });
  const { setAuthStateFromProfile } = useAuth();
  const [error, setError] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // Can be 'login', 'register', 'forgot', 'reset'

  const handleLogin = () => {
    login(formData.handle, formData.password)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        fetchProfile().then((profile) => {
          setAuthStateFromProfile(profile);
        });
      })
      .catch(() =>
        setError("An error occurred during login. Please try again."),
      );
  };

  const handleRegister = () => {
    register(formData.email, formData.handle, formData.password)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        setAuthMode("login");
        setError(null);
      })
      .catch(() =>
        setError("An error occurred during registration. Please try again."),
      );
  };

  const handleSendResetEmail = () => {
    sendPasswordResetEmail(formData.email)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        setAuthMode("reset"); // Switch to reset view after sending email
        setError(null);
      })
      .catch(() =>
        setError(
          "An error occurred while sending the reset email. Please try again.",
        ),
      );
  };

  const handleResetPassword = () => {
    resetPassword(formData.email, formData.password, formData.code)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        setAuthMode("login");
        setError(null);
      })
      .catch(() =>
        setError("An error occurred during password reset. Please try again."),
      );
  };

  const renderLogin = () => (
    <>
      <GroupBox label="Login">
        {error && (
          <ErrorMessage>
            <p>{error}</p>
          </ErrorMessage>
        )}
        <TextInput
          value={formData.handle}
          onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
          placeholder="Handle"
        />
        <TextInput
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
        />
        <Button onClick={handleLogin}>Login</Button>
      </GroupBox>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("register");
        }}
      >
        Need an account? <Anchor>Register here</Anchor>
      </p>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("forgot");
        }}
      >
        Forgot Password? <Anchor>Click here</Anchor>
      </p>
    </>
  );

  const renderRegister = () => (
    <>
      <GroupBox label="Register">
        {error && (
          <ErrorMessage>
            <p>{error}</p>
          </ErrorMessage>
        )}
        <TextInput
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <TextInput
          value={formData.handle}
          onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
          placeholder="Handle"
        />
        <TextInput
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
        />
        <Button onClick={handleRegister}>Register</Button>
      </GroupBox>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("login");
        }}
      >
        Already have an account? <Anchor>Login here</Anchor>
      </p>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("forgot");
        }}
      >
        Forgot Password? <Anchor>Click here</Anchor>
      </p>
    </>
  );

  const renderForgotPassword = () => (
    <>
      <GroupBox label="Forgot Password">
        {error && (
          <ErrorMessage>
            <p>{error}</p>
          </ErrorMessage>
        )}
        <TextInput
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <Button onClick={handleSendResetEmail}>Send Email</Button>
      </GroupBox>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("login");
        }}
      >
        Back to <Anchor>Login</Anchor>
      </p>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("reset");
        }}
      >
        <Anchor>I have a code</Anchor>
      </p>
    </>
  );

  const renderResetPassword = () => (
    <>
      <GroupBox label="Reset Password">
        {error && (
          <ErrorMessage>
            <p>{error}</p>
          </ErrorMessage>
        )}
        <TextInput
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <TextInput
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="Code"
        />
        <TextInput
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="New Password"
        />
        <Button onClick={handleResetPassword}>Submit</Button>
      </GroupBox>
      <p
        onClick={() => {
          setError(null);
          setAuthMode("forgot");
        }}
      >
        Back to <Anchor>Forgot Password</Anchor>
      </p>
    </>
  );

  const renderContent = () => {
    switch (authMode) {
      case "login":
        return renderLogin();
      case "register":
        return renderRegister();
      case "forgot":
        return renderForgotPassword();
      case "reset":
        return renderResetPassword();
      default:
        return renderLogin(); // Fallback
    }
  };

  return <>{renderContent()}</>;
};

export default AuthPage;
