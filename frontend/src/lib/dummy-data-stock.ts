import { StockPriceHistory } from '@/lib/types';
import { getDummyCompanyById } from './dummy-data';

// 더미 주가 히스토리 데이터 생성
export function getDummyStockHistory(companyId: string, timeRange: '1M' | '3M' | '6M' | '1Y' | 'ALL'): StockPriceHistory[] {
  const company = getDummyCompanyById(companyId);
  if (!company || !company.isPublic || !company.currentPrice) {
    return [];
  }

  const basePrice = company.currentPrice;
  const volatility = 0.02; // 2% 일일 변동성
  const trend = company.changePercent > 0 ? 0.0002 : -0.0002; // 약간의 추세
  
  // 기간별 데이터 포인트 수
  const dataPoints = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': 730
  };

  const points = dataPoints[timeRange];
  const history: StockPriceHistory[] = [];
  
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 랜덤 변동 + 추세
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendChange = trend;
    currentPrice = currentPrice * (1 + randomChange + trendChange);
    
    // 주말 제외 (간단한 구현)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      history.push({
        date: date,
        price: Math.max(currentPrice, 1), // 최소 가격 $1
        volume: Math.floor(Math.random() * 10000000) + 1000000, // 1M ~ 11M
      });
    }
  }

  // 마지막 값을 현재 가격으로 조정
  if (history.length > 0) {
    history[history.length - 1].price = basePrice;
  }

  return history;
}