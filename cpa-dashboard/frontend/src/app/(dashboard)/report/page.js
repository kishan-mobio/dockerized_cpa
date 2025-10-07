'use client'

import Header from "@/components/common/Header"

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Report</h1>
              <p className="text-gray-600 mb-8">Generate and view comprehensive business reports</p>
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-gray-500">This page is under development.</p>
                <p className="text-sm text-gray-400 mt-2">Reporting features will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
