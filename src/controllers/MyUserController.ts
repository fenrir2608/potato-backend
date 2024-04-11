import {Request, Response} from 'express';
import User from '../models/user';

const getCurrentUser = async (req:Request,res: Response) => {
    try {
       const currentUser = await User.findOne({_id: req.userId});
       if(!currentUser){
        return res.status(404).json({message: "user not found"});
       }
       res.json(currentUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "something went wrong."})
    }    
}

const createCurrentUser = async (req: Request, res: Response)=>{
//check if user exists
try {
    const {auth0Id} = req.body;
    const existingUser = await User.findOne({auth0Id});
    if(existingUser){
        return res.status(200).send();
    }
//create user if doesnt exist
    const newUser = new User(req.body);
    await newUser.save();
//return user obj to calling client
    res.status(201).json(newUser.toObject());

} catch (error) {
    console.log(error);
    res.status(500).json({message: "error creating user"})
}

};

const updateCurrentUser = async (req: Request, res: Response)=>{
    
    try {
        const {name,address,country,city} = req.body;
        const user = await User.findById(req.userId);
        
        if(!user){
            return res.status(404).json({message: "user not found"});
        }

        user.name = name;
        user.address = address;
        user.city = city;
        user.country = country;

        await user.save();
        res.send(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error updating user"})
    };
};

export default {createCurrentUser,updateCurrentUser,getCurrentUser};