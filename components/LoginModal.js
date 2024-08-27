import React, { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  TextInput,
  GroupBox,
  Hourglass,
} from "react95";
import { login } from "@/services/api";

const LoginModal = ({ isOpen, onClose }) => {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async () => {
    setError("");

    setIsLoading(true);
    try {
      const response = await login(handle, password);
      localStorage.setItem("token", response.token);
      onClose();
    } catch (e) {
      console.log(e);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <Window
        style={{
          width: "300px",
          height: "auto",
          zIndex: 1001,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <WindowHeader>
          <span>Login</span>
        </WindowHeader>
        <WindowContent>
          <form>
            <GroupBox label="Account Information">
              <TextInput
                value={handle}
                placeholder="Handle"
                onChange={(e) => setHandle(e.target.value)}
                fullWidth
              />
              <br />
              <br />
              <TextInput
                value={password}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </GroupBox>
            <div style={{ marginTop: "20px" }}>
              <Button onClick={handleLogin} style={{ marginRight: "10px" }}>
                Login
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </div>
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            {isLoading && (
              <Hourglass size={25} style={{ marginTop: 10, marginLeft: 10 }} />
            )}
          </form>
        </WindowContent>
      </Window>
    </div>
  );
};

export default LoginModal;
