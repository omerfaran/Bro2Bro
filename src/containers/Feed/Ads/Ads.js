import React from 'react';
import AdCard from './AdCard/AdCard'
import globalStyles from '../../../App.css';

import {ADS} from '../../../APIs/EnumDictionary/Images';

const ads = () => (
            <div className={globalStyles.Box}>
                <h4 className="mb-2" style={{color: 'gray'}}>Ads</h4>

                <AdCard pic={ADS[0]}
                title="Bro yourself!"
                content="Sign up to our cool magazine and join more than 10,000 happy bros around the world. 
                Hot stuff inside, updated daily."
                />

                <AdCard pic={ADS[1]}
                title="Enjoy your life"
                content="Do the things you love the most and live every moment to its fullest. Click here for more
                 information."
                />
            </div>
        )


export default ads;