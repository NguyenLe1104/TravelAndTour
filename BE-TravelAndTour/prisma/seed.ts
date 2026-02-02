import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Tạo các Category mẫu để test Filter
  const categories = [
    { name: 'Du lịch biển', description: 'Các tour tham quan bãi biển và nghỉ dưỡng.' },
    { name: 'Khám phá núi rừng', description: 'Hoạt động leo núi, trekking và cắm trại.' },
    { name: 'Du lịch văn hóa', description: 'Tham quan các di tích lịch sử và bảo tàng.' },
    { name: 'Nghỉ dưỡng cao cấp', description: 'Trải nghiệm tại các resort 5 sao.' },
  ];

  for (const cat of categories) {
    await prisma.tourCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log('Đã nạp dữ liệu mẫu cho TourCategory thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });