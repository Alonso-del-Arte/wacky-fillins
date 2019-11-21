class Wordbank {

  constructor( containerSelector ) {
    this.dom = document.querySelector( containerSelector );
    this.variables = []
  }

  accept( variableNames ) {
    // add any variables that do not currently exist
    variableNames.forEach(
      variableName => {
        if( !this.variables.some( variable => variable.name === variableName ) ) {
          this.variables = [ ...this.variables, { name: variableName } ]
        }
      });

    // remove any variables that no longer exist
    for( let index = 0; index < this.variables.length; index++ ) {
      const variable = this.variables[ index ];
      if( !variableNames.includes( variable.name ) ) {
        this.variables = [
          ...this.variables.slice( 0, index ),
          ...this.variables.slice( index + 1 )
        ];
        index--
      }
    }

    this.render()
  }

  render() {
    this.dom.innerHTML = '';
    this.variables.forEach(
      variable => this.dom.appendChild( this.createWordbankChip( variable ) )
    )
  }

  getData() {
    return this.variables.slice()
  }

  isValid() {
    return this.variables.length > 0 && 
      !this.variables.some( variable => !!!( variable.description ))
  }


  createWordbankChip( variable ) {
    const isValid = !!( variable.description );


    const chip = document.createElement( 'article' );
    chip.classList.add( 'chip' );

    const label = document.createElement( 'span' );
    label.innerText = variable.name + ': ';

    const description = document.createElement( 'button' );
    description.type = 'button';
    description.innerText = ( variable.description || 'select' ) + ' ▾';


    if( isValid ) {
      chip.classList.add( 'info' );
      description.classList.add( 'light-text' )
    } else {
      chip.classList.add( 'danger' );
      description.className = 'darker-text'
    }

    description.addEventListener(
      'click',
      async ( event ) => {
        const selectBox = new SelectBox({
          options: this.getSelectBoxOptions()
        });

        const selection = await selectBox.present({ event });
        if( !selection ) { return }

        variable.description = selection;
        this.render()
      });


    chip.appendChild( label );
    chip.appendChild( description );

    return chip
  }

  getSelectBoxOptions() {
    return [
      { name: 'noun', subcategories: [ 'singular', 'plural' ]},
      { name: 'verb', subcategories: [ 'past', 'present', 'future' ]},
      { name: 'adjective' },
      { name: 'adverb' },
      { name: 'animal' },
      { name: 'color' },
      { name: 'name' },
      { name: 'custom', input: 'description' },
    ]}

}
