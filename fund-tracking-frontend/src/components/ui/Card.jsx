import React from 'react';
import { CardSpotlight } from './CardSpotlight';

const Card = ({ children, className = '', hover = false, style = {}, ...props }) => {
    return (
        <CardSpotlight 
            className={`glass-panel ${className}`}
            style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                ...style
            }}
            radius={400}
            color="rgba(99, 102, 241, 0.3)"
            {...props}
        >
            {children}
        </CardSpotlight>
    );
};

export default Card;
