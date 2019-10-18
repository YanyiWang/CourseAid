const express = require('express');

const app = express();

app.use(express.static('static_files'));

const fakeDatabase = {
    'Yanyi': {Grade: 'A', attendance: '90'},
    'Vincent': {Grade: 'A', attendance: '85'},
    'Shera': {Grade: 'C', attendance: '40'}
  };
  
  app.get('/', function (req, res) {
  res.render('index', {});
});

  
  app.get('/users', (req, res) => {
    const allUsernames = Object.keys(fakeDatabase); 
    console.log('allUsernames is:', allUsernames);
    res.send(allUsernames);
  });


  app.get('/users/:userid', (req, res) => {
    const nameToLookup = req.params.userid; // matches ':userid' above
    const val = fakeDatabase[nameToLookup];
    console.log(nameToLookup, '->', val); // for debugging
    if (val) {
      res.send(val);
    } else {
      res.send({}); // failed, so return an empty object instead of undefined
    }
  });

  // start the server at URL: http://localhost:3000/
  app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
  });