import { render, screen } from "@testing-library/react";
import React from "react";
import View from "./index";
test("renders facebook link", () => {
  render(<View />);
  expect(screen.getByText(/facebook/i)).toBeInTheDocument();
});
