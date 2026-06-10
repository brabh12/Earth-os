export type UserRole = 'volunteer' | 'organization' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Region {
  id: string;
  name: string;
  boundary: any; // GeoJSON
  status: 'stable' | 'degrading' | 'recovering';
  health_index: number; // 0-100
}

export interface EnvironmentalIssue {
  id: string;
  region_id: string;
  type: 'desertification' | 'water_scarcity' | 'pollution' | 'deforestation' | 'climate_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  causes: string[];
  explanation: string;
  confidence: number;
  status: 'active' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface Mission {
  id: string;
  issue_id: string;
  title: string;
  description: string;
  resources_needed: string[];
  impact_estimate: string;
  estimated_volunteers: number;
  estimated_cost_usd: number;
  status: 'open' | 'active' | 'completed' | 'pending' | 'deployed';
}

export interface Report {
  id: string;
  mission_id: string;
  user_id: string;
  content: string;
  image_url: string;
  location: { lat: number; lng: number };
  timestamp: string;
}
