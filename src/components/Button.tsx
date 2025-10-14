import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
    ActivityIndicator,
    AccessibilityState,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PrimaryColors, SemanticColors, Grays } from '@/constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: keyof typeof FontAwesome.glyphMap;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        textStyle,
    ];

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="small" color="#FFFFFF" />;
        }

        const iconElement = icon && (
            <FontAwesome
                name={icon}
                size={size === 'small' ? 14 : size === 'large' ? 20 : 16}
                color="#FFFFFF"
                style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
            />
        );

        return (
            <>
                {iconPosition === 'left' && iconElement}
                <Text style={textStyles}>{title}</Text>
                {iconPosition === 'right' && iconElement}
            </>
        );
    };

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled } as AccessibilityState}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    // Variants
    primary: {
        backgroundColor: PrimaryColors.blue,
    },
    secondary: {
        backgroundColor: Grays[600],
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: PrimaryColors.blue,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: SemanticColors.error,
    },

    // Sizes
    small: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 36,
    },
    medium: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
    },
    large: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 52,
    },

    // Text
    text: {
        fontWeight: '600',
    },
    primaryText: { color: '#FFFFFF' },
    secondaryText: { color: '#FFFFFF' },
    outlineText: { color: PrimaryColors.blue },
    ghostText: { color: PrimaryColors.blue },
    dangerText: { color: '#FFFFFF' },

    smallText: { fontSize: 14 },
    mediumText: { fontSize: 16 },
    largeText: { fontSize: 18 },

    // Disabled
    disabled: {
        opacity: 0.5,
    },

    // Icon spacing
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});

export default Button;