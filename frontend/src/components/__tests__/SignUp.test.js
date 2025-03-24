import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../SignUp";
import "@testing-library/jest-dom";

describe("SignUp Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders signup form correctly", () => {
    render(<SignUp onClose={mockOnClose} />);

    expect(screen.getByText("UFL Email")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Verify Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test("clicking outside modal calls onClose", () => {
    render(<SignUp onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId("overlay"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside form doesn't call onClose (event propagation stopped)", () => {
    render(<SignUp onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId("component"));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("validates email format (must be UFL email)", () => {
    render(<SignUp onClose={mockOnClose} />);

    // Get form inputs
    const emailInput = screen.getByTestId("email-input");
    const nameInput = screen.getByTestId("name-input");
    const passwordInput = screen.getByTestId("pass-input");
    const verifyPasswordInput = screen.getByTestId("verify-input");

    // Fill form with non-UFL email
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(verifyPasswordInput, { target: { value: "password123" } });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Should show error message
    expect(screen.getByText("Must use a valid UFL email")).toBeInTheDocument();
  });

  test("validates required fields (no blank fields)", () => {
    render(<SignUp onClose={mockOnClose} />);

    // Submit empty form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Should show error messages
    expect(screen.getByText("Email can't be blank")).toBeInTheDocument();
    expect(
      screen.getByText("Password is too short! Minimum 6 characters")
    ).toBeInTheDocument();
    expect(screen.getByText("Name can't be blank")).toBeInTheDocument();
  });

  test("validates password matching", () => {
    render(<SignUp onClose={mockOnClose} />);

    // Get form inputs
    const emailInput = screen.getByTestId("email-input");
    const nameInput = screen.getByTestId("name-input");
    const passwordInput = screen.getByTestId("pass-input");
    const verifyPasswordInput = screen.getByTestId("verify-input");

    // Fill form with mismatched passwords
    fireEvent.change(emailInput, { target: { value: "test@ufl.edu" } });
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(verifyPasswordInput, {
      target: { value: "different123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Should show error message
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });
});
