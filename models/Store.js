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
    tags:[String],
    created:{
        type:Date,
        default: Date.now
    },
    location:{
        type:{
            type:String,
            default: 'Point'
        },
        coordinates:[
            {
                type:Number,
                required:'You must supply coodinates'
            }
        ],
        address:{
            type:String,
            required:'You must supply address'
        }
    }

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