import Perfume from "../models/perfume-model.js";


export const createPerfume = async (req, res) => {
    const { name, price, quantity, description, imageUrl } = req.body;

    try {
        const existingPerfume = await Perfume.findOne({ name });
        if (existingPerfume) {
            return res.status(400).json({ message: 'Perfume already exists' });
        }

        const newPerfume = new Perfume({
            name,
            price,
            quantity,
            description,
            imageUrl
        });

        await newPerfume.save();

        res.status(201).json({ message: 'Perfume created successfully', perfume: newPerfume });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// get all prefume
export const getAllPerfume = async (_req, res) => {
    console.log("get all perfume!!!!!!!!!!!!!!!!");
    try {
        const perfumes = await Perfume.find();
        // console.log(perfumes);
        res.status(200).json({ perfumes });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};


