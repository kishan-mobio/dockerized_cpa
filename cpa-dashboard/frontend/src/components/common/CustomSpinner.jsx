import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CustomSpinner = ({
  size = 'large',
  tip = 'Loading...',
  className = '',
  spinning = true,
  children,
  ...props
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : size === 'small' ? 14 : 20 }} spin />;

  if (children) {
    return (
      <Spin
        indicator={antIcon}
        tip={tip}
        className={className}
        spinning={spinning}
        {...props}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div className={`custom-spinner ${className}`} style={{ textAlign: 'center', padding: '40px' }}>
      <Spin
        indicator={antIcon}
        tip={tip}
        size={size}
        {...props}
      />
    </div>
  );
};

export default CustomSpinner;
