import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PopupCalendar from "../PopupCalendar";
import "@testing-library/jest-dom";
import moment from "moment";
import { updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  updateDoc: jest.fn(),
  doc: jest.fn((_, __, id) => `doc(${id})`),
  arrayUnion: jest.fn((value) => value),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));
jest.mock("../../firebaseConfig", () => ({ db: {} }));

const mockOnClose = jest.fn();

const tutorAvailability = [
  {
    start: moment().set({ hour: 10, minute: 0, second: 0, millisecond: 0 }).toISOString(),
    end: moment().set({ hour: 11, minute: 0, second: 0, millisecond: 0 }).toISOString(),
  },
];

const mockTutor = {
  email: "tutor@example.com",
  availability: tutorAvailability,
};

const mockStudent = {
  email: "student@example.com",
};

describe("PopupCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuth.mockReturnValue({
      currentUser: { email: "student@example.com" },
    });
  });

  const renderComponent = () => {
    render(<PopupCalendar tutor={mockTutor} student={mockStudent} onClose={mockOnClose} />);
  };

  test("renders calendar and confirm button", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
  });

  test("shows error if no slot is selected", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Please select an available time slot first")
      ).toBeInTheDocument();
    });
  });

  test("shows error if user is not logged in", async () => {
    getAuth.mockReturnValue({ currentUser: null });
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.getByText("You must be logged in to book a session.")
      ).toBeInTheDocument();
    });
  });

  test("shows error if Firestore update fails", async () => {
    updateDoc.mockRejectedValueOnce(new Error("Firestore failed"));
  
    renderComponent();
  
    fireEvent.click(screen.getByTestId("calendar-confirm"));
  
    await waitFor(() => {
      expect(screen.getByTestId("calendar-error")).toHaveTextContent(
        "Please select an available time slot first"
      );
    });
  });
});
