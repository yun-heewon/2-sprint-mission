// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { USERS, PRODUCTS, ARTICLES, PRODUCT_COMMENTS, ARTICLE_COMMENTS, DOCUMENTS } = require('./mock');

// async function main() {
//     //기존 데이터 삭제
//     await prisma.user.deleteMany();
//     await prisma.product.deleteMany();
//     await prisma.article.deleteMany();
//     await prisma.productComment.deleteMany();
//     await prisma.articleComment.deleteMany();
//     await prisma.document.deleteMany();

//     // 데이터 삽입
//     await prisma.user.createMany({
//         data: USERS,
//         skipDuplicates: true,
//     });

//     await prisma.product.createMany({
//         data: PRODUCTS,
//         skipDuplicates: true,
//     });

//     await prisma.article.createMany({
//         data: ARTICLES,
//         skipDuplicates: true,
//     });
//     await prisma.productComment.createMany({
//         data: PRODUCT_COMMENTS,
//         skipDuplicates: true,
//     });
//     await prisma.articleComment.createMany({
//         data: ARTICLE_COMMENTS,
//         skipDuplicates: true,
//     });
//     await prisma.document.createMany({
//         data: DOCUMENTS,
//         skipDuplicates: true,
//     });
//     console.log('Database seeded successfully');
// }


// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
