export interface LangText { en: string; pt: string }

export type CategoryKey = 'petiscos' | 'sides' | 'mains'

export interface MenuItem {
  id: string
  category: CategoryKey
  name: LangText
  description: LangText
  serves?: LangText
  price: number
  badge?: LangText
}

export const CATEGORIES: { key: CategoryKey; label: LangText }[] = [
  { key: 'petiscos', label: { en: 'Appetizers',  pt: 'Petiscos' } },
  { key: 'sides',    label: { en: 'Sides & Spreads', pt: 'Acompanhamentos' } },
  { key: 'mains',    label: { en: 'Main Dishes', pt: 'Pratos Principais' } },
]

const BADGE_SIGNATURE: LangText = { en: 'Signature',   pt: 'Assinatura' }
const BADGE_CHEF: LangText      = { en: "Chef's Recipe", pt: 'Receita do Chef' }
const BADGE_FAMILY: LangText    = { en: 'Family Size',  pt: 'Tamanho Família' }

export const MENU: MenuItem[] = [
  // ─── Appetizers ──────────────────────────────────────────────────────────
  {
    id: 'dadinho',
    category: 'petiscos',
    name: { en: 'Truffled Tapioca Bites', pt: 'Dadinho de Tapioca Trufado' },
    description: {
      en: 'Golden crispy tapioca bites infused with truffle flavors.',
      pt: 'Dadinhos crocantes de tapioca com toque de trufa.',
    },
    serves: { en: '24 pieces', pt: '24 unidades' },
    price: 29.90,
    badge: BADGE_SIGNATURE,
  },
  {
    id: 'coxinha',
    category: 'petiscos',
    name: { en: 'Creamy Chicken Coxinha', pt: 'Coxinha Cremosa' },
    description: {
      en: 'Classic Brazilian chicken croquettes with a creamy filling.',
      pt: 'Coxinhas brasileiras clássicas com recheio cremoso.',
    },
    serves: { en: '24 pieces', pt: '24 unidades' },
    price: 29.90,
  },
  {
    id: 'bolinha-queijo',
    category: 'petiscos',
    name: { en: 'Cheese Balls', pt: 'Bolinha de Queijo' },
    description: {
      en: 'Crispy golden cheese bites — a crowd favorite.',
      pt: 'Bolinhas de queijo douradas e crocantes — favoritas de todos.',
    },
    serves: { en: '24 pieces', pt: '24 unidades' },
    price: 29.90,
  },
  {
    id: 'mini-kibe',
    category: 'petiscos',
    name: { en: 'Mini Kibe', pt: 'Mini Kibe' },
    description: {
      en: 'Traditional Brazilian-Lebanese spiced beef bites.',
      pt: 'Mini kibes de carne temperada, tradição árabe-brasileira.',
    },
    serves: { en: '24 pieces', pt: '24 unidades' },
    price: 29.90,
  },
  {
    id: 'risole',
    category: 'petiscos',
    name: { en: 'Beef Risoles', pt: 'Risole de Carne' },
    description: {
      en: 'Crispy pastry filled with seasoned ground beef.',
      pt: 'Massa crocante recheada com carne moída temperada.',
    },
    serves: { en: '24 pieces', pt: '24 unidades' },
    price: 29.90,
  },

  // ─── Sides & Spreads ─────────────────────────────────────────────────────
  {
    id: 'caponata',
    category: 'sides',
    name: { en: 'Artisan Eggplant Caponata', pt: 'Caponata de Berinjela Artesanal' },
    description: {
      en: 'Slow-roasted eggplant, sweet peppers, garlic, green olives & golden raisins in extra virgin olive oil.',
      pt: 'Berinjela assada lentamente, pimentões, alho, azeitonas verdes e passas no azeite extra virgem.',
    },
    serves: { en: '1 lb', pt: '1 lb' },
    price: 29.90,
    badge: BADGE_CHEF,
  },

  // ─── Main Dishes ─────────────────────────────────────────────────────────
  {
    id: 'escondidinho-carne-p2',
    category: 'mains',
    name: { en: 'Shredded Beef Escondidinho', pt: 'Escondidinho de Carne Seca' },
    description: {
      en: 'Slow-cooked shredded beef, creamy mandioca purée & gratinated cheese.',
      pt: 'Carne seca desfiada, purê cremoso de mandioca e queijo gratinado.',
    },
    serves: { en: 'Serves 2', pt: 'Para 2 pessoas' },
    price: 39.00,
  },
  {
    id: 'escondidinho-carne-p8',
    category: 'mains',
    name: { en: 'Shredded Beef Escondidinho — Family', pt: 'Escondidinho de Carne Seca — Família' },
    description: {
      en: 'Slow-cooked shredded beef, creamy mandioca purée & gratinated cheese.',
      pt: 'Carne seca desfiada, purê cremoso de mandioca e queijo gratinado.',
    },
    serves: { en: 'Serves up to 8', pt: 'Para até 8 pessoas' },
    price: 119.00,
    badge: BADGE_FAMILY,
  },
  {
    id: 'escondidinho-camarao-p2',
    category: 'mains',
    name: { en: 'Jumbo Shrimp Escondidinho', pt: 'Escondidinho de Camarão Jumbo' },
    description: {
      en: 'Jumbo shrimp over creamy mandioca purée, gratinated to golden perfection.',
      pt: 'Camarão jumbo sobre purê cremoso de mandioca, gratinado à perfeição.',
    },
    serves: { en: 'Serves 2', pt: 'Para 2 pessoas' },
    price: 49.00,
  },
  {
    id: 'escondidinho-camarao-p8',
    category: 'mains',
    name: { en: 'Jumbo Shrimp Escondidinho — Family', pt: 'Escondidinho de Camarão Jumbo — Família' },
    description: {
      en: 'Jumbo shrimp over creamy mandioca purée, gratinated to golden perfection.',
      pt: 'Camarão jumbo sobre purê cremoso de mandioca, gratinado à perfeição.',
    },
    serves: { en: 'Serves up to 8', pt: 'Para até 8 pessoas' },
    price: 139.00,
    badge: BADGE_FAMILY,
  },
  {
    id: 'lasanha-bolonhesa',
    category: 'mains',
    name: { en: 'Bolognese Lasagna', pt: 'Lasanha Bolonhesa' },
    description: {
      en: 'Classic layers of fresh pasta, rich bolognese sauce & béchamel.',
      pt: 'Camadas de massa fresca, molho bolonhesa encorpado e béchamel.',
    },
    serves: { en: 'Family size', pt: 'Tamanho família' },
    price: 99.00,
    badge: BADGE_FAMILY,
  },
  {
    id: 'lasanha-gouda',
    category: 'mains',
    name: { en: 'Gouda & Parma Signature Lasagna', pt: 'Lasanha de Gouda com Crispy de Parma' },
    description: {
      en: 'Layers of fresh pasta, creamy gouda béchamel & crispy Parma prosciutto.',
      pt: 'Massa fresca, béchamel cremoso de gouda e crispy de presunto de Parma.',
    },
    serves: { en: 'Family size', pt: 'Tamanho família' },
    price: 119.00,
    badge: BADGE_SIGNATURE,
  },
  {
    id: 'camarao-gratinado',
    category: 'mains',
    name: { en: 'Jumbo Shrimp Signature Gratin', pt: 'Camarão Gratinado na Nata' },
    description: {
      en: 'Jumbo shrimp baked in a creamy parmesan sauce with a golden gratin finish.',
      pt: 'Camarão jumbo gratinado em molho cremoso de parmesão, com acabamento dourado.',
    },
    serves: { en: 'Family size', pt: 'Tamanho família' },
    price: 139.00,
    badge: BADGE_SIGNATURE,
  },
  {
    id: 'rubacao',
    category: 'mains',
    name: { en: 'Rubacão', pt: 'Rubacão' },
    description: {
      en: 'Traditional northeastern Brazilian dish — black-eyed peas, coalho cheese & butter.',
      pt: 'Prato tradicional nordestino — feijão verde, queijo coalho e manteiga de garrafa.',
    },
    serves: { en: 'Serves up to 8', pt: 'Serve até 8 pessoas' },
    price: 99.00,
    badge: BADGE_FAMILY,
  },
]

export const TAX_RATE = 0.065 // 6.5% Florida

// Delivery pricing (Uber-style, server-side only)
export const DELIVERY_BASE = 3.00
export const DELIVERY_PER_MILE = 1.75
export const DELIVERY_MINIMUM = 8.00
export const DELIVERY_MAX_MILES = 50
