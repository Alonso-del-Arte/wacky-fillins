/**
 * Represents a story with blanks into which a user can enter random words in a form to fill in the blanks.
 * @author Cole Cooper Wyman, based on a less elegant version by Alonso del Arte
 */
class Libbable {

  /**
   * Constructs a Libbable object, gathers fillables and repeated fillables.
   */
  constructor(documentRef) {
    this.document = documentRef;
    this.libs = this.getElementsByClassName("fillable");
    this.repeats = this.getElementsByClassName("repeatFill");
    this.fields = this.createFields()
  }

  getElementsByClassName(className) {
    const elementHTMLList = this.document.getElementsByClassName( className );
    const elements = [];
    for (let index = 0; index < elementHTMLList.length; index++) {
      elements.push(elementHTMLList[index])
    }
    return elements
  }

  createFields() {
    const fields = [];
    const form = this.document.createElement("form");
    for (let index = 0; index < this.libs.length; index++) {
      const label = this.document.createElement("span");
      const input = this.document.createElement("input");
      const labelInputGroup = this.document.createElement("div");
      label.className = "label";
      input.className = "inputItem";
      label.innerHTML = this.libs[index].innerHTML;
      labelInputGroup.className = "labelInputGroup";
      labelInputGroup.appendChild(label);
      labelInputGroup.appendChild(input);
      form.appendChild(labelInputGroup);
      fields.push(input)
    }
    const submitButton = this.document.createElement("button");
    submitButton.innerHTML = "Transcribe fill-ins and present text";
    submitButton.type = "submit";
    submitButton.disabled = true;
    form.appendChild(submitButton);
    this.document.body.appendChild(form);
    form.addEventListener(
      "change",  () => {
        submitButton.disabled = this.shouldFormBeDisabled()
      })
    form.addEventListener(
      "submit", (event) => {
        event.preventDefault()
        this.presentMadLib(form)
      })
    return fields
  }

  presentMadLib(form) {
    form.style.display = "none";
    this.fillLibbables();
    this.fillRepeats();
    this.document.getElementById("libbable").id = "libbableShow";
  }

  fillRepeats() {
    for (let index = 0; index < this.repeats.length; index++) {
      const key = this.repeats[index].innerHTML;
      const repeatedText = this.repeatables[key];
      this.repeats[ index ].outerHTML = `<ruby>${ repeatedText }</ruby>`
    }
  }

  fillLibbables() {
    this.repeatables = [];
    for (let index = 0; index < this.libs.length; index++) {
      const fillID = this.libs[index].id;
      const rubyText = this.libs[index].innerHTML;
      const fieldText = this.fields[index].value;
      if (fillID != "") {
        this.repeatables[fillID] = fieldText
      }
      this.libs[index].outerHTML = `<ruby>${ fieldText }<rt>${ rubyText }</rt></ruby>`
    }
  }

  /**
   * Determines whether the form is ready to be processed (all fields ought to be filled in).
   */
  shouldFormBeDisabled() {
    return this.getElementsByClassName("inputItem").filter(input => !!!(input.value)).length > 0
  }
  
}
