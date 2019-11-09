var libs, repeatables, repeats, form, fields, submitEnabled, submitButton;

function verifySubmitReady() {
//    if (submitEnabled && this.value === "") {
//        submitEnabled = false
//    } else {
//        submitEnabled = true;
//        var counter = 0;
//        while (submitEnabled && counter < fields.length) {
//            submitEnabled = submitEnabled && (fields[counter].value != "")
//        }
//    }
//    submitButton.disabled = !submitEnabled
}

function createFields() {
    fields = [];
    form = document.createElement("div");
//    var br = document.createElement("br");
    var label, input, labelInputGroup;
    for (var k = 0; k < libs.length; k++) {
        labelInputGroup = document.createElement("div");
        labelInputGroup.className = "labelInputGroup";
        label = document.createElement("span");
        label.className = "label";
        label.innerHTML = libs[k].innerHTML;
        labelInputGroup.appendChild(label);
        input = document.createElement("input");
        input.addEventListener("change", verifySubmitReady);
        fields.push(input);
        labelInputGroup.appendChild(input);
        form.appendChild(labelInputGroup)
    }
    submitButton = document.createElement("button");
    submitButton.innerHTML = "Transcribe fill-ins and present text";
    submitButton.disabled = false; // CHANGE TO DISABLED AT LOAD
    submitButton.addEventListener("click", presentMadLib)
    form.appendChild(submitButton);
    document.body.appendChild(form)
}

function fillRepeats() {
    var key, repeatedText;
    for (var j = repeats.length - 1; j > -1; j--) {
        key = repeats[j].innerHTML;
        repeatedText = repeatables[key];
        repeats[j].outerHTML = "<ruby>" + repeatedText + "</ruby>"
    }
}

function fillLibbables() {
    var fillID, fieldText, rubyText;
    repeatables = [];
    for (var i = libs.length - 1; i > -1; i--) {
        fillID = libs[i].id;
        rubyText = libs[i].innerHTML;
        fieldText = fields[i].value;
        if (fillID != "") {
            repeatables[fillID] = fieldText
        }
        libs[i].outerHTML = "<ruby>" + fieldText + "<rt>" + rubyText + "</rt></ruby>"
    }
}

function presentMadLib() {
    console.log("presentMadLib() has been invoked");
    form.style.display = "none";
    fillLibbables();
    fillRepeats();
    document.getElementById("libbable").id = "libbableShow"
}

function libbableInitialize() {
    submitEnabled = false;
    libs = document.getElementsByClassName("fillable");
    repeats = document.getElementsByClassName("repeatFill");
    createFields();
}