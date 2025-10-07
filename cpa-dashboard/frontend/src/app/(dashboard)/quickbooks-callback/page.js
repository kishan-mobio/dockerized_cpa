"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Header from '@/components/common/Header';

function QuickBooksCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [messageText, setMessageText] = useState('Processing QuickBooks connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessageText('QuickBooks connection failed. Please try again.');
          message.error('QuickBooks connection failed');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessageText('Invalid callback parameters');
          message.error('Invalid callback parameters');
          return;
        }

        // The backend will handle the callback automatically
        // We just need to show success and redirect
        setStatus('success');
        setMessageText('QuickBooks connected successfully!');
        message.success('QuickBooks connected successfully!');

        // Redirect back to apps manager after 2 seconds
        setTimeout(() => {
          router.push('/apps-manager');
        }, 2000);

      } catch (error) {
        console.error('QuickBooks callback error:', error);
        setStatus('error');
        setMessageText('An error occurred during connection');
        message.error('Connection failed');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-lg">{messageText}</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-green-600 mb-2">Success!</h2>
            <p className="text-lg text-gray-600">{messageText}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to Apps Manager...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <CloseCircleOutlined className="text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Connection Failed</h2>
            <p className="text-lg text-gray-600">{messageText}</p>
            <button
              onClick={() => router.push('/apps-manager')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Apps Manager
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
      {renderContent()}
    </div>
  );
}

export default function QuickBooksCallbackPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header clientLogo="/clientLogo.png" />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Suspense 
          fallback={
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="text-center">
                <Spin size="large" />
                <p className="mt-4 text-lg">Loading...</p>
              </div>
            </div>
          }
        >
          <QuickBooksCallbackContent />
        </Suspense>
      </main>
    </div>
  );
}
