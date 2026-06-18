export const checkPermission = (required: string) => {
  return (req: any, res: any, next: any) => {
    const permissions: string[] = req.user?.permissions ?? [];
    if (!permissions.includes(required)) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
  };
};