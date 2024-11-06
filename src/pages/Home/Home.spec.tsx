import { render, screen } from "@testing-library/react";
import { Home } from "./Home.tsx";

describe("Home", () => {
  test("renders the Home component", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { name: /home/i });
    expect(heading).toBeInTheDocument();
  });
});
