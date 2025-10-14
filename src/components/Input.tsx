import React from 'react';
import {
    TextInput,
    TextInputProps,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
    View,
    Text,
    AccessibilityState,
} from 'react-native';
import { ColorTheme, Grays, PrimaryColors, SemanticColors } from '@/constants/Colors';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    hint?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    hintStyle?: StyleProp<TextStyle>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'outlined' | 'filled';
    colors?: ColorTheme;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    hintStyle,
    leftIcon,
    rightIcon,
    variant = 'default',
    colors,
    editable = true,
    ...textInputProps
}) => {
    // Cores padrão se não forem fornecidas
    const defaultColors = {
        text: Grays[900],
        textSecondary: Grays[600],
        background: Grays[50],
        backgroundSecondary: '#FFFFFF',
        border: Grays[200],
        tint: PrimaryColors.blue,
        success: SemanticColors.success,
        warning: SemanticColors.warning,
        error: SemanticColors.error,
        info: SemanticColors.info,
        tabIconDefault: Grays[400],
        tabIconSelected: PrimaryColors.blue,
        tabBackground: '#FFFFFF',
        headerBackground: PrimaryColors.blue,
        primary: PrimaryColors.blue,
        secondary: PrimaryColors.teal,
    };

    const themeColors = colors || defaultColors;

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: themeColors.text,
            marginBottom: 8,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: themeColors.text,
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: themeColors.border,
            backgroundColor: themeColors.background,
        },
        // Variants
        default: {
            borderColor: themeColors.border,
            backgroundColor: themeColors.background,
        },
        outlined: {
            borderColor: themeColors.tint,
            borderWidth: 2,
            backgroundColor: themeColors.background,
        },
        filled: {
            borderColor: themeColors.border,
            backgroundColor: Grays[100],
        },
        // States
        disabled: {
            backgroundColor: Grays[100],
            color: Grays[500],
        },
        error: {
            borderColor: themeColors.error,
        },
        errorText: {
            fontSize: 12,
            color: themeColors.error,
            marginTop: 4,
            fontWeight: '500',
        },
        hintText: {
            fontSize: 12,
            color: themeColors.textSecondary,
            marginTop: 4,
            fontWeight: '400',
        },
        leftIcon: {
            position: 'absolute',
            left: 12,
            zIndex: 1,
        },
        rightIcon: {
            position: 'absolute',
            right: 12,
            zIndex: 1,
        },
    });

    const containerStyles = [
        styles.container,
        containerStyle,
    ];

    const getInputPadding = () => {
        const hasLeftIcon = !!leftIcon;
        const hasRightIcon = !!rightIcon;

        if (hasLeftIcon || hasRightIcon) {
            return {
                paddingLeft: hasLeftIcon ? 44 : 24,
                paddingRight: hasRightIcon ? 44 : 24,
            };
        }
        return {};
    };

    return (
        <View style={containerStyles}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                </Text>
            )}
            <View style={styles.inputContainer}>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        styles[variant],
                        !editable && styles.disabled,
                        error && styles.error,
                        getInputPadding(),
                        inputStyle,
                    ]}
                    editable={editable}
                    placeholderTextColor={error ? themeColors.error : Grays[400]}
                    accessibilityState={{ disabled: !editable } as AccessibilityState}
                    {...textInputProps}
                />
                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>
            {error && (
                <Text style={[styles.errorText, errorStyle]}>
                    {error}
                </Text>
            )}
            {!error && hint && (
                <Text style={[styles.hintText, hintStyle]}>
                    {hint}
                </Text>
            )}
        </View>
    );
};

export default Input;