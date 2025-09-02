const fs = require('fs');

// KJV JSON 구조 분석
const kjvData = JSON.parse(fs.readFileSync('./src/data/kjv.json', 'utf8'));

console.log('=== KJV JSON 구조 분석 ===');
console.log('최상위 키들:', Object.keys(kjvData));

if (kjvData.verses && Array.isArray(kjvData.verses)) {
    console.log('총 구절 수:', kjvData.verses.length);
    
    // 첫 번째 구절 구조 확인
    const firstVerse = kjvData.verses[0];
    console.log('첫 번째 구절 구조:', Object.keys(firstVerse));
    console.log('첫 번째 구절 예시:', firstVerse);
    
    // 책 목록 추출
    const books = [...new Set(kjvData.verses.map(v => v.book_name))];
    console.log('총 책 수:', books.length);
    console.log('책 목록:', books.slice(0, 10), '...');
    
    // Genesis 구절 수 확인
    const genesisVerses = kjvData.verses.filter(v => v.book_name === 'Genesis');
    console.log('Genesis 구절 수:', genesisVerses.length);
    
    // 변환된 데이터 생성
    const convertedData = {};
    
    kjvData.verses.forEach(verse => {
        const book = verse.book_name;
        const chapter = verse.chapter.toString();
        const verseNum = verse.verse.toString();
        const text = verse.text;
        
        if (!convertedData[book]) {
            convertedData[book] = {};
        }
        if (!convertedData[book][chapter]) {
            convertedData[book][chapter] = {};
        }
        convertedData[book][chapter][verseNum] = text;
    });
    
    console.log('변환된 책 목록:', Object.keys(convertedData));
    console.log('Genesis 장 수:', Object.keys(convertedData.Genesis || {}).length);
    
    // 변환된 데이터를 파일로 저장
    fs.writeFileSync('./src/data/kjv_processed.json', JSON.stringify(convertedData, null, 2));
    console.log('처리된 KJV 데이터가 kjv_processed.json에 저장되었습니다.');
}
