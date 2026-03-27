# Cloudinary Avatar Upload \+ ProfilePage SCSS Refactor
## Problem
* No image upload exists and avatars currently fall back to `ui-avatars.com`
* Profile picture cannot be changed by any user role
* `frontend/src/pages/Dashboard/profile/ProfilePage.jsx` heavily breaks your rules with inline styles, hardcoded colors, mixed spacing values, and inconsistent dashboard UI patterns
* Old uploaded images are not deleted because Cloudinary integration does not exist yet
## Current State
User profile data is stored in `backend/src/models/userModel.js` with `avatar` URL support, and profile editing is handled by `backend/src/controllers/userController/updateMe.js` plus `frontend/src/services/userApi.js`\. The visible avatar is reused in `frontend/src/pages/Dashboard/profile/ProfilePage.jsx` and `frontend/src/pages/Dashboard/DashboardLayout.jsx`\. A proven Cloudinary pattern already exists in `../NFCWALA/backend/src/config/cloudinary.js` and `../NFCWALA/backend/src/middleware/cloudinaryUpload.js`, including upload and old\-image deletion logic\.
## Proposed Changes
Implement Cloudinary\-backed avatar upload as the first image pipeline and refactor the dashboard profile UI to comply with your rules\.
Backend changes:
* Add Cloudinary config in `backend/src/config/cloudinary.js`
* Add upload helpers in `backend/src/middlewares/uploadMiddleware.js` using multer memory storage and Cloudinary upload/delete helpers
* Extend `backend/src/config/config.js` and `.env.example` with `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`
* Extend `backend/src/models/userModel.js` with `avatarPublicId` so old files can be deleted on replace/remove
* Add `backend/src/controllers/userController/uploadAvatar.js` for upload \+ replace flow
* Add `backend/src/controllers/userController/removeAvatar.js` for avatar removal \+ Cloudinary delete
* Expose `POST /users/me/avatar` and `DELETE /users/me/avatar` in `backend/src/routes/userRoutes.js`
Frontend changes:
* Add `uploadAvatar` and `removeAvatar` mutations to `frontend/src/services/userApi.js`
* Refactor `frontend/src/pages/Dashboard/profile/ProfilePage.jsx` to add change/remove photo actions and remove inline styles
* Add `frontend/src/pages/Dashboard/profile/ProfilePage.scss` and move all static styling there using CSS variables and approved spacing scale
* Update Redux user state immediately after avatar changes so sidebar/topbar refresh without waiting
Upload behavior:
* Accept image uploads only
* Convert uploaded avatar to WebP in Cloudinary
* Store under `kaamsetu/avatars`
* Delete old Cloudinary image when a new avatar replaces it
* Delete Cloudinary image when avatar is removed
First usage scope:
* Profile picture for all dashboard roles
* Reflected in Profile page, sidebar user card, and topbar avatar
After this first step, I can inspect the remaining dashboard pages one by one and suggest the next UI cleanup targets based on your rules checklist\.