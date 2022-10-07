import { useEffect, useRef } from 'react';

// ==============================|| ELEMENT REFERENCE HOOKS  ||============================== //

export const useScriptRef = () => {
    const scripted = useRef(true);

    useEffect(
        () => () => {
            scripted.current = false;
        },
        []
    );

    return scripted;
};
