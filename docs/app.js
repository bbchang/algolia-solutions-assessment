//Config
var applicationID = '23KM5IPB4H';
var apiKey = '65937eae90c360c8ed44ea0e51f58bcc';
var index = 'restaurants_index';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, index, {
  facets: ['food_type'],
  hitsPerPage: 5,
  maxValuesPerFacet: 5
});

helper.on('result', function(content) {
  renderFacetList(content);
  renderHits(content);
});

function renderHits(content) {
  $('#container').html(function() {
    return $.map(content.hits, function(hit) {
      return '<li>' + '<img src=' + hit.image_url + '>' + '<h3>' + hit._highlightResult.name.value
      + '</h3><br></br>' + 'Star Rating: '+ hit.stars_count + '<br></br>' + hit.food_type + ' | '
      + hit.neighborhood + ' | ' + hit.price_range + '</li>';
    });
  });
}

$('#facet-list').on('click', 'input[type=checkbox]', function(e) {
  var facetValue = $(this).data('facet');  
  helper.toggleRefinement('food_type', facetValue)
        .search();
});

function renderFacetList(content) {
  $('#facet-list').html(function() {
    return $.map(content.getFacetValues('food_type'), function(facet) {
      var checkbox = $('<input type=checkbox>')
        .data('facet', facet.name)
        .attr('id', 'fl-' + facet.name);
      if(facet.isRefined) checkbox.attr('checked', 'checked');
      var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', 'fl-' + facet.name);
      return $('<li>').append(checkbox).append(label);
    });
  });
}

$('#search-input').on('keyup', function() {
  helper.setQuery($(this).val())
        .search({aroundLatLngViaIP: true});
});

helper.search();

var search = instantsearch({
  appId: '23KM5IPB4H',
  apiKey: '65937eae90c360c8ed44ea0e51f58bcc', // search only API key, no ADMIN key
  indexName: 'restaurants_index',
  urlSync: true,
  searchParameters: {
    hitsPerPage: 5
  }
});

search.addWidget(
  instantsearch.widgets.starRating({
    container: '#stars',
    attributeName: 'rating',
    max: 5,
    labels: {
      andUp: ''
    },
    cssClasses: {
      star: '.ais-star-rating--star',
      emptyStar: '.ais-star-rating--star__empty'
    }
  })
);

/*search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#hits',
    showMore: true
  })
);*/
// Add this after all the search.addWidget() calls
search.start();

/*Display star count fn
$.fn.stars = function() {
    return $(this).each(function() {
        $(this).html($('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
    });
}

$(function() {
  console.log("Calling stars()");
  $('.results-content span.stars').stars();
});*/