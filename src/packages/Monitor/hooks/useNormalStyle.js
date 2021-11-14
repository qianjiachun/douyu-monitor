import { computed } from "vue";

export function useNormalStyle(options) {
    let directionStyle = computed(() => {
        return options.value.direction;
    });

    let fontSizeStyle = computed(() => {
        return `${options.value.fontSize}px`;
    });

    return { directionStyle, fontSizeStyle }
}