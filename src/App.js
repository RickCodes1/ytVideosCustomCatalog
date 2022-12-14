import logo from './logo.svg';
import './App.css';
import React, {useEffect} from 'react';
import {Stage, Layer, Star, Text} from 'react-konva';

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

const LOCAL_STORAGE_KEY = "item";

function getInitialState() {
    let localStorageItem;

    try {
        const temp = localStorage.getItem(LOCAL_STORAGE_KEY);
        localStorageItem = JSON.parse(temp);
    } catch (e) {
        console.log("Couldn't parse");
    }

    if (!localStorageItem?.length) return generateShapes();

    return localStorageItem;
}

let history = [];
let historyStep = 0;

const INITIAL_STATE = getInitialState();

function storeLocal(key, item) {
    if (typeof item === "object") {
        item = JSON.stringify(item);
    }

    localStorage.setItem(key, item);
}

function getStarCoordinates(star, eventTarget) {
    if (star.id === eventTarget.id()) {
        return {
            x: eventTarget.x(),
            y: eventTarget.y(),
        }
    } else {
        return {
            x: star.x,
            y: star.y
        }
    }
}

function getStarCoordinatesFromSavedItem(star, savedTarget) {
    if (star.id === savedTarget.id) {
        return {
            x: savedTarget.x,
            y: savedTarget.y,
        }
    } else {
        return {
            x: star.x,
            y: star.y
        }
    }
}

const App = () => {
    const [stars, setStars] = React.useState(INITIAL_STATE);

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


    const handleUndo = () => {
        if (historyStep === 0) {
          return;
        }
        historyStep -= 1;
        const previous = history[historyStep];

        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    ...getStarCoordinatesFromSavedItem(star,previous),
                    isDragging: false,
                };
            })
        );
      };
    
    const handleRedo = () => {
        if (historyStep === 0 || historyStep === history.length - 1) {
            return;
        }
        historyStep += 1;
        const next = history[historyStep];

        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    ...getStarCoordinatesFromSavedItem(star,next),
                    isDragging: false,
                };
            })
        );
    };

    const handleDragEnd = (e) => {
        const id = e.target.id();

        if(historyStep == 0){
            const modifiedItem = stars.map((star)=>{
                if(star.id === id) return star;
                return null;
            }).filter( el => {
                return el !== null;
            })[0];
            history = history.concat([modifiedItem]);
        }


        history = history.slice(0, historyStep + 1 );

        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    ...getStarCoordinates(star, e.target),
                    isDragging: false,
                };
            })
        );

        const modifiedItem = stars.map((star)=>{
            if(star.id === id){
                return {
                    ...star,
                    ...getStarCoordinates(star, e.target),
                    isDragging: false,
                };
            }
            return null;
        }).filter( el => {
            return el !== null;
          })[0];
        history = history.concat([modifiedItem]);
        historyStep += 1;

        // console.log(history);
        // console.log(historyStep);
    };

    useEffect(() => {
        storeLocal(LOCAL_STORAGE_KEY, stars);
    }, [stars]);


    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text text="undo" onClick={handleUndo} />
                <Text text="redo" x={40} onClick={handleRedo} />
                {/* <Text text='Try to drag a star'/> */}
                {stars.map((star) => (
                    <Star
                        key={star.id}
                        id={star.id}
                        x={star.x}
                        y={star.y}
                        numPoints={5}
                        innerRadius={20}
                        outerRadius={40}
                        fill='#89b717'
                        opacity={0.8}
                        draggable
                        rotation={star.rotation}
                        shadowColor='black'
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
    );
};

export default App;