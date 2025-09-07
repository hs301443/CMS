import { Router } from "express";
import authRouter from "./auth";
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";
import PlansRouter from "./plans";
import PaymentMethodRouter from "./payment_method";
import  SubscriptionRouter  from "./subscriptions";
import  ActivitiesRouter  from "./activities";
export const route = Router();

route.use("/auth", authRouter);
route.use(authenticated, authorizeRoles("admin"));
route.use("/plans", PlansRouter);
route.use("/payment-method", PaymentMethodRouter);
route.use("/subscriptions", SubscriptionRouter);
route.use("/activities", ActivitiesRouter);
export default route;