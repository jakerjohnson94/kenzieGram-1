const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const publicPath = './public/';
const port = 3000;
const app = express();
app.use(express.static(publicPath));
const uploadedFiles = [];

function fileFilter(req, file, cb) {
  var type = file.mimetype;
  var typeArray = type.split('/');
  if (typeArray[0] == 'image') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    var originalname = file.originalname;
    var extension = originalname.split('.');
    filename = 'image-' + Date.now() + '.' + extension[extension.length - 1];
    cb(null, filename);
  },
});
const upload = multer({ storage: storage, dest: publicPath, fileFilter: fileFilter });

app.get('/', function(req, res) {
  const path = './public/uploads';
  fs.readdir(path, function(err, items) {
    if (err) console.log(err);
    items = items.slice(1, items.length).sort((a, b) => a < b);

    res.send(`
    <link rel="stylesheet" type="text/css" href="style.css" />
    <h1>Welcome to Kylegram!</h1> 
    ${formTemplate}

    <ul>
    ${getPics(items)}
    </ul>`);
  });
});

app.post('/public/uploads', upload.single('myFile'), function(req, res, next) {
  // req.file is the `myFile` file
  // req.body will hold the text fields, if there were any
  console.log('Uploaded: ' + req.file.filename);
  path.extname(req.file.originalname);
  uploadedFiles.push(req.file.filename);
  res.send(`
  <h2>Success!</h2>
  <a href='http://localhost:${port}'> Back </a>
  `);
});

app.listen(port, () => console.log('Example app listening on port 3000!'));

function getPics(items) {
  let result = '';
  for (item of items) {
    result += `<li> <img src='./uploads/${item}'> </li>`;
  }
  return result;
}

const formTemplate = `  
 <form method="post" action="/public/uploads" enctype="multipart/form-data">
      <div>
        <label for="file">Choose a file</label>
        <input type="file" id="file" name="myFile">
      </div>
      <div>
        <button id='submit' type="submit"> Upload File</button>
      </div>
    </form>`;
