import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";

const Container = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: ${(p) => p.theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${(p) => p.theme.shadow.lg};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${(p) => p.theme.colors.neutral.gray600};
  margin-bottom: 2rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.md};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const GoogleButton = styled(Button)`
  background: #4285f4;
  color: white;
`;

const AppleButton = styled(Button)`
  background: #000;
  color: white;
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  color: ${(p) => p.theme.colors.neutral.gray400};
  font-size: 0.875rem;
`;

const Note = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.neutral.gray500};
  margin-top: 1.5rem;
`;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(provider: string) {
    try {
      await login(provider);
      navigate("/account");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  }

  return (
    <Container>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to access your favorites and more</Subtitle>

        <GoogleButton onClick={() => handleLogin("google")}>
          <span>🔵</span>
          <span>Continue with Google</span>
        </GoogleButton>

        <AppleButton onClick={() => handleLogin("apple")}>
          <span>🍎</span>
          <span>Continue with Apple</span>
        </AppleButton>

        <Divider>—</Divider>

        <Note>
          <strong>Demo Mode:</strong> This is a demo. Click any button above to create a test account.
          In production, real OAuth will be used.
        </Note>
      </Card>
    </Container>
  );
}
