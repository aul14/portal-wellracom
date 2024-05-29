export const checkPermissions = (...requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.user.data.role.permissions;
        const userPermissionKeys = userPermissions.map(permission => permission.keyName);

        // Check if at least one of the required permissions is present in userPermissions
        const hasPermission = requiredPermissions.some(requiredPermission =>
            userPermissionKeys.includes(requiredPermission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                status: 'error',
                msg: 'You don\'t have permission!'
            });
        }

        return next();
    };
};
