import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { getDoc } from "firebase/firestore";
import "@testing-library/jest-dom";

// Mock Navigation (react-router-dom)
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock Firebase Firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(() => "mockedDocRef"),
  getDoc: jest.fn(),
}));

describe("Login Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Login onClose={mockOnClose} onSignup={mockOnSignup} />
      </BrowserRouter>
    );

  test("renders login form correctly", () => {
    renderComponent();
    expect(screen.getByText("UFL Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign up/i })
    ).toBeInTheDocument();
  });

  test("clicking outside modal calls onClose", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("login-overlay"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside form doesn't call onClose (event propagation stopped)", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("login-form"));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("shows error for non-existent user", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });
    renderComponent();
    // Use getByText to find the email input
    fireEvent.change(screen.getByText("UFL Email").nextSibling, {
      target: { value: "nonexistent@ufl.edu" },
    });

    // Use getByText to find the password input
    fireEvent.change(screen.getByText("Password").nextSibling, {
      target: { value: "correctpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
    await waitFor(() => {
      expect(screen.getByText("User Not found")).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error for incorrect password", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ password: "correctpassword" }),
    });
    renderComponent();
    // Use getByText to find the email input
    fireEvent.change(screen.getByText("UFL Email").nextSibling, {
      target: { value: "test@ufl.edu" },
    });

    // Use getByText to find the password input
    fireEvent.change(screen.getByText("Password").nextSibling, {
      target: { value: "incorrectpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
    await waitFor(() => {
      expect(screen.getByText("Incorrect Password")).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("navigates to discover page on successful login", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        email: "test@ufl.edu",
        name: "Test User",
        password: "correctpassword",
      }),
    });

    renderComponent();

    // Use getByText to find the email input
    fireEvent.change(screen.getByText("UFL Email").nextSibling, {
      target: { value: "test@ufl.edu" },
    });

    // Use getByText to find the password input
    fireEvent.change(screen.getByText("Password").nextSibling, {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/discover");
    });
  });

  test("calls onSignup when signup link is clicked", async () => {
    const mockOnSignup = jest.fn();

    render(<Login onClose={() => {}} onSignup={mockOnSignup} />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockOnSignup).toHaveBeenCalledTimes(1);
  });
});
