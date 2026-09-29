const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const seedDataPath = path.join(__dirname, '../data/seed.json');
  const rawData = fs.readFileSync(seedDataPath, 'utf8');
  const data = JSON.parse(rawData);

  // 1. Seed Materials
  for (const mat of data.materials) {
    await prisma.material.create({
      data: mat
    });
  }

  // 2. Seed Users
  const collectorIds = [];
  for (const c of data.collectors) {
    const user = await prisma.user.create({
      data: {
        ...c,
        role: 'COLLECTOR'
      }
    });
    collectorIds.push(user.id);
  }

  const recyclerIds = [];
  for (const r of data.recyclers) {
    const user = await prisma.user.create({
      data: {
        name: r.name,
        phone: r.phone,
        area: r.area,
        language: r.language,
        rating: r.rating,
        total_deals: r.total_deals,
        role: 'RECYCLER'
      }
    });
    recyclerIds.push(user.id);
  }

  const citizenIds = [];
  for (const c of data.citizens) {
    const user = await prisma.user.create({
      data: {
        ...c,
        role: 'CITIZEN'
      }
    });
    citizenIds.push(user.id);
  }

  // 3. Create mock pickup requests and lots
  const lotIds = [];
  for (let i = 0; i < data.lots.length; i++) {
    const lotData = data.lots[i];
    
    // Create a dummy pickup request for the lot
    const pickup = await prisma.pickupRequest.create({
      data: {
        citizen_id: citizenIds[i % citizenIds.length],
        material_category: lotData.material_category,
        rough_size: "Medium",
        address: "Some address",
        time_slot: "Morning",
        status: "COMPLETED",
        assigned_collector_id: collectorIds[i % collectorIds.length]
      }
    });

    // Create the lot
    const lot = await prisma.lot.create({
      data: {
        pickup_request_id: pickup.id,
        collector_id: collectorIds[i % collectorIds.length],
        recycler_id: recyclerIds[i % recyclerIds.length],
        material_category: lotData.material_category,
        weight_kg: lotData.weight_kg,
        quoted_price: lotData.quoted_price,
        final_price: lotData.final_price,
        status: lotData.status
      }
    });
    lotIds.push(lot.id);

    // 4. Create Blockchain record for the lot
    await prisma.blockchainRecord.create({
      data: {
        lot_id: lot.id,
        hash: `mock-sha256-hash-${i}`,
        transaction_type: 'LOT_VERIFIED'
      }
    });
  }

  // 5. Seed Ratings
  await prisma.rating.create({
    data: {
      lot_id: lotIds[0],
      reviewer_id: citizenIds[0],
      reviewee_id: collectorIds[0],
      reviewer_role: 'CITIZEN',
      stars: data.ratings[0].stars,
      review_text: data.ratings[0].review_text
    }
  });

  await prisma.rating.create({
    data: {
      lot_id: lotIds[1],
      reviewer_id: citizenIds[1],
      reviewee_id: collectorIds[1],
      reviewer_role: 'CITIZEN',
      stars: data.ratings[1].stars,
      review_text: data.ratings[1].review_text
    }
  });

  await prisma.rating.create({
    data: {
      lot_id: lotIds[2],
      reviewer_id: recyclerIds[0],
      reviewee_id: collectorIds[2],
      reviewer_role: 'RECYCLER',
      stars: data.ratings[2].stars,
      review_text: data.ratings[2].review_text
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
