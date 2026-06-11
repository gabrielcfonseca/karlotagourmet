export interface MenuItem {
  id: string
  category: string
  name: string
  nameEn?: string
  description: string
  serves?: string
  price: number
  badge?: string
}

export const MENU: MenuItem[] = [
  // ─── Appetizers ──────────────────────────────────────────────────────────
  {
    id: 'dadinho',
    category: 'Petiscos',
    name: 'Dadinho de Tapioca Trufado',
    nameEn: 'Truffled Tapioca Bites',
    description: 'Golden crispy tapioca bites infused with truffle flavors.',
    serves: '24 unidades',
    price: 29.90,
    badge: 'Signature',
  },
  {
    id: 'coxinha',
    category: 'Petiscos',
    name: 'Coxinha Cremosa',
    description: 'Classic Brazilian chicken croquettes with a creamy filling.',
    serves: '24 unidades',
    price: 29.90,
  },
  {
    id: 'bolinha-queijo',
    category: 'Petiscos',
    name: 'Bolinha de Queijo',
    description: 'Crispy golden cheese bites — a crowd favorite.',
    serves: '24 unidades',
    price: 29.90,
  },
  {
    id: 'mini-kibe',
    category: 'Petiscos',
    name: 'Mini Kibe',
    description: 'Traditional Brazilian-Lebanese spiced beef bites.',
    serves: '24 unidades',
    price: 29.90,
  },
  {
    id: 'risole',
    category: 'Petiscos',
    name: 'Risole de Carne',
    description: 'Crispy pastry filled with seasoned ground beef.',
    serves: '24 unidades',
    price: 29.90,
  },

  // ─── Spreads & Sides ─────────────────────────────────────────────────────
  {
    id: 'caponata',
    category: 'Acompanhamentos',
    name: 'Caponata de Berinjela Artesanal',
    nameEn: 'Artisan Eggplant Caponata',
    description: 'Slow-roasted eggplant, sweet peppers, garlic, green olives & golden raisins in extra virgin olive oil.',
    serves: '1 lb',
    price: 29.90,
    badge: 'Chef\'s Recipe',
  },

  // ─── Mains — Small ───────────────────────────────────────────────────────
  {
    id: 'escondidinho-carne-p2',
    category: 'Pratos Principais',
    name: 'Escondidinho de Carne Seca',
    nameEn: 'Escondidinho Nordestino Signature',
    description: 'Slow cooked shredded beef, creamy mandioca purée & gratinated cheese.',
    serves: 'Para 2 pessoas',
    price: 39.00,
  },
  {
    id: 'escondidinho-carne-p8',
    category: 'Pratos Principais',
    name: 'Escondidinho de Carne Seca — Family',
    nameEn: 'Escondidinho Nordestino Signature — Family',
    description: 'Slow cooked shredded beef, creamy mandioca purée & gratinated cheese.',
    serves: 'Para até 8 pessoas',
    price: 119.00,
    badge: 'Family Size',
  },
  {
    id: 'escondidinho-camarao-p2',
    category: 'Pratos Principais',
    name: 'Escondidinho de Camarão Jumbo',
    nameEn: 'Jumbo Shrimp Escondidinho',
    description: 'Jumbo shrimp over creamy mandioca purée, gratinated to golden perfection.',
    serves: 'Para 2 pessoas',
    price: 49.00,
  },
  {
    id: 'escondidinho-camarao-p8',
    category: 'Pratos Principais',
    name: 'Escondidinho de Camarão Jumbo — Family',
    nameEn: 'Jumbo Shrimp Signature Gratin — Family',
    description: 'Jumbo shrimp over creamy mandioca purée, gratinated to golden perfection.',
    serves: 'Para até 8 pessoas',
    price: 139.00,
    badge: 'Family Size',
  },
  {
    id: 'lasanha-bolonhesa',
    category: 'Pratos Principais',
    name: 'Lasanha Bolonhesa',
    description: 'Classic layers of fresh pasta, rich bolognese sauce & béchamel.',
    serves: 'Family size',
    price: 99.00,
    badge: 'Family Size',
  },
  {
    id: 'lasanha-gouda',
    category: 'Pratos Principais',
    name: 'Lasanha de Gouda com Crispy de Parma',
    nameEn: 'Gouda & Parma Signature Lasagna',
    description: 'Layers of fresh pasta, creamy gouda béchamel & crispy Parma prosciutto.',
    serves: 'Family size',
    price: 119.00,
    badge: 'Signature',
  },
  {
    id: 'camarao-gratinado',
    category: 'Pratos Principais',
    name: 'Camarão Gratinado na Nata',
    nameEn: 'Jumbo Shrimp Signature Gratin',
    description: 'Jumbo shrimp baked in a creamy parmesan sauce with a golden gratin finish.',
    serves: 'Family size',
    price: 139.00,
    badge: 'Signature',
  },
  {
    id: 'rubacao',
    category: 'Pratos Principais',
    name: 'Rubacão',
    description: 'Traditional northeastern Brazilian dish — black-eyed peas, coalho cheese & butter.',
    serves: 'Serve até 8 pessoas',
    price: 99.00,
    badge: 'Family Size',
  },
]

export const MENU_CATEGORIES = ['Petiscos', 'Acompanhamentos', 'Pratos Principais']

export const TAX_RATE = 0.065 // 6.5% Florida

// Delivery pricing (Uber-style, server-side only)
export const DELIVERY_BASE = 3.00
export const DELIVERY_PER_MILE = 1.75
export const DELIVERY_MINIMUM = 8.00
export const DELIVERY_MAX_MILES = 50
