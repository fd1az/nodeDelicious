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
    },
    photo: String,
    author:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: 'You must supply an author'
    }

});

storeSchema.pre('save', async function(next){
    if(!this.isModified('name')){
        next();//skip it (salimos)
        return; //stop the function
    }
    this.slug = slug(this.name);
    //find other stores that have a slug of facu, facu1, facu2 
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    //this.constructor = Store -- cuando ese modelo sea creado
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if(storesWithSlug.length) {
      this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next()
})

storeSchema.statics.getTagsList = function(req,res){
    return this.aggregate([
        {$unwind:'$tags'},
        {$group:{_id:'$tags',count:{$sum:1}}},
        {$sort: {count:-1}}
    ])
}


//exportamos el objeto
module.exports = mongoose.model('Store',storeSchema);