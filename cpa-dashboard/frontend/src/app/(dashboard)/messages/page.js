'use client'

import Header from "@/components/common/Header"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600 mb-8">Communicate with clients and team members</p>
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-gray-500">This page is under development.</p>
                <p className="text-sm text-gray-400 mt-2">Messaging features will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
