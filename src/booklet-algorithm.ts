// Standalone version of the booklet algorithm for testing (no CSS imports)

interface Sheet {
    frontPages: (number | null)[];
    backPages: (number | null)[];
}

/**
 * Calculate the page order for booklet printing with 2 pages per sheet, double-sided (short edge).
 * 
 * TypeScript implementation of the Python algorithm for booklet page ordering.
 * 
 * @param totalPages - Total number of pages in the original PDF
 * @returns Array of Sheet objects with frontPages and backPages arrays for each sheet
 */
export function calculateBookletPageOrder(totalPages: number): Sheet[] {
    // Pad to multiple of 4 if necessary (booklet requires multiples of 4)
    const paddedPages = Math.ceil(totalPages / 4) * 4;
    const numSheets = paddedPages / 4;
    
    const sheets: Sheet[] = [];
    
    for (let sheetIdx = 0; sheetIdx < numSheets; sheetIdx++) {
        // Use the center-outward pattern for all page counts
        const mid = paddedPages / 2;
        let pages: number[];
        
        if (sheetIdx === 0) {
            // First sheet: middle 4 pages [mid, mid+1, mid+2, mid-1]
            // For 4: [2,3,4,1], For 8: [4,5,6,3], for 12: [6,7,8,5]
            pages = [mid, mid + 1, mid + 2, mid - 1];
        } else if (sheetIdx === 1) {
            // Second sheet: next ring [mid-2, mid+3, mid+4, mid-3]
            // For 8: [2,7,8,1], for 12: [4,9,10,3]
            pages = [mid - 2, mid + 3, mid + 4, mid - 3];
        } else {
            // Third sheet and beyond: continue outward
            // For 12: [2,11,12,1]
            const offset = sheetIdx - 1;
            pages = [
                mid - 2 - offset * 2,     // 2, 0, -2...
                mid + 3 + offset * 2,     // 11, 13, 15...
                mid + 4 + offset * 2,     // 12, 14, 16...
                mid - 3 - offset * 2      // 1, -1, -3...
            ];
        }
        
        // Convert to 0-indexed and filter valid pages
        const frontPages: (number | null)[] = [];
        const backPages: (number | null)[] = [];
        
        for (let i = 0; i < pages.length; i++) {
            const pageNum = pages[i];
            let pageIdx: number | null;
            
            if (pageNum <= totalPages && pageNum > 0) {
                pageIdx = pageNum - 1; // Convert to 0-indexed
            } else {
                pageIdx = null; // Blank page
            }
            
            if (i < 2) { // Front pages
                frontPages.push(pageIdx);
            } else { // Back pages
                backPages.push(pageIdx);
            }
        }
        
        sheets.push({ frontPages, backPages });
    }
    
    return sheets;
}

export type { Sheet };