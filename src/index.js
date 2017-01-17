
import './index.css';

import React, {
  Component
}
from 'react';
import ReactDOM from 'react-dom';
import 
    { 
        Button
    } from 'react-bootstrap';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import data from './data.json';
//import Infinite from 'react-infinite';

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

//todo criar componente de timeline components, filtar por ano.
class Card extends Component {
  render() {
    return (
      <div className="timeline" >
          <img role="presentation" src={this.props.thumbnail.path+"/portrait_incredible."+this.props.thumbnail.type} className="thumbnail"/>
      </div>
    );
  }
}



var ListItem = React.createClass({
    
    render: function() {
        return (
            <div className="image-center" key={this.props.index}>
                <img role="presentation" 
                     src={this.props.url} 
                     className="thumbnail image-center"></img>
                <div className="more-info">Mais Informações</div>
            </div>
        );
    }
});

var InfiniteList = React.createClass({
    getInitialState: function() {
        return {
            offset:0,
            total:10,
            limit:25,
            isInfiniteLoading: false,
            isLoading:false,
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
        var that = this, 
            query, page,
        
            isFinished=(this.state.total>this.state.offset)===false;
        
        //flag para impedir loop infinito
//        if(isFinished||this.state.isInfiniteLoading||this.state.offset>5){
//            return;
//        }
        
        this.setState({
            isLoading: false
        });
        
        page="&limit="+this.state.limit+"&offset="+this.state.offset*this.state.limit;
        query="?format=comic&formatType=comic"+page;
     
        //return;
        getComics(query).then(
            function(r){
                var data = r.data,
                    newElements = data.results.map(function(e,i){
                        var url = e.thumbnail || e.images;
                        url = url.path+"/portrait_incredible."+url.extension;
                        return (<ListItem url={url} key={i} index={i}/>);
                    });
                    
                that.setState({
                    isInfiniteLoading: false,
                    isLoading: true,
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
                
                <div className={this.state.isLoading ? 'is-loading hidden' : 'is-loading'}>
                    Loading...
                </div>
                
                <Button className={this.state.isLoading ? '' : 'hidden'} 
                        block onClick={this.handleInfiniteLoad}> Carregar mais... </Button>
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
                
                <InfiniteList />
                  
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
