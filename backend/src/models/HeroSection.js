const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const HeroSection = sequelize.define('HeroSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  badge_text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title_highlight: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  placeholder_text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  button_text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hint_text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tips_text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'hero_section',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = HeroSection;