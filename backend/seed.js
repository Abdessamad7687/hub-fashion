const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Catégories (upsert to avoid conflicts if they already exist)
  const men = await prisma.category.upsert({
    where: { name: "Homme" },
    update: {},
    create: { name: "Homme", description: "Vêtements pour hommes" }
  });
  const women = await prisma.category.upsert({
    where: { name: "Femme" },
    update: {},
    create: { name: "Femme", description: "Vêtements pour femmes" }
  });
  const kids = await prisma.category.upsert({
    where: { name: "Enfant" },
    update: {},
    create: { name: "Enfant", description: "Vêtements pour enfants" }
  });

  // Produits (check if they exist first)
  const existingProducts = await prisma.product.findMany({
    where: {
      name: {
        in: ["T-shirt basique", "Robe d'été", "Short enfant"]
      }
    }
  });

  if (existingProducts.length === 0) {
    await prisma.product.create({
      data: {
        name: "T-shirt basique",
        description: "T-shirt 100% coton pour homme",
        price: 19.99,
        stock: 100,
        gender: "HOMME",
        categoryId: men.id,
        images: { create: [{ url: "/placeholder.jpg" }] },
        sizes: { create: [{ size: "S" }, { size: "M" }, { size: "L" }] }
      }
    });
    await prisma.product.create({
      data: {
        name: "Robe d'été",
        description: "Robe légère pour femme",
        price: 39.99,
        stock: 50,
        gender: "FEMME",
        categoryId: women.id,
        images: { create: [{ url: "/placeholder.jpg" }] },
        sizes: { create: [{ size: "S" }, { size: "M" }, { size: "L" }] }
      }
    });
    await prisma.product.create({
      data: {
        name: "Short enfant",
        description: "Short confortable pour enfant",
        price: 14.99,
        stock: 80,
        gender: "ENFANT",
        categoryId: kids.id,
        images: { create: [{ url: "/placeholder.jpg" }] },
        sizes: { create: [{ size: "4A" }, { size: "6A" }, { size: "8A" }] }
      }
    });
  }

  // Utilisateurs avec mots de passe hashés (upsert to avoid conflicts)
  const adminPassword = await bcrypt.hash("adminpass", 10);
  const clientPassword = await bcrypt.hash("clientpass", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@eshop.com" },
    update: { 
      password: adminPassword,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User"
    },
    create: { 
      email: "admin@eshop.com", 
      password: adminPassword, 
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User"
    }
  });
  await prisma.user.upsert({
    where: { email: "client@eshop.com" },
    update: { 
      password: clientPassword,
      role: "CLIENT",
      firstName: "Client",
      lastName: "User"
    },
    create: { 
      email: "client@eshop.com", 
      password: clientPassword, 
      role: "CLIENT",
      firstName: "Client",
      lastName: "User"
    }
  });
}

main()
  .then(() => {
    console.log('Seed terminé !');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 