//*********************************//
// form script - location autofill //
//*********************************//
//                                 //
// TODO - rework to use geocoding  //
//                                 //
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

//*******************************************//
// search dropdown and submit button scripts //
//*******************************************//

// swap classes and generate map type based on dropdown selection when submit button clicked
function swapMaps() {
    var pageType = document.getElementById("category").value;
    var pageSelector = document.getElementById("page-selector");
    var pageSelectorClass = pageSelector.className;
    var locationValue = document.getElementById("ajax").value;
        officePage = "offices";
        distributorPage = "distributors";
        sysadminPage = "sysadmin";
    // change to office page type
    if (pageType === officePage) {
        $(pageSelector).removeClass(pageSelectorClass).addClass("office-map");
        deleteJson();
        createFirstMap();
    }
    // change to distributor page type
    else if (pageType === distributorPage || pageType === sysadminPage) {
        $(pageSelector).removeClass(pageSelectorClass).addClass("distributor-map");
        deleteJson();
        createFirstMap();
    }
    // if placeholder selected do nothing
    else {
        return;
    }
}

// validate form fields
function validateForm() {
    var category = document.getElementById("category");
    var ajax = document.getElementById("ajax");
    var categoryValue = category.value;
    var ajaxValue = ajax.value;

    $(category).removeClass("invalid");
    $(ajax).removeClass("invalid");
    $("#category-invalid").removeClass("show").addClass("hidden");
    $("#location-invalid").removeClass("show").addClass("hidden");

    if (categoryValue.length < 1 || ajaxValue.length < 1) {
        if (categoryValue.length < 1) {
            $(category).addClass("invalid");
            $("#category-invalid").removeClass("hidden").addClass("show");
        }
        if (ajaxValue.length < 1) {
            $(ajax).addClass("invalid");
            $("#location-invalid").removeClass("hidden").addClass("show");
        }
        isInvalid = true;
    } else {
        isInvalid = false;
    }
}

// run functions when submit button clicked
$("#form-submit").click(function(event) {
    event.preventDefault();
    getGeocode();
    validateForm();
    if (isInvalid === false) {
        if ($(filters).hasClass("show")) {
            showFilters();
        }
        swapMaps();
    }
});

$("#category").change(function() {
    $("#placeholder").attr("disabled", true);
});

//**********************//
// filters array script //
//**********************//

subCategories = [];
subcategoryField = document.getElementById("subcategories");

$('#filter .check').change(function(){
    // if checked, add class and add to array
    if($(this).is(":checked")) {
        $(this).addClass("checked");
        subCategories.push(this.value);
    }
    // if unchecked, remove class and remove from array
    else {
        $(this).removeClass("checked");
        var subcategoryValue = this.value;
        var subcategoryIndex = subCategories.indexOf(subcategoryValue);
        if (subcategoryIndex > -1) {
            subCategories.splice(index, 1);
        }
    }
    // update subcategory field with array
    subcategoryField.value = subCategories;
});

//**************************//
// filter accordion scripts //
//**************************//

filters = document.getElementById("filters");
filterTitle = document.getElementsByClassName("filter-title-text");
filterArrow = document.getElementsByClassName("filter-arrow");
showText = "Open Filters";
hideText = "Close Filters";

function resetFilters() {
    filterChecks = document.getElementsByClassName("check");
    if ($(filterChecks).is(":checked")) {
        $(filterChecks).attr("checked", false);
        $(filterChecks).removeClass("checked");
        subCategories = [];
    }
}

// show/hide filter menu
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

// run function when filter title is clicked
$(filterTitle).click(function() {
    showFilters();
});

// reset form on page reload
$(document).ready(function() {
    $("#search-form").each(function() { this.reset() });
});

// apply filters on current json - TODO - need to rework with progressive enhancement
$(".filter-apply").click(function(event) {
    event.preventDefault();
    validateForm();
    if (isInvalid === false) {
        deleteMarkers();
        deleteJson();
        jsonGet();
        getMainMap();
        showFilters();
    }
});

// clear checks when filter reset button clicked
$(".filter-reset").click(function(event) {
    event.preventDefault();
    resetFilters();
});

//*******************//
// geocoding scripts //
//*******************//

// transform text location to coordinates via geocoding
function getGeocode() {
    // set variables
    address = document.getElementById("ajax").value;
    hiddenField = document.getElementById("search-location");
    apiKey = "AIzaSyCieSeYgDRHLm8RFgv0ibDtnu3ncS0373I";
    geoJson = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;

    // get json from google api
    $.getJSON(geoJson, function(geoJson1) {
        var neLat = geoJson1.results[0].geometry.bounds.northeast.lat;
        var neLng = geoJson1.results[0].geometry.bounds.northeast.lng;
        var swLat = geoJson1.results[0].geometry.bounds.southwest.lat;
        var swLng = geoJson1.results[0].geometry.bounds.southwest.lng;
            geoCoords = "LatMax=" + neLat + ";LngMax=" + neLng + ";LatMin=" + swLat + ";LngMin=" + swLng;
        hiddenField.value = geoCoords;
    });
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

//*************//
// map scripts //
//*************//

// set global variables
var map;
var json = "results.json"; // TODO - static json - will need to replace with data-api results instead
var infowindow = new google.maps.InfoWindow();
    showMap = document.getElementById("showMap");
    officeMap = document.getElementsByClassName("office-map");
    distributorMap = document.getElementsByClassName("distributor-map");
    searchMain = document.getElementsByClassName("search-main");
    breakPoint = "<br />";
    // set default location coords as blank - need to rework to include default location based on geocoded search result
    lat = "";
    lng = "";

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

// get primary location markers and generate map - TODO - rework to remove HTML elements and append data instead
function getMainMap() {
    // loop through json
    $.getJSON(json, function(json1) {
        console.log("Getting map markers...");
        $.each(json1.results, function (key, data) {
            // set marker for only active selection
            activeResult = document.getElementsByClassName("activeResult");
            var stringResult = activeResult[0].id;
            var idResult = data.id;

            // plot map marker(s)
            function makeMap() {
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
                web = '<div class="company company-website"><i class="icon ion-ios-world"></i><a target="_blank" href="' + data.info.web + '">' + data.info.webText + '</a></div>';
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

            // check for filters on office map to restrict markers to array
            if (officeMap.length > 0 || (distributorMap.length > 0 && stringResult === idResult) ) {
                filterMatch = false;
                if (officeMap.length > 0) {
                    // filters check
                    var filterResults = data.filters;
                    var checkedFilters = document.getElementsByClassName("checked");
                    if (checkedFilters.length > 0) {
                        $.each(filterResults, function (key, data) {
                            var filterKey = data.key;
                            $.each(checkedFilters, function(key, data) {
                                var checkedFilter = data.id;
                                if (checkedFilter === filterKey) {
                                    makeMap();
                                }
                            });
                        });
                    } else {
                        makeMap();
                    }
                }
                // if not office map, plot markers normally
                else {
                    makeMap();
                }
            }
        });
    });
    //if distributor map, get resellers
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

// get JSON data and append to page - TODO - rework to remove HTML elements and append data instead
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
            web = '<div class="company company-website"><i class="icon ion-ios-world"></i><a target="_blank" href="' + data.info.web + '">' + data.info.webText + '</a></div>',
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
                console.log("Filters selected.");
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