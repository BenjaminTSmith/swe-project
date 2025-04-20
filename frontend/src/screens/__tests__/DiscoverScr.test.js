import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiscoverScr from "../DiscoverScr";
import { BrowserRouter } from "react-router-dom";
import { calculateTutorRanks } from "../../components/rank";
import "@testing-library/jest-dom";

// Mock the calculateTutorRanks function
jest.mock("../../components/rank", () => ({
  calculateTutorRanks: jest.fn(),
}));

// Mock TutorCard component
jest.mock("../../components/TutorCard", () => ({ tutor, onSelect, onNameClick }) => (
  <div>
    <p onClick={onSelect}>{tutor.name}</p>
    <button onClick={onNameClick}>View Profile</button>
  </div>
));

// Mock PopupCalendar
jest.mock("../../components/PopupCalendar", () => ({ tutor, onClose }) => (
  <div>
    <p>Popup Calendar for {tutor.name}</p>
    <button onClick={onClose}>Close</button>
  </div>
));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

const mockTutors = [
  { uid: "1", name: "Alice", subjects: "Math", isPublic: true },
  { uid: "2", name: "Bob", subjects: "Physics", isPublic: true },
  { uid: "3", name: "Charlie", subjects: "Biology", isPublic: false }, // Should be filtered
];

describe("DiscoverScr", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <DiscoverScr />
      </BrowserRouter>
    );

  test("renders loading state initially", () => {
    calculateTutorRanks.mockReturnValue(new Promise(() => {})); // never resolves
    renderComponent();
    expect(screen.getByText(/loading tutors/i)).toBeInTheDocument();
  });

  test("displays tutor cards after loading", async () => {
    calculateTutorRanks.mockResolvedValue(mockTutors);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    // Should not show non-public tutor
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  test("filters tutors by search input", async () => {
    calculateTutorRanks.mockResolvedValue(mockTutors);
    renderComponent();

    await waitFor(() => screen.getByText("Alice"));

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "math" } });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  test("shows popup calendar when a tutor is selected", async () => {
    calculateTutorRanks.mockResolvedValue(mockTutors);
    renderComponent();

    await waitFor(() => screen.getByText("Alice"));

    fireEvent.click(screen.getByText("Alice")); // triggers `onSelect`
    expect(screen.getByText("Popup Calendar for Alice")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close")); // closes popup
    expect(screen.queryByText("Popup Calendar for Alice")).not.toBeInTheDocument();
  });

  test("navigates to profile when view profile is clicked", async () => {
    calculateTutorRanks.mockResolvedValue(mockTutors);

    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    renderComponent();

    await waitFor(() => screen.getByText("Alice"));

    fireEvent.click(screen.getAllByRole("button", { name: /view profile/i })[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/profile", {
      state: { user: mockTutors[0] },
    });
  });

  test("handles fetch error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    calculateTutorRanks.mockRejectedValueOnce(new Error("Fetch failed"));
  
    renderComponent();
  
    await waitFor(() =>
      expect(screen.queryByText(/loading tutors/i)).not.toBeInTheDocument()
    );
  
    consoleErrorSpy.mockRestore();
  });
});
