export const calculateAfterShockProbability = (magnitude: number): string => {
  if (magnitude >= 7) return 'Very High (>90%)';
  if (magnitude >= 6) return 'High (70-90%)';
  if (magnitude >= 5) return 'Moderate (40-70%)';
  if (magnitude >= 4) return 'Low (20-40%)';
  return 'Very Low (<20%)';
};

export const getIntensityDescription = (mmi: number): string => {
  if (mmi >= 9) return 'Violent - Considerable damage to specially designed structures';
  if (mmi >= 8) return 'Severe - Considerable damage in ordinary buildings';
  if (mmi >= 7) return 'Very Strong - Negligible damage in buildings of good design';
  if (mmi >= 6) return 'Strong - Felt by all, many frightened';
  if (mmi >= 5) return 'Moderate - Felt by nearly everyone';
  if (mmi >= 4) return 'Light - Felt indoors by many';
  if (mmi >= 3) return 'Weak - Felt quite noticeably by people indoors';
  if (mmi >= 2) return 'Very Weak - Felt only by a few people at rest';
  return 'Not Felt';
};

export const getRiskLevel = (mag: number, depth: number): string => {
  if (mag >= 7 && depth < 70) return 'Extreme';
  if (mag >= 6 && depth < 100) return 'High';
  if (mag >= 5 || (mag >= 4 && depth < 50)) return 'Moderate';
  return 'Low';
};

export const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude >= 6) return 'bg-red-100 text-red-800';
  if (magnitude >= 5) return 'bg-orange-100 text-orange-800';
  if (magnitude >= 4) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

export const getAffectedAreaRadius = (magnitude: number): string => {
  if (magnitude >= 7) return '> 200km radius';
  if (magnitude >= 6) return '100-200km radius';
  if (magnitude >= 5) return '50-100km radius';
  return '< 50km radius';
};

export const getBuildingDamageRisk = (magnitude: number): string => {
  if (magnitude >= 7) return 'Severe structural damage likely';
  if (magnitude >= 6) return 'Moderate structural damage possible';
  if (magnitude >= 5) return 'Light damage possible';
  return 'Minimal to no damage expected';
};

export const getSignificanceLevel = (sig: number): string => {
  if (sig >= 1000) return 'Exceptionally Significant';
  if (sig >= 750) return 'Highly Significant';
  if (sig >= 500) return 'Significant';
  if (sig >= 250) return 'Moderately Significant';
  return 'Low Significance';
};

export const getMagnitudeClassification = (magnitude: number): string => {
  if (magnitude >= 8) return 'Great Earthquake';
  if (magnitude >= 7) return 'Major Earthquake';
  if (magnitude >= 6) return 'Strong Earthquake';
  if (magnitude >= 5) return 'Moderate Earthquake';
  if (magnitude >= 4) return 'Light Earthquake';
  return 'Minor Earthquake';
};

export const getSafetyRecommendations = (magnitude: number): string[] => {
  if (magnitude >= 6) {
    return [
      'Evacuate buildings if safe to do so',
      'Stay away from windows and exterior walls',
      'Be prepared for aftershocks',
      'Monitor local emergency broadcasts',
      'Check on neighbors if possible'
    ];
  }
  if (magnitude >= 4) {
    return [
      'Stay calm and be prepared for aftershocks',
      'Check for building damage',
      'Monitor local news'
    ];
  }
  return [
    'No immediate action required',
    'Stay informed of any updates'
  ];
}; 