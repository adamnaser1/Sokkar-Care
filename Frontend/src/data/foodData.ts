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
}

const foodItemsFr: FoodItem[] = [
  { id: '1', name: 'Banane', category: 'Fruits', carbs: 27, protein: 1.1, fat: 0.3, calories: 105, gi: 51, portion: '100g', glutenFree: true, emoji: '🍌' },
  { id: '2', name: 'Pomme', category: 'Fruits', carbs: 14, protein: 0.3, fat: 0.2, calories: 52, gi: 36, portion: '100g', glutenFree: true, emoji: '🍎' },
  { id: '3', name: 'Orange', category: 'Fruits', carbs: 12, protein: 0.9, fat: 0.1, calories: 47, gi: 43, portion: '100g', glutenFree: true, emoji: '🍊' },
  { id: '4', name: 'Raisin', category: 'Fruits', carbs: 18, protein: 0.7, fat: 0.2, calories: 69, gi: 59, portion: '100g', glutenFree: true, emoji: '🍇' },
  { id: '5', name: 'Fraise', category: 'Fruits', carbs: 8, protein: 0.7, fat: 0.3, calories: 33, gi: 25, portion: '100g', glutenFree: true, emoji: '🍓' },
  { id: '6', name: 'Pastèque', category: 'Fruits', carbs: 8, protein: 0.6, fat: 0.2, calories: 30, gi: 72, portion: '100g', glutenFree: true, emoji: '🍉' },
  { id: '7', name: 'Mangue', category: 'Fruits', carbs: 15, protein: 0.8, fat: 0.4, calories: 60, gi: 51, portion: '100g', glutenFree: true, emoji: '🥭' },
  { id: '8', name: 'Dattes', category: 'Fruits', carbs: 75, protein: 1.8, fat: 0.2, calories: 277, gi: 42, portion: '100g', glutenFree: true, emoji: '🌴' },
  { id: '11', name: 'Brocoli', category: 'Légumes', carbs: 7, protein: 2.8, fat: 0.4, calories: 34, gi: 15, portion: '100g', glutenFree: true, emoji: '🥦' },
  { id: '12', name: 'Carotte', category: 'Légumes', carbs: 10, protein: 0.9, fat: 0.2, calories: 41, gi: 47, portion: '100g', glutenFree: true, emoji: '🥕' },
  { id: '13', name: 'Tomate', category: 'Légumes', carbs: 3.9, protein: 0.9, fat: 0.2, calories: 18, gi: 15, portion: '100g', glutenFree: true, emoji: '🍅' },
  { id: '21', name: 'Poulet (blanc)', category: 'Protéines', carbs: 0, protein: 31, fat: 3.6, calories: 165, gi: 0, portion: '100g', glutenFree: true, emoji: '🍗' },
  { id: '22', name: 'Œuf', category: 'Protéines', carbs: 1.1, protein: 13, fat: 11, calories: 155, gi: 0, portion: '100g (2 œufs)', glutenFree: true, emoji: '🥚' },
  { id: '25', name: 'Bœuf maigre', category: 'Protéines', carbs: 0, protein: 26, fat: 15, calories: 250, gi: 0, portion: '100g', glutenFree: true, emoji: '🥩' },
  { id: '29', name: 'Yaourt nature', category: 'Produits laitiers', carbs: 4.7, protein: 3.5, fat: 3.3, calories: 61, gi: 36, portion: '100g', glutenFree: true, emoji: '🥛' },
  { id: '31', name: 'Lait entier', category: 'Produits laitiers', carbs: 5, protein: 3.2, fat: 3.6, calories: 64, gi: 27, portion: '100ml', glutenFree: true, emoji: '🥛' },
  { id: '33', name: 'Riz blanc', category: 'Féculents', carbs: 28, protein: 2.7, fat: 0.3, calories: 130, gi: 73, portion: '100g cuit', glutenFree: true, emoji: '🍚' },
  { id: '34', name: 'Riz complet', category: 'Féculents', carbs: 23, protein: 2.6, fat: 0.9, calories: 111, gi: 50, portion: '100g cuit', glutenFree: true, emoji: '🍚' },
  { id: '35', name: 'Pâtes', category: 'Féculents', carbs: 25, protein: 5, fat: 0.9, calories: 131, gi: 55, portion: '100g cuites', glutenFree: false, emoji: '🍝' },
  { id: '36', name: 'Pain blanc', category: 'Féculents', carbs: 49, protein: 9, fat: 3.2, calories: 265, gi: 75, portion: '100g', glutenFree: false, emoji: '🍞' },
  { id: '37', name: 'Pain complet', category: 'Féculents', carbs: 41, protein: 13, fat: 3.4, calories: 247, gi: 53, portion: '100g', glutenFree: false, emoji: '🍞' },
  { id: '38', name: 'Pomme de terre', category: 'Féculents', carbs: 17, protein: 2, fat: 0.1, calories: 77, gi: 78, portion: '100g cuite', glutenFree: true, emoji: '🥔' },
  { id: '45', name: 'Amandes', category: 'Protéines', carbs: 6, protein: 21, fat: 49, calories: 579, gi: 15, portion: '100g', glutenFree: true, emoji: '🥜' },
  { id: '48', name: 'Huile d\'olive', category: 'Protéines', carbs: 0, protein: 0, fat: 100, calories: 884, gi: 0, portion: '100ml', glutenFree: true, emoji: '🫒' },
];

const foodItemsAr: FoodItem[] = [
  { id: '1', name: 'موز', category: 'فواكه', carbs: 27, protein: 1.1, fat: 0.3, calories: 105, gi: 51, portion: '100غ', glutenFree: true, emoji: '🍌' },
  { id: '2', name: 'تفاح', category: 'فواكه', carbs: 14, protein: 0.3, fat: 0.2, calories: 52, gi: 36, portion: '100غ', glutenFree: true, emoji: '🍎' },
  { id: '3', name: 'برتقال', category: 'فواكه', carbs: 12, protein: 0.9, fat: 0.1, calories: 47, gi: 43, portion: '100غ', glutenFree: true, emoji: '🍊' },
  { id: '4', name: 'عنب', category: 'فواكه', carbs: 18, protein: 0.7, fat: 0.2, calories: 69, gi: 59, portion: '100غ', glutenFree: true, emoji: '🍇' },
  { id: '5', name: 'فراولة', category: 'فواكه', carbs: 8, protein: 0.7, fat: 0.3, calories: 33, gi: 25, portion: '100غ', glutenFree: true, emoji: '🍓' },
  { id: '6', name: 'بطيخ', category: 'فواكه', carbs: 8, protein: 0.6, fat: 0.2, calories: 30, gi: 72, portion: '100غ', glutenFree: true, emoji: '🍉' },
  { id: '7', name: 'مانجو', category: 'فواكه', carbs: 15, protein: 0.8, fat: 0.4, calories: 60, gi: 51, portion: '100غ', glutenFree: true, emoji: '🥭' },
  { id: '8', name: 'تمر', category: 'فواكه', carbs: 75, protein: 1.8, fat: 0.2, calories: 277, gi: 42, portion: '100غ', glutenFree: true, emoji: '🌴' },
  { id: '11', name: 'بروكلي', category: 'خضروات', carbs: 7, protein: 2.8, fat: 0.4, calories: 34, gi: 15, portion: '100غ', glutenFree: true, emoji: '🥦' },
  { id: '12', name: 'جزر', category: 'خضروات', carbs: 10, protein: 0.9, fat: 0.2, calories: 41, gi: 47, portion: '100غ', glutenFree: true, emoji: '🥕' },
  { id: '13', name: 'طماطم', category: 'خضروات', carbs: 3.9, protein: 0.9, fat: 0.2, calories: 18, gi: 15, portion: '100غ', glutenFree: true, emoji: '🍅' },
  { id: '21', name: 'دجاج (صدر)', category: 'بروتينات', carbs: 0, protein: 31, fat: 3.6, calories: 165, gi: 0, portion: '100غ', glutenFree: true, emoji: '🍗' },
  { id: '22', name: 'بيض', category: 'بروتينات', carbs: 1.1, protein: 13, fat: 11, calories: 155, gi: 0, portion: '100غ (بيضتان)', glutenFree: true, emoji: '🥚' },
  { id: '25', name: 'لحم بقر خالي من الدهن', category: 'بروتينات', carbs: 0, protein: 26, fat: 15, calories: 250, gi: 0, portion: '100غ', glutenFree: true, emoji: '🥩' },
  { id: '29', name: 'زبادي طبيعي', category: 'ألبان', carbs: 4.7, protein: 3.5, fat: 3.3, calories: 61, gi: 36, portion: '100غ', glutenFree: true, emoji: '🥛' },
  { id: '31', name: 'حليب كامل الدسم', category: 'ألبان', carbs: 5, protein: 3.2, fat: 3.6, calories: 64, gi: 27, portion: '100مل', glutenFree: true, emoji: '🥛' },
  { id: '33', name: 'أرز أبيض', category: 'نشويات', carbs: 28, protein: 2.7, fat: 0.3, calories: 130, gi: 73, portion: '100غ مطبوخ', glutenFree: true, emoji: '🍚' },
  { id: '34', name: 'أرز بني', category: 'نشويات', carbs: 23, protein: 2.6, fat: 0.9, calories: 111, gi: 50, portion: '100غ مطبوخ', glutenFree: true, emoji: '🍚' },
  { id: '35', name: 'مكرونة', category: 'نشويات', carbs: 25, protein: 5, fat: 0.9, calories: 131, gi: 55, portion: '100غ مطبوخة', glutenFree: false, emoji: '🍝' },
  { id: '36', name: 'خبز أبيض', category: 'نشويات', carbs: 49, protein: 9, fat: 3.2, calories: 265, gi: 75, portion: '100غ', glutenFree: false, emoji: '🍞' },
  { id: '37', name: 'خبز أسمر', category: 'نشويات', carbs: 41, protein: 13, fat: 3.4, calories: 247, gi: 53, portion: '100غ', glutenFree: false, emoji: '🍞' },
  { id: '38', name: 'بطاطس', category: 'نشويات', carbs: 17, protein: 2, fat: 0.1, calories: 77, gi: 78, portion: '100غ مطبوخة', glutenFree: true, emoji: '🥔' },
  { id: '45', name: 'لوز', category: 'بروتينات', carbs: 6, protein: 21, fat: 49, calories: 579, gi: 15, portion: '100غ', glutenFree: true, emoji: '🥜' },
  { id: '48', name: 'زيت زيتون', category: 'بروتينات', carbs: 0, protein: 0, fat: 100, calories: 884, gi: 0, portion: '100مل', glutenFree: true, emoji: '🫒' },
];

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
  {
    id: 'r1', name: 'Salade Méditerranéenne', category: 'Déjeuner', carbs: 18, protein: 12, fat: 15, calories: 280, time: 15, emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop',
    ingredients: ['200g laitue', '100g tomate', '50g concombre', '1 œuf dur', '30g feta', '10ml huile d\'olive'],
    instructions: ['Laver et couper la laitue.', 'Découper tomates et concombre en dés.', 'Faire cuire l\'œuf 10 min.', 'Assembler la salade, émietter la feta.', 'Arroser d\'huile d\'olive.'],
  },
  {
    id: 'r2', name: 'Poulet Grillé aux Légumes', category: 'Dîner', carbs: 15, protein: 35, fat: 10, calories: 350, time: 30, emoji: '🍗',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150g blanc de poulet', '100g brocoli', '1 poivron', '50g courgette', '1 c.s. huile d\'olive', 'Épices au choix'],
    instructions: ['Couper le poulet en morceaux.', 'Découper les légumes.', 'Griller le poulet à la poêle 8 min.', 'Ajouter les légumes, cuire 10 min.', 'Assaisonner et servir.'],
  },
  {
    id: 'r3', name: 'Omelette aux Légumes', category: 'Petit-déjeuner', carbs: 6, protein: 14, fat: 12, calories: 210, time: 10, emoji: '🍳',
    imageUrl: 'https://images.unsplash.com/photo-1510693208753-4b6d3969d2f5?q=80&w=400&auto=format&fit=crop',
    ingredients: ['2 œufs', '50g épinards', '30g champignons', '1 c.c. huile d\'olive', 'Sel et poivre'],
    instructions: ['Battre les œufs avec une pincée de sel.', 'Faire revenir les champignons dans la poêle.', 'Ajouter les épinards jusqu\'à ce qu\'ils réduisent.', 'Verser les œufs et cuire jusqu\'à consistance désirée.']
  },
  {
    id: 'r4', name: 'Porridge à l\'Avoine', category: 'Petit-déjeuner', carbs: 28, protein: 8, fat: 5, calories: 190, time: 5, emoji: '🥣',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop',
    ingredients: ['40g flocons d\'avoine', '200ml lait d\'amande s/s', '1 pincée de cannelle', '10g graines de chia'],
    instructions: ['Mélanger l\'avoine et le lait dans une casserole.', 'Cuire à feu doux pendant 5 min en remuant.', 'Retirer du feu, ajouter la cannelle et les graines de chia.', 'Laisser reposer 2 min avant de déguster.']
  },
  {
    id: 'r5', name: 'Yaourt Grec Fruits Rouges', category: 'Petit-déjeuner', carbs: 12, protein: 15, fat: 4, calories: 150, time: 5, emoji: '🫐',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150g yaourt grec nature', '50g framboises', '50g myrtilles', '10g amandes effilées'],
    instructions: ['Verser le yaourt dans un bol.', 'Ajouter les fruits rouges bien lavés.', 'Parsemer d\'amandes effilées.']
  },
  {
    id: 'r6', name: 'Salade de Lentilles', category: 'Déjeuner', carbs: 32, protein: 14, fat: 8, calories: 290, time: 15, emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150g lentilles cuites', '50g tomates cerises', '30g oignon rouge', '1 c.s. vinaigrette maison', 'Persil frais'],
    instructions: ['Rincer et égoutter les lentilles si en conserve.', 'Couper les tomates en deux et hacher finement l\'oignon.', 'Mélanger dans un saladier avec la vinaigrette.', 'Garnir de persil frais.']
  },
  {
    id: 'r7', name: 'Wrap Légumes Grillés', category: 'Déjeuner', carbs: 25, protein: 10, fat: 9, calories: 230, time: 20, emoji: '🌯',
    imageUrl: 'https://images.unsplash.com/photo-1587311100529-61b6ac4ad5a6?q=80&w=400&auto=format&fit=crop',
    ingredients: ['1 tortilla au blé complet', '50g houmous', '100g courgettes et poivrons', 'Une poignée de jeunes pousses'],
    instructions: ['Griller les légumes coupés en lanières à la poêle.', 'Étaler le houmous sur la tortilla.', 'Disposer les légumes et les jeunes pousses.', 'Rouler le wrap en serrant bien.']
  },
  {
    id: 'r8', name: 'Saumon Vapeur Brocoli', category: 'Dîner', carbs: 8, protein: 30, fat: 18, calories: 340, time: 20, emoji: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150g pavé de saumon', '150g fleurettes de brocoli', '1 filet de jus de citron', 'Sel et aneth'],
    instructions: ['Placer le saumon et le brocoli dans un cuiseur d\'vapeur.', 'Cuire pendant 15-20 min selon l\'épaisseur de la pièce.', 'Assaisonner avec le citron, le sel et l\'aneth fraîche, puis servir.']
  },
  {
    id: 'r9', name: 'Soupe Minestrone', category: 'Dîner', carbs: 24, protein: 6, fat: 4, calories: 160, time: 35, emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop',
    ingredients: ['200g légumes variés (carottes, céleri, courgettes)', '50g haricots blancs', 'Bouillon de légumes s/sel', '1 c.c. huile d\'olive'],
    instructions: ['Couper tous les légumes en petits dés.', 'Faire revenir dans l\'huile quelques minutes.', 'Ajouter les haricots et couvrir de bouillon.', 'Laisser mijoter 30 minutes jusqu\'à ce que les légumes soient tendres.']
  },
  {
    id: 'r10', name: 'Amandes et Noix', category: 'Collation', carbs: 4, protein: 6, fat: 16, calories: 180, time: 1, emoji: '🥜',
    imageUrl: 'https://images.unsplash.com/photo-1620619717751-6cd7be37cedd?q=80&w=400&auto=format&fit=crop',
    ingredients: ['15g amandes', '15g cerneaux de noix'],
    instructions: ['Prendre une petite poignée (env. 30g).', 'À consommer nature sans sel ajouté.']
  },
  {
    id: 'r11', name: 'Houmous et Crudités', category: 'Collation', carbs: 10, protein: 4, fat: 6, calories: 120, time: 5, emoji: '🥕',
    imageUrl: 'https://images.unsplash.com/photo-1616615707755-3855c82db617?q=80&w=400&auto=format&fit=crop',
    ingredients: ['30g houmous nature', '100g bâtonnets de carotte et concombre'],
    instructions: ['Couper les légumes en fins bâtonnets.', 'Tremper dans le houmous et déguster.']
  },
  {
    id: 'r12', name: 'Pomme Beurre d\'Amande', category: 'Collation', carbs: 18, protein: 3, fat: 8, calories: 150, time: 2, emoji: '🍏',
    imageUrl: 'https://images.unsplash.com/photo-1568285934594-5541c8880693?q=80&w=400&auto=format&fit=crop',
    ingredients: ['1 petite pomme', '1 c.s. beurre d\'amande sans sucre complet'],
    instructions: ['Couper la pomme en tranches.', 'Tartiner chaque tranche avec un peu de beurre d\'amande.']
  }
];

const recipesAr: Recipe[] = [
  {
    id: 'r1', name: 'سلطة متوسطية', category: 'غداء', carbs: 18, protein: 12, fat: 15, calories: 280, time: 15, emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop',
    ingredients: ['200غ خس', '100غ طماطم', '50غ خيار', '1 بيضة مسلوقة', '30غ جبن فيتا', '10مل زيت زيتون'],
    instructions: ['اغسل وقطع الخس.', 'قطع الطماطم والخيار إلى مكعبات.', 'اسلق البيضة لمدة 10 دقائق.', 'اجمع السلطة، وفتت جبن الفيتا.', 'رش زيت الزيتون.'],
  },
  {
    id: 'r2', name: 'دجاج مشوي مع خضروات', category: 'عشاء', carbs: 15, protein: 35, fat: 10, calories: 350, time: 30, emoji: '🍗',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150غ صدر دجاج', '100غ بروكلي', '1 فلفل', '50غ كوسا', '1 ملعقة زيت زيتون', 'بهارات حسب الرغبة'],
    instructions: ['قطع الدجاج إلى قطع.', 'قطع الخضار.', 'اشوِ الدجاج في مقلاة لمدة 8 دقائق.', 'أضف الخضار، واطبخ لمدة 10 دقائق.', 'تُتبّل وتقدّم.'],
  },
  {
    id: 'r3', name: 'عجة خضروات', category: 'فطور', carbs: 6, protein: 14, fat: 12, calories: 210, time: 10, emoji: '🍳',
    imageUrl: 'https://images.unsplash.com/photo-1510693208753-4b6d3969d2f5?q=80&w=400&auto=format&fit=crop',
    ingredients: ['2 بيض', '50غ سبانخ', '30غ فطر', '1 م.ص زيت زيتون', 'ملح وفلفل أسود'],
    instructions: ['اخفق البيض مع قليل من الملح.', 'اقلي الفطر في المقلاة.', 'أضف السبانخ حتى تذبل قليلاً.', 'صب البيض واطبخه حسب الرغبة.']
  },
  {
    id: 'r4', name: 'عصيدة الشوفان', category: 'فطور', carbs: 28, protein: 8, fat: 5, calories: 190, time: 5, emoji: '🥣',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop',
    ingredients: ['40غ شوفان', '200مل حليب لوز بدون سكر', 'رشة قرفة', '10غ بذور الشيا'],
    instructions: ['اخلط الشوفان والحليب في قدر.', 'اطبخه على نار هادئة لمدة 5 دقائق مع التحريك المستمر.', 'ارفعه عن النار وأضف القرفة وبذور الشيا.', 'دعه يرتاح دقيقتين قبل التقديم.']
  },
  {
    id: 'r5', name: 'زبادي يوناني وتوت', category: 'فطور', carbs: 12, protein: 15, fat: 4, calories: 150, time: 5, emoji: '🫐',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150غ زبادي يوناني سادة', '50غ توت عُليق', '50غ توت أزرق', '10غ شرائح لوز'],
    instructions: ['صب الزبادي في وعاء.', 'أضف التوت المغسول.', 'رُش شرائح اللوز فوقه.']
  },
  {
    id: 'r6', name: 'سلطة العدس', category: 'غداء', carbs: 32, protein: 14, fat: 8, calories: 290, time: 15, emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150غ عدس مسلوق', '50غ طماطم كرزية', '30غ بصل أحمر', '1 م.ك صلصة خل', 'بقدونس طازج'],
    instructions: ['اغسل العدس وصفّه إذا كان معلباً.', 'اقطع الطماطم الكرزية إلى أنصاف وافرم البصل ناعماً.', 'اخلط في وعاء كبير مع الصلصة.', 'زينه بالبقدونس الطازج.']
  },
  {
    id: 'r7', name: 'راب خضار مشوية', category: 'غداء', carbs: 25, protein: 10, fat: 9, calories: 230, time: 20, emoji: '🌯',
    imageUrl: 'https://images.unsplash.com/photo-1587311100529-61b6ac4ad5a6?q=80&w=400&auto=format&fit=crop',
    ingredients: ['خبز تورتيلا قمح كامل', '50غ حمص بالطحينة', '100غ كوسا وفلفل', 'حفنة صغيرة من الخضروات الورقية'],
    instructions: ['اشوِ الخضار المقطعة كشرائح في مقلاة.', 'افرد الحمص على خبز التورتيلا.', 'ضع الخضار والأوراق الخضراء.', 'لف الخبز بإحكام.']
  },
  {
    id: 'r8', name: 'سلمون وبروكلي بالبخار', category: 'عشاء', carbs: 8, protein: 30, fat: 18, calories: 340, time: 20, emoji: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop',
    ingredients: ['150غ شريحة سلمون', '150غ بروكلي', 'رشة عصير ليمون', 'ملح وشبت'],
    instructions: ['ضع السلمون والبروكلي في قدر الطهي بالبخار.', 'اطبخه لمدة 15 إلى 20 دقيقة.', 'تبّله بالليمون، الملح والشبت، ثم قدمه.']
  },
  {
    id: 'r9', name: 'حساء الخضار', category: 'عشاء', carbs: 24, protein: 6, fat: 4, calories: 160, time: 35, emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop',
    ingredients: ['200غ خضار متنوعة (جزر، كرفس، كوسا)', '50غ فاصوليا بيضاء', 'مرق خضار بدون ملح', '1 م.ص زيت زيتون'],
    instructions: ['قطع الخضار إلى مكعبات صغيرة.', 'قلّب الخضار في زيت الزيتون قليلاً.', 'أضف الفاصوليا ومرق الخضروات.', 'دعه يغلي ببطء لـ 30 دقيقة حتى تنضج الخضروات.']
  },
  {
    id: 'r10', name: 'لوز وجوز', category: 'وجبة خفيفة', carbs: 4, protein: 6, fat: 16, calories: 180, time: 1, emoji: '🥜',
    imageUrl: 'https://images.unsplash.com/photo-1620619717751-6cd7be37cedd?q=80&w=400&auto=format&fit=crop',
    ingredients: ['15غ لوز', '15غ جوز'],
    instructions: ['خذ حفنة صغيرة (حوالي 30غ).', 'تُستهلك طازجة بدون إضافة الملح.']
  },
  {
    id: 'r11', name: 'حمص وخضروات', category: 'وجبة خفيفة', carbs: 10, protein: 4, fat: 6, calories: 120, time: 5, emoji: '🥕',
    imageUrl: 'https://images.unsplash.com/photo-1616615707755-3855c82db617?q=80&w=400&auto=format&fit=crop',
    ingredients: ['30غ حمص طبيعي بالطحينة', '100غ أصابع جزر وخيار'],
    instructions: ['قطع الخضروات إلى شرائح رفيعة.', 'اغمس في الحمص واستمتع.']
  },
  {
    id: 'r12', name: 'تفاح وزبدة لوز', category: 'وجبة خفيفة', carbs: 18, protein: 3, fat: 8, calories: 150, time: 2, emoji: '🍏',
    imageUrl: 'https://images.unsplash.com/photo-1568285934594-5541c8880693?q=80&w=400&auto=format&fit=crop',
    ingredients: ['1 تفاحة صغيرة', '1 م.ك زبدة لوز طبيعية بدون سكر'],
    instructions: ['قطع التفاح إلى شرائح.', 'ادهن القليل من زبدة اللوز على كل شريحة.']
  }
];

export const getFoodItems = (lang: string) => lang === 'ar' ? foodItemsAr : foodItemsFr;
export const getRecipes = (lang: string) => lang === 'ar' ? recipesAr : recipesFr;
export const foodCategoriesFallback = ['Tous', 'Fruits', 'Légumes', 'Protéines', 'Produits laitiers', 'Féculents', 'Sans gluten'];
