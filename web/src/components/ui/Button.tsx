import styled from "styled-components";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = styled.button<ButtonProps>`
  padding: ${(props) =>
    props.size === "sm"
      ? "0.5rem 1rem"
      : props.size === "lg"
      ? "0.75rem 1.5rem"
      : "0.625rem 1.25rem"};
  font-size: ${(props) =>
    props.size === "sm" ? "0.875rem" : props.size === "lg" ? "1.125rem" : "1rem"};
  font-weight: 600;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${(props) =>
    props.variant === "secondary"
      ? props.theme.colors.neutral.gray200
      : props.variant === "outline"
      ? "transparent"
      : props.theme.colors.primary.main};

  color: ${(props) =>
    props.variant === "secondary" || props.variant === "outline"
      ? props.theme.colors.neutral.gray800
      : "white"};

  border: ${(props) =>
    props.variant === "outline"
      ? `2px solid ${props.theme.colors.primary.main}`
      : "none"};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
