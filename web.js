var app = require('./js/app.js');

// startup server
var server = app.listen(process.env.PORT || 80, () => console.log('Server is running.'));