import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mood from '../models/mood.model.js';
import { MODE_TYPE } from '../constants/builder.constants.js';

dotenv.config();

const moods = [
    "Romantic Nostalgia",
    "Adventure Chronicles",
    "Whimsical Botanicals",
    "Steampunk Relics",
    "Victorian Whispers",
    "Shabby Chic Dreams",
    "Academia Secrets",
    "Gothic Elegance",
    "Timeless Treasures",
    "Enchanted Garden",
    "Retro Reverie",
    "Bohemian Wanderlust",
    "Forgotten Memories",
    "Vintage Romance",
    "Celestial Dreams",
    "4o mini"
];

const seedSingleMoodDocument = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Mood.deleteOne({ name: 'moods' });

        const values = moods.map((moodName) => ({
            value: moodName,
            type: MODE_TYPE.DEFAULT
        }));

        const moodDoc = {
            name: 'moods',
            values
        };

        await Mood.create(moodDoc);

        console.log('Seeded moods in  document.');
        process.exit();
    } catch (err) {
        console.error('Failed to seed moods:', err);
        process.exit(1);
    }
};

seedSingleMoodDocument();
