import { PDFDocument } from 'pdf-lib';
import { calculateBookletPageOrder, type Sheet } from './booklet-algorithm';
import './styles.css';

interface ProcessingElements {
    uploadArea: HTMLElement;
    fileInput: HTMLInputElement;
    processingSection: HTMLElement;
    resultSection: HTMLElement;
    pageOrder: HTMLElement;
    downloadBtn: HTMLButtonElement;
    resetBtn: HTMLButtonElement;
}

/**
 * PDF Booklet Formatter - Main TypeScript Class
 * Handles the complete workflow of PDF booklet formatting
 */
class BookletFormatter {
    private elements!: ProcessingElements;
    private currentPdfBytes: Uint8Array | null = null;
    private reorderedPdfBytes: Uint8Array | null = null;
    private originalFileName: string = '';

    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }

    private initializeElements(): void {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const processingSection = document.getElementById('processingSection');
        const resultSection = document.getElementById('resultSection');
        const pageOrder = document.getElementById('pageOrder');
        const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
        const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;

        if (!uploadArea || !fileInput || !processingSection || !resultSection || 
            !pageOrder || !downloadBtn || !resetBtn) {
            throw new Error('Required DOM elements not found');
        }

        this.elements = {
            uploadArea,
            fileInput,
            processingSection,
            resultSection,
            pageOrder,
            downloadBtn,
            resetBtn
        };
    }

    private attachEventListeners(): void {
        // File input events
        this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        this.elements.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.elements.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Button events
        this.elements.downloadBtn.addEventListener('click', () => this.downloadReorderedPdf());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
    }

    private handleDragOver(e: DragEvent): void {
        e.preventDefault();
        this.elements.uploadArea.classList.add('dragover');
    }

    private handleDragLeave(e: DragEvent): void {
        e.preventDefault();
        this.elements.uploadArea.classList.remove('dragover');
    }

    private handleDrop(e: DragEvent): void {
        e.preventDefault();
        this.elements.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            this.processFile(files[0]);
        }
    }

    private handleFileSelect(e: Event): void {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            this.processFile(file);
        }
    }

    private async processFile(file: File): Promise<void> {
        if (file.type !== 'application/pdf') {
            this.showError('Please select a PDF file.');
            return;
        }

        // Store the original filename
        this.originalFileName = file.name;

        this.showProcessing();

        try {
            const arrayBuffer = await file.arrayBuffer();
            this.currentPdfBytes = new Uint8Array(arrayBuffer);
            
            // Load the PDF to get page count
            const pdfDoc = await PDFDocument.load(this.currentPdfBytes);
            const totalPages = pdfDoc.getPageCount();

            // Calculate booklet page order
            const sheets = calculateBookletPageOrder(totalPages);
            
            // Create reordered PDF
            const reorderedPdfBytes = await this.createReorderedPdf(this.currentPdfBytes, sheets);
            this.reorderedPdfBytes = reorderedPdfBytes;

            // Show results
            this.showResults(totalPages, sheets);

        } catch (error) {
            console.error('Error processing PDF:', error);
            this.showError('Error processing PDF. Please make sure the file is a valid PDF.');
        }
    }

    private async createReorderedPdf(originalPdfBytes: Uint8Array, sheets: Sheet[]): Promise<Uint8Array> {
        const originalPdf = await PDFDocument.load(originalPdfBytes);
        const reorderedPdf = await PDFDocument.create();
        
        // Get all pages from original PDF
        const originalPages = await reorderedPdf.copyPages(originalPdf, 
            Array.from({length: originalPdf.getPageCount()}, (_, i) => i));
        
        // Add pages in the new order
        for (const sheet of sheets) {
            // Add front pages
            for (const pageIdx of sheet.frontPages) {
                if (pageIdx !== null) {
                    reorderedPdf.addPage(originalPages[pageIdx]);
                } else {
                    // Add blank page
                    const blankPage = reorderedPdf.addPage();
                    // Set same size as first page
                    if (originalPages.length > 0) {
                        const { width, height } = originalPages[0].getSize();
                        blankPage.setSize(width, height);
                    }
                }
            }
            
            // Add back pages
            for (const pageIdx of sheet.backPages) {
                if (pageIdx !== null) {
                    reorderedPdf.addPage(originalPages[pageIdx]);
                } else {
                    // Add blank page
                    const blankPage = reorderedPdf.addPage();
                    // Set same size as first page
                    if (originalPages.length > 0) {
                        const { width, height } = originalPages[0].getSize();
                        blankPage.setSize(width, height);
                    }
                }
            }
        }
        
        return await reorderedPdf.save();
    }

    private showProcessing(): void {
        this.elements.uploadArea.parentElement!.style.display = 'none';
        this.elements.processingSection.style.display = 'block';
        this.elements.resultSection.style.display = 'none';
    }

    private showResults(totalPages: number, sheets: Sheet[]): void {
        this.elements.processingSection.style.display = 'none';
        this.elements.resultSection.style.display = 'block';
        
        // Display page order information
        this.displayPageOrder(totalPages, sheets);
    }

    private displayPageOrder(totalPages: number, sheets: Sheet[]): void {
        const orderHtml = `
            <h3>Page Order for Printing (${totalPages} pages → ${sheets.length} sheets)</h3>
            ${sheets.map((sheet, idx) => `
                <div class="sheet">
                    <div class="sheet-title">Sheet ${idx + 1}</div>
                    <div class="sheet-pages">
                        <div class="side">
                            <div class="side-title">Front Side:</div>
                            ${sheet.frontPages.map(pageIdx => 
                                pageIdx !== null ? `Page ${pageIdx + 1}` : 'Blank'
                            ).join(', ')}
                        </div>
                        <div class="side">
                            <div class="side-title">Back Side:</div>
                            ${sheet.backPages.map(pageIdx => 
                                pageIdx !== null ? `Page ${pageIdx + 1}` : 'Blank'
                            ).join(', ')}
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        
        this.elements.pageOrder.innerHTML = orderHtml;
    }

    private async downloadReorderedPdf(): Promise<void> {
        if (!this.reorderedPdfBytes) {
            this.showError('No reordered PDF available for download.');
            return;
        }

        try {
            // Generate filename based on original filename
            let downloadFileName = 'booklet-reordered.pdf'; // fallback
            if (this.originalFileName) {
                const baseName = this.originalFileName.replace(/\.pdf$/i, '');
                downloadFileName = `${baseName}-booklet.pdf`;
            }

            const arrayBuffer = this.reorderedPdfBytes.buffer.slice(
                this.reorderedPdfBytes.byteOffset, 
                this.reorderedPdfBytes.byteOffset + this.reorderedPdfBytes.byteLength
            );
            const blob = new Blob([this.reorderedPdfBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            this.showError('Error downloading PDF. Please try again.');
        }
    }

    private showError(message: string): void {
        // Remove any existing error messages
        const existingError = document.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }

        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        this.elements.uploadArea.parentElement!.insertBefore(errorDiv, this.elements.uploadArea);
        
        // Hide processing and result sections
        this.elements.processingSection.style.display = 'none';
        this.elements.resultSection.style.display = 'none';
        this.elements.uploadArea.parentElement!.style.display = 'block';
    }

    private reset(): void {
        // Clear file input
        this.elements.fileInput.value = '';
        
        // Clear stored data
        this.currentPdfBytes = null;
        this.reorderedPdfBytes = null;
        this.originalFileName = '';
        
        // Remove any error messages
        const existingError = document.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        // Show upload section, hide others
        this.elements.uploadArea.parentElement!.style.display = 'block';
        this.elements.processingSection.style.display = 'none';
        this.elements.resultSection.style.display = 'none';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BookletFormatter();
});