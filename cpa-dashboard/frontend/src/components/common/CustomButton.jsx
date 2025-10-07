import React from 'react';
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CustomButton = ({
  type = 'default',
  buttonText,
  icon,
  iconPosition = 'left',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  htmlType = 'button',
  size = 'middle',
  shape = 'default',
  block = false,
  danger = false,
  ghost = false,
  ...props
}) => {
  const renderIcon = () => {
    if (loading) {
      return <LoadingOutlined />;
    }
    if (icon) {
      return icon;
    }
    return null;
  };

  const buttonProps = {
    type,
    className,
    loading,
    disabled,
    onClick,
    htmlType,
    size,
    shape,
    block,
    danger,
    ghost,
    ...props,
  };

  return (
    <Button {...buttonProps}>
      {iconPosition === 'left' && renderIcon()}
      {buttonText && (
        <span style={{ marginLeft: iconPosition === 'left' && icon ? 8 : 0 }}>
          {buttonText}
        </span>
      )}
      {iconPosition === 'right' && renderIcon()}
    </Button>
  );
};

export default CustomButton;
