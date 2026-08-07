import { useEffect, useState } from 'react';
/**
export default function useDebounce(value, delay = 500): {
    const [debounceVal, setDebounceVal] = useState(""); //value: 받아온 input값

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceVal(value);
        }, delay);
        return () => { // 클린업함수 적용 (unmount 됐을 때 eventhandler 깨끗히 청소)
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounceVal; // 새로 업데이트된 값을 return
}
**/