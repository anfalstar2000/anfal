"use client"
import { X, Square, MousePointer, Type, Hand, MessageCircle } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* macOS Window Frame - يظهر على جميع الأحجام */}
      <div className="bg-gray-100 border-b border-gray-300">
        {/* Traffic Lights */}
        <div className="flex items-center px-4 md:px-4 py-4 md:py-3">
          <div className="flex space-x-2 md:space-x-2">
            <div className="w-4 h-4 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
            <div className="w-4 h-4 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
          </div>

          {/* Browser Tabs */}
          <div className="flex ml-4 md:ml-4 lg:ml-8 space-x-1">
            <div className="flex items-center bg-white rounded-t-lg px-4 md:px-4 py-2 md:py-2 space-x-2 md:space-x-2">
              <div className="w-5 h-5 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center">
                <img src="/anfal-icon.png" alt="Anfal" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-sm md:text-sm font-medium">2024</span>
              <X className="w-4 h-4 md:w-3 md:h-3 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center bg-gray-200 rounded-t-lg px-4 md:px-4 py-2 md:py-2 space-x-2 md:space-x-2 opacity-70">
              <div className="w-5 h-5 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center">
                <img src="/anfal-icon.png" alt="Anfal" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-sm md:text-sm font-medium">2023</span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="ml-auto"></div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center px-4 md:px-4 py-3 md:py-2 bg-gray-50 border-t border-gray-700">
          <div className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center mr-4 md:mr-4">
            <img src="/anfal-icon.png" alt="Anfal" className="w-full h-full object-cover rounded-full" />
          </div>

          <div className="flex space-x-2 md:space-x-1">
            <button className="p-2 md:p-2 hover:bg-gray-200 rounded">
              <MousePointer className="w-5 h-5 md:w-4 md:h-4 text-blue-400" />
            </button>
            <button className="p-2 md:p-2 hover:bg-gray-200 rounded">
              <Square className="w-5 h-5 md:w-4 md:h-4 text-gray-400" />
            </button>
            <button className="p-2 md:p-2 hover:bg-gray-200 rounded">
              <div className="w-5 h-5 md:w-4 md:h-4 border-2 border-gray-400 rounded-full"></div>
            </button>
            <button className="p-2 md:p-2 hover:bg-gray-200 rounded">
              <Type className="w-5 h-5 md:w-4 md:h-4 text-gray-400" />
            </button>
            <button className="p-2 md:p-2 hover:bg-gray-200 rounded">
              <Hand className="w-5 h-5 md:w-4 md:h-4 text-gray-400" />
            </button>
            <button className="p-2 md:p-2 hover:bg-gray-200 rounded">
              <MessageCircle className="w-5 h-5 md:w-4 md:h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen bg-white overflow-hidden px-4 md:px-8 lg:px-0">
        {/* Background decorative elements */}
        <div className="absolute top-10 md:top-20 right-4 md:right-20">
          <div className="w-12 h-6 md:w-24 md:h-12 bg-yellow-400 rounded-full opacity-80"></div>
        </div>

        {/* Stars scattered around - Responsive positioning */}
        <div className="absolute top-20 md:top-32 left-1/4 text-blue-400 text-lg md:text-xl">✦</div>
        <div className="absolute top-24 md:top-40 right-1/3 text-pink-400 text-sm md:text-lg">✦</div>
        <div className="absolute bottom-1/3 left-1/5 text-green-400 text-xs md:text-sm">✦</div>

        {/* Main Portfolio Section */}
        <div className="flex items-center justify-center min-h-screen py-8 md:py-0"></div>

        {/* Additional decorative elements - Responsive positioning */}
        <div className="absolute bottom-10 md:bottom-20 right-16 md:right-32 w-2 md:w-3 h-2 md:h-3 bg-blue-400 rounded-full"></div>
        <div className="absolute top-1/4 left-8 md:left-16 w-1.5 md:w-2 h-1.5 md:h-2 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-1/4 right-10 md:right-20 w-1.5 md:w-2 h-1.5 md:h-2 bg-pink-400 rounded-full"></div>
      </div>
    </div>
  )
}
