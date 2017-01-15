
import './index.css';

import React, {
  Component
}
from 'react';
import ReactDOM from 'react-dom';
import 
    { 
        Button, ButtonGroup, Glyphicon, Modal, Popover, Tooltip, OverlayTrigger, Carousel
    } from 'react-bootstrap'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.css';
import data from './data.json'

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
      <img role="presentation" src={this.props.thumbnail.path+"/portrait_incredible."+this.props.thumbnail.type} className="thumbnail"/></div>
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

const ExampleComicsModal = React.createClass({
    getInitialState() {
        return { showModal: false };
    },

    close() {
        this.setState({ showModal: false });
    },

    open() {
        this.setState({ showModal: true });
    },

  render() {
      
    const comicsData = this.props.comics.data.results.map(function(e,i){
        return (
            {
                id:e.id,
                title:e.title,
                pageCount:e.pageCount,
                thumbnail:e.thumbnail.path+"/portrait_incredible."+e.thumbnail.extension,
                details:e.urls[0].url,
                reader:e.urls[1].url,
                
            });
        
    })
    
    const carouselArr= comicsData.map(function(e){
        return (
            <Carousel.Item>
              <img className="carouselModal" src={e.thumbnail}
              />
              <Carousel.Caption>
                <h3>{e.title}</h3>
                <ButtonGroup>
                    <Button href={e.details}><Glyphicon glyph="glyphicon glyphicon-plus" /></Button>
                    <Button href={e.reader}><Glyphicon glyph="glyphicon glyphicon-search" /></Button>
                </ButtonGroup>
              </Carousel.Caption>
            </Carousel.Item>
        );
    })
    
    return(
        <div>
            <Button bsStyle="primary" bsSize="large" onClick={this.open}>
                Show comics modal
            </Button>
            
            <Modal show={this.state.showModal} onHide={this.close} enforceFocus={true}>

                <Modal.Header>
                    <p>//todo: inserir dinamicament conteudo aqui</p>
                    <p>/{comicsData[0].thumbnail+""}</p>
                    <p>/{comicsData[0].id+""}</p>
                    <p>/{comicsData[0].pageCount+""}</p>
                    <Carousel>
                        {carouselArr}
                    </Carousel>
                </Modal.Header>

                <Modal.Body>
                    <h4>Text in a modal body</h4>
                </Modal.Body>

                <Modal.Footer>
                    <p>{this.props.comics.attributionText}</p>
                </Modal.Footer>
            </Modal>
        </div>
    );
  }
});


const Timeline = Reac.createClass({
    
});

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
          <h2> Welcome to MediaWiki </h2>
        </div>
        
        <div className="App-intro">
         <ExampleComicsModal comics={data} />
         <Timeline />
          Timeline comics<br/>
          Timeline characters<br/>
          Timeline authors<br/>
      
          
          Conteúdo autoral da Marvel<br/>
        </div>
      </div>
    );
//          <Card title="Spider-man" issue="#100" thumbnail={ this.exp } />
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
