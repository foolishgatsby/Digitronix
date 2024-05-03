export const API_DOMAIN = "http://192.168.1.14:1702/api/v1";

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
};

export const TOKEN = "access_token";
export const USER_LOGIN = "user_login";
export const USER_ROLE = "user_role";
export const USER_NAME = "username";
export const USER_ID = "user_id";

export const ROLE = {
  DIRECTOR: {
    id: 1,
    name: "Director",
  },
  PRODUCTIONMANAGER: {
    id: 2,
    name: "Production_Manager",
  },
  SALE: {
    id: 4,
    name: "Sale",
  },
  WAREHOUSE: {
    id: 3,
    name: "Warehouse",
  },
  WORKER: {
    id: 5,
    name: "Worker",
  },
  DRIVER: {
    id: 6,
    name: "Driver",
  },
};
