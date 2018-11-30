const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req,file,next){
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto){
            next(null,true);
        }else{
            next({message: 'That filetype isn\'t allowed!'}, false);
        }
    }
} 


exports.homePage = (req, res)=>{
    console.log(req.name);
    res.render('index');
}

exports.addStore = (req,res) => {
    res.render('editStore',{title:'Add Store'})
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req,res,next) =>{
    //check if there is no new file resize
    if(!req.file){
        next(); //skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    //once we have written the photo to our file system, keep goin!
    next();
    
}

exports.createStore = async (req,res) => {
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
    res.redirect(`/store/${store.slug}`);    
}

exports.getStores = async (req,res) =>{
   
    // Query the database for a list of stores
    const stores = await Store.find()
    res.render('stores', {title:'Stores', stores})
}

const confirmOwner = (store,user)=>{
    if(!store.author.equals(user._id)){
        throw Error('You must own store in order to edit it!');
    }
}

exports.editStore = async(req,res)=>{
    //find the store given the ID --> el id esta en los params probalo en res.json(req.params)  
    const store = await Store.findOne({_id: req.params.id});
    //confirm  they are the owner of the store
    confirmOwner(store,req.user);
    //render out the edit form so the user can update their store
    res.render('editStore', {title:`Edit ${store.name}`, store})
}
exports.updateStore = async (req, res) =>{
    //set the location data to be point
    req.body.location.type = 'Point';
    //find and update the store
    const store = await Store.findOneAndUpdate({_id: req.params.id},req.body,{
        new:true,// return the new store instead of the old store
        runValidators:true,
    }).exec();
    req.flash('success',`Successfully updated <strong>${store.name}</strong>. <a href="/store/${store.slug}">View Store-></a>`)
    //rediceted them the store and tell them it worked
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async(req, res, next)=>{
    const store = await Store.findOne({slug: req.params.slug}).populate('author')
    if(!store) return next()
    res.render('store', {store, title:store.name});
}

exports.getStoreByTag = async (req, res)=>{
    const tag = req.params.tag
    const tagQuery = tag || {$exists: true};

    //Lanzo dos promesas al mismo tiempo
    const tagsPromise =  Store.getTagsList();
    const storePromise = Store.find({tags: tagQuery})
    //Espero a que las dos terminen y hacemos destruicturing
    const [tags,stores] = await Promise.all([tagsPromise,storePromise]);

    res.render('tags',{tags, title: 'Tags', tag,stores})

}