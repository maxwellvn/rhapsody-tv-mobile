import { Pressable, Text, type PressableProps, type TextProps } from 'react-native';

type ButtonProps = PressableProps & {
  children: React.ReactNode;
  textClassName?: string;
  textStyle?: TextProps['style'];
};

export function Button({ 
  children, 
  className, 
  style,
  textClassName,
  textStyle,
  ...pressableProps 
}: ButtonProps) {
  return (
    <Pressable
      className={className}
      style={style}
      {...pressableProps}
    >
      <Text className={textClassName} style={textStyle}>
        {children}
      </Text>
    </Pressable>
  );
}
