//This file to add js configuations

var API = 'http://inspireusweb.com/reminder-api/public/index.php/';

$(document).ready(function() {

    $('.datepicker').datepicker();
    $("#dpmeddate").datepicker('setDate', new Date());
    $(".date").datepicker("option", "dateFormat", "yy-mm-dd");
    $('.timepicker').timepicker({
        showMeridian: false
    });
    $('.timepicker').timepicker('setTime', new Date()); // current time

});