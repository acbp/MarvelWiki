
import './index.css';

import React, {
  Component
}
from 'react';
import ReactDOM from 'react-dom';
import 
    { 
       Tooltip, OverlayTrigger
    } from 'react-bootstrap';
import {Modal,ModalManager,Effect} from 'react-dynamic-modal'
import $ from 'jquery';
import data from './data.json';

const imageNotFound="https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/standard_xlarge.jpg";

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


/**
 * Função para mapear dados do comics para elemento da lista.
 * @private
 * @param   {object} e - dados do comics.
 * @param   {number} i - index.
 * @param   {array}  a - array que esta sendo lido.
 * @returns {array}  lista de elementos.
 */
const mapComicsElement = function _mapComicsElement(e, i, a){
    var url = e.thumbnail || e.images;
    url = url.path+"/portrait_incredible."+url.extension;
    return (
        <Card url={url} key={i} data={e} />
    );
};

//const ComicsModal = React.createClass({
//  getInitialState() {
//      return { showModal: false };
//  },
//
//  close() {
//      this.setState({ showModal: false });
//  },
//
//  open() {
//      this.setState({ showModal: true });
//  },
//
//  render() {
//    const comicsData=this.props.data;
//    
//    return(
//        <div>
//            <Modal show={this.state.showModal} onHide={this.close} enforceFocus={true}>
//                <Modal.Header>
//                </Modal.Header>
//
//                <Modal.Body>
//                    <h4>Text in a modal body</h4>
//                </Modal.Body>
//
//                <Modal.Footer>
//                </Modal.Footer>
//            </Modal>
//        </div>
//    );
//  }
//});

class ComicsModal extends Component{
   render(){
      const { comics, url } = this.props;
      const divStyle = {
          backgroundImage: 'url(' + url + ')',
      };
      return (
         <Modal effect={Effect.ScaleUp} style={divStyle}>
            <div className="image-center">
              <h1>{comics.title}</h1>
              <h4 >Pages:{comics.pages}</h4>

              <p>{comics.description}</p>
              <div className='modal-bg'></div>
            </div>
            
            
         </Modal>
      );
   }
}


const Card = React.createClass({
 openModal(){
     const data = this.props.data;
     const url = this.props.url;
     ModalManager.open(<ComicsModal comics={data} url={url} />);
  },
  
  render() {
    return (
       <div className="image-center">
          <img  onClick={this.openModal}
                role="presentation" 
                src={this.props.url} 
                className="thumbnail image-center">
          </img>
      </div>
    );
  }
});


var List = React.createClass({
    getInitialState: function() {
        return {
            elements: [],
            total:Number.POSITIVE_INFINITY,
            offset:0,
            limite:25,
            isInfiniteLoading: false
        }
    },

    handleInfiniteLoad: function() {
        var that = this, 
            query, 
            isFinished=(this.state.total>this.state.offset)===false;
      
        this.setState({
            isInfiniteLoading: true
        });
        
        query="?format=comic&formatType=comic&orderBy=-onsaleDate&limit=50&offset="+this.state.offset;
     
        getComics(query).then(
          function(r){
            var data = r.data,
                newElements = data.results.map(mapComicsElement);

            that.setState({
                isInfiniteLoading: false,
                total:data.total,
                offset: that.state.offset+1,
                elements: that.state.elements.concat(newElements)
            });
          }
        );
    },

    componentWillMount: function() {
      this.handleInfiniteLoad();
    },
  
    render: function() {
        return (
          <div>
            {this.state.elements}
          </div>
        );
    }
});

class App extends Component {
  
    render() {
      
        return ( 
            <div className="App">
                <div className="App-header">
                    <h2> Welcome to MediaWiki </h2>
                </div>

                <div>
                  <List />
                </div>
            


                <div className="footer">
                    <h6>{data.attributionText}</h6>
                </div>
            </div>
        );

    }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
