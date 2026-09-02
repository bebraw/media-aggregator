import { describe, expect, it } from "vitest";
import { newsSources } from "./sources";

describe("newsSources", () => {
  it("backs every visible region with a configured publisher", () => {
    const configuredRegions = [...new Set(newsSources.map((source) => source.region))].sort();

    expect(configuredRegions).toEqual(["Africa", "Americas", "East Asia", "Europe", "Middle East", "South Asia"]);
  });
});
