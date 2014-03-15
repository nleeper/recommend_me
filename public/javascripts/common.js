$(document).ready(function() {
    var connectionsModal = $('.contacts-modal');

    $('a.description-link').click(function() {
        var link = $(this);
        var desc = $(link.attr('data-target'));
        if (desc.hasClass('in')) {
            link.text('Show description');
        }
        else {
            link.text('Hide description');
        }
    });

    $('a.ask').click(function() {
        var link = $(this);
        window.jobId = link.attr('data-id'); 
        connectionsModal.modal('show') ;
    });

    $('a.connection').click(function() {
        var link = $(this);
        var connectionId = link.attr('data-id');

        $.ajax({
            type: 'POST',
            url: 'referral',
            data: {
                jobId: window.jobId,
                connectionId: connectionId
            },
            success: (function(data) {
                console.log(data);
            })
        });

        connectionsModal.modal('hide');
    });
});