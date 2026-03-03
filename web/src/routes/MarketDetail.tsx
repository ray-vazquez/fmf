import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { marketsAPI } from "../api/endpoints/markets";
import { weatherAPI } from "../api/endpoints/weather";
import { placesAPI } from "../api/endpoints/places";
import { userAPI } from "../api/endpoints/user";
import { Market, WeatherForecast, Place } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { formatTime } from "../utils/format";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.neutral.gray600};
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const WeatherDay = styled(Card)`
  text-align: center;
`;

const PlaceCard = styled(Card)`
  margin-bottom: 1rem;
`;

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [market, setMarket] = useState<Market | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      marketsAPI.getById(parseInt(id)),
      weatherAPI.getForecast(parseInt(id)),
      placesAPI.getNearby(parseInt(id)),
    ])
      .then(([marketData, weatherData, placesData]) => {
        setMarket(marketData);
        setIsFavorite(marketData.isFavorite || false);
        setWeather(weatherData);
        setPlaces(placesData);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load market details");
        navigate("/markets");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!market) return;

    try {
      if (isFavorite) {
        await userAPI.removeFavorite(market.id);
      } else {
        await userAPI.addFavorite(market.id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
      alert("Failed to update favorite");
    }
  };

  const handleVisit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!market) return;

    try {
      await userAPI.markVisit(market.id);
      alert("Visit recorded!");
    } catch (err) {
      console.error(err);
      alert("Failed to record visit");
    }
  };

  if (loading) return <Spinner />;
  if (!market) return null;

  return (
    <Container>
      <Header>
        <Title>{market.name}</Title>
        <Location>
          {market.addressLine1 && `${market.addressLine1}, `}
          {market.city}, {market.state} {market.postalCode}
        </Location>
        <Actions>
          <Button onClick={handleFavorite}>
            {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
          </Button>
          <Button variant="outline" onClick={handleVisit}>
            ✅ Mark Visit
          </Button>
        </Actions>
      </Header>

      <Section>
        <SectionTitle>Information</SectionTitle>
        <InfoGrid>
          <Card>
            <h3>🕒 Hours</h3>
            <p>{formatTime(market.season1Time)}</p>
            {market.season1Date && (
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                {market.season1Date}
              </p>
            )}
          </Card>
          <Card>
            <h3>💳 Payments</h3>
            {market.acceptsSNAP && <p>✅ SNAP/EBT</p>}
            {market.acceptsCredit && <p>✅ Credit Cards</p>}
            {!market.acceptsSNAP && !market.acceptsCredit && <p>Cash only</p>}
          </Card>
          <Card>
            <h3>🌱 Products</h3>
            {market.hasVegetables && <p>✅ Vegetables</p>}
            {market.hasFruits && <p>✅ Fruits</p>}
            {market.hasOrganic && <p>✅ Organic</p>}
          </Card>
        </InfoGrid>
        {market.website && (
          <Card style={{ marginTop: "1rem" }}>
            <a
              href={market.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#16a34a" }}
            >
              🌐 Visit Website →
            </a>
          </Card>
        )}
      </Section>

      {weather && weather.days && weather.days.length > 0 && (
        <Section>
          <SectionTitle>🌤️ Weather Forecast</SectionTitle>
          <WeatherGrid>
            {weather.days.map((day, idx) => (
              <WeatherDay key={idx}>
                <div style={{ fontSize: "2rem" }}>
                  {day.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.description}
                      width="60"
                    />
                  )}
                </div>
                <p style={{ fontWeight: "600" }}>{day.temp}°F</p>
                <p style={{ fontSize: "0.875rem" }}>{day.description}</p>
              </WeatherDay>
            ))}
          </WeatherGrid>
        </Section>
      )}

      {places && places.length > 0 && (
        <Section>
          <SectionTitle>🗺️ Nearby Places</SectionTitle>
          {places.slice(0, 5).map((place) => (
            <PlaceCard key={place.id}>
              <h3>{place.name}</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {place.category} • {Math.round(place.distance)}m away
              </p>
              {place.address && <p style={{ fontSize: "0.875rem" }}>{place.address}</p>}
            </PlaceCard>
          ))}
        </Section>
      )}
    </Container>
  );
}
