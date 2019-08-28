import React from 'react';

import '../../static/util/BigText.css';


const BigText = ({children}) => {
    return (
        <div className="big-text">
            {children}
        </div>
    );
};


export default BigText;
