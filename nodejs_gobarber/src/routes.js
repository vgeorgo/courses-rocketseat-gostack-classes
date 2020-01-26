import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailabilityController from './app/controllers/AvailabilityController';

import appMiddleware from './app/middlewares/app';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// App variables
routes.use(appMiddleware);

// Users
routes.post('/users', UserController.store);
// Sessions
routes.post('/sessions', SessionController.store);

// ################
// Token
routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);

// Providers
routes.get('/providers', ProviderController.index);
routes.get('/providers/:id/available', AvailabilityController.index);

// Appointments
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

// Schedule
routes.get('/schedule', ScheduleController.index);

// Notifications
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// Files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
