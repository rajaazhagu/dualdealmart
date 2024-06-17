const User = require("../models/Usermodel")
const bcryptjs = require("bcryptjs")
const List = require("../models/Listmodel")
const user =(async(req,res)=>{
  try {
    const {name,email,password,photo} = req.body
    const hashesPassword = bcryptjs.hashSync(password,10)
    const sign = await User.findOne({name:name})
    const pass = await User.findOne({email:email})
    if(sign||pass){
        res.json("no")
    }
    else{
        const newUser = new User({name,email,password:hashesPassword,photo})
        await newUser.save()
        res.json("user")
    }
   
  } catch (error) {
    res.status(500).json(error)
  }
})

const userSignin =(async(req,res)=>{
    try{
    const {email,password} = req.body
    const username = await User.findOne({email:email})
    if(username){
   const validPassword = bcryptjs.compareSync(password,username.password)
   
    if(username.email==email && validPassword){
        res.json("success")
    }
    else if(!validPassword){
        res.json("wrong password")
    }
   }
    else{
        res.json("no")
    }
    }
    catch(error){
       console.log(error)
    }
})

const userGoogle =(async(req,res)=>{
  const {name,email} = req.body
  const user = await User.findOne({email:email})
  if(user){
    res.json("ok")
  }
  else{
    res.json("no")
  }
})

const userAuth = (async(req,res)=>{
  const {name,email,photo} = req.body
  const user = await User.findOne({email:email})
  if(user){
    res.json("no")
  }
  else{
    const data = new User({name,email,photo})
    await data.save()
    res.json("ok")
  }

})

const userGet =(async(req,res)=>{
    const {email} =req.body
    const data = await User.findOne({email:email})
    res.json(data)
})

const userUpdate=(async(req,res)=>{
  const { name, email, password, photo,oldmail } = req.body;
  

  try {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const updateResult = await User.updateOne(
          { email: oldmail },
          { $set: { name: name, email: email, password: hashedPassword, photo: photo}}
      );
  
      if (updateResult.nModified === 0) {
          // This means no documents were updated
          console.log('No documents matched the query. Update failed.');
          res.status(404).json('No matching document found to update.');
      } else {
          // Document was updated
          res.json('updated');
      }
  } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json(error);
  }
  

})

const userDelete =(async(req,res)=>{
  const {email}= req.body
   try {
    await User.deleteOne({email:email})
    res.json('deleted')
   } catch (error) {
     res.json(error)
   }
})

const createList =(async(req,res)=>{
  const {email,name,description,address,type,offer,price,discountprice,imageURLs,phone}=req.body
  const listCreate = new List({email,name,description,address,type,offer,price,discountprice,imageURLs,phone})
  await listCreate.save()
  res.json('created')
})

const getList = async (req, res) => {
  try {
    const lists = await List.find({});

    res.status(200).json({ success: true, data: lists });
  } catch (error) {

    res.status(500).json({ success: false, message: 'An error occurred while fetching the lists', error: error.message });
  }
};

const deleteList=(async(req,res)=>{
    const {id} =req.body
    await List.deleteOne({_id:id})
    res.json('deleted')
})

const payMonth =(async(req,res)=>{
  const {email,date,month,year} =req.body
  try {
    const data = await User.findOne({email:email})
    if(data){
      await User.updateOne({email:email},{$set:{date:date,month:month,year:year}})
      res.json('paid')
    }
  } catch (error) {
    console.log(error)
  }
})

/*const countUpdate=(async(req,res)=>{
  const {count,email} = req.body
  try {
   await User.updateOne({email:email},{$set:{count:count}})
   res.json('count update')

  } catch (error) {
    console.log('error')
  }
})*/

const reviewUpdate =(async(req,res)=>{
  const {review,userEmail,id} =req.body
  try {
    await List.updateOne({_id:id},{$set:{rating:review,userEmail:userEmail}})
    res.json('review')
  } catch (error) {
    console.log('error')
  }
})
const TotalReview =(async(req,res)=>{
  const {total,id} =req.body
  try {
    await List.updateOne({_id:id},{$set:{totalReview:total}})
  } catch (error) {
    console.log('error')
  }
})


module.exports ={user,userSignin,userGoogle,userAuth,userGet,userUpdate,userDelete,createList,getList,deleteList,payMonth,countUpdate,reviewUpdate,TotalReview}