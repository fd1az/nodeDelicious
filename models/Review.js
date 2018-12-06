const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //definimos es6 promise

const reviewSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
      },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must to supply an author!'
    },
    store:{
        type:mongoose.Schema.ObjectId,
        ref: 'Store',
        required: 'You must to supply a store!'
    },
    text:{
        type: String,
        required: 'You must to supply a text!'
    },
    rating:{
        type: Number,
        min: 0,
        max: 5
    }

})

function autopopulate(next) {
    this.populate('author');
    next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review' , reviewSchema);