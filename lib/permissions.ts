export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  TECHNICIAN: "TECHNICIAN",
  CUSTOMER: "CUSTOMER",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export function isAdmin(role?: string | null) {
  return role === ROLES.ADMIN;
}

export function isManager(role?: string | null) {
  return role === ROLES.MANAGER;
}

export function isTechnician(role?: string | null) {
  return role === ROLES.TECHNICIAN;
}

export function isCustomer(role?: string | null) {
  return role === ROLES.CUSTOMER;
}

export function canManageSystem(role?: string | null) {
  return isAdmin(role) || isManager(role);
}

export function canViewOperationalData(role?: string | null) {
  return isAdmin(role) || isManager(role) || isTechnician(role) || isCustomer(role);
}

export function canEditVisits(role?: string | null) {
  return isAdmin(role) || isManager(role) || isTechnician(role);
}

export function canManageMasterData(role?: string | null) {
  return isAdmin(role) || isManager(role);
}