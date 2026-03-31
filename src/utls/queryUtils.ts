/**
 * Build payload for API from basic filters + advanced filters
 * @param basicFilters Object of basic filters (default operator: equals)
 * @param advancedFilters Array of advanced filter objects
 * @param mandatoryFields Array of mandatory field names
 * @param page Page number (default 0)
 * @param limit Page size (default 10)
 */
export type Operator =
  | "equals"
  | "bnotequals"
  | "bequals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "greaterThanEquals"
  | "lessThan"
  | "lessThanEquals"
  | "between";

export interface FilterItem {
  field: string;
  operator: Operator;
  value: string | boolean | number;
}

export interface BasicFilters {
  [field: string]: string | boolean | number;
}

export interface Payload {
  page: number;
  limit: number;
  filters: FilterItem[];
}


export const buildQueryPayload = (
  page = 0,
  limit = 10,
  basicFilters: BasicFilters,
  advancedFilters: FilterItem[] = [],
  mandatoryFields: string[] = [],
): Payload => {
  const filters: FilterItem[] = [];

  // Add basic filters (default operator = equals)
  Object.entries(basicFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (value === "true" || value === "false") {
        filters.push({ field: key, operator: "bequals", value });
      } else {
        filters.push({ field: key, operator: "equals", value });
      }
    }
  });

  // Merge advanced filters (override basic if same field)
  advancedFilters.forEach((adv) => {
    const index = filters.findIndex((f) => f.field === adv.field);
    if (adv.value !== "all") {
      if (index > -1) filters[index] = adv;
      else filters.push(adv);
    }
  });

  // Check mandatory fields
  const missingMandatory = mandatoryFields.filter(
    (f) => !filters.some((filter) => filter.field === f && filter.value !== undefined && filter.value !== null && filter.value !== "")
  );
  if (missingMandatory.length > 0) {
    throw new Error(`Missing mandatory fields: ${missingMandatory.join(", ")}`);
  }

  return {
    page,
    limit,
    filters,
  };
};



/**
 * Converts a flat object into a query string.
 * Ignores undefined or null values.
 *
 * Example:
 * { name: 'John', age: 30 } => "?name=John&age=30"
 */
export function toQueryParams(params: Record<string, any>): string {

  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? `?${query}` : "";
}

