import { ref } from 'vue'
export const useResizeY = (id, emits) => {
    let startX = ref(0);
    let curLen = ref(0);
    let otherBoxWidth = ref(0);

    let resizeBox = ref(null);
    let currentBox = ref(null);
    let rightBox = ref(null);
    let wrapBox = ref(null);

    let newSize = ref(0);


    function onMouseDownResizeY(e) {
        resizeBox.value = e.target;
        currentBox.value = resizeBox.value.parentNode;// 当前盒子
        rightBox.value = getNextElement(currentBox.value);// 当前盒子的下个兄弟节点
        wrapBox.value = currentBox.value.parentNode;
        if (!rightBox.value) return;
        curLen.value = currentBox.value.clientWidth;
        otherBoxWidth.value = wrapBox.value.clientWidth - currentBox.value.clientWidth - rightBox.value.clientWidth; // 其他盒子的宽度
        startX.value = e.clientX || e.changedTouches[0].clientX;
        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
        document.addEventListener('touchmove', onMousemove);
        document.addEventListener('touchend', onMouseup);
    }

    // 获取下一个兄弟元素的兼容函数
    function getNextElement(element) {
        if (element.nextElementSibling) {
            return element.nextElementSibling;
        } else {
            var next = element.nextSibling;// 下一个兄弟节点
            while (next && next.nodeType !== 1) { // 有 并且 不是我想要的
                next = next.nextSibling;
            }
            return next
        }
    }

    function onMousemove(e) {
        const endX = e.clientX || e.changedTouches[0].clientX;
        const moveLen = endX - startX.value; // （endx-startx）= 移动的距离
        const CurBoxLen = curLen.value + moveLen; // resize[i].left+移动的距离=左边区域最后的宽度
        const rightBoxLen = wrapBox.value.clientWidth - CurBoxLen - otherBoxWidth.value; // 右侧宽度=总宽度-左侧宽度-其它盒子宽度
        // 当最小宽度时，无法继续拖动
        currentBox.value.style.width = CurBoxLen + 'px';// 当前盒子的宽度
        resizeBox.value.style.left = CurBoxLen; // 设置左侧区域的宽度
        rightBox.value.style.width = rightBoxLen + 'px';
        newSize.value = CurBoxLen;
    }

    function onMouseup() {
        // 颜色恢复
        
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
        document.removeEventListener('touchmove', onMousemove);
        document.removeEventListener('touchend', onMouseup);
        emits("changeSize", {
            id,
            newSize: newSize.value
        });
    }

    return {
        onMouseDownResizeY
    }
}