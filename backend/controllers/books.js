// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const sharp = require("sharp");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const extension = MIME_TYPES["image/webp"];
 const date = Date.now();

  if (req.file) {
    sharp(req.file.buffer)
      .resize({ height: 500 })
      .toFile(
        `images/${
          req.file.originalname.split(" ").join("_").split(".").shift() +
          date +
          "." +
          extension
        }`
      )
      .catch((error) => console.log(error));

    // Créer une nouvelle instance de livre avec l'URL de l'image convertie en WebP
    const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.originalname.split(" ").join("_").split(".").shift() +
        date +
        "." +
        extension
      }`,
    });

    // Enregistrer le livre dans la base de données
    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Objet enregistré" });
      })
      .catch((error) => res.status(400).json({ error }));
    // });
  }
};

exports.modify = (req, res, next) => {
  const extension = MIME_TYPES["image/webp"];
  const date = Date.now();
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      let bookObject;

      if (req.file) {
        // const fileName = book.imageUrl.split("/images/")[1];

        ///////////////////////////////////////remplacer filname


        bookObject = {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.originalname.split(" ").join("_").split(".").shift() +
        date +
        "." +
        extension
      }`,
        };

        delete bookObject._userId;

        sharp(req.file.buffer)
          .resize({ height: 500 })
          .toFile( `images/${
            req.file.originalname.split(" ").join("_").split(".").shift() +
            date +
            "." +
            extension
          }`)
          .catch((error) => console.log(error));
//////////////////////////////////////////////remplacer par .toFile(
      /*  `images/${
          req.file.originalname.split(" ").join("_").split(".").shift() +
          date +
          "." +
          extension
        }`*/
//pour supprimer l'image, 
const fileToDelete = book.imageUrl.split("/images/")[1];
fs.unlink(`./images/${fileToDelete}`, (error) => {
  if (error) {
    console.error(error);
    return res.status(500).json({
      error:
        "Une erreur s'est produite lors de la suppression de l'image.",
    });
  }
  });
      

/*Fs



*/
      } else {
        bookObject = { ...req.body };
        delete bookObject._userId;
      }

      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifié" }))
        .catch((error) => res.status(401).json({ err }));
    })
    .catch((error) => res.status(400).json({ err }));
};

exports.delete = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "L'objet n'a pas été trouvé." });
      }
      const fileName = book.imageUrl.split("/images/")[1];

      fs.unlink(`./images/${fileName}`, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error:
              "Une erreur s'est produite lors de la suppression de l'image.",
          });
        }
        Book.deleteOne({ _id: req.params.id })
          .then(() =>
            res
              .status(200)
              .json({ message: "L'objet a été supprimé avec succès." })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOne = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAll = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.bookRating = (req, res, next) => {
  const ratingObject = req.body;
  if (ratingObject.userId) {
    ratingObject.grade = ratingObject.rating;
    delete ratingObject.rating;

    Book.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { ratings: ratingObject } },
      { new: true }
    )
      .then((book) => {
        const newRatings = book.ratings;
        const grades = newRatings.map((rating) => rating.grade);
        console.log(grades);

        let sum = 0;
        for (let i = 0; i < grades.length; i++) {
          sum += grades[i];
        }
        averageGrades = sum / grades.length;
        console.log(sum);
        console.log(averageGrades);
        Book.updateOne(
          { _id: req.params.id },
          { $set: { averageRating: averageGrades } }
        )
          .then(() => res.status(200).json(book))
          .catch((error) => res.status(401).json({ error }));
      })

      .catch((error) => res.status(400).json({ error }));
  } else {
    return res.status(404).json({ message: "vous devez être connecté." });
  }
};

exports.getBestRated = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      const sortedBooks = books.sort(
        (a, b) => b.ratings.averageRating - a.ratings.averageRating
      );
      res.status(200).json(sortedBooks);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
