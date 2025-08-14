const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['Container Ship', 'Bulk Carrier', 'Tanker', 'Passenger Ship', 'Fishing Vessel', 'Other']
  },
  capacity: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Maintenance', 'Docked', 'Out of Service'],
    default: 'Active'
  },
  specifications: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    draft: { type: Number, min: 0 },
    yearBuilt: { type: Number, min: 1900, max: new Date().getFullYear() },
    flag: String,
    homePort: String
  },
  crew: {
    captain: String,
    totalCrew: { type: Number, min: 1 },
    requiredCrew: { type: Number, min: 1 }
  },
  location: {
    currentPort: String,
    nextPort: String,
    estimatedArrival: Date,
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 }
    }
  },
  maintenance: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceHistory: [{
      date: Date,
      type: String,
      description: String,
      cost: { type: Number, min: 0 }
    }]
  },
  // Calculated fields
  efficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  operationalDays: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate efficiency based on crew and maintenance
shipSchema.methods.calculateEfficiency = function() {
  let efficiency = 100;
  
  // Reduce efficiency if crew is below required
  if (this.crew.totalCrew < this.crew.requiredCrew) {
    efficiency -= 20;
  }
  
  // Reduce efficiency if maintenance is overdue
  if (this.maintenance.nextMaintenance && new Date() > this.maintenance.nextMaintenance) {
    efficiency -= 30;
  }
  
  // Reduce efficiency if ship is not active
  if (this.status !== 'Active') {
    efficiency -= 50;
  }
  
  return Math.max(0, efficiency);
};

// Calculate operational days (days since last maintenance)
shipSchema.methods.calculateOperationalDays = function() {
  if (!this.maintenance.lastMaintenance) return 0;
  
  const lastMaintenance = new Date(this.maintenance.lastMaintenance);
  const now = new Date();
  const diffTime = Math.abs(now - lastMaintenance);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Pre-save middleware to calculate fields
shipSchema.pre('save', function(next) {
  this.efficiency = this.calculateEfficiency();
  this.operationalDays = this.calculateOperationalDays();
  next();
});

// Index for better query performance
shipSchema.index({ name: 1 });
shipSchema.index({ type: 1 });
shipSchema.index({ status: 1 });
shipSchema.index({ 'location.currentPort': 1 });
shipSchema.index({ efficiency: -1 });

module.exports = mongoose.model('Ship', shipSchema); 