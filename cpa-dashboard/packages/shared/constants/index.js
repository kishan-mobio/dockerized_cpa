const USER_ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  CLIENT: 'client'
};

const SERVICE_PORTS = {
  USERS: 3001,
  TENANT: 3002,
  AUTH: 3003,
  GATEWAY: 3000
};

const DB_NAMES = {
  USERS: 'cpa_users',
  TENANT: 'cpa_tenants',
  AUTH: 'cpa_auth'
};

module.exports = {
  USER_ROLES,
  SERVICE_PORTS,
  DB_NAMES
};