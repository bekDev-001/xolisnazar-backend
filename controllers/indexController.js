const News = require("../models/News");
const Ads = require("../models/Ads");
const Category = require("../models/Category");
const Contact = require("../models/Contact");
const Newspapers = require("../models/Newspapers");
const Soldnewspaper = require("../models/SoldNewspaper");
const Subscription = require("../models/Subscription");
const Portret = require("../models/Portret");
const fetch = require("node-fetch");
const path = require("path")

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

//* GET => get last posted news
exports.getLastNews = (req, res) => {
  News.find({}, (err, lastnews) => {
    res.json({
      lastNews: lastnews,
    });
  }).sort({
    createdAt: -1,
  });
};

//* GET => get all last news by category id
exports.getLastNewsById = (req, res) => {
  News.find(
    {
      categoryId: req.params.id,
    },
    (err, news) => {
      if (err || news.length < 1) {
        res.status(404).json({
          message: "News were not found",
          err,
        });
      } else {
        res.status(200).json({
          message: "News were found",
          news,
        });
      }
    }
  ).sort({
    createdAt: -1,
  });
};

//* GET => Gets all news
exports.getAllNews = (req, res) => {
  News.find({}, (err, allNews) => {
    const allNewsCount = allNews.length;
    if (err) {
      res.status(404).json({
        message: "All news were not found",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "All news were found",
        allNewsCount,
        allNews,
      });
    }
  });
};

//* GET => Gets news by category id
exports.getCategoryNewsById = (req, res) => {
  News.find(
    {
      categoryId: req.params.id,
    },
    (err, news) => {
      if (err || news === []) {
        res.status(404).json({
          message: "News were not found",
          err,
        });
      } else {
        res.status(200).json({
          message: "News were found",
          news,
        });
      }
    }
  ).sort({
    createdAt: -1,
  });
};

//* Get => get newspapers
exports.getNewspapers = (req, res) => {
  Newspapers.find(
    {
      type: "Newspaper",
    },
    (err, allNewsPapers) => {
      res.json({
        newsPapers: allNewsPapers,
      });
    }
  ).sort({
    createdAt: -1,
  });
};

//* Get => get journals
exports.getJournals = (req, res) => {
  Newspapers.find(
    {
      type: "Journal",
    },
    (err, allNewsPapers) => {
      res.json({
        newsPapers: allNewsPapers,
      });
    }
  ).sort({
    createdAt: -1,
  });
};

//* GET => Gets the news by id
exports.getNews = (req, res) => {
  News.findOne(
    {
      _id: req.params.id,
    },
    (err, news) => {
      if (err) {
        res.status(404).json({
          message: "News was not found",
          error: err,
        });
      } else {
        const indexPath = path.resolve(
          __dirname,
          "..",
          "aaaaa",
          "public",
          "index.html"
        );
        fs.readFile(indexPath, "utf8", (err, htmlData) => {
          if (err) {
            console.error("Error during file reading", err);
            return res.status(404).end();
          }

          // inject meta tags
          htmlData = htmlData
            .replace(
              "<title>Xolisnazar.uz</title>",
              `<title>${news.titleKr}</title>`
            )
            .replace("__META_OG_TITLE__", news.subTitleKr)
            .replace("__META_OG_DESCRIPTION__", news.paragraphUz)
            .replace("__META_DESCRIPTION__", news.parapraphKr)
            .replace("__META_OG_IMAGE__", news.mainPhoto);
          // return res.send(htmlData);
        });

        news.views += 1;
        news.save();
        console.log(news);
        res.status(200).json({
          message: "News was found",
          news,
        });
      }
    }
  );
};

//* GET => updates the view of news
exports.addView = (req, res) => {
  News.findById(req.params.id, async (err, news) => {
    if (err) {
      res.status(404).json({
        message: "News was not found",
      });
    } else {
      news.views += 1;
      const savedNews = await news.save();
      res.status(200).json({
        message: "Views was changed",
        savedNews,
      });
    }
  });
};

//* GET => Gets all categories
exports.getAllCategories = (req, res) => {
  Category.find({}, (err, allCategories) => {
    if (err) {
      res.status(404).json({
        message: "All categories were not found",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "All categories were found",
        allCategories,
      });
    }
  });
};

//* GET => Gets the category by id
exports.getCategory = (req, res) => {
  Category.findOne(
    {
      _id: req.params.id,
    },
    (err, category) => {
      if (err) {
        res.status(404).json({
          message: "Category was not found",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Category was found",
          category,
        });
      }
    }
  );
};

//* GET => Gets all ads
exports.getAllAds = (req, res) => {
  Ads.find({}, (err, allAds) => {
    if (err) {
      res.status(404).json({
        message: "All ads were not found",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "All ads were found",
        allAds,
      });
    }
  }).sort({
    createdAt: -1,
  });
};

//* GET => Gets the Ads by id
exports.getAds = (req, res) => {
  Ads.find(
    {
      categoryId: req.params.categoryid,
    },
    (err, ads) => {
      if (err) {
        res.status(404).json({
          message: "Ads was not found",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Ads was found",
          ads,
        });
      }
    }
  ).sort({
    createdAt: -1,
  });
};

//* GET => Gets the Ads by id
exports.getHomepageAds = (req, res) => {
  Ads.find(
    {
      homepage: true,
    },
    (err, allAds) => {
      if (err) {
        res.status(404).json({
          message: "Ads was not found",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Ads was found",
          allAds,
        });
      }
    }
  ).sort({
    createdAt: -1,
  });
};

//* POST => creates a new contact request
exports.postContact = async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    message: req.body.message,
  });

  try {
    const savedContact = await contact.save();
    res.status(200).json({
      message: "Contact request was saved",
      savedContact,
    });
  } catch (err) {
    res.status(400).json({
      message: "Contact request was not saved",
      err,
    });
  }
};

//* GET => get currency data
exports.currency = async (req, res) => {
  await fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
    .then((data) => data.json())
    .then((data) => {
      res.status(200).json({
        currencyData: data,
      });
    });
};

exports.createBill = async (req, res) => {
  try {
    const bill = new Soldnewspaper({
      newspaperid: req.body.newspaperid,
      caption: req.body.caption,
      type: req.body.type,
      fullname: req.body.fullname,
      address: req.body.address,
      phone: req.body.phone,
      paymentAmount: req.body.paymentAmount,
      paymentMethod: req.body.paymentMethod,
    });
    const savedBill = await bill.save();
    res.status(200).json({
      message: "Bill was saved",
      savedBill,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Bill was not saved",
      err,
    });
  }
};

exports.getAllNewspaperBills = (req, res) => {
  Soldnewspaper.find({}, (err, bills) => {
    if (err) {
      res.status(404).json({
        message: "Bills were not found",
        err,
      });
    } else {
      res.status(200).json({
        message: "Bills were found",
        bills,
      });
    }
  }).sort({
    createdAt: -1,
  });
};

exports.createSubsBill = async (req, res) => {
  try {
    const bill = new Subscription({
      firstname: req.body.firstname,
      surname: req.body.surname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      subscriptionMonths: req.body.subscriptionMonths,
      type: req.body.type,
      date: time(),
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
    });
    const savedBill = await bill.save();
    res.status(200).json({
      message: "Bill was saved",
      savedBill,
    });
  } catch (err) {
    res.status(400).json({
      message: "Bill was not saved",
      err,
    });
  }
};

exports.getAllSubscriptionBills = (req, res) => {
  Subscription.find({}, (err, bills) => {
    if (err) {
      res.status(404).json({
        message: "Bills were not found",
        err,
      });
    } else {
      res.status(200).json({
        message: "Bills were found",
        bills,
      });
    }
  }).sort({
    createdAt: -1,
  });
};

//*GET=> get all portrets
exports.getPortrets = async (req, res) => {
  try {
    const portret = await Portret.find().sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: portret.length, data: portret });
  } catch (err) {
    res.status(400).json({
      message: "Portret request failed",
      err,
    });
  }
};

//*GET=> get single portret
exports.getPortret = async (req, res) => {
  try {
    const portret = await Portret.findById(req.params.id);
    if (!portret) {
      return res
        .status(404)
        .json({ message: `resource not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: portret });
  } catch (err) {
    res.status(400).json({
      message: "Portret request failed",
      err,
    });
  }
};
