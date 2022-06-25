const {DataTypes} = require('sequelize')

// OK
async function listCharacters () {
    const allChars = await Character.findAll({
        attributes: ['image','name']
    })
    return allChars;
}

// OK
async function createChar(image, name, age, weigth, history, associatedMedia) {
    // Adds a character on db
    const char = await Character.create({
        name,
        image,
        age, 
        weigth, 
        history, 
        associatedMedia
    })
    return char
}

// OK
async function getChar(name){
    const char = await Character.findAll({
        where: {
            name: name
        }
    })
    return char;
}

// OK
async function updateChar(image, name, age, weigth, history, associatedMedia){
    const what = await Character.update({image, name, age, weigth, history, associatedMedia}, 
        { where: {name: name}});
    return null
}

// OK
async function deleteChar(name) {
    await Character.destroy({
        where: {
            name: name
        },
    });
}

// OK
async function queryByName(name){
    const char = await Character.findAll({
        where: {
            name: name
        }
    })
    return char;
}

// OK
async function queryByAge(age){
    const char = await Character.findAll({
        where: {
            age: age
        }
    })
    return char;
}

// OK
async function queryByMovieId(movieId){
    const char = await Character.findAll({
        where: {
            associatedMedia: movieId
        }
    })
    return char;
}

module.exports = sequelize => {
    sequelize.define('Character',{
        name: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        history: {
            type: DataTypes.STRING
        },
        age: {
            type: DataTypes.INTEGER
        },
        weigth: {
            type: DataTypes.INTEGER
        }
    })
}