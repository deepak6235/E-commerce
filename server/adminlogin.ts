import { DataSource } from 'typeorm';
import { Auth } from './src/auth/auth.entity';
import * as bcrypt from 'bcryptjs';


const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456789',
  database: 'ecommerce',
  entities: [Auth],
  synchronize: false,
});









async function seedAdmin() {
  await dataSource.initialize();

  const authRepo = dataSource.getRepository(Auth);


  const existing = await authRepo.findOne({ where: { username: 'admin' } });
  if (existing) {
    console.log('Admin already exists');
    return process.exit(0);
  }


  const hashedPassword = await bcrypt.hash('Admin@123', 10);


  const admin = authRepo.create({
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
  });

  await authRepo.save(admin);
  console.log('Admin user created successfully!');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
