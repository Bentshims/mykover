import { Text, TextInput } from 'react-native';

const defaultTextProps = Text.defaultProps || {};
const defaultTextInputProps = TextInput.defaultProps || {};

Text.defaultProps = {
  ...defaultTextProps,
  style: [{ fontFamily: 'Quicksand' }, defaultTextProps.style],
};

TextInput.defaultProps = {
  ...defaultTextInputProps,
  style: [{ fontFamily: 'Quicksand' }, defaultTextInputProps.style],
};

export {};

