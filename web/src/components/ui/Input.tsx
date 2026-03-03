import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid ${(props) => props.theme.colors.neutral.gray200};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.neutral.gray400};
  }
`;
