'use strict';
var _ = require('lodash');
var Promise = require('promise');
var path = require('path');

function PDFService() {}

/**
 * This function builds a PDF of the user's guide according to the user's tier.
 * tier 4 === ROOT
 * tier 3 === ADMINSTRATION
 * tier 2 === SUPERVISOR
 * tier 1 === OFFICER
 *
 * @params user
 * @params doc
 * @Author John Burke
 */
PDFService.prototype.genUserGuide = function(user, doc) {
  var INTRO = "   Welcome to the BOLO Flyer Crator, a Situational Awareness " +
  "Multi-Jurisdictional Resource. Every user of BOLO has access to " +
  "different features and therefore a different user's guide will be " +
  "custom tailored specific to each user. Upon logging into BOLO you " +
  "will be brought to the home page. This is where you view your BOLOs " +
  "along with other BOLOs from officers within your agency. In addition " +
  "to viewing BOLOs from your agency, you may also opt to view BOLOs " +
  "from other agencies too. The first instruction will be the most " +
  "important tailored for you. If you are root or admin, it will be user " +
  "and agency management. for other user it will be how to create a bolo. " +
  "A BOLO can have up to several buttons on it that will be explained. " +
  "From the home page you will also see several other links accessible " +
  "across the top. For mobile devices will have a dropdown menu accessible " +
  "from the top right corner of your screen. All these links will be " +
  "explained shortly in easy to follow step by step instructions. If some " +
  "reason you notice something wrong with your user details (i.e. your " +
  "have a name changeor something of that nature), you will need to " +
  "contact your agency administration immediately.\n";

  var AGENCY_MANAGMENT_ROOT = "  1) Click on 'Admin'\n" +
  "  2) Click on 'Agency Management'\n" +
  "  * * * Create a new Agency\n" +
  "  3) Click on 'Add new agency'\n" +
  "  4) Enter or Modify any fields required\n" +
  "  5) Enter 'Logo' image\n" +
  "  6) Enter 'Shield' image\n" +
  "  7) Enter 'Water  Mark' image\n" +
  "  8) Click 'Submit'\n" +
  "  * * * Up date an Angency\n" +
  "  3) Click on 'Blue Astric' to the left on the agency\n" +
  "  4) Enter or Modify any fields required\n" +
  "  5) Enter or update 'Logo' image\n" +
  "  6) Enter or update 'Shield' image\n" +
  "  7) Enter or update 'Water  Mark' image\n" +
  "  8) Click 'Submit'\n";

  var AGENCY_MANAGMENT_ADMIN = "  1) Click on 'Admin'\n" +
  "  2) Click on 'Agency Management'\n" +
  "  3) Click on 'Blue Astric' to the left on the agency\n" +
  "  4) Enter or Modify any fields required\n" +
  "  5) Enter or update 'Logo' image\n" +
  "  6) Enter or update 'Shield' image\n" +
  "  7) Enter or update 'Water  Mark' image\n" +
  "  8) Chose to allow officers to opt out of viewing BOLOs from their agency\n" +
  "  9) Click 'Submit'\n";

  var DATA_ANALYSIS = "  1) Click on 'Admin'\n" +
  "  2) Click on 'Data Analysis'\n" +
  "  3) Select an 'Agency'\n";
  +"  4) Select a 'Start Date'\n" + "  5) Select an End Date\n" + "  6) Click 'Submit'\n";

  var DATA_SUBSCRIBER = "  1) Click on 'Admin'\n" +
  "  2) Click on 'Data Subscriber'\n" +
  "  3) Click on 'Add New Data Subscriber'\n" +
  "  4) Fill in data subscriber's ID, Name and email\n" +
  "  5) Click 'Submit'\n";

  var SYSTEM_SETTING = "  1) Click on 'Admin'\n" +
  "  2) Click on 'System Settings'\n" +
  "  3) Select the number of minutes for the system to time out for all users\n" +
  "     * Time can be set between 10 and 240 minutes (recommended less than 60 minutes)\n" +
  "  4) Set the number of brute force login attempts between 3 and 10\n" +
  "     * A user locked out of the system will be required to reset their password\n" +
  "  5) click 'Submit'\n";

  var USER_MANAGENT = "  1) Click on 'Admin'\n" +
  "  2) Click on 'User Management'\n" +
  "  * * Add a new user's profile * *\n" +
  "  3) Click on 'Add New User'\n" +
  "  4) Fill in the empty fields\n" +
  "  5) Click 'Submit'\n";
  +"  * * Update a user's profile * *\n" + "  3) Click on blue 'Astric' on the right of the user\n" + "  4) Update required fields\n" + "  5) Click 'Submit'\n";

  var CREATE_BOLO = "  1) Click 'Create' and select Auto, Boat or General BOLO.\n" +
  "  * * Select Auto BOLO * *\n" +
  "  2) Enter the reported time and date (required)\n" +
  "  3) Fill in additional fields.\n" +
  "  4) Upload available images.\n" +
  "  5) Add a video link (if available)\n" +
  "  6) FIll in the summery.\n" +
  "  7) Click the 'Preview' Button to make sure you have added everything.\n" +
  "  8) Click 'Back to Create BOLO' to go back to the BOLO.\n" +
  "  9) Repeat Steps 2 - 7 until all information is complete.\n" +
  "  10) Click 'Submit' to submit your BOLO.\n" +
  "  11) Goto to your registered email and click on the confirmation link.\n";
  +"  * * Select BOAT BOLO * *\n" + "  2) Enter the reported time and date (required)\n" + "  3) Fill in additional fields.\n" + "  4) Fill in propulsion and trailer details\n" + "  5) Upload available images.\n" + "  6) Add a video link (if available)\n" + "  7) FIll in the summary.\n" + "  8) Click the 'Preview' Button to make sure you have added everything.\n" + "  9) Click 'Back to Create BOLO' to go back to the BOLO.\n" + "  10) Repeat Steps 2 - 7 until all information is complete.\n" + "  11) Click 'Submit' to submit your BOLO.\n" + "  12) Goto to your registered email and click on the confirmation link.\n";
  +"  * * Select General BOLO * *\n" + "  2) Enter the reported time and date (required)\n" + "  3) Select a category (required)\n" + "  4) Fill in additional fields.\n" + "  5) Upload available images.\n" + "  6) Add a video link (if available)\n" + "  7) FIll in the summery.\n" + "  8) Click the 'Preview' Button to make sure you have added everything.\n" + "  9) Click 'Back to Create BOLO' to go back to the BOLO.\n" + "  10) Repeat Steps 2 - 7 until all information is complete.\n" + "  11) Click 'Submit' to submit your BOLO.\n" + "  12) Goto to your registered email and click on the confirmation link.\n";

  var EDIT = "  * You can only see this option if you created the BOLO\n" +
  "  1) Click on 'Edit'\n" +
  "  2) Select a 'Status'\n" +
  "  3) Enter the recovered date and time (required)\n" +
  "  * If you select cancelled you can skip to step (6)\n" +
  "  4) Select and fill any field you want to update\n" +
  "  5) View your updates before posting\n" +
  "  6) Click 'Submit'\n";
  +"  7) Confirmation email will be sent to your email\n" + "  8) Go to our email and confirm the BOLO\n";

  var DETAILS = "  1) Click on 'Details'\n" +
  "  2) Review details of a selected BOLO\n" +
  "  3) Select 'Generate PDF' \n" +
  "  4) Select 'Deatils'\n" +
  "  * details shows who has edit this BOLO in the past\n" +
  "  5) Click 'Back' to go back to the BOLOs\n";

  var FILTER_BY_ME = "  1) Click 'Filter By'\n" +
  "  2) Select filter:\n" +
  "     * My BOLO\n" +
  "     * My Agency\n" +
  "     * All BOLOs\n" +
  "  3) Results BOLOs will display";

  var FILTER_BY_AGENCY = "  1) Click 'Select Agencies'\n" +
  "  2) Select one or several agencies\n" +
  "  3) Click 'Submit'\n" +
  "  4) Results BOLOs will display";

  var ARCHIVE_ALL = "  You may view archived BOLOs just in case " +
  "you are looking for someone who fits the description of " +
  "another crime.\n";

  var ARCHIVE_ADMIN = "  1) Click on 'Archive'\n" +
  "  2) The Bolo will be moved into the archived BOLOs\n" +
  "  3) At this point you may 'Restore', 'Delete' or 'Purge' the BOLO\n";

  var DATA_SUBSCRIBER = "Each BOLO has three options that you may change'\n" +
  "  1) Status'\n" +
  "  2) Restore'\n" +
  "  3) Delete'\n";

  var AGENCY_VIEW = "  1) Click on agency to view a list of partnering agencies.\n" +
  "  2) Select an agency and view contact information or verify the" +
  " agency's 'Logo' and 'Shield.'\n";

  var SEARCH = "  1) Select any field(s) you wish to search.\n" +
  "  2) Enter information value of field(s).\n" +
  "  3) Wild card search is for something you can not search with an" +
  " optional search.\n" +
  "  4) Click 'Search'\n";

  var FILTER = "  1) Click on 'Details'\n" +
  "  2) Review details of a selected BOLO\n" +
  "  3) Click 'Home' to go back to the BOLOs\n";

  var NOTIFICATIONS = "  1) Click on your 'Username'\n" +
  "  2) Click on 'Settings' from the dropdown\n" +
  "  3) Click on 'Notifications'\n" +
  "  4) Click on 'Subscribe to other Agencies at the bottom left'\n" +
  "  5) Select agencies to recieve notifications\n" +
  "  *** You may also unsubribe from an angency ***\n" +
  "  6) Select agencies to remove from your list of Agencies\n" +
  "  7) Click 'Unscribe Selected'\n";

  var PASSWORD = "  1) Click on your 'Username'\n" +
  "  2) Click on 'Settings' from the dropdown\n" +
  "  3) Click 'Change Password'\n" +
  "  4) Enter new password\n" +
  "  5) enter confirmation password\n" +
  "  6) Click 'Submit'\n";

  // This is the file path for the live website
  doc.image(path.resolve('src/web/public/img/BOLObanner.jpg'), 10, 10, {scale: 1.0});

  // Introduction for tier levels
  doc.font('Times-Roman');
  doc.fillColor('red');
  doc.fontSize(12).text("UNCLASSIFIED// FOR OFFICIAL LAW ENFORCEMENT USE ONLY", 100, 200, {align: 'center'}).moveDown(.5);

  // set
  doc.fillColor('black');

  // Introduction
  doc.fontSize(15).text("Introduction", {align: 'center'}).moveDown(0.5);
  doc.fontSize(12).text(INTRO, {align: 'left'}).moveDown(2);

  // print for admin
  if (user.tier === 3) {

    // agency management
    doc.fontSize(15).text("Agencgy Management").moveDown(0.25);
    doc.fontSize(12).text(AGENCY_MANAGMENT_ADMIN, {align: 'left'}).moveDown();
  }

  // print for root
  if (user.tier === 4) {

    // agency management
    doc.fontSize(15).text("Agency Management").moveDown(0.25);
    doc.fontSize(12).text(AGENCY_MANAGMENT_ROOT, {align: 'left'}).moveDown();

    // Data Analysis
    doc.fontSize(15).text("Data Analysis").moveDown(0.25);
    doc.fontSize(12).text(DATA_ANALYSIS, {align: 'left'}).moveDown();

    // Data Subscriber
    doc.fontSize(15).text("Data Subscriber").moveDown(0.25);
    doc.fontSize(12).text(DATA_SUBSCRIBER, {align: 'left'}).moveDown();

    // system setting
    doc.fontSize(15).text("System Settings").moveDown(0.25);
    doc.fontSize(12).text(SYSTEM_SETTING, {align: 'left'}).moveDown();
  }

  // print for root and admin
  if (user.tier === 4 || user.tier === 3) {

    // User management
    doc.fontSize(15).text("User Management").moveDown(0.25);
    doc.fontSize(12).text(USER_MANAGENT, {align: 'left'}).moveDown();
  }

  // print for ALL user
  // Create BOLO
  doc.fontSize(15).text("Create a BOLO").moveDown(0.25);
  doc.fontSize(12).text(CREATE_BOLO, {align: 'left'}).moveDown();

  // Edit
  doc.fontSize(15).text("Edit a BOLO").moveDown(0.25);
  doc.fontSize(12).text(EDIT, {align: 'left'}).moveDown();

  // Details (link at bottom of BOLO)
  doc.fontSize(15).text("View Details of a BOLO").moveDown(0.25);
  doc.fontSize(12).text(DETAILS, {align: 'left'}).moveDown();

  // Filter by Me
  doc.fontSize(15).text("Filter By Me").moveDown(0.25);
  doc.fontSize(12).text(FILTER_BY_ME, {align: 'left'}).moveDown();

  // Filter by Agency
  doc.fontSize(15).text("Filter by Agency").moveDown(0.25);
  doc.fontSize(12).text(FILTER_BY_AGENCY, {align: 'left'}).moveDown();

  // Archive (link at the top)
  doc.fontSize(15).text("Archive").moveDown(0.25);
  doc.fontSize(12).text(ARCHIVE_ALL, {align: 'left'}).moveDown();

  // print for admin and root
  if (user.tier === 4 || user.tier === 3) {

    // Archive (link at bottom of BOLO)
    doc.fontSize(15).text("Archive (Admin)").moveDown(0.25);
    doc.fontSize(12).text(ARCHIVE_ADMIN, {align: 'left'}).moveDown();
  }

  // Agency
  doc.fontSize(15).text("Agency").moveDown(0.25);
  doc.fontSize(12).text(AGENCY_VIEW, {align: 'left'}).moveDown();

  // Search
  doc.fontSize(15).text("Search").moveDown(0.25);
  doc.fontSize(12).text(SEARCH, {align: 'left'}).moveDown();

  // Filter by Agency
  doc.fontSize(15).text("FIlter by Agency").moveDown(0.25);
  doc.fontSize(12).text(FILTER, {align: 'left'}).moveDown();

  // Notifications
  doc.fontSize(15).text("Notifications").moveDown(0.25);
  doc.fontSize(12).text(NOTIFICATIONS, {align: 'left'}).moveDown();

  // Password Reset
  doc.fontSize(15).text("Password Reset").moveDown(0.25);
  doc.fontSize(12).text(PASSWORD, {align: 'left'}).moveDown();

  return doc;
};

/**
 *
 */
PDFService.prototype.genDetailsPdf = function(doc, data) {
  doc.fontSize(8);
  doc.fillColor('red');
  doc.text("UNCLASSIFIED// FOR OFFICIAL USE ONLY// LAW ENFORCEMENT SENSITIVE", 120, 15).moveDown(0.25);
  doc.fillColor('black');
  doc.text(data.agency.name + " Police Department").moveDown(0.25);
  doc.text(data.agency.address).moveDown(0.25);
  doc.text(data.agency.city + ", " + data.agency.state + ", " + data.agency.zip).moveDown(0.25);
  doc.text(data.agency.phone).moveDown(0.25);
  doc.fontSize(20);
  doc.fillColor('red');
  doc.text(data.bolo.category, 0, 115, {align: 'center'}).moveDown();

  // this will display the status only if it is not New
  doc.fontSize(23);
  if (data.bolo.status !== "New") {
    doc.fillColor('red');
    doc.text(data.bolo.status, 65, 130, {align: 'left'}). //original 100, 140
    moveDown();
  }
  doc.fontSize(11);
  doc.fillColor('black');
  doc.fontSize(11);
  doc.font('Times-Roman').text("Bolo ID: " + data.bolo.id, 300).moveDown();

  if (data.bolo.category === "THEFT - AUTO") { //PDF for theft - auto

    // Display year only if there is a value in it
    if (data.bolo['vehicleYear'] !== "") {
      doc.font('Times-Roman').text("Year: " + data.bolo['vehicleYear'], 300).moveDown();
    }

    // Display make only if there is a value in it
    if (data.bolo.vehicleMake !== "") {
      doc.font('Times-Roman').text("Make: " + data.bolo.vehicleMake, 300).moveDown();
    }

    // Display Model only if there is a value in it
    if (data.bolo.vehicleModel !== "") {
      doc.font('Times-Roman').text("Model: " + data.bolo.vehicleModel, 300).moveDown();
    }

    // Display Style only if there is a value in it
    if (data.bolo['vehicleStyle'] !== "") {
      doc.font('Times-Roman').text("Type: " + data.bolo['vehicleStyle'], 300).moveDown();
    }

    // Display color only if there is a value in it
    if (data.bolo['vehicleColor'] !== "") {
      doc.font('Times-Roman').text("Color: " + data.bolo['vehicleColor'], 300).moveDown();
    }

    // Display VIN only if there is a value in it
    if (data.bolo['vehicleIdNumber'] !== "") {
      doc.font('Times-Roman').text("Identification Number: " + data.bolo['vehicleIdNumber'], 300).moveDown();
    }

    // Display Tag License Plate only if there is a value in it
    if (data.bolo['vehicleLicenseState'] !== "" || data.bolo['vehicleLicensePlate'] !== "") {
      doc.font('Times-Roman').text("Tag License Plate: " + data.bolo['vehicleLicenseState'] + data.bolo['vehicleLicensePlate'], 300).moveDown();
    }

  } else if (data.bolo.category === "THEFT - BOAT") { //PDF for theft - boatMake

    //VESSEL
    //Display tittle VESSEL
    doc.fillColor('red');
    doc.fontSize(11);
    doc.font('Times-Roman').text("VESSEL", 300).moveDown();
    doc.fillColor('black');

    // Display Year only if there is a value in it
    if (data.bolo['boatYear'] !== "") {
      doc.font('Times-Roman').text("Year: " + data.bolo['boatYear'], 300).moveDown();
    }

    // Display Model only if there is a value in it
    if (data.bolo['boatModel'] !== "") {
      doc.font('Times-Roman').text("Model: " + data.bolo['boatModel'], 300).moveDown();
    }

    // Display Model only if there is a value in it
    if (data.bolo.boatType !== "") {
      doc.font('Times-Roman').text("Type:" + data.bolo.boatType, 300).moveDown();
    }

    // Display Length only if there is a value in it
    if (data.bolo['boatLength'] !== "") {
      doc.font('Times-Roman').text("Length: " + data.bolo['boatLength'], 300).moveDown();
    }

    // Display Color only if there is a value in it
    if (data.bolo['boatColor'] !== "") {
      doc.font('Times-Roman').text("Color: " + data.bolo['boatColor'], 300).moveDown();
    }

    // Display HIN only if there is a value in it
    if (data.bolo['boatHullIdNumber'] !== "") {
      doc.font('Times-Roman').text("Hull Identification Number (HIN): " + data.bolo['boatHullIdNumber'], 300).moveDown();
    }

    // Display Registration Number only if there is a value in it
    if (data.bolo['boatRegistrationNumberSt'] !== "" || data.bolo['boatRegistrationNumberNu'] !== "") {
      doc.font('Times-Roman').text("Registration Number: " + data.bolo['boatRegistrationNumberSt'] + data.bolo['boatRegistrationNumberNu'], 300).moveDown();
    }

    //Display tittle PROPULSION
    doc.fillColor('red');
    doc.fontSize(11);
    doc.font('Times-Roman').text("PROPULSION", 300).moveDown();
    doc.fillColor('black');

    // Display Propulsion only if there is a value in it
    if (data.bolo['propulsion'] !== "") {
      doc.font('Times-Roman').text("Propulsion: " + data.bolo['propulsion'], 300).moveDown();
    }

    // Display Type only if there is a value in it
    if (data.bolo['propulsionType'] !== "") {
      doc.font('Times-Roman').text("Type: " + data.bolo['propulsionType'], 300).moveDown();
    }

    // Display Make only if there is a value in it
    if (data.bolo['propulsionMake'] !== "") {
      doc.font('Times-Roman').text("Make: " + data.bolo['propulsionMake'], 300).moveDown();
    }

    //Display tittle TRAILER
    doc.fillColor('red');
    doc.fontSize(11);
    doc.font('Times-Roman').text("TRAILER", 300).moveDown();
    doc.fillColor('black');

    // Display Trailer only if there is a value in it
    if (data.bolo['trailer'] !== "") {
      doc.font('Times-Roman').text("Trailer: " + data.bolo['trailer'], 300).moveDown();
    }

    // Display Manufacturer only if there is a value in it
    if (data.bolo['trailerManufacturer'] !== "") {
      doc.font('Times-Roman').text("Manufacturer: " + data.bolo['trailerManufacturer'], 300).moveDown();
    }

    // Display Vehicle ID Number only if there is a value in it
    if (data.bolo['trailerVIN'] !== "") {
      doc.font('Times-Roman').text("Vehicle Identification Number: " + data.bolo['trailerVIN'], 300).moveDown();
    }

    // Display Tag License Plate only if there is a value in it
    if (data.bolo['trailerTagLicenseState'] !== "" || data.bolo['trailerTagLicenseNumber'] !== "") {
      doc.font('Times-Roman').text("Tag License Plate: " + data.bolo['trailerTagLicenseState'] + data.bolo['trailerTagLicenseNumber'], 300).moveDown();
    }
  } else { //PDF for general bolo

    // Display First name
    if (data.bolo.firstName !== "") {
      doc.font('Times-Roman').text("First Name: " + data.bolo.firstName, 300).moveDown();
    }

    // Display last name
    if (data.bolo.lastName !== "") {
      doc.font('Times-Roman').text("Last Name: " + data.bolo.lastName, 300).moveDown();
    }

    // Display race only if there is a value in it
    if (data.bolo['race'] !== "") {
      doc.font('Times-Roman').text("Race: " + data.bolo['race'], 300).moveDown();
    }

    // Display Date Of Birth only if there is a value in it
    if (data.bolo['dob'] !== "") {
      doc.font('Times-Roman').text("DOB: " + data.bolo['dob'], 300).moveDown();
    }

    // Display Driver Licence Number only if there is a value in it
    if (data.bolo['dlNumber'] !== "") {
      doc.font('Times-Roman').text("License#: " + data.bolo['dlNumber'], 300).moveDown();
    }

    // Display Address only if there is a value in it
    if (data.bolo['address'] !== "") {
      doc.font('Times-Roman').text("Address: " + data.bolo['address'], 300).moveDown();
    }

    // Display Zip Code only if there is a value in it
    if (data.bolo['zipCode'] !== "") {
      doc.font('Times-Roman').text("Zip Code: " + data.bolo['zipCode'], 300).moveDown();
    }

    // Display Height only if there is a value in it
    if (data.bolo['height'] !== "") {
      doc.font('Times-Roman').text("Height: " + data.bolo['height'], 300).moveDown();
    }

    // Display Weight only if there is a value in it
    if (data.bolo['weight'] !== "") {
      doc.font('Times-Roman').text("Weight: " + data.bolo['weight'] + " lbs", 300).moveDown();
    }

    // Display Sex only if there is a value in it
    if (data.bolo['sex'] !== "") {
      doc.font('Times-Roman').text("Sex: " + data.bolo['sex'], 300).moveDown();
    }

    // Display Hair Color only if there is a value in it
    if (data.bolo['hairColor'] !== "") {
      doc.font('Times-Roman').text("Hair Color: " + data.bolo['hairColor'], 300).moveDown();
    }

    // Display Tattoos/Scars only if there is a value in it
    if (data.bolo['tattoos'] !== "") {
      doc.font('Times-Roman').text("Tattoos/Scars: " + data.bolo['tattoos'], 300).moveDown();
    }
  } //end of specific data

  // Created
  doc.font('Times-Bold').text("Created: " + data.bolo.createdOn, 15, 360).moveDown();

  //For Data Analysis Reported
  if (data.bolo['dateReported'] !== "") {
    doc.font('Times-Roman').text("Date Reported: " + data.bolo['dateReported'], 15).moveDown(0.25);
  }
  if (data.bolo['timeReported'] !== "") {
    doc.font('Times-Roman').text("Time Reported: " + data.bolo['timeReported'], 15).moveDown();
  }

  //For Data Analysis Recovered
  if (data.bolo['dateRecovered'] !== "") {
    doc.font('Times-Roman').text("Date Recovered: " + data.bolo['dateRecovered'], 15).moveDown(0.25);
  }
  if (data.bolo['timeRecovered'] !== "") {
    doc.font('Times-Roman').text("Time Recovered: " + data.bolo['timeRecovered'], 15).moveDown(0.25);
  }
  if (data.bolo['addressRecovered'] !== "") {
    doc.font('Times-Roman').text("Address Recovered: " + data.bolo['addressRecovered'], 15).moveDown(0.25);
  }
  if (data.bolo['zipCodeRecovered'] !== "") {
    doc.font('Times-Roman').text("Zip Code Recovered: " + data.bolo['zipCodeRecovered'], 15).moveDown(0.25);
  }
  if (data.bolo['agencyRecovered'] !== "") {
    doc.font('Times-Roman').text("Agency Recovered: " + data.bolo['agencyRecovered'], 15).moveDown();
  }

  // Display Additional Informatin only if there is a value in it
  if (data.bolo['additional'] !== "") {
    doc.font('Times-Bold').text("Additional: ", 15).moveDown(0.25);
    doc.font('Times-Roman').text(data.bolo['additional'], {width: 281}).moveDown();
  }

  // Display a Summery only if there is a value in it
  if (data.bolo['summary'] !== "") {
    doc.font('Times-Bold').text("Summary: ", 15).moveDown(0.25);
    doc.font('Times-Roman').text(data.bolo['summary'], {width: 281}).moveDown();
  }

  doc.font('Times-Bold').text("This BOLO was created by: " + data.user.sectunit + " " + data.user.ranktitle + " " + data.bolo.authorFName + " " + data.bolo.authorLName, {width: 281}).moveDown(0.25);
  doc.font('Times-Bold').text("Please contact the agency should clarification be required.", {width: 281});

  return doc;
};

/**
 * This is used to handle the data for the pdfPreview in Create Bolo View
 **/
PDFService.prototype.genPreviewPDF = function(doc, data) {

  doc.fontSize(8);
  doc.fillColor('red');
  doc.text("UNCLASSIFIED// FOR OFFICIAL USE ONLY// LAW ENFORCEMENT SENSITIVE", 120, 15).moveDown(0.25);
  doc.fillColor('black');
  doc.text(data.agency_name + " Police Department").moveDown(0.25);
  doc.text(data.agency_address).moveDown(0.25);
  doc.text(data.agency_city + ", " + data.agency_state + ", " + data.agency_zip).moveDown(0.25);
  doc.text(data.agency_phone).moveDown(0.25);
  doc.fontSize(20);
  doc.fillColor('red');
  doc.text(data.bolo.category, 0, 115, {align: 'center'}).moveDown();
  doc.fontSize(11);

  // Display Status only if there is a value in it other then "New"
  if (data.bolo.status !== "New") {
    doc.fillColor('red');
    doc.text(data.bolo.status, 100, 140, {align: 'left'}).moveDown();
  }
  doc.fillColor('black');
  doc.fontSize(11);
  if (data.bolo.id === null) {
    doc.font('Times-Roman').text("Bolo ID: " +
      "NO ID AVAILABLE",
    300).moveDown();
  } else {
    doc.font('Times-Roman').text("Bolo ID: " + data.bolo.id, 300).moveDown();
  }

  if (data.bolo.category === "THEFT - AUTO") { //PDF for theft - auto

    // Display Year only if there is a value in it
    if (data.bolo['vehicleYear'] !== "") {
      doc.font('Times-Roman').text("Year: " + data.bolo['vehicleYear'], 300).moveDown();
    }

    // Display Make only if there is a value in it
    if (data.bolo.vehicleMake !== "") {
      doc.font('Times-Roman').text("Make: " + data.bolo.vehicleMake, 300).moveDown();
    }

    // Display Model only if there is a value in it
    if (data.bolo.vehicleModel !== "") {
      doc.font('Times-Roman').text("Model: " + data.bolo.vehicleModel, 300).moveDown();
    }

    // Display Style only if there is a value in it
    if (data.bolo['vehicleStyle'] !== "") {
      doc.font('Times-Roman').text("Type: " + data.bolo['vehicleStyle'], 300).moveDown();
    }

    // Display Color only if there is a value in it
    if (data.bolo['vehicleColor'] !== "") {
      doc.font('Times-Roman').text("Color: " + data.bolo['vehicleColor'], 300).moveDown();
    }

    // Display VIN only if there is a value in it
    if (data.bolo['vehicleIdNumber'] !== "") {
      doc.font('Times-Roman').text("Identification Number: " + data.bolo['vehicleIdNumber'], 300).moveDown();
    }

    // Display License Plate only if there is a value in it
    if (data.bolo['vehicleLicensePlate'] !== "") {
      doc.font('Times-Roman').text("License Plate: " + data.bolo['vehicleLicensePlate'], 300).moveDown();
    }

  } else if (data.bolo.category === "THEFT - BOAT") { //PDF for theft - boat

    //VESSEL
    //Display tittle VESSEL
    doc.fillColor('red');
    doc.fontSize(11);
    doc.font('Times-Roman').text("VESSEL", 300).moveDown();
    doc.fillColor('black');

    // Display Year only if there is a value in it
    if (data.bolo['boatYear'] !== "") {
      doc.font('Times-Roman').text("Year: " + data.bolo['boatYear'], 300).moveDown();
    }

    // Display Make only if there is a value in it
    if (data.bolo.boatManufacturer !== "") {
      doc.font('Times-Roman').text("Manufacturer: " + data.bolo.boatManufacturer, 300).moveDown();
    }

    // Display Model only if there is a value in it
    if (data.bolo['boatModel'] !== "") {
      doc.font('Times-Roman').text("Model: " + data.bolo['boatModel'], 300).moveDown();
    }

    // Display Model only if there is a value in it
    if (data.bolo.boatType !== "") {
      doc.font('Times-Roman').text("Type:" + data.bolo.boatType, 300).moveDown();
    }

    // Display Length only if there is a value in it
    if (data.bolo['boatLength'] !== "") {
      doc.font('Times-Roman').text("Length: " + data.bolo['boatLength'], 300).moveDown();
    }

    // Display Color only if there is a value in it
    if (data.bolo['boatColor'] !== "") {
      doc.font('Times-Roman').text("Color: " + data.bolo['boatColor'], 300).moveDown();
    }

    // Display HIN only if there is a value in it
    if (data.bolo['boatHullIdNumber'] !== "") {
      doc.font('Times-Roman').text("Hull Identification Number (HIN): " + data.bolo['boatHullIdNumber'], 300).moveDown();
    }

    // Display Registration Number only if there is a value in it
    if (data.bolo['boatRegistrationNumberSt'] !== "" || data.bolo['boatRegistrationNumberNu'] !== "") {
      doc.font('Times-Roman').text("Registration Number: " + data.bolo['boatRegistrationNumberSt'] + data.bolo['boatRegistrationNumberNu'], 300).moveDown();
    }

    //Display tittle PROPULSION
    doc.fillColor('red');
    doc.fontSize(11);
    doc.font('Times-Roman').text("PROPULSION", 300).moveDown();
    doc.fillColor('black');

    // Display Propulsion only if there is a value in it
    if (data.bolo['propulsion'] !== "") {
      doc.font('Times-Roman').text("Propulsion: " + data.bolo['propulsion'], 300).moveDown();
    }

    // Display Type only if there is a value in it
    if (data.bolo['propulsionType'] !== "") {
      doc.font('Times-Roman').text("Type: " + data.bolo['propulsionType'], 300).moveDown();
    }

    // Display Make only if there is a value in it
    if (data.bolo['propulsionMake'] !== "") {
      doc.font('Times-Roman').text("Make: " + data.bolo['propulsionMake'], 300).moveDown();
    }

    //Display tittle TRAILER
    doc.fillColor('red');
    doc.fontSize(11);
    doc.font('Times-Roman').text("TRAILER", 300).moveDown();
    doc.fillColor('black');

    // Display Trailer only if there is a value in it
    if (data.bolo['trailer'] !== "") {
      doc.font('Times-Roman').text("Trailer: " + data.bolo['trailer'], 300).moveDown();
    }

    // Display Manufacturer only if there is a value in it
    if (data.bolo['trailerManufacturer'] !== "") {
      doc.font('Times-Roman').text("Manufacturer: " + data.bolo['trailerManufacturer'], 300).moveDown();
    }

    // Display Vehicle ID Number only if there is a value in it
    if (data.bolo['trailerVIN'] !== "") {
      doc.font('Times-Roman').text("Vehicle Identification Number: " + data.bolo['trailerVIN'], 300).moveDown();
    }

    // Display Tag License Plate only if there is a value in it
    if (data.bolo['trailerTagLicenseState'] !== "" || data.bolo['trailerTagLicenseNumber'] !== "") {
      doc.font('Times-Roman').text("Tag License Plate: " + data.bolo['trailerTagLicenseState'] + data.bolo['trailerTagLicenseNumber'], 300).moveDown();
    }
  } else { //PDF for general bolo

    // Display First name
    if (data.bolo.firstName !== "") {
      doc.font('Times-Roman').text("First Name: " + data.bolo.firstName, 300).moveDown();
    }

    // Display last name
    if (data.bolo.lastName !== "") {
      doc.font('Times-Roman').text("Last Name: " + data.bolo.lastName, 300).moveDown();
    }

    // Display Race only if there is a value in it
    if (data.bolo['race'] !== "") {
      doc.font('Times-Roman').text("Race: " + data.bolo['race'], 300).moveDown();
    }

    // Display Make only if there is a value in it
    if (data.bolo['dob'] !== "") {
      doc.font('Times-Roman').text("DOB: " + data.bolo['dob'], 300).moveDown();
    }

    // Display Driver's Licence Number only if there is a value in it
    if (data.bolo['dlNumber'] !== "") {
      doc.font('Times-Roman').text("License#: " + data.bolo['dlNumber'], 300).moveDown();
    }

    // Display Address only if there is a value in it
    if (data.bolo['address'] !== "") {
      doc.font('Times-Roman').text("Address: " + data.bolo['address'], 300).moveDown();
    }

    // Display Zip Code only if there is a value in it
    if (data.bolo['zipCode'] !== "") {
      doc.font('Times-Roman').text("Zip Code: " + data.bolo['zipCode'], 300).moveDown();
    }

    // Display Height only if there is a value in it
    if (data.bolo['height'] !== "") {
      doc.font('Times-Roman').text("Height: " + data.bolo['height'], 300).moveDown();
    }

    // Display Weight only if there is a value in it
    if (data.bolo['weight'] !== "") {
      doc.font('Times-Roman').text("Weight: " + data.bolo['weight'] + " lbs", 300).moveDown();
    }

    // Display Sex only if there is a value in it
    if (data.bolo['sex'] !== "") {
      doc.font('Times-Roman').text("Sex: " + data.bolo['sex'], 300).moveDown();
    }

    // Display Hair Color only if there is a value in it
    if (data.bolo['hairColor'] !== "") {
      doc.font('Times-Roman').text("Hair Color: " + data.bolo['hairColor'], 300).moveDown();
    }

    // Display Tattoos/Scars only if there is a value in it
    if (data.bolo['tattoos'] !== "") {
      doc.font('Times-Roman').text("Tattoos/Scars: " + data.bolo['tattoos'], 300).moveDown();
    }
  } //end ofspecific data

  doc.font('Times-Bold').text("Created: " + data.bolo.createdOn, 15, 360).moveDown(4.15);

  // Display Additional Information only if there is a value in it
  if (data.bolo['additional'] !== "") {
    doc.font('Times-Bold').text("Additional: ", 15).moveDown(0.25);
    doc.font('Times-Roman').text(data.bolo['additional'], {width: 300}).moveDown();
  }

  // Display Summary only if there is a value in it
  if (data.bolo['summary'] !== "") {
    doc.font('Times-Bold').text("Summary: ", 15).moveDown(0.25);
    doc.font('Times-Roman').text(data.bolo['summary'], {width: 300}).moveDown(4);
  }
  doc.font('Times-Bold').text("This BOLO was created by: " + data.sectunit + " " + data.ranktitle + " " + data.authName, 15).moveDown(0.25);
  doc.font('Times-Bold').text("Please contact the agency should clarification be required.");

  return doc;
};

module.exports = PDFService;
