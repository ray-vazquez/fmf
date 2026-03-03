import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../api/endpoints/user";
import { Market, Task } from "../api/types";

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`;

export default function Account() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Market[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    userAPI.getFavorites().then(setFavorites).catch(console.error);
    userAPI.getTasks().then(setTasks).catch(console.error);
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <>
      <Title>My Account</Title>

      <Section>
        <Card>
          <h2>{user.name || user.email}</h2>
          <p>{user.email}</p>
          <Button onClick={handleLogout} style={{ marginTop: "1rem" }}>
            Logout
          </Button>
        </Card>
      </Section>

      <Section>
        <SectionTitle>Favorite Markets ({favorites.length})</SectionTitle>
        <Grid>
          {favorites.map((market) => (
            <Card key={market.id}>
              <h3>{market.name}</h3>
              <p>
                {market.city}, {market.state}
              </p>
            </Card>
          ))}
          {favorites.length === 0 && <p>No favorites yet</p>}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Tasks ({tasks.length})</SectionTitle>
        <Grid>
          {tasks.map((task) => (
            <Card key={task.id}>
              <h3>{task.title}</h3>
              {task.notes && <p>{task.notes}</p>}
              <p>Status: {task.status}</p>
            </Card>
          ))}
          {tasks.length === 0 && <p>No tasks yet</p>}
        </Grid>
      </Section>
    </>
  );
}
