import { computed, watch } from "vue";

export function useBorderStyle(props, type) {
    let splitLineColor = "rgb(227, 227, 227)"
    let borderBottomStyle = computed(() => {
        return props.options.direction === "row" ? `0px solid ${splitLineColor}` : props.maxOrder !== props.options.order[type] ? `3px solid ${splitLineColor}` : `0px solid ${splitLineColor}`;
    });
    let borderRightStyle = computed(() => {
        return props.options.direction === "row" ? props.maxOrder !== props.options.order[type] ? `3px solid ${splitLineColor}` : `0px solid ${splitLineColor}` : `0px solid ${splitLineColor}`;
    });

    return { borderBottomStyle, borderRightStyle }
}