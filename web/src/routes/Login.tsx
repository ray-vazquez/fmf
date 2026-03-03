import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/endpoints/auth";

const Container = styled.div`
  max-width: 400px;
  margin: 4rem auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DemoNote = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${(props) => props.theme.colors.neutral.gray500};
  font-size: 0.875rem;
`;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (provider: "GOOGLE" | "APPLE") => {
    setLoading(true);
    try {
      const demoEmail = `demo-${Date.now()}@example.com`;
      const data = await authAPI.socialLogin(
        provider,
        `demo-${Date.now()}`,
        demoEmail,
        `Demo User`
      );
      login(data.token, data.user);
      navigate("/markets");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Sign In</Title>
        <ButtonGroup>
          <Button
            onClick={() => handleDemoLogin("GOOGLE")}
            disabled={loading}
          >
            👥 Sign in with Google (Demo)
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleDemoLogin("APPLE")}
            disabled={loading}
          >
            🍎 Sign in with Apple (Demo)
          </Button>
        </ButtonGroup>
        <DemoNote>
          This is a demo. Click any button to create a temporary account.
        </DemoNote>
      </Card>
    </Container>
  );
}
