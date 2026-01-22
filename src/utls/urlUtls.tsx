
/**
 * Base URL for all external API calls.
 * It is read from the environment variable NEXT_PUBLIC_API_URL.
 */
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");
}

/** Base API URL string */
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL;

/**
 * Interface representing all API endpoint URLs.
 * Allows adding new endpoints dynamically without modifying this interface.
 */

export interface UrlUtility {
  [key: string]: string;
}

export const URL_UTILITY: UrlUtility = {
  authUrl: `${API_BASE_URL}api/auth/`,

}