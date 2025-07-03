

// const USERS = [
//     {
//         id: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'johndoe@sample.com',
//         createdAt: new Date('2023-01-01T00:00:00Z'),
//         updatedAt: new Date('2023-01-01T00:00:00Z')
//     }
//     ,
//     {
//         id: 2,
//         firstName: 'Jane',
//         lastName: 'Jang',
//         email: 'janejang@sample.com',
//         createdAt: new Date('2023-01-02T00:00:00Z'),
//         updatedAt: new Date('2023-01-02T00:00:00Z')
//     }
//     ,
//     {
//         id: 3,
//         firstName: 'chris',
//         lastName: 'Park',
//         email: 'chrispark@sample.com',
//         createdAt: new Date('2023-01-03T00:00:00Z'),
//         updatedAt: new Date('2023-01-03T00:00:00Z')
//     }
//     ,
//     {
//         id: 4,
//         firstName: 'Alice',
//         lastName: 'Kim',
//         email: 'alicekim@sample.com',
//         createdAt: new Date('2023-01-03T00:10:00Z'),
//         updatedAt: new Date('2023-01-03T00:10:00Z')
//     }
//     ,
//     {
//         id: 5,
//         firstName: 'Bob',
//         lastName: 'Lee',
//         email: 'boblee@sample.com',
//         createdAt: new Date('2023-01-03T00:20:00Z'),
//         updatedAt: new Date('2023-01-03T00:20:00Z')
//     }
//     ,
//     {
//         id: 6,
//         firstName: 'Charlie',
//         lastName: 'Choi',
//         email: 'charliechoi@sample.com',
//         createdAt: new Date('2023-01-03T01:00:00Z'),
//         updatedAt: new Date('2023-01-03T01:00:00Z')
//     }
// ]

// const PRODUCTS = [
//     {
//         id: 1,
//         name: '맥북 16인치 프로',
//         description: 'Description for Product A',
//         price: 1000000,
//         tags: ['전자제품', '노트북', '애플'],
//         createdAt: new Date('2023-01-04T00:00:00Z'),
//         updatedAt: new Date('2023-01-04T00:00:00Z'),
//         userId: 1
//     }
//     ,
//     {
//         id: 2,
//         name: '아이패드 에어 6세대대',
//         description: 'Description for Product B',
//         price: 200000,
//         tags: ['전자제품', '태블릿', '애플'],
//         createdAt: new Date('2023-01-04T00:10:00Z'),
//         updatedAt: new Date('2023-01-04T00:10:00Z'),
//         userId: 1
//     }
//     ,
//     {
//         id: 3,
//         name: '이케아 책상',
//         description: 'Description for Product C',
//         price: 30000,
//         tags: ['가구', '책상'],
//         createdAt: new Date('2023-01-04T02:00:00Z'),
//         updatedAt: new Date('2023-01-04T02:00:00Z'),
//         userId: 2
//     }
//     ,
//     {
//         id: 4,
//         name: '스탠리 텀블러',
//         description: 'Description for Product D',
//         price: 20000,
//         tags: ['생활용품', '텀블러'],
//         createdAt: new Date('2023-01-04T05:00:00Z'),
//         updatedAt: new Date('2023-01-04T05:00:00Z'),
//         userId: 3
//     }
//     ,
//     {
//         id: 5,
//         name: '브랜드 쇼파',
//         description: 'Description for Product E',
//         price: 100000,
//         tags: ['가구', '소파'],
//         createdAt: new Date('2023-01-05T06:30:00Z'),
//         updatedAt: new Date('2023-01-05T06:30:00Z'),
//         userId: 4
//     }
//     ,
//     {
//         id: 6,
//         name: '에어팟 프로 2세대',
//         description: 'Description for Product F',
//         price: 150000,
//         tags: ['전자제품', '이어폰', '새제품'],
//         createdAt: new Date('2023-01-06T12:00:00Z'),
//         updatedAt: new Date('2023-01-06T12:00:00Z'),
//         userId: 5
//     }
//     ,
//     {
//         id: 7,
//         name: '삼성 갤럭시 S23',
//         description: 'Description for Product G',
//         price: 1200000,
//         tags: ['전자제품', '스마트폰', '삼성'],
//         createdAt: new Date('2023-02-01T00:10:00Z'),
//         updatedAt: new Date('2023-02-01T00:10:00Z'),
//         userId: 6
//     }
// ]

// const PRODUCT_COMMENTS = [
//     {
//         id: 1,
//         content: '무겁진 않나요',
//         createdAt: new Date('2023-01-06T00:00:00Z'),
//         updatedAt: new Date('2023-01-06T00:00:00Z'),
//         userId: 4,
//         productId: 1
//     }
//     ,
//     {
//         id: 2,
//         content: '가격이 좀 비싸네요. 얼마나 쓰셨나요',
//         createdAt: new Date('2023-01-07T00:00:00Z'),
//         updatedAt: new Date('2023-01-07T00:00:00Z'),
//         userId: 4,
//         productId: 2
//     }
//     ,
//     {
//         id: 3,
//         content: '얼마나 사용하셨나요? 모서리 까임 보여주세요',
//         createdAt: new Date('2023-01-10T00:00:00Z'),
//         updatedAt: new Date('2023-01-10T00:00:00Z'),
//         userId: 5,
//         productId: 3
//     }
//     ,
//     {
//         id: 4,
//         content: '색상이 예쁘네요 네고해주세요',
//         createdAt: new Date('2023-01-15T00:00:00Z'),
//         updatedAt: new Date('2023-01-15T00:00:00Z'),
//         userId: 1,
//         productId: 4
//     }
//     ,
//     {
//         id: 5,
//         content: '이거 새제품인가요? 중고인가요?',
//         createdAt: new Date('2023-01-16T00:00:00Z'),
//         updatedAt: new Date('2023-01-16T00:00:00Z'),
//         userId: 2,
//         productId: 5
//     }
// ]

// const ARTICLES = [
//     {
//         id: 1,
//         title: '안녕하세요',
//         content: '반갑습니다',
//         createdAt: new Date('2023-01-04T00:00:10Z'),
//         updatedAt: new Date('2023-01-04T00:00:10Z'),
//         userId: 1
//     }
//     ,
//     {
//         id: 2,
//         title: '날씨가 좋아요',
//         content: '요즘 하늘이 푸르네요~...',
//         createdAt: new Date('2023-01-04T00:01:00Z'),
//         updatedAt: new Date('2023-01-04T00:01:00Z'),
//         userId: 3
//     }
//     ,
//     {
//         id: 3,
//         title: '중고 사기 조심하세요',
//         content: '얼마 전에 사기를 당했네요 다들 조심하세요.',
//         createdAt: new Date('2023-01-04T00:02:00Z'),
//         updatedAt: new Date('2023-01-04T00:02:00Z'),
//         userId: 2
//     }
//     ,
//     {
//         id: 4,
//         title: '아이패드 공부에 좋나요?',
//         content: '제곧내',
//         createdAt: new Date('2023-01-05T00:00:00Z'),
//         updatedAt: new Date('2023-01-05T00:00:00Z'),
//         userId: 4
//     }
//     ,
//     {
//         id: 5,
//         title: '지하철 연착이 심하네요',
//         content: '오늘 1호선 왜이러나요 ㅜㅜㅜ',
//         createdAt: new Date('2023-01-06T07:30:00Z'),
//         updatedAt: new Date('2023-01-06T07:30:00Z'),
//         userId: 4
//     }
//     ,
//     {
//         id: 6,
//         title: '신천지한테 붙잡혔어요',
//         content: '중고거래 하러 나갔는데 신천지한테 붙잡혔어요. ㅠㅠ',
//         createdAt: new Date('2023-01-07T00:00:00Z'),
//         updatedAt: new Date('2023-01-07T00:00:00Z'),
//         userId: 5
//     }
//     ,
//     {
//         id: 7,
//         title: '일곱 번째 게시글',
//         content: '일곱 번째 게시글의 내용입니다.',
//         createdAt: new Date('2023-01-30T00:00:00Z'),
//         updatedAt: new Date('2023-01-30T00:00:00Z'),
//         userId: 6
//     }
//     ,
//     {
//         id: 8,
//         title: '여덟 번째 게시글',
//         content: '여덟 번째 게시글의 내용입니다.',
//         createdAt: new Date('2023-01-31T00:00:00Z'),
//         updatedAt: new Date('2023-01-31T00:00:00Z'),
//         userId: 4
//     }
//     ,
//     {
//         id: 9,
//         title: '아홉 번째 게시글',
//         content: '아홉 번째 게시글의 내용입니다.',
//         createdAt: new Date('2023-02-01T00:00:00Z'),
//         updatedAt: new Date('2023-02-01T00:00:00Z'),
//         userId: 1
//     }
// ]



// const ARTICLE_COMMENTS = [
//     {
//         id: 1,
//         content: '안녕하세요',
//         createdAt: new Date('2023-01-05T00:00:00Z'),
//         updatedAt: new Date('2023-01-05T00:00:00Z'),
//         userId: 2,
//         articleId: 1
//     }
//     ,
//     {
//         id: 2,
//         content: '반갑습니다',
//         createdAt: new Date('2023-01-06T00:00:00Z'),
//         updatedAt: new Date('2023-01-06T00:00:00Z'),
//         userId: 4,
//         articleId: 1
//     }
//     ,
//     {
//         id: 3,
//         content: '저도 날이 좋아서 나들이 다녀왔어요',
//         createdAt: new Date('2023-01-05T00:00:00Z'),
//         updatedAt: new Date('2023-01-05T00:00:00Z'),
//         userId: 4,
//         articleId: 2
//     }
//     ,
//     {
//         id: 4,
//         content: '주말에 비 온다네요',
//         createdAt: new Date('2023-01-05T00:10:00Z'),
//         updatedAt: new Date('2023-01-05T00:10:00Z'),
//         userId: 5,
//         articleId: 2
//     }
//     ,
//     {
//         id: 5,
//         content: '저도 사기 당했어요. 조심하세요',
//         createdAt: new Date('2023-01-06T00:00:00Z'),
//         updatedAt: new Date('2023-01-06T00:00:00Z'),
//         userId: 1,
//         articleId: 3
//     }
//     ,
//     {
//         id: 6,
//         content: '아이패드 공부에 좋습니다. 추천해요',
//         createdAt: new Date('2023-01-07T00:00:00Z'),
//         updatedAt: new Date('2023-01-07T00:00:00Z'),
//         userId: 1,
//         articleId: 4
//     }
//     ,
//     {
//         id: 7,
//         content: '저도 지하철 연착 때문에 지각했어요',
//         createdAt: new Date('2023-01-06T09:30:00Z'),
//         updatedAt: new Date('2023-01-06T09:30:00Z'),
//         userId: 2,
//         articleId: 5
//     }
// ]

// const DOCUMENTS = [];




// module.exports = {
//     USERS,
//     PRODUCTS,
//     PRODUCT_COMMENTS,
//     ARTICLES,
//     ARTICLE_COMMENTS,
//     DOCUMENTS
// };