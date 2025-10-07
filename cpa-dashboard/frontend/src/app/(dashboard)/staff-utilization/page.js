'use client'

import Header from "@/components/common/Header"

export default function StaffUtilizationPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Utilization</h1>
              <p className="text-gray-600 mb-8">Monitor and analyze staff productivity and utilization</p>
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-gray-500">This page is under development.</p>
                <p className="text-sm text-gray-400 mt-2">Staff utilization analytics will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
