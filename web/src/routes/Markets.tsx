import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { searchMarkets, findNearbyMarkets } from "../api/endpoints/markets";
import { Market } from "../api/types";
import { useDebounce } from "../hooks/useDebounce";
import MarketCard from "../components/features/MarketCard";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SearchBox = styled.div`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${(p) => p.theme.colors.neutral.gray300};
  border-radius: ${(p) => p.theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary.main};
  }
`;

const Results = styled.div`
  margin-top: 1rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ResultsCount = styled.p`
  color: ${(p) => p.theme.colors.neutral.gray600};
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(p) => p.theme.colors.neutral.gray500};
`;

const Empty = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(p) => p.theme.colors.neutral.gray500};
`;

export default function Markets() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const q = searchParams.get("q");

    if (lat && lng) {
      handleNearbySearch(parseFloat(lat), parseFloat(lng));
    } else if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      handleSearch(debouncedQuery);
    } else if (debouncedQuery.trim().length === 0) {
      setMarkets([]);
    }
  }, [debouncedQuery]);

  async function handleSearch(searchQuery: string) {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMarkets(searchQuery);
      setMarkets(results);
    } catch (err: any) {
      setError(err.message || "Search failed");
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleNearbySearch(lat: number, lng: number) {
    setLoading(true);
    setError(null);
    try {
      const results = await findNearbyMarkets(lat, lng);
      setMarkets(results);
    } catch (err: any) {
      setError(err.message || "Nearby search failed");
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <SearchBox>
        <Input
          type="text"
          placeholder="Search by ZIP, city, state, or market name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </SearchBox>

      {loading && <Loading>Searching...</Loading>}

      {error && <Empty>Error: {error}</Empty>}

      {!loading && !error && (
        <Results>
          {markets.length > 0 ? (
            <>
              <ResultsHeader>
                <ResultsCount>
                  Found {markets.length} {markets.length === 1 ? "market" : "markets"}
                </ResultsCount>
              </ResultsHeader>
              <Grid>
                {markets.map((market) => (
                  <MarketCard key={market.id} market={market} />
                ))}
              </Grid>
            </>
          ) : (
            query && <Empty>No markets found. Try a different search.</Empty>
          )}
        </Results>
      )}
    </Container>
  );
}
