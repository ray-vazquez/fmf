import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/ui/Button";

const Hero = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral.gray900};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.neutral.gray600};
  margin-bottom: 2rem;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const Feature = styled.div`
  text-align: center;
  padding: 2rem;
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

export default function Home() {
  return (
    <>
      <Hero>
        <Title>Find Fresh, Local Farmers Markets</Title>
        <Subtitle>
          Discover markets near you with fresh produce, handmade goods, and more
        </Subtitle>
        <Link to="/markets">
          <Button size="lg">Start Searching</Button>
        </Link>
      </Hero>

      <Features>
        <Feature>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Smart Search</FeatureTitle>
          <p>Find markets by ZIP, city, or name</p>
        </Feature>
        <Feature>
          <FeatureIcon>📍</FeatureIcon>
          <FeatureTitle>Near Me</FeatureTitle>
          <p>Discover markets close to your location</p>
        </Feature>
        <Feature>
          <FeatureIcon>🌤️</FeatureIcon>
          <FeatureTitle>Weather</FeatureTitle>
          <p>Check forecasts before you visit</p>
        </Feature>
        <Feature>
          <FeatureIcon>⭐</FeatureIcon>
          <FeatureTitle>Favorites</FeatureTitle>
          <p>Save your favorite markets</p>
        </Feature>
      </Features>
    </>
  );
}
