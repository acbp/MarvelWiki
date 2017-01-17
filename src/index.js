
import './index.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button,Tooltip, OverlayTrigger } from 'react-bootstrap';
import {Modal,ModalManager,Effect} from 'react-dynamic-modal'
import $ from 'jquery';
import data from './data.json';


function api(urlPart){
	var 
    urlPart = urlPart||"",
    url = "http://gateway.marvel.com/v1/public/" + urlPart + (urlPart.indexOf("?") >= 0 ? "&" : "?") + "apikey=27e0a83bd55f345080c99754fb9ad35b";
	return $.get(url);
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

/**
 * Função para mapear dados do comics para elemento da lista.
 * @private
 * @param   {object} e - dados do comics.
 * @param   {number} i - index.
 * @param   {array}  a - array que esta sendo lido.
 * @returns {array}  lista de elementos.
 */
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

var ComicsList = React.createClass({
    getInitialState: function() {
        return {
            offset:0,
            total:10,
            limit:25,
            isInfiniteLoading: false,
            elements: []
        }
    },
    
    componentWillMount: function (){
        this.handleInfiniteLoad();
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem index={i}/>)
        }
        return elements;
    },

    handleInfiniteLoad: function() {
        var that = this, query, page;
        
        this.setState({
            isInfiniteLoading: true
        });
        
        page="&limit="+this.state.limit+"&offset="+(this.state.offset*this.state.limit);
        query="?format=comic&formatType=comic"+page;
     
        //return;
        getComics(query).then(
            function(r){
                var data = r.data,
                    newElements = data.results.map(mapComicsElement);
                    
                that.setState({
                    isInfiniteLoading: false,
                    total:data.total,
                    offset:(that.state.offset+1),
                    elements: that.state.elements.concat(newElements)
                });
                
                console.log(that.state.elements);
            }
        );
    },
    
    render: function() {
        return(
            <div className="content">
                {this.state.elements}
                
                <div className={!this.state.isInfiniteLoading ? 'is-loading hidden' : 'is-loading'}>
                    Loading...
                </div>
                
                <Button className={!this.state.isInfiniteLoading ? '' : 'hidden'} 
                        block onClick={!this.handleInfiniteLoad}> Carregar mais... </Button>
            </div>
        );
    }
});


//                <Button block> Carregar mais... </Button>
class App extends Component {
  
    render() {
      
        return ( 
            <div className="App">
              <div className="App-header">
                <h2> Welcome to MediaWiki </h2>
              </div>
                
              <ComicsList />
                  
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
