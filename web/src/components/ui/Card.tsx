import styled from "styled-components";

export const Card = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadow.md};
  padding: ${(props) => props.theme.spacing.lg};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.lg};
  }
`;
