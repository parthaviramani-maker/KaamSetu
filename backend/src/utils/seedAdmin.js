import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/config.js';

const seedAdmin = async () => {
    try {
        const targetEmail = ADMIN_EMAIL.toLowerCase().trim();

        // Check if admin with the correct email already exists
        const correct = await User.findOne({ role: 'admin', email: targetEmail });
        if (correct) {
            console.log(`✅ Admin already exists: ${correct.email}`);
            return;
        }

        // Delete any old admin with a different email
        const old = await User.findOne({ role: 'admin' });
        if (old) {
            await User.findByIdAndDelete(old._id);
            console.log(`🗑️  Old admin deleted: ${old.email}`);
        }

        // Create new admin from .env
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        await User.create({
            name:        'Super Admin',
            email:       targetEmail,
            password:    hashedPassword,
            role:        'admin',
            isActive:    true,
            isOnboarded: true,
        });

        console.log('🚀 Admin account created!');
        console.log(`   Email    : ${targetEmail}`);
        console.log(`   Password : ${ADMIN_PASSWORD}`);
        console.log('   ⚠️  Please change the password after first login.');
    } catch (error) {
        console.error('❌ Failed to seed admin:', error.message);
    }
};

export default seedAdmin;
