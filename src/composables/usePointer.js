import { ref, toRefs } from 'vue'

export default function usePointer (props)
{
  const { groupSelect, mode, groups, disabledProp } = toRefs(props)

  // ================ DATA ================

  const pointer = ref(null)

  // =============== METHODS ==============

  const setPointer = (option) => {
    if (option === undefined || (option !== null && option[disabledProp.value])) {
      return
    }

    if (groups.value && option && option.group && (mode.value === 'single' || !groupSelect.value)) {
      return
    }

    pointer.value = option
  }

  const clearPointer = () => {
    setPointer(null)
  }

  return {
    pointer,
    setPointer,
    clearPointer,
  }
}
