import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Apply JSON parsing to all routes EXCEPT the CashFree webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/order/verify/cashfree") {
    next();
  } else {
    express.json({ limit: "16kb" })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// import routes
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import categoryRouter from "./routes/category.routes";
import productRouter from "./routes/product.routes";
import reviewRouter from "./routes/review.routes";
import cartRouter from "./routes/cart.routes";
import addressRouter from "./routes/address.routes";
import orderRouter from "./routes/order.routes";
import bannerRouter from "./routes/banner.routes";

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/banner", bannerRouter);

export { app };
