import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login"; // adjust path if needed
import "@testing-library/jest-dom";

// Mock Navigation (react-router-dom)
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock Firebase Auth
const mockSignInWithEmailAndPassword = jest.fn();
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
}));

// Mock firebaseConfig export
jest.mock("../../firebaseConfig.js", () => ({
  auth: {},
}));

describe("Login Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSignup = jest.fn();

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Login onClose={mockOnClose} onSignup={mockOnSignup} />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form correctly", () => {
    renderComponent();
    expect(screen.getByText("UFL Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign up/i })).toBeInTheDocument();
  });

  test("clicking outside modal calls onClose", () => {
    renderComponent();
    fireEvent.mouseDown(screen.getByTestId("login-overlay"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside form doesn't call onClose", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("login-form"));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("shows error on user not found", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce({ code: "auth/user-not-found" });

    renderComponent();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.change(emailInput, { target: { value: "nonexistent@ufl.edu" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect Username/Password")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error on wrong password", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce({ code: "auth/wrong-password" });

    renderComponent();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.change(emailInput, { target: { value: "test@ufl.edu" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect Username/Password")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows fallback error for other login issues", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce({ code: "auth/internal-error" });

    renderComponent();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.change(emailInput, { target: { value: "test@ufl.edu" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to sign in. Try again.")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("navigates to discover page on successful login", async () => {
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "123" } });

    renderComponent();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.change(emailInput, { target: { value: "test@ufl.edu" } });
    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/discover");
    });
  });

  test("calls onSignup when signup is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(mockOnSignup).toHaveBeenCalledTimes(1);
  });
});
