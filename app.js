require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

const PORT = process.env.PORT || 3000;

// manually creating a user but no longer needed as authorization has been implemented. Leaving it here for reference.

// app.use((req, res, next) => {
//   User.findById("5e0c4df134913e285ce41650")
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

// Registers every route

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// handles error and non-existent pages

app.use((req, res, next) => {
  res.status(404).send("<h1>Oh oh, this page does not exist</h1>");
  next();
});

// connects the server to the database
mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Abas",
    //       email: "abas@test.com",
    //       cart: { items: [] }
    //     });
    //     user.save();
    //   }
    // });
    console.log("Database connected");
    app.listen(PORT , () => console.log(`Server is running on port ${PORT}`));
  })
  .catch(err => console.log(err));
