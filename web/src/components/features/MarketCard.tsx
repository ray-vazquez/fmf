import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Market } from "../../api/types";

const Card = styled.div`
  background: white;
  border-radius: ${(p) => p.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: ${(p) => p.theme.shadow.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${(p) => p.theme.shadow.md};
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.neutral.gray900};
  margin: 0;
`;

const Badge = styled.span`
  font-size: 1.25rem;
`;

const Location = styled.p`
  color: ${(p) => p.theme.colors.neutral.gray600};
  margin: 0.5rem 0;
  font-size: 0.875rem;
`;

const Distance = styled.p`
  color: ${(p) => p.theme.colors.primary.main};
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0.5rem 0;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  background: ${(p) => p.theme.colors.primary.light};
  color: ${(p) => p.theme.colors.primary.dark};
  padding: 0.25rem 0.75rem;
  border-radius: ${(p) => p.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
`;

interface Props {
  market: Market;
}

export default function MarketCard({ market }: Props) {
  const navigate = useNavigate();

  const tags = [];
  if (market.hasOrganic) tags.push("Organic");
  if (market.acceptsSNAP) tags.push("SNAP");
  if (market.hasVegetables) tags.push("Vegetables");
  if (market.hasFruits) tags.push("Fruits");
  if (market.hasMeat) tags.push("Meat");

  return (
    <Card onClick={() => navigate(`/market/${market.id}`)}>
      <Header>
        <div>
          <Title>{market.name}</Title>
          <Location>
            {market.city}, {market.state} {market.postalCode || ""}
          </Location>
          {market.distanceKm && <Distance>🚶 {market.distanceKm.toFixed(1)} km away</Distance>}
        </div>
        {market.isFavorite && <Badge>⭐</Badge>}
      </Header>

      {tags.length > 0 && (
        <Tags>
          {tags.slice(0, 5).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Tags>
      )}
    </Card>
  );
}
