import React, { useState } from "react";
import Image from "next/image";

interface AppNameBarProps {
  name: string;
  logo?: string;
  copyIcon?: React.ReactNode;
  redirectIcon?: React.ReactNode;
}

const AppNameBar: React.FC<AppNameBarProps> = ({ name, logo, copyIcon, redirectIcon }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(name).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      });
    }
  };
  return (
    <div
      className="w-full"
      style={{
        height: 40,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          height: 30,
          width: "90%",
          backgroundColor: "#ffffff0d",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          fontSize: 15,
          paddingLeft: 4,
          paddingRight: 8,
          minWidth: 0,
        }}
      >
        {logo && (
          <span style={{ display: 'flex', alignItems: 'center', marginRight: 10, opacity: 0.7, flexShrink: 0 }}>
            <Image src={logo} alt="logo" width={22} height={22} style={{ borderRadius: 6 }} />
          </span>
        )}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#9ca3af',
          }}
          title={name}
        >
          {name}
        </span>
        {copyIcon && (
          <span
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', marginLeft: 8, flexShrink: 0 }}
            onClick={handleCopy}
            title="Copy"
          >
            {copyIcon}
            {copied && (
              <span
                style={{
                  position: 'absolute',
                  right: '25px',
                  background: '#222',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: 6,
                  padding: '2px 10px',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                  boxShadow: '0 2px 8px #0002',
                  opacity: 0.7,
                }}
              >
                Link Copied !
              </span>
            )}
          </span>
        )}
        {redirectIcon && (
          <span style={{ display: 'flex', alignItems: 'center', marginLeft: 10, opacity: 0.7, cursor: 'pointer', flexShrink: 0 }} title="Redirect to app">
            {redirectIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default AppNameBar;
