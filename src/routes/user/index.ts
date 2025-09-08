import { Router } from "express";
import AuthRoute from "./auth/index";
import PlaneRouter from "./plans";
import  PaymentMethodRouter from "./payment_method";
import  SubscriptionRouter  from "./subscriptions";
import  ActivitiesRouter  from "./activities";
import TemplatesRouter from './template'
import PaymentsRouter from "./payments";
const route = Router();
route.use("/auth", AuthRoute);
route.use("/plans", PlaneRouter);
route.use("/payment-method", PaymentMethodRouter);
route.use("/subscriptions", SubscriptionRouter);
route.use("/activities", ActivitiesRouter);
route.use("/templates",TemplatesRouter)
route.use("/payments", PaymentsRouter);
export default route;

