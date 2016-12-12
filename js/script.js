$(document).ready(function() {
    //define selected day
    $weekday = null;

    //hide all right boxes
    $('#morning, #afternoon, #evening, #night, #empty').hide();


    $('#addform :checkbox').change(function() {
        // this will contain a reference to the checkbox   
        if (this.checked) {
            $(this).val('1');

        } else {
            $(this).val('0');
        }
    });

    getMedList();

    //Handel Event, when click on day from the weekline list
    $('#weekline li a').click(function() {
        $weekday = $(this);
        var date = $(this).attr('data-date');
        $('#weekline li').removeClass('active');

        $(this).parent().addClass('active');

        $('#morning, #afternoon, #evening, #night, #empty').hide();

        $.ajax({
            url: API + "getbydate/" + date,
            type: "GET",
            dataType: 'json',
            success: function(data) {
                if (data != 'No result') {
                    console.log(data);

                    if (data.items.length > 0) {
                        var items = data.items;
                        var icon = data.icon;

                        $.each(items, function(index, value) {
                            var title = value.title;
                            var take = value.taken;
                            var id = value.id;
                            var item_time = value.item_time.split(":");
                            item_time = item_time[0] + ':' + item_time[1];

                            $item = $('#' + title);

                            $item.attr({
                                'data-id': id
                            });
                            $item.attr({
                                'data-status': take
                            });

                            $item.find('.title').html(title + ' ' + item_time);
                            if (take == 'YES') {
                                $item.find('.icons').append('<span class="op1"><i class="fa fa-check"></i></span>');
                            } else {
                                $item.find('.icons').append('<span class="op2"><i class="fa fa-minus"></i></span>');
                            }
                            $item.find('.icons img').attr({
                                'src': 'img/' + icon + '.jpg'
                            });

                            $item.show();
                        });
                    } else {
                        $('#empty').find('.title').html('No result found');
                        $('#empty').show();
                    }
                } else {
                    $('#empty').find('.title').html('No result found');
                    $('#empty').show();
                }
            },
            error: function(xhr, status, error) {
                //    alert(error);
            }
        });
    });


    $('#morning, #afternoon, #evening, #night').click(function() {
            $this = $(this);

            var id = $this.attr('data-id');
            var status = $this.attr('data-status');

            if (status == 'YES') {
                status = 'NO';
            } else {
                status = 'YES';
            }

            $.ajax({
                url: API + "taken/" + id + "/" + status,
                type: "GET",
                dataType: 'json',
                success: function(data) {
                    $weekday.trigger('click');
                },
                error: function(xhr, status, error) {
                    //  alert(error);
                }
            });

        })
        //////////////////////////////////////////End the right panel code/////////////////////////////////////////
});

insertrecord = function() {
    var content = $("#medNametxt").val();
    var meddate = $("#dpmeddate").datepicker({
        dateFormat: 'yyyy-mm-dd'
    }).val();

    var medtype = $('input[name=optr1]:checked').val();
    var morning = $('input[id=ckmorning]:checked').val();
    var evening = $('input[id=ckevening]:checked').val();
    var night = $('input[id=cknight]:checked').val();
    var morningtime = $("#morningtime").val();
    var eveningtime = $("#eveningtime").val();
    var nighttime = $("#nighttime").val();

    $.ajax({
        url: API + "reminder/save",
        type: "POST",
        data: {
            content: content,
            date: meddate,
            icon: medtype,
            morning: morning,
            morningtime: morningtime,
            evening: evening,
            eveningtime: eveningtime,
            night: night,
            nighttime: nighttime
        },

        dataType: 'json',

        success: function(data) {
            clearform();
        },
        error: function(xhr, status, error) {
            //alert('error :'+error);
        }
    }); //END $.ajax

    $('#medModal').modal('hide');
    getMedList();
}

updaterecord = function(id) {
    //var id=$("#medNametxt").attr('data-id');

    var content = $("#medNametxt").val();
    var meddate = $("#dpmeddate").val();
    var medtype = $('input[id=optr1]:checked').val();
    var morning = $('input[id=ckmorning]:checked').val();
    var evening = $('input[id=ckevening]:checked').val();
    var night = $('input[id=cknight]:checked').val();
    var morningtime = $("#morningtime").val();
    var eveningtime = $("#eveningtime").val();
    var nighttime = $("#nighttime").val();

    $.ajax({
        url: API + "reminder/save",
        type: "POST",
        data: {
            id: id,
            content: content,
            date: meddate,
            icon: medtype,
            morning: morning,
            morningtime: morningtime,
            evening: evening,
            eveningtime: eveningtime,
            night: night,
            nighttime: nighttime
        },
        dataType: 'json',
        success: function(data) {
            clearform();
        },
        error: function(xhr, status, error) {
            alert('error :' + error);
        }
    }); //END $.ajax
    $('#medModal').modal('hide');
    getMedList();
}

deleterecord = function(id) {
    $.ajax({
        url: API + "reminder/" + id,
        type: "DELETE",
        dataType: 'json',
        success: function(data) {
            getMedList();
        },
        error: function(xhr, status, error) {}
    }); //END $.ajax
}
getMedList = function() {
    $("#ulMedicationlist").html('');
    $.ajax({
        url: API + "list",
        type: "GET",
        dataType: 'json',
        success: function(data) {
            $.each(data, function(index, value) {
                $("#ulMedicationlist").append('<li data-id=' + value.id + ' class="clearfix"><div class="tump"><img src="img/1.jpg" alt="" /></div><div class="caption"><a href="">' + value.title + '</a><span class="span-01">' + value.count + '/day</span> <span class="span-02">' + value.timing + '</span></div><div class="option"><ul class="list-inline"><li><a data-toggle="modal" href="#medModal" onClick="getrecord(' + value.id + ')"><i class="fa fa-pencil"></i></a></li><li style="margin-left:10px;"><a href="" onClick="deleterecord(' + value.id + ')"><i class="fa fa-times"></i></a></li></ul></div></li>');
            });
        },
        error: function(xhr, status, error) {
            //	alert(error);
        }
    }); //END $.ajax
}


save = function() {
    var action = $('#hdnaction').val();

    if (action == 0)
        insertrecord();
    else
        updaterecord(action);
};

getrecord = function(id) {
    clearform();
    $('#hdnaction').val(id);

    //alert('id : '+id);
    $.ajax({
        url: API + "reminder/" + id,
        type: "GET",
        dataType: 'json',

        success: function(data) {
            $("#medNametxt").val(data['title']);
            $("#dpmeddate").val(data['date']);

            if (data['icon'] != null)
                $("#optr" + data['icon']).prop("checked", true)
            $.each(data['items'], function(index, value) {
                if (value.title == 'morning') {
                    $('#ckmorning').prop('checked', true);
                    $('#morningtime').timepicker('setTime', value.item_time);
                }
                if (value.title == 'afternoon') {
                    $('#ckafternoon').prop('checked', true);
                    $('#afternoontime').timepicker('setTime', value.item_time);
                }
                if (value.title == 'evening') {
                    $('#ckevening').prop('checked', true);
                    $('#eveningtime').timepicker('setTime', value.item_time);

                }
                if (value.title == 'night') {
                    $('#cknight').prop('checked', true);
                    $('#nighttime').timepicker('setTime', value.item_time);

                }
            });
        },
        error: function(xhr, status, error) {

        }
    }); //END $.ajax
}

clearform = function() {
    $(".date").datepicker('setDate', new Date());
    $("#medNametxt").val('');
    $("#hdnaction").val('0');

    $('#ckmorning').prop('checked', false);
    $('#ckafternoon').prop('checked', false);
    $('#ckevening').prop('checked', false);
    $('#cknight').prop('checked', false);
    $('#morningtime').timepicker('setTime', '00:00');
    $('#afternoontime').timepicker('setTime', '00:00');
    $('#eveningtime').timepicker('setTime', '00:00');
    $('#nighttime').timepicker('setTime', '00:00');
}