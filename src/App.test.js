import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";
test("renders facebook link", () => {
  render(<App />);
  expect(screen.getByText(/facebook/i)).toBeInTheDocument();
});
