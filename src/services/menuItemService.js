import api from '../api/axiosConfig';

export const getMenuItemsByFoodType = async (foodType, page = 0, size = 12) => {
  const response = await api.get(`/api/menu-items/food-type/${foodType}`, {
    params: {
      page,
      size,
      sort: 'id,asc', // Add a default sort if needed
    }
  });
  return response.data;
};

export default {
  getMenuItemsByFoodType
};
