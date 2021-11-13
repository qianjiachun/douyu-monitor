import { computed } from "vue";

export function useDirectionStyle(options) {
    let directionStyle = computed(() => {
        return options.value.direction;
    });

    return { directionStyle }
}