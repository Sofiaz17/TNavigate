/**
 * Enhanced API Documentation for TNavigate
 * This file contains comprehensive Swagger/OpenAPI documentation
 */

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'TNavigate API',
        version: '1.0.0',
        description: 'Complete user authentication and profile management system for TNavigate',
        contact: {
            name: 'TNavigate Team',
            email: 'support@tnavigate.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Development server'
        },
        {
            url: 'https://api.tnavigate.com/api/v1',
            description: 'Production server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT token obtained from authentication endpoint'
            }
        },
        schemas: {
            User: {
                type: 'object',
                required: ['userType', 'name', 'surname', 'email', 'password'],
                properties: {
                    userType: {
                        type: 'string',
                        enum: ['base_user', 'shop_owner'],
                        description: 'Type of user account',
                        example: 'base_user'
                    },
                    name: {
                        type: 'string',
                        description: 'User\'s first name',
                        example: 'John',
                        minLength: 1,
                        maxLength: 50
                    },
                    surname: {
                        type: 'string',
                        description: 'User\'s last name',
                        example: 'Doe',
                        minLength: 1,
                        maxLength: 50
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User\'s email address',
                        example: 'john.doe@example.com'
                    },
                    password: {
                        type: 'string',
                        description: 'User\'s password (minimum 6 characters)',
                        example: 'password123',
                        minLength: 6
                    },
                    phone: {
                        type: 'string',
                        description: 'User\'s phone number (optional)',
                        example: '+39 123 456 7890'
                    },
                    address: {
                        type: 'string',
                        description: 'User\'s address (optional)',
                        example: 'Via Roma, 123, Trento TN'
                    }
                }
            },
            UserResponse: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique user identifier',
                        example: '507f1f77bcf86cd799439011'
                    },
                    userType: {
                        type: 'string',
                        enum: ['base_user', 'shop_owner'],
                        example: 'base_user'
                    },
                    name: {
                        type: 'string',
                        example: 'John'
                    },
                    surname: {
                        type: 'string',
                        example: 'Doe'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    },
                    phone: {
                        type: 'string',
                        example: '+39 123 456 7890'
                    },
                    address: {
                        type: 'string',
                        example: 'Via Roma, 123, Trento TN'
                    }
                }
            },
            AuthRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User\'s email address',
                        example: 'john.doe@example.com'
                    },
                    password: {
                        type: 'string',
                        description: 'User\'s password',
                        example: 'password123'
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        description: 'JWT authentication token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    id: {
                        type: 'string',
                        description: 'User ID',
                        example: '507f1f77bcf86cd799439011'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    },
                    userType: {
                        type: 'string',
                        enum: ['base_user', 'shop_owner'],
                        example: 'base_user'
                    },
                    name: {
                        type: 'string',
                        example: 'John'
                    },
                    surname: {
                        type: 'string',
                        example: 'Doe'
                    },
                    phone: {
                        type: 'string',
                        example: '+39 123 456 7890'
                    },
                    address: {
                        type: 'string',
                        example: 'Via Roma, 123, Trento TN'
                    },
                    self: {
                        type: 'string',
                        description: 'URL to user profile',
                        example: '/api/v1/users/507f1f77bcf86cd799439011'
                    }
                }
            },
            UpdateUserRequest: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Updated first name',
                        example: 'John Updated'
                    },
                    surname: {
                        type: 'string',
                        description: 'Updated last name',
                        example: 'Doe Updated'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Updated email address',
                        example: 'john.updated@example.com'
                    },
                    phone: {
                        type: 'string',
                        description: 'Updated phone number',
                        example: '+39 999 888 7777'
                    },
                    address: {
                        type: 'string',
                        description: 'Updated address',
                        example: 'Via Updated, 456, Trento TN'
                    },
                    currentPassword: {
                        type: 'string',
                        description: 'Current password (required when changing password)',
                        example: 'currentpassword123'
                    },
                    newPassword: {
                        type: 'string',
                        description: 'New password (minimum 6 characters)',
                        example: 'newpassword123',
                        minLength: 6
                    }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'Error message',
                        example: 'Validation error'
                    }
                }
            },
            SuccessResponse: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'Success message',
                        example: 'User registered successfully'
                    },
                    user: {
                        $ref: '#/components/schemas/UserResponse'
                    }
                }
            }
        },
        responses: {
            UnauthorizedError: {
                description: 'Authentication information is missing or invalid',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            message: 'No token provided.'
                        }
                    }
                }
            },
            ForbiddenError: {
                description: 'Access denied - insufficient permissions',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            message: 'Access denied'
                        }
                    }
                }
            },
            NotFoundError: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            message: 'User not found'
                        }
                    }
                }
            },
            ValidationError: {
                description: 'Validation error',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            message: 'Validation error'
                        }
                    }
                }
            },
            ConflictError: {
                description: 'Resource conflict (e.g., email already exists)',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            message: 'Email already exists'
                        }
                    }
                }
            }
        }
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication endpoints'
        },
        {
            name: 'Users',
            description: 'User management endpoints'
        }
    ]
};

module.exports = swaggerDefinition;
