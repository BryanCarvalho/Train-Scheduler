
// Initialize Firebase

var config = {
    apiKey: "AIzaSyASieC3XCAuuH1Gth7256i4ywSMJ_HreOU",
    authDomain: "fir-project-8d8cf.firebaseapp.com",
    databaseURL: "https://fir-project-8d8cf.firebaseio.com",
    projectId: "fir-project-8d8cf",
    storageBucket: "fir-project-8d8cf.appspot.com",
    messagingSenderId: "667506324360"
};

firebase.initializeApp(config);

var database = firebase.database();
var currentTime = moment();

database.ref().on("child_added", function (childSnap) {

    var name = childSnap.val().name;
    var destination = childSnap.val().destination;
    var firstTrain = childSnap.val().firstTrain;
    var frequency = childSnap.val().frequency;
    var min = childSnap.val().min;
    var next = childSnap.val().next;

    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

//grabs information from the form
$("#addTrain").on("click", function () {

    var trainName = $("#trainInput1").val().trim();
    var destination = $("#trainInput2").val().trim();
    var firstTrain = $("#trainInput3").val().trim();
    var frequency = $("#trainInput4").val().trim();

    //ensures that each input has a value
    if (trainName == "") {
        alert('Please enter a train name.');
        return false;
    }
    if (destination == "") {
        alert('Please enter a destination.');
        return false;
    }
    if (firstTrain == "") {
        alert('Please enter a first train time.');
        return false;
    }
    if (frequency == "") {
        alert('Please enter a frequency');
        return false;
    }

    // THE MATH!
    //subtracts the first train time back a year to ensure it's before current time.
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    // the time difference between current time and the first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    database.ref().push(newTrain);

    /*
        database.ref().set({
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            min: minUntilTrain,
            next: nextTrain
        });
    */



    $("#trainInput1").val("");
    $("#trainInput2").val("");
    $("#trainInput3").val("");
    $("#trainInput4").val("");

    return false;
});