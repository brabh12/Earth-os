import jsPDF from 'jspdf';

export const generateMissionPDF = (mission: any, issue: any) => {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // Header
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(22);
  doc.text('EARTH OS: PLANETARY INTERVENTION REPORT', 20, 25);
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.text(`GENERATED: ${timestamp} | SECURE LINK: ACTIVE`, 20, 35);

  // Issue Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('I. ANOMALY PROFILE', 20, 55);
  
  doc.setFontSize(12);
  doc.text(`Type: ${issue.type.toUpperCase()}`, 25, 65);
  doc.text(`Severity: ${issue.severity.toUpperCase()}`, 25, 72);
  doc.text(`Coordinates: ${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`, 25, 79);
  
  // Mission Strategy
  doc.setFontSize(16);
  doc.text('II. INTERVENTION STRATEGY', 20, 95);
  
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text(mission.title || 'UNNAMED MISSION', 25, 105);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const descriptionLines = doc.splitTextToSize(mission.description || 'No description available', 160);
  doc.text(descriptionLines, 25, 115);

  // Logistics & Budget
  doc.setFontSize(16);
  doc.text('III. LOGISTICS & ESTIMATED BUDGET', 20, 155);
  
  doc.setFontSize(12);
  doc.text(`Personnel Requirements: ${mission.estimated_volunteers || 0} Volunteers`, 25, 165);
  doc.text(`Approximate Operational Cost: $${(mission.estimated_cost_usd || 0).toLocaleString()} USD`, 25, 172);
  
  doc.text('Equipment Checklist:', 25, 185);
  mission.resources_needed?.forEach((res: string, i: number) => {
    doc.text(`- ${res}`, 30, 195 + (i * 7));
  });

  // Impact
  doc.setFontSize(16);
  doc.text('IV. PROJECTED IMPACT', 20, 235);
  doc.setFontSize(12);
  doc.text(mission.impact_estimate || 'Pending computation...', 25, 245);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('CONFIDENTIAL - EARTH OS INTEL DIVISION', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Mission_Report_${mission.id || Date.now()}.pdf`);
};
