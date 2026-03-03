import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Header = styled.header`
  background: white;
  box-shadow: ${(props) => props.theme.shadow.sm};
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary.main};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${(props) => props.theme.colors.neutral.gray700};
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header>
        <Nav>
          <Logo to="/">🥕 Farmers Market Finder</Logo>
          <NavLinks>
            <NavLink to="/markets">Search</NavLink>
            {isAuthenticated ? (
              <NavLink to="/account">Account</NavLink>
            ) : (
              <NavLink to="/login">Login</NavLink>
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
