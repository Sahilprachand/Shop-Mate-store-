// this route exists purely so the frontend can check "is this password
// correct?" without needing to fetch real data. requireAdmin middleware
// does all the actual checking - if the request reaches this handler,
// the password was already valid.
export const verifyAdmin = (req, res) => {
  res.status(200).json({ success: true, message: "Admin verified" });
};
