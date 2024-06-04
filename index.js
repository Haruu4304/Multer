const path = require("path");
const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Ensure the uploads directory exists
const uploadsDir = path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.render("homepage");
});

// API endpoint to handle file upload
app.post("/upload", upload.single("upload"), (req, res) => {
  if (req.file) {
    console.log("File uploaded:", req.file);
  } else {
    console.log("No file uploaded");
  }

  return res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
