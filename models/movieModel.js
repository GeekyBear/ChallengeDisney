"use strict";
const { Sequelize, DataTypes } = require('sequelize');
const movieSeq = new Sequelize('postgres://postgres:H3adsh0t@localhost:5432/disney')

async function listMovies () {
    const allMovies = await Movie.findAll({
        attributes: ['image','title', 'date']
    })
    return allMovies;
}

// OK
async function createMovie(title, image, date, score, associatedChar) {
    // Adds a character on db
    const movie = await Movie.create({
        title,
        image,
        date, 
        score, 
        associatedChar
    })
    return movie
}

// OK
async function getMovie(title){
    const char = await Movie.findAll({
        where: {
            title: title
        }
    })
    return char;
}

// OK
async function updateMovie(title, image, date, score, associatedChar){
    const what = await Movie.update({title, image, date, score, associatedChar}, 
        { where: {title: title}});
    return null
}

// OK
async function deleteMovie(title) {
    await Movie.destroy({
        where: {
            title: title
        },
    });
}

// OK
async function queryByName(name){
    const char = await Movie.findAll({
        where: {
            name: name
        }
    })
    return char;
}

// OK
async function queryByGenre(genre){
    const char = await Movie.findAll({
        where: {
            genre: genre
        }
    })
    return char;
}

// OK
async function queryByOrder(order){
    const char = await Movie.findAll({
        where: {
            associatedMedia: order
        }
    })
    return char;
}

module.exports = {
    listMovies,
    createMovie,
    getMovie,
    updateMovie,
    deleteMovie,
    queryByName,
    queryByGenre,
    queryByOrder
}

const Movie = movieSeq.define( 'Movie', {
    title: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATEONLY
    },
    score: {
        type: DataTypes.INTEGER
    },
    associatedChars:{
        type: DataTypes.INTEGER
    }
});