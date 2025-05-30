import { useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LocationDisplayProps {
  location?: string
  className?: string
}

export function LocationDisplay({ location, className = "" }: LocationDisplayProps) {
  if (!location) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        <MapPin className="w-4 h-4" />
        <span>No location specified</span>
      </div>
    )
  }

  const openInMaps = () => {
    // Open in Google Maps
    const encodedLocation = encodeURIComponent(location)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
    window.open(url, '_blank')
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="w-4 h-4 text-blue-500" />
      <span className="text-gray-300">{location}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={openInMaps}
        className="h-6 px-2 text-blue-500 hover:text-blue-400"
      >
        <ExternalLink className="w-3 h-3" />
      </Button>
    </div>
  )
}

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function LocationInput({ value, onChange, placeholder = "Enter location...", className = "" }: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Common locations for demo purposes
  const commonLocations = [
    "San Francisco, CA",
    "New York, NY", 
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "Austin, TX",
    "Boston, MA",
    "Seattle, WA",
    "Denver, CO",
    "Miami, FL"
  ]

  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    
    if (newValue.length > 0) {
      const filtered = commonLocations.filter(loc => 
        loc.toLowerCase().includes(newValue.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// TODO: Google Maps Integration
// To implement full Google Maps functionality:
// 1. Install @googlemaps/js-api-loader
// 2. Get Google Maps API key from Google Cloud Console
// 3. Enable Maps JavaScript API and Places API
// 4. Add API key to environment variables: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
// 5. Implement GoogleMap component with autocomplete places

export function GoogleMapsNotice() {
  return (
    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <h3 className="text-blue-400 font-medium mb-1">Google Maps Integration Available</h3>
          <p className="text-gray-300 text-sm mb-2">
            For enhanced location features, you can integrate Google Maps:
          </p>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• Interactive map display</li>
            <li>• Location autocomplete</li>
            <li>• Distance calculations</li>
            <li>• Territory mapping</li>
          </ul>
          <p className="text-yellow-400 text-xs mt-2">
            <strong>Required:</strong> Google Maps API key (see PRODUCTION_READINESS_ANALYSIS.md)
          </p>
        </div>
      </div>
    </div>
  )
}