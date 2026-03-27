import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { foodItems, foodCategories, recipes, FoodItem, Recipe } from '@/data/foodData';
import { useAppStore } from '@/store/useAppStore';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Clock } from 'lucide-react';

const FoodDatabase = () => {
  const incrementFoodsViewed = useAppStore(s => s.incrementFoodsViewed);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [view, setView] = useState<'foods' | 'recipes'>('foods');

  const filtered = foodItems.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Tous' || f.category === category || (category === 'Sans gluten' && f.glutenFree);
    return matchSearch && matchCat;
  });

  const openFood = (food: FoodItem) => {
    setSelectedFood(food);
    incrementFoodsViewed();
  };

  const giColor = (gi: number) => {
    if (gi <= 35) return 'text-success';
    if (gi <= 55) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-primary mb-4"
        >
          {view === 'foods' ? 'Base Alimentaire' : 'Recettes Saines'}
        </motion.h1>

        {/* Tab switch */}
        <div className="flex gap-2 mb-4">
          {(['foods', 'recipes'] as const).map(v => (
            <motion.button
              key={v}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(v)}
              className={`relative flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === v ? 'text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {view === v && (
                <motion.div
                  layoutId="food-tab"
                  className="absolute inset-0 bg-secondary rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{v === 'foods' ? 'Aliments' : 'Recettes'}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {view === 'foods' ? (
            <motion.div
              key="foods"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher aliments..."
                  className="pl-10"
                />
              </div>

              {/* Category filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {foodCategories.map(cat => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      category === cat ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Food Grid */}
              <div className="grid grid-cols-3 gap-2">
                {filtered.map((food, i) => (
                  <motion.button
                    key={food.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => openFood(food)}
                    className="p-3 rounded-2xl bg-card card-shadow text-center hover:bg-muted transition-colors"
                  >
                    <span className="text-3xl block mb-1">{food.emoji}</span>
                    <p className="text-xs font-semibold text-foreground truncate">{food.name}</p>
                    <p className="text-[10px] text-muted-foreground">{food.carbs}g gluc</p>
                    <p className={`text-[10px] font-medium ${giColor(food.gi)}`}>IG: {food.gi}</p>
                    <p className="text-[10px] text-muted-foreground">{food.calories} kcal</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              {recipes.map((recipe, i) => (
                <motion.button
                  key={recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="p-4 rounded-2xl bg-card card-shadow flex items-center gap-4 text-left hover:bg-muted transition-colors"
                >
                  <span className="text-4xl">{recipe.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{recipe.name}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{recipe.carbs}g gluc</span>
                      <span>{recipe.protein}g prot</span>
                      <span>{recipe.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {recipe.time} min
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Food Detail Dialog */}
      <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent className="max-w-sm">
          {selectedFood && (
            <>
              <DialogHeader>
                <DialogTitle className="text-primary flex items-center gap-2">
                  <span className="text-3xl">{selectedFood.emoji}</span> {selectedFood.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Portion standard : {selectedFood.portion}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Glucides', value: `${selectedFood.carbs}g`, color: 'text-secondary' },
                    { label: 'Protéines', value: `${selectedFood.protein}g`, color: 'text-foreground' },
                    { label: 'Lipides', value: `${selectedFood.fat}g`, color: 'text-foreground' },
                    { label: 'Calories', value: `${selectedFood.calories} kcal`, color: 'text-foreground' },
                  ].map((item, i) => (
                    <div key={i} className="p-2 rounded-xl bg-muted text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Indice Glycémique</p>
                  <p className={`text-2xl font-bold ${giColor(selectedFood.gi)}`}>{selectedFood.gi}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFood.gi <= 35 ? '🟢 Bas' : selectedFood.gi <= 55 ? '🟡 Moyen' : '🔴 Élevé'}
                  </p>
                </div>
                {selectedFood.glutenFree && (
                  <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success self-start">✓ Sans gluten</span>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-primary flex items-center gap-2">
                  <span className="text-3xl">{selectedRecipe.emoji}</span> {selectedRecipe.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 rounded-lg bg-muted">{selectedRecipe.carbs}g gluc</span>
                  <span className="px-2 py-1 rounded-lg bg-muted">{selectedRecipe.protein}g prot</span>
                  <span className="px-2 py-1 rounded-lg bg-muted">{selectedRecipe.calories} kcal</span>
                  <span className="px-2 py-1 rounded-lg bg-muted flex items-center gap-1"><Clock size={12} />{selectedRecipe.time}min</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Ingrédients</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i}>• {ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Instructions</h4>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodDatabase;
