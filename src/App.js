import React, {
  Component
}
from 'react';
import logo from './logo.svg';
import './App.css';

//todo criar componente de timeline components, filtar por ano.

class Card extends Component {
  render() {
    return ( < div >
      < img src = {
        "http://i.annihil.us/u/prod/marvel/i/mg/b/c0/581b37dbcad30" + ".jpg"
      } / >    
      < img src = 'http://i.annihil.us/u/prod/marvel/i/mg/b/c0/581b37dbcad30.jpg' / > < / div>
      //TODO criar card/gridUnit
      //TODO carregar thumbnail {thumbnail.path}
      //TODO carregar titulo {title}
      //TODO ao clicar deve abrir um modal com os dados da revista.
      //TODO 1 botões leitura com icone de lupa
      //TODO fazer efeito de hover,out visited

    );
  }
}

class Details extends Component {
  render(){
    return (
      < div >
      //TODO CRIAR MODAL ACIMA DA GRID
      //TODO HEADER TITULO
      //TODO SUBHEADER EDIÇÃO
      //TODO DATA DE LANSAMENTO
      //TODO AUTOR
      //TODO ARTISTA
      < / div >
    );
  }
}

//detais e comprar
class Urls extends Component {
  
}

class Series extends Component {
  
}


class Variants extends Component {
  
}

class Collections extends Component {
  
}

class Dates extends Component {
  
}

class Prices extends Component {
  //todo se não tiver preço é pq não tem mais. trocar por indisponivel
}

class Creators extends Component {
  
}
class Characters extends Component {
  
}
class Stories extends Component {
  
}

class App extends Component {
  render() {
    return ( < div className = "App" >
      < div className = "App-header" >
      < img src = {
        logo
      }
      className = "App-logo"
      alt = "logo" / >
      < h2 > Welcome to React < /h2> < /div > < p className = "App-intro" >
      To get started, edit < code > src / App.js < /code> and save to reload. < /p > < Card / > < /div> 

    );
  }
}


export default App;