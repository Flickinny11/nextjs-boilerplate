"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Plus, X, Check } from "lucide-react";

interface Territory {
  id: string;
  center: google.maps.LatLng;
  radius: number;
  circle: google.maps.Circle;
  bounds: google.maps.LatLngBounds;
}

interface TerritorySelectionMapProps {
  onTerritoriesChange: (territories: Array<{
    id: string;
    center: { lat: number; lng: number };
    radius: number;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  }>) => void;
  zipCode?: string;
}

export function TerritorySelectionMap({ onTerritoriesChange, zipCode }: TerritorySelectionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: "weekly",
          libraries: ["places", "geometry"]
        });

        await loader.load();

        if (mapRef.current) {
          const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of USA
          let initialCenter = defaultCenter;
          let initialZoom = 4;

          // If zipCode is provided, geocode it
          if (zipCode) {
            const geocoder = new google.maps.Geocoder();
            try {
              const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                geocoder.geocode({ address: zipCode }, (results, status) => {
                  if (status === google.maps.GeocoderStatus.OK && results) {
                    resolve(results);
                  } else {
                    reject(new Error('Geocoding failed'));
                  }
                });
              });

              if (result[0]) {
                initialCenter = result[0].geometry.location.toJSON();
                initialZoom = 10;
              }
            } catch (geocodeError) {
              console.warn('Failed to geocode zip code:', geocodeError);
            }
          }

          const mapInstance = new google.maps.Map(mapRef.current, {
            center: initialCenter,
            zoom: initialZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
              {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{ "weight": "2.00" }]
              },
              {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#9c9c9c" }]
              },
              {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [{ "visibility": "on" }]
              }
            ]
          });

          setMap(mapInstance);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
        setLoading(false);
      }
    };

    initMap();
  }, [zipCode]);

  // Handle map clicks for territory creation
  useEffect(() => {
    if (!map || !isDrawing) return;

    const clickListener = map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (territories.length >= 5) {
        alert('Maximum 5 territories allowed');
        return;
      }

      const clickPosition = event.latLng;
      if (!clickPosition) return;

      createTerritory(clickPosition);
      setIsDrawing(false);
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, isDrawing, territories.length]);

  const createTerritory = (center: google.maps.LatLng) => {
    if (!map) return;

    const territory: Territory = {
      id: Date.now().toString(),
      center,
      radius: 5000, // 5km default radius
      circle: new google.maps.Circle({
        center,
        radius: 5000,
        fillColor: '#3B82F6',
        fillOpacity: 0.2,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        editable: true,
        draggable: true,
        map
      }),
      bounds: new google.maps.LatLngBounds()
    };

    // Update bounds when circle changes
    const updateBounds = () => {
      const bounds = territory.circle.getBounds();
      if (bounds) {
        territory.bounds = bounds;
        territory.radius = territory.circle.getRadius();
        territory.center = territory.circle.getCenter()!;
        updateTerritoriesCallback();
      }
    };

    territory.circle.addListener('center_changed', updateBounds);
    territory.circle.addListener('radius_changed', updateBounds);

    // Initial bounds calculation
    updateBounds();

    setTerritories(prev => [...prev, territory]);
  };

  const removeTerritory = (territoryId: string) => {
    setTerritories(prev => {
      const updated = prev.filter(t => {
        if (t.id === territoryId) {
          t.circle.setMap(null);
          return false;
        }
        return true;
      });
      return updated;
    });
  };

  const updateTerritoriesCallback = () => {
    const territoryData = territories.map(t => ({
      id: t.id,
      center: {
        lat: t.center.lat(),
        lng: t.center.lng()
      },
      radius: t.radius,
      bounds: {
        north: t.bounds.getNorthEast().lat(),
        south: t.bounds.getSouthWest().lat(),
        east: t.bounds.getNorthEast().lng(),
        west: t.bounds.getSouthWest().lng()
      }
    }));
    onTerritoriesChange(territoryData);
  };

  // Update callback when territories change
  useEffect(() => {
    updateTerritoriesCallback();
  }, [territories]);

  const clearAllTerritories = () => {
    territories.forEach(t => t.circle.setMap(null));
    setTerritories([]);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gray-900/50 border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading territory map...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-gray-900/50 border-gray-700">
        <div className="text-center text-red-400">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Territory Selection</h3>
            <p className="text-sm text-gray-400">
              Click "Add Territory" and then click on the map to select up to 5 areas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsDrawing(true)}
              disabled={isDrawing || territories.length >= 5}
              variant="outline"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Territory
            </Button>
            {territories.length > 0 && (
              <Button
                onClick={clearAllTerritories}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Territory List */}
        {territories.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">
              Selected Territories ({territories.length}/5)
            </p>
            <div className="space-y-2">
              {territories.map((territory, index) => (
                <div
                  key={territory.id}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-white">
                      Territory {index + 1} ({(territory.radius / 1000).toFixed(1)}km radius)
                    </span>
                  </div>
                  <Button
                    onClick={() => removeTerritory(territory.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isDrawing && (
          <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded mb-4">
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <MapPin className="w-4 h-4" />
              Click on the map to place a territory circle
            </div>
          </div>
        )}
      </Card>

      {/* Map Container */}
      <Card className="p-0 bg-gray-900/50 border-gray-700 overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-96"
          style={{ minHeight: '400px' }}
        />
      </Card>

      {territories.length > 0 && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          {territories.length} territory{territories.length !== 1 ? 'ies' : ''} selected. 
          These areas will be used for lead capture.
        </div>
      )}
    </div>
  );
}