import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { marketsAPI } from "../api/endpoints/markets";
import { Market } from "../api/types";
import { useDebounce } from "../hooks/useDebounce";
import { useGeolocation } from "../hooks/useGeolocation";
import { formatDistance } from "../utils/format";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  margin-bottom: 2rem;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MarketCard = styled(Card)`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const MarketInfo = styled.div`
  flex: 1;
`;

const MarketName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.neutral.gray900};
`;

const MarketLocation = styled.p`
  color: ${(props) => props.theme.colors.neutral.gray600};
`;

const Distance = styled.span`
  color: ${(props) => props.theme.colors.primary.main};
  font-weight: 600;
`;

export default function Markets() {
  const [query, setQuery] = useState("");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [useNearby, setUseNearby] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  const { latitude, longitude, error: geoError } = useGeolocation();

  useEffect(() => {
    if (useNearby && latitude && longitude) {
      setLoading(true);
      marketsAPI
        .nearby(latitude, longitude, 25)
        .then(setMarkets)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [useNearby, latitude, longitude]);

  useEffect(() => {
    if (!useNearby && debouncedQuery.trim()) {
      setLoading(true);
      marketsAPI
        .search(debouncedQuery)
        .then(setMarkets)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [debouncedQuery, useNearby]);

  const handleNearbyClick = () => {
    if (geoError) {
      alert("Geolocation not available: " + geoError);
      return;
    }
    setUseNearby(true);
    setQuery("");
  };

  const handleSearchMode = () => {
    setUseNearby(false);
    setMarkets([]);
  };

  return (
    <Container>
      <Title>Find Farmers Markets</Title>
      
      <SearchBox>
        <SearchRow>
          <Input
            type="text"
            placeholder="Search by ZIP, city, or market name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (useNearby) setUseNearby(false);
            }}
            disabled={useNearby}
          />
          {!useNearby && (
            <Button onClick={handleNearbyClick}>
              📍 Near Me
            </Button>
          )}
          {useNearby && (
            <Button variant="outline" onClick={handleSearchMode}>
              Search
            </Button>
          )}
        </SearchRow>
        {useNearby && (
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Showing markets within 25km of your location
          </p>
        )}
      </SearchBox>

      {loading && <Spinner />}

      <Results>
        {markets.map((market) => (
          <Link key={market.id} to={`/market/${market.id}`}>
            <MarketCard>
              <MarketInfo>
                <MarketName>{market.name}</MarketName>
                <MarketLocation>
                  {market.city}, {market.state} {market.postalCode}
                </MarketLocation>
                {market.season1Time && (
                  <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    {market.season1Time}
                  </p>
                )}
              </MarketInfo>
              {market.distanceKm !== undefined && (
                <Distance>{formatDistance(market.distanceKm)}</Distance>
              )}
            </MarketCard>
          </Link>
        ))}
        {!loading && markets.length === 0 && (debouncedQuery || useNearby) && (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            No markets found. Try a different search.
          </p>
        )}
        {!loading && markets.length === 0 && !debouncedQuery && !useNearby && (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            Enter a ZIP code, city, or market name to search.
          </p>
        )}
      </Results>
    </Container>
  );
}
