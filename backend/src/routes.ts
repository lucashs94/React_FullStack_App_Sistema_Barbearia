import express, { Router, Response, Request } from "express"

import { CreateUserController } from "./controllers/user/CresteUserController"
import { AuthUserController } from "./controllers/user/AuthUserController"
import { DetailUserController } from "./controllers/user/DetailUserController"
import { UpdateUserController } from "./controllers/user/UpdateUserController"

import { CreateHaircutController } from "./controllers/haircut/CresteHaircutController"
import { ListHaircutController } from "./controllers/haircut/ListHaircutController"
import { UpdateHaircutController } from "./controllers/haircut/UpdateHaircutController"
import { CheckHaircutController } from "./controllers/haircut/CheckHaircutController"
import { CountHaircutController } from "./controllers/haircut/CountHaircutController"
import { DetailHaircutController } from "./controllers/haircut/DetailHaircutController"

import { NewScheduleController } from "./controllers/schedule/NewScheduleController"
import { ListScheduleController } from "./controllers/schedule/ListScheduleController"
import { FinishScheduleController } from "./controllers/schedule/FinishScheduleController"

import { SubscribeController } from "./controllers/subscriptions/SubscribeController"
import { WebhooksController } from "./controllers/subscriptions/WebhooksController"
import { CreatePortalController } from "./controllers/subscriptions/CreatePortalController"

import { isAuthenticated } from "./middlewares/isAuthenticated"


export const router = Router()


// USERS
router.post('/users', new CreateUserController().handle)
router.post('/users/auth', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.put('/users', isAuthenticated, new UpdateUserController().handle)


// HAIRCUTS
router.post('/haircut', isAuthenticated, new CreateHaircutController().handle)
router.get('/haircuts', isAuthenticated, new ListHaircutController().handle)
router.put('/haircut', isAuthenticated, new UpdateHaircutController().handle)
router.get('/haircuts/check', isAuthenticated, new CheckHaircutController().handle)
router.get('/haircuts/count', isAuthenticated, new CountHaircutController().handle)
router.get('/haircuts/detail', isAuthenticated, new DetailHaircutController().handle)


// SCHEDULE
router.post('/schedule', isAuthenticated, new NewScheduleController().handle)
router.get('/schedule', isAuthenticated, new ListScheduleController().handle)
router.put('/schedule', isAuthenticated, new FinishScheduleController().handle)


// SUBSCRIPTIONS
router.post('/subscribe', isAuthenticated, new SubscribeController().handle)
router.post('/webhooks', express.raw({ type: 'application/json' }), new WebhooksController().handle)
router.post('/create-portal', isAuthenticated, new CreatePortalController().handle)