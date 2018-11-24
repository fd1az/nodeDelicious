const mongoose = require('mongoose');
const Store = mongoose.model('Store');


exports.homePage = (req, res)=>{
    console.log(req.name);
    res.render('index');
}

exports.addStore = (req,res) => {
    res.render('editStore',{title:'Add Store'})
}

exports.createStore = async (req,res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
    res.redirect(`/store/${store.slug}`);    
}

exports.getStores = async (req,res) =>{
    // Query the database for a list of stores
    const stores = await Store.find()
    res.render('stores', {title:'Stores', stores})
}

exports.editStore = async(req,res)=>{
    //find the store given the ID --> el id esta en los params probalo en res.json(req.params)  
    const store = await Store.findOne({_id: req.params.id});
    //confirm  they are the owner of the store
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
