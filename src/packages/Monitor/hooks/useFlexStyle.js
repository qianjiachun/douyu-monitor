import { computed } from "vue";

export function useFlexStyle(props, type) {
    let flexStyle = computed(() => {
        return props.maxOrder === props.options.order[type] ? "1" : `0 0 ${String(props.options.size[type])}%`;
    });
    let orderStyle = computed(() => {
        return String(props.options.order[type]);
    });

    return { flexStyle, orderStyle }
}