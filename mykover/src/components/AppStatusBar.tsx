import React from 'react';
import { StatusBar, Platform } from 'react-native';

interface AppStatusBarProps {
  backgroundColor?: string;
  barStyle?: 'light-content' | 'dark-content' | 'default';
}

const AppStatusBar: React.FC<AppStatusBarProps> = ({ 
  backgroundColor = '#8A4DFF',
  barStyle = 'light-content'
}) => {
  return (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      translucent={false}
    />
  );
};

export default AppStatusBar;

