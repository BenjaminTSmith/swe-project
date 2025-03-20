import { render, screen, waitFor } from "@testing-library/react";
import LoginScr from "../LoginScr";
import "@testing-library/jest-dom";

describe("LoginScr Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders landing page content correctly", () => {
    render(<LoginScr />);

    expect(screen.getByText("Connect → Schedule → Learn")).toBeInTheDocument();
    expect(
      screen.getByText(/Learn from students tutors who have/)
    ).toBeInTheDocument();
    expect(screen.getByText("aced")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in/i })
    ).toBeInTheDocument();
  });
});
