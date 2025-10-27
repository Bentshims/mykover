import { Text as DefaultText, TextInput as DefaultTextInput } from 'react-native';

const originalTextRender = DefaultText.render;
const originalTextInputRender = DefaultTextInput.render;

if (originalTextRender) {
  DefaultText.render = function render(props: any, ref: any) {
    const style = Array.isArray(props.style)
      ? [{ fontFamily: 'Quicksand' }, ...props.style]
      : [{ fontFamily: 'Quicksand' }, props.style];
    
    return originalTextRender.call(this, { ...props, style }, ref);
  };
}

if (originalTextInputRender) {
  DefaultTextInput.render = function render(props: any, ref: any) {
    const style = Array.isArray(props.style)
      ? [{ fontFamily: 'Quicksand' }, ...props.style]
      : [{ fontFamily: 'Quicksand' }, props.style];
    
    return originalTextInputRender.call(this, { ...props, style }, ref);
  };
}

export {};

