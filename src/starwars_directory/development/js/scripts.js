/*************/
/** scripts **/
/*************/

function getData(apiUrl) {
    // get json results
    $.getJSON( apiUrl, function( data ) {
        // declare variables
        var items = [];
        var results = data.results;

        // loop results and push to array
        $.each( results, function( key, result ) {
            items.push( 
                '<li class="person clearfix">' + 
                '<h3 class="name col-sm-5 col-xs-12" onClick="getDetails(event);">' + result.name + '<i class="icon"></i></h3>' +
                '<p class="stats col-sm-5 col-xs-12"><strong>Gender:</strong> ' + result.gender + ' | <strong>Height:</strong> ' + result.height + ' | <strong>Birth Year:</strong> ' + result.birth_year + '</p>' +
                '<div class="details col-sm-6 col-xs-12 col-sm-push-6" style="display: none;">' +
                    '<h3 class="starwars">STATISTICS</h3>' +
                    '<hr>' +
                    '<p><strong>Name:</strong> ' + result.name + '</p>' +
                    '<p><strong>Height:</strong> ' + result.height + '</p>' +
                    '<p><strong>Mass:</strong> ' + result.mass + '</p>' +
                    '<p><strong>Hair Color:</strong> ' + result.hair_color + '</p>' +
                    '<p><strong>Skin Color:</strong> ' + result.skin_color + '</p>' +
                    '<p><strong>Eye Color:</strong> ' + result.eye_color + '</p>' +
                    '<p><strong>Birth Year:</strong> ' + result.birth_year + '</p>' +
                    '<p><strong>Gender:</strong> ' + result.gender + '</p>' +
                '</div>' +
                '</li>'
            );
        });

        // push conditional anchor links to items
        if (data.previous !== null) {
        var prevBtn = '<li><a class="btn btn-lg active" data-url="' + data.previous + '" href="#" onClick="getResults(event);">Prev</a></li>';
        } else {
        var prevBtn = '<li><a class="btn btn-lg disabled">Prev</a></li>';
        }
        if (data.next !== null) {
        var nextBtn = '<li><a class="btn btn-lg active" data-url="' + data.next + '" href="#" onClick="getResults(event);">Next</a></li>';
        } else {
        var nextBtn = '<li><a class="btn btn-lg disabled">Next</a></li>';
        }
        items.push( '<ul class="pagination col-sm-5 col-xs-12">' + prevBtn + nextBtn + '</ul>');

        // update dom based on result set
        $( '<ul>', {
        html: items.join( "" )
        }).appendTo( ".people" );

    });
}

function getResults(event) {
    console.log("Fetching data...");

    // set apiUrl based on data-url
    var apiUrl = $(event.target).data('url');

    // clear results
    $('.people').html("");

    // get json results
    getData(apiUrl);
}

function getDetails(event) {
    console.log("Getting details...");
    // declare variables
    var details = $(event.target).siblings('.details');
    // check if active already
    if ($(event.target).hasClass("active")) {
        $(event.target).removeClass("active");
        $(details).slideToggle();
    } else {
        // update styles
        $('.details').attr("style", "display: none;");
        // remove active class
        $(".name").removeClass("active");
        // add active class to target
        $(event.target).addClass("active");
        // toggle details
        $(details).slideToggle();
    }
}