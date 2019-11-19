class Wordbank {

  constructor( containerSelector ) {
    this.dom = document.querySelector( containerSelector )
    this.variables = []
  }

  accept( variableNames ) {
    variableNames.forEach(
      variableName => {
        if( !this.variables.some( variable => variable.name === variableName ) ) {
          this.variables = [ ...this.variables, { name: variableName } ]
        }
      })
    
    for( let index = 0; index < this.variables.length; index++ ) {
      const variable = this.variables[ index ]
      if( !variableNames.includes( variable.name ) ) {
        this.variables = [
          ...this.variables.slice( 0, index ),
          ...this.variables.slice( index + 1 )
        ]
        index--
      }
    }

    this.render()
  }

  render() {
    this.dom.innerHTML = ''
    this.variables.forEach(
      variable => {
        this.dom.appendChild( this.createWordbankChip( variable ) )
        // this.dom.innerHTML += `<span>${ variable.name }</span><br/>`
      })
  }

  getData() {
    return this.variables.slice()
  }

  isValid() {
    return this.variables.length > 0 && 
      !this.variables.some( variable => !!!( variable.description ))
  }


  createWordbankChip( variable ) {
    const chip = document.createElement( 'article' )
    chip.classList.add( 'chip' )

    const label = document.createElement( 'span' )
    label.innerText = variable.name + ': '

    const descriptor = document.createElement( 'button' )
    descriptor.type = 'button'

    const buttonText = document.createElement( 'span' )
    buttonText.innerText = ( variable.description || 'select' ) + ' ▾'
    
    if( variable.description ) {
      buttonText.className = "white-text"
      chip.classList.add( 'info' )
    } else {
      buttonText.className = "seethrough"
      chip.classList.add( 'danger' )
    }

    descriptor.appendChild( buttonText )
    chip.appendChild( label )
    chip.appendChild( descriptor )

    descriptor.addEventListener(
      'click',
      async ( event ) => {
        const selectBox = new SelectBox({
          options: [
            { name: 'noun', subcategories: [ 'singular', 'plural' ]},
            { name: 'verb', subcategories: [ 'past', 'present', 'future' ]},
            { name: 'adjective' },
            { name: 'adverb' },
            { name: 'animal' },
            { name: 'color' },
            { name: 'name' },
            { name: 'custom', input: 'description' },
          ]
        })

        const selection = await selectBox.present({ event })
        if( !selection ) { return }
        variable.description = selection
        this.render()
      })

    return chip
  }

}
