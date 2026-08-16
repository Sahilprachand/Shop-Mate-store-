import { sql } from "../config/db.js";

const SAMPLE_PRODUCTS = [
  {
    name: "Premium Wireless Headphones",
    price: 299.99,
    category: "Electronics",
    stock: 24,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 159.99,
    category: "Electronics",
    stock: 15,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595225476474-89731ba07b19?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Smart Watch Pro",
    price: 249.99,
    category: "Electronics",
    stock: 0,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "4K Ultra HD Camera",
    price: 899.99,
    category: "Electronics",
    stock: 8,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1606986628253-05620e9b4640?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Minimalist Backpack",
    price: 79.99,
    category: "Fashion",
    stock: 42,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Wireless Gaming Mouse",
    price: 89.99,
    category: "Electronics",
    stock: 30,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1615663249857-6dd944a7ad46?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Smart Home Speaker",
    price: 159.99,
    category: "Home & Living",
    stock: 19,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "LED Gaming Monitor",
    price: 449.99,
    category: "Electronics",
    stock: 6,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Running Sneakers",
    price: 119.99,
    category: "Fashion",
    stock: 55,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    price: 44.99,
    category: "Home & Living",
    stock: 33,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1495439411047-eaf8e0e11f11?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Yoga Mat Pro",
    price: 39.99,
    category: "Sports",
    stock: 60,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=60",
    ],
  },
  {
    name: "Bestselling Novel Collection",
    price: 34.99,
    category: "Books",
    stock: 70,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=60",
    ],
  },
];

async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE order_items, orders, products RESTART IDENTITY CASCADE`;

    // insert all products
    for (const product of SAMPLE_PRODUCTS) {
      await sql`
        INSERT INTO products (name, price, image, images, category, stock, rating)
        VALUES (
          ${product.name},
          ${product.price},
          ${product.image},
          ${product.images},
          ${product.category},
          ${product.stock},
          ${product.rating}
        )
      `;
    }

    console.log("Database seeded successfully");
    process.exit(0); // success code
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // failure code
  }
}

seedDatabase();
