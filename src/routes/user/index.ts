import { Router } from "express";
import AuthRoute from "./auth/index";
import PlaneRouter from "./plans";
import  PaymentMethodRouter from "./payment_method";
import  SubscriptionRouter  from "./subscriptions";
import  ActivitiesRouter  from "./activities";

const route = Router();
route.use("/auth", AuthRoute);
route.use("/plans", PlaneRouter);
route.use("/payment-method", PaymentMethodRouter);
route.use("/subscriptions", SubscriptionRouter);
route.use("/activities", ActivitiesRouter);
export default route;

