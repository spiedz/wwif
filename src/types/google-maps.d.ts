declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: LatLngBounds): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      setContent(content: string | Node): void;
      open(map?: Map, anchor?: MVCObject): void;
      close(): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class LatLngBounds {
      constructor();
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
    }

    class MapsEventListener {}

    abstract class MVCObject {}

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      mapTypeControl?: boolean;
      mapTypeControlOptions?: MapTypeControlOptions;
      fullscreenControl?: boolean;
      streetViewControl?: boolean;
      zoomControl?: boolean;
    }

    interface MapTypeControlOptions {
      style?: number;
      position?: number;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      animation?: number;
    }

    interface InfoWindowOptions {
      content?: string | Node;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace MapTypeId {
      const ROADMAP: string;
      const SATELLITE: string;
      const HYBRID: string;
      const TERRAIN: string;
    }

    namespace Animation {
      const DROP: number;
      const BOUNCE: number;
    }

    namespace ControlPosition {
      const TOP_RIGHT: number;
      const TOP_LEFT: number;
      const BOTTOM_RIGHT: number;
      const BOTTOM_LEFT: number;
    }

    namespace MapTypeControlStyle {
      const HORIZONTAL_BAR: number;
      const DROPDOWN_MENU: number;
      const DEFAULT: number;
    }
  }
} 