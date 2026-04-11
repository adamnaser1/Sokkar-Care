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

export const foodCategories = ['Tous', 'Fruits', 'Légumes', 'Protéines', 'Produits laitiers', 'Féculents', 'Sans gluten'];

export const foodItems: FoodItem[] = [
  { id: '1', name: 'Banane', category: 'Fruits', carbs: 27, protein: 1.1, fat: 0.3, calories: 105, gi: 51, portion: '100g', glutenFree: true, emoji: '🍌' },
  { id: '2', name: 'Pomme', category: 'Fruits', carbs: 14, protein: 0.3, fat: 0.2, calories: 52, gi: 36, portion: '100g', glutenFree: true, emoji: '🍎' },
  { id: '3', name: 'Orange', category: 'Fruits', carbs: 12, protein: 0.9, fat: 0.1, calories: 47, gi: 43, portion: '100g', glutenFree: true, emoji: '🍊' },
  { id: '4', name: 'Raisin', category: 'Fruits', carbs: 18, protein: 0.7, fat: 0.2, calories: 69, gi: 59, portion: '100g', glutenFree: true, emoji: '🍇' },
  { id: '5', name: 'Fraise', category: 'Fruits', carbs: 8, protein: 0.7, fat: 0.3, calories: 33, gi: 25, portion: '100g', glutenFree: true, emoji: '🍓' },
  { id: '6', name: 'Pastèque', category: 'Fruits', carbs: 8, protein: 0.6, fat: 0.2, calories: 30, gi: 72, portion: '100g', glutenFree: true, emoji: '🍉' },
  { id: '7', name: 'Mangue', category: 'Fruits', carbs: 15, protein: 0.8, fat: 0.4, calories: 60, gi: 51, portion: '100g', glutenFree: true, emoji: '🥭' },
  { id: '8', name: 'Dattes', category: 'Fruits', carbs: 75, protein: 1.8, fat: 0.2, calories: 277, gi: 42, portion: '100g', glutenFree: true, emoji: '🌴' },
  { id: '9', name: 'Figue', category: 'Fruits', carbs: 19, protein: 0.8, fat: 0.3, calories: 74, gi: 61, portion: '100g', glutenFree: true, emoji: '🫐' },
  { id: '10', name: 'Abricot', category: 'Fruits', carbs: 11, protein: 1.4, fat: 0.4, calories: 48, gi: 34, portion: '100g', glutenFree: true, emoji: '🍑' },

  { id: '11', name: 'Brocoli', category: 'Légumes', carbs: 7, protein: 2.8, fat: 0.4, calories: 34, gi: 15, portion: '100g', glutenFree: true, emoji: '🥦' },
  { id: '12', name: 'Carotte', category: 'Légumes', carbs: 10, protein: 0.9, fat: 0.2, calories: 41, gi: 47, portion: '100g', glutenFree: true, emoji: '🥕' },
  { id: '13', name: 'Tomate', category: 'Légumes', carbs: 3.9, protein: 0.9, fat: 0.2, calories: 18, gi: 15, portion: '100g', glutenFree: true, emoji: '🍅' },
  { id: '14', name: 'Épinards', category: 'Légumes', carbs: 3.6, protein: 2.9, fat: 0.4, calories: 23, gi: 15, portion: '100g', glutenFree: true, emoji: '🥬' },
  { id: '15', name: 'Concombre', category: 'Légumes', carbs: 3.6, protein: 0.7, fat: 0.1, calories: 16, gi: 15, portion: '100g', glutenFree: true, emoji: '🥒' },
  { id: '16', name: 'Poivron', category: 'Légumes', carbs: 6, protein: 1, fat: 0.3, calories: 31, gi: 15, portion: '100g', glutenFree: true, emoji: '🫑' },
  { id: '17', name: 'Courgette', category: 'Légumes', carbs: 3.1, protein: 1.2, fat: 0.3, calories: 17, gi: 15, portion: '100g', glutenFree: true, emoji: '🥒' },
  { id: '18', name: 'Aubergine', category: 'Légumes', carbs: 6, protein: 1, fat: 0.2, calories: 25, gi: 15, portion: '100g', glutenFree: true, emoji: '🍆' },
  { id: '19', name: 'Oignon', category: 'Légumes', carbs: 9.3, protein: 1.1, fat: 0.1, calories: 40, gi: 15, portion: '100g', glutenFree: true, emoji: '🧅' },
  { id: '20', name: 'Haricots verts', category: 'Légumes', carbs: 7, protein: 1.8, fat: 0.1, calories: 31, gi: 15, portion: '100g', glutenFree: true, emoji: '🫘' },

  { id: '21', name: 'Poulet (blanc)', category: 'Protéines', carbs: 0, protein: 31, fat: 3.6, calories: 165, gi: 0, portion: '100g', glutenFree: true, emoji: '🍗' },
  { id: '22', name: 'Œuf', category: 'Protéines', carbs: 1.1, protein: 13, fat: 11, calories: 155, gi: 0, portion: '100g (2 œufs)', glutenFree: true, emoji: '🥚' },
  { id: '23', name: 'Saumon', category: 'Protéines', carbs: 0, protein: 20, fat: 13, calories: 208, gi: 0, portion: '100g', glutenFree: true, emoji: '🐟' },
  { id: '24', name: 'Thon', category: 'Protéines', carbs: 0, protein: 30, fat: 1, calories: 130, gi: 0, portion: '100g', glutenFree: true, emoji: '🐠' },
  { id: '25', name: 'Bœuf maigre', category: 'Protéines', carbs: 0, protein: 26, fat: 15, calories: 250, gi: 0, portion: '100g', glutenFree: true, emoji: '🥩' },
  { id: '26', name: 'Lentilles', category: 'Protéines', carbs: 20, protein: 9, fat: 0.4, calories: 116, gi: 32, portion: '100g cuites', glutenFree: true, emoji: '🫘' },
  { id: '27', name: 'Pois chiches', category: 'Protéines', carbs: 27, protein: 9, fat: 2.6, calories: 164, gi: 28, portion: '100g cuits', glutenFree: true, emoji: '🫘' },
  { id: '28', name: 'Tofu', category: 'Protéines', carbs: 1.9, protein: 8, fat: 4.8, calories: 76, gi: 15, portion: '100g', glutenFree: true, emoji: '🧊' },

  { id: '29', name: 'Yaourt nature', category: 'Produits laitiers', carbs: 4.7, protein: 3.5, fat: 3.3, calories: 61, gi: 36, portion: '100g', glutenFree: true, emoji: '🥛' },
  { id: '30', name: 'Fromage blanc', category: 'Produits laitiers', carbs: 3.5, protein: 7, fat: 3.5, calories: 72, gi: 30, portion: '100g', glutenFree: true, emoji: '🧀' },
  { id: '31', name: 'Lait entier', category: 'Produits laitiers', carbs: 5, protein: 3.2, fat: 3.6, calories: 64, gi: 27, portion: '100ml', glutenFree: true, emoji: '🥛' },
  { id: '32', name: 'Lait d\'amande', category: 'Produits laitiers', carbs: 0.3, protein: 0.6, fat: 1.1, calories: 13, gi: 25, portion: '100ml', glutenFree: true, emoji: '🥛' },

  { id: '33', name: 'Riz blanc', category: 'Féculents', carbs: 28, protein: 2.7, fat: 0.3, calories: 130, gi: 73, portion: '100g cuit', glutenFree: true, emoji: '🍚' },
  { id: '34', name: 'Riz complet', category: 'Féculents', carbs: 23, protein: 2.6, fat: 0.9, calories: 111, gi: 50, portion: '100g cuit', glutenFree: true, emoji: '🍚' },
  { id: '35', name: 'Pâtes', category: 'Féculents', carbs: 25, protein: 5, fat: 0.9, calories: 131, gi: 55, portion: '100g cuites', glutenFree: false, emoji: '🍝' },
  { id: '36', name: 'Pain blanc', category: 'Féculents', carbs: 49, protein: 9, fat: 3.2, calories: 265, gi: 75, portion: '100g', glutenFree: false, emoji: '🍞' },
  { id: '37', name: 'Pain complet', category: 'Féculents', carbs: 41, protein: 13, fat: 3.4, calories: 247, gi: 53, portion: '100g', glutenFree: false, emoji: '🍞' },
  { id: '38', name: 'Pomme de terre', category: 'Féculents', carbs: 17, protein: 2, fat: 0.1, calories: 77, gi: 78, portion: '100g cuite', glutenFree: true, emoji: '🥔' },
  { id: '39', name: 'Patate douce', category: 'Féculents', carbs: 20, protein: 1.6, fat: 0.1, calories: 86, gi: 44, portion: '100g cuite', glutenFree: true, emoji: '🍠' },
  { id: '40', name: 'Semoule', category: 'Féculents', carbs: 23, protein: 3.6, fat: 0.2, calories: 112, gi: 65, portion: '100g cuite', glutenFree: false, emoji: '🥣' },
  { id: '41', name: 'Quinoa', category: 'Féculents', carbs: 21, protein: 4.4, fat: 1.9, calories: 120, gi: 53, portion: '100g cuit', glutenFree: true, emoji: '🥣' },
  { id: '42', name: 'Avoine', category: 'Féculents', carbs: 12, protein: 2.5, fat: 1.4, calories: 71, gi: 55, portion: '100g cuite', glutenFree: false, emoji: '🥣' },
  { id: '43', name: 'Couscous', category: 'Féculents', carbs: 23, protein: 3.8, fat: 0.2, calories: 112, gi: 65, portion: '100g cuit', glutenFree: false, emoji: '🥘' },
  { id: '44', name: 'Maïs', category: 'Féculents', carbs: 19, protein: 3.2, fat: 1.2, calories: 86, gi: 52, portion: '100g', glutenFree: true, emoji: '🌽' },

  { id: '45', name: 'Amandes', category: 'Protéines', carbs: 6, protein: 21, fat: 49, calories: 579, gi: 15, portion: '100g', glutenFree: true, emoji: '🥜' },
  { id: '46', name: 'Noix', category: 'Protéines', carbs: 7, protein: 15, fat: 65, calories: 654, gi: 15, portion: '100g', glutenFree: true, emoji: '🌰' },
  { id: '47', name: 'Avocat', category: 'Fruits', carbs: 9, protein: 2, fat: 15, calories: 160, gi: 15, portion: '100g', glutenFree: true, emoji: '🥑' },
  { id: '48', name: 'Huile d\'olive', category: 'Protéines', carbs: 0, protein: 0, fat: 100, calories: 884, gi: 0, portion: '100ml', glutenFree: true, emoji: '🫒' },
  { id: '49', name: 'Miel', category: 'Féculents', carbs: 82, protein: 0.3, fat: 0, calories: 304, gi: 58, portion: '100g', glutenFree: true, emoji: '🍯' },
  { id: '50', name: 'Chocolat noir 70%', category: 'Féculents', carbs: 46, protein: 7.8, fat: 43, calories: 598, gi: 22, portion: '100g', glutenFree: true, emoji: '🍫' },
];

export interface Recipe {
  id: string;
  name: string;
  carbs: number;
  protein: number;
  calories: number;
  time: number;
  emoji: string;
  ingredients: string[];
  instructions: string[];
}

export const recipes: Recipe[] = [
  {
    id: 'r1', name: 'Salade Méditerranéenne', carbs: 18, protein: 12, calories: 280, time: 15, emoji: '🥗',
    ingredients: ['200g laitue', '100g tomate', '50g concombre', '1 œuf dur', '30g feta', '10ml huile d\'olive'],
    instructions: ['Laver et couper la laitue.', 'Découper tomates et concombre en dés.', 'Faire cuire l\'œuf 10 min.', 'Assembler la salade, émietter la feta.', 'Arroser d\'huile d\'olive.'],
  },
  {
    id: 'r2', name: 'Poulet Grillé aux Légumes', carbs: 15, protein: 35, calories: 350, time: 30, emoji: '🍗',
    ingredients: ['150g blanc de poulet', '100g brocoli', '1 poivron', '50g courgette', '1 c.s. huile d\'olive', 'Épices au choix'],
    instructions: ['Couper le poulet en morceaux.', 'Découper les légumes.', 'Griller le poulet à la poêle 8 min.', 'Ajouter les légumes, cuire 10 min.', 'Assaisonner et servir.'],
  },
  {
    id: 'r3', name: 'Bowl Quinoa-Avocat', carbs: 35, protein: 15, calories: 420, time: 20, emoji: '🥑',
    ingredients: ['80g quinoa', '1/2 avocat', '100g épinards frais', '1 œuf poché', '50g tomate cerise', 'Graines de sésame'],
    instructions: ['Cuire le quinoa selon les instructions.', 'Laver les épinards.', 'Pocher l\'œuf 3 min dans l\'eau frémissante.', 'Assembler le bowl.', 'Garnir de graines de sésame.'],
  },
  {
    id: 'r4', name: 'Soupe de Lentilles', carbs: 30, protein: 18, calories: 290, time: 35, emoji: '🍲',
    ingredients: ['150g lentilles corail', '1 oignon', '2 carottes', '1 tomate', '1 c.c. cumin', '1L bouillon'],
    instructions: ['Faire revenir l\'oignon haché.', 'Ajouter les carottes en rondelles.', 'Ajouter lentilles, tomate et bouillon.', 'Cuire 25 min à feu doux.', 'Mixer et assaisonner.'],
  },
  {
    id: 'r5', name: 'Omelette aux Épinards', carbs: 4, protein: 22, calories: 250, time: 10, emoji: '🥚',
    ingredients: ['3 œufs', '50g épinards frais', '20g fromage râpé', 'Sel, poivre', '1 c.c. huile d\'olive'],
    instructions: ['Battre les œufs.', 'Faire revenir les épinards à la poêle.', 'Verser les œufs battus.', 'Parsemer de fromage.', 'Plier et servir.'],
  },
  {
    id: 'r6', name: 'Saumon au Four et Patate Douce', carbs: 25, protein: 28, calories: 380, time: 25, emoji: '🐟',
    ingredients: ['150g filet de saumon', '1 patate douce', '100g haricots verts', 'Jus de citron', 'Aneth'],
    instructions: ['Préchauffer le four à 200°C.', 'Couper la patate douce en frites.', 'Enfourner saumon et patate douce 20 min.', 'Cuire les haricots à la vapeur.', 'Servir avec citron et aneth.'],
  },
];
