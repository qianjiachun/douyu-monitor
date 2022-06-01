import { useState } from "react";


export function useScroll() {
    const [isLock, setIsLock] = useState(false);

    const onScroll = (dom: any) => {
        let element = dom;
        // 是否有滚动条
        let isScroll = element.scrollHeight > element.clientHeight;
        let isBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        // 当且只当有滚动条 且不在底部的 时候，才锁住
        setIsLock(isScroll && !isBottom);
    }
    const onScrollUpdate = (dom: any) => {
        if (!isLock) {
            dom.scrollTop = dom.scrollHeight;
        }
    }
    const goToScrollBottom = (dom: any) => {
        dom.scrollTop = dom.scrollHeight;
        setIsLock(false);
    }
    return { isLock, onScroll, onScrollUpdate, goToScrollBottom }
}