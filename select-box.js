
class SelectBox {

  constructor({ options }) {
    this.options = options
  }


  present({ event }) {
    return new Promise(
      ( resolve ) => {
        this.selectBox = this.createSelectBox( resolve )
        this.backdrop = this.createBackdrop( resolve )

        this.selectBox.style[ 'z-index' ] = 1000
        this.selectBox.style[ 'position' ] = 'absolute'

        this.selectBox.style[ 'left' ] = `${ event.clientX }px`
        this.selectBox.style[ 'top' ] = `${ event.clientY - 100 }px`

        document.body.appendChild( this.backdrop )
        document.body.appendChild( this.selectBox )
      })
  }

  dismiss( data ) {
    document.body.removeChild( this.backdrop )
    document.body.removeChild( this.selectBox )
    return data
  }


  createSelectBox( resolve ) {
    const element = document.createElement( 'section' )
    element.className = 'card'

    this.options.forEach(
      option => {
        element.appendChild( this.createOption( option, resolve ) )
      })

    return element
  }

  createBackdrop( resolve ) {
    const element = document.createElement( 'div' )
    element.style = `position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba( 0, 0, 0, 0.7 ); z-index: 999; transition-duration: 500;`
    element.addEventListener(
      'click',
      () => { resolve( this.dismiss() ) }
    )

    return element
  }

  createOption( option, resolve ) {
    const element = document.createElement( 'div' )
    const button = document.createElement( 'button' )
    const buttonText = document.createElement( 'span' )

    element.style[ 'display' ] = 'flex'
    element.style[ 'flex-flow' ] = 'column nowrap'
    element.style[ 'align-items' ] = 'stretch'
    element.style[ 'justify-content' ] = 'space-between'
    
    buttonText.innerText = option.name

    button.appendChild( buttonText )
    element.appendChild( button )

    if( option.subcategories ) {
      const entry = document.createElement( 'div' )
      entry.style[ 'display' ] = 'flex'
      entry.style[ 'flex-flow' ] = 'row nowrap'
      entry.style[ 'align-items' ] = 'center'
      entry.style[ 'justify-content' ] = 'space-around'

      option.subcategories.forEach(
        subcategory => {
          const categoryButton = document.createElement( 'button' )
          categoryButton.className = 'subcategory'
          categoryButton.innerText = subcategory
          categoryButton.addEventListener(
            'click',
            () => {
              resolve( this.dismiss( `${ option.name }, ${ subcategory }` ))
            })
          entry.appendChild( categoryButton )
        })

      element.appendChild( entry )
    }

    if( option.input ) {
      const input = document.createElement( 'input' )
      input.className = 'select-box-input'
      input.name = option.input
      input.placeholder = 'Enter anything you like!'
      input.type = 'text'
      element.appendChild( input )

      input.addEventListener(
        'blur',
        ( event ) => {
          console.log
          resolve( this.dismiss( event.target.value ) )
        })
      input.addEventListener(
        'keypress',
        event => {
          if( event.key === 'Enter' ) { resolve( this.dismiss( event.target.value ) ) }
        })
    } else {
      button.addEventListener(
        'click',
        () => { resolve( this.dismiss( option.name ) ) }
      )
    }

    return element
  }

}
