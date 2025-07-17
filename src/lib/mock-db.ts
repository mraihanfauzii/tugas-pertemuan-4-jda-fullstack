export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Ini adalah array global yang akan menyimpan pengguna terdaftar.
// Data akan hilang jika server Next.js di-restart.
export const mockUsers: User[] = [
  // Bisa menambahkan user default di sini untuk testing
  { id: "1", name: "Default User", email: "user@example.com", password: "password123" },
];

let nextUserId = 2;

export const getNextUserId = (): string => {
    return String(nextUserId++);
};

export const findUserByEmail = (email: string): User | undefined => {
    return mockUsers.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
};

export const addUser = (user: User): void => {
    mockUsers.push(user);
};

export const updateUser = (id: string, updatedData: Partial<Omit<User, 'id'>>): User | undefined => {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex > -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedData };
        return mockUsers[userIndex];
    }
    return undefined;
};

// Data Produk Dummy
export const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "DJI Flip",
    description: "DJI Flip - Camera Drone | Foldable Full-Coverage Propeller Guard | Under 249 g | 4K/60fps HDR Video - RC-N3.",
    price: 6000000,
    imageUrl: "/dji-flip.jpg",
  },
  {
    id: "prod2",
    name: "DJI Osmo Pocket 3",
    description: "Sensor : 1-inch CMOS, Layar : 2 inch OLED touchscreen, Resolusi Video Low-Light Video : 4K (16:9): 3840×2160@24/25/30fps - 1080p: 1920×1080@24/25/30fps.",
    price: 8000000,
    imageUrl: "/dji-osmo-pocket-3.png",
  },
  {
    id: "prod3",
    name: "Samsung Galaxy S24",
    description: "Samsung Galaxy S24 Basic, Processor : Exynos2400 for Galaxy, Size : 6,2 inch, Technology : Dynamic AMOLED 2X, 1-120Hz, Resolution : FHD+ (2340 X 1080), Rear Camera Resolution : 50 MP + 12 MP + 10 MP.",
    price: 9399000,
    imageUrl: "/samsung-s-24.jpg",
  },
  {
    id: "prod4",
    name: "Samsung Galaxy Tab 10 FE",
    description: "Samsung Galaxy Tab S10 FE adalah tablet AI terbaru dari Samsung yang menggabungkan performa handal, desain modern, dan fitur pintar untuk mendukung berbagai kebutuhan digital Anda. Ditenagai oleh prosesor Exynos 1580 dan dipadukan dengan RAM 8GB, tablet ini mampu memberikan kinerja yang mulus untuk berbagai aktivitas, mulai dari multitasking hingga hiburan. Dengan kapasitas penyimpanan internal 128GB, pengguna memiliki ruang yang cukup untuk menyimpan dokumen, aplikasi, dan media favorit mereka.",
    price: 8649000,
    imageUrl: "/samsung-tab-10-fe.jpg",
  },
];

export const findProductById = (id: string): Product | undefined => {
    return mockProducts.find(product => product.id === id);
};