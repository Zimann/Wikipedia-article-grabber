window.onload = function() {

    //cache in some of the DOM elements
    var closeElement = $('.close-x');
    var inputField = $('.input-field');
    var middleRow = $('.middle-row');
    var aboveParagraph = $('.above-paragraph');
    var noResults = $('.no-results');
    inputField.focus();
    //create an empty variable in which we will store the returned ajax data
    var dataReference;


    //empty the input field on "X" click and move the input field up and down 
    closeElement.click(function() {
        inputField.val('');
        aboveParagraph.css('margin-top', '15%');
        $('.wiki-article').remove();
    });
    //detect "delete" key and remove the article elements when this is empty
    inputField.on('keyup', function(e) {


        if (e.keyCode == 8 && inputField.val().length < 1) {
            $('.wiki-article').remove();
            aboveParagraph.css('margin-top', '15%');
        }
        //detect the "Enter" key and start searching for articles
        if (e.keyCode == 13) {
            if (noResults.css('display', 'none') !== true) {
                noResults.css('display', 'none');
                console.log(true);
            }
            aboveParagraph.css('margin-top', '5%');
            $('.wiki-article').remove();
            var searchOption = inputField.val();
            //API url
            var sentUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchOption + "&origin=*&format=json";
            $.ajax({
                url: sentUrl,
                type: 'GET',
                datatype: 'json',
                success: function(data) {
                    console.log(data);
                    dataReference = data;
                    //checking if the query returns zero results for the search
                    if (data[1].length == 0 && data[2].length == 0 && data[3] == 0) {
                        noResults.toggle();
                    } else {
                        //noResults.css('display','none');
                    }
                    //dynamically generate html elements based on the number of results
                    data[1].forEach(function(element) {
                        middleRow.append('<div class="wiki-article"><a class="wiki-link" target="_blank"><h3 class="article-title">' + element + '</h3><p class="article-excerpt"></p></a></div>');
                        $('.wiki-article').css('margin-top', 0);
                        noResults.toggle();
                    });
                }
            }).done(function() {

                //fill the excerpt of the article with text related to the search
                dataReference[2].forEach(function(element, index) {
                    var singleExcerpt = $('.article-excerpt').eq(index);
                    singleExcerpt.text(element);
                });

                //add the href attribute with the corresponding links from the response
                dataReference[3].forEach(function(element, index) {
                    var singleLink = $('.wiki-link').eq(index);
                    singleLink.attr('href', element);

                });
            }).fail(function() {
                console.log('The server did not respond, please refresh the page');
            });
        }
    });
};