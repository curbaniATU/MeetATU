import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

const avatarOptions = [
    { filename: "black.png", source: require('../assets/Avatars/black.png') },
    { filename: "blueCowboy.png", source: require('../assets/Avatars/blueCowboy.png') },
    { filename: "greenCowboy.png", source: require('../assets/Avatars/greenCowboy.png') },
    { filename: "pinkTiara.png", source: require('../assets/Avatars/pinkTiara.png') },
    { filename: "red.png", source: require('../assets/Avatars/red.png') },
    { filename: "tealTiara.png", source: require('../assets/Avatars/tealTiara.png') }
];

export const useAvatar = (avatar) => {
    console.log(avatarOptions[avatar])
    const matchedAvatar = avatarOptions.find(a => a.filename === avatar);

    return matchedAvatar.source || require("../assets/Avatars/black.png");
}