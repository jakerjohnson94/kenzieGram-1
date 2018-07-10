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
    filename = +Date.now() + '.' + extension[extension.length - 1];
    cb(null, filename);
  },
});
const upload = multer({ storage: storage, dest: publicPath, fileFilter: fileFilter });

app.get('/', function(req, res) {
  fs.readdir('./public/uploads', function(err, items) {
    if (err) console.log(err);
    items = items.slice(1, items.length).sort((a, b) => a < b);

    res.send(`
    ${displayTemplate}
   
    <div class='container row'>
    ${getPics(items)}
    </div>
    `);
  });
});

app.post('/public/uploads', upload.single('myFile'), function(req, res, next) {
  // req.file is the `myFile` file
  // req.body will hold the text fields, if there were any
  if (!req.file) {
    res.send(console.log('error, no file to upload'));
  } else {
    console.log('Uploaded: ' + req.file.filename);
    path.extname(req.file.originalname);
    uploadedFiles.push(req.file.filename);
    res.send(successTemplate);
  }
});

app.listen(port, () => console.log('Server listening on port 3000!'));

function getPics(items) {
  let result = '';
  for (item of items) {
    result += `<div class ='col s4'>  <img src='./uploads/${item}'></div>`;
  }
  return result;
}

const formTemplate = `  
 <form class='center' method="post" action="/public/uploads" enctype="multipart/form-data">
      <div>
        <label for="file">Choose a file</label>
        <input type="file" id="file" name="myFile">
      </div>
      <div>
        <button class='btn ' id='submit' type="submit"> Upload New Picture </button>
      </div>
    </form>`;
const displayTemplate = `
  <link rel="stylesheet" type="text/css" href="style.css" />
  <link rel="stylesheet" type="text/css" href="sass/materialize.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/js/materialize.min.js"></script>

  <h1 class='center'>Kenziegram</h1> 
  ${formTemplate}`;

const successTemplate = `

    <h2 class='center'>Success!</h2>
    <a href='http://localhost:${port}'> Back </a>
    `;
