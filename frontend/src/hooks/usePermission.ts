import { useAuthStore } from '../store/useAuthStore';

export const usePermission = () => {
  const permissions = useAuthStore((s) => s.permissions);
  const can = (permission: string): boolean => permissions.includes(permission);
  return { can };
};