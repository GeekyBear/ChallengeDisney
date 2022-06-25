// // READ CHARACTER
// app.get('/characters', (req, res) => {
//     // Destructuring of req.query
//     const { name, age, weigth, movies } = req.query;
//     // If there is only a name. Return character
//     if(!name && !age && !weigth && !movies){
//       const test = listCharacters(name);
//       return 'ok'
//     } 
      
    
//     // If there is an age parameter. Return age
//     if(age) return res.json(listCharacters(name, age));
//     // If there is an weigth parameter. Return age
//     if(weigth) return res.json(listCharacters(name, null, weigth));
//     // If there is an movie parameter. Return movies and series of the character.
//     if(movies) return res.json(listCharacters(name, null, null,movies));
//     res.json(listCharacters())
// });


// LIST CHARACTERS
// }

// // If name exists store in currentChar the character with the same name
// let currentChar = characters.filter(char => char.name === name);

// // If there is name -> Return Char
// if(name && !age && !weigth && !movies) return currentChar[0]

// // If there is age -> Return age, if it doesn't exist return null
// if(name && age) return currentChar[0].age === age ? currentChar[0].age : 'No matching age';

// // If there is weigth -> Return weigth
// if(name && weigth) return currentChar[0].weigth === weigth ? currentChar[0].weigth : 'No matching weight';

// // PENDIENTE: If there is movies -> Filter associatedMedia with movieId
// // If filter return something, show movie detail, else return 'No asociatedMedia'
// if(name && movieId) return currentChar[0].associatedMedia

//updtae 
//     let char = characters.filter(char => char.name === name);
//     console.log(char)
//     char = {image, name, age, weigth, history, associatedMedia};
//     console.log(char)

// var characters = [{
//     image: 'lion.png', 
//     name: 'LionKing', 
//     age: '14', 
//     weigth: '500', 
//     history: 'King of the jungle', 
//     associatedMedia: ['The Lion King']
// },
// {
//     image: 'mando.png', 
//     name: 'Mando', 
//     age: '30', 
//     weigth: '100', 
//     history: 'A renegade from Tatooine', 
//     associatedMedia: ['The mandalorian', 'Star Wars']
// }];