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
    editable = true,
    ...textInputProps
}) => {
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
                    placeholderTextColor={error ? '#EF4444' : '#999'}
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

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
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
        color: '#111827',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    // Variants
    default: {
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    outlined: {
        borderColor: '#3B82F6',
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
    },
    filled: {
        borderColor: '#D1D5DB',
        backgroundColor: '#F9FAFB',
    },
    // States
    disabled: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
    },
    error: {
        borderColor: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
        fontWeight: '500',
    },
    hintText: {
        fontSize: 12,
        color: '#6B7280',
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

export default Input;