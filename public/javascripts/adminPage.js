$(document).ready(function () {

    $('.pending_circle').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/approve',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.non_premium_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/premium',

            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.premium_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/removepremium',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.suspend_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/suspend',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.reactivate_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/reactivate',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $("#hotel_input").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: "/hotels/fetch-hotels",
                dataType: "json",
                data: {
                    hotel_name: request.term
                },
                success: function (data) {
                    response(
                        $.map(data, function (hotel, key) {
                            return {
                                label: hotel.name,
                                value: hotel.id
                            }
                        })
                    );
                }
            });
        },
        select: function (event, ui) {
            $('#hotel_id').val(ui.item.value);
            $('#hotel_input').val(ui.item.label);
            $('#hotel_search').prop('disabled', false);;

            return false;

        }
    });

    $('#hotel_search_form').submit(function (e) {
        e.preventDefault();
        $('.option1').click();
        $('html,body').animate({
            scrollTop: $("#" + $('#hotel_id').val() + "_scroll").offset().top
        }, 'slow');
    });

    $('.option1').click(function () {
        $('.hotel_container').show();
    })
    $('.option2_nonApproved').click(function () {
        $('.hotel_container').hide();
        $('.non-approved').closest('.hotel_container').show();
    })
    $('.option3_suspended').click(function () {
        $('.hotel_container').hide();
        $('.reactivate_button').closest('.hotel_container').show();
    })
    $('.option4_premium').click(function () {
        $('.hotel_container').hide();
        $('.premium_button').closest('.hotel_container').show();
    })

});