const express = require("express");

const Router = express.Router();
const UserController = require("../controllers/UserController");
const userController = new UserController();

const isAdmin = require("../middlewares/isAdmin");
const authenticate = require("../middlewares/authenticate");

/// Lấy toàn bộ danh sách người dùng
/// Chức năng của Admin
Router.get("/all", authenticate, isAdmin, userController.getAllUsers);

/// Gán vai trò cho người dùng
/// Chức năng của Admin
Router.put("/role", authenticate, isAdmin, userController.assignRole);

/// Tiến hành lấy thông tin người dùng
Router.get("/", authenticate, userController.getUserInfo);

/// Lấy chi tiết thông tin người dùng
Router.get("/detail", authenticate, userController.getDetail);

/// Đăng nhập
/// Chức năng chung
Router.post("/login", userController.logIn);

/// Đăng ký
/// Chức năng chung
Router.post("/register", userController.register);

module.exports = Router;
