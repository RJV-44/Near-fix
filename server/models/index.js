const User = require('./User')
const Service = require('./Service')
const Booking = require('./Booking')
const Review = require('./Review')
const Payment = require('./Payment')
const Notification = require('./Notification')
const Favorite = require('./Favorite')
const Category = require('./Category')
const Payout = require('./Payout')

// User associations
User.hasMany(Service, { foreignKey: 'providerId', as: 'services' })
User.hasMany(Booking, { foreignKey: 'customerId', as: 'customerBookings' })
User.hasMany(Booking, { foreignKey: 'providerId', as: 'providerBookings' })
User.hasMany(Review, { foreignKey: 'customerId', as: 'customerReviews' })
User.hasMany(Review, { foreignKey: 'providerId', as: 'providerReviews' })
User.hasMany(Payment, { foreignKey: 'customerId', as: 'customerPayments' })
User.hasMany(Payment, { foreignKey: 'providerId', as: 'providerPayments' })
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' })
User.hasMany(Favorite, { foreignKey: 'customerId', as: 'favorites' })
User.hasMany(Payout, { foreignKey: 'providerId', as: 'payouts' })

Service.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoryRef' })
Service.belongsTo(User, { foreignKey: 'providerId', as: 'provider' })

// Booking associations
Booking.belongsTo(User, { foreignKey: 'customerId', as: 'customer' })
Booking.belongsTo(User, { foreignKey: 'providerId', as: 'provider' })
Booking.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' })
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' })

// Review associations
Review.belongsTo(User, { foreignKey: 'customerId', as: 'customer' })
Review.belongsTo(User, { foreignKey: 'providerId', as: 'provider' })
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })
Review.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' })

// Payment associations
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })
Payment.belongsTo(User, { foreignKey: 'customerId', as: 'customer' })
Payment.belongsTo(User, { foreignKey: 'providerId', as: 'provider' })

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Favorite associations
Favorite.belongsTo(User, { foreignKey: 'customerId', as: 'customer' })
Favorite.belongsTo(User, { foreignKey: 'providerId', as: 'provider' })

// Payout associations
Payout.belongsTo(User, { foreignKey: 'providerId', as: 'provider' })

// Category associations
Category.hasMany(Service, { foreignKey: 'categoryId', as: 'services' })



module.exports = { User, Service, Booking, Review, Payment, Notification, Favorite, Category, Payout }

