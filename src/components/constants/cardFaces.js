export const cardFaces = ["A" , "K" , "Q" , "J" , "T" , "9" , "8" , "7", "6" , "5" , "4" , "3" , "2"];

const namesList = [
  "Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Abigail", "Emily",
   "Liam", "Noah", "Oliver", "Elijah", "William", "James", "Benjamin", "Lucas", "Henry", "Alexander", "Mason", "Michael", "Ethan",
   "Aarya", "Ananya", "Diya", "Ishita", "Kiara", "Mira", "Naina", "Riya", "Sanya", "Sneha", "Tara", "Vidya",
   "Aarav", "Aditya", "Dhruv", "Ishan", "Karan", "Laksh", "Manav", "Nikhil", "Rohan", "Siddharth", "Varun", "Vihaan", "Yash"
 ];
 
 export function getRandomNames(count) {
   if (count <= 0) {
       return [];
   }
 
   const shuffledNames = [...namesList];
 
   for (let i = shuffledNames.length - 1; i > 0; i--) {
       const randomIndex = Math.floor(Math.random() * (i + 1));
       [shuffledNames[i], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[i]];
   }
 
   return shuffledNames.slice(0, Math.min(count, shuffledNames.length));
 }

 export function findFaceName(face) {
  const faceNames = {
    "2": "Two",
    "3": "Three",
    "4": "Four",
    "5": "Five",
    "6": "Six",
    "7": "Seven",
    "8": "Eigth",
    "9": "Nine",
    "T": "Ten",
    "J": "Jack",
    "Q": "Queen",
    "K": "King",
    "A": "Ace"
  };

  return faceNames[face] || "UNKNOWN";
}

//add slider for my cards

// adjust probablities and dynamic probabalites acc to no of players plaing 