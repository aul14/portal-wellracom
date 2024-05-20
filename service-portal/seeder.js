import db from './config/Database.js';
import Modules from './models/ModuleModel.js';
import Permissions from './models/PermissionModel.js';
import Roles from './models/RoleModel.js';
import PermissionsRoles from './models/PermissionRoleModel.js';
import Users from './models/UserModel.js';
import RefreshTokens from './models/RefreshTokenModel.js';
import argon2 from 'argon2';

// Uncoment perintah dibawah untuk langsung auto migrate, setelah itu coment lagi.
(async () => {
    try {
        await db.sync({ force: true, alter: true });

        await Modules.bulkCreate([
            { name: 'Profile' },
            { name: 'Module' },
            { name: 'Permission' },
            { name: 'User Management' },
            { name: 'Role' },
            { name: 'No Module' }
        ]);

        await Roles.bulkCreate([
            { name: 'Sys Admin', description: 'Ini adalah role sys admin.' },
            { name: 'User', description: 'Ini adalah role user.' },
        ]);

        await Users.bulkCreate([
            {
                name: 'Super admin',
                username: 'admin',
                email: 'admin@gmail.com',
                password: await argon2.hash('123456'),
                roleId: 1
            },
            {
                name: 'Test user',
                username: 'user',
                email: 'user@gmail.com',
                password: await argon2.hash('123456'),
                roleId: 2
            },
        ]);

        await Permissions.bulkCreate([
            { keyName: 'manage-profile', name: 'Manage Profile', description: 'Can Manage Profile', moduleId: 1 },
            { keyName: 'edit-profile', name: 'Edit Profile', description: 'Can Edit Profile', moduleId: 1 },
            { keyName: 'manage-module', name: 'Manage Module', description: 'Can Manage Module', moduleId: 2 },
            { keyName: 'create-module', name: 'Create Module', description: 'Can Create Module', moduleId: 2 },
            { keyName: 'edit-module', name: 'Edit Module', description: 'Can Edit Module', moduleId: 2 },
            { keyName: 'delete-module', name: 'Delete Module', description: 'Can Menghapus Module', moduleId: 2 },
            { keyName: 'manage-permission', name: 'Manage Permission', description: 'Can Manage Permission', moduleId: 3 },
            { keyName: 'create-permission', name: 'Create Permission', description: 'Can Tambah Permission', moduleId: 3 },
            { keyName: 'edit-permission', name: 'Edit Permission', description: 'Can Edit Permission', moduleId: 3 },
            { keyName: 'delete-permission', name: 'Delete Permission', description: 'Can Delete Permission', moduleId: 3 },
            { keyName: 'manage-user', name: 'Manage User', description: 'Can Manage User', moduleId: 4 },
            { keyName: 'create-user', name: 'Create User', description: 'Can Create User', moduleId: 4 },
            { keyName: 'edit-user', name: 'Edit User', description: 'Can Edit User', moduleId: 4 },
            { keyName: 'delete-user', name: 'Delete User', description: 'Can Delete User', moduleId: 4 },
            { keyName: 'reset-password', name: 'Reset Password User', description: 'Can Mengganti Password User', moduleId: 4 },
            { keyName: 'manage-account', name: 'Manage Account Profile', description: 'Can Manage Profile', moduleId: 4 },
            { keyName: 'edit-account', name: 'Edit Account Profile', description: 'Can Edit Profile', moduleId: 4 },
            { keyName: 'change-password-account', name: 'Reset Password Profile', description: 'Can Mengganti Password Profile', moduleId: 4 },
            { keyName: 'manage-role', name: 'Manage Role', description: 'Can Manage Role', moduleId: 5 },
            { keyName: 'create-role', name: 'Create Role', description: 'Can Create Role', moduleId: 5 },
            { keyName: 'edit-role', name: 'Edit Role', description: 'Can Edit Role', moduleId: 5 },
            { keyName: 'delete-role', name: 'Delete Role', description: 'Can Delete Role', moduleId: 5 },
            { keyName: 'manage-role-access', name: 'Manage Role Access', description: 'Can Manage Role Access', moduleId: 5 }
        ]);

        await PermissionsRoles.bulkCreate([
            { permission_id: 1, role_id: 1 },
            { permission_id: 1, role_id: 2 },
            { permission_id: 2, role_id: 1 },
            { permission_id: 2, role_id: 2 },
            { permission_id: 3, role_id: 1 },
            { permission_id: 4, role_id: 1 },
            { permission_id: 5, role_id: 1 },
            { permission_id: 6, role_id: 1 },
            { permission_id: 7, role_id: 1 },
            { permission_id: 8, role_id: 1 },
            { permission_id: 9, role_id: 1 },
            { permission_id: 10, role_id: 1 },
            { permission_id: 11, role_id: 1 },
            { permission_id: 12, role_id: 1 },
            { permission_id: 13, role_id: 1 },
            { permission_id: 14, role_id: 1 },
            { permission_id: 15, role_id: 1 },
            { permission_id: 16, role_id: 1 },
            { permission_id: 17, role_id: 1 },
            { permission_id: 18, role_id: 1 },
            { permission_id: 19, role_id: 1 },
            { permission_id: 20, role_id: 1 },
            { permission_id: 21, role_id: 1 },
            { permission_id: 22, role_id: 1 },
            { permission_id: 23, role_id: 1 }
        ]);

        console.log("Database migration & seeded succesfully!");

    } catch (error) {
        console.error('Error migration & seeding database:', error);
    } finally {
        await db.close();
    }
})();