export const ADMIN_DASHBOARD = {
  SUMMARY: '/api/dashboard/admin/summary',
  RECENT_ACTIVITIES: '/api/dashboard/admin/recent-activities',
  REVENUE: '/api/dashboard/admin/revenue',
  ORDERS: '/api/dashboard/admin/orders',

  VENDORS: '/api/dashboard/admin/vendors',
  COMPLAINTS: '/api/dashboard/admin/complaints',
};
export const PASSENGER_DASHBOARD = {
  SUMMARY: '/api/dashboard/passenger/summary',
  RECENT_ACTIVITIES: '/api/dashboard/passenger/recent-activities',
};

export const PASSENGER_API = {
  ME: '/api/passengers/me',
  CREATE: '/api/passengers/create',
  UPDATE: '/api/passengers/update'
};

export const JOURNEY_API = {
  GET_PASSENGER_JOURNEYS: (passengerId) => `/api/journeys/passenger/${passengerId}`,
  CREATE: '/api/journeys',
  UPDATE: (id) => `/api/journeys/${id}`,
  DELETE: (id) => `/api/journeys/${id}`,
  GET_BY_ID: (id) => `/api/journeys/${id}`,
  SEARCH: '/api/journeys/search'
};
export const VENDOR_API = {
  REGISTER: '/api/vendors/register'
};
export const VENDOR_DASHBOARD = {
  SUMMARY: '/api/dashboard/vendor/summary',
  RESTAURANTS: '/api/dashboard/vendor/restaurants',
  MENU: '/api/dashboard/vendor/menu',
  CUSTOMERS: '/api/dashboard/vendor/customers',
  REVIEWS: '/api/dashboard/vendor/reviews',
  COMPLAINTS: '/api/dashboard/vendor/complaints',
};
export const CATEGORY_API = {
  CREATE: '/api/categories/create',
  UPDATE: (id) => `/api/categories/${id}`,
  DELETE: (id) => `/api/categories/${id}`,
  BY_RESTAURANT: (id) => `/api/categories/restaurant/${id}`,
};
export const MENU_ITEM_API = {
  CREATE: '/api/menu-items',
  UPDATE: (id) => `/api/menu-items/${id}`,
  DELETE: (id) => `/api/menu-items/${id}`,
  BY_CATEGORY: (id) => `/api/menu-items/category/${id}`,
  BY_RESTAURANT: (id) => `/api/menu-items/restaurant/${id}`,
  SEARCH: '/api/menu-items/search',
  TOGGLE_AVAILABILITY: (id) => `/api/menu-items/${id}/availability`,
  UPLOAD_IMAGE: (id) => `/api/menu-items/${id}/image`
};
export const REVIEW_API = {
  BY_RESTAURANT: (id) => `/api/reviews/restaurant/${id}`,
  RATING_SUMMARY: (id) => `/api/reviews/restaurant/${id}/rating`,
  VENDOR_REVIEWS: '/api/vendor/reviews',
  REPLY: (id) => `/api/vendor/reviews/${id}/reply`,
  CREATE: '/api/reviews'
};
export const COMPLAINT_API = {
  VENDOR_COMPLAINTS: '/api/vendor/complaints'
};
export const ORDER_API = {
  CREATE: '/api/orders',
  ALL: '/api/orders/all',
  PASSENGER_ORDERS: '/api/orders/my-orders',
  VENDOR_ORDERS: '/api/orders/vendor',
  UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
  CANCEL: (id) => `/api/orders/${id}/cancel`,
  BY_ID: (id) => `/api/orders/${id}`,
  BY_NUMBER: (number) => `/api/orders/number/${number}`
};
export const RESTAURANT_API = {
  ALL: '/api/restaurants',
  BY_ID: (id) => `/api/restaurants/${id}`
};

export const STATION_API = {
  ALL: '/api/stations/all',
  SEARCH: '/api/stations/search',
  BY_ID: (id) => `/api/stations/${id}`,
  CREATE: '/api/stations',
  UPDATE: (id) => `/api/stations/${id}`,
  DELETE: (id) => `/api/stations/${id}`
};
