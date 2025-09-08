import { Router } from "express";
import authRouter from "./auth";
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";
import PlansRouter from "./plans";
import PaymentMethodRouter from "./payment_method";
import  SubscriptionRouter  from "./subscriptions";
import  ActivitiesRouter  from "./activities";
import TemplateRouter from './template'
import PaymentRouter from "./payments";
export const route = Router();

route.use("/auth", authRouter);
route.use(authenticated, authorizeRoles("admin"));
route.use("/plans", PlansRouter);
route.use("/payment-method", PaymentMethodRouter);
route.use("/subscriptions", SubscriptionRouter);
route.use("/activities", ActivitiesRouter);
route.use("/templates",TemplateRouter)
route.use("/payments", PaymentRouter);
export default route;