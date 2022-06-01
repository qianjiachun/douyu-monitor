import { ref } from "vue";

export function useScroll() {
    let isLock = ref(false);
    
    const onScroll = (dom) => {
        let element = dom;
        // 是否有滚动条
        let isScroll = element.scrollHeight > element.clientHeight;
        let isBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        // 当且只当有滚动条 且不在底部的 时候，才锁住
        isLock.value = isScroll && !isBottom;
    }
    const onScrollUpdate = (dom) => {
        if (!isLock.value) {
            dom.scrollTop = dom.scrollHeight;
        }
    }
    const goToScrollBottom = (dom) => {
        dom.scrollTop = dom.scrollHeight;
        isLock.value = false;
    }
    return { isLock, onScroll, onScrollUpdate, goToScrollBottom }
}