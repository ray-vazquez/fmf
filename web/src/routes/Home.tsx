import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGeolocation } from "../hooks/useGeolocation";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Hero = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary.main};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${(p) => p.theme.colors.neutral.gray600};
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${(p) => p.theme.colors.neutral.gray300};
  border-radius: ${(p) => p.theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary.main};
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${(p) => p.theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.md};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${(p) => p.theme.colors.primary.dark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LocationButton = styled(Button)`
  background: ${(p) => p.theme.colors.accent.main};

  &:hover {
    background: ${(p) => p.theme.colors.accent.dark};
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const Feature = styled.div`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  color: ${(p) => p.theme.colors.neutral.gray600};
`;

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { location, loading, requestLocation } = useGeolocation();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/markets?q=${encodeURIComponent(query)}`);
    }
  }

  function handleNearMe() {
    requestLocation();
  }

  // Navigate when location is obtained
  if (location && !loading) {
    navigate(`/markets?lat=${location.lat}&lng=${location.lng}`);
  }

  return (
    <Container>
      <Hero>
        <Title>Find Fresh, Local Farmers Markets</Title>
        <Subtitle>
          Discover farmers markets near you. Fresh produce, local goods, and community connections.
        </Subtitle>
      </Hero>

      <form onSubmit={handleSearch}>
        <SearchBox>
          <Input
            type="text"
            placeholder="Enter ZIP code, city, or market name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </SearchBox>
        <LocationButton type="button" onClick={handleNearMe} disabled={loading}>
          {loading ? "Getting location..." : "📍 Find Near Me"}
        </LocationButton>
      </form>

      <Features>
        <Feature>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Smart Search</FeatureTitle>
          <FeatureText>Search by ZIP, city, state, or market name</FeatureText>
        </Feature>
        <Feature>
          <FeatureIcon>📍</FeatureIcon>
          <FeatureTitle>Nearby Markets</FeatureTitle>
          <FeatureText>Find markets closest to your location</FeatureText>
        </Feature>
        <Feature>
          <FeatureIcon>🌤️</FeatureIcon>
          <FeatureTitle>Weather Forecasts</FeatureTitle>
          <FeatureText>5-day weather for market days</FeatureText>
        </Feature>
        <Feature>
          <FeatureIcon>⭐</FeatureIcon>
          <FeatureTitle>Save Favorites</FeatureTitle>
          <FeatureText>Track your favorite markets</FeatureText>
        </Feature>
      </Features>
    </Container>
  );
}
