$(document).ready(function() {
    $('a.description-link').click(function() {
        var link = $(this);
        var desc = $(link.attr('data-target'));
        if (desc.hasClass('in')) {
            link.text('Show description');
        }
        else {
            link.text('Hide description');
        }
    })
});