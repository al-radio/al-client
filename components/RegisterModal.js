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
import { register } from "@/services/api";

const RegisterModal = ({ isOpen, onClose }) => {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      return;
    }

    setIsLoading(true);
    const result = await register(handle, password);
    setIsLoading(false);

    onClose();
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
          <span>Create Account</span>
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
              <br />
              <br />
              <TextInput
                value={confirmPassword}
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
            </GroupBox>
            <div style={{ marginTop: "20px" }}>
              <Button onClick={handleRegister} style={{ marginRight: "10px" }}>
                Register
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </div>
          </form>
          {isLoading && (
            <Hourglass size={25} style={{ marginTop: 10, marginLeft: 10 }} />
          )}
        </WindowContent>
      </Window>
    </div>
  );
};

export default RegisterModal;
