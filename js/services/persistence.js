//var jsonService = require('./json.js');
var mongoDbService = require('./mongodb.js');

//var persistenceService = jsonService;
var persistenceService = mongoDbService;

module.exports = persistenceService;