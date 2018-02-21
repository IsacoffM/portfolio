//*********************************//
// form script - location autofill //
//*********************************//

// get the datalist and input elements
var dataList = document.getElementById('json-datalist');
var input = document.getElementById('ajax');

// create a new XMLHttpRequest
var request = new XMLHttpRequest();

// handle state changes for the request
request.onreadystatechange = function(response) {
    if (request.readyState === 4) {
        if (request.status === 200) {
            // Parse the JSON
            var jsonOptions = JSON.parse(request.responseText);

            // loop over the JSON
            jsonOptions.forEach(function(item) {
                // create a new option element
                var option = document.createElement('option');
                // set the value using the item in the JSON
                option.value = item;
                // add the options to the datalist
                dataList.appendChild(option);
            });
        }
    }
};

// get the json
request.open('GET', 'locations.json', true);
request.send();


//**********************//
// filters array script //
//**********************//

// add class to checkboxes if checked
$('#filter .check').change(function(){
    if($(this).is(":checked")) {
        $(this).addClass("checked");
    } else {
        $(this).removeClass("checked");
    }
});

// add filter array when submit button clicked
/* $('.submit').click(function(){
    // set filter 1
    var filter1 = document.getElementById("filter1");
    if ($(filter1).hasClass("checked")) {
        var filters1 = filter1.value + ";";
    } else {
        var filters1 = "";
    }
    // set filter 2
    var filter2 = document.getElementById("filter2");
    if ($(filter2).hasClass("checked")) {
        var filters2 = filter2.value + ";";
    } else {
        var filters2 = "";
    }
    // set filter 3
    var filter3 = document.getElementById("filter3");
    if ($(filter3).hasClass("checked")) {
        var filters3 = filter3.value + ";";
    } else {
        var filters3 = "";
    }
    // log filter array
    if (filters1.length > 0 || filters2.length > 0 || filters3.length > 0) {
        var filters = filters1+filters2+filters3;
    } else {
        var filters = "";
    }
    // append filters hidden input
    $('#filters').val(filters);
    // remove individual checkboxes from form submit
});
*/

//**************************//
// filter accordion scripts //
//**************************//

var filters = document.getElementById("filters");
var filterTitle = document.getElementsByClassName("filter-title-text");
var filterArrow = document.getElementsByClassName("filter-arrow");
var showText = "Open Filters";
var hideText = "Close Filters";

function showFilters() {
    if ($(filters).hasClass("show")) {
        $(filters).removeClass("show").addClass("hide").slideUp();
        $(filterArrow).removeClass("up").addClass("down");
        $(filterTitle).html(showText);
    } else {
        $(filters).removeClass("hide").addClass("show").slideDown();
        $(filterArrow).removeClass("down").addClass("up");
        $(filterTitle).html(hideText);
    }
}

$(filterTitle).click(function() {
    showFilters();
});

$(".filter-apply").click(function(event) {
    event.preventDefault();
    deleteMarkers();
    deleteJson();
    jsonGet();
    getMainMap();
    showFilters();
});

$(".filter-reset").click(function() {
    filterChecks = document.getElementsByClassName("checked");
    $(filterChecks).removeClass("checked");
});

//******************//
// dropdown scripts //
//******************//

/* $("#search-category").change(function() {
    category = document.getElementById("search-category");
    console.log(category);
}); */

//*************//
// map scripts //
//*************//

// set global variables
var map;
var json = "results.json";
var infowindow = new google.maps.InfoWindow();
    showMap = document.getElementById("showMap");
    officeMap = document.getElementsByClassName("office-map");
    distributorMap = document.getElementsByClassName("distributor-map");
    searchMain = document.getElementsByClassName("search-main");
    breakPoint = "<br />";
    // set default location as dallas, tx
    lat = 32.776664;
    lng = -96.796988;

// add active name to map title
function addActiveName() {
    activeName = document.getElementsByClassName("activeResult")[0].childNodes[0].innerHTML;
    $("#map-title span").replaceWith("<span>" + activeName + "</span>");
}

// generate infowindow
function bindInfoWindow(mainMarker, map, infowindow, details) {        
    google.maps.event.addListener(mainMarker, 'click', function () {
        infowindow.setContent(details);
        infowindow.open(map, mainMarker);
    });
}

// create and center map
function centerMap() {
    if (distributorMap.length > 0) {
        zoomLevel = 10
    } else {
        zoomLevel = 4
    }
    // set primary location and center map
    var location = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoomLevel,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), location);
}

// create first map on load
function createFirstMap() {
    // set primary location and center map then append json data to page and create main map marker
    jsonGet();
    getMainMap();
    // setGeolocation();
    customizeInfowindow();
}

// customize infowindow elements
function customizeInfowindow() {
    // customize infowindow
    google.maps.event.addListener(infowindow, 'domready', function() {
        // div that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');

        // create iwBackground variable
        var iwBackground = iwOuter.prev();

        // update the zindex of the arrow
        iwBackground.css({'z-index' : '2'});

        // remove background shadow div
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // remove white background div
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        // div that groups the close button elements
        var iwCloseBtn = iwOuter.next();

        if (officeMap.length > 0) {
            // change the arrow background color if office map
            iwBackground.children(':nth-child(3)').children(':nth-child(1)').children(':nth-child(1)').attr('style', function(i,s){ return s + 'background-color: #006ec7 !important;'});
            iwBackground.children(':nth-child(3)').children(':nth-child(2)').children(':nth-child(1)').attr('style', function(i,s){ return s + 'background-color: #006ec7 !important;'});
            
            // apply effects to the close button
            iwCloseBtn.css({right: '-75px'});
        }
        else if (distributorMap.length > 0) {
            // hide arrow elements if distributor map
            iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'display: none !important;'});
            iwBackground.children(':nth-child(3)').children(':nth-child(1)').children(':nth-child(1)').attr('style', function(i,s){ return s + 'display: none !important;'});
            iwBackground.children(':nth-child(3)').children(':nth-child(2)').children(':nth-child(1)').attr('style', function(i,s){ return s + 'display: none !important;'});

            // apply effects to the close button
            iwCloseBtn.css({display: 'none'});
        }        
    });
}

// loop through all the markers and remove
function deleteMarkers() {
    mainMarker.setMap(null);
    $.getJSON(json, function(json1, stringResult) {
        $.each(json1.results, function (key, data) {
            // set marker for only active selection
            var activeResult = document.getElementsByClassName("activeResult");

            if (stringResult === data.id && distributorMap.length > 0) {
                //loop through authorized locations
                var authorizedLocations = data.authorizedLocations;
                $.each(authorizedLocations, function (key, data) {
                    if (data.type === 0) {
                        // if type is primary location, log console
                        console.log ('JSON Error: This is a primary location type');
                    } else if (data.type === 1) {
                        // if type is polygon, remove polygon map
                        polyMap.setMap(null);
                    } else if (data.type === 2) {
                        // if type is circle, remove circle map
                        circleMap.setMap(null);
                    } else {
                        console.log(data.type + 'This is not a valid type');
                    }
                });
            }
        });
    });
}

function deleteJson() {
    $("#json").replaceWith('<div id="json" class="json"></div>');
}

// get primary location markers and generate map
function getMainMap() {
    // loop through json
    $.getJSON(json, function(json1) {
        console.log("Getting map markers...");
        $.each(json1.results, function (key, data) {
            // set marker for only active selection
            var activeResult = document.getElementsByClassName("activeResult");
            var stringResult = activeResult[0].id;
            var idResult = data.id;
            // generate main map markers
            if (officeMap.length > 0 || (distributorMap.length > 0 && stringResult === idResult) ) {
                var latLng = new google.maps.LatLng(data.primaryLocation.coords.lat, data.primaryLocation.coords.lng);
                    mainMarker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: 'images/red-pin.png',
                    title: data.name
                });
                company = '<div class="company company-name">' + data.name + '</div>';
                description = '<div class="company company-description">' + data.description + '</div>';
                address = '<div class="company company-address">' + data.info.address.street + " " + data.info.address.city + " " + data.info.address.state + " " + data.info.address.zip + ", " + data.info.address.country + "</div>";
                telephone = '<div class="company company-phone"><i class="icon ion-ios-telephone"></i>' + data.info.telephone + "</div>";
                email = '<div class="company company-email"><i class="icon ion-ios-paperplane"></i><a href="mailto:' + data.info.email + '">' + data.info.emailText + '</a></div>';
                web = '<div class="company company-website"><i class="icon ion-ios-world"></i><a href="' + data.info.web + '">' + data.info.webText + '</a></div>';
                // generate infoWindow
                if (distributorMap.length > 0) {
                    details = company;
                } else {
                    details = company + breakPoint + description + breakPoint + address + breakPoint + telephone + email + web;
                }
                bindInfoWindow(mainMarker, map, infowindow, details);
                if (distributorMap.length > 0 ) {
                    // open infowindow by default                
                    infowindow.setContent(details);
                    infowindow.open(map, mainMarker);
                }
            }
        });
    });
    if (distributorMap.length > 0) {
        getResellers();
    };
}

// get authorized location(s) and add to map
function getResellers() {
    // loop through json
    $.getJSON(json, function(json1, stringResult) {
        console.log("Getting resellers...");
        $.each(json1.results, function (key, data) {
            // set distributor area for only active selection
            var activeResult = document.getElementsByClassName("activeResult");
            var stringResult = activeResult[0].id;
            console.log(stringResult);
            if (stringResult === data.id) {
                //loop through authorized locations
                var authorizedLocations = data.authorizedLocations;
                $.each(authorizedLocations, function (key, data) {
                    if (data.type === 0) {
                        var latLng = new google.maps.LatLng(data.coords.lat, data.coords.lng);
                            secondaryMarker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            icon: 'images/blue-pin.png',
                            title: data.coords.name
                        });
                        secondaryDetails = data.coords.name;
                        bindInfoWindow(secondaryMarker, map, infowindow, secondaryDetails);
                    } else if (data.type === 1) {
                        // if type is polygon, generate polygon map
                        var poly = data.coords;
                            polyMap = new google.maps.Polygon({
                            paths: poly,
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35
                        });
                        polyMap.setMap(map);
                    } else if (data.type === 2) {
                        // if type is circle, generate circle map
                        var radius = data.radius;
                        var mapCenter = data.coords;
                            circleMap = new google.maps.Circle({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            map: map,
                            center: mapCenter,
                            radius: (radius * 100000)
                        });
                        circleMap.setMap(map);
                    } else {
                        console.log(data.type + 'This is not a valid type');
                    }
                });
            }
        });
    });
}

// get JSON data and append to page
function jsonGet() {
    $.getJSON(json, function(json1) {
        console.log("Getting JSON data...");
        $.each(json1.results, function (key, data) {
            // declare variables
            divId = '<div id="' + data.id + '" class="result" onclick="setActiveClass(event);"></div>',
            locationId = data.id,
            company = '<div class="company company-name">' + data.name + '</div>',
            description = '<div class="company company-description">' + data.description + '</div>',
            address = '<div class="company company-address">' + data.info.address.street + " " + data.info.address.city + " " + data.info.address.state + " " + data.info.address.zip + ", " + data.info.address.country + "</div>",
            telephone = '<div class="company company-phone"><i class="icon ion-ios-telephone"></i>' + data.info.telephone + "</div>",
            email = '<div class="company company-email"><i class="icon ion-ios-paperplane"></i><a href="mailto:' + data.info.email + '">' + data.info.emailText + '</a></div>',
            web = '<div class="company company-website"><i class="icon ion-ios-world"></i><a href="' + data.info.web + '">' + data.info.webText + '</a></div>',
            filterDiv = '<div id="filter' + locationId + '" class="company company-filter hidden"><strong>Filters:</strong> </div>',
            category = '<div class="company company-category hidden"><strong>Category:</strong> ' + data.category.name + "</div>",
            primaryLocation = '<div class="company company-location hidden"><strong>Primary Location:</strong><br />' + '<div class="lat">' + data.primaryLocation.coords.lat + '</div><div class="lng">' + data.primaryLocation.coords.lng + "</div>",
            line = "<hr />";

            // filters check
            var filterResults = data.filters;
            var checkedFilters = document.getElementsByClassName("checked");
            filterMatch = false;
            if (checkedFilters.length > 0) {
                $.each(filterResults, function (key, data) {
                    var filterKey = data.key;
                    $.each(checkedFilters, function(key, data) {
                        var checkedFilter = data.id;
                        if (checkedFilter === filterKey) {
                            filterMatch = true;
                        }
                    });
                });
            } else {
                console.log("No filters selected.");
            }

            if (checkedFilters.length === 0 || filterMatch === true) {
                // append json div with json content
                $("#json").append( divId );
                $("#"+locationId).append( company, description, address, telephone, email, web, category, primaryLocation );
                if (distributorMap.length > 0) {
                    $("#json").append( line );
                };
            }
        });

        // add active class to first result
        var firstResult = document.getElementsByClassName("result");
        $(firstResult[0]).addClass( "activeResult" );
        lat = document.getElementsByClassName("activeResult")[0].childNodes[7].childNodes[2].innerHTML;
        lng = document.getElementsByClassName("activeResult")[0].childNodes[7].childNodes[3].innerHTML;
        centerMap(lat,lng);
        
        // if distributor map, add active name to map title
        if (distributorMap.length > 0) {
            addActiveName();
        }
    });
}

// remove active class, add to clicked element, delete markers, update map
function setActiveClass(event) {
    //remove current active element
    var activeSelection = document.getElementsByClassName("activeResult");

    $(activeSelection[0]).removeClass( "activeResult" );

    // add active class to click target
    var target = $( event.currentTarget );
    if ( target.hasClass( "activeResult" ) ) {
        return;
    } else {
        target.addClass("activeResult");
    }
    //get lat and lng from active div
    lat = document.getElementsByClassName("activeResult")[0].childNodes[7].childNodes[2].innerHTML;
    lng = document.getElementsByClassName("activeResult")[0].childNodes[7].childNodes[3].innerHTML;
    // if distributor map, add active name to map title
    if (distributorMap.length > 0) {
        addActiveName();
    }
    centerMap(lat,lng);
    deleteMarkers();
    getMainMap();
}

// set geolocation based on browser location
function setGeolocation() {
    // if browser supports geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infowindow.setPosition(pos);
            map.setCenter(pos);
        });
    } else {
        // if browser doesn't support geolocation
        console.log('Geolocation not supported');
        return;
    }
}

// geocoding scripts
function getGeocode() {
    var address = document.getElementById("ajax").value;
    var hiddenField = document.getElementById("search-location");
        apiKey = "AIzaSyCieSeYgDRHLm8RFgv0ibDtnu3ncS0373I";
        geoJson = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;
    $.getJSON(geoJson, function(geoJson1) {
        var neLat = geoJson1.results[0].geometry.bounds.northeast.lat;
        var neLng = geoJson1.results[0].geometry.bounds.northeast.lng;
        var swLat = geoJson1.results[0].geometry.bounds.southwest.lat;
        var swLng = geoJson1.results[0].geometry.bounds.southwest.lng;
        var geoCoords = "[(" + neLat + "," + neLng + "),(" + swLat + "," + swLng + ")]";
        hiddenField.value = geoCoords;
        console.log(hiddenField.value);
    });
}

// handle enter key press
function handleEnter(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        console.log("Enter");
        getGeocode();
    }
}

$("#ajax").blur(function() {
    getGeocode();
});

$("#search-form").submit(function() {
    getGeocode();
});

// run function when page loads
if (searchMain.length < 1) {
    google.maps.event.addDomListener(window, 'load', createFirstMap);
}