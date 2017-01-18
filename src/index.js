
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'; 

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Col } from 'react-bootstrap';
import { Modal, ModalManager, Effect } from 'react-dynamic-modal'
import $ from 'jquery';


function api(urlPart){
    urlPart = urlPart||"";
   	var url = "http://gateway.marvel.com/v1/public/" + urlPart + (urlPart.indexOf("?") >= 0 ? "&" : "?") + "apikey=27e0a83bd55f345080c99754fb9ad35b";
	return $.get(url);
}

function getComics(urlPart){
	urlPart = urlPart||"";
	return api("comics"+urlPart);
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
              className="thumbnail image-center"></img>            
        <div className="more-info">Mais Informações</div>
      </div>
    );
  }
});

const ComicsModal =  React.createClass({
   render(){
      const { comics, url } = this.props;
      return (
         <Modal effect={Effect.ScaleUp}>
          
            <Col xs={12} md={4} >
               <img role="presentation" 
                    src={url} 
                    className="thumbnail image-center image-modal"></img> 
            </Col>
          
            <Col xs={12} md={8}>
              <h1>{comics.title}</h1>
              <h4 >{"Pages: "+comics.pageCount}</h4>
              <p>{comics.description?comics.description:""}</p>
            </Col>
          
         </Modal>
      );
   }
});

var ComicsList = React.createClass({
    getInitialState: function() {
        return {
            offset:0,
            total:Number.POSITIVE_INFINITY,
            limit:15,
            isInfiniteLoading: false,
            elements: []
        }
    },
    
    componentWillMount: function (){
        this.handleInfiniteLoad();
    },

    handleInfiniteLoad: function() {
        var that = this, query, page, mul=(this.state.offset*this.state.limit );
        
        this.setState({
            isInfiniteLoading: true
        });
        
        page="&limit="+this.state.limit+"&offset="+mul;
        query="?format=comic&formatType=comic"+page;
     
        //return;
        getComics(query).then(
          function(r){
            var data = r.data,
                newElements = data.results.map(function _mapComicsElement(e, i, a){
                  var url = e.thumbnail || e.images;
                  url = url.path+"/portrait_incredible."+url.extension;
                  return (
                      <Card url={url} key={mul+i} data={e} />
                  );
              });

            that.setState({
                isInfiniteLoading: false,
                total:data.total,
                offset:(that.state.offset+1),
                elements: that.state.elements.concat(newElements)
            });
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
                        block onClick={this.handleInfiniteLoad}> Carregar mais... </Button>
            </div>
        );
    }
});


class App extends Component {
    render() {
        return ( 
            <div className="App">
              <div className="App-header">
                <h2> Welcome to MarvelWiki </h2>
              </div>
                
              <ComicsList />
                  
              <div className="footer">
                <h6><a href="//www.marvel.com">Data provided by Marvel. © 2017 MARVEL</a></h6>
              </div>    
               
            </div>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
