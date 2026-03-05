import { Outlet, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";

const Header = styled.header`
  background: ${(p) => p.theme.colors.primary.main};
  color: white;
  padding: 1rem 2rem;
  box-shadow: ${(p) => p.theme.shadow.md};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Button = styled.button`
  background: white;
  color: ${(p) => p.theme.colors.primary.main};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${(p) => p.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 64px);
`;

export default function RootLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <Header>
        <Nav>
          <Logo to="/">
            <span>🥕</span>
            <span>Farmers Market Finder</span>
          </Logo>
          <NavLinks>
            <NavLink to="/markets">Find Markets</NavLink>
            {user ? (
              <>
                <NavLink to="/account">My Account</NavLink>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")}>Login</Button>
            )}
          </NavLinks>
        </Nav>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
