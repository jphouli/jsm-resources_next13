import qs from "query-string"

interface BuildQueryParams {
    type: string;
    query: string;
    category: string;
    page: number;
    perPage?: number;
}

interface URLQueryParams {
  params: string,
  key?: string,
  value?: string | null,
  keysToRemove?: string[];
}

export function buildQuery(params: BuildQueryParams) {
    const { type, query, category, page = 1, perPage = 20 } = params;
  
    const conditions = [`*[_type=="${type}"`];
  
    if (query) conditions.push(`title match "*${query}*"`);
  
    if (category && category !== "all") {
      conditions.push(`category == "${category}"`);
    }
  
    // Calculate pagination limits
    const offset = (page - 1) * perPage;
    const limit = perPage;
  
    return conditions.length > 1
      ? `${conditions[0]} && (${conditions
          .slice(1)
          .join(" && ")})][${offset}...${limit}]`
      : `${conditions[0]}][${offset}...${limit}]`;
}

export function formURLQuery( { params, key, value, keysToRemove }: URLQueryParams) {
    const currentURL = qs.parse(params);
    
    if (keysToRemove) {
      keysToRemove.forEach((keyToRemove)=>{
        delete currentURL[keyToRemove];
      })
    } 
    else if (key && value) {
      currentURL[key] = value
    }

    return qs.stringifyUrl(
      {url: window.location.pathname, query: currentURL},
      {skipNull: true}
    )
}