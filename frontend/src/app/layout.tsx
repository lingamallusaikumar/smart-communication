import './globals.css';
import React from 'react';

export const metadata = {
  title: 'SmartCommunication CRM',
  description: 'AI-Powered CRM and Omnichannel Communication Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
