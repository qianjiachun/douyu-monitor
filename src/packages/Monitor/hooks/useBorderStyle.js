import { computed } from "vue";

export function useBorderStyle(props, type) {
    let borderBottomStyle = computed(() => {
        let splitLineColor = props.options.mode === "night" ? "rgb(81, 81, 81)" : "rgb(227, 227, 227)";
        return props.options.direction === "row" ? `0px solid ${splitLineColor}` : props.maxOrder !== props.options.order[type] ? `3px solid ${splitLineColor}` : `0px solid ${splitLineColor}`;
    });
    let borderRightStyle = computed(() => {
        let splitLineColor = props.options.mode === "night" ? "rgb(81, 81, 81)" : "rgb(227, 227, 227)";
        return props.options.direction === "row" ? props.maxOrder !== props.options.order[type] ? `3px solid ${splitLineColor}` : `0px solid ${splitLineColor}` : `0px solid ${splitLineColor}`;
    });

    return { borderBottomStyle, borderRightStyle }
}