const express = require('express');
const adminRoute = express.Router();
const adminAuth = require('../middleware/adminAuth');
const userModel = require('../Model/userModel');

// ============================================
// ADMIN USERS MANAGEMENT CRUD OPERATIONS
// ============================================

// GET - Retrieve all users
adminRoute.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    res.json({
      message: 'Users retrieved successfully',
      status: 200,
      data: users,
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error retrieving users',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
});

// GET - Retrieve specific user by ID
adminRoute.get('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        status: 404,
        success: false,
        error: true
      });
    }
    res.json({
      message: 'User retrieved successfully',
      status: 200,
      data: user,
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error retrieving user',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
});

// POST - Create new user (Admin only)
adminRoute.post('/admin/users', adminAuth, async (req, res) => {
  try {
    const { name, email, phone, password, country, role } = req.body;

    if (!name || !password || !country) {
      return res.status(400).json({
        message: 'Name, password, and country are required',
        status: 400,
        success: false,
        error: true
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        message: 'Either email or phone is required',
        status: 400,
        success: false,
        error: true
      });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      country,
      role: role || 'client'
    });

    const result = await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      status: 201,
      data: result,
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error creating user',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
});

// PUT - Update user
adminRoute.put('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, phone, country, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;
    if (role) updateData.role = role;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
        status: 404,
        success: false,
        error: true
      });
    }

    res.json({
      message: 'User updated successfully',
      status: 200,
      data: updatedUser,
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error updating user',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
});

// DELETE - Delete user
adminRoute.delete('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found',
        status: 404,
        success: false,
        error: true
      });
    }

    res.json({
      message: 'User deleted successfully',
      status: 200,
      data: deletedUser,
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error deleting user',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
});

// GET - Get admin dashboard stats
adminRoute.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const adminCount = await userModel.countDocuments({ role: 'ADMIN' });
    const clientCount = await userModel.countDocuments({ role: 'client' });
    const influencerCount = await userModel.countDocuments({ role: 'influencer' });

    res.json({
      message: 'Stats retrieved successfully',
      status: 200,
      data: {
        totalUsers,
        adminCount,
        clientCount,
        influencerCount
      },
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error retrieving stats',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
});

module.exports = adminRoute;

