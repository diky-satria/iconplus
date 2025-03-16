const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "welcome to app" });
});
const authRouter = require("./routes/AuthRoutes.js");
const userRouter = require("./routes/UserRoutes/UserRoutes.js");
const meetingRouter = require("./routes/MeetingRoutes/MeetingRoutes.js");
const dashboardRouter = require("./routes/DashboardRoutes/DashboardRoutes.js");
app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", meetingRouter);
app.use("/api/v1", dashboardRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
