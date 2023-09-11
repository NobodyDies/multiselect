import { ref, getCurrentInstance, watch, toRefs } from 'vue'

export default function useSearch (props, context, dep)
{
  const { regex, clearOnSelect, clearOnBlur, mode, label } = toRefs(props)

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
    search.value = ''
  }

  const handleSearchInput = (e) => {
    search.value = e.target.value
  }

  const setSearchValue = () => {
    if (mode.value === 'single' && !clearOnSelect.value && !clearOnBlur.value)
      search.value = iv.value[label.value]
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

  // ============== WATCHERS ==============

  watch(search, (val) => {
    if (!isOpen.value && val) {
      open()
    }

    context.emit('search-change', val, $this)
  })

  watch(iv, setSearchValue)

  return {
    search,
    input,
    clearSearch,
    setSearchValue,
    handleSearchInput,
    handleKeypress,
    handlePaste,
  }
}
