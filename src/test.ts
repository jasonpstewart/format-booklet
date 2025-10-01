import { calculateBookletPageOrder, type Sheet } from './booklet-algorithm';

// Test the booklet page order algorithm
function runTests(): void {
    console.log('🧪 Testing Booklet Page Order Algorithm');
    console.log('=====================================');

    const testCases = [
        { pages: 4, expected: "2,3,4,1" },
        { pages: 6, expected: "4,5,6,3,2,blank,blank,1" },
        { pages: 8, expected: "4,5,6,3,2,7,8,1" },
        { pages: 9, expected: "6,7,8,5,4,9,blank,3,2,blank,blank,1" },
        { pages: 12, expected: "6,7,8,5,4,9,10,3,2,11,12,1" }
    ];

    function formatPageNumber(pageIdx: number | null): string {
        return pageIdx !== null ? `${pageIdx + 1}` : 'blank';
    }

    testCases.forEach(({ pages, expected }) => {
        console.log(`\n📄 Testing ${pages} pages:`);
        console.log(`Expected: ${expected}`);
        
        const result = calculateBookletPageOrder(pages);
        const actualOrder: string[] = [];
        
        result.forEach((sheet: Sheet) => {
            const front = sheet.frontPages.map(formatPageNumber).join(',');
            const back = sheet.backPages.map(formatPageNumber).join(',');
            actualOrder.push(front + ',' + back);
        });
        
        const actual = actualOrder.join(',');
        console.log(`Actual:   ${actual}`);
        console.log(`✅ ${actual === expected ? 'PASS' : 'FAIL'}`);
        
        result.forEach((sheet: Sheet, idx: number) => {
            console.log(`  Sheet ${idx + 1}: Front[${sheet.frontPages.map(formatPageNumber).join(',')}] Back[${sheet.backPages.map(formatPageNumber).join(',')}]`);
        });
    });
}

// Export the test function
export { runTests };

// Auto-run tests when this file is executed directly
if (require.main === module) {
    runTests();
}