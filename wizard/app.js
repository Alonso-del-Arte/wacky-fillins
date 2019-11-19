const wordbank = new Wordbank( '#variables' );

const story = document.querySelector( 'form[name=story]' );
const textInput = document.querySelector( 'textarea[name=content]' );
const refreshVariablesButton = document.querySelector( 'input[type=submit][name=content-submit]' );
const submitFormButton = document.querySelector( 'button[type=submit][name=wordbank-submit]' );

const updateSubmitFormButtonDisabledStatus = () => {
  submitFormButton.disabled = !wordbank.isValid();
  if( submitFormButton.disabled ) {
    submitFormButton.classList.remove( 'success' );
    submitFormButton.classList.remove( 'white-text' );

    submitFormButton.classList.add( 'gray' );
    submitFormButton.classList.add( 'darker-text' )
  } else {
    submitFormButton.classList.remove( 'gray' );
    submitFormButton.classList.remove( 'darker-text' );
    
    submitFormButton.classList.add( 'success' );
    submitFormButton.classList.add( 'light-text' );
  }
};

textInput.addEventListener(
  'input',
  () => refreshVariablesButton.click()
);

story.addEventListener(
  'submit',
  ( event ) => {
    event.preventDefault();

    const userInput = document.querySelector( '[name=content]' ).value;
    const variablePattern = /{\s*([a-z0-9$_\-]+)\s*}/gmi;
    const extractedVariables = ( userInput.match( variablePattern ) || [ ])
      .map( match => match.replace( /[{}]/g, '' ).replace( /\s+/g, '' ) );

    wordbank.accept( extractedVariables );
    updateSubmitFormButtonDisabledStatus();
    submitFormButton.disabled = !wordbank.isValid();
  });

submitFormButton.addEventListener(
  'click',
  ( event ) => {
    event.preventDefault();

    if( wordbank.getData().length > 0 ) {
      const title = document.querySelector( '[name=title]' ).value;

      console.log( 'we did it! The world is your oyster. Do something with this data!', {
        title, 
        data: wordbank.getData(), 
        document: textInput.value
      });
    }
  });

document.addEventListener(
  'click',
  () => {
    updateSubmitFormButtonDisabledStatus()
  });
