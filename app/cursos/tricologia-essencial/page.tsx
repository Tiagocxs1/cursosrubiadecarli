"use client";

import EnhancedCoursePageTemplate from '@/components/EnhancedCoursePageTemplate';
import { tricologiaEnhancedData } from './enhancedCourseData';

export default function TricologiaPage() {
  return <EnhancedCoursePageTemplate {...tricologiaEnhancedData} />;
}
