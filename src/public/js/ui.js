var bolo = window.bolo || {};

bolo.cache = {};
bolo.eventHandlers = {

};

bolo.cacheElements = function () {
    var ele = {};
    createBoloForm = document.querySelector('#create-bolo-form');
    bolo.cache.addImageGroup = document.querySelector('#form-add-img-group');
    bolo.cache.addImageButton = document.querySelector('#form-add-img-btn');
};


bolo.init = function () {
    bolo.cacheElements();
};

window.addEventListener("load", function (event) {
    bolo.init();
});







//Validations for forms
jQuery(function(){
    
    //Validations for General bolo
    // Uppercase first letter each word
    $("#lastName[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
    });
    // Uppercase first letter each word
    $("#firstName[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
    });
    //Validate numbers in format 99/99/99
    $("#dob").mask("99/99/9999",{placeholder:""});
    //Transform characters to uppercase
    $("#dlNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase() );
    });
    //Transform characters to uppercase
    $("#address[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase() );
    });
    //Transform characters to uppercase
    $("#domain[type=text]").keyup(function () {
        $(this).val($(this).val().toLowerCase());
    }); 
    //Validate numbers in format 99999
    $("#zipCode").mask("99999",{placeholder:""});
    //Validate numbers in format 99-99
    $("#height").mask("99-99",{placeholder:""});
    //Validate numbers in format 999
    $("#weight").mask("999",{placeholder:""});


    //Validations for Theft-Auto
    //Validate numbers, lenght 4
    $("#vehicleYear").mask("9999",{placeholder:""});
    // Uppercase first letter each word
    $("#vehicleMake[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
    });
    // Uppercase first letter each word
    $("#vehicleModel[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
    });
    // Uppercase first letter each word
    $("#vehicleTrim[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
    });
    // Uppercase first letter each word
    $("#vehicleColor[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
    });
    //Transform characters to uppercase
    $("#vehicleLicensePlate[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase() );
    });
    //Transform characters to uppercase
    $("#vehicleIdNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase() );
    });

});
