import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About", () => {
  test("renders the About component", () => {
    render(<About />);

    const heading = screen.getByRole("heading", { name: /about/i });
    expect(heading).toBeInTheDocument();
  });
});
