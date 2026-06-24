/**
 * Swagger API Documentation configuration and setup file.
 * This file configures swagger-jsdoc and exports a function to mount
 * the Swagger UI middleware on the main Express application.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition configuration
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'StockSync API Documentation',
            version: '1.0.0',
            description: 'Beginner-friendly API documentation for the StockSync MERN CRUD & JWT Authentication system.',
            contact: {
                name: 'StockSync Developer Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local Development Server'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token to authorize requests. Format: Bearer <token>'
                }
            },
            schemas: {
                // User Registration Input Schema
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Full name of the user'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                            description: 'Valid, unique email address'
                        }
                    }
                },
                // User Login Input Schema
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                            description: 'Registered user email'
                        },
                        password: {
                            type: 'string',
                            example: 'secretpassword123',
                            description: 'Account password'
                        }
                    }
                },
                // Change Password Input Schema
                ChangePasswordRequest: {
                    type: 'object',
                    required: ['currentPassword', 'newPassword', 'confirmPassword'],
                    properties: {
                        currentPassword: {
                            type: 'string',
                            example: 'tempPass123',
                            description: 'The current password or temporary password'
                        },
                        newPassword: {
                            type: 'string',
                            example: 'newSecurePassword456',
                            description: 'New password (minimum 6 characters)'
                        },
                        confirmPassword: {
                            type: 'string',
                            example: 'newSecurePassword456',
                            description: 'Must match the newPassword field exactly'
                        }
                    }
                },
                // Product input payload
                ProductRequest: {
                    type: 'object',
                    required: ['name', 'price', 'category'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Wireless Mouse',
                            description: 'Name of the product'
                        },
                        price: {
                            type: 'number',
                            example: 1299.99,
                            description: 'Price of the product (must be positive)'
                        },
                        category: {
                            type: 'string',
                            example: 'Electronics',
                            description: 'Category group of the product (e.g. Electronics, Clothing, Home, Books)'
                        },
                        image: {
                            type: 'string',
                            example: 'mouse.jpg',
                            description: 'Filename or URL of the product image (optional)'
                        }
                    }
                },
                // Product response schema
                ProductResponse: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '6a3b9434d9fa1c768e226063',
                            description: 'MongoDB auto-generated unique identifier'
                        },
                        name: {
                            type: 'string',
                            example: 'Wireless Mouse'
                        },
                        price: {
                            type: 'number',
                            example: 1299.99
                        },
                        category: {
                            type: 'string',
                            example: 'Electronics'
                        },
                        image: {
                            type: 'string',
                            example: 'mouse.jpg'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-06-24T10:00:00Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-06-24T10:05:00Z'
                        }
                    }
                }
            }
        }
    },
    // We scan this file for API definitions
    apis: [__filename]
};

const specs = swaggerJsdoc(options);

/**
 * Setup function to register Swagger documentation UI route in Express
 * @param {Express.Application} app - The Express application instance
 */
const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log('Swagger API Documentation mounted at: http://localhost:5000/api-docs');
};

module.exports = setupSwagger;

// =========================================================================
// API ROUTE DEFINITIONS (SWAGGER/OPENAPI JSDOC ANNOTATIONS)
// =========================================================================

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a user account with name and email, and emails an auto-generated temporary password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Registration successful! A temporary password has been sent to your email.'
 *       400:
 *         description: Missing fields or email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'A user with this email address already exists'
 *       500:
 *         description: Server database error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Server Error during registration'
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticates the user with email and password, and returns a JSON Web Token (JWT).
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Login successful!'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '6a38f775078e19f3ee6caa7d'
 *                     name:
 *                       type: string
 *                       example: 'John Doe'
 *                     email:
 *                       type: string
 *                       example: 'john@example.com'
 *                     isTempPassword:
 *                       type: boolean
 *                       example: false
 *                     token:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: Missing fields.
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Invalid email or password'
 *       500:
 *         description: Server error.
 */

/**
 * @openapi
 * /api/auth/change-password:
 *   put:
 *     summary: Change temporary/current password
 *     description: Updates the user's password. Requires active Authorization Bearer Token.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Password changed successfully! You can now use the app.'
 *       400:
 *         description: Validation error, new password too short, or mismatch.
 *       401:
 *         description: Unauthorized. Missing or invalid Bearer token.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products in the inventory sorted by newest first. (Public)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponse'
 *       500:
 *         description: Server database error.
 */

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Fetches a single product record from the inventory database. (Public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique product database ID
 *         example: '6a3b9434d9fa1c768e226063'
 *     responses:
 *       200:
 *         description: Product fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Product not found'
 *       500:
 *         description: Server database error.
 */

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Inserts a new product into the database. Requires Authorization Bearer Token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Product added successfully!'
 *                 data:
 *                   $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Missing fields or invalid values.
 *       401:
 *         description: Unauthorized. Missing or invalid Bearer token.
 *       500:
 *         description: Server database error.
 */

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Updates the values of an existing product in the database. Requires Authorization Bearer Token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique product database ID
 *         example: '6a3b9434d9fa1c768e226063'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Product updated successfully!'
 *                 data:
 *                   $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error or invalid fields.
 *       401:
 *         description: Unauthorized. Missing or invalid Bearer token.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Server database error.
 */

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product from the database. Requires Authorization Bearer Token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique product database ID
 *         example: '6a3b9434d9fa1c768e226063'
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Product deleted successfully!'
 *                 data:
 *                   $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Unauthorized. Missing or invalid Bearer token.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Server database error.
 */
