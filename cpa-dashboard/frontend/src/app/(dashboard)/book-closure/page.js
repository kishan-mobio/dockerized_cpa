'use client'

import Header from "@/components/common/Header"

export default function BookClosurePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Closure</h1>
              <p className="text-gray-600 mb-8">Manage financial year-end procedures and compliance</p>
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-gray-500">Select a client to manage their book closure process.</p>
                <p className="text-sm text-gray-400 mt-2">Navigate to the listing page to choose a client.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
