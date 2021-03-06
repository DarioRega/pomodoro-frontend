import Icon from '../../components/Atoms/Icon'

export default {
  title: 'Atoms/Icon',
  component: Icon,
  argTypes: {
    iconName: {
      control: { type: 'text' },
    },
  },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Icon },
  template: '<icon v-bind="$props" class="text-gray-900 w-12 h-12"/>',
})

export const Close = Template.bind({})
Close.args = {
  iconName: 'Close',
}
