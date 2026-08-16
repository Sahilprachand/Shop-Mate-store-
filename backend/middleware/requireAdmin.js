// simple shared-secret admin gate — good enough for a single-owner store
// without building a full user accounts system. The server checks this on
// every protected request, so hiding/knowing the URL alone isn't enough.
export const requireAdmin = (req, res, next) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({
      success: false,
      message: "Admin panel is not configured on the server yet. Set ADMIN_PASSWORD in .env",
    });
  }

  const key = req.headers["x-admin-key"];

  if (!key || key !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid admin password" });
  }

  next();
};
