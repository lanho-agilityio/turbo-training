import { generateSlug, getIdFromSlug } from "@repo/ui/utils/slugs";

describe("generateSlug function", () => {
  it("should generate slug correct format", () => {
    const result = generateSlug("slug based on the given prefix");
    expect(result).toEqual("slug-based-on-the-given-prefix");
  });
});

describe("getIdFromSlug function", () => {
  it("should get id from slug", () => {
    const result = getIdFromSlug(
      "slug-with-id-like-4jVyvoHxZvMODN0vifQwODbkuhE2"
    );
    expect(result).toEqual("4jVyvoHxZvMODN0vifQwODbkuhE2");
  });

  it("should get id from slug without minus split", () => {
    const result = getIdFromSlug("ifQwODbkuhE2");
    expect(result).toEqual("ifQwODbkuhE2");
  });

  it("should return empty id when give empty slug", () => {
    const result = getIdFromSlug("");
    expect(result).toEqual("");
  });
});
