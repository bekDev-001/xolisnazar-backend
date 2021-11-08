const News = require("../models/News");
const Category = require("../models/Category");
const Ads = require("../models/Ads");
const Contact = require("../models/Contact");
const Todo = require("../models/ToDo");
const Admin = require("../models/Admins");
const Newspaper = require("../models/Newspapers");
const Portret = require("../models/Portret");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fetch = require('node-fetch')

const time = () => {
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  const d = new Date();

  return `${d.getDate()} ${monthNames[d.getMonth()]
    } ${d.getFullYear()} / ${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`;
};
//! Admins
//* POST => Creates a new admin
exports.signUp = async (req, res) => {
  const admin = {
    password: req.body.password,
  };

  bcrypt.genSalt(12, (err, pass) => {
    bcrypt.hash(admin.password, pass, async (err, hash) => {
      try {
        const admin = new Admin({
          fullname: req.body.fullname,
          phoneNumber: req.body.phone,
          email: req.body.email,
          password: req.body.password,
        });
        admin.password = hash;
        const savedAdmin = await admin.save();
        const token = jwt.sign(
          {
            email: savedAdmin.email,
            userId: savedAdmin._id,
          },
          process.env.api_secret_key,
          {
            expiresIn: "3d",
          }
        );
        res.cookie("auth", token, { httpOnly: true, maxAge: 86400000 * 3 });
        return res.status(200).json({
          message: "Auth seccessful",
          token: token,
        });
      } catch (error) {
        res.status(400).send(error);
      }
    });
  });
};

//* POST => Sign in of Admin
exports.signIn = (req, res) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((admin) => {
      if (admin.length > 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      } else {
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: admin[0].email,
                userId: admin[0]._id,
              },
              process.env.api_secret_key,
              {
                expiresIn: "3d",
              }
            );
            res.cookie("auth", token, { httpOnly: true, maxAge: 86400000 * 3 });
            return res.status(200).json({
              message: "Auth seccessful",
              token: token,
            });
          } else {
            res.status(401).json({
              message: "Auth failed",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

//* GET => logout of admin
exports.logOut = (req, res) => {
  res.cookie("auth", "", { maxAge: 1 });
  res.status(200).json({
    message: "Successfully logged out",
    path: "/",
  });
};

//! News
//* POST => Creates a news
exports.postNews = async (req, res) => {
  const news = new News({
    title: req.body.title,
    titleKr: req.body.titleKr,
    subTitle: req.body.subTitle,
    subTitleKr: req.body.subTitleKr,
    mainPhoto: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
    paragraphUz: req.body.paragraphUz,
    parapraphKr: req.body.paragraphKr,
    hashTag: req.body.hashTag,
    publishTime: time(),
    categoryId: req.body.categoryId,
    categoryName: req.body.categoryName,
    categoryNameKr: req.body.categoryNameKr,
    journalistName: req.body.journalistFullName,
    journalistNameKr: req.body.journalistNameKr,
  });

  try {
    const savedNews = await news.save();
    return res.status(200).json({
      message: "News was successfully created",
      news: savedNews,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

//* PUT => Updates the news
exports.updateNews = (req, res) => {
  News.findOne({ _id: req.params.id }, (err, news) => {

    fs.unlink(`uploads/${news.mainPhoto.split('/')[5]}`, (err) => {
      if (err) throw err
      console.log("File was deleted")
    })
  })

  const updatedNews = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    mainPhoto: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
    paragraphUz: req.body.paragraphUz,
    parapraphKr: req.body.paragraphKr,
    hashTag: req.body.hashTag,
    publishTime: time(),
    categoryId: req.body.categoryId,
    journalistName: req.body.journalistFullName,
  };

  News.findOneAndUpdate({ _id: req.params.id }, updatedNews, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json({
        message: "News was successfully updated",
        updatedNews: updatedNews,
      });
    }
  });
};

//* DELETE => Deletes the news
exports.deleteNews = (req, res) => {
  News.findOneAndDelete({ _id: req.params.id }, (err, deletedNews) => {
    if (err) {
      res.status(400).send(err);
    } else {
      fs.unlink(`uploads/${deletedNews.mainPhoto.split("/")[5]}`, (err) => {
        if (err) throw err;
        console.log("File was deleted");
      });
      res.status(200).json({
        message: "News was successfully deleted",
        deletedNews,
      });
    }
  });
};

//! Category
//* POST => Creates a new category
exports.postCategory = async (req, res) => {

  try {
    const category = new Category({
      titleUz: req.body.titleUz,
      titleKr: req.body.titleKr,
      categoryImage: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
    });
    savedCategory = await category.save();
    return res.status(200).json({
      message: "Category was successfully created",
      category: savedCategory,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

//* PUT => Updates the category
exports.updateCategory = (req, res) => {
  const updatedCategory = {
    titleUz: req.body.titleUz,
    titleKr: req.body.titleKr,
    categoryImage: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
  };

  Category.findOneAndUpdate({ _id: req.params.id }, updatedCategory, (err, category) => {
    if (err) {
      res.status(400).send(err);
    } else {
      fs.unlink(`uploads/${category.categoryImage.split('/')[5]}`, (err) => {
        if (err) throw err
        console.log("File was deleted")
      })
      res.status(200).json({
        message: "Category was successfully updated",
        updatedNews: updatedCategory,
      });
    }
  });
};

//* DELETE => Deletes the category
exports.deleteCategory = (req, res) => {
  Category.findOneAndDelete({ _id: req.params.id }, (err, deletedCategory) => {
    if (err) {
      res.status(400).send(err);
    } else {
      fs.unlink(
        `uploads/${deletedCategory.categoryImage.split("/")[5]}`,
        (err) => {
          if (err) throw err;
          console.log("File was deleted");
        }
      );
      res.status(200).json({
        message: "Category was successfully deleted",
        deletedCategory,
      });
    }
  });
};

//! Ads
//* POST => Creates the ads
exports.postAd = async (req, res) => {
  const newAd = new Ads({
    adsPhoto: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
    adsLink: req.body.adsLink,
    postedTime: time(),
    homepage: req.body.homepage,
    categoryId: req.body.categoryId,
  });

  try {
    const savedAds = await newAd.save();
    res.status(200).json({
      message: "Ads was successfully created",
      Ads: savedAds,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

//* PUT => Updates the ads
exports.updateAds = (req, res) => {
  Ads.findOne({ _id: req.params.id }, (err, ads) => {

    fs.unlink(`uploads/${ads.adsPhoto.split('/')[5]}`, (err) => {
      if (err) throw err
      console.log("File was deleted")
    })
  })

  const updatedAds = {
    adsPhoto: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
    adsLink: req.body.adsLink,
    postedTime: time(),
    homepage: req.body.homepage,
    categoryId: req.body.categoryId,
  };

  Ads.findOneAndUpdate({ _id: req.params.id }, updatedAds, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json({
        message: "Ads was successfully updated",
        updatedAd: updatedAds,
      });
    }
  });
};

//* DELETE => Deletes the ads
exports.deleteAds = (req, res) => {
  Ads.findOneAndDelete({ _id: req.params.id }, (err, deletedAds) => {
    if (err) {
      res.status(400).send(err);
    } else {
      fs.unlink(`uploads/${deletedAds.adsPhoto.split("/")[5]}`, (err) => {
        if (err) throw err;
        console.log("File was deleted");
      });
      res.status(200).json({
        message: "Ads was successfully deleted",
        deletedAds,
      });
    }
  });
};

//! Contact requests
//* GET => get all contact requests
exports.getContacts = (req, res) => {
  Contact.find({}, (err, contacts) => {
    if (err) {
      res.status(404).json({
        message: "Contact requests were not found",
      });
    } else {
      res.status(200).json({
        message: "Contact requests were found",
        contacts,
      });
    }
  }).sort({
    createdAt: -1,
  });
};

//* GET => get contact request by id
exports.getContactById = (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) {
      res.status(404).json({
        message: "Contact request were not found",
      });
    } else {
      res.status(200).json({
        message: "Contact request were found",
        contact,
      });
    }
  });
};

//! ToDo list
//* POST => creates a new todo
exports.postTodo = async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
  });

  try {
    const savedTodo = await todo.save();
    res.status(200).json({
      message: "Todo was created successfully",
      savedTodo,
    });
  } catch (err) {
    res.status(400).json({
      message: "Todo was not created",
      err,
    });
  }
};

//* PUT => updates a todo by id
exports.updateTodo = (req, res) => {
  const update = {
    done: true,
  };

  Todo.findOneAndUpdate({ _id: req.params.id }, update, (err, updatedTodo) => {
    if (err) {
      res.status(404).json({
        message: "Todo was not found",
      });
    } else {
      res.status(200).json({
        message: "Todo was updated successfully",
        updatedTodo,
      });
    }
  });
};

//* GET => get all todos
exports.getAllTodos = (req, res) => {
  Todo.find({}, (err, todos) => {
    if (err) {
      res.status(400).json({
        err,
      });
    } else {
      res.status(200).json({
        message: "Todos were found",
        todos,
      });
    }
  });
};

exports.deleteTodo = (req, res) => {
  Todo.findByIdAndRemove({ _id: req.params.id }, (err, element) => {
    if (err || element.length < 1) {
      res.status(404).json({
        message: "Todo was not found",
        err: err,
      });
    } else {
      res.status(200).json({
        message: "Todo was found",
        element,
      });
    }
  });
};

//! Newspapers
//* Creates a newspaper
exports.postNewspaper = async (req, res) => {
  try {
    const newspaper = new Newspaper({
      newspaperTitle: req.body.caption,
      newspaperTitleKr: req.body.captionKr,
      type: req.body.type,
      image: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.photo[0].filename}`,
      donwloadLink: `${req.protocol}://${req.headers.host}/api/uploads/${req.files.pdf[0].filename}`,
      paymentAmount: req.body.paymentAmount,
    });
    const savedNewspaper = await newspaper.save();
    res.status(200).json({
      message: "Newspaper was created successfully",
      newspaper: savedNewspaper,
    });
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};

//* Updates a newspaper
exports.putNewspaper = async (req, res) => {
  try {
    const newspaper = {
      newspaperTitle: req.body.caption,
      newspaperTitleKr: req.body.captionKr,
      type: req.body.type,
    };
    Newspaper.findByIdAndUpdate(
      { _id: req.params.id },
      newspaper,
      (err, newspaper) => {
        if (err) {
          res.status(404).json({
            message: "Newspaper title was not found",
            err,
          });
        } else {
          res.status(200).json({
            message: "Newspaper title was updated successfully",
            newspaper,
          });
        }
      }
    );
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};

//* DELETE => Deletes a newspaper
exports.deleteNewspaper = (req, res) => {
  Newspaper.findOneAndRemove(
    { _id: req.params.id },
    (err, deletedNewspaper) => {
      if (err) {
        res.status(404).json({
          message: "Newspaper was not found",
        });
      } else {
        fs.unlink(`uploads/${deletedNewspaper.image.split("/")[5]}`, (err) => {
          if (err) throw err;
          console.log("File was deleted");
        });
        fs.unlink(
          `uploads/${deletedNewspaper.donwloadLink.split("/")[5]}`,
          (err) => {
            if (err) throw err;
            console.log("File was deleted");
          }
        );
        res.status(200).json({
          message: "Newspaper was deleted successfully",
          deletedNewspaper,
        });
      }
    }
  );
};

//*POST=> create portret
exports.createPortret = async (req, res) => {
  try {

    const { iframe, titleUz, titleKr, youtubeLink, descriptionUz, descriptionKr } = req.body
    const portret = await Portret.create({ iframe, titleUz, titleKr, youtubeLink, descriptionUz, descriptionKr, publishTime: time() })
    if (!portret) {
      return res.status(403).json({ message: `something went wrong while creating portret` })
    }
    res.status(200).json({ success: true, data: portret })
  } catch (err) {
    res.status(400).json({
      message: "Creating portret request failed",
      err,
    });
  }
};


//*PUT=> update portret
exports.updatePortret = async (req, res, next) => {
  try {
    const { iframe, titleUz, titleKr, youtubeLink, descriptionUz, descriptionKr } = req.body
    const findedPortret = await Portret.findById(req.params.id)
    if (!findedPortret) {
      return res.status(404).json({ message: `resource not found with id of ${req.params.id}` })
    }
    const portret = await Portret.findOneAndUpdate(req.params.id, { iframe, titleUz, titleKr, youtubeLink, descriptionUz, descriptionKr, publishTime: time(), }, { new: true })

    if (!portret) {
      return res.status(404).json({ message: `resource not found with id of ${req.params.id}` })
    }
    res.status(200).json({ success: true, data: portret })
  } catch (err) {
    res.status(400).json({
      message: "Updating portret request failed",
      err,
    });
  }
};


//*DELETE=> delete portret
exports.deletePortret = async (req, res) => {
  try {
   
    const portret = await Portret.findById(req.params.id)
    if (!portret) {
      return res.status(404).json({ message: `resource not found with id of ${req.params.id}` })
    }
    await portret.remove()
    res.status(200).json({ success: true, message: "successfuly deleted" })
  } catch (err) {
    res.status(400).json({
      message: "Deleting portret request failed",
      err,
    });
  }
};

