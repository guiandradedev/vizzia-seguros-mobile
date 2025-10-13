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
        getVariantTextStyle(variant),
        getSizeTextStyle(size),
        textStyle,
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    size="small"
                    color={getIconColor(variant)}
                />
            );
        }

        const iconElement = icon && (
            <FontAwesome
                name={icon}
                size={getIconSize(size)}
                color={getIconColor(variant)}
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

// Utils

const getIconSize = (size: ButtonSize): number => {
    switch (size) {
        case 'small': return 14;
        case 'large': return 20;
        default: return 16;
    }
};

const getIconColor = (variant: ButtonVariant): string => {
    switch (variant) {
        case 'outline':
        case 'ghost':
            return '#007AFF';
        default:
            return '#FFFFFF';
    }
};

const getVariantTextStyle = (variant: ButtonVariant): TextStyle => {
    switch (variant) {
        case 'primary':
        case 'secondary':
        case 'danger':
            return styles.primaryText;
        case 'outline':
            return styles.outlineText;
        case 'ghost':
            return styles.ghostText;
    }
};

const getSizeTextStyle = (size: ButtonSize): TextStyle => {
    switch (size) {
        case 'small':
            return styles.smallText;
        case 'large':
            return styles.largeText;
        default:
            return styles.mediumText;
    }
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
        backgroundColor: '#007AFF',
    },
    secondary: {
        backgroundColor: '#6B7280',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: '#EF4444',
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
    outlineText: { color: '#007AFF' },
    ghostText: { color: '#007AFF' },

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