const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //definimos es6 promise
const slug = require('slugs');

//Nuestro esquema
const storeSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true, //esto va a limpiar los datos en blanco
        required: 'Please enter de store name'
    },
    slug: String,
    description:{
        type: String,
        trim: true
    },
    tags:[String]

});

storeSchema.pre('save', function(next){
    if(!this.isModified('name')){
        next();//skip it (salimos)
        return; //stop the function
    }
    this.slug = slug(this.name);
    next()
})

//exportamos el objeto
module.exports = mongoose.model('Store',storeSchema);