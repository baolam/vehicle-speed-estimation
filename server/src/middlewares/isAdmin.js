function isAdmin(req, res, next) {
  const role = req.infor.role;

  if (role === "admin") {
    next();
  } else {
    res
      .status(403)
      .send({ message: "You don't have permission to access this route" });
  }
}

module.exports = isAdmin;
