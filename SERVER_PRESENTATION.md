================================================================================
                        ADVERTISEMENT.AI - SERVER ARCHITECTURE
                              Technical Team Presentation
================================================================================

1. PROJECT OVERVIEW
================================================================================

Advertisement.ai Server is a TypeScript/Node.js backend built with Express.js 
that manages user authentication, subscription billing, and project data through 
webhook integrations and RESTful APIs.

Tech Stack:
- Runtime: Node.js with TypeScript
- Framework: Express.js
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Clerk
- Package Manager: npm


2. CORE INFRASTRUCTURE
================================================================================

2.1 SERVER INITIALIZATION (server.ts)
    - Express app setup with middleware pipeline
    - CORS enabled for client-server communication
    - Environment variable configuration via dotenv
    - Default port: 5000 (configurable via PORT env)
    
    Middleware Stack:
    1. CORS - Cross-origin resource sharing
    2. Clerk Middleware - Authentication context injection
    3. Express JSON parser - Request body parsing
    4. Raw JSON parser - Webhook body parsing (specific route)


2.2 DATABASE CONFIGURATION (configs/prisma.ts)
    - Prisma Client initialization
    - PostgreSQL connection management
    - Centralized database access layer


2.3 PRISMA SCHEMA (prisma/schema.prisma)
    Database Models:
    
    USER MODEL
    ├─ id: String (Primary Key from Clerk)
    ├─ email: String
    ├─ name: String
    ├─ image: String (profile photo)
    ├─ credits: Int (default: 20)
    ├─ createdAt: DateTime (auto-generated)
    ├─ updatedAt: DateTime (auto-updated)
    └─ Relations: projects: Project[]
    
    PROJECT MODEL
    ├─ id: UUID (auto-generated primary key)
    ├─ name: String
    ├─ userId: String (foreign key)
    ├─ productName: String
    ├─ productDescription: String
    ├─ userPrompt: String
    ├─ aspectRatio: String (default: "9:16")
    ├─ targetLength: Int (default: 5)
    ├─ uploadedImages: String[] (array field)
    ├─ generatedImage: String
    ├─ generatedVideo: String
    ├─ isGenerating: Boolean (default: false)
    ├─ isPublished: Boolean (default: false)
    ├─ error: String (error storage)
    ├─ createdAt: DateTime (auto-generated)
    ├─ updatedAt: DateTime (auto-updated)
    └─ Relations: user: User (cascade delete on user removal)


3. AUTHENTICATION & MIDDLEWARE
================================================================================

3.1 CLERK AUTHENTICATION (middlewares/auth.ts)
    
    Protect Middleware:
    - Verifies user is authenticated via Clerk
    - Extracts userId from request context
    - Returns 401 Unauthorized if userId missing
    - Passes control to next middleware if valid
    
    Usage: Apply to protected routes requiring authentication
    

3.2 AUTHENTICATION FLOW
    1. Client sends request with Clerk token
    2. Clerk middleware extracts and validates token
    3. userId injected into req.auth context
    4. Protection middleware checks for userId
    5. Route handler receives authenticated context


4. WEBHOOK SYSTEM (controllers/clerk.ts)
================================================================================

4.1 ENDPOINT: POST /api/clerk
    - Receives verified webhooks from Clerk
    - Uses raw JSON body parser (signatures required)
    - Webhook signature verification built-in


4.2 WEBHOOK EVENT HANDLERS

    A) USER.CREATED
    ├─ Trigger: New user signs up via Clerk
    ├─ Action: Create user record in database
    ├─ Fields Synced:
    │  ├─ id (from Clerk)
    │  ├─ email (from email_addresses[0])
    │  ├─ name (first_name + last_name)
    │  └─ image (image_url)
    └─ Status: Saves new user with 20 default credits
    
    B) USER.UPDATED
    ├─ Trigger: User updates profile info in Clerk
    ├─ Action: Sync changes to database
    ├─ Fields Updated:
    │  ├─ email
    │  ├─ name
    │  └─ image
    └─ Status: Updates existing user record
    
    C) USER.DELETED
    ├─ Trigger: User account deleted in Clerk
    ├─ Action: Remove user from database
    ├─ Cascade Effects: All related projects deleted
    └─ Status: Full user data cleanup
    
    D) PAYMENTATTEMPT.UPDATED
    ├─ Trigger: Subscription payment processed
    ├─ Charge Types: "recurring" or "checkout"
    ├─ Payment Status: "paid"
    ├─ Plan Validation:
    │  ├─ Allowed Plans: "pro" (80 credits) or "elite" (240 credits)
    │  └─ Invalid Plan: Returns 400 error
    ├─ Action on Success:
    │  ├─ Extracts planId from subscription items
    │  ├─ Maps plan to credit value
    │  └─ Increments user credits in database
    └─ Credit System:
       ├─ Pro: +80 credits per payment
       └─ Elite: +240 credits per payment


5. API ENDPOINTS
================================================================================

5.1 PUBLIC ENDPOINTS

    GET /
    ├─ Response: "Server is Live!"
    └─ Purpose: Health check


5.2 WEBHOOK ENDPOINT (No Auth Required)

    POST /api/clerk
    ├─ Authentication: Clerk signature verification
    ├─ Body Format: Raw JSON with Clerk signature headers
    └─ Response: {message: "Webhook Recieved: " + eventType}


5.3 PROTECTED ENDPOINTS

    PROJECT ROUTES (routes/projectRoutes.ts)
    
    POST /api/projects/create
    ├─ Authentication: @protect middleware (Clerk)
    ├─ Purpose: Create new advertisement project
    ├─ Body Parameters:
    │  ├─ name: String (project name)
    │  ├─ productName: String
    │  ├─ productDescription: String
    │  ├─ userPrompt: String
    │  ├─ aspectRatio: String (e.g., "9:16")
    │  └─ targetLength: Int (video length in seconds)
    └─ Response: Created project object with ID
    
    GET /api/projects
    ├─ Authentication: @protect middleware
    ├─ Purpose: Fetch all user's projects
    └─ Response: Array of user's project objects
    
    GET /api/projects/:id
    ├─ Authentication: @protect middleware
    ├─ Purpose: Get specific project details
    ├─ Params: id (project UUID)
    └─ Response: Project object with full details
    
    PUT /api/projects/:id/update
    ├─ Authentication: @protect middleware
    ├─ Purpose: Update project details
    ├─ Params: id (project UUID)
    ├─ Body: Partial project object (any updatable fields)
    └─ Response: Updated project object
    
    DELETE /api/projects/:id
    ├─ Authentication: @protect middleware
    ├─ Purpose: Delete project
    ├─ Params: id (project UUID)
    └─ Response: Deleted project object
    
    POST /api/projects/:id/publish
    ├─ Authentication: @protect middleware
    ├─ Purpose: Publish project (make public)
    ├─ Params: id (project UUID)
    └─ Response: Updated project with isPublished: true
    

    USER ROUTES (routes/userRoutes.ts)
    
    GET /api/users/me
    ├─ Authentication: @protect middleware
    ├─ Purpose: Get current authenticated user
    └─ Response: User object with credits, profile data
    
    PUT /api/users/me
    ├─ Authentication: @protect middleware
    ├─ Purpose: Update user profile
    ├─ Body: Partial user object (email, name, etc.)
    └─ Response: Updated user object
    
    GET /api/users/credits
    ├─ Authentication: @protect middleware
    ├─ Purpose: Check current credit balance
    └─ Response: {credits: Int}


6. FILE UPLOAD SYSTEM
================================================================================

6.1 MULTER CONFIGURATION (configs/multer.ts)
    - File upload middleware using Multer
    - Destination: ./uploads/ directory
    - File size limit: 25MB
    - Allowed MIME types: image/*
    - Field name: "file"
    - Single file upload per request
    - Error handling for oversized/invalid files


6.2 UPLOAD ENDPOINT (routes/projectRoutes.ts)

    POST /api/projects/:id/upload
    ├─ Authentication: @protect middleware
    ├─ Middleware: multer.single('file')
    ├─ Purpose: Upload advertisement images to project
    ├─ Params: id (project UUID)
    ├─ Body: FormData with file field
    ├─ File Validation:
    │  ├─ Type: Image files only
    │  ├─ Max Size: 25MB per file
    │  └─ Multiple uploads per project supported
    └─ Response: Updated project with new image in uploadedImages[]


6.3 IMAGE STORAGE
    - Location: server/uploads/ directory
    - Naming: Generated by Multer
    - Access: Via file path in uploadedImages array
    - Cleanup: Should implement deletion when project removed


7. ERROR HANDLING
================================================================================

6.1 CURRENT IMPLEMENTATION
    - Try/catch wrapper in webhook handler
    - 500 error for caught exceptions
    - Error message returned to client: {message: error.message}
    - Failed operations don't halt server


7. ERROR HANDLING
================================================================================

7.1 CURRENT IMPLEMENTATION
    - Try/catch wrapper in webhook handler
    - 500 error for caught exceptions
    - Error message returned to client: {message: error.message}
    - Failed operations don't halt server


7.2 RECOMMENDATIONS
    - Add specific error handling for each webhook type
    - Implement retry logic for failed DB operations
    - Log errors to monitoring system (e.g., Sentry)
    - Add validation for Clerk data payload
    - Handle null/undefined values in name concatenation


8. DATABASE MIGRATIONS
================================================================================

Location: prisma/migrations/

Current Migrations:
- 20260311083756_init: Initial schema setup (User, Project models)

Migration Lock: Enabled (prevents concurrent migrations)


9. PROJECT CONTROLLERS
================================================================================

9.1 PROJECT CONTROLLER (controllers/projectControllers.ts)
    
    Key Functions:
    
    createProject(req, res)
    ├─ Creates new project with user ID from auth context
    ├─ Initializes fields from request body
    ├─ Sets defaults: aspectRatio: "9:16", targetLength: 5
    └─ Returns created project with UUID
    
    getProjects(req, res)
    ├─ Fetches all projects for authenticated user
    ├─ Filters by userId from auth context
    └─ Returns array of user's projects
    
    getProjectById(req, res)
    ├─ Retrieves single project by ID
    ├─ Validates user ownership
    └─ Returns project with all details
    
    updateProject(req, res)
    ├─ Updates specified project fields
    ├─ Validates user ownership
    ├─ Updates: updatedAt timestamp automatically
    └─ Returns updated project object
    
    deleteProject(req, res)
    ├─ Removes project from database
    ├─ Validates user ownership
    ├─ Cascade delete protection via Prisma schema
    └─ Returns deleted project object
    
    publishProject(req, res)
    ├─ Sets isPublished flag to true
    ├─ Makes project discoverable/shareable
    └─ Returns updated project


9.2 USER CONTROLLER (controllers/userController.ts)
    
    Key Functions:
    
    getCurrentUser(req, res)
    ├─ Retrieves authenticated user profile
    ├─ Fetches from database by userId
    └─ Returns user with credits and profile data
    
    updateUser(req, res)
    ├─ Updates user profile fields
    ├─ Validates user ownership
    ├─ Updatable fields: email, name, image
    └─ Returns updated user object
    
    getUserCredits(req, res)
    ├─ Returns current credit balance
    ├─ Used by client to check generation quota
    └─ Format: {credits: Int}


10. DATABASE (Generated)
================================================================================

Generated Prisma Client Files (controllers/generated/prisma/):

browser.ts
├─ Prisma Client for browser environments
└─ Used for edge functions/middleware

client.ts
├─ Default Prisma Client for Node.js
└─ Primary ORM interface for server

commonInputTypes.ts
├─ Shared input types for Prisma queries
├─ Filter conditions, sort options
└─ Reusable type definitions

enums.ts
├─ Prisma enum types (SortOrder, etc.)
└─ Type-safe enumeration constants

models.ts
├─ Schema model definitions
├─ User and Project type definitions
└─ Complete type exports

models/Project.ts & models/User.ts
├─ Individual model type definitions
├─ Field specifications and relations
└─ Type imports for controllers


11. PROJECT FILE STRUCTURE SUMMARY
================================================================================

SERVER DIRECTORY OVERVIEW:

server/
├─ server.ts ........................ Main Express application entry point
├─ prisma.config.ts ................ Database configuration
├─ tsconfig.json ................... TypeScript configuration
├─ package.json .................... Dependencies & scripts
│
├─ configs/
│  ├─ prisma.ts ................... Prisma Client initialization
│  ├─ multer.ts ................... File upload middleware configuration
│  └─ instrument.mjs .............. Instrumentation config
│
├─ controllers/ .................... Business logic & request handlers
│  ├─ clerk.ts .................... Webhook event handlers
│  ├─ projectControllers.ts ........ Project CRUD operations
│  ├─ userController.ts ........... User profile & credits
│  └─ index.ts (implied) .......... Controller exports
│
├─ middlewares/ .................... Express middleware
│  └─ auth.ts ..................... Protect route authentication
│
├─ routes/ ......................... API route definitions
│  ├─ projectRoutes.ts ............ Project endpoints
│  ├─ userRoutes.ts ............... User endpoints
│  └─ index.ts (implied) .......... Route mounting
│
├─ prisma/
│  ├─ schema.prisma ............... Database schema definition
│  └─ migrations/ ................. Database migration history
│     └─ 20260311083756_init/ ..... Initial schema migration
│
├─ generated/
│  └─ prisma/ ..................... Auto-generated Prisma types
│     ├─ browser.ts, client.ts
│     ├─ models.ts, enums.ts
│     ├─ models/Project.ts, User.ts
│     └─ internal/ ................ Internal Prisma files
│
├─ types/
│  └─ express.d.ts ................ TypeScript type augmentation
│
└─ uploads/ (created at runtime) ... File storage directory


12. DEPLOYMENT REQUIREMENTS
================================================================================

Environment Variables (.env):
- DATABASE_URL: PostgreSQL connection string
- CLERK_WEBHOOK_SECRET: Clerk webhook signature key
- PORT: Server port (default: 5000)

Dependencies Installed:
- express: Web framework
- typescript: Type safety
- prisma: ORM & database client
- @clerk/clerk-sdk-node: Authentication
- multer: File upload handling
- cors: Cross-origin requests
- dotenv: Environment variables

Build & Run:
- Build: tsc (TypeScript compilation)
- Start: node dist/server.js
- Dev: npx ts-node server.ts (with ts-node-dev for auto-restart)


13. COMPLETION STATUS
================================================================================

✓ COMPLETED:
  ✓ Database schema (Prisma)
  ✓ Server initialization & middleware
  ✓ Clerk authentication & webhooks
  ✓ Project routes & controllers
  ✓ User routes & controllers
  ✓ File upload configuration (Multer)
  ✓ TypeScript configuration
  ✓ Database migration setup

🔄 IN PROGRESS:
  - Image processing pipeline
  - Video generation integration
  - Advanced error handling & logging

📋 TODO:
  - Request validation middleware
  - Rate limiting
  - API documentation (Swagger/OpenAPI)
  - Unit tests
  - Monitoring & logging setup


8. TYPE SYSTEM
================================================================================

8.1 CONFIGURATION TYPES (types/express.d.ts)
    - Extends Express Request with Clerk auth context
    - Type-safe authentication properties


8.2 GENERATED TYPES (generated/prisma/)
    - Auto-generated from schema.prisma
    - Prisma Client types for type safety
    - Model types: User, Project
    - Input types: CreateUserInput, UpdateUserInput, etc.


9. DEPLOYMENT READY FEATURES
================================================================================

✓ Environment variable support (.env)
✓ Database connection pooling (Prisma)
✓ TypeScript compilation
✓ Production-ready middleware
✓ Error catching at top level
✓ CORS configured
✓ Webhook signature verification


10. DEVELOPMENT WORKFLOW
================================================================================

10.1 SCRIPTS

    npm start
    - Single run with tsx compiler
    
    npm run server
    - Development with nodemon (auto-restart on file changes)
    
    npm run build
    - TypeScript compilation to JavaScript


10.2 DATABASE MANAGEMENT

    Generate Prisma Client:
    npx prisma generate
    
    Create migration:
    npx prisma migrate dev --name <migration_name>
    
    Run migrations:
    npx prisma migrate deploy
    
    View database:
    npx prisma studio


11. CURRENT IMPLEMENTATION STATUS
================================================================================

COMPLETED:
✓ Express server setup
✓ Prisma ORM integration
✓ Clerk webhook handling
✓ User lifecycle management (create, update, delete)
✓ Subscription/payment processing
✓ Credit system implementation
✓ Authentication middleware
✓ Database schema design
✓ TypeScript configuration


TODO / IMPROVEMENTS:
□ Add project CRUD endpoints
□ Implement video generation pipeline
□ Add image generation endpoints
□ Implement credit deduction logic
□ Add request validation middleware
□ Add pagination for querying
□ Add logging/monitoring
□ Add rate limiting
□ Add API documentation (Swagger/OpenAPI)
□ Add comprehensive error messages
□ Add user preferences/settings
□ Add analytics tracking


12. SECURITY CONSIDERATIONS
================================================================================

Current Measures:
- Clerk signature verification for webhooks
- JWT token validation via Clerk middleware
- CORS protection
- Database connection via secure ORM
- Environment variable for sensitive config

Recommended Enhancements:
- Add request validation schemas
- Implement rate limiting
- Add helmet.js for security headers
- Enable HTTPS in production
- Add SQL injection prevention (Prisma handles this)
- Add input sanitization
- Implement request logging for audit trail
- Add API key rotation for internal services


13. PERFORMANCE CONSIDERATIONS
================================================================================

Current Setup:
- Prisma handles connection pooling
- PostgreSQL optimized queries
- Webhook batching via Clerk

Optimization Opportunities:
- Add Redis caching for frequently accessed data
- Implement database indexing on common queries
- Add response compression
- Implement pagination for large datasets
- Cache user credits calculations
- Consider read replicas for scaling


14. MONITORING & LOGGING
================================================================================

Current:
- console.log in payment processing
- Error logging via catch blocks

Recommended Setup:
- Centralized logging (Winston, Pino)
- Error tracking (Sentry, LogRocket)
- Performance monitoring (New Relic, DataDog)
- Database query logging
- Webhook delivery tracking


================================================================================
                                 END OF PRESENTATION
================================================================================
