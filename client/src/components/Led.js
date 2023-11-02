/*
    PURPOSE OF COMPONENT:
    - sub-component of Grid and Editor
    - component representing the design of each individual "LED" or square in the grid
    - handles the visual changing of their color values
*/

import React from 'react';

function Led({ color, onClick, onMouseEnter }) {
    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            style={{
                width: '14px',
                height: '14px',
                backgroundColor: color,
                border: '1px solid black',
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: `0 0 10px ${color}`
            }}
        >
        </div>
    );
}

export default Led;
