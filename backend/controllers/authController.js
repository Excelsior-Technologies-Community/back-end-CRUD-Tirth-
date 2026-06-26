const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * Helper function to generate a JSON Web Token
 * @param {string} id - The MongoDB ObjectId of the user
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || 'stocksyncjwtsecretkey2026',
        { expiresIn: '30d' } // Token remains active for 30 days
    );
};

/**
 * Helper function to generate a random 8-character temporary password
 */
const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Helper function to send temporary password via Nodemailer
 */
const sendTempPasswordEmail = async (email, name, tempPassword) => {
    console.log(`[EMAIL SERVICE] Initializing email dispatch for: ${email}`);
    console.log(`[EMAIL DISPATCH] Temp Password for ${email}: ${tempPassword}`);

    let transporter;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (user && pass) {
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: { user, pass }
        });
    } else {
        // Fallback: Create Ethereal test SMTP account for development/viva
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log(`[EMAIL SERVICE] Local Ethereal SMTP test account created: User=${testAccount.user}`);
        } catch (e) {
            console.log('[EMAIL SERVICE] Failed to initialize Ethereal test account:', e.message);
        }
    }

    const mailOptions = {
        from: `"StockSync System" <${user || 'no-reply@stocksync.com'}>`,
        to: email,
        subject: 'Welcome to StockSync - Temporary Password',
        text: `Welcome to StockSync, ${name}.\n\nYour temporary password is: ${tempPassword}\n\nPlease login and change your password.\n\nBest regards,\nStockSync Team`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #4F46E5;">Welcome to StockSync, ${name}!</h2>
                <p>Your account has been registered successfully.</p>
                <p>Your temporary password is:</p>
                <div style="background: #f3f4f6; padding: 12px; font-size: 1.5rem; letter-spacing: 2px; font-family: monospace; font-weight: bold; text-align: center; color: #111827; border-radius: 4px; margin: 20px 0;">
                    ${tempPassword}
                </div>
                <p>Please log in using this temporary password and change it immediately on your first login.</p>
                <br/>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 0.85rem; color: #666;">This is an automated system email. Please do not reply.</p>
            </div>
        `
    };

    if (transporter) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`[EMAIL SERVICE] Email sent successfully: ${info.messageId}`);
            if (!user) {
                console.log(`[EMAIL SERVICE] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
            return true;
        } catch (error) {
            console.error('[EMAIL SERVICE] Send error:', error);
            return false;
        }
    }
    return false;
};

/**
 * POST /api/auth/register
 * Handles user account registration (Name + Email only, auto-generates temp password)
 */
const registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // 1. Validate inputs
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please enter both your name and email address'
            });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email address already exists'
            });
        }

        // 3. Generate random temporary password
        const tempPassword = generateTempPassword();

        console.log(`[USER REGISTRATION] Request received for name: "${name}", email: "${email}"`);
        console.log('[USER REGISTRATION] Attempting to save new User document in MongoDB Atlas...');

        // 4. Create user
        const user = await User.create({
            name,
            email,
            password: tempPassword,
            isTempPassword: true
        });

        if (user) {
            console.log(`[USER REGISTRATION] User document saved successfully! ID: ${user._id}, Collection: stocksync.users`);
            // Send the temporary password via email (runs asynchronously)
            sendTempPasswordEmail(email, name, tempPassword);

            res.status(201).json({
                success: true,
                message: 'Registration successful! A temporary password has been sent to your email.'
            });
        } else {
            console.error('[USER REGISTRATION] Failed to save user document: User.create returned empty/invalid.');
            res.status(400).json({
                success: false,
                message: 'Invalid user data received'
            });
        }
    } catch (error) {
        console.error('[USER REGISTRATION] Database insertion failed during user save:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error during registration',
            error: error.message
        });
    }
};

/**
 * POST /api/auth/login
 * Handles user sign in and returns JWT token
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter both email and password'
            });
        }

        // 2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 3. Verify password match
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 4. Successful login: generate JWT token and return user details
        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                isTempPassword: user.isTempPassword,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error during login',
            error: error.message
        });
    }
};

/**
 * PUT /api/auth/change-password
 * Updates password and sets isTempPassword to false
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // 1. Validate fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all password fields'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirmation do not match'
            });
        }

        // 2. Fetch user from database
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // 3. Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect current password'
            });
        }

        // 4. Update password and isTempPassword status
        user.password = newPassword;
        user.isTempPassword = false;

        console.log(`[USER SAVE] Attempting to save updated password/isTempPassword for user ID: ${user._id}`);
        await user.save();
        console.log(`[USER SAVE] User updated and saved successfully! ID: ${user._id}`);

        res.json({
            success: true,
            message: 'Password changed successfully! You can now use the app.'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error during password change',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    changePassword
};
