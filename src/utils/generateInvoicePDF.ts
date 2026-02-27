import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateInvoicePDF = async (
  elementId: string,
  fileName = "factura.pdf"
) => {
  const element = document.getElementById(elementId);

  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
};