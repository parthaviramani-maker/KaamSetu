import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/config.js';

const seedAdmin = async () => {
    try {
        // Check if any admin already exists
        const existing = await User.findOne({ role: 'admin' });
        if (existing) {
            console.log(`✅ Admin already exists: ${existing.email}`);
            return;
        }

        // No admin found — create default one from .env
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        await User.create({
            name:        'Super Admin',
            email:       ADMIN_EMAIL.toLowerCase().trim(),
            password:    hashedPassword,
            role:        'admin',
            isActive:    true,
            isOnboarded: true,
        });

        console.log('🚀 Default admin account created!');
        console.log(`   Email    : ${ADMIN_EMAIL}`);
        console.log(`   Password : ${ADMIN_PASSWORD}`);
        console.log('   ⚠️  Please change the password after first login.');
    } catch (error) {
        console.error('❌ Failed to seed admin:', error.message);
    }
};

export default seedAdmin;
