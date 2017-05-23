
//Validations for forms
jQuery(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Validation for Date and Time Reported in Create General Bolo - Theft Auto and Theft
    $('#dateReported').mask("99/99/9999",{placeholder:""});
    $('#timeReported').mask("99:99",{placeholder:""});
    $('label[for="dateReported"]').css("color", "red").show();
    $('label[for="timeReported"]').css("color", "red").show();

    $('#dateReported, #timeReported').keyup(function() {
        var empty1=false;
        var empty2=false;

        $('#dateReported').each(function() {
            if ($(this).val().length >= 10) {
                empty1 = false;
                $('label[for="dateReported"]').css("color", "black").show();
                $('#dateReported').css("color", "black").show();
            }
            else{
                empty1 = true;
                $('label[for="dateReported"]').css("color", "red").show();
                $('#dateReported').css("color", "red").show();
            }
        });

        $('#timeReported').each(function() {
            if ($(this).val().length >= 5) {
                empty2 = false;
                $('label[for="timeReported"]').css("color", "black").show();
                $('#timeReported').css("color", "black").show();
            }
            else{
                empty2 = true;
                $('label[for="timeReported"]').css("color", "red").show();
                $('#timeReported').css("color", "red").show();
            }

        });
        console.log('e1: '+empty1);
        console.log('e2: '+empty2);

        if (empty1===false && empty2===false) {
            $('#buttonClickCreate').attr('disabled', false);
        } else {
            $('#buttonClickCreate').attr('disabled', 'disabled');
        }
    });
    //End Validation for dateReported and timeReported

    //Validation for dateReported and timeReported not blank
    $('#buttonClickCreate').each(function() {
        if (($('#dateReported').val().length <=2) && ($('#timeReported').val().length <=1)){
            $('#buttonClickCreate').attr('disabled', 'disabled');
            return false;
        }
    });
    //End of validation for dateReported and timeReported

///////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Validation for Date, Time, ZipCode and Agency Recovered for Edit General Bolo - Theft Auto and Theft
    $('#status').each(function() {

    if ( this.value ==='' || this.value ==='Canceled'){
        $('label[for="dateRecovered"]').hide();
        $("#dateRecovered").hide();
        $('label[for="timeRecovered"]').hide();
        $("#timeRecovered").hide();
        $('label[for="addressRecovered"]').hide();
        $("#addressRecovered").hide();
        $('label[for="zipCodeRecovered"]').hide();
        $("#zipCodeRecovered").hide();
        $('label[for="agencyRecovered"]').hide();
        $("#agencyRecovered").hide();
    }
        $('#status').on('change', function() {

            if ( this.value ==='In Custody' || this.value ==='Located' || this.value ==='Recovered' ){

                $('label[for="dateRecovered"]').show();
                $("#dateRecovered").show();
                $('label[for="timeRecovered"]').show();
                $("#timeRecovered").show();
                $('label[for="addressRecovered"]').show();
                $("#addressRecovered").show();
                $('label[for="zipCodeRecovered"]').show();
                $("#zipCodeRecovered").show();
                $('label[for="agencyRecovered"]').show();
                $("#agencyRecovered").show();

                //Validation for Date, Time, ZipCode and Agency Recovered for Edit General Bolo - Theft Auto and Theft
                $('#dateRecovered').mask("99/99/9999",{placeholder:""});
                $('#timeRecovered').mask("99:99",{placeholder:""});
                $('#zipCodeRecovered').mask("99999",{placeholder:""});
                $('label[for="dateRecovered"]').css("color", "red").show();
                $('label[for="timeRecovered"]').css("color", "red").show();
                $('label[for="zipCodeRecovered"]').css("color", "red").show();
                $('label[for="agencyRecovered"]').css("color", "red").show();

                //Validation for dateReported and timeRecovered not blank
                $('#buttonClickEdit').each(function() {
                    if (($('#dateRecovered').val().length <=2) && ($('#timeRecovered').val().length <=1)){
                        $('#buttonClickEdit').attr('disabled', true);
                    }
                });

                $('#dateRecovered, #timeRecovered, #zipCodeRecovered, #agencyRecovered').keyup(function() {
                    var empty3=false;
                    var empty4=false;
                    var empty5=false;
                    var empty6=false;

                    $('#dateRecovered').each(function() {
                        if ($(this).val().length >= 10) {
                            empty3 = false;
                            $('label[for="dateRecovered"]').css("color", "black").show();
                            $('#dateRecovered').css("color", "black").show();

                        }
                        else{
                            empty3 = true;
                            $('label[for="dateRecovered"]').css("color", "red").show();
                            $('#dateRecovered').css("color", "red").show();
                        }
                    });

                    $('#timeRecovered').each(function() {
                        if ($(this).val().length >= 5) {
                            empty4 = false;
                            $('label[for="timeRecovered"]').css("color", "black").show();
                            $('#timeRecovered').css("color", "black").show();
                        }
                        else{
                            empty4 = true;
                            $('label[for="timeRecovered"]').css("color", "red").show();
                            $('#timeRecovered').css("color", "red").show();
                        }

                    });

                    $('#zipCodeRecovered').each(function() {
                        if ($(this).val().length >= 5) {
                            empty5 = false;
                            $('label[for="zipCodeRecovered"]').css("color", "black").show();
                            $('#zipCodeRecovered').css("color", "black").show();
                        }
                        else{
                            empty5 = true;
                            $('label[for="zipCodeRecovered"]').css("color", "red").show();
                            $('#zipCodeRecovered').css("color", "red").show();
                        }

                    });

                    $('#agencyRecovered').each(function() {
                        if ($(this).val().length >= 3) {
                            empty6 = false;
                            $('label[for="agencyRecovered"]').css("color", "black").show();
                            $('#agencyRecovered').css("color", "black").show();
                        }
                        else{
                            empty6 = true;
                            $('label[for="agencyRecovered"]').css("color", "red").show();
                            $('#agencyRecovered').css("color", "red").show();
                        }

                    });

                    console.log('e3: '+empty3);
                    console.log('e4: '+empty4);

                    if (empty3===false && empty4===false && empty5===false && empty6===false) {
                        $('#buttonClickEdit').attr('disabled', false);
                    } else {
                        $('#buttonClickEdit').attr('disabled', true);
                    }
                });
                //End Validation for dateReported and timeReported

            }
            else{
                $('label[for="dateRecovered"]').hide();
                $("#dateRecovered").hide();
                $('label[for="timeRecovered"]').hide();
                $("#timeRecovered").hide();
                $('label[for="addressRecovered"]').hide();
                $("#addressRecovered").hide();
                $('label[for="zipCodeRecovered"]').hide();
                $("#zipCodeRecovered").hide();
                $('label[for="agencyRecovered"]').hide();
                $("#agencyRecovered").hide();

                //Validation for dateReported and timeReported not blank
                $('#buttonClickEdit').each(function() {
                    if (($('#dateRecovered').val().length >=0) && ($('#timeRecovered').val().length >=0)){
                        $('#buttonClickEdit').attr('disabled', false);
                    }
                });

            }
        });
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Validations for General bolo

    // Uppercase first letter each word Last Name
    $("#lastName[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    // Uppercase first letter each word First Name
    $("#firstName[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    //Validate numbers in format 99/99/99 Date of Birth
    $("#dob").mask("99/99/9999",{placeholder:""});
    //Transform characters to uppercase
    $("#dlNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });
    //Transform characters to uppercase Address
    $("#address[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });
    //Validate numbers in format 99999 Xip Code
    $("#zipCode").mask("99999",{placeholder:""});
    //Validate numbers in format 99-99 Height
    $("#height").mask("99-99",{placeholder:""});
    //Validate numbers in format 999 Weight
    $("#weight").mask("999",{placeholder:""});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Validations for Theft-Auto

    //Validate numbers, lenght 4 Vehicle Year
    $("#vehicleYear").mask("9999",{placeholder:""});
    // Uppercase first letter each word Vehicle Model
    $("#vehicleModel[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    // Uppercase first letter each word Vehicle Trim
    $("#vehicleTrim[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    // Uppercase first letter each word Vehicle Color
    $("#vehicleColor[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    //Transform characters to uppercase Vehicle License Plate
    $("#vehicleLicensePlate[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });
    //Transform characters to uppercase Vehicle VIN
    $("#vehicleIdNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Validations for Theft-Boat VESSEL

    //Validate numbers, lenght 4 Boat Year
    $("#boatYear").mask("9999",{placeholder:""});
    // Uppercase first letter each word Boat Manufacturer
    $("#boatManufacturer[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    // Uppercase first letter each word Boat Type
    $("#boatType[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    // Uppercase first letter each word Boat Color
    $("#boatColor[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    //Transform characters to uppercase Hull ID
    $("#boatHullIdNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });
    //Transform characters to uppercase Vehicle VIN
    $("#boatRegistrationNumberNu[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    }).mask("9999aa",{placeholder:""});

//Validations for Theft-Boat PROPULSION
    // Uppercase first letter each word Boat Model
    $("#boatModel[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    //Transform characters to uppercase Propulsion Serial Number
    $("#propulsionSerialNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });

//Validations for Theft-Boat TRAILER

    // Uppercase first letter each word Trailer Manufacturer
    $("#trailerManufacturer[type='text']").keyup(function(evt){
        var txt = $(this).val();
        $(this).val(txt.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase();}));
    });
    //Transform characters to uppercase Trailer VIN
    $("#trailerVIN[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });

    //Transform characters to uppercase Trailer Tag License Number
    $("#trailerTagLicenseNumber[type=text]").keyup(function(){
        $(this).val( $(this).val().toUpperCase());
    });

});
