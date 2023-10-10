// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Use middleware to parse JSON bodies
app.use(bodyParser.json());

// Sequelize setup for database connection
const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres', // Choose your database dialect
  logging: false,
});

// Define the Users model
const User = sequelize.define('User', {
  user_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  user_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_image: {
    type: Sequelize.STRING,
  },
  total_orders: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  last_logged_in: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Hash user password before saving to the database
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.user_password = await bcrypt.hash(user.user_password, salt);
});

// API to insert a new user
app.post('/insert', async (req, res) => {
  try {
    // Use authentication middleware here if needed
    // ...

    const newUser = req.body;
    await User.create(newUser);

    res.json({ success: true, message: 'User inserted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error inserting user', error });
  }
});

// API to update user details
app.put('/update', async (req, res) => {
  try {
    // Use authentication middleware here if needed
    // ...

    const updatedDetails = req.body;
    await User.update(updatedDetails, { where: { user_id: updatedDetails.user_id } });

    res.json({ success: true, message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user details', error });
  }
});

// API to fetch user details
app.get('/details/:user_id', async (req, res) => {
  try {
    // Use authentication middleware here if needed
    // ...

    const user = await User.findOne({ where: { user_id: req.params.user_id } });
    res.json({ success: true, user_details: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user details', error });
  }
});

// API to delete user
app.delete('/delete/:user_id', async (req, res) => {
  try {
    // Use authentication middleware here if needed
    // ...

    await User.destroy({ where: { user_id: req.params.user_id } });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user', error });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
