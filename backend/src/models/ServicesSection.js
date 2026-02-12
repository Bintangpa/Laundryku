const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const ServicesSection = sequelize.define('ServicesSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section_title_highlight: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section_subtitle: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'services_section',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ServicesItem = sequelize.define('ServicesItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  icon_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'services_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Association
ServicesSection.hasMany(ServicesItem, { foreignKey: 'section_id', as: 'items' });
ServicesItem.belongsTo(ServicesSection, { foreignKey: 'section_id', as: 'section' });

module.exports = { ServicesSection, ServicesItem };