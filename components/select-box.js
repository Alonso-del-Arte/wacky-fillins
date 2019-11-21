
class SelectBox {

  constructor({ options }) {
    this.options = options
  }


  present({ event }) {
    return new Promise(
      ( resolve ) => {
        this.resolve = resolve;

        this.selectBox = this.createSelectBox({ event });
        this.backdrop = this.createBackdrop();

        document.body.appendChild( this.backdrop );
        document.body.appendChild( this.selectBox )
      })
  }

  dismiss( data ) {
    document.body.removeChild( this.backdrop );
    document.body.removeChild( this.selectBox );

    this.resolve( data || undefined )
  }


  createBackdrop() {
    const element = document.createElement( 'div' );

    element.style[ 'position' ] = 'fixed';
    element.style[ 'top' ] = '0';
    element.style[ 'left' ] = '0';
    element.style[ 'width' ] = '100vw';
    element.style[ 'height' ] = '100vh';
    element.style[ 'background-color' ] = 'rgba( 0, 0, 0, 0.7 )';
    element.style[ 'z-index' ] = '999';

    element.addEventListener('click', () => this.dismiss() );

    return element
  }

  createSelectBox({ event }) {
    const element = document.createElement( 'section' );

    element.style[ 'background-color' ] = '#FAFAFA';
    element.style[ 'box-shadow' ] = '2px 2px 10px rgba( 0, 0, 0, 0.3 )';
    element.style[ 'border-radius' ] = '3px';
    element.style[ 'padding' ] = '15px';

    element.style[ 'z-index' ] = 1000;
    element.style[ 'position' ] = 'fixed';

    element.style[ 'left' ] = this.getHorizontalPosition( event );
    element.style[ 'top' ] = this.getVerticalPosition( event );

    this.options.forEach(
      option => {
        element.appendChild( this.createOption( option ) )
      });

    return element
  }

  createOption( option ) {
    const rootNode = this.createOptionContainer();
    const optionButton = this.createOptionButton( option.name );

    rootNode.appendChild( optionButton );

    if( option.subcategories ) {
      rootNode.appendChild( this.createSubcategories( option ) )
    }

    if( option.input ) {
      rootNode.appendChild( this.createInputField( option.input ) )
    } else {
      optionButton.addEventListener(
        'click',
        () => { this.dismiss( option.name ) }
      )}

    return rootNode
  }

  createOptionButton( optionName ) {
    const button = this.createNakedButton();
    button.innerText = optionName;
    return button
  }

  createOptionContainer() {
    const element = document.createElement( 'div' );

    element.style[ 'display' ] = 'flex';
    element.style[ 'flex-flow' ] = 'column nowrap';
    element.style[ 'align-items' ] = 'stretch';
    element.style[ 'justify-content' ] = 'space-between';

    return element
  }

  createSubcategories( option ) {
    const entry = document.createElement( 'div' );

    entry.style[ 'display' ] = 'flex';
    entry.style[ 'flex-flow' ] = 'row nowrap';
    entry.style[ 'align-items' ] = 'center';
    entry.style[ 'justify-content' ] = 'space-around';

    option.subcategories.forEach(
      subcategory => {
        entry.appendChild( this.createSubcategoryButton( option.name, subcategory ) )
      });

    return entry
  }

  createSubcategoryButton( optionName, subcategory ) {
    const button = this.createNakedButton();

    button.style[ 'margin-top' ] = '-0.5rem';
    button.style[ 'margin-bottom' ] = '0.5rem';
    button.style[ 'color' ] = 'rgba( 22, 22, 22, 0.5 )';

    button.innerText = subcategory;

    button.addEventListener(
      'click',
      () => {
        this.dismiss( `${ optionName }, ${ subcategory }` )
      });

    return button
  }

  createInputField( formControlName, { type, placeholder, className } = { }) {
    const input = document.createElement( 'input' );

    input.name = formControlName;
    input.type = type || 'text';
    input.placeholder = placeholder || 'Enter anything you like!';

    input.style[ 'background' ] = 'none';
    input.style[ 'border' ] = 'none';
    input.style[ 'outline' ] = 'none';
    input.style[ 'font-size' ] = '0.9rem';
    input.style[ 'color' ] = 'rgba( 22, 22, 22, 0.7 )';

    input.className = className || 'select-box-input';

    input.addEventListener(
      'blur',
      ( event ) => {
        this.dismiss( event.target[ 'value' ] )
      });

    input.addEventListener(
      'keypress',
      event => {
        if( event.key === 'Enter' ) { this.dismiss( event.target[ 'value' ] ) }
      });

    return input
  }

  createNakedButton() {
    const button = document.createElement('button');

    button.style[ 'background' ] = 'none';
    button.style[ 'outline' ] = 'none';
    button.style[ 'border' ] = 'none';
    button.style[ 'font-size' ] = '1rem';

    return button
  }

  getHorizontalPosition( event ) {
    let horizontalPosition = `${ event.clientX }px`;
    const willGoOffscreen = event.clientX + 150 > window.innerWidth;

    if( willGoOffscreen ) {
      horizontalPosition = `${ event.clientX - 150 }px`
    }

    return horizontalPosition
  }

  getVerticalPosition( event ) {
    let verticalPosition = `${ event.clientY }px`;
    const willGoOffscreen = event.clientY + ( 50 * this.options.length ) > window.innerHeight;

    if( willGoOffscreen ) {
      const availableHeight = window.innerHeight - event.clientY;

      verticalPosition = `${ event.clientY - ( 50 * this.options.length - availableHeight ) }px`
    }

    return verticalPosition
  }

}
