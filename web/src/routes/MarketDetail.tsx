import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { getMarketById, getMarketWeather, getMarketPlaces } from "../api/endpoints/markets";
import { addFavorite, removeFavorite, markVisit } from "../api/endpoints/user";
import { Market, WeatherForecast, Place } from "../api/types";
import { useGeolocation } from "../hooks/useGeolocation";
import { haversineDistance } from "../utils/distance";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  font-size: 1.25rem;
  color: ${(p) => p.theme.colors.neutral.gray600};
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  background: ${(p) =>
    p.variant === "secondary" ? p.theme.colors.neutral.gray200 : p.theme.colors.primary.main};
  color: ${(p) => (p.variant === "secondary" ? p.theme.colors.neutral.gray800 : "white")};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: ${(p) => p.theme.borderRadius.md};
  box-shadow: ${(p) => p.theme.shadow.sm};
`;

const InfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  margin-bottom: 0.5rem;
  color: ${(p) => p.theme.colors.neutral.gray700};
`;

const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const WeatherCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: ${(p) => p.theme.borderRadius.md};
  box-shadow: ${(p) => p.theme.shadow.sm};
  text-align: center;
`;

const PlacesList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PlaceCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: ${(p) => p.theme.borderRadius.md};
  box-shadow: ${(p) => p.theme.shadow.sm};
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
`;

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location } = useGeolocation();

  const [market, setMarket] = useState<Market | null>(null);
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadMarketData(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (market && location && user) {
      checkAndMarkVisit();
    }
  }, [market, location, user]);

  async function loadMarketData(marketId: number) {
    try {
      const [marketData, weatherData, placesData] = await Promise.all([
        getMarketById(marketId),
        getMarketWeather(marketId).catch(() => []),
        getMarketPlaces(marketId).catch(() => []),
      ]);

      setMarket(marketData);
      setIsFavorite(marketData.isFavorite || false);
      setWeather(weatherData);
      setPlaces(placesData);
    } catch (err) {
      console.error("Failed to load market:", err);
      alert("Market not found");
      navigate("/markets");
    } finally {
      setLoading(false);
    }
  }

  async function checkAndMarkVisit() {
    if (!market || !location || !market.latitude || !market.longitude) return;

    const distance = haversineDistance(
      location.lat,
      location.lng,
      market.latitude,
      market.longitude
    );

    // Within 500m (0.5km) = visiting
    if (distance <= 0.5) {
      try {
        await markVisit(market.id, Math.round(distance * 1000));
      } catch (err) {
        console.error("Failed to mark visit:", err);
      }
    }
  }

  async function handleFavorite() {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(market!.id);
        setIsFavorite(false);
      } else {
        await addFavorite(market!.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  }

  if (loading) return <Loading>Loading market details...</Loading>;
  if (!market) return <Loading>Market not found</Loading>;

  return (
    <Container>
      <Header>
        <div>
          <Title>{market.name}</Title>
          <Location>
            {market.city}, {market.state} {market.postalCode}
          </Location>
        </div>
        <Actions>
          <Button variant="secondary" onClick={() => navigate("/markets")}>
            ← Back
          </Button>
          <Button onClick={handleFavorite}>
            {isFavorite ? "⭐ Favorited" : "☆ Add Favorite"}
          </Button>
        </Actions>
      </Header>

      <InfoGrid>
        <InfoCard>
          <InfoTitle>📍 Location</InfoTitle>
          {market.addressLine1 && <InfoItem>{market.addressLine1}</InfoItem>}
          <InfoItem>
            {market.city}, {market.state} {market.postalCode}
          </InfoItem>
          {market.distanceKm && <InfoItem>🚶 {market.distanceKm.toFixed(1)} km away</InfoItem>}
        </InfoCard>

        <InfoCard>
          <InfoTitle>📅 Hours</InfoTitle>
          {market.season1Date && <InfoItem>{market.season1Date}</InfoItem>}
          {market.season1Time && <InfoItem>{market.season1Time}</InfoItem>}
          {!market.season1Date && !market.season1Time && <InfoItem>Hours not available</InfoItem>}
        </InfoCard>

        <InfoCard>
          <InfoTitle>💳 Payment</InfoTitle>
          {market.acceptsCredit && <InfoItem>✅ Credit/Debit</InfoItem>}
          {market.acceptsSNAP && <InfoItem>✅ SNAP/EBT</InfoItem>}
          {market.acceptsWIC && <InfoItem>✅ WIC</InfoItem>}
          {!market.acceptsCredit && !market.acceptsSNAP && !market.acceptsWIC && (
            <InfoItem>Cash only</InfoItem>
          )}
        </InfoCard>
      </InfoGrid>

      {weather.length > 0 && (
        <Section>
          <SectionTitle>🌤️ 5-Day Weather Forecast</SectionTitle>
          <WeatherGrid>
            {weather.map((day) => (
              <WeatherCard key={day.date}>
                <div style={{ fontSize: "2rem" }}>🌤️</div>
                <div style={{ fontWeight: 600 }}>{new Date(day.date).toLocaleDateString()}</div>
                <div style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>{day.temp}°F</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{day.description}</div>
                <div style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  💧 {day.pop}%
                </div>
              </WeatherCard>
            ))}
          </WeatherGrid>
        </Section>
      )}

      {places.length > 0 && (
        <Section>
          <SectionTitle>📍 Nearby Places</SectionTitle>
          <PlacesList>
            {places.slice(0, 10).map((place) => (
              <PlaceCard key={place.id}>
                <div style={{ fontWeight: 600 }}>{place.name}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {place.category} • {place.distance}m away
                </div>
              </PlaceCard>
            ))}
          </PlacesList>
        </Section>
      )}
    </Container>
  );
}
