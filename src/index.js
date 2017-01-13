
import './index.css';

import React, {
  Component
}
from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import $ from 'jquery'

function api(urlPart){
  urlPart = urlPart||"";
	var url = "http://gateway.marvel.com/v1/public/" + urlPart + (urlPart.indexOf("?") >= 0 ? "&" : "?") + "apikey=27e0a83bd55f345080c99754fb9ad35b";
	return $.get(url);
}

function getCharacters(urlPart){
	urlPart = urlPart||"";
	return api("characters"+urlPart);
}

function getComics(urlPart){
	urlPart = urlPart||"";
	return api("comics"+urlPart);
}

//todo criar componente de timeline components, filtar por ano.
//
class Card extends Component {
  render() {
      //TODO criar card/gridUnit
      //TODO carregar thumbnail {thumbnail.path}
      //TODO carregar titulo {title}
      //TODO ao clicar deve abrir um modal com os dados da revista.
      //TODO 1 botões leitura com icone de lupa
      //TODO fazer efeito de hover,out visited
    return (
      <div className="timeline" >
      <img role="presentation" src={this.props.thumbnail.path+"."+this.props.thumbnail.type} className="thumbnail"/> 
      </ div>

    );
  }
}
//
//class Details extends Component {
//  render(){
//    return (
//      <div >
//      //TODO CRIAR MODAL ACIMA DA GRID
//      //TODO HEADER TITULO
//      //TODO SUBHEADER EDIÇÃO
//      //TODO DATA DE LANSAMENTO
//      //TODO AUTOR
//      //TODO ARTISTA
//      </ div >
//    );
//  }
//}
//
////detais e comprar
//class Urls extends Component {
//  
//}
//
//class Series extends Component {
//  
//}
//
//
//class Variants extends Component {
//  
//}
//
//class Collections extends Component {
//  
//}
//
//class Dates extends Component {
//  
//}
//
//class Prices extends Component {
//  //todo se não tiver preço é pq não tem mais. trocar por indisponivel
//}
//
//class Creators extends Component {
//  
//}
//class Characters extends Component {
//  
//}
//class Stories extends Component {
//  
//}
//

class App extends Component {
  constructor(){
    super();
    this.states={loadedComics:{}};
    this.exp= {path:"https://i.annihil.us/u/prod/marvel/i/mg/9/40/50b4fc783d30f",type:"jpg"} ;
  }
  loadHeroes= () =>{
		getCharacters().then(
      r => {
			 console.log(r.data.results);
		  }
    );
	}
  
  loadComics = index =>{
    
    let query = "?format=comic&", ds = this.states={};
    
    ds.dateRange="dateRange=2016-01-01%2C2017-01-01";
    ds.limit="limit=10";
    ds.offset="offset="+index;
    
    query=ds.dateRange && query+"&"+ds.dateRange;
    query=ds.limit &&  query+"&"+ds.limit;
    query=ds.offset &&  query+"&"+ds.offset;
    
    getComics( query ).then( 
      r =>{
        console.log(r.data.results);
        this.states.loadedComics.setState(r.data.results);
      }
    );    
  }
  
  render() {
    return ( 
      <div className="App">
        <div className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <h2> Welcome to MediaWiki </h2>
        </div>
        <p className="App-intro">
          Timeline comics<br/>
      
          Timeline characters<br/>
      
          Timeline authors<br/>
      
          <Card title="Spider-man" issue="#100" thumbnail={ this.exp } />
          
          Conteúdo autoral da Marvel<br/>
        </p>
      </div>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
