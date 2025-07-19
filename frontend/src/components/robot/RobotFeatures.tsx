'use client';

interface RobotFeaturesProps {
  features: string[];
}

export default function RobotFeatures({ features }: RobotFeaturesProps) {
  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    
    if (lowerFeature.includes('ai') || lowerFeature.includes('인공지능') || lowerFeature.includes('대화')) return '🧠';
    if (lowerFeature.includes('vision') || lowerFeature.includes('인식') || lowerFeature.includes('카메라')) return '👁️';
    if (lowerFeature.includes('walk') || lowerFeature.includes('보행') || lowerFeature.includes('이동')) return '🚶';
    if (lowerFeature.includes('grab') || lowerFeature.includes('조작') || lowerFeature.includes('집기')) return '🤲';
    if (lowerFeature.includes('balance') || lowerFeature.includes('균형')) return '⚖️';
    if (lowerFeature.includes('jump') || lowerFeature.includes('파쿠르') || lowerFeature.includes('백플립')) return '🤸';
    if (lowerFeature.includes('learn') || lowerFeature.includes('학습')) return '📚';
    if (lowerFeature.includes('navigation') || lowerFeature.includes('내비게이션')) return '🧭';
    if (lowerFeature.includes('voice') || lowerFeature.includes('음성')) return '🗣️';
    if (lowerFeature.includes('face') || lowerFeature.includes('얼굴')) return '😊';
    if (lowerFeature.includes('emotion') || lowerFeature.includes('감정')) return '💝';
    if (lowerFeature.includes('charge') || lowerFeature.includes('충전')) return '🔌';
    if (lowerFeature.includes('sensor') || lowerFeature.includes('센서')) return '📡';
    
    return '⚙️'; // 기본 아이콘
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">주요 기능</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getFeatureIcon(feature)}</span>
              <span className="text-gray-800 font-medium">{feature}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 기능 개수 표시 */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          <span className="mr-2">🎯</span>
          총 {features.length}개의 주요 기능
        </div>
      </div>
    </div>
  );
}