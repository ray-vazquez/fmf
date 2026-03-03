import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  border: 3px solid ${(props) => props.theme.colors.neutral.gray200};
  border-top-color: ${(props) => props.theme.colors.primary.main};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 0.6s linear infinite;
  margin: 2rem auto;
`;
