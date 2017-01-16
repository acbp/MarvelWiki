
import './index.css';

import React, {
  Component
}
from 'react';
import ReactDOM from 'react-dom';
import 
    { 
        Button, ButtonGroup, Glyphicon, Modal, Popover, Tooltip, OverlayTrigger, Carousel
    } from 'react-bootstrap';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import data from './data.json';
import Infinite from 'react-infinite';

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
//
class Card extends Component {
  render() {
    return (
      <div className="timeline" >
      <img role="presentation" src={this.props.thumbnail.path+"/portrait_incredible."+this.props.thumbnail.type} className="thumbnail"/></div>
    );
  }
}


const ListItem2 = React.createClass({
    render: function() {
        return (
            <div className="thumbnail image-center">
            <img role="presentation" src={this.props.url} className="thumbnail image-center"></img>
            </div>
        );
    }
});


const InfiniteList2 = React.createClass({
    getInitialState: function() {
        return {
            elements: this.buildElements(0,20),
            offset:0,
            total:Number.POSITIVE_INFINITY,
            limit:0,
            isInfiniteLoading: false
        }
    },
    
    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i}/>)
        }
        return elements;
    },
    

    handleInfiniteLoad: function() {
        var that = this, 
            query, 
            isFinished=(this.state.total>this.state.offset)===false;
        
        if(isFinished){
            return;
        }
        
        this.setState({
            isInfiniteLoading: true
        });
        
        query="?format=comic&formatType=comic&orderBy=-onsaleDate&limit=50&offset="+this.state.offset;
     
        getComics(query).then(
            function(r){
                console.log(r.data.results);
                var data = r.data,
                    newElements = data.results.map(function(e,i){
                        var url = e.thumbnail || e.images;
                        url = url.path+"/portrait_incredible."+url.extension;
                        return (<ListItem url={url} key={i}/>);
                    });
                    
                that.setState({
                    isInfiniteLoading: false,
                    total:data.total,
                    offset:(data.offset+1),
                    elements: that.state.elements.concat(newElements)
                });
            }
        );
        
    },

    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    render: function() {
        return <Infinite elementHeight={220}                         
                         containerHeight={1000}
                         infiniteLoadingBeginBottomOffset={660}
                         timeScrollStateLastsForAfterUserScrolls={100}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         >
            {this.elements}
        </Infinite>;
    }
});


var ListItem = React.createClass({
    getDefaultProps: function() {
        return {
            height: 50,
            lineHeight: "50px"
        }
    },
    render: function() {
        return (
            <div >
                <img 
                    role="presentation" 
                    src={this.props.url} 
                    className="thumbnail image-center"></img>
            </div>
        );
    }
});

var InfiniteList = React.createClass({
    getInitialState: function() {
        return {
            elements: this.buildElements(0, 50),
            isInfiniteLoading: false
        }
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i} index={i}/>)
        }
        return elements;
    },

    handleInfiniteLoad: function() {
        var that = this, 
            query, 
            isFinished=(this.state.total>this.state.offset)===false;
        
        if(isFinished){
            return;
        }
        
        this.setState({
            isInfiniteLoading: true
        });
        
        query="?format=comic&formatType=comic&orderBy=-onsaleDate&limit=50&offset="+this.state.offset;
     
        getComics(query).then(
            function(r){
                console.log(r.data.results);
                var data = r.data,
                    newElements = data.results.map(function(e,i){
                        var url = e.thumbnail || e.images;
                        url = url.path+"/portrait_incredible."+url.extension;
                        return (<ListItem url={url} key={i}/>);
                    });
                    
                that.setState({
                    isInfiniteLoading: false,
                    total:data.total,
                    offset:(data.offset+1),
                    elements: that.state.elements.concat(newElements)
                });
            }
        );
        
    },

    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    render: function() {
        return <Infinite elementHeight={220}
                         containerHeight={window.innerHeight}
                         infiniteLoadBeginEdgeOffset={200}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={2000}
                         useWindowAsScrollContainer={true}
                         >
                    {this.state.elements}
                </Infinite>;
    }
});

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
