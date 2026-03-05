import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getFavorites, getVisitHistory, getTasks } from "../api/endpoints/user";
import { Market, Visit, Task } from "../api/types";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: ${(p) => p.theme.borderRadius.md};
  box-shadow: ${(p) => p.theme.shadow.sm};
  cursor: pointer;

  &:hover {
    box-shadow: ${(p) => p.theme.shadow.md};
  }
`;

const MarketName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const MarketInfo = styled.p`
  color: ${(p) => p.theme.colors.neutral.gray600};
  font-size: 0.875rem;
`;

const Empty = styled.p`
  color: ${(p) => p.theme.colors.neutral.gray500};
  font-style: italic;
`;

export default function Account() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Market[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    try {
      const [favs, visitHistory, userTasks] = await Promise.all([
        getFavorites(),
        getVisitHistory(),
        getTasks(),
      ]);
      setFavorites(favs);
      setVisits(visitHistory);
      setTasks(userTasks);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setDataLoading(false);
    }
  }

  if (loading || dataLoading) {
    return <Container>Loading...</Container>;
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Title>My Account</Title>

      <Section>
        <SectionTitle>⭐ Favorite Markets ({favorites.length})</SectionTitle>
        {favorites.length === 0 ? (
          <Empty>No favorites yet. Start exploring markets!</Empty>
        ) : (
          <Grid>
            {favorites.map((market) => (
              <Card key={market.id} onClick={() => navigate(`/market/${market.id}`)}>
                <MarketName>{market.name}</MarketName>
                <MarketInfo>
                  {market.city}, {market.state}
                </MarketInfo>
              </Card>
            ))}
          </Grid>
        )}
      </Section>

      <Section>
        <SectionTitle>🚶 Visit History ({visits.length})</SectionTitle>
        {visits.length === 0 ? (
          <Empty>No visits recorded yet.</Empty>
        ) : (
          <Grid>
            {visits.map((visit) => (
              <Card key={visit.id} onClick={() => navigate(`/market/${visit.market.id}`)}>
                <MarketName>{visit.market.name}</MarketName>
                <MarketInfo>
                  Visited {visit.visitCount} {visit.visitCount === 1 ? "time" : "times"} •{" "}
                  Last visit: {new Date(visit.lastVisitedAt).toLocaleDateString()}
                </MarketInfo>
              </Card>
            ))}
          </Grid>
        )}
      </Section>

      <Section>
        <SectionTitle>✅ Tasks ({tasks.filter((t) => t.status === "PENDING").length})</SectionTitle>
        {tasks.length === 0 ? (
          <Empty>No tasks yet.</Empty>
        ) : (
          <Grid>
            {tasks.map((task) => (
              <Card key={task.id}>
                <MarketName>
                  {task.status === "COMPLETED" ? "✅" : "⏳"} {task.title}
                </MarketName>
                {task.notes && <MarketInfo>{task.notes}</MarketInfo>}
                {task.market && (
                  <MarketInfo>
                    📍 {task.market.name}, {task.market.city}
                  </MarketInfo>
                )}
              </Card>
            ))}
          </Grid>
        )}
      </Section>
    </Container>
  );
}
