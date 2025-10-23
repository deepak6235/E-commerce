import { DataSource } from 'typeorm';
import { Product } from './src/product/product.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456789',
  database: 'ecommerce',
  entities: [Product],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const productRepo = AppDataSource.getRepository(Product);

  const products = [
    {
      name: 'Nike Air Max',
      description: 'Comfortable running shoes',
      price: 5999,
      stock: 50,
      image: 'uploads/nike-air-max.jpg',
      category: 'Footwear',
    },
    {
      name: 'Adidas T-Shirt',
      description: 'Cotton sports t-shirt',
      price: 1299,
      stock: 100,
      image: 'uploads/adidas-tshirt.jpg',
      category: 'Clothing',
    },
    {
      name: 'Apple iPhone 15',
      description: 'Latest Apple iPhone 15',
      price: 99999,
      stock: 30,
      image: 'uploads/iphone15.jpg',
      category: 'Electronics',
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'Samsung flagship phone',
      price: 84999,
      stock: 40,
      image: 'uploads/galaxy-s23.jpg',
      category: 'Electronics',
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Noise-cancelling headphones',
      price: 24999,
      stock: 25,
      image: 'uploads/sony-headphones.jpg',
      category: 'Electronics',
    },
    {
      name: 'Levi’s Jeans',
      description: 'Slim fit denim jeans',
      price: 3499,
      stock: 60,
      image: 'uploads/levis-jeans.jpg',
      category: 'Clothing',
    },
    {
      name: 'Puma Sports Shoes',
      description: 'Running and training shoes',
      price: 3999,
      stock: 45,
      image: 'uploads/puma-shoes.jpg',
      category: 'Footwear',
    },
    {
      name: 'Canon EOS 90D',
      description: 'DSLR Camera for photography',
      price: 59999,
      stock: 15,
      image: 'uploads/canon-eos.jpg',
      category: 'Electronics',
    },
    {
      name: 'Dell Inspiron Laptop',
      description: '15-inch Windows laptop',
      price: 45999,
      stock: 20,
      image: 'uploads/dell-inspiron.jpg',
      category: 'Electronics',
    },
    {
      name: 'Reebok Hoodie',
      description: 'Warm and cozy hoodie',
      price: 1999,
      stock: 80,
      image: 'uploads/reebok-hoodie.jpg',
      category: 'Clothing',
    },
    {
      name: 'Ray-Ban Sunglasses',
      description: 'Stylish sunglasses',
      price: 7999,
      stock: 35,
      image: 'uploads/rayban.jpg',
      category: 'Accessories',
    },
    {
      name: 'Fossil Watch',
      description: 'Leather strap analog watch',
      price: 9999,
      stock: 25,
      image: 'uploads/fossil-watch.jpg',
      category: 'Accessories',
    },
    {
      name: 'HP DeskJet Printer',
      description: 'All-in-one printer',
      price: 4999,
      stock: 15,
      image: 'uploads/hp-printer.jpg',
      category: 'Electronics',
    },
    {
      name: 'Nike Socks Pack',
      description: 'Comfortable cotton socks',
      price: 499,
      stock: 100,
      image: 'uploads/nike-socks.jpg',
      category: 'Footwear',
    },
    {
      name: 'Adidas Cap',
      description: 'Sports cap for sunny days',
      price: 799,
      stock: 50,
      image: 'uploads/adidas-cap.jpg',
      category: 'Clothing',
    },
    {
      name: 'Logitech Mouse',
      description: 'Wireless ergonomic mouse',
      price: 1499,
      stock: 40,
      image: 'uploads/logitech-mouse.jpg',
      category: 'Electronics',
    },
    {
      name: 'Amazon Echo Dot',
      description: 'Smart speaker with Alexa',
      price: 3499,
      stock: 30,
      image: 'uploads/echo-dot.jpg',
      category: 'Electronics',
    },
    {
      name: 'KitchenAid Mixer',
      description: 'Stand mixer for baking',
      price: 12999,
      stock: 10,
      image: 'uploads/kitchenaid.jpg',
      category: 'Home Appliances',
    },
    {
      name: 'Nike Running Shorts',
      description: 'Lightweight shorts for running',
      price: 1299,
      stock: 70,
      image: 'uploads/nike-shorts.jpg',
      category: 'Clothing',
    },
    {
      name: 'Sony PlayStation 5',
      description: 'Next-gen gaming console',
      price: 49999,
      stock: 12,
      image: 'uploads/ps5.jpg',
      category: 'Electronics',
    },
  ];

  for (const product of products) {
    await productRepo.save(product);
  }

  console.log('✅ 20 products added to the database.');
  await AppDataSource.destroy();
}

seed().catch((err) => console.error(err));
