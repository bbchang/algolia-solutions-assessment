var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
//import algoliasearch from 'algoliasearch';
//
// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

var client = algoliasearch('23KM5IPB4H', 'fe33b4c6519108d2a631015640ffc478');
var index = client.initIndex('restaurants_index');
const records = require("./project-files/resources/dataset/restaurants_list.json");

index.addObjects(records);

//Use npm csvtojson
const csvFilePath='./project-files/resources/dataset/restaurants_info.csv'
const csv=require('csvtojson')
csv({delimiter: ";"})
.fromFile(csvFilePath)
.then((jsonObj)=>{
    index.partialUpdateObjects(jsonObj, function(err, content) {
      if (err) throw err;

      console.log(content);
    });
    //console.log(jsonObj);
});

index.setSettings({
  searchableAttributes: [
    'name',
    'city',
    'food_type',
  ],
  customRanking: ['desc(popularity)'],
  'attributesForFaceting': ['food_type']
});