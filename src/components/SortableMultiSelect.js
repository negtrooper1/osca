import React from 'react'

import Select, { components } from 'react-select'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

function arrayMove(array, from, to) {
  array = array.slice()
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0])
  return array
}

const SortableMultiValue = SortableElement(props => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = e => {
    e.preventDefault()
    e.stopPropagation()
  }
  const innerProps = { onMouseDown }
  return <components.MultiValue {...props} innerProps={innerProps} />
})

const SortableSelect = SortableContainer(Select)

export default function MultiSelectSort({ options=[], value={}, onChange }) {
  const implicitLabels = Array.isArray(options)
  options = implicitLabels ? valuesAsLabels(options) : options
  value = implicitLabels ? valuesAsLabels(value) : value

  const [selected, setSelected] = React.useState(orderLabels(value))

  const handleChange = selectedOptions => {
    setSelected(orderLabels(selectedOptions))
    onChange(implicitLabels ? valuesFromOptions(selectedOptions) : selectedOptions)
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const selectedOptions = arrayMove(selected, oldIndex, newIndex)
    setSelected(orderLabels(selectedOptions))
    onChange(implicitLabels ? valuesFromOptions(selectedOptions) : selectedOptions)
  }

  return (
    <SortableSelect
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      // react-select props:
      isMulti
      options={options}
      value={selected}
      onChange={handleChange}
      components={{
        MultiValue: SortableMultiValue,
      }}
      closeMenuOnSelect={false}
      styles={{
        multiValue: (style, state) => ({
          ...style,
          justifyContent: 'space-between',
          padding: '0.25rem',
          width: '100%'
        }),
        // input: (style, state) => ({
        //   display: state.isFocused 'none'
        // }),
        valueContainer: (style, state) => ({
          ...style,
          flexDirection: 'column'
        })
      }}
    />
  )
}

function valuesAsLabels (values) {
  return values.map(value => ({ value, label: value }))
}

function valuesFromOptions (options) {
  return options.map(({ value }) => value)
}

function orderLabels (options) {
  return options.map(({ value, label }, i) => ({ 
    value, 
    label: `${i+1}. ${label.slice(label.indexOf('. ')+label.indexOf('. ') >= 0 ? 2 : 0)}` 
  }))
}