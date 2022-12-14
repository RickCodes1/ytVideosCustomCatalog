import logo from './logo.svg';
import './App.css';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Stage, Layer, Star, Text } from 'react-konva';

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();

const App = () => {

  function copyInitialShapes(){
    let starsQty = INITIAL_STATE.length;
    return [...Array(starsQty)].map((_, i) => ({
      id: INITIAL_STATE[i].id,
      x: INITIAL_STATE[i].x,
      y: INITIAL_STATE[i].y,
    }));
  }

  const COPIED_FROM_INITIAL_STATE = copyInitialShapes();
  
  const LOCAL_STORAGE_KEY = "itemsPositions";

  const [starsPositions, setStarsPositions] = React.useState((JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)).length == 0? null: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ) ?? COPIED_FROM_INITIAL_STATE);

  function restoreShapes(){
    let starsQty = starsPositions.length;
    return [...Array(starsQty)].map((_, i) => ({
      id: starsPositions[i].id,
      x: starsPositions[i].x,
      y: starsPositions[i].y,
      rotation: Math.random() * 180,
      isDragging: false,
    }));
  }

  const RESTORED_FROM_SAVED_STATE = (restoreShapes()).length === [].length? null : restoreShapes() ;

  (()=>{
    console.log((restoreShapes()).length)
    console.log((restoreShapes()).length === [].length)
    console.log(restoreShapes())
    console.log((restoreShapes()).length === [].length? null : restoreShapes())
    console.log(RESTORED_FROM_SAVED_STATE ?? INITIAL_STATE)

  })();

  const [stars, setStars] = React.useState(RESTORED_FROM_SAVED_STATE ?? INITIAL_STATE);
  
  //const [stars, setStars] = React.useState(INITIAL_STATE);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })
    );
  };
  const handleDragEnd = (e) => {
    alert(stars);
    setStarsPositions(
      starsPositions.map((star,j) => {
        star.id = stars[j].id;
        star.x = stars[j].x;
        star.y = stars[j].y;
      })
    );
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
    
  };

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(starsPositions));
  }, [starsPositions]);

  return (
    <div>
    <div>{JSON.stringify(starsPositions)}</div>
    <div>{JSON.stringify(stars)}</div>
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {/* <Text text="Try to drag a star" /> */}
        <Text text={JSON.stringify(stars)} />
        {stars.map((star) => (
          <Star
            key={star.id}
            id={star.id}
            x={star.x}
            y={star.y}
            numPoints={5}
            innerRadius={20}
            outerRadius={40}
            fill="#89b717"
            opacity={0.8}
            draggable
            rotation={star.rotation}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={star.isDragging ? 10 : 5}
            shadowOffsetY={star.isDragging ? 10 : 5}
            scaleX={star.isDragging ? 1.2 : 1}
            scaleY={star.isDragging ? 1.2 : 1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
    </div>
  );
};


const YTVideoOverview = require("./model/YTVideoOverview.js");
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://0.0.0.0/ytVideosOverview00";


// connection to db
(async () => {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    console.log("Db connectect to", db.connection.name);
  } catch (error) {
    console.error(error);
  }
})();





export default App;
