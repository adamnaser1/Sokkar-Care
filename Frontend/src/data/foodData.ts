export interface FoodItem {
  id: string;
  name: string;
  category: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  gi: number;
  portion: string;
  glutenFree: boolean;
  emoji: string;
  imageUrl?: string;
}

// ─── FOOD ITEMS ──────────────────────────────────────────────────────────────

const foodItemsFr: FoodItem[] = [
  // FRUITS
  { id: 'f1', name: 'Banane', category: 'Fruits', carbs: 27, protein: 1.1, fat: 0.3, calories: 105, gi: 51, portion: '100g', glutenFree: true, emoji: '🍌', imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80&auto=format&fit=crop' },
  { id: 'f2', name: 'Pomme', category: 'Fruits', carbs: 14, protein: 0.3, fat: 0.2, calories: 52, gi: 36, portion: '100g', glutenFree: true, emoji: '🍎', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80&auto=format&fit=crop' },
  { id: 'f3', name: 'Orange', category: 'Fruits', carbs: 12, protein: 0.9, fat: 0.1, calories: 47, gi: 43, portion: '100g', glutenFree: true, emoji: '🍊', imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80&auto=format&fit=crop' },
  { id: 'f4', name: 'Raisin', category: 'Fruits', carbs: 18, protein: 0.7, fat: 0.2, calories: 69, gi: 59, portion: '100g', glutenFree: true, emoji: '🍇', imageUrl: 'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=400&q=80&auto=format&fit=crop' },
  { id: 'f5', name: 'Fraise', category: 'Fruits', carbs: 8, protein: 0.7, fat: 0.3, calories: 33, gi: 25, portion: '100g', glutenFree: true, emoji: '🍓', imageUrl: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=400&q=80&auto=format&fit=crop' },
  { id: 'f6', name: 'Pastèque', category: 'Fruits', carbs: 8, protein: 0.6, fat: 0.2, calories: 30, gi: 72, portion: '100g', glutenFree: true, emoji: '🍉', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRazjLVPU6jQPYeYoxm86XQe7y661T4MTXuhXzrljeEWHEFdX-DYleYVOHgWkvVJUIb9n-jaSEJz5WT2AuyVrZVbDAF2Vd7jc1MFZ8aiQM&s=10' },
  { id: 'f7', name: 'Mangue', category: 'Fruits', carbs: 15, protein: 0.8, fat: 0.4, calories: 60, gi: 51, portion: '100g', glutenFree: true, emoji: '🥭', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80&auto=format&fit=crop' },
  { id: 'f8', name: 'Dattes', category: 'Fruits', carbs: 75, protein: 1.8, fat: 0.2, calories: 277, gi: 42, portion: '100g', glutenFree: true, emoji: '🌴', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxclVjt6Yh1h6Cq4XuymBhm05YDIGNUDCM2FaOhWieYtkNXmy5MXU5ql0WhBeiPUWDF2S8Oqp6xctQOaVyYgypU42SKAH02s0uwci8ElE&s=10' },
  { id: 'f9', name: 'Myrtilles', category: 'Fruits', carbs: 14, protein: 0.7, fat: 0.3, calories: 57, gi: 25, portion: '100g', glutenFree: true, emoji: '🫐', imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80&auto=format&fit=crop' },
  { id: 'f10', name: 'Kiwi', category: 'Fruits', carbs: 15, protein: 1.1, fat: 0.5, calories: 61, gi: 39, portion: '100g', glutenFree: true, emoji: '🥝', imageUrl: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&q=80&auto=format&fit=crop' },
  // LÉGUMES
  { id: 'v1', name: 'Brocoli', category: 'Légumes', carbs: 7, protein: 2.8, fat: 0.4, calories: 34, gi: 15, portion: '100g', glutenFree: true, emoji: '🥦', imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80&auto=format&fit=crop' },
  { id: 'v2', name: 'Carotte', category: 'Légumes', carbs: 10, protein: 0.9, fat: 0.2, calories: 41, gi: 47, portion: '100g', glutenFree: true, emoji: '🥕', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80&auto=format&fit=crop' },
  { id: 'v3', name: 'Tomate', category: 'Légumes', carbs: 3.9, protein: 0.9, fat: 0.2, calories: 18, gi: 15, portion: '100g', glutenFree: true, emoji: '🍅', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3DRPxLp5XH4U1fUPLQwkWQn7fUd368gb2lUCx9qEKuUb5LhktbVpEcMTg_3EP_rx99pWkU_cdJ_ZETZlfswgCjwu5DhipxhHqNXYkPJ0&s=10&auto=format&fit=crop' },
  { id: 'v4', name: 'Épinards', category: 'Légumes', carbs: 3.6, protein: 2.9, fat: 0.4, calories: 23, gi: 15, portion: '100g', glutenFree: true, emoji: '🥬', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80&auto=format&fit=crop' },
  { id: 'v5', name: 'Courgette', category: 'Légumes', carbs: 3.1, protein: 1.2, fat: 0.3, calories: 17, gi: 15, portion: '100g', glutenFree: true, emoji: '🥒', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMYe3VtGPbTkOcS1bL7MsNydsSaFiToAfG_r3vqwPYcBkZ0GZNtbHEk2G2ymkYnYHiWp5Mr4y1WnnyxTuBjhjtAsPJTzT9gWHZrEffTA&s=10&q=80&auto=format&fit=crop' },
  { id: 'v6', name: 'Poivron', category: 'Légumes', carbs: 6, protein: 1, fat: 0.3, calories: 31, gi: 15, portion: '100g', glutenFree: true, emoji: '🫑', imageUrl: 'https://www.jaimefruitsetlegumes.ca/wp-content/uploads/2019/09/poivrons-Hans-Braxmeier-from-Pixabay-e1568384871652.jpg?w=400&q=80&auto=format&fit=crop' },
  { id: 'v7', name: 'Champignons', category: 'Légumes', carbs: 3.3, protein: 3.1, fat: 0.3, calories: 22, gi: 15, portion: '100g', glutenFree: true, emoji: '🍄', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9mL07n9Wem5xXu99GKtk0lXatmVmBTaa3_w&s?w=400&q=80&auto=format&fit=crop' },
  // PROTÉINES
  { id: 'p1', name: 'Poulet (blanc)', category: 'Protéines', carbs: 0, protein: 31, fat: 3.6, calories: 165, gi: 0, portion: '100g', glutenFree: true, emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80&auto=format&fit=crop' },
  { id: 'p2', name: 'Œuf', category: 'Protéines', carbs: 1.1, protein: 13, fat: 11, calories: 155, gi: 0, portion: '100g (2 œufs)', glutenFree: true, emoji: '🥚', imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80&auto=format&fit=crop' },
  { id: 'p3', name: 'Bœuf maigre', category: 'Protéines', carbs: 0, protein: 26, fat: 15, calories: 250, gi: 0, portion: '100g', glutenFree: true, emoji: '🥩', imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&q=80&auto=format&fit=crop' },
  { id: 'p4', name: 'Saumon', category: 'Protéines', carbs: 0, protein: 25, fat: 13, calories: 208, gi: 0, portion: '100g', glutenFree: true, emoji: '🐟', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80&auto=format&fit=crop' },
  { id: 'p5', name: 'Thon (conserve)', category: 'Protéines', carbs: 0, protein: 25, fat: 2, calories: 116, gi: 0, portion: '100g', glutenFree: true, emoji: '🐟', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqyalZmXCDtswMPNBBm-QOzDemcyDOCvP4Q&s?w=400&q=80&auto=format&fit=crop' },
  { id: 'p6', name: 'Amandes', category: 'Protéines', carbs: 6, protein: 21, fat: 49, calories: 579, gi: 15, portion: '100g', glutenFree: true, emoji: '🥜', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1f6_GYSvcUV8u6xHWxt1dwQNfiW3IBDlvfg&s?w=400&q=80&auto=format&fit=crop' },
  { id: 'p7', name: "Huile d'olive", category: 'Protéines', carbs: 0, protein: 0, fat: 100, calories: 884, gi: 0, portion: '100ml', glutenFree: true, emoji: '🫒', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format&fit=crop' },
  { id: 'p8', name: 'Lentilles', category: 'Protéines', carbs: 20, protein: 9, fat: 0.4, calories: 116, gi: 29, portion: '100g cuit', glutenFree: true, emoji: '🫘', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDAUUeoSpFBmvIsMR44phaL2V9hgXTADVVPg&s?w=400&q=80&auto=format&fit=crop' },
  { id: 'p9', name: 'Pois chiches', category: 'Protéines', carbs: 27, protein: 9, fat: 2.6, calories: 164, gi: 28, portion: '100g cuit', glutenFree: true, emoji: '🫘', imageUrl: 'https://www.terresunivia.fr/build/photos/cultures/pois-chiche/pois-chiche-cultures-01.76ac308c.jpg?w=400&q=80&auto=format&fit=crop' },
  // PRODUITS LAITIERS
  { id: 'l1', name: 'Yaourt nature', category: 'Produits laitiers', carbs: 4.7, protein: 3.5, fat: 3.3, calories: 61, gi: 36, portion: '100g', glutenFree: true, emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80&auto=format&fit=crop' },
  { id: 'l2', name: 'Yaourt grec', category: 'Produits laitiers', carbs: 3.6, protein: 9, fat: 5, calories: 97, gi: 11, portion: '100g', glutenFree: true, emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80&auto=format&fit=crop' },
  { id: 'l3', name: 'Lait entier', category: 'Produits laitiers', carbs: 5, protein: 3.2, fat: 3.6, calories: 64, gi: 27, portion: '100ml', glutenFree: true, emoji: '🥛', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format&fit=crop' },
  { id: 'l4', name: 'Feta', category: 'Produits laitiers', carbs: 4, protein: 14, fat: 21, calories: 264, gi: 0, portion: '100g', glutenFree: true, emoji: '🧀', imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80&auto=format&fit=crop' },
  // FÉCULENTS
  { id: 's1', name: 'Riz blanc', category: 'Féculents', carbs: 28, protein: 2.7, fat: 0.3, calories: 130, gi: 73, portion: '100g cuit', glutenFree: true, emoji: '🍚', imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80&auto=format&fit=crop' },
  { id: 's2', name: 'Riz complet', category: 'Féculents', carbs: 23, protein: 2.6, fat: 0.9, calories: 111, gi: 50, portion: '100g cuit', glutenFree: true, emoji: '🍚', imageUrl: 'https://cms-cdn.lafourche.fr/0db2557b-1fbc-44f8-a7c8-ef8c5c0ba7bb_Riz+brun+bio.jpg?w=400&q=80&auto=format&fit=crop' },
  { id: 's3', name: 'Pâtes', category: 'Féculents', carbs: 25, protein: 5, fat: 0.9, calories: 131, gi: 55, portion: '100g cuites', glutenFree: false, emoji: '🍝', imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80&auto=format&fit=crop' },
  { id: 's4', name: 'Pain blanc', category: 'Féculents', carbs: 49, protein: 9, fat: 3.2, calories: 265, gi: 75, portion: '100g', glutenFree: false, emoji: '🍞', imageUrl: 'https://www.pourquoidocteur.fr/media/article/istock-154198929-1535112067.jpg?w=400&q=80&auto=format&fit=crop' },
  { id: 's5', name: 'Pain complet', category: 'Féculents', carbs: 41, protein: 13, fat: 3.4, calories: 247, gi: 53, portion: '100g', glutenFree: false, emoji: '🍞', imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80&auto=format&fit=crop' },
  { id: 's6', name: 'Pomme de terre', category: 'Féculents', carbs: 17, protein: 2, fat: 0.1, calories: 77, gi: 78, portion: '100g cuite', glutenFree: true, emoji: '🥔', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80&auto=format&fit=crop' },
  { id: 's7', name: 'Avoine', category: 'Féculents', carbs: 66, protein: 17, fat: 7, calories: 389, gi: 40, portion: '100g', glutenFree: true, emoji: '🥣', imageUrl: 'https://www.bienmanger.com/tinyMceData/images/contents/557/content_lg.jpg?w=400&q=80&auto=format&fit=crop' },
  { id: 's8', name: 'Quinoa', category: 'Féculents', carbs: 39, protein: 8, fat: 6, calories: 222, gi: 35, portion: '100g cuit', glutenFree: true, emoji: '🌾', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&auto=format&fit=crop' },
];

const foodItemsAr: FoodItem[] = foodItemsFr.map(f => ({ ...f })).map(f => {
  const names: Record<string, string> = {
    'Banane': 'موز', 'Pomme': 'تفاح', 'Orange': 'برتقال', 'Raisin': 'عنب', 'Fraise': 'فراولة',
    'Pastèque': 'بطيخ', 'Mangue': 'مانجو', 'Dattes': 'تمر', 'Myrtilles': 'توت أزرق', 'Kiwi': 'كيوي',
    'Brocoli': 'بروكلي', 'Carotte': 'جزر', 'Tomate': 'طماطم', 'Épinards': 'سبانخ', 'Courgette': 'كوسا',
    'Poivron': 'فلفل', 'Champignons': 'فطر', 'Poulet (blanc)': 'دجاج (صدر)', 'Œuf': 'بيض',
    'Bœuf maigre': 'لحم بقر خالي الدهن', 'Saumon': 'سلمون', 'Thon (conserve)': 'تونة (معلبة)',
    'Amandes': 'لوز', "Huile d'olive": 'زيت زيتون', 'Lentilles': 'عدس', 'Pois chiches': 'حمص',
    'Yaourt nature': 'زبادي طبيعي', 'Yaourt grec': 'زبادي يوناني', 'Lait entier': 'حليب كامل الدسم',
    'Feta': 'جبن فيتا', 'Riz blanc': 'أرز أبيض', 'Riz complet': 'أرز بني', 'Pâtes': 'مكرونة',
    'Pain blanc': 'خبز أبيض', 'Pain complet': 'خبز أسمر', 'Pomme de terre': 'بطاطس',
    'Avoine': 'شوفان', 'Quinoa': 'كينوا',
  };
  const cats: Record<string, string> = {
    'Fruits': 'فواكه', 'Légumes': 'خضروات', 'Protéines': 'بروتينات',
    'Produits laitiers': 'ألبان', 'Féculents': 'نشويات',
  };
  return { ...f, name: names[f.name] || f.name, category: cats[f.category] || f.category };
});

// ─── RECIPES ─────────────────────────────────────────────────────────────────

export interface Recipe {
  id: string;
  name: string;
  category: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  time: number;
  emoji: string;
  imageUrl?: string;
  ingredients: string[];
  instructions: string[];
}

const recipesFr: Recipe[] = [
  // ── PETIT-DÉJEUNER ──
  {
    id: 'r1', name: 'Omelette aux Légumes', category: 'Petit-déjeuner',
    carbs: 6, protein: 14, fat: 12, calories: 210, time: 10, emoji: '🍳',
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80&auto=format&fit=crop',
    ingredients: ["2 œufs", "50g épinards frais", "30g champignons de Paris", "1 c.c. huile d'olive", "Sel, poivre noir"],
    instructions: ["Battre les œufs avec une pincée de sel et de poivre.", "Faire revenir les champignons tranchés 3 min à feu moyen.", "Ajouter les épinards et remuer jusqu'à ce qu'ils réduisent.", "Verser les œufs battus et cuire à feu doux 3-4 min.", "Replier l'omelette en deux et servir."],
  },
  {
    id: 'r2', name: "Porridge à l'Avoine", category: 'Petit-déjeuner',
    carbs: 28, protein: 8, fat: 5, calories: 190, time: 7, emoji: '🥣',
    imageUrl: 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=400&q=80&auto=format&fit=crop',
    ingredients: ["50g flocons d'avoine", "200ml lait d'amande non sucré", "1 c.c. graines de chia", "1 pincée de cannelle", "5 myrtilles fraîches"],
    instructions: ["Verser l'avoine et le lait dans une casserole.", "Chauffer à feu doux 5 min en remuant constamment.", "Retirer du feu, ajouter la cannelle et les graines de chia.", "Laisser épaissir 2 min et garnir de myrtilles."],
  },
  {
    id: 'r3', name: 'Yaourt Grec Fruits Rouges', category: 'Petit-déjeuner',
    carbs: 12, protein: 15, fat: 4, calories: 150, time: 5, emoji: '🫐',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80&auto=format&fit=crop',
    ingredients: ["150g yaourt grec 0%", "50g framboises fraîches", "30g myrtilles", "10g amandes effilées grillées", "1 filet de miel (optionnel)"],
    instructions: ["Verser le yaourt dans un bol profond.", "Disposer les framboises et les myrtilles sur le dessus.", "Parsemer les amandes effilées.", "Ajouter un filet de miel si souhaité."],
  },
  {
    id: 'r4', name: 'Toast Avocat Œuf Poché', category: 'Petit-déjeuner',
    carbs: 22, protein: 16, fat: 18, calories: 320, time: 12, emoji: '🥑',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&auto=format&fit=crop',
    ingredients: ["2 tranches de pain complet", "1 avocat mûr", "2 œufs", "1 c.s. jus de citron", "Piment d'Espelette, sel"],
    instructions: ["Porter de l'eau frémissante avec un peu de vinaigre.", "Casser les œufs un par un dans un ramequin.", "Glisser chaque œuf dans l'eau et pocher 3 min.", "Écraser l'avocat avec le citron, le sel et le piment.", "Tartiner le pain toasté, poser l'œuf poché dessus."],
  },
  {
    id: 'r5', name: 'Smoothie Vert Épinards', category: 'Petit-déjeuner',
    carbs: 20, protein: 5, fat: 3, calories: 130, time: 5, emoji: '🥤',
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80&auto=format&fit=crop',
    ingredients: ["100g épinards frais", "1 banane congelée", "200ml lait de coco léger", "1 c.c. gingembre râpé"],
    instructions: ["Placer tous les ingrédients dans le blender.", "Mixer 60 secondes à puissance maximale.", "Ajouter un peu d'eau si trop épais.", "Servir immédiatement bien frais."],
  },
  // ── DÉJEUNER ──
  {
    id: 'r6', name: 'Salade Méditerranéenne', category: 'Déjeuner',
    carbs: 18, protein: 12, fat: 15, calories: 280, time: 15, emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80&auto=format&fit=crop',
    ingredients: ["200g laitue romaine", "100g tomates cerises", "50g concombre", "1 œuf dur", "30g feta émiettée", "10ml huile d'olive extra vierge", "Origan séché"],
    instructions: ["Laver et essorer la laitue, déchirer en morceaux.", "Couper les tomates en deux et le concombre en rondelles.", "Faire cuire l'œuf dur 10 min, écaler et trancher.", "Assembler dans un saladier, ajouter la feta.", "Assaisonner d'huile d'olive et d'origan."],
  },
  {
    id: 'r7', name: 'Salade de Lentilles Vinaigrette', category: 'Déjeuner',
    carbs: 32, protein: 14, fat: 8, calories: 290, time: 15, emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&auto=format&fit=crop',
    ingredients: ["150g lentilles vertes cuites", "50g tomates cerises", "30g oignon rouge émincé", "1 c.s. moutarde à l'ancienne", "2 c.s. vinaigre de cidre", "1 c.s. huile d'olive", "Persil plat"],
    instructions: ["Mélanger moutarde, vinaigre et huile pour la vinaigrette.", "Rincer les lentilles et les égoutter soigneusement.", "Couper les tomates en deux, émincer l'oignon.", "Tout mélanger et laisser mariner 5 min.", "Garnir de persil plat haché."],
  },
  {
    id: 'r8', name: 'Wrap Légumes Grillés Houmous', category: 'Déjeuner',
    carbs: 25, protein: 10, fat: 9, calories: 230, time: 20, emoji: '🌯',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80&auto=format&fit=crop',
    ingredients: ["1 tortilla blé complet (30cm)", "50g houmous maison", "1/2 courgette en lanières", "1/2 poivron rouge en lanières", "Une poignée de pousses de roquette", "1 c.c. zaatar"],
    instructions: ["Faire griller les lanières de légumes dans une poêle huilée 5 min.", "Réchauffer légèrement la tortilla à sec à la poêle.", "Étaler l'houmous en laissant 2cm de bord.", "Disposer les légumes grillés et la roquette.", "Saupoudrer de zaatar, rouler fermement."],
  },
  {
    id: 'r9', name: 'Bowl Quinoa Poulet', category: 'Déjeuner',
    carbs: 35, protein: 30, fat: 8, calories: 340, time: 25, emoji: '🍜',
    imageUrl: 'https://img-3.journaldesfemmes.fr/jW0mAXE0MW2cd3W81obj6waQWlQ=/750x500/5eadecf1f14e4c548579ee48fde407bb/ccmcms-jdf/40004923.jpg?w=400&q=80&auto=format&fit=crop',
    ingredients: ["80g quinoa", "120g blanc de poulet", "50g concombre", "30g avocat en dés", "1 c.s. sauce soja légère", "1 c.c. sésame grillé"],
    instructions: ["Rincer et cuire le quinoa 15 min dans le double de son volume d'eau.", "Couper le poulet en dés et faire sauter à la poêle 8 min.", "Assaisonner avec la sauce soja.", "Monter le bowl : quinoa, poulet, concombre, avocat.", "Terminer avec le sésame grillé."],
  },
  {
    id: 'r10', name: 'Soupe de Carottes au Gingembre', category: 'Déjeuner',
    carbs: 18, protein: 2, fat: 5, calories: 130, time: 30, emoji: '🍵',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80&auto=format&fit=crop',
    ingredients: ["400g carottes", "1 oignon", "1 morceau de gingembre frais (2cm)", "600ml bouillon de légumes", "1 c.s. huile de coco", "Coriandre fraîche"],
    instructions: ["Éplucher et couper les carottes et l'oignon.", "Faire revenir l'oignon et le gingembre 3 min dans l'huile.", "Ajouter les carottes et le bouillon, porter à ébullition.", "Laisser mijoter 20 min jusqu'à ce que les carottes soient tendres.", "Mixer et garnir de coriandre fraîche."],
  },
  // ── DÎNER ──
  {
    id: 'r11', name: 'Poulet Grillé Légumes Rôtis', category: 'Dîner',
    carbs: 15, protein: 35, fat: 10, calories: 350, time: 35, emoji: '🍗',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80&auto=format&fit=crop',
    ingredients: ["150g filet de poulet", "100g brocoli en fleurettes", "1 poivron rouge", "80g courgette", "1 c.s. huile d'olive", "Herbes de Provence, ail en poudre"],
    instructions: ["Préchauffer le four à 200°C.", "Couper les légumes et les disposer sur une plaque.", "Assaisonner d'huile, d'herbes et d'ail en poudre.", "Enfourner les légumes 20 min en les retournant mi-cuisson.", "Griller le poulet à la poêle 6 min de chaque côté."],
  },
  {
    id: 'r12', name: 'Saumon Vapeur Brocoli', category: 'Dîner',
    carbs: 8, protein: 30, fat: 18, calories: 340, time: 20, emoji: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop',
    ingredients: ["150g pavé de saumon frais", "150g fleurettes de brocoli", "1 filet de jus de citron frais", "1 c.s. sauce soja légère", "Aneth fraîche"],
    instructions: ["Remplir le fond du cuiseur vapeur d'eau et porter à ébullition.", "Déposer le brocoli en bas et le saumon au-dessus.", "Cuire à la vapeur 15-18 min selon l'épaisseur.", "Arroser de citron et de sauce soja.", "Garnir d'aneth fraîche ciselée."],
  },
  {
    id: 'r13', name: 'Tajine Poulet Légumes', category: 'Dîner',
    carbs: 22, protein: 28, fat: 12, calories: 320, time: 50, emoji: '🫕',
    imageUrl: 'https://www.ceinfo.fr/image/exotique/tajine/tajine-poulet.jpg?w=400&q=80&auto=format&fit=crop',
    ingredients: ["200g morceaux de poulet", "1 courgette", "1 carotte", "1 tomate", "1 oignon", "1 c.c. ras el hanout", "1/2 c.c. curcuma", "1 c.s. huile d'olive"],
    instructions: ["Faire dorer les morceaux de poulet dans l'huile 5 min.", "Ajouter l'oignon et les épices, mélanger 2 min.", "Ajouter les légumes coupés en morceaux.", "Couvrir et laisser mijoter à feu doux 40 min.", "Ajuster l'assaisonnement et servir avec du pain complet."],
  },
  {
    id: 'r14', name: 'Soupe Minestrone', category: 'Dîner',
    carbs: 24, protein: 6, fat: 4, calories: 160, time: 35, emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80&auto=format&fit=crop',
    ingredients: ["200g légumes variés (carottes, céleri, courgettes)", "50g haricots blancs cuits", "400ml bouillon de légumes sans sel", "50g pâtes complètes", "1 c.c. huile d'olive", "Basilic frais"],
    instructions: ["Couper tous les légumes en petits dés réguliers.", "Faire revenir dans l'huile d'olive 3 min.", "Ajouter le bouillon et porter à ébullition.", "Ajouter les pâtes et les haricots, cuire 10 min.", "Servir garni de basilic frais."],
  },
  {
    id: 'r15', name: 'Poêlée de Tofu aux Légumes', category: 'Dîner',
    carbs: 14, protein: 18, fat: 11, calories: 240, time: 20, emoji: '🥘',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80&auto=format&fit=crop',
    ingredients: ["150g tofu ferme", "1 poivron", "80g champignons", "50g pousses de soja", "2 c.s. sauce soja allégée", "1 c.c. huile de sésame", "Graines de sésame"],
    instructions: ["Couper le tofu en cubes et le faire dorer 5 min dans l'huile.", "Ajouter les légumes coupés et sauter 5 min à feu vif.", "Verser la sauce soja et les pousses de soja.", "Mélanger 2 min et terminer avec l'huile de sésame.", "Parsemer de graines de sésame."],
  },
  // ── COLLATION ──
  {
    id: 'r16', name: 'Amandes et Noix Mix', category: 'Collation',
    carbs: 4, protein: 6, fat: 16, calories: 180, time: 1, emoji: '🥜',
    imageUrl: 'https://www.lanutrition.fr/sites/default/files/ressources/noix-noisettes-amandes-shutterstock_457818712-bd_0.jpg?w=400&q=80&auto=format&fit=crop',
    ingredients: ["15g amandes crues", "10g cerneaux de noix", "5g graines de courge"],
    instructions: ["Mélanger les fruits secs dans un petit bol.", "Consommer nature, sans sel ajouté.", "Idéal à 16h pour éviter les hypoglycémies."],
  },
  {
    id: 'r17', name: 'Houmous et Crudités', category: 'Collation',
    carbs: 10, protein: 4, fat: 6, calories: 120, time: 5, emoji: '🥕',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrTbh54tG_xFlcYlkBnjZbXKFbY_CR3__OHYoQVDiHh8RtKduMDvoR4ULhdoz-zL2Wns_UStnJwSgIaur551tnJCfzJP6vAz0t-0ZKO6t8jCQSmGsUwfJCY_rNt5__xiDGFUcqKSJ5cH0u/s1600/xHoumous+nature+et+crudit%25C3%25A9s+4.jpg?w=400&q=80&auto=format&fit=crop',
    ingredients: ["30g houmous nature", "1 carotte moyenne", "1/4 concombre", "1 branche de céleri"],
    instructions: ["Couper les légumes en fins bâtonnets.", "Disposer dans une boîte pour l'emporter.", "Tremper dans le houmous et déguster."],
  },
  {
    id: 'r18', name: "Pomme Beurre d'Amande", category: 'Collation',
    carbs: 18, protein: 3, fat: 8, calories: 150, time: 2, emoji: '🍏',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0zvEfExj4N9A67-Y_9YELNbMC_ckEvgG4_A&s?w=400&q=80&auto=format&fit=crop',
    ingredients: ["1 pomme Granny Smith", "1 c.s. beurre d'amande complet sans sucre"],
    instructions: ["Laver et couper la pomme en tranches régulières.", "Déposer une petite noisette de beurre d'amande sur chaque tranche.", "À consommer rapidement pour éviter l'oxydation."],
  },
  {
    id: 'r19', name: 'Bol de Fromage Blanc Graines', category: 'Collation',
    carbs: 8, protein: 12, fat: 5, calories: 130, time: 3, emoji: '🥣',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80&auto=format&fit=crop',
    ingredients: ["150g fromage blanc 0%", "1 c.c. graines de lin", "1 c.c. graines de chia", "5 amandes concassées", "Cannelle"],
    instructions: ["Verser le fromage blanc dans un bol.", "Ajouter les graines et les amandes.", "Saupoudrer de cannelle et déguster."],
  },
];

// ── Version arabe des recettes ──
const recipesAr: Recipe[] = recipesFr.map(r => {
  const names: Record<string, string> = {
    'Omelette aux Légumes': 'عجة الخضار', "Porridge à l'Avoine": 'عصيدة الشوفان',
    'Yaourt Grec Fruits Rouges': 'زبادي يوناني بالتوت', 'Toast Avocat Œuf Poché': 'توست أفوكادو مع بيض مسلوق',
    'Smoothie Vert Épinards': 'عصير السبانخ الأخضر', 'Salade Méditerranéenne': 'سلطة متوسطية',
    'Salade de Lentilles Vinaigrette': 'سلطة العدس بالخل', 'Wrap Légumes Grillés Houmous': 'راب الخضار المشوية بالحمص',
    'Bowl Quinoa Poulet': 'بول كينوا بالدجاج', 'Soupe de Carottes au Gingembre': 'شوربة الجزر بالزنجبيل',
    'Poulet Grillé Légumes Rôtis': 'دجاج مشوي مع خضار', 'Saumon Vapeur Brocoli': 'سلمون مبخر مع بروكلي',
    'Tajine Poulet Légumes': 'طاجن الدجاج بالخضار', 'Soupe Minestrone': 'شوربة مينسترون',
    'Poêlée de Tofu aux Légumes': 'مقلاة توفو مع الخضار', 'Amandes et Noix Mix': 'مزيج اللوز والجوز',
    'Houmous et Crudités': 'حمص مع الخضار الطازجة', "Pomme Beurre d'Amande": 'تفاح مع زبدة اللوز',
    'Bol de Fromage Blanc Graines': 'وعاء الجبن الأبيض بالبذور',
  };
  const cats: Record<string, string> = {
    'Petit-déjeuner': 'فطور', 'Déjeuner': 'غداء', 'Dîner': 'عشاء', 'Collation': 'وجبة خفيفة',
  };
  return { ...r, name: names[r.name] || r.name, category: cats[r.category] || r.category };
});

export const getFoodItems = (lang: string) => lang === 'ar' ? foodItemsAr : foodItemsFr;
export const getRecipes = (lang: string) => lang === 'ar' ? recipesAr : recipesFr;
export const foodCategoriesFallback = ['Tous', 'Fruits', 'Légumes', 'Protéines', 'Produits laitiers', 'Féculents', 'Sans gluten'];