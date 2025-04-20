import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SchedulerScr from "../SchedulerScr";
import "@testing-library/jest-dom";
import { Calendar } from "react-big-calendar";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, updateDoc } from "firebase/firestore";
import { doc as mockDoc } from "firebase/firestore";

// Mock Firebase Auth and Firestore
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(() => "mockDocRef"),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("firebase/firestore", () => {
  const actual = jest.requireActual("firebase/firestore");
  return {
    ...actual,
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
  };
});

beforeEach(() => {
  mockDoc.mockReturnValue("mockDocRef");
});

// Mock firebaseConfig
jest.mock("../../firebaseConfig", () => ({
  app: {},
}));

// Helper to render with a fake user
const mockUser = { email: "test@ufl.edu" };

describe("SchedulerScr", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders calendar and input fields", async () => {
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return () => {};
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        location: "Library",
        subjects: "Math",
        rate: "25",
        isPublic: true,
        availability: [],
        scheduledTimeToMeet: [],
      }),
    });

    render(<SchedulerScr />);

    await waitFor(() => {
      expect(screen.getByText("Subjects")).toBeInTheDocument();
    });

    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Hourly Rate")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save Changes/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByDisplayValue("Math")).toBeInTheDocument();
    });
  });

  test("can edit input fields", async () => {
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return () => {};
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        location: "",
        subjects: "",
        rate: "",
        isPublic: false,
        availability: [],
        scheduledTimeToMeet: [],
      }),
    });

    render(<SchedulerScr />);

    const subjectsInput = await screen.findByTestId("subjects-input");
    fireEvent.change(subjectsInput, { target: { value: "Physics" } });
    expect(subjectsInput.value).toBe("Physics");

    const rateInput = screen.getByTestId("rate-input");
    fireEvent.change(rateInput, { target: { value: "30" } });
    expect(rateInput.value).toBe("30");
  });

  test("toggles checkbox", async () => {
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return () => {};
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        location: "",
        subjects: "",
        rate: "",
        isPublic: false,
        availability: [],
        scheduledTimeToMeet: [],
      }),
    });

    render(<SchedulerScr />);

    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test("calls updateDoc when saving changes", async () => {
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return () => {};
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        location: "",
        subjects: "",
        rate: "",
        isPublic: false,
        availability: [],
        scheduledTimeToMeet: [],
      }),
    });

    render(<SchedulerScr />);

    const saveButton = await screen.findByRole("button", { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledWith("mockDocRef", expect.any(Object));
    });
  });

  test("alerts when not signed in", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback(null);
      return () => {};
    });

    render(<SchedulerScr />);

    const saveButton = await screen.findByRole("button", { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("You must be signed in to save changes.");
    });

    alertMock.mockRestore();
  });
});
