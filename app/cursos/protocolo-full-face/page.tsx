"use client";

import EnhancedCoursePageTemplate from '@/components/EnhancedCoursePageTemplate';
import { protocoloFullFaceEnhancedData } from './enhancedCourseData';

export default function ProtocoloFullFacePage() {
  return <EnhancedCoursePageTemplate {...protocoloFullFaceEnhancedData} />;
}
