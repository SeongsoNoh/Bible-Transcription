const fs = require('fs');

// 영어 책명을 한글 약어로 매핑
const bookMapping = {
    "Genesis": "창",
    "Exodus": "출",
    "Leviticus": "레",
    "Numbers": "민",
    "Deuteronomy": "신",
    "Joshua": "수",
    "Judges": "삿",
    "Ruth": "룻",
    "1 Samuel": "삼상",
    "2 Samuel": "삼하",
    "1 Kings": "왕상",
    "2 Kings": "왕하",
    "1 Chronicles": "대상",
    "2 Chronicles": "대하",
    "Ezra": "스",
    "Nehemiah": "느",
    "Esther": "에",
    "Job": "욥",
    "Psalms": "시",
    "Proverbs": "잠",
    "Ecclesiastes": "전",
    "Song of Solomon": "아",
    "Isaiah": "사",
    "Jeremiah": "렘",
    "Lamentations": "애",
    "Ezekiel": "겔",
    "Daniel": "단",
    "Hosea": "호",
    "Joel": "욜",
    "Amos": "암",
    "Obadiah": "옵",
    "Jonah": "욘",
    "Micah": "미",
    "Nahum": "나",
    "Habakkuk": "합",
    "Zephaniah": "습",
    "Haggai": "학",
    "Zechariah": "슥",
    "Malachi": "말",
    "Matthew": "마",
    "Mark": "막",
    "Luke": "눅",
    "John": "요",
    "Acts": "행",
    "Romans": "롬",
    "1 Corinthians": "고전",
    "2 Corinthians": "고후",
    "Galatians": "갈",
    "Ephesians": "엡",
    "Philippians": "빌",
    "Colossians": "골",
    "1 Thessalonians": "살전",
    "2 Thessalonians": "살후",
    "1 Timothy": "딤전",
    "2 Timothy": "딤후",
    "Titus": "딛",
    "Philemon": "몬",
    "Hebrews": "히",
    "James": "약",
    "1 Peter": "벧전",
    "2 Peter": "벧후",
    "1 John": "요일",
    "2 John": "요이",
    "3 John": "요삼",
    "Jude": "유",
    "Revelation": "계"
};

function convertKjvToKoreanFormat() {
    console.log("KJV JSON 파일 로딩 중...");
    
    try {
        // KJV JSON 파일 읽기
        const kjvData = JSON.parse(fs.readFileSync('src/data/kjv.json', 'utf8'));
        
        const convertedVerses = {};
        
        // JSON 구조 분석
        console.log("JSON 구조 분석 중...");
        console.log("최상위 키들:", Object.keys(kjvData).slice(0, 10));
        
        // verses 키가 있는지 확인
        if (kjvData.verses && Array.isArray(kjvData.verses)) {
            console.log(`총 ${kjvData.verses.length}개의 구절 발견`);
            
            kjvData.verses.forEach(verseData => {
                if (typeof verseData === 'object') {
                    const book = verseData.book_name || '';
                    const chapter = verseData.chapter || '';
                    const verse = verseData.verse || '';
                    const text = verseData.text || '';
                    
                    // 한글 약어로 변환
                    const koreanBook = bookMapping[book] || book;
                    
                    // 키 생성 (예: "창1:1")
                    const key = `${koreanBook}${chapter}:${verse}`;
                    convertedVerses[key] = text;
                }
            });
        }
        // books 키가 있는 경우
        else if (kjvData.books && Array.isArray(kjvData.books)) {
            kjvData.books.forEach(book => {
                const bookName = book.name || '';
                const koreanBook = bookMapping[bookName] || bookName;
                
                if (book.chapters && Array.isArray(book.chapters)) {
                    book.chapters.forEach(chapter => {
                        const chapterNum = chapter.chapter || '';
                        
                        if (chapter.verses && Array.isArray(chapter.verses)) {
                            chapter.verses.forEach(verse => {
                                const verseNum = verse.verse || '';
                                const text = verse.text || '';
                                
                                const key = `${koreanBook}${chapterNum}:${verseNum}`;
                                convertedVerses[key] = text;
                            });
                        }
                    });
                }
            });
        }
        // 다른 구조인 경우 - 직접 키-값 탐색
        else {
            console.log("다른 JSON 구조 탐색 중...");
            
            function searchForVerses(obj, path = '') {
                if (typeof obj === 'object' && obj !== null) {
                    for (const [key, value] of Object.entries(obj)) {
                        if (typeof value === 'string' && value.length > 10) {
                            // 영어 책명이 포함된 키인지 확인
                            for (const [engBook, korBook] of Object.entries(bookMapping)) {
                                if (key.includes(engBook) || path.includes(engBook)) {
                                    // 장:절 패턴 찾기
                                    const match = key.match(/(\d+):(\d+)/);
                                    if (match) {
                                        const convertedKey = `${korBook}${match[1]}:${match[2]}`;
                                        convertedVerses[convertedKey] = value;
                                    }
                                }
                            }
                        } else if (typeof value === 'object') {
                            searchForVerses(value, path + '.' + key);
                        }
                    }
                }
            }
            
            searchForVerses(kjvData);
        }
        
        console.log(`변환된 구절 수: ${Object.keys(convertedVerses).length}`);
        
        if (Object.keys(convertedVerses).length === 0) {
            console.log("구절을 찾을 수 없습니다. JSON 구조를 다시 확인합니다...");
            console.log("KJV 데이터 샘플:", JSON.stringify(kjvData, null, 2).substring(0, 1000));
            return;
        }
        
        // 변환된 데이터를 새 JSON 파일로 저장
        fs.writeFileSync('src/data/kjv_korean_format.json', JSON.stringify(convertedVerses, null, 2), 'utf8');
        
        console.log("변환 완료! kjv_korean_format.json 파일이 생성되었습니다.");
        
        // 샘플 출력
        const sampleKeys = Object.keys(convertedVerses).slice(0, 5);
        console.log("\n샘플 구절들:");
        sampleKeys.forEach(key => {
            console.log(`${key}: ${convertedVerses[key].substring(0, 50)}...`);
        });
        
    } catch (error) {
        console.error("오류 발생:", error.message);
    }
}

convertKjvToKoreanFormat();
