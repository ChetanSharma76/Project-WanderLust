const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

let mongoUrl='mongodb://127.0.0.1:27017/wanderlust'

main()
.then(()=>{
    console.log('Connected to DB');
})
.catch((err)=>{
    console.log(err);
});

//creating db

async function main(){
    await mongoose.connect(mongoUrl);
}


const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner: '6695086a3a98da1888d734f8'}));
    await Listing.insertMany(initData.data);
    console.log('data was initialized');
};

initDB();