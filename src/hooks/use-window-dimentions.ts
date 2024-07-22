import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@constants';

function getWindowDimentions() {
    if (typeof window === 'undefined')
        return {
            width: 0,
            height: 0,
            isXL: false,
            isLG: false,
            isMD: false,
            isSM: false,
            isXS: false,
        }; // Default values for SSR

    const { innerWidth: width, innerHeight: height } = window;
    const isXL =
        width <= BREAKPOINTS.MAX_SCREEN_WIDTH_XL && width >= BREAKPOINTS.MIN_SCREEN_WIDTH_XL;
    const isLG =
        width <= BREAKPOINTS.MAX_SCREEN_WIDTH_LG && width >= BREAKPOINTS.MIN_SCREEN_WIDTH_LG;
    const isMD =
        width <= BREAKPOINTS.MAX_SCREEN_WIDTH_MD && width >= BREAKPOINTS.MIN_SCREEN_WIDTH_MD;
    const isSM =
        width <= BREAKPOINTS.MAX_SCREEN_WIDTH_SM && width >= BREAKPOINTS.MIN_SCREEN_WIDTH_SM;
    const isXS =
        width <= BREAKPOINTS.MAX_SCREEN_WIDTH_XS && width >= BREAKPOINTS.MIN_SCREEN_WIDTH_XS;
    return {
        width,
        height,
        isXL,
        isLG,
        isMD,
        isSM,
        isXS,
    };
}

function useWindowDimentions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimentions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimentions());
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowDimensions;
}

export { useWindowDimentions };
