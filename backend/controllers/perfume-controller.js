import Perfume from "../models/perfume-model.js";


// create perfume
export const createPerfume = async (req, res) => {
    const { name, price, quantity, description, imageUrl } = req.body;

    // console.log("Creating new perfume");
    try {
        // Check if perfume exists
        const existingPerfume = await Perfume.findOne({ name });
        if (existingPerfume) {
            return res.status(400).json({ message: 'Perfume already exists' });
        }
        // console.log("Creating new perfume");
        const newPerfume = new Perfume({
            name,
            price,
            quantity,
            description,
            imageUrl
        });
        
        await newPerfume.save();
        // console.log("Perfume created successfully");

        res.status(201).json({ message: 'Perfume created successfully', perfume: newPerfume });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// get all prefume
export const getAllPerfume = async (_req, res) => {

    try {
        // console.log("Getting all perfumes");
        const perfumes = await Perfume.find();
        // console.log(perfumes);
        res.status(200).json({ perfumes });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};


