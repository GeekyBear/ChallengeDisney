const { db } = require('./models/db')
const { Character, Movie, Genre } = db.models;

// A Character can be in several movies
Character.belongsToMany(Movie, {through: 'Char_Movie'});
// A Movie can has several Chars
Movie.belongsToMany(Character, {through: 'Char_Movie'});

//A Movie can has many Genres
Movie.belongsToMany(Genre, {through: 'Movie_Genre'})
//A Genre can has many Movies
Genre.belongsToMany(Movie, {through: 'Movie_Genre'})

// 1. CHARACTER FUNCTIONS //
//------------------------------------------------------------------------------------//

// LIST CHARACTERS - REVISION OK
async function listCharacters () {
    const allChars = await Character.findAll({
        attributes: ['image','name']
    })
    return allChars;
}

// CREATE CHARACTERS - REVISION OK
async function createChar(image, name, age, weigth, history, movieName) {
    // Adds a character on db
    const char = await Character.create({
        name,
        image,
        age, 
        weigth, 
        history
    })

    // Search for the movie by title with movieName
    const findMovie = await Movie.findAll({
        where: {
            title: movieName
        }
    })

    // If movie exists, char is added to movie
    if(findMovie.length !== 0){
        // creo la muvie
        char.setMovies(findMovie)
    } else {
        // Create movie, and add the char to the movie
        const movie = await Movie.create({
            title: movieName
        })
        char.setMovies(movie)
    }
    return char
}

// GET CHARACTERS - REVISION OK
async function getChar(name){
    const char = await Character.findAll({
        where: {
            name: name
        }
    })
    return char;
}

// UPDATE CHARACTERS - REVISION OK
async function updateChar(image, name, age, weigth, history, associatedMedia){
    const what = await Character.update({image, name, age, weigth, history, associatedMedia}, 
        { where: {name: name}});
    return null
}

// DELETE CHARACTERS - REVISION OK
async function deleteChar(name) {
    await Character.destroy({
        where: {
            name: name
        },
    });
}

// QUERY CHARACTERS BY NAME - REVISION OK
async function queryByName(name){
    const char = await Character.findAll({
        where: {
            name: name
        }
    })
    return char;
}

// QUERY CHARACTERS BY AGE - REVISION OK
async function queryByAge(age){
    const char = await Character.findAll({
        where: {
            age: age
        }
    })
    return char;
}

// QUERY CHARACTERS BY MOVIEID - REVISION OK
async function queryByMovieId(movieId){
    let movie = await Movie.findAll({
        where: {
            id: movieId
        }
    })

    if(movie.length !== 0){
        const movieChars = await movie[0].getCharacters()
        //movieChars.map(char => console.log(char.toJSON()))
        return movieChars
    } else {
        return 'Movie not found';
    }
}

// 2. MOVIE FUNCTIONS //
//------------------------------------------------------------------------------------//

async function listMovies () {
    const allMovies = await Movie.findAll({
        attributes: ['image','title', 'date']
    })
    return allMovies;
}

// CREATE MOVIES - REVISION OK
async function createMovie(title, image, date, score, genre, genreImg) {
    
    // I will try to find the movie so it isn't duplicated
    const findMovie = await Movie.findAll({
        where: {
            title: title
        }
    })
    
    // If I found it
    if(findMovie.length !== 0){
        // I Update the movie with the new info
        await Movie.update(
            {title, image, date, score, genre, genreImg}, 
            { where: {title: title}
        });
    } else {
        // Adds a new movie on db
        const movie = await Movie.create({
            title,
            image,
            date, 
            score,
        })

        // if Genre exists
        const findGenre = await Genre.findAll({
            where: {
                name: genre
            }
        })

        if(findGenre.length !== 0){
            movie.setGenres(findGenre)
        } else {
            await movie.createGenre({
                name: genre,
                image: genreImg
            })
            return movie
        }
    }

}

// GET MOVIE - REVISION OK
async function getMovie(title){
    const movie = await Movie.findAll({
        where: {
            title: title
        }
    })
    return movie;
}

// OK
async function updateMovie(title, image, date, score,  genre, genreImg){
    const updatedMovie = await Movie.update({title, image, date, score,  genre, genreImg}, 
        { where: {title: title}});

    const findGenre = await Genre.findAll({
        where: {
            name: genre
        }
    })
    if(findGenre.length !== 0){
        updatedMovie.setGenres(findGenre)
        return 'genre added'
    } else {
        await updatedMovie[0].createGenre({
            name: genre,
            image: genreImg
        })
        return updatedMovie
    }
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
async function queryMovByName(name){
    const movie = await Movie.findAll({
        where: {
            title: name
        }
    })
    return movie;
}

// OK
async function queryMovByIdGenre(idGenero){
    let genre = await Genre.findAll({
        where: {
            id: idGenero
        }
    })

    if(genre.length !== 0){
        const moviesByGenre = await genre[0].getMovies()
        //movieChars.map(char => console.log(char.toJSON()))
        return moviesByGenre
    } else {
        return 'The Genre has no movies';
    }
}


// OK
async function queryMovByOrder(ord){
    const allMovies = await Movie.findAll({
        attributes: ['image','title', 'date'],
        order: [["date", ord]],
        //,
        //order: [null, 'date', 'DESC']
    })
    
    return allMovies;
}


module.exports = {
    // <CHARACTER EXPORTS>
    listCharacters,

    // -------------------- CRUD ------------------ //
    createChar,
    getChar,
    updateChar,
    deleteChar,
    // ------------------ END CRUD ------------------ //

    // ------------------- QUERY ------------------- //
    queryByName,
    queryByAge,
    queryByMovieId,
    // ----------------- END QUERY ----------------- //
    // </CHARACTER EXPORTS>

    // <MOVIE EXPORTS>
    listMovies,
    // -------------------- CRUD ------------------ //
    createMovie,
    getMovie,
    updateMovie,
    deleteMovie,
    // ------------------- QUERY ------------------- //
    queryMovByName,
    queryMovByIdGenre,
    queryMovByOrder
    // ----------------- END QUERY ----------------- //
    // </MOVIE EXPORTS>
}