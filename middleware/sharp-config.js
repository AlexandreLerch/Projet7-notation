// const sharp = require("sharp");

// const MIME_TYPES = {
//    "image/jpg": "jpg",
//    "image/jpeg": "jpg",
//    "image/png": "png",
//    "image/webp": "webp",
// };
// module.exports = (req, res, next) => {
//    // console.log("prout")
//    if (req.file) {
//       // console.log(req.file)
//       // let name = req.file.originalname.split(" ").join("_").split(".").shift(); 
//       // const extension = MIME_TYPES["image/webp"];
//       // name += Date.now() + "." + extension;
//    //   console.log(name)

//       req.file.filename = name;

//       sharp(req.file.buffer)
//          .resize({ height: 500 })
//          // .toFile(`images/${name}`)
//          .toFile(`images/${"nouveau_nom"}`)
//          .catch((error) => console.log(error));
//    }
//    next();
// };


// const sharp = require("sharp");

// const MIME_TYPES = {
//    "image/jpg": "jpg",
//    "image/jpeg": "jpg",
//    "image/png": "png",
//    "image/webp": "webp",
// };

// module.exports = (req, res, next) => {
//    if (req.file) {
      
      
//       const extension = MIME_TYPES["image/webp"];
//       // let name = req.file.originalname.split(" ").join("_").split(".").shift()
//       // name.toString();
//       // name += Date.now() + "." + extension;
//      const date = Date.now()
// console.log("le" + date)      

//       // req.file.filename = name;

//       sharp(req.file.buffer)
//          .resize({ height: 500 })
//          .toFile(`images/${req.file.originalname.split(" ").join("_").split(".").shift() +"."+extension}`)
//          // .toFile(`images/${"nouveau_nom"}`)
//          .catch((error) => console.log(error));
//    }
//    next();
// };

