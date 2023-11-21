import { ref, getCurrentInstance, watch, toRefs, nextTick, computed } from 'vue'

export default function useSearch (props, context, dep)
{
  const { regex, useInputForValue, mode, label, searchValue, maxLength } = toRefs(props)

  const $this = getCurrentInstance().proxy

  // ============ DEPENDENCIES ============

  const isOpen = dep.isOpen
  const open = dep.open
  const iv = dep.iv

  // ================ DATA ================

  const search = ref(null)

  const input = ref(null)

  // =============== METHODS ==============

  const clearSearch = () => {
    if (!useInputForValue.value)
      search.value = ''
    else
      setSearchValue()
  }

  const handleSearchInput = (e) => {
    search.value = e.target.value
  }

  const setSearchValue = () => {
    if (mode.value === 'single' && useInputForValue.value)
      search.value = iv.value[label.value] || ''
  }

  const handleKeypress = (e) => {
    if (regex && regex.value) {
      let regexp = regex.value

      if (typeof regexp === 'string') {
        regexp = new RegExp(regexp)
      }

      if (!e.key.match(regexp)) {
        e.preventDefault()
      }
    }
  }

  const adjustTextArea = () => {
    if (!input.value) return;
    input.value.style.height = "1px";
    input.value.style.height = (input.value.scrollHeight)+"px";
  }

  const handlePaste = (e) => {
    if (regex && regex.value) {
      let clipboardData = e.clipboardData || /* istanbul ignore next */ window.clipboardData
      let pastedData = clipboardData.getData('Text')

      let regexp = regex.value

      if (typeof regexp === 'string') {
        regexp = new RegExp(regexp)
      }

      if (!pastedData.split('').every(c => !!c.match(regexp))) {
        e.preventDefault()
      }
    }

    context.emit('paste', e, $this)
  }

  const maxSearchLength = computed(() => {
    return maxLength.value || Infinity;
  })

  // ============== WATCHERS ==============

  watch(search, async (val) => {
    if (!isOpen.value && val && !useInputForValue.value) {
      open()
    }

    context.emit('search-change', val, $this)

    await nextTick();
    adjustTextArea();
  })

  watch(searchValue, (val) => {
    search.value = val;
  })

  return {
    search,
    input,
    clearSearch,
    setSearchValue,
    handleSearchInput,
    handleKeypress,
    handlePaste,
    adjustTextArea,
    maxSearchLength,
  }
}
