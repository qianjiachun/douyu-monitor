import {ref, computed} from "vue"
export function usedrag(chunks) {
    function changeSize(data) {
        let index = -1;
        for (let i = 0; i < chunks.value.length; i++) {
            if (chunks.value[i].id === data.id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            let diffSize = data.newSize - chunks.value[index].size;
            if (index <= chunks.value.length - 1) {
                chunks.value[index + 1].size = Math.abs(chunks.value[index + 1].size - diffSize);
            }
            chunks.value[index].size = Math.abs(data.newSize);
        }
    }

    let dragOptions = computed(() => {
        return {
            animation: 0,
            group: "description",
            disabled: false,
            ghostClass: "ghost"
        }
    })
    return { changeSize, dragOptions }
}