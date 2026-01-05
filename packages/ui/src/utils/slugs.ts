/**
 * Generates a slug based on the given prefix.
 * @param {string} prefix - The prefix to be used for generating the slug.
 * @returns {string} - The generated slug with format. Example: 'watch-database-with-prefix'
 */

export const generateSlug = (prefix: string): string => {
  const slug = `${prefix.replace(/\s+/g, "-").toLowerCase()}`;
  return slug;
};

/**
 * Extracts ID from a slug.
 *
 * @param slug - The slug containing the ID.
 * @returns The extracted ID or empty string.
 */

export const getIdFromSlug = (slug?: string): string | undefined => {
  if (!slug) {
    return "";
  }

  const parts = slug.split("-").pop();

  return parts || "";
};
