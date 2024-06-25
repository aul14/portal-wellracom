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
            { name: 'Modules' },
            { name: 'Permissions' },
            { name: 'Users Management' },
            { name: 'Roles' },
            { name: 'Pengajuan Cuti' },
            { name: 'Menunggu Approval Cuti' },
            { name: 'History Cuti' },
            { name: 'No Module' },
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
                role_id: 1
            },
            {
                name: 'Test user',
                username: 'user',
                email: 'user@gmail.com',
                password: await argon2.hash('123456'),
                role_id: 2
            },
        ]);

        await Permissions.bulkCreate([
            { keyName: 'manage-profile', name: 'Manage Profile', description: 'Boleh Manage Profile', module_id: 1 },
            { keyName: 'edit-profile', name: 'Edit Profile', description: 'Boleh Edit Profile', module_id: 1 },
            { keyName: 'manage-module', name: 'Manage Module', description: 'Boleh Manage Module', module_id: 2 },
            { keyName: 'create-module', name: 'Create Module', description: 'Boleh Create Module', module_id: 2 },
            { keyName: 'edit-module', name: 'Edit Module', description: 'Boleh Edit Module', module_id: 2 },
            { keyName: 'delete-module', name: 'Delete Module', description: 'Boleh Menghapus Module', module_id: 2 },
            { keyName: 'manage-permission', name: 'Manage Permission', description: 'Boleh Manage Permission', module_id: 3 },
            { keyName: 'create-permission', name: 'Create Permission', description: 'Boleh Tambah Permission', module_id: 3 },
            { keyName: 'edit-permission', name: 'Edit Permission', description: 'Boleh Edit Permission', module_id: 3 },
            { keyName: 'delete-permission', name: 'Delete Permission', description: 'Boleh Delete Permission', module_id: 3 },
            { keyName: 'manage-user', name: 'Manage User', description: 'Boleh Manage User', module_id: 4 },
            { keyName: 'create-user', name: 'Create User', description: 'Boleh Create User', module_id: 4 },
            { keyName: 'edit-user', name: 'Edit User', description: 'Boleh Edit User', module_id: 4 },
            { keyName: 'delete-user', name: 'Delete User', description: 'Boleh Delete User', module_id: 4 },
            { keyName: 'reset-password', name: 'Reset Password User', description: 'Boleh Mengganti Password User', module_id: 4 },
            { keyName: 'manage-account', name: 'Manage Account Profile', description: 'Boleh Manage Profile', module_id: 4 },
            { keyName: 'edit-account', name: 'Edit Account Profile', description: 'Boleh Edit Profile', module_id: 4 },
            { keyName: 'change-password-account', name: 'Reset Password Profile', description: 'Boleh Mengganti Password Profile', module_id: 4 },
            { keyName: 'manage-role', name: 'Manage Role', description: 'Boleh Manage Role', module_id: 5 },
            { keyName: 'create-role', name: 'Create Role', description: 'Boleh Create Role', module_id: 5 },
            { keyName: 'edit-role', name: 'Edit Role', description: 'Boleh Edit Role', module_id: 5 },
            { keyName: 'delete-role', name: 'Delete Role', description: 'Boleh Delete Role', module_id: 5 },
            { keyName: 'manage-role-access', name: 'Manage Role Access', description: 'Boleh Manage Role Access', module_id: 5 },
            { keyName: 'show-individu-pengajuan-cuti', name: 'Show Individu Pengajuan Cuti', description: 'Boleh melihat pengajuan cuti individu', module_id: 6 },
            { keyName: 'show-all-pengajuan-cuti', name: 'Show All Pengajuan Cuti', description: 'Boleh melihat pengajuan cuti semuanya', module_id: 6 },
            { keyName: 'manage-pengajuan-cuti', name: 'Manage Pengajuan Cuti', description: 'Boleh manage pengajuan cuti', module_id: 6 },
            { keyName: 'create-pengajuan-cuti', name: 'Create Pengajuan Cuti', description: 'Boleh create pengajuan cuti', module_id: 6 },
            { keyName: 'edit-pengajuan-cuti', name: 'Edit Pengajuan Cuti', description: 'Boleh edit pengajuan cuti', module_id: 6 },
            { keyName: 'detail-pengajuan-cuti', name: 'Detail Pengajuan Cuti', description: 'Boleh liat detail pengajuan cuti', module_id: 6 },
            { keyName: 'delete-pengajuan-cuti', name: 'Delete Pengajuan Cuti', description: 'Boleh delete pengajuan cuti', module_id: 6 },
            { keyName: 'manage-approval-cuti', name: 'Manage Approval Cuti', description: 'Boleh manage approval cuti', module_id: 7 },
            { keyName: 'approved-cuti', name: 'Approved Cuti', description: 'Akses untuk mensetujui cuti', module_id: 7 },
            { keyName: 'not-approved-cuti', name: 'Not Approved Cuti', description: 'Akses untuk tidak mensetujui cuti', module_id: 7 },
            { keyName: 'manage-history-cuti', name: 'Manage History Cuti', description: 'Boleh manage history cuti', module_id: 8 },
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
            { permission_id: 23, role_id: 1 },
            { permission_id: 24, role_id: 1 },
            { permission_id: 25, role_id: 1 },
            { permission_id: 26, role_id: 1 },
            { permission_id: 27, role_id: 1 },
            { permission_id: 28, role_id: 1 },
            { permission_id: 29, role_id: 1 },
            { permission_id: 30, role_id: 1 },
            { permission_id: 31, role_id: 1 },
            { permission_id: 32, role_id: 1 },
            { permission_id: 33, role_id: 1 },
            { permission_id: 34, role_id: 1 },
        ]);

        console.log("Database migration & seeded succesfully!");

    } catch (error) {
        console.error('Error migration & seeding database:', error);
    } finally {
        await db.close();
    }
})();